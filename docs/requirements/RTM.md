# Initial Requirements Traceability Matrix (RTM)

Version 0.2 | 8 September 2026 | Owner: Dewald Allers | Status: **Draft; 12 FRs and 5 NFRs**

One evolving matrix connects the source and stakeholder need to each requirement and its acceptance criteria. The requirement files contain the authoritative wording; short labels here avoid maintaining two conflicting copies. Need suffixes such as NEED-P2-02/03 mean both NEED-P2-02 and NEED-P2-03. Definitions and full references are in the [Part 2 index](README.md).

## Current M1 traceability

| ID / requirement | Stakeholder need | Source | Priority | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- |
| [FR-001: Submit a valid request](functional-requirements.md) | NEED-P2-01 | Master p. 7 | Must | [AC-FR-001](acceptance-criteria.md#ac-fr-001) | Draft |
| [FR-002: Controlled category choice](functional-requirements.md) | NEED-P2-01 | Master p. 7 | Must | [AC-FR-002](acceptance-criteria.md#ac-fr-002) | Draft |
| [FR-003: Own request list and status](functional-requirements.md) | NEED-P2-01 | Master p. 7 | Must | [AC-FR-003](acceptance-criteria.md#ac-fr-003) | Draft |
| [FR-004: Request feedback](functional-requirements.md) | NEED-P2-01 | Master p. 7 | Must | [AC-FR-004](acceptance-criteria.md#ac-fr-004) | Draft |
| [FR-005: Staff queue and details](functional-requirements.md) | NEED-P2-02 | Master p. 7 | Must | [AC-FR-005](acceptance-criteria.md#ac-fr-005) | Draft |
| [FR-006: Category/status filtering](functional-requirements.md) | NEED-P2-02 | Master p. 7 | Must | [AC-FR-006](acceptance-criteria.md#ac-fr-006) | Draft |
| [FR-007: Request ownership](functional-requirements.md) | NEED-P2-02 | Master p. 7 | Must | [AC-FR-007](acceptance-criteria.md#ac-fr-007) | Draft |
| [FR-008: Controlled status transitions](functional-requirements.md) | NEED-P2-02 | Master p. 7 | Must | [AC-FR-008](acceptance-criteria.md#ac-fr-008) | Draft |
| [FR-009: Record work and due date](functional-requirements.md) | NEED-P2-02/03 | Master pp. 6-7 | Must | [AC-FR-009](acceptance-criteria.md#ac-fr-009) | Draft |
| [FR-010: Management summary and lists](functional-requirements.md) | NEED-P2-03 | Master p. 7 | Must | [AC-FR-010](acceptance-criteria.md#ac-fr-010) | Draft |
| [FR-011: Attributable lifecycle history](functional-requirements.md) | NEED-P2-02/03 | Master pp. 6-7 | Must | [AC-FR-011](acceptance-criteria.md#ac-fr-011) | Draft |
| [FR-012: Oldest-first ordering](functional-requirements.md) | NEED-P2-02 | Master p. 7 | Should | [AC-FR-012](acceptance-criteria.md#ac-fr-012) | Draft |
| [NFR-001: Permission enforcement](non-functional-requirements.md) | NEED-P2-04 | Master pp. 6, 14 | Must | [AC-NFR-001](acceptance-criteria.md#ac-nfr-001) | Draft |
| [NFR-002: History completeness/integrity](non-functional-requirements.md) | NEED-P2-02/03/04 | Master pp. 6-7 | Must | [AC-NFR-002](acceptance-criteria.md#ac-nfr-002) | Draft |
| [NFR-003: Persistence across restart](non-functional-requirements.md) | NEED-P2-04 | Master p. 6 | Must | [AC-NFR-003](acceptance-criteria.md#ac-nfr-003) | Draft |
| [NFR-004: First-use usability](non-functional-requirements.md) | NEED-P2-01/04 | Master p. 6 | Should | [AC-NFR-004](acceptance-criteria.md#ac-nfr-004) | Draft |
| [NFR-005: Responsiveness](non-functional-requirements.md) | NEED-P2-01/02/03/04 | Master pp. 6, 8 | Should | [AC-NFR-005](acceptance-criteria.md#ac-nfr-005) | Draft |

## Later lifecycle evidence

These are reserved columns and planned test identifiers, **not claims that design, code, testing or release has occurred**. T-FR-001, for example, will identify a verification record or test set covering all AC-FR-001 criteria. Split it into linked cases if needed later. Populate exact file/section, commit, PR and result references as work occurs; never replace a failure with an unsupported success label.

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

The Part 2 branch is `m1-part2-requirements-foundation`. The [previous draft review PR](https://github.com/DewaldAllers/SEN381-CivicConnect/pull/18) preserves the earlier review context; GitHub automatically closed it when the branch was renamed. No approval or merge has occurred, and no replacement PR has been opened. There are no active GitHub issues for these requirements; the earlier setup issues were deleted at the user's request. If issues are created later through the agreed team workflow, add their links alongside the requirement and PR. Issue history has not been reconstructed.

## One trace to present

**Master pp. 6-7:** requesters currently lack visibility of progress.

**NEED-P2-01 -> FR-003 -> AC-FR-003:** a requester must see their own submitted requests and current status. The criterion uses two requesters: A sees A's two requests, not B's, and sees the changed status after a refresh.

**Later:** link the M2 ownership/access design; the M3 implementation and PR; planned T-FR-003 showing expected/actual results; and M4 acceptance/release evidence. Pair this with NFR-001 to check that access restrictions apply beyond the screen. None of this later evidence exists yet.

**If changed:** allowing a requester to view another person's request would affect permissions, scope, AC-FR-003, NFR-001, privacy risks, design and regression tests. Assess and approve that change before updating the baseline.

## Requirement dependencies

These notes help explain the effects of the Part 2 requirements. They are not separate risk, constraint or forward-engineering deliverables.

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

Source: Master section 11, p. 12; M1 section 3, p. 3.
