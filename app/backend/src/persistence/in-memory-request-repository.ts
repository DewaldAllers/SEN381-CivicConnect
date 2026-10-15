import {
  type HistoryEvent,
  type NewHistoryEvent,
  type NewRequest,
  type QueueFilter,
  type RequestChanges,
  type RequestRecord,
  type RequestRepository,
  RequestNotFoundError,
  StaleRequestError,
} from "../application/request-repository.js";
import { RequestStatus } from "../domain/request-status.js";

/**
 * In-memory implementation of the repository port. Used for development and
 * for fast, isolated API tests. Data is lost on restart (TD-001): the
 * PostgreSQL store is what satisfies NFR-003.
 */
export class InMemoryRequestRepository implements RequestRepository {
  private readonly requests = new Map<string, RequestRecord>();
  private readonly events: HistoryEvent[] = [];
  private requestCounter = 0;
  private eventCounter = 0;

  constructor(private readonly now: () => Date = () => new Date()) {}

  async create(
    input: NewRequest,
    event: NewHistoryEvent
  ): Promise<RequestRecord> {
    this.requestCounter += 1;
    const record: RequestRecord = {
      id: `REQ-${String(this.requestCounter).padStart(3, "0")}`,
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

  async findById(id: string): Promise<RequestRecord | null> {
    const record = this.requests.get(id);
    return record ? { ...record } : null;
  }

  async listByRequester(requesterId: string): Promise<RequestRecord[]> {
    return this.sorted(
      [...this.requests.values()].filter((r) => r.requesterId === requesterId),
      false
    );
  }

  async listInCategories(filter: QueueFilter): Promise<RequestRecord[]> {
    const visible = [...this.requests.values()].filter(
      (r) =>
        filter.categoryIds.includes(r.categoryId) &&
        (filter.categoryId === undefined || r.categoryId === filter.categoryId) &&
        (filter.status === undefined || r.status === filter.status)
    );
    return this.sorted(visible, filter.oldestFirst === true);
  }

  async update(
    id: string,
    expectedVersion: number,
    changes: RequestChanges,
    event: NewHistoryEvent
  ): Promise<RequestRecord> {
    const current = this.requests.get(id);
    if (!current) throw new RequestNotFoundError();
    if (current.version !== expectedVersion) throw new StaleRequestError();

    const updated: RequestRecord = {
      ...current,
      ...(changes.status !== undefined && { status: changes.status }),
      ...(changes.ownerId !== undefined && { ownerId: changes.ownerId }),
      ...(changes.dueDate !== undefined && { dueDate: changes.dueDate }),
      version: current.version + 1,
    };
    this.requests.set(id, updated);
    this.pushEvent(id, event, this.now().toISOString());
    return { ...updated };
  }

  async appendEvent(id: string, event: NewHistoryEvent): Promise<void> {
    if (!this.requests.has(id)) throw new RequestNotFoundError();
    this.pushEvent(id, event, this.now().toISOString());
  }

  async history(requestId: string): Promise<HistoryEvent[]> {
    return this.events
      .filter((e) => e.requestId === requestId)
      .map((e) => ({ ...e }));
  }

  /** Test and demo helper: loads fixed records and events without going through the rules. */
  seed(records: RequestRecord[], events: HistoryEvent[]): void {
    for (const record of records) {
      this.requests.set(record.id, { ...record });
      const n = Number(record.id.replace(/\D/g, ""));
      if (n > this.requestCounter) this.requestCounter = n;
    }
    for (const event of events) {
      this.eventCounter += 1;
      this.events.push({ ...event, id: String(this.eventCounter) });
    }
  }

  private pushEvent(requestId: string, event: NewHistoryEvent, at: string): void {
    this.eventCounter += 1;
    this.events.push({ ...event, id: String(this.eventCounter), requestId, at });
  }

  private sorted(list: RequestRecord[], oldestFirst: boolean): RequestRecord[] {
    const direction = oldestFirst ? 1 : -1;
    return list
      .map((r) => ({ ...r }))
      .sort(
        (a, b) =>
          direction * a.submittedAt.localeCompare(b.submittedAt) ||
          a.id.localeCompare(b.id)
      );
  }
}
