# CivicConnect API v1

Version 3.0 with proposed integration corrections, 15 October 2026 | Owner: Liam de Villiers | Status: **PostgreSQL adapter connected; corrections awaiting team review**

The API is the HTTP boundary between the client and the CivicConnect backend. The decision behind it is [ADR-006](../decisions/ADR-006-api-integration.md). Sign-in and scope are decided in [ADR-007](../decisions/ADR-007-authentication-and-sessions.md). The boundary is versioned at `/api/v1` so a breaking change can be published alongside the current contract.

Authorisation is applied on the server for every operation. Hiding a control in the interface is not an access decision.

## Conventions

- Base path `/api/v1`. Bodies are JSON.
- Every success is `{ "data": ... }`. Every error is `{ "error": "..." }`, and a validation error also carries `"fields": { "<field>": "<message>" }`.
- Times are ISO 8601 in UTC.
- Every endpoint except `GET /health` and `POST /session` needs `Authorization: Bearer <token>`.
- Assignment, status, note and due-date writes require `expectedVersion`: the non-negative integer `version` returned by the client's last request read. Missing/invalid values return 400; a stale value returns 409 with `code: "stale"`. Reload rather than automatically retrying. Each successful write increments the version, including notes. This enforces the existing frontend/data handoff; the stricter API contract and existing store lifecycle restrictions below require team review/change-control linkage before baselining.

## Status codes

| Code | Meaning here |
| --- | --- |
| 200 / 201 | Done. 201 when something new was created. |
| 400 | A field is missing, out of range or not recognised. `fields` says which. Nothing was saved. |
| 401 | No valid token, or the sign-in details are wrong. |
| 403 | The caller's role is not allowed this action on a request they can see. |
| 404 | The request does not exist **or is outside the caller's scope**. The two answers are identical on purpose (NFR-001). |
| 409 | The action conflicts with the current state: a status transition the rules do not allow, an assignee who cannot take the request, or a request changed by someone else a moment earlier. Nothing was changed and no history event was written. |
| 500 | Anything else. The body never contains internals. |

A response other than 2xx leaves stored data unchanged and records no history event (NFR-002).

## Endpoints

| Method and path | Who | Purpose | Requirement |
| --- | --- | --- | --- |
| `GET /health` | Anyone | `{ status, version }`. `version` is the deployed release, so a running build can be matched to a tag. | Release evidence |
| `POST /session` | Anyone | Body `username`, `password`. Returns `token` and `user` (`id`, `name`, `role`). | NFR-001 |
| `DELETE /session` | Signed in | Ends the session. The token stops working at once. | NFR-001 |
| `GET /categories` | Signed in | The approved category list. | FR-002 |
| `POST /requests` | Requester | Body `title`, `description`, `categoryId`. Returns the saved request, status `Submitted`. | FR-001, FR-002 |
| `GET /requests/mine` | Requester | The caller's own requests, newest first. | FR-003 |
| `GET /requests` | Staff | The queue for the caller's categories. Optional `categoryId`, `status`, `sort=oldest`. Default order is newest first. | FR-005, FR-006, FR-012 |
| `GET /requests/:id` | Owner, staff or management in scope | One request. | FR-003, FR-005 |
| `GET /requests/:id/history` | Same | Events oldest first. A requester sees only events marked visible to them. | FR-004, FR-011 |
| `GET /staff?categoryId=` | Staff | Staff who may take requests in that category, limited to categories the caller can see. | FR-007 |
| `POST /requests/:id/assign` | Staff in scope | Body `assigneeId`, `expectedVersion`. The assignee must be Staff with a grant for the request's category, otherwise 409. | FR-007 |
| `PATCH /requests/:id/status` | Staff in scope | See below. | FR-008 |
| `POST /requests/:id/notes` | Staff in scope | Body `text`, `visibleToRequester`, `expectedVersion`. Returns 201. | FR-009 |
| `PATCH /requests/:id/due-date` | Staff in scope | Body `dueDate` (a date/date-time string, or null/empty string to clear), `expectedVersion`. | FR-009 |
| `GET /management/summary` | Management | `open`, `overdue`, `resolved`, `closed`, `openWithoutDueDate`. Optional `categoryId`, `status`. | FR-010 |
| `GET /management/requests` | Management | The list behind a count. `bucket` is `open`, `overdue`, `resolved` or `closed`, with the same filters. | FR-010 |

