import { describe, expect, it } from "vitest";
import { RequestStatus } from "../src/domain/request-status.js";
import { RequestStatusPolicy } from "../src/domain/request-status-policy.js";

describe("RequestStatusPolicy", () => {
  it("allows Submitted -> Accepted", () => {
    expect(
      RequestStatusPolicy.canTransition(
        RequestStatus.SUBMITTED,
        RequestStatus.ACCEPTED
      )
    ).toBe(true);
  });

  it("allows Submitted -> Rejected when a rejection reason exists", () => {
    expect(
      RequestStatusPolicy.canTransition(
        RequestStatus.SUBMITTED,
        RequestStatus.REJECTED,
        { hasRejectionReason: true }
      )
    ).toBe(true);
  });

  it("rejects Submitted -> Rejected without a rejection reason", () => {
    expect(
      RequestStatusPolicy.canTransition(
        RequestStatus.SUBMITTED,
        RequestStatus.REJECTED
      )
    ).toBe(false);
  });

  it("allows Accepted -> In Progress when an owner exists", () => {
    expect(
      RequestStatusPolicy.canTransition(
        RequestStatus.ACCEPTED,
        RequestStatus.IN_PROGRESS,
        { hasOwner: true }
      )
    ).toBe(true);
  });

  it("rejects Accepted -> In Progress without an owner", () => {
    expect(
      RequestStatusPolicy.canTransition(
        RequestStatus.ACCEPTED,
        RequestStatus.IN_PROGRESS
      )
    ).toBe(false);
  });

  it("allows In Progress -> Resolved with resolution information", () => {
    expect(
      RequestStatusPolicy.canTransition(
        RequestStatus.IN_PROGRESS,
        RequestStatus.RESOLVED,
        { hasResolutionInformation: true }
      )
    ).toBe(true);
  });

  it("allows Resolved -> Closed", () => {
    expect(
      RequestStatusPolicy.canTransition(
        RequestStatus.RESOLVED,
        RequestStatus.CLOSED
      )
    ).toBe(true);
  });

  it("rejects Closed -> Submitted", () => {
    expect(
      RequestStatusPolicy.canTransition(
        RequestStatus.CLOSED,
        RequestStatus.SUBMITTED
      )
    ).toBe(false);
  });

  it("rejects Rejected -> Accepted", () => {
    expect(
      RequestStatusPolicy.canTransition(
        RequestStatus.REJECTED,
        RequestStatus.ACCEPTED
      )
    ).toBe(false);
  });
});