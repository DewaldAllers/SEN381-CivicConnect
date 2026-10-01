# Requirements Traceability Matrix

Version 2.1 | 30 September 2026 | Owner: Tristan Els | Status: **M2 columns populated from the approved architecture, data, technology and design evidence**

Dewald Allers owns the requirement wording this matrix traces. I own the matrix, which means the columns, the statuses and the evidence links.

The matrix links a stakeholder need to a requirement, then follows that requirement into the engineering decisions and the evidence that satisfies it. It is one living matrix for the project. Requirement wording lives in the [functional](functional-requirements.md) and [non-functional](non-functional-requirements.md) requirement documents, and short names are used here so the same sentence is not maintained in two places.

Twelve columns do not fit in one readable table, so the matrix is split into three that share the requirement identifier. Together they carry the fields SRC-M2 section 4.2 (pp. 3-4) asks for.

## How this matrix progressed

Version 1.0 traced need, source, priority and acceptance criterion, and reserved a second table for design, implementation, test and release evidence. Every cell of that second table read TBD, because M1 had produced none of it.

Version 2.0 replaced the reserved table with the columns M2 needs and filled the four that could be filled honestly at the time: architecture responsibility, the data constraints from CR-003 and CR-004, three approved interface decisions, and the change record behind most requirements. Technology, implementation and verification stayed empty because DEC-007 was still open and no code existed.

Version 2.1 fills the rest. The quality driver column now carries ASR-01 to ASR-05 from the architecture work rather than candidates. The architecture column names the modules ADR-001 selected. The data column carries the ownership, integrity and access rules from ADR-002 and the permission matrix. The technology column carries the stack from ADR-003. Three requirements now carry real implementation and verification evidence, and their status moved from Approved to In Development.

Fourteen requirements still read Not yet implemented. That is the accurate state of a project three weeks into construction, and the matrix says so rather than describing intent as progress.

## Status vocabulary

Approved means baselined and unchanged. Changed means a change record has been authorised against it. In Development means implementation has begun and verification exists but the requirement is not met in full. Implemented means the requirement is met and verified. Deferred means the requirement stands but part of it is not approved.

Where a change has been raised and not yet authorised, the status stays at its current value and the raised change is named.

## Requirement identity and acceptance

