import { type User, type UserDirectory } from "../auth/user-directory.js";
import {
  APPROVED_CATEGORIES,
  FIELD_LIMITS,
  findCategory,
} from "../config/categories.js";
import {
  AuthorizationPolicy,
  type AuthorizationContext,
  type RequestAction,
} from "../authorization/authorization-policy.js";
import { RequestStatus } from "../domain/request-status.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "./errors.js";
import { RequestService } from "./request-service.js";
import {
  type HistoryEvent,
  type NewHistoryEvent,
  type RequestChanges,
  type RequestRecord,
  type RequestRepository,
  StaleRequestError,
} from "./request-repository.js";

export interface RequestView {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  requesterName: string;
  status: RequestStatus;
  ownerId: string | null;
  ownerName: string | null;
  dueDate: string | null;
  overdue: boolean;
  submittedAt: string;
}

export interface HistoryView {
  at: string;
  actorName: string;
  type: "Submitted" | "Status" | "Owner" | "Note" | "DueDate";
  text: string;
  visibleToRequester: boolean;
}

export interface Summary {
  open: number;
  overdue: number;
  resolved: number;
  closed: number;
  openWithoutDueDate: number;
}

export type Bucket = "open" | "overdue" | "resolved" | "closed";

const OPEN_STATUSES: readonly RequestStatus[] = [
  RequestStatus.SUBMITTED,
  RequestStatus.ACCEPTED,
  RequestStatus.IN_PROGRESS,
];
const OVERDUE_STATUSES: readonly RequestStatus[] = [
  RequestStatus.ACCEPTED,
  RequestStatus.IN_PROGRESS,
];
const BUCKETS: readonly string[] = ["open", "overdue", "resolved", "closed"];

const asText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

function parseStatus(value: unknown): RequestStatus | undefined {
  if (value === undefined || value === "") return undefined;
  if (Object.values(RequestStatus).includes(value as RequestStatus)) {
    return value as RequestStatus;
  }
  throw new ValidationError("Invalid status value");
}

/**
 * The use cases behind the API. Every operation asks the central
 * AuthorizationPolicy, using scope taken from the signed-in user's
 * server-side category grants and never from anything the client sends.
 */
export class RequestApplication {
  constructor(
    private readonly repository: RequestRepository,
    private readonly directory: UserDirectory,
    private readonly now: () => Date = () => new Date()
  ) {}

  // ---------- Requester ----------

  /** FR-001, FR-002 */
  async submit(principal: User, input: Record<string, unknown>): Promise<RequestView> {
    this.requireAllowed({ role: principal.role, action: "SUBMIT" });

    const title = asText(input.title);
    const description = asText(input.description);
    const categoryId = typeof input.categoryId === "string" ? input.categoryId : "";

    const fields: Record<string, string> = {};
    if (title.length < FIELD_LIMITS.titleMin || title.length > FIELD_LIMITS.titleMax) {
      fields.title = `Title must be ${FIELD_LIMITS.titleMin} to ${FIELD_LIMITS.titleMax} characters.`;
    }
    if (
      description.length < FIELD_LIMITS.descriptionMin ||
      description.length > FIELD_LIMITS.descriptionMax
    ) {
      fields.description = `Description must be ${FIELD_LIMITS.descriptionMin} to ${FIELD_LIMITS.descriptionMax} characters.`;
    }
    if (!findCategory(categoryId)) {
      fields.categoryId = "Choose a category from the list.";
    }
    if (Object.keys(fields).length > 0) {
      throw new ValidationError("Some fields need correcting", fields);
    }

    const record = await this.repository.create(
      {
        title,
        description,
        categoryId,
        requesterId: principal.id,
        submittedAt: this.now().toISOString(),
      },
      { kind: "SUBMITTED", actorId: principal.id, visibleToRequester: true, details: {} }
    );
    return this.view(record);
  }

  /** FR-003 */
  async listMine(principal: User): Promise<RequestView[]> {
    this.requireAllowed({ role: principal.role, action: "READ", ownsRequest: true });
    const records = await this.repository.listByRequester(principal.id);
    return records.map((record) => this.view(record));
  }

  // ---------- Staff ----------

