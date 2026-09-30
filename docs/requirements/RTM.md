# Initial Requirements Traceability Matrix (RTM)

Version 0.3 | 9 September 2026 | Owner: Dewald Allers | Status: **requirements baseline proposal; 12 FRs and 5 NFRs**

An evolving matrix is used to link the need and source to the requirement and acceptance criteria. The requirement documents include the official wording; short names are used here in order not to have two contradictory versions of the same information. Names like NEED-P2-02/03 are to be interpreted as NEED-P2-02 and NEED-P2-03. Definitions and full references are provided in the [Part 2 index](README.md).

## Current M1 traceability

| ID / requirement | Stakeholder need | Source | Priority | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- |
| [FR-001: Submit a valid request](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-001](acceptance-criteria.md#ac-fr-001) | Draft |
| [FR-002: Controlled category choice](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-002](acceptance-criteria.md#ac-fr-002) | Draft |
| [FR-003: Own request list and status](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-003](acceptance-criteria.md#ac-fr-003) | Draft |
| [FR-004: Request feedback](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-004](acceptance-criteria.md#ac-fr-004) | Draft |
| [FR-005: Staff queue and details](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-005](acceptance-criteria.md#ac-fr-005) | Draft |
| [FR-006: Category/status filtering](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-006](acceptance-criteria.md#ac-fr-006) | Draft |
| [FR-007: Request ownership](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-007](acceptance-criteria.md#ac-fr-007) | Draft |
| [FR-008: Controlled status transitions](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-008](acceptance-criteria.md#ac-fr-008) | Draft |
| [FR-009: Record work and due date](functional-requirements.md) | NEED-P2-02/03 | SRC-MASTER, pp. 6-7 | Must | [AC-FR-009](acceptance-criteria.md#ac-fr-009) | Draft |
| [FR-010: Management summary and lists](functional-requirements.md) | NEED-P2-03 | SRC-MASTER, p. 7 | Must | [AC-FR-010](acceptance-criteria.md#ac-fr-010) | Draft |
| [FR-011: Attributable lifecycle history](functional-requirements.md) | NEED-P2-02/03 | SRC-MASTER, pp. 6-7 | Must | [AC-FR-011](acceptance-criteria.md#ac-fr-011) | Draft |
| [FR-012: Oldest-first ordering](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Should | [AC-FR-012](acceptance-criteria.md#ac-fr-012) | Draft |
| [NFR-001: Permission enforcement](non-functional-requirements.md) | NEED-P2-04 | SRC-MASTER, pp. 6, 14 | Must | [AC-NFR-001](acceptance-criteria.md#ac-nfr-001) | Draft |
| [NFR-002: History completeness/integrity](non-functional-requirements.md) | NEED-P2-02/03/04 | SRC-MASTER, pp. 6-7 | Must | [AC-NFR-002](acceptance-criteria.md#ac-nfr-002) | Draft |
| [NFR-003: Persistence across restart](non-functional-requirements.md) | NEED-P2-04 | SRC-MASTER, p. 6 | Must | [AC-NFR-003](acceptance-criteria.md#ac-nfr-003) | Draft |
| [NFR-004: First-use usability](non-functional-requirements.md) | NEED-P2-01/04 | SRC-MASTER, p. 6 | Should | [AC-NFR-004](acceptance-criteria.md#ac-nfr-004) | Draft |
| [NFR-005: Responsiveness](non-functional-requirements.md) | NEED-P2-01/02/03/04 | SRC-MASTER, pp. 6, 8 | Should | [AC-NFR-005](acceptance-criteria.md#ac-nfr-005) | Draft |

## Later lifecycle evidence

This list contains reserved column and test identifiers, **not assertions of having performed design, coding, testing or release**. T-FR-001, for example, is to be used for identification of the verification case or suite that satisfies the entire AC-FR-001. Break it up into cases if needed in the future. Fill in file/section, commit, PR and test result references as work progresses; no failures shall ever be substituted for unproven successes.

| Requirement ID | Design / architecture | Implementation | Planned test / verification | Change reference | Acceptance / release evidence |
| --- | --- | --- | --- | --- | --- |
| FR-001 | TBD - M2 | TBD - M3 | T-FR-001 planned; not run | None yet | TBD - M4 |
| FR-002 | TBD - M2 | TBD - M3 | T-FR-002 planned; not run | None yet | TBD - M4 |
| FR-003 | TBD - M2 | TBD - M3 | T-FR-003 planned; not run | None yet | TBD - M4 |
| FR-004 | TBD - M2 | TBD - M3 | T-FR-004 planned; not run | None yet | TBD - M4 |
| FR-005 | TBD - M2 | TBD - M3 | T-FR-005 planned; not run | None yet | TBD - M4 |
| FR-006 | TBD - M2 | TBD - M3 | T-FR-006 planned; not run | None yet | TBD - M4 |
| FR-007 | TBD - M2 | TBD - M3 | T-FR-007 planned; not run | None yet | TBD - M4 |
| FR-008 | TBD - M2 | TBD - M3 | T-FR-008 planned; not run | None yet | TBD - M4 |
| FR-009 | TBD - M2 | TBD - M3 | T-FR-009 planned; not run | None yet | TBD - M4 |
| FR-010 | TBD - M2 | TBD - M3 | T-FR-010 planned; not run | None yet | TBD - M4 |
| FR-011 | TBD - M2 | TBD - M3 | T-FR-011 planned; not run | None yet | TBD - M4 |
| FR-012 | TBD - M2 | TBD - M3 | T-FR-012 planned; not run | None yet | TBD - M4 |
| NFR-001 | TBD - M2 | TBD - M3 | T-NFR-001 planned; not run | None yet | TBD - M4 |
| NFR-002 | TBD - M2 | TBD - M3 | T-NFR-002 planned; not run | None yet | TBD - M4 |
| NFR-003 | TBD - M2 | TBD - M3 | T-NFR-003 planned; not run | None yet | TBD - M4 |
| NFR-004 | TBD - M2 | TBD - M3 | T-NFR-004 planned; not run | None yet | TBD - M4 |
| NFR-005 | TBD - M2 | TBD - M3 | T-NFR-005 planned; not run | None yet | TBD - M4 |

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

**Source:** lack of visibility on status updates for requesters (SRC-MASTER, sections 2-3, pages 6-7).

**NEED-P2-01 -> FR-003 -> AC-FR-003:** a requester must be able to see his own requests as well as the current status. The criterion is implemented by two requesters: A can only see his own two requests and the updated status after refreshing the page.

**Further:** link M2 design of ownership/access; the M3 implementation and PR; the expected future T-FR-003 that will show the expected/actual results; and M4 acceptance and release information. Combine it with NFR-001 in order to confirm the access restriction outside the screen. No such further evidence available at this point.

**In case of change:** giving an ability to see another person's request would affect the permissions, scope, AC-FR-003, NFR-001, privacy issues, design and regression testing. Evaluate and approve the change first.

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

The notes provide insights into how Part 2 requirements impact the system. The notes are not a risk, constraints, or forward engineering deliverable.

| Requirements | Scope / constraint connection | Risk and later consideration to integrate |
| --- | --- | --- |
| FR-001 to FR-004 | Requester submission/tracking; confirm P-01/P-04 and exclude unapproved messaging integrations. | Missing information or confusing feedback could lose requests or create duplicate submissions; consider validation and testability. |
| FR-005 to FR-009; NFR-001 | Authorised handling; confirm the permission matrix and transitions. | Excessive access or invalid transitions could expose sensitive information or give misleading status; consider trust boundaries and security testing. |
| FR-010 | Oversight reporting; agree due-date/open/overdue meanings. | An incorrect overdue rule could mislead management; consider consistent time handling, data quality and test fixtures. |
| FR-011; NFR-002/003 | Reliable, attributable service record. | Lost or incomplete history undermines accountability; consider persistence, consistent updates and recovery evidence. |
| FR-012; NFR-004/005 | Small team and low-cost constraints; proposed convenience/quality targets remain negotiable. | Optional scope or unsupported load assumptions can consume time; consider usability, workload tests and later capacity/cost choices. |

Links to approved stakeholder, scope, constraint, risk and forward-engineering IDs can be added during later project integration. Those sections are outside this branch.

## Keeping it current

For a new requirement, allocate a new ID and add its source/need, priority and AC link. For a change, retain the ID, record the approved change reference and update affected links and tests. Do not reuse deleted/retired IDs. Before baseline review, check every requirement has criteria and no AC is orphaned. Link the reviewed commit and actual approvals from the relevant pull request; formal project baseline sign-off is a later integration step.

Sources: SRC-MASTER, section 11, p. 12; SRC-M1, section 3, p. 3. Full references: [Part 2 index](README.md#references).
