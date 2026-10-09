# Technical Debt Register

Version 3.0 | Opened 9 October 2026 | Owner: Tristan Els | Status: **open for M3; 8 entries**

Technical debt is a shortcut the team took on purpose, or discovered and chose not to pay off yet. It is not the same as a defect. A defect is wrong. A debt item works, and costs something every time anyone touches the area around it.

Every entry says why it was taken on, what it costs while it stands, and what paying it off would involve. SRC-M3 section 12 (p. 6) asks for important deferred compromises and known maintainability concerns.

## How an item gets here

Deliberate debt is a decision. It has a reason, and usually an entry in the [decision log](../decisions/README.md) behind it.

Accidental debt is found rather than chosen, normally during review or while building something next to it.

Both belong here. The distinction matters at the defence, because deliberate debt with a recorded reason is engineering judgement, and accidental debt nobody noticed is not.

## Interest

Interest is what the item costs while it stands, not what fixing it would cost. An item with no interest is not debt, it is just a choice, and it does not belong in this register.

## Register

| ID | Debt item | Origin | Why it was taken on | Interest while it stands | Repayment | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TD-001 | Requests are stored in an in-memory `Map` in `app/backend/src/api/app.ts`. Nothing survives a restart. | Deliberate | The M2 vertical slice existed to prove the status transition rules and the API boundary. Wiring PostgreSQL before ADR-002 was approved would have been building against an open decision, which RSK-019 warns about. | NFR-003 cannot be verified at all. FR-011 history cannot be written. Every requirement that needs a real query is blocked behind this one item, which makes it the critical path into M3. | Implement the ADR-002 persistence boundary against PostgreSQL 18.6, with the request and event records committing together. | Dewald | Open |
| TD-002 | `app/backend/src/api/app.ts` passes `withinApprovedScope: true` as a fixed value, so the authorisation policy is never evaluated against a real category grant. | Deliberate | No identity source exists yet, so there is no grant to evaluate. The policy itself is implemented and tested, which is what the seven authorisation cases cover. | NFR-001 has a tested rule and no enforced boundary. The permission matrix defines scope by category and nothing reads it. This is the weakest claim in the project and is carried as RSK-013. | Read the approved category grant from the authenticated principal and evaluate it in the policy, then extend the permission test matrix to the matrix rows. | Liam | Open |
| TD-003 | No history event is written when a status changes. `request-service.ts` changes the status and records nothing. | Deliberate | The event store depends on TD-001. Writing events into an in-memory map would have proved nothing about the atomic commit ADR-002 requires. | NFR-002 is the integrity rule the whole data design rests on, and it currently has no implementation to verify. FR-004 feedback and FR-011 history both read from events that do not exist. | Write the event in the same transaction as the request change, under ADR-002, and add the exactly-one-event check to the suite. | Dewald | Open |
| TD-004 | The caller identity is supplied by the endpoint rather than taken from an authenticated session. | Deliberate | Authentication was out of the M2 slice, and ADR-003 does not select an authentication mechanism. | FR-003 cannot be built, because a requester scoped read needs to know who is asking. It also blocks any end to end journey, which M3 requires at least two of. | Select and record an authentication approach, then take the principal from the session. The decision needs an ADR because it is a security boundary. | Liam | Open |
| TD-005 | The CI workflow runs the tests and the type check but does not gate. A red run can still be merged. | Deliberate | Recorded as DEC-012. The workflow was added the day the first tests existed, and making it a required check before the team trusted it would have blocked merges on unrelated failures. | A green run carries no guarantee that anyone looked. SRC-M3 section 9 (p. 5) requires at least one meaningful failure to block progression, so this is a direct M3 gap rather than a background concern. | Make the workflow a required status check in the branch protection rules, and confirm with a deliberately failing run. | Liam | Open |
| TD-006 | The dependency audit is run by hand. `npm audit` is not a step in the workflow. | Accidental | The audit was run once during M2 integration and reported 0 vulnerabilities across 144 packages. Adding it to the workflow was not done at the time. | A vulnerable package can enter on any dependency change with nothing to catch it. Carried as RSK-017, which moved to 6 once real dependencies existed. | Add an audit step to the workflow and decide what severity fails the build. | Liam | Open |
| TD-007 | No frontend exists. ADR-003 selects React 19.3.0 and Vite 8.3.x and neither has been installed or run by anyone. | Accidental | M2 construction went into the backend slice because that is where the two design decisions lived. The frontend was never started. | ASM-005 assumes the selected stack runs on the team machines, and half of it is unproven. NFR-004 usability has nothing to test against. An end to end journey needs a client, so this blocks the M3 system evidence alongside TD-004. | Either build the client for the frozen M3 scope, or raise a controlled change recording the release candidate as API-only with the reason. | Liam | Open |
| TD-008 | The NFR-004 and NFR-005 targets stand as proposals, and no verification environment is defined. | Deliberate | Recorded as DEC-010 and CR-002. The environment to measure in did not exist when the targets were written, so baselining a threshold nobody could test would have meant changing it later under change control. | Two requirements carry acceptance criteria that cannot be executed. M3 requires one performance exercise, and without a defined environment and data volume the result cannot be compared against anything. | Define the verification environment, data volume and participant selection, then take a first measurement and approve or amend the numbers. | Dewald | Open |

## What this register says about the project

Six of the eight entries are deliberate and trace to a decision record. Two are accidental, TD-006 and TD-007, and both were found rather than chosen.

Four of them block M3 evidence directly. TD-001 and TD-003 block the integrity and persistence requirements. TD-004 and TD-007 block the end to end journey. Those four are the M3 critical path, and the order matters: TD-001 before TD-003, and TD-004 before TD-007 is useful.

TD-005 is the cheapest item in the register and closes a stated M3 requirement, so it is the one worth doing first.

## Relationship to the other registers

Debt is a known compromise the team is carrying. A [defect](../defects/README.md) is behaviour that is wrong. A [risk](../risks/README.md) is a consequence that has not happened yet.

Most entries here have a risk attached, because carrying debt is what creates the exposure. TD-002 is RSK-013, TD-006 is RSK-017, TD-001 and TD-003 sit behind RSK-015 and RSK-022.

An item leaves this register when it is repaid, or when the team decides it is permanent and records that as an accepted limitation in the [release evidence summary](../release/README.md).

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 3: Controlled Construction, Integration, Quality and Release Readiness*. Cited as `SRC-M3`. Sections used: 9 (automated verification and CI quality gates, p. 5), 12 (quality, defect and traceability evidence, p. 6), 16 (residual risk statement, p. 8).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 15 (quality engineering, p. 14), 22 (decision consequence reflection, pp. 21-22).

Full source records are in the [source register](../sources.md).
