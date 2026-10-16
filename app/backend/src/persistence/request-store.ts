import { randomUUID } from "node:crypto";
import { type UserRole } from "../authorization/authorization-policy.js";
import { RequestStatusPolicy } from "../domain/request-status-policy.js";
import { RequestStatus } from "../domain/request-status.js";
import { type Database, type SqlExecutor, type SqlRow } from "./database.js";

/** Construct from Liam's authenticated identity/grants, never from an HTTP body. */
export interface Principal {
  id: string;
  role: UserRole;
  categoryRefs: readonly string[];
}

export interface PersistentRequest {
  id: string;
  requesterRef: string;
  categoryRef: string;
  categoryName: string;
  title: string;
  description: string;
  status: RequestStatus;
  responsibleRef: string | null;
  hasOwner: boolean;
  dueAt: Date | null;
  submittedAt: Date;
  version: number;
}

export type EventKind = "SUBMITTED" | "STATUS_CHANGED" | "OWNERSHIP_CHANGED" | "WORK_RECORDED" | "DUE_DATE_CHANGED";
export interface RequestEvent {
  id: string;
  requestId: string;
  /** Staff/management retain the audit actor; requester views hide staff IDs. */
  actorRef: string | null;
  eventKind: EventKind;
  previousStatus: RequestStatus | null;
  newStatus: RequestStatus;
  details: Record<string, unknown>;
  visibleToRequester: boolean;
  occurredAt: Date;
}
export interface SubmitRequestInput {
  categoryRef: string;
  title: string;
  description: string;
  /** Only for controlled imports/test fixtures, not an HTTP body field. */
  id?: string;
  submittedAt?: Date | string;
}
export interface VersionedChange {
  requestId: string;
  expectedVersion: number;
}
export interface ChangeStatusInput extends VersionedChange {
  to: RequestStatus;
  reason?: string;
  resolution?: string;
}
export interface RequestFilters {
  categoryRef?: string;
  status?: RequestStatus;
  sort?: "oldest" | "newest";
}
export type ManagementBucket = "open" | "overdue" | "resolved" | "closed" | "openWithoutDueDate";
export type ManagementSummary = Record<ManagementBucket, number>;

interface RequestRow extends SqlRow {
  id: string; requester_ref: string; category_ref: string; category_name: string;
  title: string; description: string; status: RequestStatus;
  responsible_ref: string | null; due_at: Date | null; submitted_at: Date; version: number;
}
interface EventRow extends SqlRow {
  id: string; request_id: string; actor_ref: string; event_kind: EventKind;
  previous_status: RequestStatus | null; new_status: RequestStatus;
  details: Record<string, unknown>; visible_to_requester: boolean; occurred_at: Date;
}
interface ChangeEvent {
  kind: EventKind;
  details: Record<string, unknown>;
  visible?: boolean;
}

const columns = `r.id, r.requester_ref, r.category_ref, c.name AS category_name,
  r.title, r.description, r.status, r.responsible_ref, r.due_at, r.submitted_at, r.version`;
const from = "service_requests r JOIN request_categories c ON c.id = r.category_ref";
const open = "r.status IN ('Submitted', 'Accepted', 'In Progress')";

