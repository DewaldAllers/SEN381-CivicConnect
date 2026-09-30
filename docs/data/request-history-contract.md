# Request/history persistence contract (implementation hand-off)

Status: proposed technical contract for CivicConnect's M2 architecture/data contribution. It specifies the observable outcome future implementation must deliver; it is **not** an API endpoint, database migration, executable module, or test result. It is part of the [PED v2.0 B/C contribution](../PED/architecture-and-data.md) and follows [ADR-001](../decisions/ADR-001-civicconnect-architecture.md) and [ADR-002](../decisions/ADR-002-request-history-persistence.md).

## Boundary and ownership

Request Management owns current request state and the workflow decision. History/Audit defines an attributable event and the chronological history view. One application operation coordinates both through persistence. The server-side authorisation check gates the operation and any read of request/event data. It must use the approved role/action/data-scope matrix when available; P-03's scope names are not yet settled. Liam owns the concrete interface and technology implementation, including any API path, database client and status-policy integration.

At the 30 September 2026 branch review, Liam's open PR #28 implements a status policy, an authorisation policy, a status-change application service and an initial API endpoint with tests. Its API uses a hard-coded Staff context and an in-memory request map; it has no real identity, database transaction or history write. The code verifies some workflow rules, **not** this persistence contract or the full NFR-001/002/003 outcomes. The approved scope matrix and integrated data boundary remain necessary before those claims can be tested.

## Operation outcomes

| Operation | Required preconditions | One successful outcome | Failure outcome |
| --- | --- | --- | --- |
| Submit a request (FR-001/002, NFR-002) | Valid required details, category from approved list, authenticated/authorised requester under final rules. | Durable unique request reference and submission time; initial status per approved P-02; one matching submission event with actor and time. | Validation, duplicate reference or storage failure: no acknowledged request and no success event. |
| Assign/accept responsibility (FR-007, NFR-002) | Actor permitted in request scope; assignee eligible; expected current state still holds. | Request ownership/current state updated as the approved workflow requires; one matching attributable event. | Denied, ineligible, stale or storage failure: no accepted change or success event. |
| Change status (FR-008, NFR-002) | Actor permitted; transition allowed by approved P-02; required reason/owner/resolution details supplied; expected current state still holds. | New status and one event recording previous/new status, actor, time and relevant details. | Invalid, denied, stale or storage failure: original status remains and no success event appears. |
| Record action/comment/due date/resolution (FR-009, NFR-002) | Actor permitted for the request; required detail and any lifecycle condition satisfied. | Stored request-linked information and one corresponding attributable action event. | Rejected or failed persistence leaves no acknowledged partial update or success event. |

Each success means a **committed** business result, not merely that an HTTP response or UI message was attempted. The transaction/equivalent atomic boundary includes every record changed for that business operation. If the chosen model stores an action only as an event, there is no needless second write, but exactly-one-event and durable-read outcomes still apply. Distinguish a later notification/display failure from a persistence failure; P-04 proposes in-app feedback on the next view/refresh, not external messaging.

## Read and query contract

| Read | Data boundary and ordering |
| --- | --- |
| Requester list/detail and feedback (FR-003/004) | Only the requester's permitted records and visible history/feedback. Never fetch broadly and filter solely in the browser. |
| Staff queue/detail/filter/oldest-first (FR-005/006/012) | Restrict by approved work scope before category/status filters and submission-time ordering. An out-of-scope reference must not expose protected detail. |
| One request's history (FR-011) | Same request permission boundary; chronological order from recorded event time, with an unambiguous tie-breaker selected at physical design. Show actor/time/change subject to privacy rules. |
| Management summary and matching lists (FR-010) | Scope both counts and drill-down lists identically. Derive open/overdue from approved P-02/current state and due date; no invented stored overdue status. |

## Persistence invariants and pending physical choices

1. Acknowledged requests and events survive a controlled application restart (NFR-003). This is separate from backup/restore.
2. For each successfully committed audited business operation, exactly one matching event is persisted; a rejected or rolled-back operation has no success event (NFR-002).
3. The request reference is unique. Each event belongs to one request and retains actor/time/change information required by FR-011. The approved category rule applies to submission.
4. A stale update cannot silently overwrite a newer one. The storage operation checks the expected persisted state and returns conflict if it differs. The exact version/condition mechanism is selected with the database design.
5. Authorisation is enforced before scoped reads or changes. Event history is not modifiable by ordinary users. A proposed administrative redaction exception cannot be implemented until approved scope and accountability effects are specified.
6. The concrete schema, constraints, indexes, timestamp representation, retention/privacy route and backup/restore steps follow the approved technology and change decisions; this document does not assert them as implemented.

## Initial verification cases to implement later

These are **planned checks**, not executed tests or a claim of passing results. They give the future implementation an observable contract.

| Case | Expected observation | Requirement |
| --- | --- | --- |
| Valid submission | One request with unique reference and exactly one submission event; both remain after restart. | FR-001/002, NFR-002/003 |
| Invalid input or unapproved category | Field/category error; no request or success event. | FR-001/002 |
| Allowed status transition with required detail | New status and exactly one matching event with actor/time/old/new values. | FR-008/011, NFR-002 |
| Invalid transition or missing reason/owner | Status unchanged; no success event. | FR-008, NFR-002 |
| Denied requester/staff scope | No protected request/history returned and no record altered. Matrix cases must be filled after P-03 closure. | NFR-001 |
| Failure during event persistence | Whole business operation rolls back; no changed request without event. Injected failure method depends on database. | NFR-002 |
| Two competing updates from the same observed state | At most one commits; the other reports conflict and does not produce a misleading success event. | FR-008, NFR-002 |
| Scoped management summary/overdue | Counts and matching lists agree for the same scope; overdue is computed from the approved rule, including due-date boundary cases. | FR-010 |
| Controlled restart, then restore drill | Restart retains acknowledged values/events. Restore is a separate future check once recovery policy and tooling exist. | NFR-003; deferred recovery risk |

Application tests, integration tests, performance measurements and a restore drill must be added and run when code, database and a verification environment exist. They must not be recorded as passing merely because this contract exists. Tristan's RTM can link the relevant requirement rows to this contract and later replace the pending verification state with actual evidence.
