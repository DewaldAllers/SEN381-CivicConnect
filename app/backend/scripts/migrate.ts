import { Pool } from "pg";
import { PostgresDatabase } from "../src/persistence/database.js";
import { migrate } from "../src/persistence/migrations.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run migrations");
}

const pool = new Pool({ connectionString });
try {
  const versions = await migrate(new PostgresDatabase(pool));
  console.log(versions.length ? `Applied migrations: ${versions.join(", ")}` : "All migrations already applied");
} finally {
  await pool.end();
}
