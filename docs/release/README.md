# Release evidence summary

Version 3.0 | Opened 9 October 2026, updated 16 October 2026 | Owner: Tristan Els | Status: **NOT READY, construction and integration in progress**

This is where the separate pieces of M3 evidence become one argument about whether CivicConnect can be released. It is filled in as the evidence arrives and classified at the release review.

The classification earns little on its own. The evidence and the reasoning behind it are what count, and a readiness claim with a failed gate behind it is worth less than an honest NOT READY.

## Release candidate

| Field | Entry |
| --- | --- |
| Release candidate tag | Not yet cut |
| Commit | Not yet identified. `main` at `142f6b3` is the latest merged code. It becomes the candidate when the documents that describe it have merged and the tag is cut |
| PED version | v3.0, in progress |
| Scope included | All seventeen baselined requirements under DEC-015. Any requirement that leaves the candidate is recorded as a controlled change here. |
| Date classified | Not yet classified. Last reviewed on 15 October 2026 |

The assessed version is the tag named here. The demonstration has to run against that tag and not against whatever is on `main` at the time.

## Evidence summary

The results below come from `main` at commit `142f6b3`, where the database store sits behind the server, plus the browser journeys in `app/e2e`. I ran the checks on 15 October 2026, and the CI run for the same commit passed.

