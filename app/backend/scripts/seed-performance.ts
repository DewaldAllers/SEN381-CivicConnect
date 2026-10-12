import { Pool } from "pg";
import { PostgresDatabase } from "../src/persistence/database.js";
import { migrate } from "../src/persistence/migrations.js";
import { seedPerformance } from "../src/persistence/performance-seed.js";

const connectionString = process.env.TEST_DATABASE_URL;
if (!connectionString) throw new Error("TEST_DATABASE_URL is required for synthetic performance data");
const pool = new Pool({ connectionString });
const database = new PostgresDatabase(pool);
const count = Number(process.env.PERF_REQUEST_COUNT ?? 10000);
const namespace = process.env.PERF_NAMESPACE ?? "PERF-M3";
const requesterRefs = (process.env.PERF_REQUESTER_REFS ?? "perf-requester-1,perf-requester-2,perf-requester-3,perf-requester-4,perf-requester-5,perf-requester-6,perf-requester-7,perf-requester-8,perf-requester-9,perf-requester-10").split(",").map((s) => s.trim());
const staffRef = process.env.PERF_STAFF_REF ?? "perf-staff";
const referenceTime = new Date(process.env.PERF_REFERENCE_TIME ?? new Date().toISOString());
try {
  await migrate(database);
  await seedPerformance(database, { count, namespace, requesterRefs, staffRef, referenceTime });
  console.log(JSON.stringify({ count, namespace, requesterRefs, staffRef, referenceTime, synthetic: true }));
} finally {
  await pool.end();
}
