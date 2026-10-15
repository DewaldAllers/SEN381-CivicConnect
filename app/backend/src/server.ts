import path from "node:path";

import { createApp } from "./api/app.js";
import { RequestApplication } from "./application/request-application.js";
import {
  InMemoryUserDirectory,
  buildSeedUsers,
  resolveSeedPassword,
} from "./auth/user-directory.js";
import { SessionStore } from "./auth/sessions.js";
import { seedDemoData } from "./demo-data.js";
import { InMemoryRequestRepository } from "./persistence/in-memory-request-repository.js";

const PORT = Number(process.env.PORT ?? 3000);

// Users and category grants are seeded server configuration (ADR-007).
// The shared password comes from the environment, not from the repository.
const directory = new InMemoryUserDirectory(
  await buildSeedUsers(resolveSeedPassword(process.env))
);

// TODO(Dewald): when the PostgreSQL store implements RequestRepository, choose it here
// when DATABASE_URL is set. Until then requests live in memory and are lost on restart (TD-001).
const repository = new InMemoryRequestRepository();
if (process.env.SEED_DEMO_DATA !== "false" && process.env.NODE_ENV !== "production") {
  seedDemoData(repository);
}

const app = createApp({
  requests: new RequestApplication(repository, directory),
  directory,
  sessions: new SessionStore(),
  // Platforms expose the deployed commit under different names; APP_VERSION wins.
  version:
    process.env.APP_VERSION ?? process.env.RENDER_GIT_COMMIT ?? process.env.GIT_COMMIT ?? "dev",
  frontendDir: path.resolve(process.env.FRONTEND_DIR ?? "../frontend"),
});

app.listen(PORT, () => {
  console.log(`CivicConnect API running on port ${PORT}`);
});
