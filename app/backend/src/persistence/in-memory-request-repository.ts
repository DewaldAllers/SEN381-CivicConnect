import {
  type HistoryEvent,
  type NewHistoryEvent,
  type NewRequest,
  type QueueFilter,
  type RepositoryPrincipal,
  type RequestChanges,
  type RequestRecord,
  type RequestRepository,
  RequestNotFoundError,
  StaleRequestError,
} from "../application/request-repository.js";
import { RequestStatus } from "../domain/request-status.js";

/**
 * In-memory implementation of the persistence boundary.
 * Access is checked here so callers cannot widen their own permissions.
 */
export class InMemoryRequestRepository implements RequestRepository {
  private readonly requests = new Map<string, RequestRecord>();
  private readonly events: HistoryEvent[] = [];
  private requestCounter = 0;
  private eventCounter = 0;

  constructor(private readonly now: () => Date = () => new Date()) {}

  /**
   * Load demo and test fixtures.
   * This is for setup only, not a user-facing repository operation.
   */
  seed(
    records: readonly RequestRecord[],
    events: readonly HistoryEvent[]
  ): void {
    this.requests.clear();
    this.events.length = 0;

    for (const record of records) {
      this.requests.set(record.id, { ...record });
    }

    for (const event of events) {
      this.events.push({
        ...event,
        details: { ...event.details },
      });
    }

    this.requestCounter = records.reduce((max, record) => {
      const match = /^REQ-(\d+)$/.exec(record.id);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);

    this.eventCounter = events.reduce((max, event) => {
      const match = /^EVT-(\d+)$/.exec(event.id);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
  }

  async create(
    principal: RepositoryPrincipal,
    input: NewRequest,
    event: NewHistoryEvent
  ): Promise<RequestRecord> {
    if (
      principal.role !== "Requester" ||
      principal.id !== input.requesterId ||
      event.actorId !== principal.id
    ) {
      throw new Error("Unauthorised operation");
    }

    let id: string;

    do {
      this.requestCounter += 1;
      id = `REQ-${String(this.requestCounter).padStart(3, "0")}`;
    } while (this.requests.has(id));

    const record: RequestRecord = {
      id,
      ...input,
      status: RequestStatus.SUBMITTED,
      ownerId: null,
      dueDate: null,
      version: 0,
    };

    this.requests.set(record.id, record);
    this.pushEvent(record.id, event, input.submittedAt);

    return { ...record };
  }

  async findById(
    principal: RepositoryPrincipal,
    id: string
  ): Promise<RequestRecord | null> {
    const record = this.requests.get(id);

    if (!record || !this.canRead(principal, record)) {
      return null;
    }

    return this.forPrincipal(principal, record);
  }

  async listByRequester(
    principal: RepositoryPrincipal,
    requesterId: string
  ): Promise<RequestRecord[]> {
    if (
      principal.role !== "Requester" ||
      requesterId !== principal.id
    ) {
      return [];
    }

    return this.sorted(
      [...this.requests.values()].filter(
        (record) => record.requesterId === principal.id
      ),
      false
    ).map((record) => this.forPrincipal(principal, record));
  }

  async listInCategories(
    principal: RepositoryPrincipal,
    filter: QueueFilter
  ): Promise<RequestRecord[]> {
    if (
      principal.role !== "Staff" &&
      principal.role !== "Management"
    ) {
      return [];
    }

    const allowedCategories = new Set(principal.categoryIds);

    const visible = [...this.requests.values()].filter(
      (record) =>
        allowedCategories.has(record.categoryId) &&
        filter.categoryIds.includes(record.categoryId) &&
        (filter.categoryId === undefined ||
          record.categoryId === filter.categoryId) &&
        (filter.status === undefined ||
          record.status === filter.status)
    );

    return this.sorted(visible, filter.oldestFirst === true).map(
      (record) => ({ ...record })
    );
  }

  async update(
    principal: RepositoryPrincipal,
    id: string,
    expectedVersion: number,
    changes: RequestChanges,
    event: NewHistoryEvent
  ): Promise<RequestRecord> {
    const current = this.requests.get(id);

    if (!current || !this.canRead(principal, current)) {
      throw new RequestNotFoundError();
    }

    if (
      principal.role !== "Staff" ||
      event.actorId !== principal.id
    ) {
      throw new Error("Unauthorised operation");
    }

    if (current.version !== expectedVersion) {
      throw new StaleRequestError();
    }

    const updated: RequestRecord = {
      ...current,
      ...(changes.status !== undefined && {
        status: changes.status,
      }),
      ...(changes.ownerId !== undefined && {
        ownerId: changes.ownerId,
      }),
      ...(changes.dueDate !== undefined && {
        dueDate: changes.dueDate,
      }),
      version: current.version + 1,
    };

    this.requests.set(id, updated);
    this.pushEvent(id, event, this.now().toISOString());

    return { ...updated };
  }

  async appendEvent(
    principal: RepositoryPrincipal,
    id: string,
    event: NewHistoryEvent
  ): Promise<void> {
    const record = this.requests.get(id);

    if (
      !record ||
      !this.canRead(principal, record) ||
      principal.role !== "Staff" ||
      event.actorId !== principal.id
    ) {
      throw new RequestNotFoundError();
    }

    this.pushEvent(id, event, this.now().toISOString());
  }

  async history(
    principal: RepositoryPrincipal,
    requestId: string
  ): Promise<HistoryEvent[]> {
    const record = this.requests.get(requestId);

    if (!record || !this.canRead(principal, record)) {
      throw new RequestNotFoundError();
    }

    const history = this.events.filter(
      (event) => event.requestId === requestId
    );

    if (principal.role !== "Requester") {
      return history.map((event) => ({
        ...event,
        details: { ...event.details },
      }));
    }

    return history
      .filter((event) => event.visibleToRequester)
      .map((event) => ({
        ...event,
        actorId:
          event.actorId === principal.id ? event.actorId : "",
        details:
          event.kind === "OWNER_CHANGED"
            ? { ownershipChanged: true }
            : { ...event.details },
      }));
  }

  private canRead(
    principal: RepositoryPrincipal,
    record: RequestRecord
  ): boolean {
    if (principal.role === "Requester") {
      return record.requesterId === principal.id;
    }

    return principal.categoryIds.includes(record.categoryId);
  }

  private forPrincipal(
    principal: RepositoryPrincipal,
    record: RequestRecord
  ): RequestRecord {
    if (principal.role === "Requester") {
      return { ...record, ownerId: null };
    }

    return { ...record };
  }

  private pushEvent(
    requestId: string,
    event: NewHistoryEvent,
    at: string
  ): void {
    this.eventCounter += 1;

    this.events.push({
      ...event,
      id: `EVT-${String(this.eventCounter).padStart(3, "0")}`,
      requestId,
      at,
      details: { ...event.details },
    });
  }

  private sorted(
    records: RequestRecord[],
    oldestFirst: boolean
  ): RequestRecord[] {
    return records.sort((a, b) => {
      const difference =
        new Date(a.submittedAt).getTime() -
        new Date(b.submittedAt).getTime();

      if (difference !== 0) {
        return oldestFirst ? difference : -difference;
      }

      return oldestFirst
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    });
  }
}