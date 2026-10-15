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
  /** Indicates an assignment when staff identity is masked for a requester. */
  hasOwner?: boolean;
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

/**
 * Trusted identity and permissions from the server, never the HTTP body.
 * Repository operations use this to enforce access at the persistence boundary.
 */
export interface RepositoryPrincipal {
  id: string;
  role: "Requester" | "Staff" | "Management";
  categoryIds: readonly string[];
}

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
    this.name = "StaleRequestError";
  }
}

export class RequestNotFoundError extends Error {
  constructor() {
    super("Request not found");
    this.name = "RequestNotFoundError";
  }
}

/**
 * Persistence boundary shared by the in-memory and PostgreSQL implementations.
 *
 * Every operation receives a trusted principal so access can be checked at
 * the persistence boundary as well as in the application layer.
 *
 * Rule for every write: the change and its history event are committed together
 * or not at all (NFR-002, NFR-003). A failed write leaves no event behind.
 */
export interface RequestRepository {
  /** Saves the request and its SUBMITTED event atomically. */
  create(
    principal: RepositoryPrincipal,
    request: NewRequest,
    event: NewHistoryEvent
  ): Promise<RequestRecord>;

  findById(
    principal: RepositoryPrincipal,
    id: string
  ): Promise<RequestRecord | null>;

  /** One requester's own requests (FR-003). */
  listByRequester(
    principal: RepositoryPrincipal,
    requesterId: string
  ): Promise<RequestRecord[]>;

  /** Requests in the given categories, filtered and ordered (FR-005, FR-006, FR-012). */
  listInCategories(
    principal: RepositoryPrincipal,
    filter: QueueFilter
  ): Promise<RequestRecord[]>;

  /**
   * Applies the changes and records exactly one event, atomically.
   * Throws StaleRequestError if expectedVersion is no longer current,
   * or RequestNotFoundError if the request does not exist.
   */
  update(
    principal: RepositoryPrincipal,
    id: string,
    expectedVersion: number,
    changes: RequestChanges,
    event: NewHistoryEvent
  ): Promise<RequestRecord>;

  /** Appends a note and increments the observed request version atomically. */
  appendEvent(
    principal: RepositoryPrincipal,
    id: string,
    expectedVersion: number,
    event: NewHistoryEvent
  ): Promise<void>;

  /** Events for one request, oldest first (FR-011). */
  history(
    principal: RepositoryPrincipal,
    requestId: string
  ): Promise<HistoryEvent[]>;
}
