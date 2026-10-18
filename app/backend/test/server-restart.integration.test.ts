import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { expect, it } from "vitest";
import { repositoryApp } from "./helpers/repository-app.js";
import { TEST_PASSWORD, validSubmission } from "./helpers/test-app.js";

it.runIf(Boolean(process.env.TEST_DATABASE_URL))("[T-NFR-003-01][AC-NFR-003] compiled server restart preserves all six statuses, owners, notes, due dates and history", async () => {
  const fixture = await repositoryApp("postgres", true);
  const env = {
    ...process.env, DATABASE_URL: fixture.connectionString,
    // Never let a developer's inherited migration URL escape test isolation.
    DATABASE_ADMIN_URL: undefined,
    NODE_ENV: "staging", SEED_USER_PASSWORD: TEST_PASSWORD,
    SEED_DEMO_DATA: "false", PORT: "0", APP_VERSION: "restart-verification",
  };
  let running: ChildProcess | undefined;
  async function stop() {
    if (running && running.exitCode === null && running.signalCode === null) {
      const closed = once(running, "exit");
      running.kill();
      await closed;
    }
    running = undefined;
  }
  async function start(): Promise<string> {
    running = spawn(process.execPath, ["dist/src/server.js"], { env, stdio: ["ignore", "pipe", "pipe"] });
    const child = running;
    return new Promise((resolve, reject) => {
      let output = "";
      const timer = setTimeout(() => reject(new Error("Compiled server did not start")), 15000);
      child.stdout?.on("data", (chunk) => {
        output += String(chunk);
        const port = /CivicConnect API running on port (\d+)/.exec(output)?.[1];
        if (port) { clearTimeout(timer); resolve(`http://127.0.0.1:${port}/api/v1`); }
      });
      child.on("error", (error) => { clearTimeout(timer); reject(error); });
      child.on("exit", () => { clearTimeout(timer); reject(new Error("Compiled server exited before startup")); });
    });
  }
  try {
    const migration = spawn(process.execPath, ["dist/scripts/migrate.js"], {
      env: { ...env, DATABASE_ADMIN_URL: fixture.connectionString },
      stdio: ["ignore", "pipe", "pipe"],
    });
    expect((await once(migration, "exit"))[0]).toBe(0);
    let base = await start();
    async function call(method: string, route: string, token?: string, body?: object) {
      const response = await fetch(base + route, {
        method, headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
        ...(body && { body: JSON.stringify(body) }),
      });
      return { status: response.status, body: await response.json() };
    }
    async function login(username: string) {
      const response = await call("POST", "/session", undefined, { username, password: TEST_PASSWORD });
      expect(response.status).toBe(200);
      return response.body.data.token as string;
    }
    const requester = await login("thandi");
    const staff = await login("sipho");
    const statuses = ["Submitted", "Accepted", "Rejected", "In Progress", "Resolved", "Closed"];
    const snapshots = [];
    for (const target of statuses) {
      const submitted = await call("POST", "/requests", requester, {
        ...validSubmission, title: `Restart fixture: ${target}`,
      });
      expect(submitted.status).toBe(201);
      const id = submitted.body.data.id as string;
      let version = 0;
      async function change(method: string, action: string, body: object, status = 200) {
        const response = await call(method, `/requests/${id}/${action}`, staff, { ...body, expectedVersion: version });
        expect(response.status).toBe(status);
        version += 1;
      }
      // Create the terminal states through the real API, not direct SQL. Notes
      // are written before a state prohibits them and must remain after restart.
      await change("POST", "assign", { assigneeId: "u-sipho" });
      await change("POST", "notes", { text: `Private restart note: ${target}`, visibleToRequester: false }, 201);
      if (target === "Rejected") {
        await change("PATCH", "status", { status: target, rejectionReason: "Synthetic duplicate request" });
      } else if (target !== "Submitted") {
        await change("PATCH", "status", { status: "Accepted" });
        await change("PATCH", "due-date", { dueDate: "2026-10-20T08:00:00Z" });
        if (target !== "Accepted") {
          await change("PATCH", "status", { status: "In Progress" });
          if (target !== "In Progress") {
            await change("PATCH", "status", { status: "Resolved", resolutionInformation: `Resolution for ${target}` });
            if (target === "Closed") await change("PATCH", "status", { status: "Closed" });
          }
        }
      }
      const detail = await call("GET", `/requests/${id}`, staff);
      const history = await call("GET", `/requests/${id}/history`, staff);
      const feedback = await call("GET", `/requests/${id}/history`, requester);
      expect(detail.status).toBe(200);
      expect(history.status).toBe(200);
      expect(feedback.status).toBe(200);
      expect(detail.body.data).toMatchObject({ id, status: target, version, ownerId: "u-sipho" });
      expect(detail.body.data.dueDate).toBe(["Submitted", "Rejected"].includes(target) ? null : "2026-10-20T08:00:00.000Z");
      expect(history.body.data).toHaveLength(version + 1);
      expect(JSON.stringify(feedback.body.data)).not.toContain("Private restart note:");
      snapshots.push({ id, detail: detail.body.data, history: history.body.data, feedback: feedback.body.data });
    }
    expect(new Set(snapshots.map((snapshot) => snapshot.detail.status))).toEqual(new Set(statuses));
    async function savedTables() {
      const database = fixture.database!;
      return {
        requests: (await database.query("SELECT * FROM service_requests ORDER BY id")).rows,
        events: (await database.query("SELECT * FROM request_events ORDER BY id")).rows,
        work: (await database.query("SELECT * FROM work_records ORDER BY id")).rows,
      };
    }
    const before = await savedTables();
    expect(before.requests).toHaveLength(6);
    expect(before.work).toHaveLength(8); // Six private notes and two resolutions.
    const ownBefore = await call("GET", "/requests/mine", requester);
    expect(ownBefore.status).toBe(200);
    expect(ownBefore.body.data).toHaveLength(6);
    await stop();
    base = await start();
    expect((await call("GET", `/requests/${snapshots[0].id}`, staff)).status).toBe(401);
    expect((await call("GET", "/requests/mine", requester)).status).toBe(401);
    const freshStaff = await login("sipho");
    const freshRequester = await login("thandi");
    for (const snapshot of snapshots) {
      const detail = await call("GET", `/requests/${snapshot.id}`, freshStaff);
      const history = await call("GET", `/requests/${snapshot.id}/history`, freshStaff);
      const feedback = await call("GET", `/requests/${snapshot.id}/history`, freshRequester);
      expect(detail.status).toBe(200);
      expect(history.status).toBe(200);
      expect(feedback.status).toBe(200);
      expect(detail.body.data).toEqual(snapshot.detail);
      expect(history.body.data).toEqual(snapshot.history);
      expect(feedback.body.data).toEqual(snapshot.feedback);
    }
    expect(await savedTables()).toEqual(before);
    const ownAfter = await call("GET", "/requests/mine", freshRequester);
    expect(ownAfter.status).toBe(200);
    expect(ownAfter.body.data).toEqual(ownBefore.body.data);
  } finally {
    await stop();
    await fixture.close();
  }
}, 180000);
