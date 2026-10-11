import { randomUUID } from "node:crypto";

import { type AuthorizationContext } from "../authorization/authorization-policy.js";
import { RequestService } from "../application/request-service.js";
import { type StatusTransitionContext } from "../domain/request-status-policy.js";
import { RequestStatus } from "../domain/request-status.js";
import { type Database, type SqlRow } from "./database.js";

export interface PersistentRequest {
  id: string;
  requesterRef: string;
  categoryRef: string;
  title: string;
  description: string;
  status: RequestStatus;
  version: number;
}

export interface RequestEvent {
  id: string;
  requestId: string;
  actorRef: string;
  eventKind: "SUBMITTED" | "STATUS_CHANGED";
  previousStatus: RequestStatus | null;
  newStatus: RequestStatus;
  details: Record<string, unknown>;
  occurredAt: Date;
}

export interface SubmitRequestInput {
  requesterRef: string;
  categoryRef: string;
  title: string;
  description: string;
  /** Caller may provide a reference only for controlled imports/tests. */
  id?: string;
}

export interface ChangeStatusInput {
  requestId: string;
  expectedVersion: number;
  to: RequestStatus;
  actorRef: string;
  authorization: AuthorizationContext;
  transition?: StatusTransitionContext;
  details?: Record<string, unknown>;
}

interface RequestRow extends SqlRow {
  id: string;
  requester_ref: string;
  category_ref: string;
  title: string;
  description: string;
  status: RequestStatus;
  version: number;
}

interface EventRow extends SqlRow {
  id: string;
  request_id: string;
  actor_ref: string;
  event_kind: "SUBMITTED" | "STATUS_CHANGED";
  previous_status: RequestStatus | null;
  new_status: RequestStatus;
  details: Record<string, unknown>;
  occurred_at: Date;
}

const requestColumns = "id, requester_ref, category_ref, title, description, status, version";

function requireNonBlank(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${field} is required`);
  }
}

function toRequest(row: RequestRow): PersistentRequest {
  return {
    id: row.id,
    requesterRef: row.requester_ref,
    categoryRef: row.category_ref,
    title: row.title,
    description: row.description,
    status: row.status,
    version: row.version,
  };
}

function toEvent(row: EventRow): RequestEvent {
  return {
    id: String(row.id),
    requestId: row.request_id,
    actorRef: row.actor_ref,
    eventKind: row.event_kind,
    previousStatus: row.previous_status,
    newStatus: row.new_status,
    details: row.details,
    occurredAt: new Date(row.occurred_at),
  };
}

export class StaleRequestError extends Error {
  constructor() {
    super("Request changed since it was read");
  }
}

export class RequestNotFoundError extends Error {
  constructor() {
    super("Request not found");
  }
}

/** Internal persistence boundary; HTTP identity/scope enforcement remains Liam's work. */
export class RequestStore {
  constructor(private readonly database: Database) {}

  async submit(input: SubmitRequestInput): Promise<PersistentRequest> {
    requireNonBlank(input.requesterRef, "requesterRef");
    requireNonBlank(input.categoryRef, "categoryRef");
    requireNonBlank(input.title, "title");
    requireNonBlank(input.description, "description");
    const id = input.id ?? `REQ-${randomUUID()}`;
    requireNonBlank(id, "id");

    return this.database.transaction(async (client) => {
      const inserted = await client.query<RequestRow>(
        `INSERT INTO service_requests
          (id, requester_ref, category_ref, title, description, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING ${requestColumns}`,
        [id, input.requesterRef, input.categoryRef, input.title, input.description, RequestStatus.SUBMITTED]
      );
      await client.query(
        `INSERT INTO request_events (request_id, actor_ref, event_kind, new_status)
         VALUES ($1, $2, 'SUBMITTED', $3)`,
        [id, input.requesterRef, RequestStatus.SUBMITTED]
      );
      return toRequest(inserted.rows[0]);
    });
  }

  async changeStatus(input: ChangeStatusInput): Promise<PersistentRequest> {
    requireNonBlank(input.actorRef, "actorRef");
    if (!Number.isSafeInteger(input.expectedVersion) || input.expectedVersion < 0) {
      throw new Error("expectedVersion must be a non-negative integer");
    }

    return this.database.transaction(async (client) => {
      const selected = await client.query<RequestRow>(
        `SELECT ${requestColumns} FROM service_requests WHERE id = $1 FOR UPDATE`,
        [input.requestId]
      );
      const current = selected.rows[0];
      if (!current) throw new RequestNotFoundError();
      if (current.version !== input.expectedVersion) throw new StaleRequestError();

      RequestService.changeStatus(
        { id: current.id, status: current.status },
        input.to,
        input.authorization,
        input.transition
      );

      const updated = await client.query<RequestRow>(
        `UPDATE service_requests
         SET status = $2, version = version + 1
         WHERE id = $1 AND version = $3
         RETURNING ${requestColumns}`,
        [input.requestId, input.to, input.expectedVersion]
      );
      if (!updated.rows[0]) throw new StaleRequestError();

      await client.query(
        `INSERT INTO request_events
          (request_id, actor_ref, event_kind, previous_status, new_status, details)
         VALUES ($1, $2, 'STATUS_CHANGED', $3, $4, $5::jsonb)`,
        [input.requestId, input.actorRef, current.status, input.to, JSON.stringify(input.details ?? {})]
      );
      return toRequest(updated.rows[0]);
    });
  }

  async get(requestId: string): Promise<PersistentRequest | null> {
    const result = await this.database.query<RequestRow>(
      `SELECT ${requestColumns} FROM service_requests WHERE id = $1`,
      [requestId]
    );
    return result.rows[0] ? toRequest(result.rows[0]) : null;
  }

  /** Call only after a trusted, server-side scope check for the same request. */
  async history(requestId: string): Promise<RequestEvent[]> {
    const result = await this.database.query<EventRow>(
      `SELECT id, request_id, actor_ref, event_kind, previous_status, new_status,
              details, occurred_at
       FROM request_events WHERE request_id = $1 ORDER BY occurred_at, id`,
      [requestId]
    );
    return result.rows.map(toEvent);
  }
}
