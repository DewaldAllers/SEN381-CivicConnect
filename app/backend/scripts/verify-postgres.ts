import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";
import { RequestStatus } from "../src/domain/request-status.js";
import { type Database, PostgresDatabase } from "../src/persistence/database.js";
import { migrate } from "../src/persistence/migrations.js";
import { seedPerformance } from "../src/persistence/performance-seed.js";
import { type Principal, RequestStore } from "../src/persistence/request-store.js";

const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) throw new Error("TEST_DATABASE_URL is required; use a development/test PostgreSQL database");
const requester: Principal = { id: "verify-requester", role: "Requester", categoryRefs: [] };
const staff: Principal = { id: "verify-staff", role: "Staff", categoryRefs: ["c-maintenance"] };
const manager: Principal = { id: "verify-manager", role: "Management", categoryRefs: ["c-maintenance"] };
const dueAt = new Date("2026-10-15T08:00:00Z");
const scopedPool = (schema: string) => new Pool({ connectionString, options: `-c search_path=${schema}`, max: 3, connectionTimeoutMillis: 5000 });

async function checkSchema(pool: Pool, schema: string): Promise<void> {
  assert.equal((await pool.query("SELECT current_schema() AS schema")).rows[0].schema, schema);
}

async function readAfterRestart(): Promise<void> {
  const schema = process.env.M3_VERIFY_SCHEMA ?? "";
  assert.match(schema, /^m3_verify_[a-f0-9]{32}$/);
  const pool = scopedPool(schema);
  try {
    await checkSchema(pool, schema);
    const store = new RequestStore(new PostgresDatabase(pool));
    const request = await store.get(staff, "REQ-VERIFY");
    assert.equal(request?.status, RequestStatus.ACCEPTED);
    assert.equal(request?.responsibleRef, staff.id);
    assert.equal(request?.dueAt?.toISOString(), dueAt.toISOString());
    assert.equal(request?.version, 4);
    assert.equal((await store.history(staff, "REQ-VERIFY")).length, 5);
    assert.equal((await pool.query("SELECT text FROM work_records WHERE request_id = 'REQ-VERIFY'")).rows[0].text, "Inspection complete");
    console.log("Fresh process read: request, owner, due date, work record and history preserved");
  } finally { await pool.end(); }
}

