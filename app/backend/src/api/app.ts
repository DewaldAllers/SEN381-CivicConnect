import express, { type Request, type Response } from "express";

import { RequestService } from "../application/request-service.js";
import {
  RequestStatus,
} from "../domain/request-status.js";

export interface StoredRequest {
  id: string;
  status: RequestStatus;
}

const requests = new Map<string, StoredRequest>([
  [
    "REQ-001",
    {
      id: "REQ-001",
      status: RequestStatus.SUBMITTED,
    },
  ],
]);

export const app = express();

app.use(express.json());

app.patch(
  "/api/v1/requests/:id/status",
  (req: Request, res: Response) => {
const requestId = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

const request = requests.get(requestId);

    if (!request) {
      return res.status(404).json({
        error: "Request not found",
      });
    }

    const requestedStatus = req.body.status as RequestStatus;

    if (
      !Object.values(RequestStatus).includes(requestedStatus)
    ) {
      return res.status(400).json({
        error: "Invalid status value",
      });
    }

    try {
      const updatedRequest = RequestService.changeStatus(
        request,
        requestedStatus,
        {
          role: "Staff",
          action: "CHANGE_STATUS",
          withinApprovedScope: true,
        },
        {
          hasOwner: req.body.hasOwner === true,
          hasRejectionReason:
            typeof req.body.rejectionReason === "string" &&
            req.body.rejectionReason.trim().length > 0,
          hasResolutionInformation:
            typeof req.body.resolutionInformation === "string" &&
            req.body.resolutionInformation.trim().length > 0,
        }
      );

      requests.set(updatedRequest.id, updatedRequest);

      return res.status(200).json({
        data: updatedRequest,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Unauthorised status change"
      ) {
        return res.status(403).json({
          error: "Forbidden",
        });
      }

      if (
        error instanceof Error &&
        error.message === "Invalid request status transition"
      ) {
        return res.status(409).json({
          error: "Invalid request status transition",
        });
      }

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

export function resetRequests(): void {
  requests.set("REQ-001", {
    id: "REQ-001",
    status: RequestStatus.SUBMITTED,
  });
}