function nonBlank(value: string, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${field} is required`);
}
function role(principal: Principal, expected: UserRole): void {
  nonBlank(principal.id, "principal.id");
  if (principal.role !== expected) throw new Error("Unauthorised operation");
}
function scope(principal: Principal, values: unknown[]): string {
  nonBlank(principal.id, "principal.id");
  if (principal.role === "Requester") {
    values.push(principal.id);
    return `r.requester_ref = $${values.length}`;
  }
  if (principal.role === "Staff" || principal.role === "Management") {
    values.push([...principal.categoryRefs]);
    return `r.category_ref = ANY($${values.length}::text[])`;
  }
  throw new Error("Unauthorised operation");
}
function predicates(principal: Principal, filters: RequestFilters, values: unknown[]): string {
  const clauses = [scope(principal, values)];
  if (filters.categoryRef !== undefined) {
    values.push(filters.categoryRef);
    clauses.push(`r.category_ref = $${values.length}`);
  }
  if (filters.status !== undefined) {
    if (!Object.values(RequestStatus).includes(filters.status)) throw new Error("Invalid status filter");
    values.push(filters.status);
    clauses.push(`r.status = $${values.length}`);
  }
  return clauses.join(" AND ");
}
function toRequest(row: RequestRow, requesterView = false): PersistentRequest {
  return {
    id: row.id, requesterRef: row.requester_ref, categoryRef: row.category_ref,
    categoryName: row.category_name, title: row.title, description: row.description,
    status: row.status, responsibleRef: requesterView ? null : row.responsible_ref,
    hasOwner: row.responsible_ref !== null,
    dueAt: row.due_at ? new Date(row.due_at) : null,
    submittedAt: new Date(row.submitted_at), version: row.version,
  };
}
function toEvent(row: EventRow, requesterId?: string): RequestEvent {
  const requesterView = requesterId !== undefined;
  return {
    id: String(row.id), requestId: row.request_id,
    actorRef: requesterView && row.actor_ref !== requesterId ? null : row.actor_ref,
    eventKind: row.event_kind, previousStatus: row.previous_status, newStatus: row.new_status,
    details: requesterView && row.event_kind === "OWNERSHIP_CHANGED" ? { ownershipChanged: true } : row.details,
    visibleToRequester: row.visible_to_requester, occurredAt: new Date(row.occurred_at),
  };
}
export class StaleRequestError extends Error {
  constructor() { super("Request changed since it was read"); }
}
export class RequestNotFoundError extends Error {
  constructor() { super("Request not found"); }
}

export class RequestStore {
  constructor(private readonly database: Database) {}

  async categories(): Promise<{ id: string; name: string }[]> {
    const result = await this.database.query<{ id: string; name: string }>(
      "SELECT id, name FROM request_categories WHERE active = TRUE ORDER BY name"
    );
    return result.rows;
  }

  async submit(principal: Principal, input: SubmitRequestInput): Promise<PersistentRequest> {
    role(principal, "Requester");
    nonBlank(input.categoryRef, "categoryRef");
    nonBlank(input.title, "title");
    nonBlank(input.description, "description");
    const id = input.id ?? `REQ-${randomUUID()}`;
    nonBlank(id, "id");
    return this.database.transaction(async (client) => {
      const category = await client.query(
        "SELECT id FROM active_request_category($1)", [input.categoryRef]
      );
      if (!category.rows.length) throw new Error("Unapproved category");
      const submittedAt = input.submittedAt === undefined
        ? null
        : input.submittedAt instanceof Date
          ? input.submittedAt
          : new Date(input.submittedAt);
      if (submittedAt !== null && !Number.isFinite(submittedAt.getTime())) throw new Error("Invalid submittedAt");
      if (submittedAt === null) {
        await client.query(`INSERT INTO service_requests
          (id, requester_ref, category_ref, title, description, status) VALUES ($1, $2, $3, $4, $5, 'Submitted')`,
        [id, principal.id, input.categoryRef, input.title, input.description]);
      } else {
        await client.query(`INSERT INTO service_requests
          (id, requester_ref, category_ref, title, description, status, submitted_at) VALUES ($1, $2, $3, $4, $5, 'Submitted', $6)`,
        [id, principal.id, input.categoryRef, input.title, input.description, submittedAt]);
      }
      await client.query(`INSERT INTO request_events (request_id, actor_ref, event_kind, new_status)
        VALUES ($1, $2, 'SUBMITTED', 'Submitted')`, [id, principal.id]);
      return this.readInserted(client, id);
    });
  }

 async get( principal: Principal, requestId: string): Promise<PersistentRequest | null> {
    const values: unknown[] = [requestId];
    const allowed = scope(principal, values);
    const result = await this.database.query<RequestRow>(
      `SELECT ${columns} FROM ${from} WHERE r.id = $1 AND ${allowed}`, values
    );
    return result.rows[0] ? toRequest(result.rows[0], principal.role === "Requester") : null;
  }

  async ownList(principal: Principal): Promise<PersistentRequest[]> {
    role(principal, "Requester");
    return this.list(principal, { sort: "newest" });
  }
  async staffQueue(principal: Principal, filters: RequestFilters = {}): Promise<PersistentRequest[]> {
    role(principal, "Staff");
    return this.list(principal, filters);
  }
  private async list(principal: Principal, filters: RequestFilters): Promise<PersistentRequest[]> {
    if (filters.sort !== undefined && !["oldest", "newest"].includes(filters.sort)) throw new Error("Invalid sort");
    const values: unknown[] = [];
    const where = predicates(principal, filters, values);
    const direction = filters.sort === "newest" ? "DESC" : "ASC";
    const result = await this.database.query<RequestRow>(
      `SELECT ${columns} FROM ${from} WHERE ${where} ORDER BY r.submitted_at ${direction}, r.id`, values
    );
    return result.rows.map((row) => toRequest(row, principal.role === "Requester"));
  }

  async history(principal: Principal, requestId: string): Promise<RequestEvent[]> {
    const values: unknown[] = [requestId];
    const allowed = scope(principal, values);
    // Scope the actual history SQL as well as the existence check.
    if (!await this.get(principal, requestId)) throw new RequestNotFoundError();
    const visible = principal.role === "Requester" ? "AND e.visible_to_requester = TRUE" : "";
    const result = await this.database.query<EventRow>(`SELECT e.* FROM request_events e
      JOIN service_requests r ON r.id = e.request_id
      WHERE r.id = $1 AND ${allowed} ${visible} ORDER BY e.occurred_at, e.id`, values);
    return result.rows.map((row) => toEvent(row, principal.role === "Requester" ? principal.id : undefined));
  }
  async feedback(principal: Principal, requestId: string): Promise<RequestEvent[]> {
    role(principal, "Requester");
    return this.history(principal, requestId);
  }

  async changeStatus(principal: Principal, input: ChangeStatusInput): Promise<PersistentRequest> {
    return this.change(principal, input, async (client, current) => {
      const reason = input.reason?.trim();
      const resolution = input.resolution?.trim();
      if (!RequestStatusPolicy.canTransition(current.status, input.to, {
        hasOwner: current.responsible_ref !== null,
        hasRejectionReason: Boolean(reason), hasResolutionInformation: Boolean(resolution),
      })) throw new Error("Invalid request status transition");
      await client.query("UPDATE service_requests SET status = $2 WHERE id = $1", [input.requestId, input.to]);
      const details: Record<string, unknown> = {};
      if (input.to === RequestStatus.REJECTED) details.reason = reason;
      if (input.to === RequestStatus.RESOLVED) {
        details.resolution = resolution;
        await client.query(`INSERT INTO work_records (request_id, actor_ref, kind, text, visible_to_requester)
          VALUES ($1, $2, 'RESOLUTION', $3, TRUE)`, [input.requestId, principal.id, resolution]);
      }
      return { kind: "STATUS_CHANGED", details };
    });
  }

  /** Liam must load the assignee identity and grants from his trusted identity store. */
  async assign(principal: Principal, input: VersionedChange & { assignee: Principal }): Promise<PersistentRequest> {
    return this.change(principal, input, async (client, current) => {
      if ([RequestStatus.REJECTED, RequestStatus.CLOSED, RequestStatus.RESOLVED].includes(current.status)) {
        throw new Error("Ownership cannot change in this state");
      }
      nonBlank(input.assignee.id, "assignee.id");
      if (input.assignee.role !== "Staff" || !input.assignee.categoryRefs.includes(current.category_ref)) {
        throw new Error("Ineligible assignee");
      }
      await client.query("UPDATE service_requests SET responsible_ref = $2 WHERE id = $1", [input.requestId, input.assignee.id]);
      return { kind: "OWNERSHIP_CHANGED", details: { previousOwner: current.responsible_ref, newOwner: input.assignee.id } };
    });
  }

  async recordWork(principal: Principal, input: VersionedChange & {
    text: string; kind?: "ACTION" | "NOTE" | "RESOLUTION"; visibleToRequester?: boolean;
  }): Promise<PersistentRequest> {
    nonBlank(input.text, "text");
    const kind = input.kind ?? "NOTE";
    if (!["ACTION", "NOTE", "RESOLUTION"].includes(kind)) throw new Error("Invalid work record kind");
    return this.change(principal, input, async (client, current) => {
      if ([RequestStatus.REJECTED, RequestStatus.CLOSED].includes(current.status)) throw new Error("Request is terminal");
      const visible = input.visibleToRequester ?? false;
      const record = await client.query<{ id: string }>(`INSERT INTO work_records
        (request_id, actor_ref, kind, text, visible_to_requester) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [input.requestId, principal.id, kind, input.text, visible]);
      return { kind: "WORK_RECORDED", visible, details: { workRecordId: String(record.rows[0].id), kind, text: input.text } };
    });
  }

  async setDueDate(principal: Principal, input: VersionedChange & { dueAt: Date | null }): Promise<PersistentRequest> {
    if (input.dueAt !== null && (!(input.dueAt instanceof Date) || !Number.isFinite(input.dueAt.getTime()))) {
      throw new Error("Invalid due date");
    }
    return this.change(principal, input, async (client, current) => {
      if (![RequestStatus.ACCEPTED, RequestStatus.IN_PROGRESS].includes(current.status)) {
        throw new Error("Due dates require accepted work");
      }
      await client.query("UPDATE service_requests SET due_at = $2 WHERE id = $1", [input.requestId, input.dueAt]);
      return { kind: "DUE_DATE_CHANGED", details: {
        previousDueAt: current.due_at ? new Date(current.due_at).toISOString() : null,
        newDueAt: input.dueAt?.toISOString() ?? null,
      } };
    });
  }

  /** Repository adapter hook: list all records in the caller's trusted scope, including terminal statuses. */
  async listForRepository(principal: Principal, filters: RequestFilters = {}): Promise<PersistentRequest[]> {
    if (principal.role !== "Staff" && principal.role !== "Management") {
      throw new Error("Unauthorised operation");
    }
    return this.list(principal, filters);
  }

  /** Repository adapter hook sharing the versioned atomic work-record path. */
  async appendRepositoryNote(
    principal: Principal,
    requestId: string,
    expectedVersion: number,
    text: string,
    visibleToRequester: boolean
  ): Promise<void> {
    await this.recordWork(principal, { requestId, expectedVersion, text, kind: "NOTE", visibleToRequester });
  }

  async managementSummary(principal: Principal, filters: RequestFilters = {}, at = new Date()): Promise<ManagementSummary> {
    role(principal, "Management");
    const values: unknown[] = [];
    const where = predicates(principal, filters, values);
    values.push(at);
    const buckets = this.buckets(`$${values.length}`);
    const selection = Object.entries(buckets).map(([key, predicate]) => `COUNT(*) FILTER (WHERE ${predicate}) AS "${key}"`);
    const result = await this.database.query<SqlRow>(`SELECT ${selection.join(", ")} FROM service_requests r WHERE ${where}`, values);
    return Object.fromEntries(Object.keys(buckets).map((key) => [key, Number(result.rows[0][key])])) as ManagementSummary;
  }
  async managementList(principal: Principal, bucket: ManagementBucket, filters: RequestFilters = {}, at = new Date()): Promise<PersistentRequest[]> {
    role(principal, "Management");
    const values: unknown[] = [];
    const where = predicates(principal, filters, values);
    values.push(at);
    // Reference the time parameter for every bucket so pg can infer its type.
    const buckets = this.buckets(`$${values.length}::timestamptz`);
    if (!Object.hasOwn(buckets, bucket)) throw new Error("Invalid management bucket");
    const result = await this.database.query<RequestRow>(`SELECT ${columns} FROM ${from}
      WHERE ${where} AND (${buckets[bucket]}) AND $${values.length}::timestamptz IS NOT NULL
      ORDER BY r.submitted_at, r.id`, values);
    return result.rows.map((row) => toRequest(row));
  }
  private buckets(time: string): Record<ManagementBucket, string> {
    return {
      open,
      overdue: `r.status IN ('Accepted', 'In Progress') AND r.due_at < ${time}`,
      resolved: "r.status = 'Resolved'", closed: "r.status = 'Closed'",
      openWithoutDueDate: `${open} AND r.due_at IS NULL`,
    };
  }

  private async readInserted(client: SqlExecutor, id: string): Promise<PersistentRequest> {
    const result = await client.query<RequestRow>(`SELECT ${columns} FROM ${from} WHERE r.id = $1`, [id]);
    return toRequest(result.rows[0]);
  }
  private async change(principal: Principal, input: VersionedChange,
    work: (client: SqlExecutor, current: RequestRow) => Promise<ChangeEvent>): Promise<PersistentRequest> {
    role(principal, "Staff");
    if (!Number.isSafeInteger(input.expectedVersion) || input.expectedVersion < 0) {
      throw new Error("expectedVersion must be a non-negative integer");
    }
    return this.database.transaction(async (client) => {
      const values: unknown[] = [input.requestId];
      const allowed = scope(principal, values);
      const result = await client.query<RequestRow>(
        `SELECT ${columns} FROM ${from} WHERE r.id = $1 AND ${allowed} FOR UPDATE OF r`, values
      );
      const current = result.rows[0];
      if (!current) throw new RequestNotFoundError();
      if (current.version !== input.expectedVersion) throw new StaleRequestError();
      const event = await work(client, current);
      await client.query("UPDATE service_requests SET version = version + 1 WHERE id = $1", [input.requestId]);
      const updated = await this.readInserted(client, input.requestId);
      await client.query(`INSERT INTO request_events
        (request_id, actor_ref, event_kind, previous_status, new_status, details, visible_to_requester)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)`,
      [input.requestId, principal.id, event.kind, current.status, updated.status, JSON.stringify(event.details), event.visible ?? true]);
      return updated;
    });
  }
}
