import { describe, expect, it } from "vitest";
import {
  AuthorizationPolicy,
  AuthorizationContext,
} from "../src/authorization/authorization-policy.js";

describe("AuthorizationPolicy", () => {
  it("allows a requester to read their own request", () => {
    const context: AuthorizationContext = {
      role: "Requester",
      action: "READ",
      ownsRequest: true,
    };

    expect(AuthorizationPolicy.isAllowed(context)).toBe(true);
  });

  it("denies a requester reading another user's request", () => {
    const context: AuthorizationContext = {
      role: "Requester",
      action: "READ",
      ownsRequest: false,
    };

    expect(AuthorizationPolicy.isAllowed(context)).toBe(false);
  });

  it("allows staff to operate within their approved scope", () => {
    const context: AuthorizationContext = {
      role: "Staff",
      action: "UPDATE",
      withinApprovedScope: true,
    };

    expect(AuthorizationPolicy.isAllowed(context)).toBe(true);
  });

  it("denies staff operating outside their approved scope", () => {
    const context: AuthorizationContext = {
      role: "Staff",
      action: "UPDATE",
      withinApprovedScope: false,
    };

    expect(AuthorizationPolicy.isAllowed(context)).toBe(false);
  });

  it("allows management to view reports within scope", () => {
    const context: AuthorizationContext = {
      role: "Management",
      action: "VIEW_REPORT",
      withinApprovedScope: true,
    };

    expect(AuthorizationPolicy.isAllowed(context)).toBe(true);
  });

  it("denies management from changing request status", () => {
    const context: AuthorizationContext = {
      role: "Management",
      action: "CHANGE_STATUS",
      withinApprovedScope: true,
    };

    expect(AuthorizationPolicy.isAllowed(context)).toBe(false);
  });

  it("denies an unauthorised requester action", () => {
    const context: AuthorizationContext = {
      role: "Requester",
      action: "CHANGE_STATUS",
      ownsRequest: true,
    };

    expect(AuthorizationPolicy.isAllowed(context)).toBe(false);
  });
});