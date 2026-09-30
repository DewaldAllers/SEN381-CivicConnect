# Requirements Traceability Matrix

Version 2.0 | 29 September 2026 | Owner: Tristan Els | Status: **rebuilt on the M2 columns; 12 functional and 5 non-functional requirements traced**

Dewald Allers owns the requirement wording this matrix traces. I own the matrix itself from M2 onward, which means the columns, the statuses and the evidence links rather than the requirements.

The matrix links a stakeholder need to a requirement, and then follows that requirement into the engineering decisions and the evidence that satisfies it. It is one living matrix for the project, not a milestone snapshot. Requirement wording lives in the [functional](functional-requirements.md) and [non-functional](non-functional-requirements.md) requirement documents, and short names are used here so the same sentence is not maintained in two places.

Twelve columns do not fit in one readable table, so the matrix is split into three that share the requirement identifier. Together they carry the fields SRC-M2 section 4.2 (pp. 3-4) asks for.

## How this matrix progressed from v1.0

Version 1.0 had two tables. The first traced need, source, priority and acceptance criterion. The second reserved columns for design, implementation, test, change and release evidence, every cell of which read TBD or None yet, because M1 had produced none of it.

Version 2.0 replaces the reserved table with the columns M2 actually needs, and four of them now carry content:

The architecture responsibility column names the responsibility each requirement creates. These are logical groupings taken from the requirements, not modules. Allocating them to modules belongs to the architecture selection.

The data and persistence column carries the constraints the approved changes put on the model, including the UTC storage rule from CR-003 and the redaction tolerance from CR-004. It does not carry the schema, which is not written yet.

The design and interface column carries the three interface decisions already approved, mostly through P-04 and CR-003. The rest are marked Planned.

The change, risk and decision column now links most requirements to a change record, which is the visible difference between a baselined requirement and one that has been reviewed since.

The technology, implementation and verification columns are still empty of evidence, and say so. DEC-007 deferred the stack at M1 and the M2 selection is not recorded yet, so writing anything else in the technology column would be invention.

## Status vocabulary

Approved means baselined and unchanged. Changed means a change record has been authorised against it. Deferred means the requirement stands but part of it is not approved. In Development and Implemented are used once code exists.

Where a change has been raised and not yet authorised, the status stays at its current value and the raised change is named. A recommendation is not an approval.

## Requirement identity and acceptance

