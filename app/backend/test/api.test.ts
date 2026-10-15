import request from "supertest";
import { describe, expect, it } from "vitest";

import { RequestStatus } from "../src/domain/request-status.js";
import { buildTestApp, record, seedUsers, TEST_PASSWORD, validSubmission } from "./helpers/test-app.js";

/**
 * API / integration tests through the real HTTP boundary (supertest -> Express -> application
 * service -> authorization policy -> repository). Each test name carries its ID and the
 * requirement or acceptance criterion it demonstrates. Expected results come from
 * docs/requirements/acceptance-criteria.md and docs/data/permission-matrix.md.
 */

const text = (n: number) => "a".repeat(n);

describe("Sign in and sessions (NFR-001)", () => {
  it("[TC-API-01][AC-NFR-001] valid credentials return a token and the user, never the password hash", async () => {
    const { app } = await buildTestApp();
    const res = await request(app).post("/api/v1/session").send({ username: "sipho", password: TEST_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toEqual(expect.any(String));
    expect(res.body.data.user).toEqual({ id: "u-sipho", name: "Sipho Mokoena", role: "Staff" });
    expect(JSON.stringify(res.body)).not.toContain("scrypt");
  });

  it.each([
    ["wrong password", "sipho", "not-the-password"],
    ["unknown user", "nobody", TEST_PASSWORD],
    ["empty body", "", ""],
  ])("[TC-API-02][AC-NFR-001] %s gives the same 401 message, so a username cannot be probed", async (_label, username, password) => {
    const { app } = await buildTestApp();
    const res = await request(app).post("/api/v1/session").send({ username, password });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Wrong username or password" });
  });

  it("[TC-API-03][AC-NFR-001] a protected endpoint without a valid token is refused with 401", async () => {
    const { app } = await buildTestApp();

    expect((await request(app).get("/api/v1/requests/mine")).status).toBe(401);
    const bad = await request(app).get("/api/v1/requests/mine").set("Authorization", "Bearer made-up-token");
    expect(bad.status).toBe(401);
  });

  it("[TC-API-04][AC-NFR-001] signing out stops the token working immediately", async () => {
    const { app } = await buildTestApp();
    const login = await request(app).post("/api/v1/session").send({ username: "thandi", password: TEST_PASSWORD });
    const header = { Authorization: `Bearer ${login.body.data.token}` };

    expect((await request(app).get("/api/v1/requests/mine").set(header)).status).toBe(200);
    expect((await request(app).delete("/api/v1/session").set(header)).status).toBe(200);
    expect((await request(app).get("/api/v1/requests/mine").set(header)).status).toBe(401);
  });
});

describe("Submit a request (FR-001, FR-002)", () => {
  it("[TC-API-05][AC-FR-001] a valid submission is saved with the entered values, a reference, a time, the requester and status Submitted", async () => {
    const { as, repository } = await buildTestApp();
    const res = await as("thandi").post("/requests", validSubmission);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({
      ...validSubmission,
      status: "Submitted",
      requesterName: "Thandi Nkosi",
      submittedAt: "2026-10-13T08:00:00.000Z",
      ownerId: null,
    });
    expect(res.body.data.id).toMatch(/^REQ-/);
    const events = await repository.history(res.body.data.id);
    expect(events.map((e) => e.kind)).toEqual(["SUBMITTED"]);
  });

  // Boundary value analysis on P-01's limits: title 5 to 100, description 10 to 1000.
  it.each([
    ["title", 4, 400], ["title", 5, 201], ["title", 100, 201], ["title", 101, 400],
    ["description", 9, 400], ["description", 10, 201], ["description", 1000, 201], ["description", 1001, 400],
  ])("[TC-API-06][AC-FR-001][BVA] %s of %i characters gives %i", async (field, length, expected) => {
    const { as } = await buildTestApp();
    const res = await as("thandi").post("/requests", { ...validSubmission, [field]: text(length) });

    expect(res.status).toBe(expected);
    const mine = await as("thandi").get("/requests/mine");
    if (expected === 400) {
      expect(res.body.fields[field]).toEqual(expect.any(String));
      expect(mine.body.data).toHaveLength(0);
    } else {
      expect(mine.body.data).toHaveLength(1);
    }
  });

  it("[TC-API-07][AC-FR-002] a category outside the approved list is rejected even when sent outside the form", async () => {
    const { as } = await buildTestApp();
    const res = await as("thandi").post("/requests", { ...validSubmission, categoryId: "c-invented" });

    expect(res.status).toBe(400);
    expect(res.body.fields.categoryId).toBeDefined();
    expect((await as("thandi").get("/requests/mine")).body.data).toHaveLength(0);
  });

  it("[TC-API-08][AC-NFR-001] staff cannot submit a request, and nothing is created", async () => {
    const { as, repository } = await buildTestApp();
    const res = await as("sipho").post("/requests", validSubmission);

    expect(res.status).toBe(403);
    expect(await repository.listInCategories({ categoryIds: ["c-facilities"] })).toHaveLength(0);
  });

  it("[TC-API-09] malformed JSON is a 400, not a 500", async () => {
    const { app, tokenFor } = await buildTestApp();
    const res = await request(app).post("/api/v1/requests").set("Authorization", `Bearer ${tokenFor("thandi")}`)
      .set("Content-Type", "application/json").send("{not json");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Malformed JSON");
  });
});

describe("Confidentiality of requests (FR-003, NFR-001)", () => {
  it("[TC-API-10][AC-FR-003] each requester sees exactly their own requests; one with none sees an empty list", async () => {
    const { as } = await buildTestApp();
    await as("thandi").post("/requests", { ...validSubmission, title: "Thandi first request" });
    await as("thandi").post("/requests", { ...validSubmission, title: "Thandi second request" });
    await as("bongani").post("/requests", { ...validSubmission, title: "Bongani only request" });

    const thandi = (await as("thandi").get("/requests/mine")).body.data.map((r: { title: string }) => r.title).sort();
    const bongani = (await as("bongani").get("/requests/mine")).body.data.map((r: { title: string }) => r.title);

    expect(thandi).toEqual(["Thandi first request", "Thandi second request"]);
    expect(bongani).toEqual(["Bongani only request"]);
    expect((await as("sipho").get("/requests/mine")).status).toBe(403);
  });

  it("[TC-API-11][AC-NFR-001] requester A opening requester B's request by reference is denied exactly like a missing one", async () => {
    const { as } = await buildTestApp();
    const id = (await as("bongani").post("/requests", validSubmission)).body.data.id;

    const other = await as("thandi").get(`/requests/${id}`);
    const missing = await as("thandi").get("/requests/REQ-999");
    const history = await as("thandi").get(`/requests/${id}/history`);

    expect(other.status).toBe(404);
    expect(other.body).toEqual(missing.body);
    expect(JSON.stringify(other.body)).not.toContain(validSubmission.title);
    expect(history.status).toBe(404);
  });
});

describe("Staff queue, filters and order (FR-005, FR-006, FR-012)", () => {
  async function seeded() {
    const t = await buildTestApp();
    t.repository.seed(
      [
        record("REQ-001", { categoryId: "c-facilities", status: RequestStatus.SUBMITTED, submittedAt: "2026-10-03T08:00:00.000Z" }),
        record("REQ-002", { categoryId: "c-it", status: RequestStatus.ACCEPTED, submittedAt: "2026-10-01T08:00:00.000Z" }),
        record("REQ-003", { categoryId: "c-security", status: RequestStatus.SUBMITTED, submittedAt: "2026-10-02T08:00:00.000Z" }),
        record("REQ-004", { categoryId: "c-facilities", status: RequestStatus.ACCEPTED, submittedAt: "2026-10-04T08:00:00.000Z" }),
      ],
      []
    );
    return t;
  }
  const ids = (res: { body: { data: { id: string }[] } }) => res.body.data.map((r) => r.id);

  it("[TC-API-12][AC-FR-005] each staff member sees only requests in their own category grants", async () => {
    const { as } = await seeded();

    // sipho: facilities, IT, maintenance. lerato: facilities, security.
    expect(ids(await as("sipho").get("/requests")).sort()).toEqual(["REQ-001", "REQ-002", "REQ-004"]);
    expect(ids(await as("lerato").get("/requests")).sort()).toEqual(["REQ-001", "REQ-003", "REQ-004"]);
  });

  it("[TC-API-13][AC-FR-005][AC-NFR-001] opening an out-of-scope request directly is denied with no details", async () => {
    const { as } = await seeded();
    const res = await as("sipho").get("/requests/REQ-003"); // security: not one of sipho's categories

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Request not found" });
    expect((await as("lerato").get("/requests/REQ-003")).status).toBe(200);
  });

  it("[TC-API-14][AC-FR-006] filters return all and only the matching permitted requests, and never widen access", async () => {
    const { as } = await seeded();

    expect(ids(await as("sipho").get("/requests?categoryId=c-facilities")).sort()).toEqual(["REQ-001", "REQ-004"]);
    expect(ids(await as("sipho").get("/requests?status=Accepted")).sort()).toEqual(["REQ-002", "REQ-004"]);
    expect(ids(await as("sipho").get("/requests?categoryId=c-facilities&status=Accepted"))).toEqual(["REQ-004"]);
    // Asking for a category the caller has no grant for returns nothing, not the other team's requests.
    expect(ids(await as("sipho").get("/requests?categoryId=c-security"))).toEqual([]);
    expect((await as("sipho").get("/requests?status=Nonsense")).status).toBe(400);
  });

  it("[TC-API-15][AC-FR-012] oldest-first puts the earliest first and the latest last; the same records come back", async () => {
    const { as } = await seeded();
    const oldest = ids(await as("sipho").get("/requests?sort=oldest"));
    const newest = ids(await as("sipho").get("/requests"));

    expect(oldest).toEqual(["REQ-002", "REQ-001", "REQ-004"]);
    expect([...newest].sort()).toEqual([...oldest].sort());
    expect(ids(await as("sipho").get("/requests?categoryId=c-facilities&sort=oldest"))).toEqual(["REQ-001", "REQ-004"]);
  });
});

describe("Ownership (FR-007)", () => {
  it("[TC-API-16][AC-FR-007] authorised staff can take a request, and the change is recorded with old and new owner", async () => {
    const { as } = await buildTestApp();
    const id = (await as("thandi").post("/requests", validSubmission)).body.data.id;

    const taken = await as("sipho").post(`/requests/${id}/assign`, { assigneeId: "u-sipho" });
    expect(taken.status).toBe(200);
    expect(taken.body.data).toMatchObject({ ownerId: "u-sipho", ownerName: "Sipho Mokoena" });

    const reassigned = await as("sipho").post(`/requests/${id}/assign`, { assigneeId: "u-lerato" });
    expect(reassigned.body.data.ownerId).toBe("u-lerato");

    const history = (await as("sipho").get(`/requests/${id}/history`)).body.data;
    const owner = history.filter((e: { type: string }) => e.type === "Owner");
    expect(owner).toHaveLength(2);
    expect(owner[1].text).toContain("Lerato Pillay is now responsible");
    expect(owner[1].text).toContain("Previously: Sipho Mokoena");
  });

  // Decision table: who can take an IT request? (sipho holds c-it, lerato does not.)
  it.each([
    ["staff with the category grant", 200, "u-sipho"],
    ["staff without the category grant", 409, "u-lerato"],
    ["a requester", 409, "u-bongani"],
    ["a manager", 409, "u-mary"],
    ["a person who does not exist", 409, "u-nobody"],
    ["nothing at all", 409, undefined],
  ])("[TC-API-17][AC-FR-007][Decision table] assigning to %s gives %i, and a refusal changes neither owner nor history", async (_who, expected, assigneeId) => {
    const { as, repository } = await buildTestApp();
    repository.seed([record("REQ-001", { categoryId: "c-it" })], []);

    const res = await as("sipho").post("/requests/REQ-001/assign", { assigneeId });

    expect(res.status).toBe(expected);
    if (expected === 409) {
      expect((await repository.findById("REQ-001"))?.ownerId).toBeNull();
      expect(await repository.history("REQ-001")).toHaveLength(0);
    }
  });

  it("[TC-API-18][AC-FR-007][AC-NFR-001] a requester or a manager cannot assign, and the owner stays unchanged", async () => {
    const { as, repository } = await buildTestApp();
    repository.seed([record("REQ-001", { requesterId: "u-thandi" })], []);

    expect((await as("thandi").post("/requests/REQ-001/assign", { assigneeId: "u-sipho" })).status).toBe(403);
    expect((await as("mary").post("/requests/REQ-001/assign", { assigneeId: "u-sipho" })).status).toBe(403);
    expect((await repository.findById("REQ-001"))?.ownerId).toBeNull();
  });
});

describe("Status changes and history (FR-008, FR-011, NFR-002)", () => {
  it("[TC-API-19][AC-FR-008][AC-FR-011][AC-NFR-002] a request moves through its whole life; each step leaves exactly one event, in order", async () => {
    const { as, repository } = await buildTestApp();
    const id = (await as("thandi").post("/requests", validSubmission)).body.data.id;

    expect((await as("sipho").patch(`/requests/${id}/status`, { status: "Accepted" })).status).toBe(200);
    expect((await as("sipho").post(`/requests/${id}/assign`, { assigneeId: "u-sipho" })).status).toBe(200);
    expect((await as("sipho").patch(`/requests/${id}/status`, { status: "In Progress" })).status).toBe(200);
    expect((await as("sipho").patch(`/requests/${id}/status`, { status: "Resolved", resolutionInformation: "Washer replaced" })).status).toBe(200);
    const closed = await as("sipho").patch(`/requests/${id}/status`, { status: "Closed" });
    expect(closed.body.data).toEqual({ id, status: "Closed" });

    expect(await repository.history(id)).toHaveLength(6);
    const seen = (await as("thandi").get(`/requests/${id}/history`)).body.data;
    expect(seen.map((e: { type: string }) => e.type)).toEqual(["Submitted", "Status", "Owner", "Status", "Status", "Status"]);
    expect(seen[0].actorName).toBe("Thandi Nkosi");
    expect(seen[4].text).toBe("Status changed from In Progress to Resolved. Resolution: Washer replaced");
    expect((await as("thandi").get(`/requests/${id}`)).body.data.status).toBe("Closed");
  });

  it("[TC-API-20][AC-FR-008] a transition not in the table is refused, the status stays, and no event is written", async () => {
    const { as, repository } = await buildTestApp();
    repository.seed([record("REQ-001")], []);

    const res = await as("sipho").patch("/requests/REQ-001/status", { status: "Closed" });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Invalid request status transition");
    expect((await repository.findById("REQ-001"))?.status).toBe("Submitted");
    expect(await repository.history("REQ-001")).toHaveLength(0);
  });

  // Decision table for the transitions that need extra information (P-02).
  it.each([
    ["Reject without a reason", { status: RequestStatus.SUBMITTED }, { status: "Rejected" }],
    ["Reject with a blank reason", { status: RequestStatus.SUBMITTED }, { status: "Rejected", rejectionReason: "   " }],
    ["Start work with no owner", { status: RequestStatus.ACCEPTED, ownerId: null }, { status: "In Progress" }],
    ["Start work claiming an owner in the body", { status: RequestStatus.ACCEPTED, ownerId: null }, { status: "In Progress", hasOwner: true }],
    ["Resolve without resolution information", { status: RequestStatus.IN_PROGRESS, ownerId: "u-sipho" }, { status: "Resolved" }],
  ])("[TC-API-21][AC-FR-008][Decision table] %s is refused and nothing changes", async (_label, state, body) => {
    const { as, repository } = await buildTestApp();
    repository.seed([record("REQ-001", state)], []);

    const res = await as("sipho").patch("/requests/REQ-001/status", body);

    expect(res.status).toBe(409);
    expect((await repository.findById("REQ-001"))?.status).toBe(state.status);
    expect(await repository.history("REQ-001")).toHaveLength(0);
  });

  it("[TC-API-22][AC-FR-008] a rejection with a reason is accepted and the reason is kept in the history", async () => {
    const { as } = await buildTestApp();
    const id = (await as("thandi").post("/requests", validSubmission)).body.data.id;

    const res = await as("sipho").patch(`/requests/${id}/status`, { status: "Rejected", rejectionReason: "Not a council matter" });
    expect(res.status).toBe(200);

    const seen = (await as("thandi").get(`/requests/${id}/history`)).body.data;
    expect(seen[1].text).toBe("Status changed from Submitted to Rejected. Reason: Not a council matter");
  });

  it("[TC-API-23][AC-FR-008][AC-NFR-001] a requester or a manager cannot change status, and an out-of-scope staff member gets 404; the status never changes", async () => {
    const { as, repository } = await buildTestApp();
    repository.seed(
      [record("REQ-001", { requesterId: "u-thandi", categoryId: "c-facilities" }), record("REQ-002", { categoryId: "c-security" })],
      []
    );

    expect((await as("thandi").patch("/requests/REQ-001/status", { status: "Accepted" })).status).toBe(403);
    expect((await as("mary").patch("/requests/REQ-001/status", { status: "Accepted" })).status).toBe(403);
    expect((await as("sipho").patch("/requests/REQ-002/status", { status: "Accepted" })).status).toBe(404);
    expect((await repository.findById("REQ-001"))?.status).toBe("Submitted");
    expect((await repository.findById("REQ-002"))?.status).toBe("Submitted");
  });

  it("[TC-API-24][AC-FR-008] an unknown request is 404 and an unrecognised status value is 400", async () => {
    const { as, repository } = await buildTestApp();
    repository.seed([record("REQ-001")], []);

    expect((await as("sipho").patch("/requests/DOES-NOT-EXIST/status", { status: "Accepted" })).status).toBe(404);
    expect((await as("sipho").patch("/requests/REQ-001/status", { status: "NotARealStatus" })).status).toBe(400);
  });

  it("[TC-API-25][NFR-002] two staff changing the same request at once: only one change is recorded", async () => {
    const { as, repository } = await buildTestApp();
    repository.seed([record("REQ-001")], []);

    const results = await Promise.all([
      as("sipho").patch("/requests/REQ-001/status", { status: "Accepted" }),
      as("lerato").patch("/requests/REQ-001/status", { status: "Rejected", rejectionReason: "Duplicate" }),
    ]);

    expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
    const events = await repository.history("REQ-001");
    expect(events.filter((e) => e.kind === "STATUS_CHANGED")).toHaveLength(1);
  });
});

describe("Notes and due dates (FR-009, FR-004)", () => {
  it("[TC-API-26][AC-FR-009][AC-FR-004] a note is stored with its author and time, and an internal note is hidden from the requester", async () => {
    const { as, clock } = await buildTestApp();
    const id = (await as("thandi").post("/requests", validSubmission)).body.data.id;
    clock.now = new Date("2026-10-13T09:30:00.000Z");

    expect((await as("sipho").post(`/requests/${id}/notes`, { text: "Waiting on a part", visibleToRequester: false })).status).toBe(201);
    expect((await as("sipho").post(`/requests/${id}/notes`, { text: "Plumber booked for Friday", visibleToRequester: true })).status).toBe(201);

    const staff = (await as("sipho").get(`/requests/${id}/history`)).body.data;
    expect(staff.filter((e: { type: string }) => e.type === "Note")).toHaveLength(2);
    expect(staff[1]).toMatchObject({ actorName: "Sipho Mokoena", at: "2026-10-13T09:30:00.000Z" });

    const requester = (await as("thandi").get(`/requests/${id}/history`)).body.data;
    const notes = requester.filter((e: { type: string }) => e.type === "Note").map((e: { text: string }) => e.text);
    expect(notes).toEqual(["Plumber booked for Friday"]);
  });

  it("[TC-API-27][AC-FR-009] an empty note is refused and records nothing", async () => {
    const { as, repository } = await buildTestApp();
    repository.seed([record("REQ-001")], []);

    const res = await as("sipho").post("/requests/REQ-001/notes", { text: "   " });

    expect(res.status).toBe(400);
    expect(res.body.fields.text).toBeDefined();
    expect(await repository.history("REQ-001")).toHaveLength(0);
  });

  it("[TC-API-28][AC-FR-009] a due date is stored with its change history; a missing or invalid date is refused", async () => {
    const { as, repository } = await buildTestApp();
    repository.seed([record("REQ-001", { status: RequestStatus.ACCEPTED })], []);

    const set = await as("sipho").patch("/requests/REQ-001/due-date", { dueDate: "2026-10-20" });
    expect(set.status).toBe(200);
    expect(set.body.data.dueDate).toBe("2026-10-20T00:00:00.000Z");
    const events = await repository.history("REQ-001");
    expect(events).toHaveLength(1);
    expect(events[0].details).toEqual({ previousDueDate: null, newDueDate: "2026-10-20T00:00:00.000Z" });

    for (const dueDate of ["not a date", null, 0, undefined]) {
      expect((await as("sipho").patch("/requests/REQ-001/due-date", { dueDate })).status).toBe(400);
    }
    expect(await repository.history("REQ-001")).toHaveLength(1);
  });
});

describe("Management summary (FR-010)", () => {
  const now = new Date("2026-10-13T08:00:00.000Z");
  const past = "2026-10-13T07:59:59.999Z";
  const future = "2026-10-13T08:00:00.001Z";

  async function dataset() {
    const manager = {
      ...seedUsers.find((u) => u.username === "mary")!,
      id: "u-ngozi", username: "ngozi", name: "Ngozi Mbeki", categoryIds: ["c-facilities"],
    };
    const t = await buildTestApp({ users: [...seedUsers, manager], startAt: now });
    t.repository.seed(
      [
        record("REQ-001", { status: RequestStatus.IN_PROGRESS, dueDate: past }),                       // overdue
        record("REQ-002", { status: RequestStatus.ACCEPTED, dueDate: now.toISOString() }),             // due exactly now: not overdue
        record("REQ-003", { status: RequestStatus.ACCEPTED, dueDate: future }),                        // not yet due
        record("REQ-004", { status: RequestStatus.RESOLVED, dueDate: past }),                          // resolved: never overdue
        record("REQ-005", { status: RequestStatus.SUBMITTED, dueDate: null }),                         // open, no due date
        record("REQ-006", { status: RequestStatus.CLOSED }),
        record("REQ-007", { status: RequestStatus.REJECTED, dueDate: past }),                          // rejected: not open, not overdue
        record("REQ-008", { status: RequestStatus.IN_PROGRESS, dueDate: past, categoryId: "c-it" }),   // overdue, but facilities-only manager cannot see it
      ],
      []
    );
    return t;
  }

  it("[TC-API-29][AC-FR-010] counts follow the status and overdue rules, including the exact-due-time boundary", async () => {
    const { as } = await dataset();
    const res = await as("mary").get("/management/summary");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ open: 5, overdue: 2, resolved: 1, closed: 1, openWithoutDueDate: 1 });
  });

  it("[TC-API-30][AC-FR-010] every count matches the list behind it, before and after a filter", async () => {
    const { as } = await dataset();
    const summary = (await as("mary").get("/management/summary")).body.data;

    for (const bucket of ["open", "overdue", "resolved", "closed"] as const) {
      const list = await as("mary").get(`/management/requests?bucket=${bucket}`);
      expect(list.body.data).toHaveLength(summary[bucket]);
    }
    const onlyIt = await as("mary").get("/management/summary?categoryId=c-it");
    const onlyItList = await as("mary").get("/management/requests?bucket=open&categoryId=c-it");
    expect(onlyIt.body.data.open).toBe(1);
    expect(onlyItList.body.data.map((r: { id: string }) => r.id)).toEqual(["REQ-008"]);
  });

  it("[TC-API-31][AC-FR-010][AC-NFR-001] a manager sees only their own categories, in counts, lists and detail", async () => {
    const { as } = await dataset();
    const res = await as("ngozi").get("/management/summary");

    expect(res.body.data).toEqual({ open: 4, overdue: 1, resolved: 1, closed: 1, openWithoutDueDate: 1 });
    expect((await as("ngozi").get("/management/requests?bucket=overdue")).body.data.map((r: { id: string }) => r.id)).toEqual(["REQ-001"]);
    expect((await as("ngozi").get("/requests/REQ-008")).status).toBe(404);
    expect((await as("ngozi").get("/management/summary?categoryId=c-it")).body.data.open).toBe(0);
  });

  it("[TC-API-32][AC-NFR-001] staff and requesters cannot read management reports, and managers cannot change requests", async () => {
    const { as } = await dataset();

    expect((await as("sipho").get("/management/summary")).status).toBe(403);
    expect((await as("thandi").get("/management/requests")).status).toBe(403);
    expect((await as("mary").patch("/requests/REQ-005/status", { status: "Accepted" })).status).toBe(403);
    expect((await as("mary").post("/requests/REQ-005/notes", { text: "hello" })).status).toBe(403);
  });
});

describe("Service health and hardening", () => {
  it("[TC-API-33] /health needs no sign-in, reports the build version, and leaks no framework banner", async () => {
    const { app } = await buildTestApp();
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ status: "ok", version: "test" });
    expect(res.headers["x-powered-by"]).toBeUndefined();
    expect(res.headers["cache-control"]).toBe("no-store");
  });

  it("[TC-API-34] an unknown API path needs sign-in first (nothing is revealed), then is a JSON 404", async () => {
    const { app, as } = await buildTestApp();

    expect((await request(app).get("/api/v1/does-not-exist")).status).toBe(401);
    const res = await as("thandi").get("/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Not found" });
  });
});
