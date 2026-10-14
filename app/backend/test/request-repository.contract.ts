import { beforeEach, describe, expect, it } from "vitest";

import {
  RequestNotFoundError,
  StaleRequestError,
  type NewHistoryEvent,
  type RepositoryPrincipal,
  type RequestRepository,
} from "../src/application/request-repository.js";
import { RequestStatus } from "../src/domain/request-status.js";

const requester: RepositoryPrincipal = {
  id: "u-thandi",
  role: "Requester",
  categoryIds: [],
};

const anotherRequester: RepositoryPrincipal = {
  id: "u-bongani",
  role: "Requester",
  categoryIds: [],
};

const staff: RepositoryPrincipal = {
  id: "u-sipho",
  role: "Staff",
  categoryIds: ["c-facilities", "c-security"],
};

const facilitiesStaff: RepositoryPrincipal = {
  id: "u-sipho",
  role: "Staff",
  categoryIds: ["c-facilities"],
};

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

const input = (
  overrides: Partial<{
    categoryId: string;
    requesterId: string;
    submittedAt: string;
  }> = {},
) => ({
  title: "Broken tap in the kitchen",
  description: "The cold tap will not turn off.",
  categoryId: "c-facilities",
  requesterId: "u-thandi",
  submittedAt: "2026-10-01T08:00:00.000Z",
  ...overrides,
});

/**
 * What every RequestRepository must do (ADR-002, NFR-002, NFR-003).
 *
 * The in-memory version runs it today. The PostgreSQL store should pass
 * the same suite: call this function with a factory that returns a fresh,
 * empty store.
 */
