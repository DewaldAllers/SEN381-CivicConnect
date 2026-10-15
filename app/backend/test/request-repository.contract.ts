import { beforeEach, describe, expect, it } from "vitest";

import {
  RequestNotFoundError,
  StaleRequestError,
  type NewHistoryEvent,
  type RequestRepository,
} from "../src/application/request-repository.js";
import { RequestStatus } from "../src/domain/request-status.js";

const submitted: NewHistoryEvent = {
  kind: "SUBMITTED",
  actorId: "u-thandi",
  visibleToRequester: true,
  details: {},
};
const statusEvent = (from: string, to: string): NewHistoryEvent => ({
  kind: "STATUS_CHANGED",
  actorId: "u-sipho",
  visibleToRequester: true,
  details: { from, to },
});
const input = (overrides: Partial<{ categoryId: string; requesterId: string; submittedAt: string }> = {}) => ({
  title: "Broken tap in the kitchen",
  description: "The cold tap will not turn off.",
  categoryId: "c-facilities",
  requesterId: "u-thandi",
  submittedAt: "2026-10-01T08:00:00.000Z",
  ...overrides,
});

/**
 * What every RequestRepository must do (ADR-002, NFR-002, NFR-003).
 * The in-memory version runs it today. The PostgreSQL store should pass the
 * same suite: call this function with a factory that returns a fresh, empty store.
 */
export function describeRequestRepositoryContract(
  name: string,
  create: () => Promise<RequestRepository>
): void {
  describe(`RequestRepository contract: ${name}`, () => {
    let repo: RequestRepository;
    beforeEach(async () => {
      repo = await create();
    });

    it("[TC-REPO-01][NFR-002] create saves the request and exactly one SUBMITTED event together", async () => {
      const saved = await repo.create(input(), submitted);

      expect(saved.status).toBe(RequestStatus.SUBMITTED);
      expect(saved.version).toBe(0);
      expect((await repo.findById(saved.id))?.title).toBe("Broken tap in the kitchen");
      const events = await repo.history(saved.id);
      expect(events).toHaveLength(1);
      expect(events[0].kind).toBe("SUBMITTED");
      expect(events[0].actorId).toBe("u-thandi");
    });

    it("[TC-REPO-02][NFR-002] every request gets a unique reference", async () => {
      const a = await repo.create(input(), submitted);
      const b = await repo.create(input(), submitted);
      expect(a.id).not.toBe(b.id);
    });

    it("[TC-REPO-03][NFR-002] update with the current version changes the request and records one event", async () => {
      const saved = await repo.create(input(), submitted);
      const updated = await repo.update(
        saved.id, saved.version, { status: RequestStatus.ACCEPTED },
        statusEvent("Submitted", "Accepted")
      );

      expect(updated.status).toBe(RequestStatus.ACCEPTED);
      expect(updated.version).toBe(saved.version + 1);
      const events = await repo.history(saved.id);
      expect(events.map((e) => e.kind)).toEqual(["SUBMITTED", "STATUS_CHANGED"]);
    });

    it("[TC-REPO-04][NFR-002] update with a stale version is refused and leaves no change and no event", async () => {
      const saved = await repo.create(input(), submitted);
      await repo.update(saved.id, 0, { status: RequestStatus.ACCEPTED }, statusEvent("Submitted", "Accepted"));

      await expect(
        repo.update(saved.id, 0, { status: RequestStatus.REJECTED }, statusEvent("Submitted", "Rejected"))
      ).rejects.toBeInstanceOf(StaleRequestError);

      expect((await repo.findById(saved.id))?.status).toBe(RequestStatus.ACCEPTED);
      expect(await repo.history(saved.id)).toHaveLength(2);
    });

    it("[TC-REPO-05] update of an unknown request is refused and records nothing", async () => {
      await expect(
        repo.update("REQ-NOPE", 0, { status: RequestStatus.ACCEPTED }, statusEvent("Submitted", "Accepted"))
      ).rejects.toBeInstanceOf(RequestNotFoundError);
      expect(await repo.history("REQ-NOPE")).toHaveLength(0);
    });

    it("[TC-REPO-06] appendEvent records a note without changing the request", async () => {
      const saved = await repo.create(input(), submitted);
      await repo.appendEvent(saved.id, {
        kind: "NOTE_ADDED", actorId: "u-sipho", visibleToRequester: false, details: { text: "Called the supplier." },
      });

      expect((await repo.findById(saved.id))?.version).toBe(saved.version);
      const events = await repo.history(saved.id);
      expect(events[1].visibleToRequester).toBe(false);
      expect(events[1].details.text).toBe("Called the supplier.");
    });

    it("[TC-REPO-07][NFR-001] listInCategories never returns a request outside the allowed categories, even if asked for one", async () => {
      await repo.create(input({ categoryId: "c-facilities" }), submitted);
      await repo.create(input({ categoryId: "c-security" }), submitted);

      const allowed = await repo.listInCategories({ categoryIds: ["c-facilities"] });
      expect(allowed.map((r) => r.categoryId)).toEqual(["c-facilities"]);

      const askedForOther = await repo.listInCategories({ categoryIds: ["c-facilities"], categoryId: "c-security" });
      expect(askedForOther).toEqual([]);

      expect(await repo.listInCategories({ categoryIds: [] })).toEqual([]);
    });

    it("[TC-REPO-08][FR-012] listInCategories orders by submission time, and only the order changes", async () => {
      const early = await repo.create(input({ submittedAt: "2026-10-01T08:00:00.000Z" }), submitted);
      const late = await repo.create(input({ submittedAt: "2026-10-03T08:00:00.000Z" }), submitted);
      const middle = await repo.create(input({ submittedAt: "2026-10-02T08:00:00.000Z" }), submitted);

      const oldest = await repo.listInCategories({ categoryIds: ["c-facilities"], oldestFirst: true });
      const newest = await repo.listInCategories({ categoryIds: ["c-facilities"] });

      expect(oldest.map((r) => r.id)).toEqual([early.id, middle.id, late.id]);
      expect(newest.map((r) => r.id)).toEqual([late.id, middle.id, early.id]);
    });

    it("[TC-REPO-09][FR-003] listByRequester returns only that requester's requests", async () => {
      await repo.create(input({ requesterId: "u-thandi" }), submitted);
      await repo.create(input({ requesterId: "u-thandi" }), submitted);
      await repo.create(input({ requesterId: "u-bongani" }), { ...submitted, actorId: "u-bongani" });

      expect(await repo.listByRequester("u-thandi")).toHaveLength(2);
      expect(await repo.listByRequester("u-bongani")).toHaveLength(1);
      expect(await repo.listByRequester("u-nobody")).toEqual([]);
    });
  });
}
