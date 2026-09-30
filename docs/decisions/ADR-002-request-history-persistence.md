# ADR-002: Request and history persistence boundary

## Status

Proposed for PED v2.0 / BL-002; pending team review and approval. This is a data-consistency decision, **not** Liam's database-technology decision or a completed physical schema.

## Context and problem

FR-001/003/011 and NFR-003 require durable requests and history. FR-008/009/011 and NFR-002 require every successful submission, ownership/status change or recorded action to have exactly one attributable event; failed actions must not appear successful. FR-005/006/010/012 need scoped filtered and ordered reads. P-01/P-02/P-03 provide proposed field, lifecycle and access detail still open on `main`. A request status changed without its event, or an event without the change, violates the same user-facing operation.

## Alternatives considered

| Direction | Benefit | Integrity consequence |
| --- | --- | --- |
| In-memory request state | Very small prototype footprint. | Reject: acknowledged data cannot survive the NFR-003 controlled restart. |
| Persist request then event as independent commits | Straightforward individual writes. | Reject for audited actions: a failure between commits can leave status and history inconsistent. |
| Put all data/history in one object with one atomic write | Can make a single-object update atomic on a supporting engine. | May grow the object/history unboundedly and complicate chronological queries; engine and limits are not selected. Retain as an implementation option only if it proves the same NFR-002 guarantees. |
| Separate request and event records committed together | Supports chronological events and request-centric queries while preserving one business outcome. | Preferred logical direction; requires a transaction or equivalent atomic commit in the chosen store, plus concurrency/error handling. |

## Proposed decision

Model a current Request and an attributable Request Event sequence as related data owned by their respective logical responsibilities. For each audited business operation, the application validates identity and approved scope, required input and the current workflow state. It then commits the request change and exactly one corresponding event **together** in one persistence transaction or equivalent atomic write boundary. If validation or either write fails, neither change is acknowledged as successful. A failed operation creates no success event.

For concurrent attempts, compare the expected current request state with persisted state inside that boundary; reject a stale attempt as a conflict and require a fresh read before retry. Do not blindly replay a successful-looking operation, which could duplicate the event. The physical concurrency mechanism and any retry/idempotency identifier are deferred to the selected store and interface contract.

Client validation may guide users, but the server owns authorisation and business validation. The storage layer should enforce stable unique references and valid links/required fields where supported; it must not be the only place implementing the workflow. History is append-only to ordinary users. Reporting derives overdue from status and due date rather than persisting a second status. A controlled privacy exception, if Tristan's proposed CR-004 is approved, must be separately specified so it does not quietly undermine NFR-002.

## Rationale and consequences

This decision follows NFR-002's exactly-one event outcome. The team *SEN381 Assignment 2* (2026), Part 2 §2.1 compared separate writes and a multi-document transaction using MongoDB as an example. The useful result is the **atomic business boundary**, not a MongoDB selection. A relational transaction, document transaction or single atomic aggregate write could satisfy it if proven against the actual model. Liam's open PR #28 proposes PostgreSQL and has two peer approvals, but it is not merged or part of an approved BL-002 baseline. Its current status slice stores requests in an in-memory map and does not yet persist history; that is a prototype limitation, not evidence of NFR-002/003 compliance.

The cost is transaction and conflict handling, and the request/event store may be a single point of failure. NFR-003 is a controlled-restart check, not protection from disk loss or corruption. We need a backup/restore position, a tested restore when a target is agreed, schema/migration control, and index/query checks against representative data before claiming recovery or NFR-005 performance. No traffic estimate or uptime promise is invented.

## Dependencies and revisit triggers

- The [proposed P-03 permission matrix](../data/permission-matrix.md) defines category-based staff/management scopes for review; those scope grants, category values and field limits must be approved before final model/authorisation sign-off.
- Liam's selected database and interface design determine the physical transaction API, indexes, migrations, timestamps and deployment behaviour. They do not change the logical exactly-one-event obligation.
- Tristan owns BL-002, RTM and shared Risk Register integration; this ADR supplies B/C evidence but no final approval.
- Revisit if the approved requirements change event semantics, retention/privacy handling, reporting access patterns, or if the selected store cannot atomically persist the chosen request/event representation.

## Evidence and links

Requirements: [functional](../requirements/functional-requirements.md), [non-functional](../requirements/non-functional-requirements.md), [proposed detail](../requirements/decisions-to-confirm.md). Conceptual model: [PED contribution](../PED/architecture-and-data.md#c-initial-data-model-and-ownership). Implementer hand-off and planned checks: [request/history contract](../data/request-history-contract.md). Architecture: [ADR-001](ADR-001-civicconnect-architecture.md). No implemented persistence or test result is claimed.
