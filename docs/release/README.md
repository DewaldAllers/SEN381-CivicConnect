# Release evidence summary

Version 3.0 | Opened 9 October 2026 | Owner: Tristan Els | Status: **NOT READY, construction in progress**

This is where the separate pieces of M3 evidence become one argument about whether CivicConnect can be released. It is filled in as the evidence arrives and classified at the release review.

The classification earns little on its own. The evidence and the reasoning behind it are what count, and a readiness claim with a failed gate behind it is worth less than an honest NOT READY.

## Release candidate

| Field | Entry |
| --- | --- |
| Release candidate tag | Not yet cut |
| Commit | Not yet identified |
| PED version | v3.0, in progress |
| Scope included | The frozen M3 core scope, agreed by the team |
| Date classified | Not yet classified |

The assessed version is the tag named here. The demonstration has to run against that tag and not against whatever is on `main` at the time.

## Evidence summary

| Evidence area | Result | Interpretation | Concern or action |
| --- | --- | --- | --- |
| Build and CI | Passing | `npm ci`, `npm test` and `npx tsc --noEmit` run on every push and pull request. The workflow reports and does not gate, so a red run can still merge. | TD-005. Make the workflow a required status check, which SRC-M3 section 9 (p. 5) requires |
| Automated regression | 23 tests passing | 9 status transition, 7 authorisation, 3 service, 4 API. They cover the P-02 transition rules and the endpoint responses. | Below the M3 minimum of 15 meaningful cases across the required mix. No E2E or black-box functional cases exist |
| API and integration | 4 cases passing | One endpoint, `PATCH /api/v1/requests/:id/status`, with success, invalid transition, unknown reference and invalid status value. | M3 requires at least 3 API or integration cases against a real integration. These run against an in-memory store, so no integration is exercised |
| System and E2E | None | No end to end journey can run. There is no client, no authentication and no persistence. | TD-001, TD-004 and TD-007. M3 requires at least 2 critical E2E cases |
| Static and security | Partial | `npx tsc --noEmit` exits 0. `npm audit` reported 0 vulnerabilities across 144 packages on 30 September, run by hand. | TD-006. No static analysis tool beyond the type check, and the audit is not in the workflow |
| Performance | None | No performance exercise has been designed or run. | M3 requires one justified workload on a performance-sensitive operation. NFR-005 has no verification environment, which is TD-008 |
| Known defects | 5 raised, 5 closed | All five were build or documentation defects found through peer review during M2. None is open. | No product defect has been recorded, because the M3 construction has not started |
| Acceptance | 3 of 17 requirements in development | FR-008, NFR-001 and NFR-002 carry implementation and verification evidence. Fourteen requirements are not started. | The frozen M3 scope decides which of those fourteen enter the release candidate |

## Current classification

**NOT READY.**

Three of the eight evidence areas have no evidence at all, and one of the required M3 gates does not block. The system has one endpoint, stores nothing and authenticates nobody, so there is no journey a user could complete.

This is the accurate position on 9 October and it is recorded rather than softened. The classification is expected to move as the construction in the [technical debt register](../technical-debt/README.md) is paid off, and the reasoning behind each move stays in this document.

## What would change the classification

CONDITIONALLY READY becomes defensible once the frozen scope runs end to end, the test suite meets the M3 minimum across the required categories, the CI gate blocks on failure, and the staging environment demonstrates the identified release candidate. Known limitations would then be stated as conditions rather than hidden.

READY would additionally need every requirement in the frozen scope verified against its acceptance criteria with no open severity 3 defect. On the current scope and schedule, CONDITIONALLY READY is the realistic target.

## Residual risk

These are the uncertainties that remain after verification, not the work still outstanding. Outstanding work belongs in the technical debt register. A risk belongs here when the tests pass and something could still go wrong.

| Residual risk | Why it remains | Current mitigation | Next action and owner |
| --- | --- | --- | --- |
| Production scale load is untested | A three person student environment cannot represent a municipal workload, and no demand figure exists for CivicConnect. ASM-003 records that no volume was ever supplied. | The planned small performance exercise plus the ADR-001 architecture review | Re-test against a representative environment and a real volume figure before any production use. Dewald |
| The single store is a single point of failure | ADR-002 records it and declines replication without evidence to justify the cost. ASM-008 carries the assumption that one instance is acceptable for an educational deployment. | Recorded rather than designed around. NFR-003 covers a controlled restart only | State an acceptable data loss position and demonstrate a restore. Dewald |
| The institutional environment is unproven | ASM-005 assumes the selected stack runs on the team machines and on the Belgium Campus environment. The backend half is proven. React, Vite and PostgreSQL have not been run by anyone. | The backend, its tests and the type check run on the team machines and on the GitHub runner | Install and run the remaining stack on an institutional machine. Liam |
| Overdue is measured on calendar time | ASM-004 and CR-003. No stakeholder confirmed whether the organisation measures overdue in working hours. | CR-003 records the rule, the time zone and the reasoning, so the position is explicit rather than implied | Confirm with a stakeholder if one becomes reachable. Tristan |
| The data protection position is unconfirmed | ASM-002 and DEC-011. Nobody has established whether the Protection of Personal Information Act binds a student project. | The data model is designed as though it applies, under CR-004, and no artefact claims compliance | Obtain a confirmed answer on applicability. Tristan |

Further residual risks are expected once the M3 suite runs, because a passing test narrows uncertainty rather than removing it. They are added here as they are identified rather than listed in advance.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 3: Controlled Construction, Integration, Quality and Release Readiness*. Cited as `SRC-M3`. Sections used: 9 (automated verification and CI quality gates, p. 5), 13 (performance and basic release readiness, p. 7), 14 (staging and test deployment, p. 7), 15 (release quality review and residual risk, pp. 7-8), 16 (residual risk statement, p. 8).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 15 (quality engineering and evidence standard, p. 14), 17 (environments, deployment and operations, pp. 14-15), 23 (assessment rules, p. 22).

Full source records are in the [source register](../sources.md).
