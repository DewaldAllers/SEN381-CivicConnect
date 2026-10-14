import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";
import { migrate } from "../src/persistence/migrations.js";
import { seedPerformance } from "../src/persistence/performance-seed.js";
import { RequestStore, type Principal } from "../src/persistence/request-store.js";
import { RequestStatus } from "../src/domain/request-status.js";
import { EmbeddedPostgresDatabase } from "./helpers/database.js";

const requester: Principal = { id: "test-requester", role: "Requester", categoryRefs: [] };
const staff: Principal = { id: "test-staff", role: "Staff", categoryRefs: ["c-maintenance"] };

it("retains requests, owner, notes, due date and history after closing and reopening disk storage", async () => {
  const directory = await mkdtemp(join(tmpdir(), "sen381-persistence-"));
  let embedded = new PGlite(directory);
  try {
    let database = new EmbeddedPostgresDatabase(embedded);
    await migrate(database);
    let store = new RequestStore(database);
    await store.submit(requester, { id: "REQ-RESTART", categoryRef: "c-maintenance", title: "Broken window", description: "Synthetic restart case" });
    await store.changeStatus(staff, { requestId: "REQ-RESTART", expectedVersion: 0, to: RequestStatus.ACCEPTED });
    await store.assign(staff, { requestId: "REQ-RESTART", expectedVersion: 1, assignee: staff });
    await store.recordWork(staff, { requestId: "REQ-RESTART", expectedVersion: 2, text: "Inspection completed" });
    await store.setDueDate(staff, { requestId: "REQ-RESTART", expectedVersion: 3, dueAt: new Date("2026-10-15T08:00:00Z") });
    const before = await store.get(staff, "REQ-RESTART");
    const history = await store.history(staff, "REQ-RESTART");
    await embedded.close();
    embedded = new PGlite(directory);
    database = new EmbeddedPostgresDatabase(embedded);
    store = new RequestStore(database);
    expect(await store.get(staff, "REQ-RESTART")).toEqual(before);
    expect(await store.history(staff, "REQ-RESTART")).toEqual(history);
    expect((await database.query("SELECT text FROM work_records")).rows).toEqual([{ text: "Inspection completed" }]);
    expect(await migrate(database)).toEqual([]);
  } finally {
    await embedded.close();
    // Only the directory returned by mkdtemp for this test is removed.
    await rm(directory, { recursive: true, force: true });
  }
}, 20000);

it("seeds a repeatable status/category mix with matching lifecycle events and no overwrite on rerun", async () => {
  const embedded = new PGlite();
  try {
    const database = new EmbeddedPostgresDatabase(embedded);
    await migrate(database);
    const options = { count: 72, namespace: "PERF-TEST", requesterRefs: ["load-a", "load-b"], staffRef: "load-staff", referenceTime: new Date("2026-10-12T12:00:00Z") };
    await seedPerformance(database, options);
    const store = new RequestStore(database);
    const manager: Principal = { id: "load-manager", role: "Management", categoryRefs: (await store.categories()).map((c) => c.id) };
    const requests = (await database.query<{ id: string; status: RequestStatus; version: number }>("SELECT id, status, version FROM service_requests")).rows;
    expect(requests).toHaveLength(72);
    expect(new Set(requests.map((r) => r.status)).size).toBe(6);
    for (const request of requests) {
      const events = await store.history(manager, request.id);
      expect(events).toHaveLength(request.version + 1);
      expect(events.at(-1)?.newStatus).toBe(request.status);
    }
    await expect(seedPerformance(database, options)).rejects.toThrow();
    expect((await database.query("SELECT id FROM service_requests")).rows).toHaveLength(72);
  } finally { await embedded.close(); }
}, 20000);
