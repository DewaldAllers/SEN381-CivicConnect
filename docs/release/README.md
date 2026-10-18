# Release evidence summary

Version 4.0 | Opened 9 October 2026, updated 18 October 2026 | Owner: Tristan Els | Status: **final for M4; NOT READY for production, staging with a justified no-go**

This is where the separate pieces of evidence become one argument about whether CivicConnect can be released. Version 3.0 classified the M3 candidate. Version 4.0 is the final classification, for the version assessed at M4.

The classification earns little on its own. The evidence and the reasoning behind it are what count, and a readiness claim with a failed gate behind it is worth less than an honest NOT READY.

## Release candidate

| Field | Entry |
| --- | --- |
| Release candidate tag | `v4.0-final`, on the commit that carries this page |
| Earlier candidate | `v3.0-m3`, the M3 submission |
| Commit | The commit the tag points to. `git rev-list -n 1 v4.0-final` prints it |
| PED version | v4.0 |
| Scope included | All seventeen baselined requirements under DEC-015. Fifteen are Implemented and two, NFR-004 and NFR-005, are Partially implemented. No requirement left the scope. |
| Date classified | 18 October 2026 |

The assessed version is the tag named here. The demonstration has to run against that tag and not against whatever is on `main` at the time.

## Evidence summary

The results below come from the final version, tag `v4.0-final`, plus the browser journeys in `app/e2e`. I ran the checks on 18 October 2026 on the code the tag carries.