async function verify(): Promise<void> {
  const schema = `m3_verify_${randomUUID().replaceAll("-", "")}`;
  const admin = new Pool({ connectionString, max: 1, connectionTimeoutMillis: 5000 });
  let created = false;
  let pool: Pool | undefined;
  try {
    await admin.query(`CREATE SCHEMA "${schema}"`);
    created = true;
    pool = scopedPool(schema);
    await checkSchema(pool, schema);
    const database = new PostgresDatabase(pool);
    assert.equal((await migrate(database)).length, 3);
    assert.deepEqual(await migrate(database), []);
    const store = new RequestStore(database);
    await store.submit(requester, { id: "REQ-VERIFY", categoryRef: "c-maintenance", title: "Verify persistence", description: "Disposable PostgreSQL fixture" });
    await store.changeStatus(staff, { requestId: "REQ-VERIFY", expectedVersion: 0, to: RequestStatus.ACCEPTED });
    await store.assign(staff, { requestId: "REQ-VERIFY", expectedVersion: 1, assignee: staff });
    await store.recordWork(staff, { requestId: "REQ-VERIFY", expectedVersion: 2, text: "Inspection complete" });
    await store.setDueDate(staff, { requestId: "REQ-VERIFY", expectedVersion: 3, dueAt });
    assert.equal((await store.history(staff, "REQ-VERIFY")).length, 5);
    assert.equal((await store.feedback(requester, "REQ-VERIFY")).length, 4);
    const feedback = await store.feedback(requester, "REQ-VERIFY");
    assert.equal(feedback.find((event) => event.eventKind === "OWNERSHIP_CHANGED")?.actorRef, null);
    assert.equal(JSON.stringify(feedback).includes(staff.id), false);
    assert.equal((await store.get(requester, "REQ-VERIFY"))?.responsibleRef, null);
    assert.equal((await store.history(staff, "REQ-VERIFY"))[2].details.newOwner, staff.id);
    assert.equal(await store.get({ ...requester, id: "another-user" }, "REQ-VERIFY"), null);
    assert.deepEqual(await store.staffQueue({ ...staff, categoryRefs: [] }), []);

    const failing: Database = {
      query: (sql, values) => database.query(sql, values),
      transaction: (work) => database.transaction((client) => work({
        query: (sql, values) => {
          if (sql.includes("INSERT INTO request_events")) {
            // Make PostgreSQL itself reject the event, leaving the transaction
            // aborted until PostgresDatabase rolls back the request/work write.
            const invalid = [...(values ?? [])];
            invalid[1] = null;
            return client.query(sql, invalid);
          }
          return client.query(sql, values);
        },
      })),
    };
    await assert.rejects(new RequestStore(failing).submit(requester, {
      id: "REQ-ROLLBACK", categoryRef: "c-maintenance", title: "Verify rollback", description: "This must not survive",
    }), /null value/);
    assert.equal(await store.get(requester, "REQ-ROLLBACK"), null);
    await assert.rejects(new RequestStore(failing).recordWork(staff, {
      requestId: "REQ-VERIFY", expectedVersion: 4, text: "Must roll back",
    }), /null value/);
    assert.equal((await store.get(staff, "REQ-VERIFY"))?.version, 4);
    assert.equal((await pool.query("SELECT COUNT(*) AS count FROM work_records")).rows[0].count, "1");

    // Two checked-out server connections compete for the same observed version.
    await store.submit(requester, { id: "REQ-RACE", categoryRef: "c-maintenance", title: "Concurrent changes", description: "Only one may commit" });
    const results = await Promise.allSettled([
      store.changeStatus(staff, { requestId: "REQ-RACE", expectedVersion: 0, to: RequestStatus.ACCEPTED }),
      store.changeStatus(staff, { requestId: "REQ-RACE", expectedVersion: 0, to: RequestStatus.REJECTED, reason: "Duplicate" }),
    ]);
    assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
    assert.equal((await store.history(staff, "REQ-RACE")).length, 2);

    await seedPerformance(database, { count: 72, namespace: "VERIFY-PERF", requesterRefs: [requester.id], staffRef: staff.id, referenceTime: new Date("2026-10-12T12:00:00Z") });
    const reportTime = new Date();
    const summary = await store.managementSummary(manager, {}, reportTime);
    for (const bucket of ["open", "overdue", "resolved", "closed", "openWithoutDueDate"] as const) {
      assert.equal((await store.managementList(manager, bucket, {}, reportTime)).length, summary[bucket]);
    }
    const version = (await pool.query("SHOW server_version")).rows[0].server_version;
    await pool.end();
    pool = undefined;
    // A separate Node process reconstructs the data layer from persisted data.
    await new Promise<void>((resolve, reject) => {
      const child = spawn(process.execPath, ["--import", "tsx", fileURLToPath(import.meta.url), "--read-after-restart"], {
        env: { ...process.env, M3_VERIFY_SCHEMA: schema }, stdio: "inherit",
      });
      child.on("error", reject);
      child.on("exit", (code) => code === 0 ? resolve() : reject(new Error("Fresh-process persistence check failed")));
    });
    console.log(`PostgreSQL ${version}: migrations, scoped queries, rollback, concurrency, summaries and process-restart checks passed`);
  } finally {
    await pool?.end();
    try { if (created) await admin.query(`DROP SCHEMA "${schema}" CASCADE`); }
    finally { await admin.end(); }
  }
}

if (process.argv.includes("--read-after-restart")) await readAfterRestart();
else await verify();
