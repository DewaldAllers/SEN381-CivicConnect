import { readFile } from "node:fs/promises";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run migrations");
}

const pool = new Pool({ connectionString });
const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const version = "001_requests_and_events";
  const applied = await client.query(
    "SELECT 1 FROM schema_migrations WHERE version = $1",
    [version]
  );
  if (applied.rows.length === 0) {
    const migration = await readFile(
      new URL(`../migrations/${version}.sql`, import.meta.url),
      "utf8"
    );
    await client.query(migration);
    await client.query(
      "INSERT INTO schema_migrations (version) VALUES ($1)",
      [version]
    );
    console.log(`Applied migration ${version}`);
  } else {
    console.log(`Migration ${version} already applied`);
  }

  await client.query("COMMIT");
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
