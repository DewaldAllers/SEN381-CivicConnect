import { type UserDirectory } from "../auth/user-directory.js";
import { ValidationError } from "../application/errors.js";
import {
  RequestNotFoundError as ApplicationNotFoundError,
  StaleRequestError as ApplicationStaleRequestError,
  type HistoryEvent,
  type NewHistoryEvent,
  type NewRequest,
  type QueueFilter,
  type RepositoryPrincipal,
  type RequestChanges,
  type RequestRecord,
  type RequestRepository,
} from "../application/request-repository.js";
import {
  RequestNotFoundError as StoreNotFoundError,
  RequestStore,
  StaleRequestError as StoreStaleRequestError,
  type PersistentRequest,
  type Principal,
  type RequestEvent,
} from "./request-store.js";

function storePrincipal(principal: RepositoryPrincipal): Principal {
  return { id: principal.id, role: principal.role, categoryRefs: principal.categoryIds };
}
function record(value: PersistentRequest): RequestRecord {
  return {
    id: value.id,
    title: value.title,
    description: value.description,
    categoryId: value.categoryRef,
    requesterId: value.requesterRef,
    status: value.status,
    ownerId: value.responsibleRef,
    hasOwner: value.hasOwner,
    dueDate: value.dueAt?.toISOString() ?? null,
    submittedAt: value.submittedAt.toISOString(),
    version: value.version,
  };
}
function translateError(error: unknown): never {
  if (error instanceof Error && error.message === "Unapproved category") {
    throw new ValidationError("Choose an active approved category", { categoryId: "Choose a category from the list." });
  }
  if (error instanceof StoreNotFoundError || (error instanceof Error && error.name === "RequestNotFoundError")) {
    throw new ApplicationNotFoundError();
  }
  if (error instanceof StoreStaleRequestError || (error instanceof Error && error.name === "StaleRequestError")) {
    throw new ApplicationStaleRequestError();
  }
  throw error;
}
function historyEvent(value: RequestEvent): HistoryEvent | null {
  const details = value.details ?? {};
  let kind: HistoryEvent["kind"];
  let mapped: Record<string, unknown> = { ...details };
  switch (value.eventKind) {
    case "SUBMITTED":
      kind = "SUBMITTED";
      break;
    case "STATUS_CHANGED":
      kind = "STATUS_CHANGED";
      mapped = {
        ...mapped,
        from: value.previousStatus,
        to: value.newStatus,
      };
      break;
    case "OWNERSHIP_CHANGED":
      kind = "OWNER_CHANGED";
      mapped = details.ownershipChanged === true ? { ownershipChanged: true } : {
        previousOwnerId: typeof details.previousOwner === "string" ? details.previousOwner : null,
        newOwnerId: typeof details.newOwner === "string" ? details.newOwner : null,
      };
      break;
    case "WORK_RECORDED":
      if (details.kind !== "NOTE") return null;
      kind = "NOTE_ADDED";
      mapped = { text: typeof details.text === "string" ? details.text : "" };
      break;
    case "DUE_DATE_CHANGED":
      kind = "DUE_DATE_SET";
      mapped = {
        previousDueDate: details.previousDueAt ?? null,
        newDueDate: details.newDueAt ?? null,
      };
      break;
  }
  return {
    id: value.id,
    requestId: value.requestId,
    at: value.occurredAt.toISOString(),
    kind,
    actorId: value.actorRef ?? "",
    visibleToRequester: value.visibleToRequester,
    details: mapped,
  };
}

export class PostgresRequestRepository implements RequestRepository {
  constructor(
    private readonly store: RequestStore,
    private readonly directory: UserDirectory
  ) {}

  async create(principal: RepositoryPrincipal, input: NewRequest, event: NewHistoryEvent): Promise<RequestRecord> {
    try {
      if (principal.role !== "Requester" || input.requesterId !== principal.id || event.actorId !== principal.id) {
        throw new Error("Unauthorised operation");
      }
      return record(await this.store.submit(storePrincipal(principal), {
        categoryRef: input.categoryId,
        title: input.title,
        description: input.description,
        submittedAt: input.submittedAt,
      }));
    } catch (error) {
      return translateError(error);
    }
  }

