// Runs the browser journeys against a real PostgreSQL database.
//
// It makes one temporary schema, migrates it, points the server at it, runs the
// tests and drops the schema afterwards. The shared tables are never touched.
//
//   node --env-file=../backend/.env run-on-postgres.mjs
//
// It reads TEST_DATABASE_URL, or DATABASE_URL when that is not set. The address
// stays in the environment and is never printed.
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const backend = path.resolve(here, "../backend");
const { Pool } = createRequire(path.join(backend, "package.json"))("pg");

const base = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
if (!base) {
  console.error("Set TEST_DATABASE_URL or DATABASE_URL to a PostgreSQL address.");
  process.exit(2);
}

const schema = "e2e_" + randomBytes(6).toString("hex");
const option = encodeURIComponent(`-c search_path=${schema}`);
const scoped = base + (base.includes("?") ? "&" : "?") + "options=" + option;

const admin = new Pool({ connectionString: base });
let status = 1;
try {
  await admin.query(`CREATE SCHEMA ${schema}`);
  console.log(`Created temporary schema ${schema}`);
  const env = { ...process.env, DATABASE_URL: scoped, E2E_DATABASE_URL: scoped };
  const shell = process.platform === "win32";

  const migrate = spawnSync("npx", ["tsx", "scripts/migrate.ts"], { cwd: backend, env, stdio: "inherit", shell });
  if (migrate.status !== 0) throw new Error("The migrations failed");

  const run = spawnSync("npx", ["playwright", "test", ...process.argv.slice(2)], { cwd: here, env, stdio: "inherit", shell });
  status = run.status ?? 1;

  // Proof that the journeys wrote to PostgreSQL and not to memory.
  const saved = await admin.query(`SELECT (SELECT count(*)::int FROM ${schema}.service_requests) AS requests, (SELECT count(*)::int FROM ${schema}.request_events) AS events, (SELECT count(*)::int FROM ${schema}.work_records) AS work_records`);
  console.log(`Saved in the temporary schema: ${saved.rows[0].requests} requests, ${saved.rows[0].events} history events, ${saved.rows[0].work_records} work records`);
} catch (error) {
  console.error(String(error.message).replace(/:\/\/[^@\s]*@/g, "://***@"));
} finally {
  await admin.query(`DROP SCHEMA IF EXISTS ${schema} CASCADE`);
  await admin.end();
  console.log(`Dropped temporary schema ${schema}`);
}
process.exit(status);
