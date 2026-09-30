import { RequestStatus } from "./request-status.js";

export interface StatusTransitionContext {
  hasRequiredInformation?: boolean;
  hasOwner?: boolean;
  hasRejectionReason?: boolean;
  hasResolutionInformation?: boolean;
}

export class RequestStatusPolicy {
  public static canTransition(
    from: RequestStatus,
    to: RequestStatus,
    context: StatusTransitionContext = {}
  ): boolean {
    switch (from) {
      case RequestStatus.SUBMITTED:
        if (to === RequestStatus.ACCEPTED) {
          return true;
        }

        if (to === RequestStatus.REJECTED) {
          return context.hasRejectionReason === true;
        }

        return false;

      case RequestStatus.ACCEPTED:
        if (to === RequestStatus.IN_PROGRESS) {
          return context.hasOwner === true;
        }

        return false;

      case RequestStatus.IN_PROGRESS:
        if (to === RequestStatus.RESOLVED) {
          return context.hasResolutionInformation === true;
        }

        return false;

      case RequestStatus.RESOLVED:
        if (to === RequestStatus.CLOSED) {
          return true;
        }

        return false;

      case RequestStatus.REJECTED:
      case RequestStatus.CLOSED:
        return false;

      default:
        return false;
    }
  }
}