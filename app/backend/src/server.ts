import path from "node:path";
import { Pool } from "pg";

import { createApp } from "./api/app.js";
import { RequestApplication } from "./application/request-application.js";
import { type RequestRepository } from "./application/request-repository.js";
import {
  InMemoryUserDirectory,
  buildSeedUsers,
  resolveSeedPassword,
} from "./auth/user-directory.js";
import { SessionStore } from "./auth/sessions.js";
import { seedDemoData } from "./demo-data.js";
import { InMemoryRequestRepository } from "./persistence/in-memory-request-repository.js";
import { PostgresDatabase } from "./persistence/database.js";
import { RequestStore } from "./persistence/request-store.js";
import { PostgresRequestRepository } from "./persistence/postgres-request-repository.js";

const PORT = Number(process.env.PORT ?? 3000);

// Users and category grants are seeded server configuration (ADR-007).
// The shared password comes from the environment, not from the repository.
const directory = new InMemoryUserDirectory(
  await buildSeedUsers(resolveSeedPassword(process.env))
);
const sessions = new SessionStore();

let repository: RequestRepository = new InMemoryRequestRepository();
let pool: Pool | undefined;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query("SELECT 1");

    const database = new PostgresDatabase(pool);
    const requestStore = new RequestStore(database);

    await requestStore.categories();
    repository = new PostgresRequestRepository(requestStore, directory);
    console.log("PostgreSQL connected successfully.");
    console.log("Using the PostgreSQL request repository.");
  } catch (error) {
    await pool.end();
    throw error;
  }
}

if (!pool && ["staging", "production"].includes(process.env.NODE_ENV ?? "")) {
  throw new Error("DATABASE_URL must be set for staging or production");
}

if (
  process.env.SEED_DEMO_DATA !== "false" &&
  process.env.NODE_ENV !== "production" &&
  !process.env.DATABASE_URL
) {
  seedDemoData(repository as InMemoryRequestRepository);
}

const app = createApp({
  requests: new RequestApplication(repository, directory),
  directory,
  sessions,
  // Platforms expose the deployed commit under different names; APP_VERSION wins.
  version:
    process.env.APP_VERSION ??
    process.env.RENDER_GIT_COMMIT ??
    process.env.GIT_COMMIT ??
    "dev",
  frontendDir: path.resolve(process.env.FRONTEND_DIR ?? "../frontend"),
});

const server = app.listen(PORT, () => {
  const address = server.address();
  console.log(`CivicConnect API running on port ${typeof address === "object" && address ? address.port : PORT}`);
});

async function shutdown() {
  server.close(async () => {
    if (pool) await pool.end();
    process.exit(0);
  });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
