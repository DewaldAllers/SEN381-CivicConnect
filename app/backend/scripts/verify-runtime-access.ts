import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { RequestStore } from "../src/persistence/request-store.js";
import { RequestStatus } from "../src/domain/request-status.js";
import { type Database, type SqlRow } from "../src/persistence/database.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL must use the restricted app login");
const pool = new Pool({ connectionString, max: 1, connectionTimeoutMillis: 10000 });
const client = await pool.connect();
try {
  const identity = (await client.query(`SELECT r.rolname, r.rolsuper, r.rolcreatedb, r.rolcreaterole,
    r.rolbypassrls, r.rolreplication FROM pg_roles r WHERE r.rolname=current_user`)).rows[0];
  for (const key of ["rolsuper", "rolcreatedb", "rolcreaterole", "rolbypassrls", "rolreplication"]) assert.equal(identity[key], false, key);
  assert.equal((await client.query("SELECT 1 FROM pg_auth_members WHERE member=(SELECT oid FROM pg_roles WHERE rolname=current_user)")).rowCount, 0);
  const access = (await client.query(`SELECT has_schema_privilege(current_user,'public','CREATE') AS schema_create,
    has_database_privilege(current_user,current_database(),'CREATE') AS db_create,
    has_database_privilege(current_user,current_database(),'TEMP') AS db_temp`)).rows[0];
  assert.deepEqual(access, { schema_create: false, db_create: false, db_temp: false });
  const tablePermissions: Record<string, readonly string[]> = {
    request_categories: ["SELECT"], service_requests: ["SELECT", "INSERT", "UPDATE"],
    request_events: ["SELECT", "INSERT"], work_records: ["SELECT", "INSERT"], schema_migrations: [],
  };
  for (const [table, allowed] of Object.entries(tablePermissions)) {
    const owner = (await client.query("SELECT pg_get_userbyid(relowner)=current_user AS owns FROM pg_class WHERE oid=$1::regclass", [`public.${table}`])).rows[0];
    assert.equal(owner.owns, false, `runtime must not own ${table}`);
    for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER"]) {
      const result = await client.query("SELECT has_table_privilege(current_user,$1,$2) AS allowed", [`public.${table}`, privilege]);
      assert.equal(result.rows[0].allowed, allowed.includes(privilege), `${table}: ${privilege}`);
    }
  }
  console.log("Runtime role: no ownership/admin/DDL/TEMP; exact table privileges verified");
  await client.query("BEGIN");
  try {
    // Everything below stays in one rollback-only connection. Identity sequence
    // values can be consumed, but no synthetic application rows are committed.
    const database: Database = {
      query: async <Row extends SqlRow>(sql: string, values: unknown[] = []) => ({ rows: (await client.query<Row>(sql, values)).rows }),
      transaction: async (work) => {
        await client.query("SAVEPOINT operation");
        try { const result = await work(database); await client.query("RELEASE SAVEPOINT operation"); return result; }
        catch (error) { await client.query("ROLLBACK TO SAVEPOINT operation"); throw error; }
      },
    };
    const store = new RequestStore(database);
    const category = (await store.categories())[0];
    assert.ok(category, "Migrations/category seed must be applied by the admin first");
    const requester = { id: "runtime-check-requester", role: "Requester" as const, categoryRefs: [] };
    const staff = { id: "runtime-check-staff", role: "Staff" as const, categoryRefs: [category.id] };
    const request = await store.submit(requester, { id: `ROLE-CHECK-${randomUUID()}`, categoryRef: category.id, title: "Rollback-only permission check", description: "Synthetic permission verification; never committed" });
    await store.assign(staff, { requestId: request.id, expectedVersion: 0, assignee: staff });
    await store.changeStatus(staff, { requestId: request.id, expectedVersion: 1, to: RequestStatus.ACCEPTED });
    await store.recordWork(staff, { requestId: request.id, expectedVersion: 2, text: "Permission check note" });
    await store.setDueDate(staff, { requestId: request.id, expectedVersion: 3, dueAt: null });
    assert.equal((await store.get(staff, request.id))?.version, 4);
    assert.equal((await store.history(staff, request.id)).length, 5);
    for (const sql of [
      "DELETE FROM public.service_requests WHERE false",
      "UPDATE public.request_events SET actor_ref=actor_ref WHERE false",
      "UPDATE public.work_records SET text=text WHERE false",
      "UPDATE public.request_categories SET active=active WHERE false",
      "CREATE TABLE public.runtime_permission_probe (id integer)",
    ]) {
      await client.query("SAVEPOINT denied_operation");
      await assert.rejects(client.query(sql), (error: unknown) => (error as {code?: string}).code === "42501");
      await client.query("ROLLBACK TO SAVEPOINT denied_operation");
    }
    console.log("Request/assignment/status/work/history passed; forbidden writes and DDL denied (42501)");
  } finally { await client.query("ROLLBACK"); }
  console.log("PASS: runtime permission verification complete; synthetic rows rolled back");
} finally { client.release(); await pool.end(); }
