import { InMemoryRequestRepository } from "../src/persistence/in-memory-request-repository.js";
import { describeRequestRepositoryContract } from "./request-repository.contract.js";
import { expect, it } from "vitest";
import { record, validSubmission } from "./helpers/test-app.js";

describeRequestRepositoryContract("in-memory", async () => new InMemoryRequestRepository());

it("new requests and events do not overwrite seeded numeric references", async () => {
  const repository = new InMemoryRequestRepository();
  const requester = { id: "u-thandi", role: "Requester" as const, categoryIds: [] };
  const original = record("REQ-007");
  repository.seed([original], [{
    id: "EVT-009", requestId: original.id, at: original.submittedAt,
    actorId: requester.id, kind: "SUBMITTED", details: {}, visibleToRequester: true,
  }]);
  const saved = await repository.create(requester, {
    ...validSubmission, requesterId: requester.id, submittedAt: original.submittedAt,
  }, { actorId: requester.id, kind: "SUBMITTED", details: {}, visibleToRequester: true });
  expect(saved.id).toBe("REQ-008");
  expect((await repository.history(requester, saved.id))[0].id).toBe("EVT-010");
  expect(await repository.findById(requester, original.id)).toMatchObject(original);
  expect(await repository.listByRequester(requester, requester.id)).toHaveLength(2);
});
