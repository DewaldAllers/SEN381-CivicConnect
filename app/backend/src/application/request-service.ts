import {
  AuthorizationContext,
  AuthorizationPolicy,
} from "../authorization/authorization-policy.js";

import {
  RequestStatus,
} from "../domain/request-status.js";

import {
  RequestStatusPolicy,
  StatusTransitionContext,
} from "../domain/request-status-policy.js";

export interface ServiceRequest {
  id: string;
  status: RequestStatus;
}

export class RequestService {
  public static changeStatus(
    request: ServiceRequest,
    to: RequestStatus,
    authorization: AuthorizationContext,
    transition: StatusTransitionContext = {}
  ): ServiceRequest {
    const authorised = AuthorizationPolicy.isAllowed({
      ...authorization,
      action: "CHANGE_STATUS",
    });

    if (!authorised) {
      throw new Error("Unauthorised status change");
    }

    const allowedTransition = RequestStatusPolicy.canTransition(
      request.status,
      to,
      transition
    );

    if (!allowedTransition) {
      throw new Error("Invalid request status transition");
    }

    return {
      ...request,
      status: to,
    };
  }
}