export function describeRequestRepositoryContract(
  name: string,
  create: () => Promise<RequestRepository>,
): void {
  describe(`RequestRepository contract: ${name}`, () => {
    let repo: RequestRepository;

    beforeEach(async () => {
      repo = await create();
    });

    it("[TC-REPO-01][NFR-002] create saves the request and exactly one SUBMITTED event together", async () => {
      const saved = await repo.create(requester, input(), submitted);

      expect(saved.status).toBe(RequestStatus.SUBMITTED);
      expect(saved.version).toBe(0);

      expect(
        (await repo.findById(requester, saved.id))?.title,
      ).toBe("Broken tap in the kitchen");

      const events = await repo.history(requester, saved.id);

      expect(events).toHaveLength(1);
      expect(events[0].kind).toBe("SUBMITTED");
      expect(events[0].actorId).toBe("u-thandi");
    });

    it("[TC-REPO-02][NFR-002] every request gets a unique reference", async () => {
      const first = await repo.create(requester, input(), submitted);
      const second = await repo.create(requester, input(), submitted);

      expect(first.id).not.toBe(second.id);
    });

    it("[TC-REPO-03][NFR-002] update with the current version changes the request and records one event", async () => {
      const saved = await repo.create(requester, input(), submitted);

      const updated = await repo.update(
        staff,
        saved.id,
        saved.version,
        { status: RequestStatus.ACCEPTED },
        statusEvent("Submitted", "Accepted"),
      );

      expect(updated.status).toBe(RequestStatus.ACCEPTED);
      expect(updated.version).toBe(saved.version + 1);

      const events = await repo.history(staff, saved.id);

      expect(events.map((event) => event.kind)).toEqual([
        "SUBMITTED",
        "STATUS_CHANGED",
      ]);
    });

    it("[TC-REPO-04][NFR-002] update with a stale version is refused and leaves no change and no event", async () => {
      const saved = await repo.create(requester, input(), submitted);

      await repo.update(
        staff,
        saved.id,
        saved.version,
        { status: RequestStatus.ACCEPTED },
        statusEvent("Submitted", "Accepted"),
      );

      await expect(
        repo.update(
          staff,
          saved.id,
          saved.version,
          { status: RequestStatus.REJECTED },
          statusEvent("Submitted", "Rejected"),
        ),
      ).rejects.toBeInstanceOf(StaleRequestError);

      expect(
        (await repo.findById(requester, saved.id))?.status,
      ).toBe(RequestStatus.ACCEPTED);

      expect(await repo.history(staff, saved.id)).toHaveLength(2);
    });

    it("[TC-REPO-05] update of an unknown request is refused and records nothing", async () => {
  await expect(
    repo.update(
      staff,
      "REQ-NOPE",
      0,
      { status: RequestStatus.ACCEPTED },
      statusEvent("Submitted", "Accepted"),
    ),
  ).rejects.toBeInstanceOf(RequestNotFoundError);

  await expect(
    repo.history(staff, "REQ-NOPE"),
  ).rejects.toBeInstanceOf(RequestNotFoundError);
});

    it("[TC-REPO-06] appendEvent records a note without changing the request", async () => {
      const saved = await repo.create(requester, input(), submitted);

      await repo.appendEvent(staff, saved.id, {
        kind: "NOTE_ADDED",
        actorId: "u-sipho",
        visibleToRequester: false,
        details: { text: "Called the supplier." },
      });

      expect(
        (await repo.findById(requester, saved.id))?.version,
      ).toBe(saved.version);

      const events = await repo.history(staff, saved.id);

      expect(events).toHaveLength(2);
      expect(events[1].visibleToRequester).toBe(false);
      expect(events[1].details.text).toBe("Called the supplier.");
    });

    it("[TC-REPO-07][NFR-001] listInCategories never returns a request outside the allowed categories, even if asked for one", async () => {
      await repo.create(
        requester,
        input({ categoryId: "c-facilities" }),
        submitted,
      );

      await repo.create(
        requester,
        input({ categoryId: "c-security" }),
        submitted,
      );

      const allowed = await repo.listInCategories(
        facilitiesStaff,
        { categoryIds: ["c-facilities"] },
      );

      expect(allowed.map((record) => record.categoryId)).toEqual([
        "c-facilities",
      ]);

      const askedForOther = await repo.listInCategories(
        facilitiesStaff,
        {
          categoryIds: ["c-facilities"],
          categoryId: "c-security",
        },
      );

      expect(askedForOther).toEqual([]);

      expect(
        await repo.listInCategories(facilitiesStaff, {
          categoryIds: [],
        }),
      ).toEqual([]);
    });

    it("[TC-REPO-08][FR-012] listInCategories orders by submission time, and only the order changes", async () => {
      const early = await repo.create(
        requester,
        input({ submittedAt: "2026-10-01T08:00:00.000Z" }),
        submitted,
      );

      const late = await repo.create(
        requester,
        input({ submittedAt: "2026-10-03T08:00:00.000Z" }),
        submitted,
      );

      const middle = await repo.create(
        requester,
        input({ submittedAt: "2026-10-02T08:00:00.000Z" }),
        submitted,
      );

      const oldest = await repo.listInCategories(staff, {
        categoryIds: ["c-facilities"],
        oldestFirst: true,
      });

      const newest = await repo.listInCategories(staff, {
        categoryIds: ["c-facilities"],
      });

      expect(oldest.map((record) => record.id)).toEqual([
        early.id,
        middle.id,
        late.id,
      ]);

      expect(newest.map((record) => record.id)).toEqual([
        late.id,
        middle.id,
        early.id,
      ]);
    });

    it("[TC-REPO-09][FR-003] listByRequester returns only that requester's requests", async () => {
      await repo.create(
        requester,
        input({ requesterId: "u-thandi" }),
        submitted,
      );

      await repo.create(
        requester,
        input({ requesterId: "u-thandi" }),
        submitted,
      );

      await repo.create(
        anotherRequester,
        input({ requesterId: "u-bongani" }),
        { ...submitted, actorId: "u-bongani" },
      );

      expect(
        await repo.listByRequester(requester, "u-thandi"),
      ).toHaveLength(2);

      expect(
        await repo.listByRequester(anotherRequester, "u-bongani"),
      ).toHaveLength(1);

      expect(
        await repo.listByRequester(requester, "u-nobody"),
      ).toEqual([]);
    });
  });
}