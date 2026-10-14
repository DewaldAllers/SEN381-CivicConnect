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

/** Trusted identity and permissions from the server, never the HTTP body. */
export interface RepositoryPrincipal {
  id: string;
  role: "Requester" | "Staff" | "Management";
  categoryIds: readonly string[];
}

export interface NewHistoryEvent {
  kind: HistoryKind;
  actorId: string;
  visibleToRequester: boolean;
  details: Record<string, unknown>;
}

export interface HistoryEvent extends NewHistoryEvent {
  id: string;
  requestId: string;
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
  categoryIds: readonly string[];
  categoryId?: string;
  status?: RequestStatus;
  oldestFirst?: boolean;
}

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
 * Every operation receives a trusted principal so access can be checked at
 * the persistence boundary as well as in the application layer.
 */
export interface RequestRepository {
  create(
    principal: RepositoryPrincipal,
    request: NewRequest,
    event: NewHistoryEvent
  ): Promise<RequestRecord>;

  findById(
    principal: RepositoryPrincipal,
    id: string
  ): Promise<RequestRecord | null>;

  listByRequester(
    principal: RepositoryPrincipal,
    requesterId: string
  ): Promise<RequestRecord[]>;

  listInCategories(
    principal: RepositoryPrincipal,
    filter: QueueFilter
  ): Promise<RequestRecord[]>;

  update(
    principal: RepositoryPrincipal,
    id: string,
    expectedVersion: number,
    changes: RequestChanges,
    event: NewHistoryEvent
  ): Promise<RequestRecord>;

  appendEvent(
    principal: RepositoryPrincipal,
    id: string,
    event: NewHistoryEvent
  ): Promise<void>;

  history(
    principal: RepositoryPrincipal,
    requestId: string
  ): Promise<HistoryEvent[]>;
}