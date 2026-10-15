import request from "supertest";

import { RequestApplication } from "../../src/application/request-application.js";
import { type RequestRecord } from "../../src/application/request-repository.js";
import { createApp } from "../../src/api/app.js";
import { SessionStore } from "../../src/auth/sessions.js";
import {
  InMemoryUserDirectory,
  buildSeedUsers,
  type User,
} from "../../src/auth/user-directory.js";
import { RequestStatus } from "../../src/domain/request-status.js";
import { InMemoryRequestRepository } from "../../src/persistence/in-memory-request-repository.js";

export const TEST_PASSWORD = "test-only-password";

/** Hashed once for the whole test run: hashing is deliberately slow. */
export const seedUsers: User[] = await buildSeedUsers(TEST_PASSWORD);

export interface Clock {
  now: Date;
}

export async function buildTestApp(options: { users?: User[]; startAt?: Date } = {}) {
  const clock: Clock = { now: options.startAt ?? new Date("2026-10-13T08:00:00.000Z") };
  const now = () => clock.now;
  const directory = new InMemoryUserDirectory(options.users ?? seedUsers);
  const repository = new InMemoryRequestRepository(now);
  const sessions = new SessionStore();
  const app = createApp({
    requests: new RequestApplication(repository, directory, now),
    directory,
    sessions,
    version: "test",
  });

  /** Signs a seeded user in directly. Logging in is exercised in its own tests. */
  const tokenFor = (username: string): string => {
    const user = directory.findByUsername(username);
    if (!user) throw new Error(`No test user ${username}`);
    return sessions.create(user.id);
  };

  const as = (username: string) => {
    const header = { Authorization: `Bearer ${tokenFor(username)}` };
    // Existing behaviour tests model a client that reads before writing. Raw
    // missing/stale-version inputs are exercised by data-api.integration.test.
    const bodyFor = async (path: string, body: object) => {
      if (!/^\/requests\/[^/]+\/(assign|status|notes|due-date)$/.test(path)) return body;
      if (Object.hasOwn(body, "expectedVersion")) return body;
      const detailPath = path.slice(0, path.lastIndexOf("/"));
      const detail = await request(app).get(`/api/v1${detailPath}`).set(header);
      return { expectedVersion: detail.body.data?.version ?? 0, ...body };
    };
    return {
      get: (path: string) => request(app).get(`/api/v1${path}`).set(header),
      post: async (path: string, body: object = {}) => request(app).post(`/api/v1${path}`).set(header).send(await bodyFor(path, body)),
      patch: async (path: string, body: object = {}) => request(app).patch(`/api/v1${path}`).set(header).send(await bodyFor(path, body)),
    };
  };

  return { app, repository, sessions, directory, clock, as, tokenFor };
}

export const validSubmission = {
  title: "Broken tap in the kitchen",
  description: "The cold tap in the staff kitchen will not turn off.",
  categoryId: "c-facilities",
};

/** A stored request in a chosen state, for tests that need a fixed starting point. */
export function record(id: string, overrides: Partial<RequestRecord> = {}): RequestRecord {
  return {
    id,
    title: "Sample request title",
    description: "Sample request description text.",
    categoryId: "c-facilities",
    requesterId: "u-thandi",
    status: RequestStatus.SUBMITTED,
    ownerId: null,
    dueDate: null,
    submittedAt: "2026-10-01T08:00:00.000Z",
    version: 0,
    ...overrides,
  };
}