  /** FR-005, FR-006, FR-012 */
  async listQueue(
    principal: User,
    filters: { categoryId?: string; status?: string; sort?: string }
  ): Promise<RequestView[]> {
    this.requireStaffWithGrants(principal);
    const records = await this.repository.listInCategories({
      categoryIds: principal.categoryIds,
      categoryId: filters.categoryId || undefined,
      status: parseStatus(filters.status),
      oldestFirst: filters.sort === "oldest",
    });
    return records.map((record) => this.view(record));
  }

  /** Staff who may take requests in a category (FR-007). Never lists staff of categories the caller cannot see. */
  async listStaff(principal: User, categoryId?: string): Promise<{ id: string; name: string }[]> {
    this.requireStaffWithGrants(principal);
    const categories = categoryId
      ? principal.categoryIds.filter((id) => id === categoryId)
      : principal.categoryIds;
    const seen = new Map<string, string>();
    for (const category of categories) {
      for (const person of this.directory.staffWithGrant(category)) {
        seen.set(person.id, person.name);
      }
    }
    return [...seen].map(([id, name]) => ({ id, name }));
  }

  /** FR-007: take or assign responsibility. The assignee must hold a grant for the request's category. */
  async assign(principal: User, id: string, assigneeId: unknown): Promise<RequestView> {
    const record = await this.load(principal, id);
    this.requireAction(principal, "ASSIGN", record);

    const assignee =
      typeof assigneeId === "string" ? this.directory.findById(assigneeId) : undefined;
    if (
      !assignee ||
      assignee.role !== "Staff" ||
      !assignee.categoryIds.includes(record.categoryId)
    ) {
      throw new ConflictError("That person cannot take this request");
    }
    if (record.ownerId === assignee.id) return this.view(record);

    const updated = await this.commit(
      record,
      { ownerId: assignee.id },
      {
        kind: "OWNER_CHANGED",
        actorId: principal.id,
        visibleToRequester: true,
        details: { previousOwnerId: record.ownerId, newOwnerId: assignee.id },
      }
    );
    return this.view(updated);
  }

  /**
   * FR-008. Ownership is read from the stored request, never from the caller
   * (the earlier `hasOwner` body flag is ignored: CR-007).
   */
  async changeStatus(
    principal: User,
    id: string,
    body: Record<string, unknown>
  ): Promise<{ id: string; status: RequestStatus }> {
    const record = await this.load(principal, id);
    this.requireAction(principal, "CHANGE_STATUS", record);

    const to = body.status;
    if (!Object.values(RequestStatus).includes(to as RequestStatus)) {
      throw new ValidationError("Invalid status value");
    }
    const target = to as RequestStatus;
    const reason = asText(body.rejectionReason);
    const resolution = asText(body.resolutionInformation);

    try {
      RequestService.changeStatus(
        { id: record.id, status: record.status },
        target,
        this.context(principal, "CHANGE_STATUS", record),
        {
          hasOwner: record.ownerId !== null,
          hasRejectionReason: reason.length > 0,
          hasResolutionInformation: resolution.length > 0,
        }
      );
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid request status transition") {
        throw new ConflictError("Invalid request status transition");
      }
      if (error instanceof Error && error.message === "Unauthorised status change") {
        throw new ForbiddenError();
      }
      throw error;
    }

