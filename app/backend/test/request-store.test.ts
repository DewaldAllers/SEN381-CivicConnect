import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { RequestStatus } from "../src/domain/request-status.js";
import { type Database, type SqlExecutor, type SqlRow } from "../src/persistence/database.js";
import {
  RequestStore,
  StaleRequestError,
} from "../src/persistence/request-store.js";

class EmbeddedPostgresDatabase implements Database {
  constructor(private readonly db: PGlite) {}

  async query<Row extends SqlRow>(sql: string, values: unknown[] = []): Promise<{ rows: Row[] }> {
    const result = await this.db.query<Row>(sql, values);
    return { rows: result.rows };
  }

  async transaction<Result>(work: (client: SqlExecutor) => Promise<Result>): Promise<Result> {
    return this.db.transaction((transaction) => work({
      query: async <Row extends SqlRow>(sql: string, values: unknown[] = []) => {
        const result = await transaction.query<Row>(sql, values);
        return { rows: result.rows };
      },
    }));
  }
}

const staff = { role: "Staff", action: "CHANGE_STATUS", withinApprovedScope: true } as const;

describe("PostgreSQL request and event persistence", () => {
  let embedded: PGlite;
  let database: EmbeddedPostgresDatabase;
  let store: RequestStore;

  beforeEach(async () => {
    embedded = new PGlite();
    const migration = await readFile(
      new URL("../migrations/001_requests_and_events.sql", import.meta.url),
      "utf8"
    );
    await embedded.exec(migration);
    database = new EmbeddedPostgresDatabase(embedded);
    store = new RequestStore(database);
  });

  afterEach(async () => {
    await embedded.close();
  });

  async function submit() {
    return store.submit({
      id: "REQ-001",
      requesterRef: "person-1",
      categoryRef: "roads",
      title: "Pothole",
      description: "Road surface is damaged",
    });
  }

  it("commits a new request with exactly one attributable submission event", async () => {
    const created = await submit();

    expect(created.status).toBe(RequestStatus.SUBMITTED);
    expect(created.version).toBe(0);
    expect((await store.get(created.id))?.title).toBe("Pothole");
    const history = await store.history(created.id);
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      actorRef: "person-1",
      eventKind: "SUBMITTED",
      previousStatus: null,
      newStatus: RequestStatus.SUBMITTED,
    });
  });

  it("rejects a duplicate reference without adding another event", async () => {
    await submit();

    await expect(submit()).rejects.toThrow();
    expect(await store.history("REQ-001")).toHaveLength(1);
  });

  it("rolls back a new request if its submission event cannot be stored", async () => {
    const failing: Database = {
      query: (sql, values) => database.query(sql, values),
      transaction: (work) => database.transaction((client) => work({
        query: (sql, values) => {
          if (sql.includes("INSERT INTO request_events")) {
            throw new Error("Injected event write failure");
          }
          return client.query(sql, values);
        },
      })),
    };

    await expect(new RequestStore(failing).submit({
      id: "REQ-002", requesterRef: "person-1", categoryRef: "roads",
      title: "Pothole", description: "Road surface is damaged",
    })).rejects.toThrow("Injected event write failure");
    expect(await store.get("REQ-002")).toBeNull();
    expect(await store.history("REQ-002")).toHaveLength(0);
  });

  it("commits a valid status change and exactly one matching history event", async () => {
    await submit();

    const updated = await store.changeStatus({
      requestId: "REQ-001",
      expectedVersion: 0,
      to: RequestStatus.ACCEPTED,
      actorRef: "staff-1",
      authorization: staff,
    });

    expect(updated).toMatchObject({ status: RequestStatus.ACCEPTED, version: 1 });
    const history = await store.history("REQ-001");
    expect(history).toHaveLength(2);
    expect(history[1]).toMatchObject({
      actorRef: "staff-1",
      eventKind: "STATUS_CHANGED",
      previousStatus: RequestStatus.SUBMITTED,
      newStatus: RequestStatus.ACCEPTED,
    });
  });

  it("does not change state or history for an invalid transition", async () => {
    await submit();

    await expect(store.changeStatus({
      requestId: "REQ-001",
      expectedVersion: 0,
      to: RequestStatus.CLOSED,
      actorRef: "staff-1",
      authorization: staff,
    })).rejects.toThrow("Invalid request status transition");
    expect(await store.get("REQ-001")).toMatchObject({ status: RequestStatus.SUBMITTED, version: 0 });
    expect(await store.history("REQ-001")).toHaveLength(1);
  });

  it("does not change state or history when authorisation is denied", async () => {
    await submit();

    await expect(store.changeStatus({
      requestId: "REQ-001",
      expectedVersion: 0,
      to: RequestStatus.ACCEPTED,
      actorRef: "person-1",
      authorization: { role: "Requester", action: "CHANGE_STATUS", ownsRequest: true },
    })).rejects.toThrow("Unauthorised status change");
    expect(await store.get("REQ-001")).toMatchObject({ status: RequestStatus.SUBMITTED, version: 0 });
    expect(await store.history("REQ-001")).toHaveLength(1);
  });

  it("rejects a stale version instead of overwriting a newer change", async () => {
    await submit();
    await store.changeStatus({
      requestId: "REQ-001", expectedVersion: 0, to: RequestStatus.ACCEPTED,
      actorRef: "staff-1", authorization: staff,
    });

    await expect(store.changeStatus({
      requestId: "REQ-001", expectedVersion: 0, to: RequestStatus.REJECTED,
      actorRef: "staff-2", authorization: staff, transition: { hasRejectionReason: true },
    })).rejects.toBeInstanceOf(StaleRequestError);
    expect(await store.get("REQ-001")).toMatchObject({ status: RequestStatus.ACCEPTED, version: 1 });
    expect(await store.history("REQ-001")).toHaveLength(2);
  });

  it("rolls back a status update if the event insert fails", async () => {
    await submit();
    const failing: Database = {
      query: (sql, values) => database.query(sql, values),
      transaction: (work) => database.transaction((client) => work({
        query: (sql, values) => {
          if (sql.includes("INSERT INTO request_events")) {
            throw new Error("Injected event write failure");
          }
          return client.query(sql, values);
        },
      })),
    };

    await expect(new RequestStore(failing).changeStatus({
      requestId: "REQ-001", expectedVersion: 0, to: RequestStatus.ACCEPTED,
      actorRef: "staff-1", authorization: staff,
    })).rejects.toThrow("Injected event write failure");
    expect(await store.get("REQ-001")).toMatchObject({ status: RequestStatus.SUBMITTED, version: 0 });
    expect(await store.history("REQ-001")).toHaveLength(1);
  });
});
