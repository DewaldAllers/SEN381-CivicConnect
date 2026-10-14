import { readFile } from "node:fs/promises";
import { type Database } from "./database.js";

const versions = ["001_requests_and_events", "002_categories_and_work"];

/** Serialises concurrent runners and applies each version once, atomically. */
export async function migrate(database: Database): Promise<string[]> {
  return database.transaction(async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(381003)");
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    const applied: string[] = [];
    for (const version of versions) {
      const result = await client.query("SELECT 1 FROM schema_migrations WHERE version = $1", [version]);
      if (result.rows.length > 0) continue;
      const sql = await readFile(new URL(`../../migrations/${version}.sql`, import.meta.url), "utf8");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [version]);
      applied.push(version);
    }
    return applied;
  });
}