| Evidence area | Result | Interpretation | Concern or action |
| --- | --- | --- | --- |
| Build and CI | Passing | CI installs the packages, checks the types, runs the tests with a saved report and audits the dependencies. A high or critical finding in shipped code fails the build (PR #36). A second workflow runs lint and checks the database store against PostgreSQL 18 on backend pull requests (PR #31). A third workflow, added with the browser journeys, runs them in memory and on PostgreSQL on every pull request. | TD-005 is repaid. Dewald made `backend-checks` a required check on `main` on 15 October, with up-to-date branches required. [Pull request #45](https://github.com/DewaldAllers/SEN381-CivicConnect/pull/45) held one failing test, the check went red, GitHub blocked the merge and refused it, and I closed it unmerged |
| Automated regression | 153 tests passing, 2 intentional skips | 11 files: 52 API, 23 store, 23 data and API integration, 13 authentication, 10 in-memory repository, 9 authorisation policy, 9 repository contract, 9 transition, 3 service and 2 persistence lifecycle. The cases use boundary values (TC-API-06), decision tables (TC-API-17 and TC-API-21), a state-transition run (TC-API-19), a concurrency case (T-NFR-002-03) and fault injection (T-NFR-002-02). | The M3 minimum is 15 meaningful cases across a stated mix, and the suite is above it at every level. The 2 skips need a real database or a SQL constraint, and the PostgreSQL run below covers the database one |
| API and integration | Passing, in memory and on PostgreSQL | `api.test.ts` and `data-api.integration.test.ts` send raw authenticated HTTP requests through sign in to the endpoints. `npm run test:postgres` passes 33 tests with 1 intentional skip on PostgreSQL 18.6. It includes the contract cases, the HTTP cases, T-FR-002-01, which saves a request in each of the six categories, and T-NFR-003-01, which restarts the built server with a request in each of the six statuses. `npm run db:verify` passes. | These checks use temporary schemas and leave the shared tables untouched |
| System and E2E | 2 journeys passing | T-E2E-01 takes a request from sent to resolved through three people's pages. T-E2E-02 covers a script in a title, a requester reaching staff pages, a stale change and the management counts. Both pass in memory and on PostgreSQL 18.6 on the final version, and the PostgreSQL run saved 2 requests, 9 history events and 3 work records. | GitHub ran both modes on pull request #43 at commit `13c3206`, and both passed, in [run 38784039455](https://github.com/DewaldAllers/SEN381-CivicConnect/actions/runs/38784039455). M3 requires at least 2 critical E2E cases |
| Static and security | Passing | `npx tsc --noEmit` exits 0. `npm run lint` reports no warnings. `npm audit` reports 0 vulnerabilities across 355 packages, 101 of them shipped. Passwords are hashed with scrypt and session tokens are stored as hashes (ADR-007). T-E2E-02 checks that a script in a title runs nothing. | The [threat review](../risks/threat-review.md) covers 16 threats. Its open positions are TD-009, TD-010, TD-012 and TD-013 |
| Performance | Script built, no result | `scripts/perf-nfr005.mjs` (PR #40) follows AC-NFR-005. It runs three request types, 10 at a time, with warm-up kept apart, and writes the environment and data size next to the result. `scripts/seed-performance.ts` (PR #31) loads test data. | No measured run exists for the final version. The first one is Liam's, against the database, and the result says which store it used. NFR-005 reads Partially implemented and stays a proposed target (TD-008, TD-011) |
| Staging | Script built, not deployed | `scripts/deploy-staging.mjs` (PR #40) builds one named commit into a clean folder, starts it on its own port with its own secret, asks the server which release it is and fails if the answer is wrong. Rolling back is the same command with the previous tag. | No staging run of the final version is in the repository. Deploying it and showing it in the demonstration is Liam's. The brief accepts a local staging environment when the demonstration plan is stated |
| Known defects | 14 raised, all closed | DEF-006 to DEF-011 are product defects that Dewald found by reviewing PR #41. PR #42 fixed all six. DEF-012 and DEF-013 are documentation defects I found. DEF-014 is a test setup fault Dewald found in the first expanded PostgreSQL run, fixed in PR #46. No severity 3 defect is open. | All fourteen are Closed after the regression checks passed on the final version |
| Acceptance | 14 of 17 requirements covered, 2 partly, 1 not run | The [acceptance check in the RTM](../requirements/RTM.md#acceptance-check) reads every criterion against the executed cases. T-FR-002-01 and the six-status T-NFR-003-01 closed the gaps for FR-002 and NFR-003. NFR-001 reads Partly because the permission matrix is approved in principle only. NFR-004 has an informal check with five people that I did not time, and NFR-005 has no result. The [final outcome](../requirements/RTM.md#final-outcome) gives 34 of 40 criteria Met, 3 Partially Met and 3 Not Met, which is 88.75% | The NFR-004 result stays informal. The load run is Liam's |

## Current classification

**NOT READY for production release. Final deployment state: staging, with a justified no-go.**

The classification holds from M3 because the two items that stood between it and CONDITIONALLY READY are still open. There is no measured load result, and no staging run of the final version is in the repository. Both belong to Liam. The tag `v4.0-final` points at the commit that carries this page, and the CI gate is set and shown blocking a failing change.

The classification is about release, not about the build. All seventeen requirements are in the final version. Fifteen read Implemented, and every Must requirement is among them, with the one qualification that the permission matrix is approved in principle only. Scope completion is 88.75%, and no severity 3 defect is open.

## Final deployment state

SRC-M4 section 11 (p. 5) asks the team to declare and defend one final deployment state: production, simulated production, or staging under a justified no-go. CivicConnect stays in staging. A production release would hold real requests, some about security concerns and lost property, in a system with the open items below. Each row gives the concern, the evidence and where the register records it.

| Concern | Evidence | Recorded in |
| --- | --- | --- |
| Security | Sessions live in server memory, so a restart signs everyone out and only one server can run. Sign in has no limit on attempts. The server sets no Content-Security-Policy header. No secret scanner runs in CI. | TD-009, TD-012, TD-013, the [threat review](../risks/threat-review.md) |
| Privacy | The redaction route from CR-004 is not built, so personal data cannot be removed from a request. Nobody has confirmed whether the Protection of Personal Information Act binds the project. | TD-016, ASM-002, RSK-006 |
| Integrity | One database instance, on a free plan that expires on 13 November 2026. T-NFR-003-01 shows a restart and nothing more. No backup or restore has been shown. | TD-010, RSK-015 |
| Reliability | NFR-005 has no measured result, so the response time under load is unknown. | TD-008, TD-011 |
| Operations | No staging run of the final version is in the repository. No seeded staff member can work a request in Lost property or Other. | TD-015 |
| Authorisation | The permission matrix is approved in principle only, and category grants are fixed server settings. | CR-002, TD-009, RSK-013 |

The demonstration runs the tagged version on a team machine against PostgreSQL. That shows the product working. It is not a release.

## What would change the classification

CONDITIONALLY READY becomes defensible once the two items above are done and the CI gate stays set. The PED and the RTM describe the final version and no severity 3 defect is open, so those parts are in place. Known limitations would then be stated as conditions rather than hidden.

READY would also need a timed check with a written record for NFR-004, a measured result for NFR-005, the permission matrix approved and the redaction route built. None of that needs paid infrastructure. On the final scope and schedule, staying in staging is the position the evidence supports.

## Residual risk

These are the uncertainties that remain after verification, not the work still outstanding. Outstanding work belongs in the technical debt register. A risk belongs here when the tests pass and something could still go wrong.

| Residual risk | Why it remains | Current mitigation | Next action and owner |
| --- | --- | --- | --- |
| Production scale load is untested | A three person student environment cannot represent a municipal workload, and no demand figure exists for CivicConnect. ASM-003 records that no volume was ever supplied. | The planned small performance exercise plus the ADR-001 architecture review | Re-test against a representative environment and a real volume figure before any production use. Dewald |
| The single store is a single point of failure | ADR-002 records it and declines replication without evidence to justify the cost. ASM-008 carries the assumption that one instance is acceptable for an educational deployment. The development database is a free hosted instance that expires on 13 November 2026 (TD-010). | The migrations rebuild the schema and the categories on a new database. NFR-003 covers a controlled restart only | State an acceptable data loss position, demonstrate a restore and move off the free instance. Dewald |
| The institutional environment is unproven | ASM-005 assumes the selected stack runs on the team machines and on the Belgium Campus environment. The backend, the pages and PostgreSQL run on team machines and in CI, and the pages need no build step. None of it has run on an institutional machine. | The same install steps run on a clean GitHub runner on every push | Install and run the system on an institutional machine. Liam |
| Overdue is measured on calendar time | ASM-004 and CR-003. No stakeholder confirmed whether the organisation measures overdue in working hours. | CR-003 records the rule, the time zone and the reasoning, so the position is explicit rather than implied | Confirm with a stakeholder if one becomes reachable. Tristan |
| The data protection position is unconfirmed | ASM-002 and DEC-011. Nobody has established whether the Protection of Personal Information Act binds a student project. | The data model is designed as though it applies, under CR-004, and no artefact claims compliance. The redaction route is not built (TD-016). Requesters never see staff names (DEC-018) | Obtain a confirmed answer on applicability. Tristan |
| Sessions live in server memory and sign in has no limit | ADR-007 and TD-009. A restart signs everyone out, only one server can run and repeated password guesses are not slowed. | Passwords are hashed with scrypt, the shared seed password comes from the environment, sessions end after 8 hours and an unknown user gets the same answer as a wrong password | Add a limit on sign in attempts if the system is used beyond a demonstration. Liam |
| The lifecycle limits and the required version are our proposals | CR-008 and DEC-017. No stakeholder has confirmed when a note, an owner change or a due date is allowed. | The limits are recorded in the handoff note, the change record and the decision log, so they are visible and can change by change request | Confirm with a stakeholder if one becomes reachable. Tristan |
| Two categories cannot be worked with the seeded staff | TD-015. No seeded staff member holds a grant for Lost property or Other, so a request in either stays unassigned. | Management can see the request, and the limit is stated here and in the RTM | Give a staff member the grants, or keep the limit stated wherever an all-category claim is made. Liam |

A passing test narrows uncertainty rather than removing it. The open entries in the [Risk Register](../risks/README.md#final-status-m4) and the [technical debt register](../technical-debt/README.md) carry the rest.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 3: Controlled Construction, Integration, Quality and Release Readiness*. Cited as `SRC-M3`. Sections used: 9 (automated verification and CI quality gates, p. 5), 13 (performance and basic release readiness, p. 7), 14 (staging and test deployment, p. 7), 15 (release quality review and residual risk, pp. 7-8), 16 (residual risk statement, p. 8).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Final Project / Milestone 4: Finalise, Consolidate and Conclude*. Cited as `SRC-M4`. Sections used: 3 (required final outputs, p. 2), 11 (final deployment and go-live evidence, p. 5).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 15 (quality engineering and evidence standard, p. 14), 17 (environments, deployment and operations, pp. 14-15), 23 (assessment rules, p. 22).

Full source records are in the [source register](../sources.md).
