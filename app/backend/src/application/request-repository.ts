import { type RequestStatus } from "../domain/request-status.js";

/** A stored service request as the application layer sees it. */
export interface RequestRecord {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  requesterId: string;
  status: RequestStatus;
  ownerId: string | null;
  /** ISO 8601, UTC. Null means no due date has been agreed. */
  dueDate: string | null;
  /** ISO 8601, UTC. */
  submittedAt: string;
  /** Optimistic-lock counter, increased by every change to the request. */
  version: number;
}

export type HistoryKind =
  | "SUBMITTED"
  | "STATUS_CHANGED"
  | "OWNER_CHANGED"
  | "NOTE_ADDED"
  | "DUE_DATE_SET";

export interface NewHistoryEvent {
  kind: HistoryKind;
  actorId: string;
  /** Internal-only staff notes are false; requesters never see them (FR-004). */
  visibleToRequester: boolean;
  /** Structured values (old and new, reason, text). The API layer words them. */
  details: Record<string, unknown>;
}

export interface HistoryEvent extends NewHistoryEvent {
  id: string;
  requestId: string;
  /** ISO 8601, UTC. */
  at: string;
}

export interface NewRequest {
  title: string;
  description: string;
  categoryId: string;
  requesterId: string;
  submittedAt: string;
}

export interface RequestChanges {
  status?: RequestStatus;
  ownerId?: string | null;
  dueDate?: string | null;
}

export interface QueueFilter {
  /** Categories the caller may see. The repository never returns anything outside them. */
  categoryIds: readonly string[];
  categoryId?: string;
  status?: RequestStatus;
  oldestFirst?: boolean;
}

/** Thrown when the request changed after it was read (optimistic lock). */
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

/**
 * The persistence boundary (ADR-002). The in-memory version below backs the API
 * today; the PostgreSQL store implements the same interface.
 *
 * Rule for every write: the change and its history event are committed together
 * or not at all (NFR-002, NFR-003). A failed write leaves no event behind.
 */
export interface RequestRepository {
  /** Saves the request and its SUBMITTED event atomically. Assigns the reference number. */
  create(request: NewRequest, event: NewHistoryEvent): Promise<RequestRecord>;

  findById(id: string): Promise<RequestRecord | null>;

  /** One requester's own requests (FR-003). */
  listByRequester(requesterId: string): Promise<RequestRecord[]>;

  /** Requests in the given categories, filtered and ordered (FR-005, FR-006, FR-012). */
  listInCategories(filter: QueueFilter): Promise<RequestRecord[]>;

  /**
   * Applies the changes and records exactly one event, atomically.
   * Throws StaleRequestError if `expectedVersion` is no longer current,
   * RequestNotFoundError if the request does not exist.
   */
  update(
    id: string,
    expectedVersion: number,
    changes: RequestChanges,
    event: NewHistoryEvent
  ): Promise<RequestRecord>;

  /** Records an event that changes no request field, such as a note (FR-009). */
  appendEvent(id: string, event: NewHistoryEvent): Promise<void>;

  /** Events for one request, oldest first (FR-011). */
  history(requestId: string): Promise<HistoryEvent[]>;
}