Scope for staff and management is the caller's category grants held on the server. A filter can narrow the result and can never widen it.

## Change request status

`PATCH /api/v1/requests/:id/status`

```json
{
  "expectedVersion": 1,
  "status": "Accepted",
  "rejectionReason": "Outside the approved category list",
  "resolutionInformation": "Lock replaced and tested"
}
```

| Field | Required | Description |
| --- | --- | --- |
| `expectedVersion` | Yes | The stored version observed by the browser. Invalid/missing returns 400; stale returns 409 with `code: "stale"`. |
| `status` | Yes | One of `Submitted`, `Accepted`, `Rejected`, `In Progress`, `Resolved`, `Closed`. |
| `rejectionReason` | For Submitted to Rejected | Non-empty after trimming. |
| `resolutionInformation` | For In Progress to Resolved | Non-empty after trimming. |
| `hasOwner` | Ignored | **Changed in v3.0 (CR-007).** Whether a request has an owner is read from the stored request. A client cannot supply it. The field is still accepted so older callers do not break. |

Success: `200 { "data": { "id": "REQ-001", "status": "Accepted" } }`.

The checks run in this order: the request exists and is in scope (404), the role may change status (403), the observed version is valid/current (400/409), the status value is recognised (400), the transition and its required information are allowed (409). The atomic repository write also checks the version, protecting against a race after the initial read.

## History events

Each successful change writes exactly one event, in the same commit as the change. An event carries its actor, time and the old and new values, and is shown as `{ at, actorName, type, text, visibleToRequester }` with `type` one of `Submitted`, `Status`, `Owner`, `Note`, `DueDate`.

For requester responses, staff actors display as "Staff", ownership changes as "Responsibility updated.", and assigned requests expose `ownerId: null`, `ownerName: "Assigned staff"`. Stored audit references remain available to authorised staff/management. Private notes are not returned to requesters.

## Overdue

A request is overdue when it is Accepted or In Progress and its due date is **strictly before** the current time. A request due at exactly the current time is not overdue. Resolved, Closed and Rejected requests are never overdue. A request with no due date is counted separately in `openWithoutDueDate` and is never treated as on time (AC-FR-010).

## Verification

`app/backend/test/api.test.ts` drives every endpoint through HTTP (TC-API-01 to TC-API-34). `app/backend/test/in-memory-request-repository.test.ts` runs the repository contract (TC-REPO-01 to TC-REPO-09) that the PostgreSQL store must also pass. Each test name carries the requirement or acceptance criterion it demonstrates.

The PostgreSQL adapter now runs the same contract in `postgres-request-repository.test.ts`. `data-api.integration.test.ts` checks raw HTTP version enforcement, atomic notes/rollback, due-date clearing, lifecycle guards and masked requester feedback against both adapters. `npm run test:postgres` requires a real `TEST_DATABASE_URL` and includes compiled migration/server-restart verification. See the dated [data evidence](../data/m3-integration-verification.md).

## Current limitations

- Requests/work/history persist in PostgreSQL when `DATABASE_URL` is configured; staging/production requires it. Local development without that variable uses the in-memory adapter. Sessions remain in memory, so users sign in again after a server restart.
- Users and category grants are seeded configuration. There is no way to change a grant while the system runs.
- Sign-in has no lockout or rate limit.
- The category list and field limits are the sample values from P-01 and are still to be decided.
- The integrated data store already restricts assignment after Resolved/Closed/Rejected, notes after Closed/Rejected, and due dates outside Accepted/In Progress. The API now returns 409 consistently for these cases rather than exposing store errors as 500. These are implementation rules for team review, not a claim that P-02 approved additional restrictions.

## Change compatibility

Additive changes that leave existing fields and responses intact stay inside `v1`. A change that removes a field, renames one, or changes the meaning of a status code goes through change control and is published under a new version path. Making `hasOwner` ignored removes no field and changes no code, and is recorded as CR-007.
