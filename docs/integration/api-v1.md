# CivicConnect API v1

Version 2.0 | 30 September 2026 | Owner: Liam de Villiers | Status: **initial boundary implemented; one endpoint**

The API is the HTTP boundary between the client-facing application and the CivicConnect backend. The decision behind it is [ADR-006](../decisions/ADR-006-api-integration.md). The boundary is versioned at `/api/v1` so that a breaking change can be published alongside the current contract rather than replacing it.

Authorisation is applied on the server for every operation crossing this boundary. Hiding a control in the interface is not an access decision.

## Base path

`/api/v1`

## Change request status

`PATCH /api/v1/requests/:id/status`

Moves a request to a new status through the transitions approved in P-02. The server validates the target request, the requested status value, the caller's permission and the transition rule before it applies the change.

### Path parameters

| Name | Type | Description |
| --- | --- | --- |
| `id` | string | The request reference, for example `REQ-001`. |

### Request body

```json
{
  "status": "Accepted",
  "hasOwner": true,
  "rejectionReason": "Outside the approved category list",
  "resolutionInformation": "Lock replaced and tested"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | string | Yes | Target status. One of `Submitted`, `Accepted`, `Rejected`, `In Progress`, `Resolved`, `Closed`. |
| `hasOwner` | boolean | Conditional | Required as `true` for the move from Accepted to In Progress, because P-02 requires a responsible staff member. |
| `rejectionReason` | string | Conditional | Required and non-empty for the move from Submitted to Rejected. |
| `resolutionInformation` | string | Conditional | Required and non-empty for the move from In Progress to Resolved. |

### Success response

`200 OK`

```json
{
  "data": {
    "id": "REQ-001",
    "status": "Accepted"
  }
}
```

### Error responses

| Status | Condition | Body |
| --- | --- | --- |
| `400 Bad Request` | The supplied status is not a recognised value. | `{ "error": "Invalid status value" }` |
| `403 Forbidden` | The caller is not permitted to change this request's status. | `{ "error": "Forbidden" }` |
| `404 Not Found` | No request exists for the supplied reference. | `{ "error": "Request not found" }` |
| `409 Conflict` | The transition is not permitted from the current status, or the information P-02 requires for it is missing. | `{ "error": "Invalid request status transition" }` |
| `500 Internal Server Error` | Any other failure. | `{ "error": "Internal server error" }` |

A request that returns 400, 403, 404 or 409 leaves the stored status unchanged and records no history event. NFR-002 requires that a failed action is never represented as a successful one.

## Verification

Covered by `app/backend/test/api.test.ts`: a successful status change, an invalid transition, an unknown request reference and an invalid status value. The endpoint was also exercised against the running local server, returning 200 for a valid change and 409 for an invalid transition.

## Current limitations

The caller identity is supplied by the endpoint rather than taken from an authenticated session, so the authorisation policy is exercised with a fixed staff principal and an approved scope. The request store is an in-memory map, so nothing written through this endpoint survives a restart. History events are not recorded yet.

These three gaps are why FR-008, NFR-001 and NFR-002 are traced in the RTM as In Development rather than Implemented. Authentication, the persistent store from [ADR-002](../decisions/ADR-002-request-history-persistence.md) and the history write are M3 work.

## Change compatibility

Additive changes that leave existing fields and responses intact stay inside `v1`. A change that removes a field, renames one, or changes the meaning of a status code goes through change control and is published under a new version path.
