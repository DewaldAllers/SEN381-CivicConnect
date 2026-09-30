export type UserRole =
  | "Requester"
  | "Staff"
  | "Management";

export type RequestAction =
  | "READ"
  | "UPDATE"
  | "ASSIGN"
  | "CHANGE_STATUS"
  | "RECORD_ACTION"
  | "VIEW_REPORT";

export interface AuthorizationContext {
  role: UserRole;
  action: RequestAction;
  ownsRequest?: boolean;
  withinApprovedScope?: boolean;
}

export class AuthorizationPolicy {
  public static isAllowed(
    context: AuthorizationContext
  ): boolean {
    switch (context.role) {
      case "Requester":
        return (
          context.action === "READ" &&
          context.ownsRequest === true
        );

      case "Staff":
        return (
          context.withinApprovedScope === true &&
          [
            "READ",
            "UPDATE",
            "ASSIGN",
            "CHANGE_STATUS",
            "RECORD_ACTION",
          ].includes(context.action)
        );

      case "Management":
        return (
          context.withinApprovedScope === true &&
          [
            "READ",
            "VIEW_REPORT",
          ].includes(context.action)
        );

      default:
        return false;
    }
  }
}