| ID and requirement | Stakeholder need | Source | Priority | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- |
| [FR-001: Submit a valid request](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-001](acceptance-criteria.md#ac-fr-001) | Approved, CR-002 raised |
| [FR-002: Controlled category choice](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-002](acceptance-criteria.md#ac-fr-002) | Approved, CR-002 raised |
| [FR-003: Own request list and status](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-003](acceptance-criteria.md#ac-fr-003) | Approved, CR-002 raised |
| [FR-004: Request feedback](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-004](acceptance-criteria.md#ac-fr-004) | Approved, CR-002 raised |
| [FR-005: Staff queue and details](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-005](acceptance-criteria.md#ac-fr-005) | Approved, CR-002 raised |
| [FR-006: Category and status filtering](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-006](acceptance-criteria.md#ac-fr-006) | Approved |
| [FR-007: Request ownership](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-007](acceptance-criteria.md#ac-fr-007) | Approved, CR-002 raised |
| [FR-008: Controlled status transitions](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-008](acceptance-criteria.md#ac-fr-008) | Approved, CR-002 raised |
| [FR-009: Record work and due date](functional-requirements.md) | NEED-P2-02/03 | SRC-MASTER, pp. 6-7 | Must | [AC-FR-009](acceptance-criteria.md#ac-fr-009) | Approved, CR-002 and CR-003 raised |
| [FR-010: Management summary and lists](functional-requirements.md) | NEED-P2-03 | SRC-MASTER, p. 7 | Must | [AC-FR-010](acceptance-criteria.md#ac-fr-010) | Approved, CR-002 and CR-003 raised |
| [FR-011: Attributable lifecycle history](functional-requirements.md) | NEED-P2-02/03 | SRC-MASTER, pp. 6-7 | Must | [AC-FR-011](acceptance-criteria.md#ac-fr-011) | Approved, CR-003 and CR-004 raised |
| [FR-012: Oldest first ordering](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Should | [AC-FR-012](acceptance-criteria.md#ac-fr-012) | Approved |
| [NFR-001: Permission enforcement](non-functional-requirements.md) | NEED-P2-04 | SRC-MASTER, pp. 6, 14 | Must | [AC-NFR-001](acceptance-criteria.md#ac-nfr-001) | Approved, CR-002 raised |
| [NFR-002: History completeness and integrity](non-functional-requirements.md) | NEED-P2-02/03/04 | SRC-MASTER, pp. 6-7 | Must | [AC-NFR-002](acceptance-criteria.md#ac-nfr-002) | Approved, CR-004 raised |
| [NFR-003: Persistence across restart](non-functional-requirements.md) | NEED-P2-04 | SRC-MASTER, p. 6 | Must | [AC-NFR-003](acceptance-criteria.md#ac-nfr-003) | Approved |
| [NFR-004: First use usability](non-functional-requirements.md) | NEED-P2-01/04 | SRC-MASTER, p. 6 | Should | [AC-NFR-004](acceptance-criteria.md#ac-nfr-004) | Approved, CR-002 raised to defer the target |
| [NFR-005: Responsiveness](non-functional-requirements.md) | NEED-P2-01/02/03/04 | SRC-MASTER, pp. 6, 8 | Should | [AC-NFR-005](acceptance-criteria.md#ac-nfr-005) | Approved, CR-002 raised to defer the target |

## Engineering allocation

The quality driver column marks where a requirement looks likely to shape the architecture. It is a candidate list, not the approved set of architecturally significant requirements, which Dewald owns and has not recorded yet. Module allocation is planned for the same reason.

| ID | Quality driver candidate | Architecture responsibility | Data and persistence constraint recorded so far | Design and interface decision | Technology decision |
| --- | --- | --- | --- | --- | --- |
| FR-001 | Data integrity at the entry point | Request submission and validation | Request record with title, description, one approved category, unique reference and submission time (P-01). A rejected submission creates no record. | Planned | Planned, DEC-007 open |
| FR-002 | Data integrity | Request submission and validation | Category held as controlled reference data rather than free text (P-01) | Planned | Planned, DEC-007 open |
| FR-003 | Confidentiality | Requester scoped read | Request query scoped by requester identity (P-03) | Planned | Planned, DEC-007 open |
| FR-004 | Usability, auditability | Requester feedback read | No separate notification store. Feedback is read from the history events (P-04). | Approved: feedback is delivered inside the request history and visible on the next view or refresh. No external messaging channel (P-04). | Planned, DEC-007 open |
| FR-005 | Confidentiality | Staff work queue and detail read | Request query scoped by staff work scope (P-03) | Planned | Planned, DEC-007 open |
| FR-006 | Performance | Staff work queue query | Category and status must be queryable as filters | Planned | Planned, DEC-007 open |
| FR-007 | Accountability | Ownership assignment | Responsible staff member held on the request, and every ownership change recorded as an event | Planned | Planned, DEC-007 open |
| FR-008 | Business correctness | Status transition control | Status constrained to the P-02 transitions. Closed and Rejected are terminal. | Approved: the transitions are a domain rule, not logic that accumulates in screens (CR-002 impact analysis) | Planned, DEC-007 open |
| FR-009 | Business correctness | Work record capture | Due date optional and stored in UTC (CR-003). Actions, comments and resolution held as history events carrying author and time. | Planned | Planned, DEC-007 open |
| FR-010 | Business correctness, performance | Management reporting and query | Overdue computed from the due date and status, not stored (CR-003). Counts must still be produced after a request is anonymised (CR-004). | Approved: overdue is a computed flag, so nothing has to run on a schedule to move records into an overdue state (CR-003) | Planned, DEC-007 open |
| FR-011 | Auditability | Lifecycle history | Append only history events carrying actor, time and change. The table has to tolerate a redacted actor and redacted free text without losing the event (CR-004). | Planned | Planned, DEC-007 open |
| FR-012 | Usability | Staff work queue query | Submission time must be orderable | Planned | Planned, DEC-007 open |
| NFR-001 | Confidentiality, integrity | Authorisation boundary, cross cutting | Authorisation enforced at the data boundary rather than only in the interface (FEC-001). Rows of the permission matrix are outstanding as DEP-001. | Planned | Planned, DEC-007 open |
| NFR-002 | Auditability | History integrity, cross cutting | Exactly one event per successful action. Ordinary users cannot edit or delete events. The administrative redaction route is the stated exception (CR-004). | Planned | Planned, DEC-007 open |
| NFR-003 | Durability | Persistence, cross cutting | Requests and history events survive a controlled restart | Planned | Planned, DEC-007 open |
| NFR-004 | Usability | Interaction design, cross cutting | None | Planned | Planned, DEC-007 open |
| NFR-005 | Performance | Query and workload, cross cutting | The list, detail and management summary query shapes are the ones measured | Planned | Planned, DEC-007 open |

## Current M2 engineering traceability

The following entries record M2 evidence that now exists in the CivicConnect implementation. M1 traceability above is retained as the historical baseline. Where the implementation is only partial, the status reflects the actual evidence rather than claiming full completion.

| Requirement ID | ASR / quality driver | Architecture / module | Data / persistence impact | Design / interface decision | Technology decision | Implementation evidence | Verification evidence | Status | ADR / change / risk reference |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FR-008 | Controlled lifecycle correctness; status changes must follow agreed transitions | Initial backend domain/application slice; final architecture allocation remains subject to the approved M2 architecture baseline | Request status is represented; history/persistence still requires the team's approved data implementation | ADR-004 - central request status policy / transition rules | ADR-003 - Node.js, Express, TypeScript and Vitest proposed baseline | `app/backend/src/domain/request-status.ts`; `app/backend/src/domain/request-status-policy.ts`; `app/backend/src/application/request-service.ts`; `app/backend/src/api/app.ts` | `test/request-status-policy.test.ts`; `test/request-service.test.ts`; `test/api.test.ts`; 23 automated tests currently pass | In Development | ADR-004; ADR-006 |
| NFR-001 | Security / permission enforcement | Initial backend authorization boundary | Access decisions will eventually apply to persisted request data; current slice does not yet perform real authenticated data access | ADR-005 - central authorization policy with role/action/scope rules | ADR-003 - Node.js, Express and TypeScript | `app/backend/src/authorization/authorization-policy.ts`; `app/backend/test/authorization-policy.test.ts` | 7 authorization policy tests currently pass | In Development | ADR-005 |
| NFR-002 | Accountability / history integrity | Backend application + persistence responsibility | Request history is required but is not yet persisted by the current vertical slice | ADR-004 - status changes must lead to attributable history | ADR-003 - technology baseline; final persistence follows the team's data decision | Status change currently occurs in `request-service.ts`, but history recording is not yet implemented | Initial status-transition tests verify business rules; attributable history verification remains planned | In Development | ADR-004 |

### M2 API / integration evidence

The initial frontend-facing HTTP boundary has been established through:

`PATCH /api/v1/requests/:id/status`

Current implementation:

```text
HTTP Request
    ↓
Express API
    ↓
RequestService
    ↓
AuthorizationPolicy
    ↓
RequestStatusPolicy
    ↓
Response



## One trace to show
## Evidence and control

No application code exists yet, so every implementation cell reads the same. The verification identifiers were reserved at M1 and are kept so that a later test result attaches to something already named.

| ID | Implementation evidence | Verification evidence | Change, risk and decision reference |
| --- | --- | --- | --- |
| FR-001 | Not yet implemented | T-FR-001 planned, not run | CR-002, P-01 |
| FR-002 | Not yet implemented | T-FR-002 planned, not run | CR-002, P-01 |
| FR-003 | Not yet implemented | T-FR-003 planned, not run | CR-002, P-03, FEC-001 |
| FR-004 | Not yet implemented | T-FR-004 planned, not run | CR-002, P-04 |
| FR-005 | Not yet implemented | T-FR-005 planned, not run | CR-002, P-03, FEC-001 |
| FR-006 | Not yet implemented | T-FR-006 planned, not run | None |
| FR-007 | Not yet implemented | T-FR-007 planned, not run | CR-002, P-03 |
| FR-008 | Not yet implemented | T-FR-008 planned, not run | CR-002, P-02 |
| FR-009 | Not yet implemented | T-FR-009 planned, not run | CR-002, CR-003, P-02, FEC-004 |
| FR-010 | Not yet implemented | T-FR-010 planned, not run | CR-002, CR-003, CR-004, P-02, FEC-004 |
| FR-011 | Not yet implemented | T-FR-011 planned, not run | CR-003, CR-004, FEC-002, RSK-006 |
| FR-012 | Not yet implemented | T-FR-012 planned, not run | None |
| NFR-001 | Not yet implemented | T-NFR-001 planned, not run | CR-002, P-03, FEC-001, DEP-001 |
| NFR-002 | Not yet implemented | T-NFR-002 planned, not run | CR-004, FEC-002, RSK-006, RSK-016 |
| NFR-003 | Not yet implemented | T-NFR-003 planned, not run | FEC-005 |
| NFR-004 | Not yet implemented | T-NFR-004 planned, not run | CR-002, P-05, RSK-004, FEC-003 |
| NFR-005 | Not yet implemented | T-NFR-005 planned, not run | CR-002, P-05, RSK-004, FEC-003, FEC-007 |

## The end to end trace

SRC-M2 section 9 (p. 9) asks for one meaningful path from requirement through to initial verification. FR-003 is the one carried forward from M1, because it is the requirement that most directly answers the visibility problem in the scenario, and because it cannot be satisfied without NFR-001 also being satisfied.

## M2 end-to-end implementation trace

**Requirement:** FR-008 - Controlled status transitions.

**Requirement evidence:** FR-008 requires authorised staff to change request status only through the agreed transitions and with the required information.

**Project decision:** P-02 defines the proposed lifecycle and transition conditions.

**Design decision:** ADR-004 selects a central request status policy to keep lifecycle rules in one testable location.

**Technology decision:** ADR-003 establishes the proposed backend technology baseline.

**Application evidence:**
- `app/backend/src/domain/request-status.ts`
- `app/backend/src/domain/request-status-policy.ts`
- `app/backend/src/application/request-service.ts`
- `app/backend/src/api/app.ts`

**Interface evidence:**

`PATCH /api/v1/requests/:id/status`

**Verification evidence:**
- `test/request-status-policy.test.ts`
- `test/request-service.test.ts`
- `test/api.test.ts`
- `npm test` - 23 tests passed
- `npx tsc --noEmit` - passed

**Current limitation:** The vertical slice does not yet persist request history or use a real authenticated user identity. Those responsibilities remain to be integrated with the team's approved architecture/data decisions.

This trace demonstrates the M2 progression from requirement → design decision → technology → implementation → initial verification.

## Dependencies of requirement
Source. Requesters have limited visibility of whether a request was received, assigned, delayed, resolved or closed (SRC-MASTER, sections 2 to 3, pp. 6-7).

Need. NEED-P2-01, a requester wants to submit a request and understand its progress and outcome.

Requirement. FR-003, a requester can view a list of their own previously submitted requests with reference, title, submission time and current status. Paired with NFR-001, which requires the permission to be enforced rather than assumed.

Constraint and quality driver. Confidentiality. The list is scoped to one requester, so the requirement is an access control statement as much as a display statement. FEC-001 records that the word authorised carried this whole position at M1 without defining it.

Architecture responsibility. A requester scoped read, with authorisation enforced at the data boundary rather than in the screen that renders the list. Module allocation is not made yet.

Data decision. The request query is scoped by requester identity under P-03, now approved in principle by CR-002. The permission matrix that gives this its rows is outstanding as DEP-001.

Design and interface decision. Not recorded yet for this path. The nearest approved decision is P-04, which keeps status feedback inside the request history that FR-003 reads from, so there is no second source of status for a requester to compare against.

Technology and ADR. Not recorded. DEC-007 deferred the stack at M1 and the M2 selection is outstanding.

Application artefact. None. No code exists.

Initial verification. T-FR-003 and T-NFR-001 are reserved and not run. The check they will carry is the one drafted at M1: two requesters, each seeing only their own requests, with the status updated after a refresh.

The trace stops at the design and technology step, and that is the honest state of it on 29 September 2026. It runs unbroken from the scenario through to an approved data constraint, and the two steps that are missing both have owners and both are inside the M2 baseline that BL-002 is waiting on.

If FR-003 changed so that a requester could see another person's request, the effects would reach NFR-001, AC-FR-003, the permission matrix, the data boundary, the privacy position in CR-004 and every regression test built on the current scoping. That is a change request with an impact analysis, not an edit.

## Requirement dependencies

These notes say what the requirements imply for each other. They are not the risk or forward engineering registers.

| Requirements | Scope and constraint connection | Risk and later consideration |
| --- | --- | --- |
| FR-001 to FR-004 | Requester submission and tracking. P-01 and P-04 now approved under CR-002, and unapproved messaging integrations stay excluded. | Missing information or confusing feedback could lose requests or create duplicate submissions. Validation and testability matter here. |
| FR-005 to FR-009, NFR-001 | Authorised handling. The permission matrix and the transitions are the controls. | Excessive access or an invalid transition could expose sensitive information or show a misleading status. Trust boundaries and security testing follow from this group. |
| FR-010 | Oversight reporting. CR-003 settles the meaning of overdue and the clock it runs on. | An incorrect overdue rule misleads management. Consistent time handling, data quality and test fixtures follow from this. |
| FR-011, NFR-002, NFR-003 | A reliable, attributable service record, now with a stated administrative exception under CR-004. | Lost or incomplete history undermines accountability. Persistence, consistent updates and recovery evidence follow from this. |
| FR-012, NFR-004, NFR-005 | Small team and low cost constraints. The quality targets are deferred under CR-002 rather than approved. | Optional scope and unsupported load assumptions consume time. Usability, workload tests and later capacity and cost choices follow from this. |

## Keeping it current

A new requirement gets a new identifier with its source, need, priority and acceptance criterion, and a row in each of the three tables. A changed requirement keeps its identifier, records the change reference, and has its affected links and tests updated. Retired identifiers are not reused.

Before any baseline review, every requirement has an acceptance criterion, no criterion is orphaned, and no cell claims evidence that does not exist. A cell that reads Planned is a controlled statement. A cell that reads as done without a link behind it is a defect.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 2 to 3 (scenario and capabilities, pp. 6-7), 11 and 11.1 (requirements, traceability and expected final traceability, p. 12).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 4.2 (required RTM progression, pp. 3-4), 9 (required traceability demonstration, p. 9).

Belgium Campus ITversity (n.d.) *SEN381 Project Milestone 1: Engineering Foundation and Requirements Baseline*. Cited as `SRC-M1`. Section used: 3 (required outputs, p. 3).

Full source records are in the [source register](../sources.md). The version 1.0 shape of this matrix is preserved in the repository history at commit `c0be056`.