  async findById(principal: RepositoryPrincipal, id: string): Promise<RequestRecord | null> {
    try {
      const found = await this.store.get(storePrincipal(principal), id);
      return found ? record(found) : null;
    } catch (error) {
      return translateError(error);
    }
  }

  async listByRequester(principal: RepositoryPrincipal, requesterId: string): Promise<RequestRecord[]> {
    if (principal.role !== "Requester" || principal.id !== requesterId) return [];
    try {
      return (await this.store.ownList(storePrincipal(principal))).map(record);
    } catch (error) {
      return translateError(error);
    }
  }

  async listInCategories(principal: RepositoryPrincipal, filter: QueueFilter): Promise<RequestRecord[]> {
    if (principal.role !== "Staff" && principal.role !== "Management") return [];
    const scopedCategories = principal.categoryIds.filter((id) => filter.categoryIds.includes(id));
    if (filter.categoryId !== undefined && !scopedCategories.includes(filter.categoryId)) return [];
    try {
      const results = await this.store.listForRepository({ ...storePrincipal(principal), categoryRefs: scopedCategories }, {
        ...(filter.categoryId ? { categoryRef: filter.categoryId } : {}),
        ...(filter.status ? { status: filter.status } : {}),
        sort: filter.oldestFirst ? "oldest" : "newest",
      });
      return results.map(record);
    } catch (error) {
      return translateError(error);
    }
  }

  async update(
    principal: RepositoryPrincipal,
    id: string,
    expectedVersion: number,
    changes: RequestChanges,
    event: NewHistoryEvent
  ): Promise<RequestRecord> {
    try {
      const keys = [changes.status !== undefined, changes.ownerId !== undefined, changes.dueDate !== undefined]
        .filter(Boolean).length;
      if (keys !== 1) throw new Error("Exactly one request field must be changed at a time");
      const base = { requestId: id, expectedVersion };
      let updated: PersistentRequest;
      if (changes.status !== undefined) {
        updated = await this.store.changeStatus(storePrincipal(principal), {
          ...base,
          to: changes.status,
          ...(typeof event.details.reason === "string" ? { reason: event.details.reason } : {}),
          ...(typeof event.details.resolution === "string" ? { resolution: event.details.resolution } : {}),
        });
      } else if (changes.ownerId !== undefined) {
        if (changes.ownerId === null) throw new Error("Unassigning a request is not supported");
        const user = this.directory.findById(changes.ownerId);
        if (!user) throw new Error("Ineligible assignee");
        updated = await this.store.assign(storePrincipal(principal), {
          ...base,
          assignee: { id: user.id, role: user.role, categoryRefs: user.categoryIds },
        });
      } else {
        const dueDate = changes.dueDate;
        updated = await this.store.setDueDate(storePrincipal(principal), {
          ...base,
          dueAt: dueDate === null ? null : new Date(dueDate as string),
        });
      }
      return record(updated);
    } catch (error) {
      return translateError(error);
    }
  }

  async appendEvent(principal: RepositoryPrincipal, id: string, expectedVersion: number, event: NewHistoryEvent): Promise<void> {
    try {
      if (event.actorId !== principal.id) throw new Error("Unauthorised operation");
      if (event.kind !== "NOTE_ADDED" || typeof event.details.text !== "string") {
        throw new Error("Only note events can use the atomic note path");
      }
      await this.store.appendRepositoryNote(
        storePrincipal(principal),
        id,
        expectedVersion,
        event.details.text,
        event.visibleToRequester
      );
    } catch (error) {
      return translateError(error);
    }
  }

  async history(principal: RepositoryPrincipal, requestId: string): Promise<HistoryEvent[]> {
    try {
      const events = await this.store.history(storePrincipal(principal), requestId);
      return events.map(historyEvent).filter((item): item is HistoryEvent => item !== null);
    } catch (error) {
      return translateError(error);
    }
  }
}
