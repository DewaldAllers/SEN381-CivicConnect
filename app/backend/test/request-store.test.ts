import { PGlite } from "@electric-sql/pglite";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { RequestStatus } from "../src/domain/request-status.js";
import { migrate } from "../src/persistence/migrations.js";
import { type ManagementBucket, type Principal, RequestStore, StaleRequestError } from "../src/persistence/request-store.js";
import { EmbeddedPostgresDatabase, failingEventDatabase } from "./helpers/database.js";

const requester: Principal = { id: "person-1", role: "Requester", categoryRefs: [] };
const other: Principal = { id: "person-2", role: "Requester", categoryRefs: [] };
const staff: Principal = { id: "staff-1", role: "Staff", categoryRefs: ["c-maintenance"] };
const manager: Principal = { id: "manager-1", role: "Management", categoryRefs: ["c-maintenance"] };

describe("PostgreSQL request repository", () => {
  let embedded: PGlite;
  let database: EmbeddedPostgresDatabase;
  let store: RequestStore;

  beforeEach(async () => {
    embedded = new PGlite();
    database = new EmbeddedPostgresDatabase(embedded);
    await migrate(database);
    store = new RequestStore(database);
  });
  afterEach(async () => { await embedded.close(); });

  async function submit(id = "REQ-001", principal = requester, categoryRef = "c-maintenance") {
    return store.submit(principal, { id, categoryRef, title: "Pothole", description: "Road surface is damaged" });
  }
  async function accept() {
    return store.changeStatus(staff, { requestId: "REQ-001", expectedVersion: 0, to: RequestStatus.ACCEPTED });
  }

  it("applies versioned migrations once and seeds the six client categories", async () => {
    expect(await migrate(database)).toEqual([]);
    expect(await store.categories()).toHaveLength(6);
    const versions = await database.query("SELECT version FROM schema_migrations");
    expect(versions.rows).toHaveLength(2);
  });

  it("commits a request with exactly one attributable submission event", async () => {
    const created = await submit();
    expect(created).toMatchObject({ status: RequestStatus.SUBMITTED, version: 0, requesterRef: requester.id });
    expect(created.submittedAt).toBeInstanceOf(Date);
    const history = await store.history(requester, created.id);
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ actorRef: requester.id, eventKind: "SUBMITTED", previousStatus: null, newStatus: RequestStatus.SUBMITTED });
  });

  it("rejects duplicate references without adding an event", async () => {
    await submit();
    await expect(submit()).rejects.toThrow();
    expect(await store.history(staff, "REQ-001")).toHaveLength(1);
  });

  it("rejects unknown and inactive categories without storing a request or event", async () => {
    await expect(submit("REQ-X", requester, "unknown")).rejects.toThrow("Unapproved category");
    await database.query("UPDATE request_categories SET active = FALSE WHERE id = $1", ["c-maintenance"]);
    await expect(submit()).rejects.toThrow("Unapproved category");
    expect((await database.query("SELECT id FROM service_requests")).rows).toHaveLength(0);
    expect((await database.query("SELECT id FROM request_events")).rows).toHaveLength(0);
  });

  it("rejects blank input and a non-requester submission", async () => {
    await expect(store.submit(requester, { categoryRef: "c-maintenance", title: " ", description: "Description" })).rejects.toThrow("title is required");
    await expect(submit("REQ-X", staff)).rejects.toThrow("Unauthorised operation");
    expect((await database.query("SELECT id FROM service_requests")).rows).toHaveLength(0);
  });

  it("rolls back submission when the event cannot be written", async () => {
    await expect(new RequestStore(failingEventDatabase(database)).submit(requester, {
      id: "REQ-FAIL", categoryRef: "c-maintenance", title: "Pothole", description: "Damaged road",
    })).rejects.toThrow("Injected event write failure");
    expect(await store.get(requester, "REQ-FAIL")).toBeNull();
    expect((await database.query("SELECT id FROM request_events")).rows).toHaveLength(0);
  });

  it("returns only a requester's own records with refreshed status", async () => {
    await submit(); await submit("REQ-002"); await submit("REQ-003", other);
    await accept();
    const own = await store.ownList(requester);
    expect(own.map((r) => r.id).sort()).toEqual(["REQ-001", "REQ-002"]);
    expect(own.find((r) => r.id === "REQ-001")?.status).toBe(RequestStatus.ACCEPTED);
    expect(await store.ownList({ ...requester, id: "empty-user" })).toEqual([]);
    expect(await store.get(other, "REQ-001")).toBeNull();
    await expect(store.history(other, "REQ-001")).rejects.toThrow("Request not found");
  });

  it("applies category scope before category/status filters and oldest-first ordering", async () => {
    await submit(); await submit("REQ-002"); await submit("REQ-003", other, "c-it");
    await database.query("UPDATE service_requests SET submitted_at = $2 WHERE id = $1", ["REQ-001", "2026-01-02T00:00:00Z"]);
    await database.query("UPDATE service_requests SET submitted_at = $2 WHERE id = $1", ["REQ-002", "2026-01-01T00:00:00Z"]);
    await accept();
    expect((await store.staffQueue(staff, { sort: "oldest" })).map((r) => r.id)).toEqual(["REQ-002", "REQ-001"]);
    expect((await store.staffQueue(staff, { categoryRef: "c-maintenance", status: RequestStatus.ACCEPTED })).map((r) => r.id)).toEqual(["REQ-001"]);
    expect(await store.staffQueue(staff, { categoryRef: "c-it" })).toEqual([]);
    expect(await store.get(staff, "REQ-003")).toBeNull();
    await expect(store.history(staff, "REQ-003")).rejects.toThrow("Request not found");
    expect(await store.staffQueue({ ...staff, categoryRefs: [] })).toEqual([]);
  });

  it("treats hostile filter values as data and cannot expand scope", async () => {
    await submit();
    expect(await store.staffQueue(staff, { categoryRef: "c-maintenance' OR 1=1 --" })).toEqual([]);
  });

  it("commits a valid status change and exactly one matching history event", async () => {
    await submit();
    expect(await accept()).toMatchObject({ status: RequestStatus.ACCEPTED, version: 1 });
    const history = await store.history(staff, "REQ-001");
    expect(history).toHaveLength(2);
    expect(history[1]).toMatchObject({ actorRef: staff.id, eventKind: "STATUS_CHANGED", previousStatus: RequestStatus.SUBMITTED, newStatus: RequestStatus.ACCEPTED });
  });

  it("rejects invalid transitions, denied roles, and revoked category scope without changes", async () => {
    await submit();
    await expect(store.changeStatus(staff, { requestId: "REQ-001", expectedVersion: 0, to: RequestStatus.CLOSED })).rejects.toThrow("Invalid request status transition");
    await expect(store.changeStatus(requester, { requestId: "REQ-001", expectedVersion: 0, to: RequestStatus.ACCEPTED })).rejects.toThrow("Unauthorised operation");
    await expect(store.changeStatus({ ...staff, categoryRefs: [] }, { requestId: "REQ-001", expectedVersion: 0, to: RequestStatus.ACCEPTED })).rejects.toThrow("Request not found");
    expect(await store.get(requester, "REQ-001")).toMatchObject({ status: RequestStatus.SUBMITTED, version: 0 });
    expect(await store.history(requester, "REQ-001")).toHaveLength(1);
  });

  it("rejects stale updates without overwriting newer changes", async () => {
    await submit(); await accept();
    await expect(store.changeStatus(staff, { requestId: "REQ-001", expectedVersion: 0, to: RequestStatus.REJECTED, reason: "Duplicate" })).rejects.toBeInstanceOf(StaleRequestError);
    expect(await store.get(staff, "REQ-001")).toMatchObject({ status: RequestStatus.ACCEPTED, version: 1 });
    expect(await store.history(staff, "REQ-001")).toHaveLength(2);
  });

  it("rolls back status and version if the event insert fails", async () => {
    await submit();
    await expect(new RequestStore(failingEventDatabase(database)).changeStatus(staff, {
      requestId: "REQ-001", expectedVersion: 0, to: RequestStatus.ACCEPTED,
    })).rejects.toThrow("Injected event write failure");
    expect(await store.get(staff, "REQ-001")).toMatchObject({ status: RequestStatus.SUBMITTED, version: 0 });
    expect(await store.history(staff, "REQ-001")).toHaveLength(1);
  });

  it("records old/new ownership once and denies an ineligible assignee", async () => {
    await submit();
    await expect(store.assign(staff, { requestId: "REQ-001", expectedVersion: 0, assignee: { ...staff, id: "bad", categoryRefs: ["c-it"] } })).rejects.toThrow("Ineligible assignee");
    expect(await store.assign(staff, { requestId: "REQ-001", expectedVersion: 0, assignee: staff })).toMatchObject({ responsibleRef: staff.id, version: 1 });
    expect((await store.history(staff, "REQ-001"))[1].details).toEqual({ previousOwner: null, newOwner: staff.id });
  });

  it("uses the stored owner for In Progress and preserves real rejection/resolution feedback", async () => {
    await submit(); await accept();
    await expect(store.changeStatus(staff, { requestId: "REQ-001", expectedVersion: 1, to: RequestStatus.IN_PROGRESS })).rejects.toThrow("Invalid request status transition");
    await store.assign(staff, { requestId: "REQ-001", expectedVersion: 1, assignee: staff });
    await store.changeStatus(staff, { requestId: "REQ-001", expectedVersion: 2, to: RequestStatus.IN_PROGRESS });
    await expect(store.changeStatus(staff, { requestId: "REQ-001", expectedVersion: 3, to: RequestStatus.RESOLVED })).rejects.toThrow("Invalid request status transition");
    await store.changeStatus(staff, { requestId: "REQ-001", expectedVersion: 3, to: RequestStatus.RESOLVED, resolution: "Surface repaired" });
    expect((await store.feedback(requester, "REQ-001")).at(-1)?.details).toEqual({ resolution: "Surface repaired" });
    expect((await database.query("SELECT kind, text FROM work_records")).rows).toEqual([{ kind: "RESOLUTION", text: "Surface repaired" }]);
    await submit("REQ-002");
    await store.changeStatus(staff, { requestId: "REQ-002", expectedVersion: 0, to: RequestStatus.REJECTED, reason: "Duplicate report" });
    expect((await store.feedback(requester, "REQ-002")).at(-1)?.details).toEqual({ reason: "Duplicate report" });
  });

  it("hides internal notes from requester feedback and keeps attributable chronological staff history", async () => {
    await submit();
    await store.recordWork(staff, { requestId: "REQ-001", expectedVersion: 0, text: "Private staff note" });
    await store.recordWork(staff, { requestId: "REQ-001", expectedVersion: 1, text: "Public update", visibleToRequester: true });
    const feedback = await store.feedback(requester, "REQ-001");
    expect(feedback).toHaveLength(2);
    expect(feedback[1].details.text).toBe("Public update");
    const full = await store.history(staff, "REQ-001");
    expect(full).toHaveLength(3);
    expect(full[1]).toMatchObject({ actorRef: staff.id, visibleToRequester: false });
    expect(full.every((e, i) => i === 0 || e.occurredAt >= full[i - 1].occurredAt)).toBe(true);
    await expect(store.feedback(other, "REQ-001")).rejects.toThrow("Request not found");
  });

  it("rolls back a work record and version on event failure", async () => {
    await submit();
    await expect(new RequestStore(failingEventDatabase(database)).recordWork(staff, {
      requestId: "REQ-001", expectedVersion: 0, text: "Must roll back",
    })).rejects.toThrow("Injected event write failure");
    expect((await database.query("SELECT id FROM work_records")).rows).toHaveLength(0);
    expect(await store.get(staff, "REQ-001")).toMatchObject({ version: 0 });
    expect(await store.history(staff, "REQ-001")).toHaveLength(1);
  });

  it("records due date changes and clearing with one event per successful change", async () => {
    await submit();
    await expect(store.setDueDate(staff, { requestId: "REQ-001", expectedVersion: 0, dueAt: new Date() })).rejects.toThrow("Due dates require accepted work");
    await accept();
    const dueAt = new Date("2026-10-15T08:00:00Z");
    expect(await store.setDueDate(staff, { requestId: "REQ-001", expectedVersion: 1, dueAt })).toMatchObject({ dueAt, version: 2 });
    expect((await store.history(staff, "REQ-001")).at(-1)?.details).toEqual({ previousDueAt: null, newDueAt: dueAt.toISOString() });
    expect(await store.setDueDate(staff, { requestId: "REQ-001", expectedVersion: 2, dueAt: null })).toMatchObject({ dueAt: null, version: 3 });
    expect(await store.history(staff, "REQ-001")).toHaveLength(4);
  });

  it("rolls back due date and ownership updates on event failure", async () => {
    await submit(); await accept();
    const failing = new RequestStore(failingEventDatabase(database));
    await expect(failing.setDueDate(staff, { requestId: "REQ-001", expectedVersion: 1, dueAt: new Date() })).rejects.toThrow("Injected event write failure");
    await expect(failing.assign(staff, { requestId: "REQ-001", expectedVersion: 1, assignee: staff })).rejects.toThrow("Injected event write failure");
    expect(await store.get(staff, "REQ-001")).toMatchObject({ dueAt: null, responsibleRef: null, version: 1 });
    expect(await store.history(staff, "REQ-001")).toHaveLength(2);
  });

  it("keeps management counts and lists consistent for scope, filters, overdue boundary and missing dates", async () => {
    const at = new Date("2026-10-12T12:00:00Z");
    const fixture = [
      ["REQ-1", "Submitted", null, "c-maintenance"],
      ["REQ-2", "Accepted", "2026-10-12T11:59:59Z", "c-maintenance"],
      ["REQ-3", "In Progress", at.toISOString(), "c-maintenance"],
      ["REQ-4", "Resolved", "2026-10-11T12:00:00Z", "c-maintenance"],
      ["REQ-5", "Closed", "2026-10-11T12:00:00Z", "c-maintenance"],
      ["REQ-6", "Rejected", null, "c-maintenance"],
      ["REQ-7", "Accepted", "2026-10-11T12:00:00Z", "c-it"],
    ];
    for (const [id, status, dueAt, categoryRef] of fixture) {
      await database.query(`INSERT INTO service_requests (id, requester_ref, category_ref, title, description, status, due_at)
        VALUES ($1, 'synthetic', $2, 'Fixture', 'Synthetic report fixture', $3, $4)`, [id, categoryRef, status, dueAt]);
    }
    const summary = await store.managementSummary(manager, {}, at);
    expect(summary).toEqual({ open: 3, overdue: 1, resolved: 1, closed: 1, openWithoutDueDate: 1 });
    for (const bucket of Object.keys(summary) as ManagementBucket[]) {
      expect(await store.managementList(manager, bucket, {}, at)).toHaveLength(summary[bucket]);
    }
    expect(await store.managementList(manager, "overdue", {}, at)).toMatchObject([{ id: "REQ-2" }]);
    expect(await store.managementSummary(manager, { status: RequestStatus.ACCEPTED }, at)).toMatchObject({ open: 1, overdue: 1, resolved: 0 });
    expect(await store.managementSummary(manager, { categoryRef: "c-it" }, at)).toEqual({ open: 0, overdue: 0, resolved: 0, closed: 0, openWithoutDueDate: 0 });
    expect(await store.managementSummary({ ...manager, categoryRefs: [] }, {}, at)).toMatchObject({ open: 0, overdue: 0 });
    await expect(store.managementSummary(staff)).rejects.toThrow("Unauthorised operation");
  });

  it("prevents event and work record edits or deletion", async () => {
    await submit();
    await store.recordWork(staff, { requestId: "REQ-001", expectedVersion: 0, text: "Recorded work" });
    await expect(database.query("UPDATE request_events SET actor_ref = 'tampered'")).rejects.toThrow("append-only");
    await expect(database.query("DELETE FROM request_events")).rejects.toThrow("append-only");
    await expect(database.query("UPDATE work_records SET text = 'tampered'")).rejects.toThrow("append-only");
    await expect(database.query("DELETE FROM work_records")).rejects.toThrow("append-only");
    expect(await store.history(staff, "REQ-001")).toHaveLength(2);
  });
});
