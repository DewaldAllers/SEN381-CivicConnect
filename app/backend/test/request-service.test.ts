import { describe, expect, it } from "vitest";

import { RequestService } from "../src/application/request-service.js";
import { RequestStatus } from "../src/domain/request-status.js";

describe("RequestService", () => {
  it("allows authorised staff to accept a submitted request", () => {
    const request = {
      id: "REQ-001",
      status: RequestStatus.SUBMITTED,
    };

    const updated = RequestService.changeStatus(
      request,
      RequestStatus.ACCEPTED,
      {
        role: "Staff",
        action: "CHANGE_STATUS",
        withinApprovedScope: true,
      }
    );

    expect(updated.status).toBe(RequestStatus.ACCEPTED);
  });

  it("rejects an unauthorised status change", () => {
    const request = {
      id: "REQ-001",
      status: RequestStatus.SUBMITTED,
    };

    expect(() =>
      RequestService.changeStatus(
        request,
        RequestStatus.ACCEPTED,
        {
          role: "Requester",
          action: "CHANGE_STATUS",
          ownsRequest: true,
        }
      )
    ).toThrow("Unauthorised status change");
  });

  it("rejects an invalid status transition", () => {
    const request = {
      id: "REQ-001",
      status: RequestStatus.CLOSED,
    };

    expect(() =>
      RequestService.changeStatus(
        request,
        RequestStatus.SUBMITTED,
        {
          role: "Staff",
          action: "CHANGE_STATUS",
          withinApprovedScope: true,
        }
      )
    ).toThrow("Invalid request status transition");
  });
});