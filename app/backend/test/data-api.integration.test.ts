import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { repositoryApp } from "./helpers/repository-app.js";
import { validSubmission } from "./helpers/test-app.js";

// Functional integrity checks also run across the internet against the shared
// test database. NFR-005 latency is measured separately, not by this timeout.
vi.setConfig({ testTimeout: process.env.TEST_DATABASE_URL ? 30000 : 5000 });

describe.each(["memory", "postgres"] as const)("Data/API integration: %s", (kind) => {
  let fixture: Awaited<ReturnType<typeof repositoryApp>>;
  beforeEach(async () => { fixture = await repositoryApp(kind); }, 20000);
  afterEach(async () => { await fixture?.close(); });
  async function create() {
    const response = await fixture.as("thandi").post("/requests", validSubmission);
    expect(response.status).toBe(201);
    return response.body.data.id as string;
  }

  it("[T-NFR-002-03] refuses the browser's stale assignment with code stale and no extra event", async () => {
    const id = await create();
    expect((await fixture.as("sipho").patch(`/requests/${id}/status`, { status: "Accepted", expectedVersion: 0 })).status).toBe(200);
    const stale = await fixture.as("sipho").post(`/requests/${id}/assign`, { assigneeId: "u-sipho", expectedVersion: 0 });
    expect(stale.status).toBe(409);
    expect(stale.body.code).toBe("stale");
    expect((await fixture.as("sipho").get(`/requests/${id}/history`)).body.data).toHaveLength(2);
  });

  it.each([undefined, null, -1, 0.5, "0"])("refuses invalid/missing observed version %s", async (expectedVersion) => {
    const id = await create();
    const response = await fixture.as("sipho").patch(`/requests/${id}/status`, { status: "Accepted", expectedVersion });
    expect(response.status).toBe(400);
    expect(response.body.fields.expectedVersion).toBeDefined();
    expect((await fixture.as("sipho").get(`/requests/${id}`)).body.data.version).toBe(0);
  });

  it("[T-NFR-002-01/03] notes advance the version atomically and stale notes leave no history", async () => {
    const id = await create();
    const saved = await fixture.as("sipho").post(`/requests/${id}/notes`, { text: "Internal inspection", expectedVersion: 0 });
    expect(saved.status).toBe(201);
    expect((await fixture.as("sipho").get(`/requests/${id}`)).body.data.version).toBe(1);
    const stale = await fixture.as("sipho").post(`/requests/${id}/notes`, { text: "Must not be stored", expectedVersion: 0 });
    expect(stale.status).toBe(409);
    expect(stale.body.code).toBe("stale");
    expect((await fixture.as("sipho").get(`/requests/${id}/history`)).body.data).toHaveLength(2);
    expect((await fixture.as("thandi").get(`/requests/${id}/history`)).body.data).toHaveLength(1);
  });

  it("[T-FR-009-02] sets, changes and clears due dates with matching events", async () => {
    const id = await create();
    await fixture.as("sipho").patch(`/requests/${id}/status`, { status: "Accepted", expectedVersion: 0 });
    const first = await fixture.as("sipho").patch(`/requests/${id}/due-date`, { dueDate: "2026-10-20T08:00:00Z", expectedVersion: 1 });
    expect(first.status).toBe(200);
    const changed = await fixture.as("sipho").patch(`/requests/${id}/due-date`, { dueDate: "2026-10-21T08:00:00Z", expectedVersion: 2 });
    expect(changed.status).toBe(200);
    const cleared = await fixture.as("sipho").patch(`/requests/${id}/due-date`, { dueDate: null, expectedVersion: 3 });
    expect(cleared.status).toBe(200);
    expect(cleared.body.data).toMatchObject({ dueDate: null, version: 4 });
    expect((await fixture.as("sipho").get(`/requests/${id}/history`)).body.data.at(-1).text).toBe("Due date cleared.");
    expect((await fixture.as("mary").get("/management/summary")).body.data.openWithoutDueDate).toBe(1);
  });

  it("[T-FR-011-03] keeps assignment meaningful for requesters without exposing staff names or IDs", async () => {
    const id = await create();
    await fixture.as("sipho").post(`/requests/${id}/assign`, { assigneeId: "u-sipho", expectedVersion: 0 });
    const detail = (await fixture.as("thandi").get(`/requests/${id}`)).body.data;
    expect(detail).toMatchObject({ ownerId: null, ownerName: "Assigned staff" });
    const history = (await fixture.as("thandi").get(`/requests/${id}/history`)).body.data;
    expect(history.at(-1)).toMatchObject({ actorName: "Staff", text: "Responsibility updated." });
    expect(JSON.stringify({ detail, history })).not.toContain("Sipho");
    expect(JSON.stringify({ detail, history })).not.toContain("u-sipho");
    const audit = (await fixture.as("sipho").get(`/requests/${id}/history`)).body.data;
    expect(audit.at(-1).actorName).toBe("Sipho Mokoena");
  });

  it("returns 409 for prohibited terminal-state writes without changing data or returning 500", async () => {
    const id = await create();
    await fixture.as("sipho").post(`/requests/${id}/assign`, { assigneeId: "u-sipho", expectedVersion: 0 });
    for (const [version, status] of [[1, "Accepted"], [2, "In Progress"], [3, "Resolved"], [4, "Closed"]] as const) {
      expect((await fixture.as("sipho").patch(`/requests/${id}/status`, { expectedVersion: version, status, resolutionInformation: "Repaired" })).status).toBe(200);
    }
    expect((await fixture.as("sipho").post(`/requests/${id}/assign`, { assigneeId: "u-lerato", expectedVersion: 5 })).status).toBe(409);
    expect((await fixture.as("sipho").post(`/requests/${id}/notes`, { text: "Late note", expectedVersion: 5 })).status).toBe(409);
    expect((await fixture.as("sipho").patch(`/requests/${id}/due-date`, { dueDate: null, expectedVersion: 5 })).status).toBe(409);
    expect((await fixture.as("sipho").get(`/requests/${id}/history`)).body.data).toHaveLength(6);
  });

  it.skipIf(kind !== "postgres")("[T-NFR-002-02] a database-rejected event rolls back the HTTP note, work record and version", async () => {
    const id = await create();
    const database = fixture.database!;
    const original = database.transaction.bind(database);
    database.transaction = (work) => original((client) => work({
      query: (sql, values) => {
        if (sql.includes("INSERT INTO request_events")) {
          const invalid = [...(values ?? [])];
          invalid[1] = null;
          return client.query(sql, invalid);
        }
        return client.query(sql, values);
      },
    }));
    try {
      const failed = await fixture.as("sipho").post(`/requests/${id}/notes`, { text: "Must roll back", expectedVersion: 0 });
      expect(failed.status).toBe(500);
      expect(failed.body).toEqual({ error: "Internal server error" });
    } finally { database.transaction = original; }
    expect((await fixture.as("sipho").get(`/requests/${id}`)).body.data.version).toBe(0);
    expect((await fixture.as("sipho").get(`/requests/${id}/history`)).body.data).toHaveLength(1);
    expect((await database.query("SELECT id FROM work_records WHERE request_id = $1", [id])).rows).toHaveLength(0);
  });
});
