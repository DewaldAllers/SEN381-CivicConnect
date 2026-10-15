import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { expect, it } from "vitest";
import { repositoryApp } from "./helpers/repository-app.js";
import { TEST_PASSWORD, validSubmission } from "./helpers/test-app.js";

it.runIf(Boolean(process.env.TEST_DATABASE_URL))("[T-NFR-003-01] compiled migrations and authenticated API preserve requests/work/history across a server restart", async () => {
  const fixture = await repositoryApp("postgres", true);
  const env = {
    ...process.env, DATABASE_URL: fixture.connectionString,
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
    const migration = spawn(process.execPath, ["dist/scripts/migrate.js"], { env, stdio: ["ignore", "pipe", "pipe"] });
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
    const submitted = await call("POST", "/requests", requester, validSubmission);
    expect(submitted.status).toBe(201);
    const id = submitted.body.data.id;
    expect((await call("POST", `/requests/${id}/assign`, staff, { assigneeId: "u-sipho", expectedVersion: 0 })).status).toBe(200);
    expect((await call("PATCH", `/requests/${id}/status`, staff, { status: "Accepted", expectedVersion: 1 })).status).toBe(200);
    expect((await call("POST", `/requests/${id}/notes`, staff, { text: "Restart inspection recorded", expectedVersion: 2 })).status).toBe(201);
    expect((await call("PATCH", `/requests/${id}/due-date`, staff, { dueDate: "2026-10-20T08:00:00Z", expectedVersion: 3 })).status).toBe(200);
    const before = (await call("GET", `/requests/${id}`, staff)).body.data;
    const history = (await call("GET", `/requests/${id}/history`, staff)).body.data;
    expect(before.version).toBe(4);
    expect(history).toHaveLength(5);
    await stop();
    base = await start();
    expect((await call("GET", `/requests/${id}`, staff)).status).toBe(401);
    const freshStaff = await login("sipho");
    expect((await call("GET", `/requests/${id}`, freshStaff)).body.data).toEqual(before);
    expect((await call("GET", `/requests/${id}/history`, freshStaff)).body.data).toEqual(history);
    const freshRequester = await login("thandi");
    const feedback = (await call("GET", `/requests/${id}/history`, freshRequester)).body.data;
    expect(feedback).toHaveLength(4);
    expect(JSON.stringify(feedback)).not.toContain("Restart inspection recorded");
  } finally {
    await stop();
    await fixture.close();
  }
}, 60000);