| ID and requirement | Stakeholder need | Source | Priority | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- |
| [FR-001: Submit a valid request](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-001](acceptance-criteria.md#ac-fr-001) | Approved |
| [FR-002: Controlled category choice](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-002](acceptance-criteria.md#ac-fr-002) | Approved |
| [FR-003: Own request list and status](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-003](acceptance-criteria.md#ac-fr-003) | Approved |
| [FR-004: Request feedback](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-004](acceptance-criteria.md#ac-fr-004) | Approved |
| [FR-005: Staff queue and details](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-005](acceptance-criteria.md#ac-fr-005) | Approved |
| [FR-006: Category and status filtering](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-006](acceptance-criteria.md#ac-fr-006) | Approved |
| [FR-007: Request ownership](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-007](acceptance-criteria.md#ac-fr-007) | Approved |
| [FR-008: Controlled status transitions](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-008](acceptance-criteria.md#ac-fr-008) | **In Development** |
| [FR-009: Record work and due date](functional-requirements.md) | NEED-P2-02/03 | SRC-MASTER, pp. 6-7 | Must | [AC-FR-009](acceptance-criteria.md#ac-fr-009) | Approved |
| [FR-010: Management summary and lists](functional-requirements.md) | NEED-P2-03 | SRC-MASTER, p. 7 | Must | [AC-FR-010](acceptance-criteria.md#ac-fr-010) | Approved |
| [FR-011: Attributable lifecycle history](functional-requirements.md) | NEED-P2-02/03 | SRC-MASTER, pp. 6-7 | Must | [AC-FR-011](acceptance-criteria.md#ac-fr-011) | Approved |
| [FR-012: Oldest first ordering](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Should | [AC-FR-012](acceptance-criteria.md#ac-fr-012) | Approved |
| [NFR-001: Permission enforcement](non-functional-requirements.md) | NEED-P2-04 | SRC-MASTER, pp. 6, 14 | Must | [AC-NFR-001](acceptance-criteria.md#ac-nfr-001) | **In Development** |
| [NFR-002: History completeness and integrity](non-functional-requirements.md) | NEED-P2-02/03/04 | SRC-MASTER, pp. 6-7 | Must | [AC-NFR-002](acceptance-criteria.md#ac-nfr-002) | **In Development** |
| [NFR-003: Persistence across restart](non-functional-requirements.md) | NEED-P2-04 | SRC-MASTER, p. 6 | Must | [AC-NFR-003](acceptance-criteria.md#ac-nfr-003) | Approved |
| [NFR-004: First use usability](non-functional-requirements.md) | NEED-P2-01/04 | SRC-MASTER, p. 6 | Should | [AC-NFR-004](acceptance-criteria.md#ac-nfr-004) | Deferred target (CR-002, DEC-010) |
| [NFR-005: Responsiveness](non-functional-requirements.md) | NEED-P2-01/02/03/04 | SRC-MASTER, pp. 6, 8 | Should | [AC-NFR-005](acceptance-criteria.md#ac-nfr-005) | Deferred target (CR-002, DEC-010) |

## Engineering allocation

The quality driver column carries the architecturally significant requirements recorded in the [architecture and data section](../PED/architecture-and-data.md#b-architecturally-significant-requirements). The architecture column names the logical modules [ADR-001](../decisions/ADR-001-civicconnect-architecture.md) selected, which are responsibilities inside one deployable server rather than separate services.

| ID | Quality driver | Architecture responsibility | Data and persistence | Design and interface decision | Technology decision |
| --- | --- | --- | --- | --- | --- |
| FR-001 | ASR-03 durable records | Application boundary, Request Management, Persistence boundary | Request record with unique reference, requester reference, title, description, category reference, status and submission time (P-01). A rejected submission creates no record. | Planned | ADR-003: Node 22.14.0, Express 5.2.1, TypeScript 7.0.2, PostgreSQL 18.6 |
| FR-002 | ASR-03 | Request Management | Category held as controlled reference data rather than free text. Only approved categories are selectable (P-01). | Planned | ADR-003 |
| FR-003 | ASR-01 scoped access, ASR-03 | Authorisation and scope checks, Request Management | Query scoped by `request.requesterRef` matching the authenticated principal. Knowing a reference alone gives no access ([permission matrix](../data/permission-matrix.md)). | Planned | ADR-003 |
| FR-004 | ASR-02 attributable history | Authorisation and scope checks, History/Audit | Feedback is read from the request event sequence. Requester-facing events only, not internal staff notes (P-04, permission matrix). | [ADR-006](../decisions/ADR-006-api-integration.md) boundary. Feedback stays inside the request history, so there is no second source of status (P-04). | ADR-003 |
| FR-005 | ASR-01, ASR-05 bounded retrieval | Authorisation and scope checks, Request Management | Query scoped by the staff member's approved category grant. An empty grant set gives no access. | Planned | ADR-003 |
| FR-006 | ASR-05 | Request Management | Category reference and status must be queryable as filters. Indexes follow representative data. | Planned | ADR-003 |
| FR-007 | ASR-01, ASR-04 controlled workflow | Request Management, History/Audit | Responsible staff reference held on the request. An assignee must hold a category grant for that request's category. Every ownership change records an event. | Planned | ADR-003 |
| FR-008 | ASR-02, ASR-04 | Request Management, History/Audit | Status constrained to the P-02 transitions, with Rejected and Closed terminal. The request change and its one matching event commit together ([ADR-002](../decisions/ADR-002-request-history-persistence.md)). | [ADR-004](../decisions/ADR-004-request-lifecycle.md): one central RequestStatusPolicy holds the transition table instead of the rules spreading across handlers. [ADR-006](../decisions/ADR-006-api-integration.md): `PATCH /api/v1/requests/:id/status`. | ADR-003 |
| FR-009 | ASR-02, ASR-04 | Request Management, History/Audit | Due date optional and stored in UTC (CR-003). Actions, comments and resolution held as request events carrying actor and recorded time. | Planned | ADR-003 |
| FR-010 | ASR-01, ASR-05 | Authorisation and scope checks, Request Management | Overdue computed from status and due date rather than stored as a second status (CR-003). Counts and drill-down lists use the same management category scope. Counts must survive anonymisation (CR-004). | Overdue is a computed flag, so nothing runs on a schedule to move records into an overdue state (CR-003). | ADR-003 |
| FR-011 | ASR-02, ASR-03 | History/Audit, Persistence boundary | Append-only event sequence carrying request reference, event kind, actor reference, time and the change. Append-only to ordinary users. Must tolerate a redacted actor and redacted free text without losing the event (CR-004). | Planned | ADR-003 |
| FR-012 | ASR-05 | Request Management | Submission time must be orderable oldest first within the permitted scope. | Planned | ADR-003 |
| NFR-001 | ASR-01 | Authorisation and scope checks, cross cutting | Authorisation evaluated on the server data-access paths before any query or change, not in the interface. Deny by default where no grant exists. Rows defined by the [permission matrix](../data/permission-matrix.md). | [ADR-005](../decisions/ADR-005-authorization-policy.md): one central AuthorizationPolicy built from small permission specifications, so role, action and scope rules stay testable on their own. | ADR-003 |
| NFR-002 | ASR-02 | Request Management, History/Audit, Persistence boundary | Exactly one event per successful audited action and none for a failed one. Request change and event commit atomically. A stale attempt is rejected as a conflict rather than overwriting (ADR-002). Ordinary users cannot edit or delete events; the CR-004 administrative route is the stated exception. | ADR-002 fixes the atomic business boundary. ADR-004 requires a valid transition to produce its event. | ADR-003 |
| NFR-003 | ASR-03 | Persistence boundary | Persistent store required. In-memory state alone is rejected by ADR-002. A restart check proves persistence, not recovery. | Planned | ADR-003: PostgreSQL 18.6 |
| NFR-004 | Interaction design, not an ASR | Presentation responsibility | None | Planned | ADR-003: React 19.3.0, Vite 8.3.x |
| NFR-005 | ASR-05 | Request Management, Persistence boundary | The list, detail and management summary query shapes are the ones measured. Indexes follow the selected store and representative data. | Planned | ADR-003 |

## Evidence and control

| ID | Implementation evidence | Verification evidence | Change, risk and decision reference |
| --- | --- | --- | --- |
| FR-001 | Not yet implemented | T-FR-001 planned, not run | CR-002, P-01, ADR-001, ADR-002 |
| FR-002 | Not yet implemented | T-FR-002 planned, not run | CR-002, P-01, ADR-002 |
| FR-003 | Not yet implemented | T-FR-003 planned, not run | CR-002, P-03, ADR-001, ADR-005, FEC-001 |
| FR-004 | Not yet implemented | T-FR-004 planned, not run | CR-002, P-04, ADR-001 |
| FR-005 | Not yet implemented | T-FR-005 planned, not run | CR-002, P-03, ADR-005, FEC-001 |
| FR-006 | Not yet implemented | T-FR-006 planned, not run | ASR-05, ADR-002 |
| FR-007 | Not yet implemented | T-FR-007 planned, not run | CR-002, P-03, ADR-001, ADR-004 |
| FR-008 | `app/backend/src/domain/request-status.ts`, `request-status-policy.ts`, `src/application/request-service.ts`, `src/api/app.ts` | `test/request-status-policy.test.ts` 9 cases, `test/request-service.test.ts` 3 cases, `test/api.test.ts` 4 cases. 23 tests pass under `npm test` and `npx tsc --noEmit` passes. Both run in `.github/workflows/ci.yml`. | CR-002, P-02, ADR-004, ADR-006, RSK-019 |
| FR-009 | Not yet implemented | T-FR-009 planned, not run | CR-002, CR-003, P-02, FEC-004 |
| FR-010 | Not yet implemented | T-FR-010 planned, not run | CR-002, CR-003, CR-004, P-02, FEC-004 |
| FR-011 | Not yet implemented | T-FR-011 planned, not run | CR-003, CR-004, ADR-002, FEC-002, RSK-006 |
| FR-012 | Not yet implemented | T-FR-012 planned, not run | ASR-05 |
| NFR-001 | `app/backend/src/authorization/authorization-policy.ts`, applied in `request-service.ts` | `test/authorization-policy.test.ts` 7 cases, passing. The caller identity is supplied by the endpoint rather than by an authenticated session, so this verifies the rule and not yet the enforcement boundary. | CR-002, P-03, ADR-005, DEP-001, FEC-001, RSK-013 |
| NFR-002 | Status change in `request-service.ts`. History events are not recorded yet. | Transition rules verified by the 9 status policy cases. The exactly-one-event check has no implementation to run against. | CR-004, ADR-002, ADR-004, FEC-002, RSK-016, RSK-022 |
| NFR-003 | Not yet implemented. The request store is an in-memory map in `src/api/app.ts`. | T-NFR-003 planned, not run | ADR-002, FEC-005, FEC-008, RSK-015, RSK-022 |
| NFR-004 | Not yet implemented | T-NFR-004 planned, not run | CR-002, P-05, DEC-010, RSK-004, FEC-003 |
| NFR-005 | Not yet implemented | T-NFR-005 planned, not run | CR-002, P-05, DEC-010, RSK-004, FEC-003, FEC-007 |

## The end to end trace

SRC-M2 section 9 (p. 9) asks for one meaningful path from requirement through to initial verification. FR-008 is the one that now runs the whole way.

Source. Staff have difficulty prioritising requests, identifying ownership and coordinating work, and there is weak accountability for changes to request status and actions taken (SRC-MASTER, section 2, p. 6).

Need. NEED-P2-02, staff want to find relevant work, establish responsibility and record controlled progress.

Requirement. FR-008, authorised staff may change a request status only through the agreed transitions and with the information each transition requires.

Constraint and quality driver. ASR-04 controlled workflow, and ASR-02 attributable history. A status change without its event is an incorrect outcome, not a delayed report.

Architecture responsibility. Request Management owns the current request state and validates the transition. History/Audit owns the event. ADR-001 places both inside one modular application server so the change and its event can share a local commit boundary.

Data decision. ADR-002 requires the request change and exactly one matching event to commit together, and a stale attempt to be rejected as a conflict rather than overwriting the persisted state.

Design decision. ADR-004 chose a central RequestStatusPolicy holding the transition table, over controller-level checks and over a full State pattern. P-02 has a small, explicit set of transitions, so the State pattern would buy flexibility the project has no use for and charge for it in classes. The cost recorded is that the policy becomes a business-rule component that has to be maintained whenever the lifecycle changes.

Technology decision. ADR-003, Node.js 22.14.0, Express 5.2.1, TypeScript 7.0.2 and Vitest 5.0.2, with PostgreSQL 18.6 proposed for the store.

Interface decision. ADR-006, `PATCH /api/v1/requests/:id/status`, documented in the [API contract](../integration/api-v1.md) with all five error responses.

Application artefact. `request-status.ts` holds the six statuses. `request-status-policy.ts` holds the transition table, including Rejected and Closed as terminal and the information each conditional move requires. `request-service.ts` applies authorisation and then the transition. `app/backend/src/api/app.ts` exposes the endpoint.

Initial verification. 23 tests pass. Nine cover the transition table, including an invalid transition, a rejection without a reason and a move to In Progress without an owner. Seven cover the authorisation policy. Three cover the service. Four cover the endpoint, including 409 on an invalid transition and 404 on an unknown reference. `npx tsc --noEmit` passes. Both run on every push and pull request through `.github/workflows/ci.yml`.

What is still missing. The request store is in memory, the caller identity is supplied rather than authenticated, and no history event is written. FR-008 is therefore In Development rather than Implemented, and NFR-002 has no implementation to verify its exactly-one-event rule against.

## The trace that is not complete

FR-003 was the trace carried through M1 and it still stops short, which is worth showing alongside the one that works.

It runs from the visibility problem in the scenario, through NEED-P2-01 and FR-003, to ASR-01 scoped access, to the requester scope rule in the permission matrix, to ADR-005 and the authorisation policy. It stops there. No requester-facing read has been built, so there is no artefact and no verification.

The two traces differ in one respect. FR-008 had a design problem worth solving early, so it was built first as a vertical slice. FR-003 depends on an authenticated identity, which is M3 work. Ordering construction that way was deliberate, and the matrix shows the consequence rather than levelling both to look equal.

If FR-003 changed so that a requester could see another person's request, the effects would reach NFR-001, AC-FR-003, the permission matrix, the data boundary, the privacy position in CR-004 and every regression test built on the current scoping. That is a change request with an impact analysis, not an edit.

## Requirement dependencies

| Requirements | Scope and constraint connection | Risk and later consideration |
| --- | --- | --- |
| FR-001 to FR-004 | Requester submission and tracking. P-01 and P-04 approved under CR-002, and unapproved messaging integrations stay excluded. | Missing information or confusing feedback could lose requests or create duplicate submissions. Validation and testability matter here. |
| FR-005 to FR-009, NFR-001 | Authorised handling. The permission matrix and the P-02 transitions are the controls. | Excessive access or an invalid transition could expose sensitive information or show a misleading status. Trust boundaries and security testing follow from this group. |
| FR-010 | Oversight reporting. CR-003 settles the meaning of overdue and the clock it runs on. | An incorrect overdue rule misleads management. Consistent time handling, data quality and test fixtures follow from this. |
| FR-011, NFR-002, NFR-003 | A reliable, attributable service record, with a stated administrative exception under CR-004. | Lost or incomplete history undermines accountability. Persistence, atomic writes and recovery evidence follow from this. |
| FR-012, NFR-004, NFR-005 | Small team and low cost constraints. The quality targets are deferred under CR-002 and DEC-010 rather than approved. | Optional scope and unsupported load assumptions consume time. Usability, workload tests and later capacity and cost choices follow from this. |

## Keeping it current

A new requirement gets a new identifier with its source, need, priority and acceptance criterion, and a row in each of the three tables. A changed requirement keeps its identifier, records the change reference, and has its affected links and tests updated. Retired identifiers are not reused.

Before any baseline review, every requirement has an acceptance criterion, no criterion is orphaned, and no cell claims evidence that does not exist. A cell that reads Not yet implemented is a controlled statement. A cell that reads as done without a link behind it is a defect.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 2 to 3 (scenario and capabilities, pp. 6-7), 11 and 11.1 (requirements, traceability and expected final traceability, p. 12).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 4.2 (required RTM progression, pp. 3-4), 9 (required traceability demonstration, p. 9).

Full source records are in the [source register](../sources.md). The version 1.0 shape of this matrix is preserved in the repository history at commit `c0be056`, and version 2.0 at commit `76483f3`.