    const updated = await this.commit(
      record,
      { status: target },
      {
        kind: "STATUS_CHANGED",
        actorId: principal.id,
        visibleToRequester: true,
        details: {
          from: record.status,
          to: target,
          ...(target === RequestStatus.REJECTED && { reason }),
          ...(target === RequestStatus.RESOLVED && { resolution }),
        },
      }
    );
    return { id: updated.id, status: updated.status };
  }

  /** FR-009: a note against the request, with author and time. */
  async addNote(principal: User, id: string, body: Record<string, unknown>): Promise<{ saved: true }> {
    const record = await this.load(principal, id);
    this.requireAction(principal, "RECORD_ACTION", record);

    const text = asText(body.text);
    if (text.length === 0) {
      throw new ValidationError("Write something first", { text: "A note cannot be empty." });
    }
    if (text.length > FIELD_LIMITS.noteMax) {
      throw new ValidationError("Some fields need correcting", {
        text: `A note can be at most ${FIELD_LIMITS.noteMax} characters.`,
      });
    }
    await this.repository.appendEvent(record.id, {
      kind: "NOTE_ADDED",
      actorId: principal.id,
      visibleToRequester: body.visibleToRequester === true,
      details: { text },
    });
    return { saved: true };
  }

  /** FR-009: an agreed due date, kept with its change history. */
  async setDueDate(principal: User, id: string, body: Record<string, unknown>): Promise<RequestView> {
    const record = await this.load(principal, id);
    this.requireAction(principal, "RECORD_ACTION", record);

    const when = typeof body.dueDate === "string" ? new Date(body.dueDate) : null;
    if (!when || Number.isNaN(when.getTime())) {
      throw new ValidationError("Choose a valid date", { dueDate: "Choose a valid date." });
    }
    const updated = await this.commit(
      record,
      { dueDate: when.toISOString() },
      {
        kind: "DUE_DATE_SET",
        actorId: principal.id,
        visibleToRequester: true,
        details: { previousDueDate: record.dueDate, newDueDate: when.toISOString() },
      }
    );
    return this.view(updated);
  }

  // ---------- Shared reads ----------

  /** A request outside the caller's scope gets exactly the answer a missing request gets. */
  async getRequest(principal: User, id: string): Promise<RequestView> {
    return this.view(await this.load(principal, id));
  }

  /** FR-004, FR-011. Requesters see only events marked for them. */
  async history(principal: User, id: string): Promise<HistoryView[]> {
    const record = await this.load(principal, id);
    const events = await this.repository.history(record.id);
    return events
      .filter((event) => principal.role !== "Requester" || event.visibleToRequester)
      .sort((a, b) => a.at.localeCompare(b.at))
      .map((event) => ({
        at: event.at,
        actorName: this.nameOf(event.actorId),
        type: this.typeOf(event),
        text: this.describe(event),
        visibleToRequester: event.visibleToRequester,
      }));
  }

  // ---------- Management ----------

  /** FR-010. Counts and lists come from the same permitted set, so they always agree. */
  async summary(
    principal: User,
    filters: { categoryId?: string; status?: string }
  ): Promise<Summary> {
    const records = await this.managementSet(principal, filters);
    const now = this.now();
    const open = records.filter((r) => OPEN_STATUSES.includes(r.status));
    return {
      open: open.length,
      overdue: records.filter((r) => this.isOverdue(r, now)).length,
      resolved: records.filter((r) => r.status === RequestStatus.RESOLVED).length,
      closed: records.filter((r) => r.status === RequestStatus.CLOSED).length,
      openWithoutDueDate: open.filter((r) => r.dueDate === null).length,
    };
  }

  async managementList(
    principal: User,
    filters: { categoryId?: string; status?: string; bucket?: string }
  ): Promise<RequestView[]> {
    if (filters.bucket && !BUCKETS.includes(filters.bucket)) {
      throw new ValidationError("Invalid bucket");
    }
    const records = await this.managementSet(principal, filters);
    const now = this.now();
    const picked = records.filter((r) => {
      switch (filters.bucket as Bucket | undefined) {
        case "open": return OPEN_STATUSES.includes(r.status);
        case "overdue": return this.isOverdue(r, now);
        case "resolved": return r.status === RequestStatus.RESOLVED;
        case "closed": return r.status === RequestStatus.CLOSED;
        default: return true;
      }
    });
    return picked.map((record) => this.view(record));
  }

  categories(): readonly { id: string; name: string }[] {
    return APPROVED_CATEGORIES;
  }

  // ---------- Internals ----------

  private context(principal: User, action: RequestAction, record: RequestRecord): AuthorizationContext {
    return {
      role: principal.role,
      action,
      ownsRequest: record.requesterId === principal.id,
      withinApprovedScope: principal.categoryIds.includes(record.categoryId),
    };
  }

  /** Loads a request only if the caller may read it. Missing and out-of-scope look identical. */
  private async load(principal: User, id: string): Promise<RequestRecord> {
    const record = await this.repository.findById(id);
    if (!record || !AuthorizationPolicy.isAllowed(this.context(principal, "READ", record))) {
      throw new NotFoundError();
    }
    return record;
  }

  private requireAction(principal: User, action: RequestAction, record: RequestRecord): void {
    if (!AuthorizationPolicy.isAllowed(this.context(principal, action, record))) {
      throw new ForbiddenError();
    }
  }

  private requireAllowed(context: AuthorizationContext): void {
    if (!AuthorizationPolicy.isAllowed(context)) throw new ForbiddenError();
  }

  /** Staff only, and only with at least one category grant: an empty set grants no access. */
  private requireStaffWithGrants(principal: User): void {
    if (principal.role !== "Staff") throw new ForbiddenError();
    this.requireAllowed({
      role: principal.role,
      action: "READ",
      withinApprovedScope: principal.categoryIds.length > 0,
    });
  }

  private async managementSet(
    principal: User,
    filters: { categoryId?: string; status?: string }
  ): Promise<RequestRecord[]> {
    this.requireAllowed({
      role: principal.role,
      action: "VIEW_REPORT",
      withinApprovedScope: principal.categoryIds.length > 0,
    });
    return this.repository.listInCategories({
      categoryIds: principal.categoryIds,
      categoryId: filters.categoryId || undefined,
      status: parseStatus(filters.status),
      oldestFirst: true,
    });
  }

  /** Writes the change with its event, turning a lost race into a clear 409. */
  private async commit(
    record: RequestRecord,
    changes: RequestChanges,
    event: NewHistoryEvent
  ): Promise<RequestRecord> {
    try {
      return await this.repository.update(record.id, record.version, changes, event);
    } catch (error) {
      if (error instanceof StaleRequestError) {
        throw new ConflictError("This request was changed by someone else. Reload and try again.");
      }
      throw error;
    }
  }

  /** Open and overdue: due strictly before now, and only Accepted or In Progress (AC-FR-010). */
  private isOverdue(record: RequestRecord, now: Date): boolean {
    return (
      record.dueDate !== null &&
      OVERDUE_STATUSES.includes(record.status) &&
      new Date(record.dueDate) < now
    );
  }

  private nameOf(userId: string): string {
    return this.directory.findById(userId)?.name ?? "";
  }

  private view(record: RequestRecord): RequestView {
    return {
      id: record.id,
      title: record.title,
      description: record.description,
      categoryId: record.categoryId,
      categoryName: findCategory(record.categoryId)?.name ?? "",
      requesterName: this.nameOf(record.requesterId),
      status: record.status,
      ownerId: record.ownerId,
      ownerName: record.ownerId ? this.nameOf(record.ownerId) : null,
      dueDate: record.dueDate,
      overdue: this.isOverdue(record, this.now()),
      submittedAt: record.submittedAt,
    };
  }

  private typeOf(event: HistoryEvent): HistoryView["type"] {
    switch (event.kind) {
      case "SUBMITTED": return "Submitted";
      case "STATUS_CHANGED": return "Status";
      case "OWNER_CHANGED": return "Owner";
      case "NOTE_ADDED": return "Note";
      case "DUE_DATE_SET": return "DueDate";
    }
  }

  /** Words an event for display. Old and new values appear for status and owner changes (AC-FR-011). */
  private describe(event: HistoryEvent): string {
    const d = event.details;
    switch (event.kind) {
      case "SUBMITTED":
        return "Request submitted.";
      case "STATUS_CHANGED": {
        let text = `Status changed from ${d.from} to ${d.to}.`;
        if (typeof d.reason === "string" && d.reason) text += ` Reason: ${d.reason}`;
        if (typeof d.resolution === "string" && d.resolution) text += ` Resolution: ${d.resolution}`;
        return text;
      }
      case "OWNER_CHANGED": {
        let text = `${this.nameOf(String(d.newOwnerId))} is now responsible for this request.`;
        if (typeof d.previousOwnerId === "string") {
          text += ` Previously: ${this.nameOf(d.previousOwnerId)}.`;
        }
        return text;
      }
      case "NOTE_ADDED":
        return String(d.text ?? "");
      case "DUE_DATE_SET":
        return `Due date set to ${String(d.newDueDate).slice(0, 10)}.`;
    }
  }
}