| Evidence area | Result | Interpretation | Concern or action |
| --- | --- | --- | --- |
| Build and CI | Passing | CI installs the packages, checks the types, runs the tests with a saved report and audits the dependencies. A high or critical finding in shipped code fails the build (PR #36). A second workflow runs lint and checks the database store against PostgreSQL 18 on backend pull requests (PR #31). A third workflow, added with the browser journeys, runs them in memory and on PostgreSQL on every pull request. | TD-005 is repaid. Dewald made `backend-checks` a required check on `main` on 15 October, with up-to-date branches required. [Pull request #45](https://github.com/DewaldAllers/SEN381-CivicConnect/pull/45) held one failing test, the check went red, GitHub blocked the merge and refused it, and I closed it unmerged |
| Automated regression | 150 tests passing, 2 intentional skips | 11 files: 52 API, 22 store, 21 data and API integration, 13 authentication, 10 in-memory repository, 9 authorisation policy, 9 repository contract, 9 transition, 3 service and 2 persistence lifecycle. The cases use boundary values (TC-API-06), decision tables (TC-API-17 and TC-API-21), a state-transition run (TC-API-19), a concurrency case (T-NFR-002-03) and fault injection (T-NFR-002-02). | The M3 minimum is 15 meaningful cases across a stated mix, and the suite is above it at every level. The 2 skips need a real database or a SQL constraint, and the PostgreSQL run below covers the database one |
| API and integration | Passing, in memory and on PostgreSQL | `api.test.ts` and `data-api.integration.test.ts` send raw authenticated HTTP requests through sign in to the endpoints. `npm run test:postgres` passes 31 tests with 1 intentional skip on PostgreSQL 18.6. It includes the contract cases, the HTTP cases and T-NFR-003-01, which restarts the built server. `npm run db:verify` passes. | These checks use temporary schemas and leave the shared tables untouched |
| System and E2E | 2 journeys passing | T-E2E-01 takes a request from sent to resolved through three people's pages. T-E2E-02 covers a script in a title, a requester reaching staff pages, a stale change and the management counts. Both pass in memory and on PostgreSQL 18.6, and the PostgreSQL run saved 2 requests, 9 history events and 3 work records. | GitHub ran both modes on pull request #43 at commit `13c3206`, and both passed, in [run 38784039455](https://github.com/DewaldAllers/SEN381-CivicConnect/actions/runs/38784039455). M3 requires at least 2 critical E2E cases |
| Static and security | Passing | `npx tsc --noEmit` exits 0. `npm run lint` reports no warnings. `npm audit` reports 0 vulnerabilities across 355 packages, 101 of them shipped. Passwords are hashed with scrypt and session tokens are stored as hashes (ADR-007). T-E2E-02 checks that a script in a title runs nothing. | The [threat review](../risks/threat-review.md) covers 16 threats. Its open positions are TD-009, TD-010, TD-012 and TD-013 |
| Performance | Script built, no result | `scripts/perf-nfr005.mjs` (PR #40) follows AC-NFR-005. It runs three request types, 10 at a time, with warm-up kept apart, and writes the environment and data size next to the result. `scripts/seed-performance.ts` (PR #31) loads test data. | The first measured run is Liam's, against the database, and the result says which store it used. TD-008 and TD-011. NFR-005 stays a proposed target until a result exists |
| Staging | Script built, not deployed | `scripts/deploy-staging.mjs` (PR #40) builds one named commit into a clean folder, starts it on its own port with its own secret, asks the server which release it is and fails if the answer is wrong. Rolling back is the same command with the previous tag. | Deploying the candidate and showing it in the demonstration is Liam's. The brief accepts a local staging environment when the demonstration plan is stated |
| Known defects | 13 raised, 5 closed, 6 fixed, 2 in progress | DEF-006 to DEF-011 are product defects that Dewald found by reviewing PR #41. PR #42 fixed all six, and no severity 3 defect is open. DEF-012 and DEF-013 are documentation defects I found, and they are fixed when this pull request merges. | The fixed defects move to Closed at the release review |
| Acceptance | 13 of 17 requirements covered, 3 partly, 1 not run | The [acceptance check in the RTM](../requirements/RTM.md#acceptance-check) reads every criterion against the executed cases. FR-002 and NFR-003 have criteria with no case yet. NFR-004 has an informal check with five people that I did not time, and NFR-005 has no result. | A timed check for NFR-004 is mine. The load run is Liam's |

## Current classification

**NOT READY.**

Three things still stand between this and CONDITIONALLY READY. The release candidate tag is not cut. There is no measured load result. Staging has not shown the tagged candidate.

The product itself moved a long way in a week. On 9 October the system had one endpoint, stored nothing and authenticated nobody. On 15 October a person can sign in and work a request from sent to resolved through the pages, the server and a PostgreSQL database, and two browser journeys check that on every pull request. The classification stays NOT READY because the three items that remain are ones the brief names for a release. The fourth, the CI gate, is set and shown blocking a failing change.

## What would change the classification

CONDITIONALLY READY becomes defensible once the three items above are done and the CI gate stays set, the PED and the RTM describe the tagged commit, and no severity 3 defect is open. Known limitations would then be stated as conditions rather than hidden.

READY would also need every one of the seventeen requirements covered by executed cases. FR-002 and NFR-003 need the cases named in the acceptance check, NFR-004 needs a timed check with a written record and NFR-005 needs a measured result. On the current scope and schedule, CONDITIONALLY READY is the realistic target.

## Residual risk

These are the uncertainties that remain after verification, not the work still outstanding. Outstanding work belongs in the technical debt register. A risk belongs here when the tests pass and something could still go wrong.

| Residual risk | Why it remains | Current mitigation | Next action and owner |
| --- | --- | --- | --- |
| Production scale load is untested | A three person student environment cannot represent a municipal workload, and no demand figure exists for CivicConnect. ASM-003 records that no volume was ever supplied. | The planned small performance exercise plus the ADR-001 architecture review | Re-test against a representative environment and a real volume figure before any production use. Dewald |
| The single store is a single point of failure | ADR-002 records it and declines replication without evidence to justify the cost. ASM-008 carries the assumption that one instance is acceptable for an educational deployment. The development database is a free hosted instance that expires on 13 November 2026 (TD-010). | The migrations rebuild the schema and the categories on a new database. NFR-003 covers a controlled restart only | State an acceptable data loss position, demonstrate a restore and move off the free instance. Dewald |
| The institutional environment is unproven | ASM-005 assumes the selected stack runs on the team machines and on the Belgium Campus environment. The backend, the pages and PostgreSQL run on team machines and in CI, and the pages need no build step. None of it has run on an institutional machine. | The same install steps run on a clean GitHub runner on every push | Install and run the system on an institutional machine. Liam |
| Overdue is measured on calendar time | ASM-004 and CR-003. No stakeholder confirmed whether the organisation measures overdue in working hours. | CR-003 records the rule, the time zone and the reasoning, so the position is explicit rather than implied | Confirm with a stakeholder if one becomes reachable. Tristan |
| The data protection position is unconfirmed | ASM-002 and DEC-011. Nobody has established whether the Protection of Personal Information Act binds a student project. | The data model is designed as though it applies, under CR-004, and no artefact claims compliance. Requesters never see staff names (DEC-018) | Obtain a confirmed answer on applicability. Tristan |
| Sessions live in server memory and sign in has no limit | ADR-007 and TD-009. A restart signs everyone out, only one server can run and repeated password guesses are not slowed. | Passwords are hashed with scrypt, the shared seed password comes from the environment, sessions end after 8 hours and an unknown user gets the same answer as a wrong password | Add a limit on sign in attempts if the system is used beyond a demonstration. Liam |
| The lifecycle limits and the required version are our proposals | CR-008 and DEC-017. No stakeholder has confirmed when a note, an owner change or a due date is allowed. | The limits are recorded in the handoff note, the change record and the decision log, so they are visible and can change by change request | Confirm with a stakeholder if one becomes reachable. Tristan |

Further residual risks are expected once the browser journeys and the load run produce results, because a passing test narrows uncertainty rather than removing it. They are added here as they are identified rather than listed in advance.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 3: Controlled Construction, Integration, Quality and Release Readiness*. Cited as `SRC-M3`. Sections used: 9 (automated verification and CI quality gates, p. 5), 13 (performance and basic release readiness, p. 7), 14 (staging and test deployment, p. 7), 15 (release quality review and residual risk, pp. 7-8), 16 (residual risk statement, p. 8).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 15 (quality engineering and evidence standard, p. 14), 17 (environments, deployment and operations, pp. 14-15), 23 (assessment rules, p. 22).

Full source records are in the [source register](../sources.md).
