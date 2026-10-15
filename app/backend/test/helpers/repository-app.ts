import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { Pool } from "pg";
import request from "supertest";
import { createApp } from "../../src/api/app.js";
import { RequestApplication } from "../../src/application/request-application.js";
import { SessionStore } from "../../src/auth/sessions.js";
import { InMemoryUserDirectory } from "../../src/auth/user-directory.js";
import { type Database, PostgresDatabase } from "../../src/persistence/database.js";
import { InMemoryRequestRepository } from "../../src/persistence/in-memory-request-repository.js";
import { migrate } from "../../src/persistence/migrations.js";
import { PostgresRequestRepository } from "../../src/persistence/postgres-request-repository.js";
import { RequestStore } from "../../src/persistence/request-store.js";
import { EmbeddedPostgresDatabase } from "./database.js";
import { seedUsers } from "./test-app.js";

/** Real SQL locally; a separate schema on the CI/test server when configured. */
export async function repositoryApp(kind: "memory" | "postgres", unmigrated = false) {
  const directory = new InMemoryUserDirectory(seedUsers);
  const sessions = new SessionStore();
  let database: Database | undefined;
  let connectionString: string | undefined;
  let cleanup = async () => {};
  if (kind === "postgres") {
    if (process.env.TEST_DATABASE_URL) {
      const schema = `m3_http_${randomUUID().replaceAll("-", "")}`;
      const admin = new Pool({ connectionString: process.env.TEST_DATABASE_URL, connectionTimeoutMillis: 5000 });
      try { await admin.query(`CREATE SCHEMA "${schema}"`); }
      catch (error) { await admin.end(); throw error; }
      const url = new URL(process.env.TEST_DATABASE_URL);
      url.searchParams.set("options", `-c search_path=${schema}`);
      connectionString = url.toString();
      const pool = new Pool({ connectionString, connectionTimeoutMillis: 5000 });
      cleanup = async () => {
        await pool.end();
        try { await admin.query(`DROP SCHEMA "${schema}" CASCADE`); }
        finally { await admin.end(); }
      };
      try {
        const current = await pool.query("SELECT current_schema() AS name");
        if (current.rows[0].name !== schema) throw new Error("Test schema isolation failed");
      } catch (error) { await cleanup(); throw error; }
      database = new PostgresDatabase(pool);
    } else {
      const embedded = new PGlite();
      database = new EmbeddedPostgresDatabase(embedded);
      cleanup = async () => { await embedded.close(); };
    }
    try { if (!unmigrated) await migrate(database); }
    catch (error) { await cleanup(); throw error; }
  }
  const repository = database
    ? new PostgresRequestRepository(new RequestStore(database), directory)
    : new InMemoryRequestRepository();
  const app = createApp({
    requests: new RequestApplication(repository, directory, () => new Date("2026-10-15T08:00:00Z")),
    directory, sessions, version: "data-integration-test",
  });
  const as = (username: string) => {
    const user = directory.findByUsername(username);
    if (!user) throw new Error("Unknown fixture identity");
    const header = { Authorization: `Bearer ${sessions.create(user.id)}` };
    return {
      get: (path: string) => request(app).get(`/api/v1${path}`).set(header),
      post: (path: string, body: object = {}) => request(app).post(`/api/v1${path}`).set(header).send(body),
      patch: (path: string, body: object = {}) => request(app).patch(`/api/v1${path}`).set(header).send(body),
    };
  };
  return { app, as, repository, database, connectionString, close: cleanup };
}
