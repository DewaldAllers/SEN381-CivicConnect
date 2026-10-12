import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Pool } from "pg";

import { RequestStatus } from "../src/domain/request-status.js";
import { type Database } from "../src/persistence/database.js";
import { PostgresDatabase } from "../src/persistence/database.js";
import { RequestStore } from "../src/persistence/request-store.js";

const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) {
  throw new Error("TEST_DATABASE_URL is required; use a disposable development/test PostgreSQL database");
}

// An isolated, randomly named schema keeps this check away from application data.
const schema = `m3_verify_${randomUUID().replaceAll("-", "")}`;
const identifier = `"${schema}"`;
const admin = new Pool({ connectionString, max: 1, connectionTimeoutMillis: 5000 });
const scopedPool = () => new Pool({
  connectionString,
  options: `-c search_path=${schema}`,
  max: 2,
  connectionTimeoutMillis: 5000,
});

let created = false;
let pool: Pool | undefined;
try {
  await admin.query(`CREATE SCHEMA ${identifier}`);
  created = true;
  pool = scopedPool();

  const migration = await readFile(
    new URL("../migrations/001_requests_and_events.sql", import.meta.url),
    "utf8"
  );
  await pool.query(migration);
  const store = new RequestStore(new PostgresDatabase(pool));
  const request = await store.submit({
    id: "REQ-VERIFY",
    requesterRef: "verification-requester",
    categoryRef: "verification-category",
    title: "Verify persistence",
    description: "Disposable PostgreSQL smoke-test record",
  });
  assert.equal(request.status, RequestStatus.SUBMITTED);
  assert.equal((await store.history(request.id)).length, 1);

  await store.changeStatus({
    requestId: request.id,
    expectedVersion: 0,
    to: RequestStatus.ACCEPTED,
    actorRef: "verification-staff",
    authorization: { role: "Staff", action: "CHANGE_STATUS", withinApprovedScope: true },
  });
  assert.equal((await store.history(request.id)).length, 2);

  // A failed event write must also undo the request insert on a real server.
  const database = new PostgresDatabase(pool);
  const failing: Database = {
    query: (sql, values) => database.query(sql, values),
    transaction: (work) => database.transaction((client) => work({
      query: (sql, values) => {
        if (sql.includes("INSERT INTO request_events")) {
          throw new Error("Injected event failure");
        }
        return client.query(sql, values);
      },
    })),
  };
  await assert.rejects(
    new RequestStore(failing).submit({
      id: "REQ-ROLLBACK",
      requesterRef: "verification-requester",
      categoryRef: "verification-category",
      title: "Verify rollback",
      description: "This request must not survive",
    }),
    /Injected event failure/
  );
  assert.equal(await store.get("REQ-ROLLBACK"), null);

  // A fresh connection pool must read the committed request and its history.
  await pool.end();
  pool = scopedPool();
  const reopened = new RequestStore(new PostgresDatabase(pool));
  assert.equal((await reopened.get(request.id))?.status, RequestStatus.ACCEPTED);
  assert.equal((await reopened.history(request.id)).length, 2);
  console.log("PostgreSQL verification passed: migration SQL, atomic writes, rollback, reconnect read");
} finally {
  await pool?.end();
  try {
    if (created) await admin.query(`DROP SCHEMA ${identifier} CASCADE`);
  } finally {
    await admin.end();
  }
}
