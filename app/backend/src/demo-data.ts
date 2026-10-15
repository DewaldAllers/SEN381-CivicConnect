import {
  type HistoryEvent,
  type RequestRecord,
} from "./application/request-repository.js";
import { RequestStatus } from "./domain/request-status.js";
import { type InMemoryRequestRepository } from "./persistence/in-memory-request-repository.js";

const daysAgo = (now: Date, days: number): string =>
  new Date(now.getTime() - days * 86_400_000).toISOString();

/** Three sample requests, the same ones the client's stand-in server shows. Development and staging only. */
export function seedDemoData(repository: InMemoryRequestRepository, now: Date = new Date()): void {
  const records: RequestRecord[] = [
    { id: "REQ-001", title: "Broken tap in the kitchen", description: "The cold tap in the staff kitchen will not turn off.", categoryId: "c-facilities", requesterId: "u-thandi", status: RequestStatus.SUBMITTED, ownerId: null, dueDate: null, submittedAt: daysAgo(now, 2), version: 0 },
    { id: "REQ-002", title: "Projector not working in room 4", description: "The projector shows a blue screen and nothing else.", categoryId: "c-it", requesterId: "u-thandi", status: RequestStatus.IN_PROGRESS, ownerId: "u-sipho", dueDate: daysAgo(now, 1), submittedAt: daysAgo(now, 6), version: 3 },
    { id: "REQ-003", title: "Gate lock is loose", description: "The side gate lock does not close properly at night.", categoryId: "c-security", requesterId: "u-bongani", status: RequestStatus.ACCEPTED, ownerId: "u-lerato", dueDate: null, submittedAt: daysAgo(now, 4), version: 1 },
  ];
  const event = (
    requestId: string,
    days: number,
    actorId: string,
    kind: HistoryEvent["kind"],
    details: Record<string, unknown>,
    visibleToRequester = true
  ): HistoryEvent => ({ id: "", requestId, at: daysAgo(now, days), actorId, kind, details, visibleToRequester });

  repository.seed(records, [
    event("REQ-001", 2, "u-thandi", "SUBMITTED", {}),
    event("REQ-002", 6, "u-thandi", "SUBMITTED", {}),
    event("REQ-002", 5, "u-sipho", "STATUS_CHANGED", { from: "Submitted", to: "Accepted" }),
    event("REQ-002", 4, "u-sipho", "OWNER_CHANGED", { previousOwnerId: null, newOwnerId: "u-sipho" }),
    event("REQ-002", 3, "u-sipho", "STATUS_CHANGED", { from: "Accepted", to: "In Progress" }),
    event("REQ-002", 3, "u-sipho", "NOTE_ADDED", { text: "Waiting on a new cable from the supplier." }, false),
    event("REQ-003", 4, "u-bongani", "SUBMITTED", {}),
    event("REQ-003", 3, "u-lerato", "STATUS_CHANGED", { from: "Submitted", to: "Accepted" }),
  ]);
}
