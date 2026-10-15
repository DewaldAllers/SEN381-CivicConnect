# Release evidence summary

Version 3.0 | Opened 9 October 2026, updated 15 October 2026 | Owner: Tristan Els | Status: **NOT READY, construction and integration in progress**

This is where the separate pieces of M3 evidence become one argument about whether CivicConnect can be released. It is filled in as the evidence arrives and classified at the release review.

The classification earns little on its own. The evidence and the reasoning behind it are what count, and a readiness claim with a failed gate behind it is worth less than an honest NOT READY.

## Release candidate

| Field | Entry |
| --- | --- |
| Release candidate tag | Not yet cut |
| Commit | Not yet identified. `main` at `38000fc` is the latest merged state, and it is not the candidate, because its server still keeps requests in memory |
| PED version | v3.0, in progress |
| Scope included | All seventeen baselined requirements under DEC-015. Any requirement that leaves the candidate is recorded as a controlled change here. |
| Date classified | Not yet classified. Last reviewed on 15 October 2026 |

The assessed version is the tag named here. The demonstration has to run against that tag and not against whatever is on `main` at the time.

## Evidence summary

The results below come from `main` at commit `38000fc`. I ran the checks on that commit on 15 October 2026, and the CI run for the same commit passed.

| Evidence area | Result | Interpretation | Concern or action |
| --- | --- | --- | --- |
| Build and CI | Passing | CI installs the packages, checks the types, runs the tests with a saved report and audits the dependencies. A high or critical finding in shipped code fails the build (PR #36). A second workflow runs lint and checks the database store against PostgreSQL 18 on backend pull requests (PR #31). | TD-005. Requiring the workflow in branch protection is a repository setting for Dewald to confirm before the tag. A red run can merge until then |
| Automated regression | 119 tests passing | 8 files: 52 API, 22 store, 13 authentication, 9 authorisation policy, 9 in-memory repository, 9 transition, 3 service and 2 persistence lifecycle. The cases use boundary values (TC-API-06), decision tables (TC-API-17 and TC-API-21) and a state-transition run (TC-API-19). | The M3 minimum is 15 meaningful cases across a stated mix. The suite is above it at every level except end to end. 54 case ids appear in the test names, and 31 of them carry the acceptance criterion they check |
| API and integration | 52 API cases passing | `api.test.ts` sends real HTTP requests through sign in to the endpoints. The store cases run real PostgreSQL SQL, and `npm run db:verify` runs them against PostgreSQL 18 in CI. | The server on `main` still uses the in-memory repository. PR #41 puts the database store behind it, and PR #42 adds raw HTTP checks against the real database |
| System and E2E | None run | The server serves the pages and the pages talk to it. Two browser journeys are designed (T-E2E-01 and T-E2E-02). | The Playwright specs are mine and need PR #41 merged first. M3 requires at least 2 critical E2E cases |
| Static and security | Passing | `npx tsc --noEmit` exits 0. `npm run lint` reports no warnings. `npm audit` reports 0 vulnerabilities across 355 packages, 101 of them shipped. Passwords are hashed with scrypt and session tokens are stored as hashes (ADR-007). | The threat review is mine and comes before the tag. ADR-007 lists the inputs: no sign in limit, sessions in memory and the token held in the browser |
| Performance | Script built, no result | `scripts/perf-nfr005.mjs` (PR #40) follows AC-NFR-005. It runs three request types, 10 at a time, with warm-up kept apart, and writes the environment and data size next to the result. `scripts/seed-performance.ts` (PR #31) loads test data. | The first measured run is Liam's, against the database, and the result says which store it used. TD-008 and TD-011. NFR-005 stays a proposed target until a result exists |
| Staging | Script built, not deployed | `scripts/deploy-staging.mjs` (PR #40) builds one named commit into a clean folder, starts it on its own port with its own secret, asks the server which release it is and fails if the answer is wrong. Rolling back is the same command with the previous tag. | Deploying the candidate and showing it in the demonstration is Liam's. The brief accepts a local staging environment when the demonstration plan is stated |
| Known defects | 13 raised, 5 closed, 8 in progress | DEF-006 to DEF-011 are product defects that Dewald found by reviewing PR #41, before they reached `main`. DEF-012 and DEF-013 are documentation defects I found and fixed. | DEF-006 and DEF-010 are severity 3. Both are release blockers until PR #42 merges |
| Acceptance | 0 of 17 verified end to end, 15 of 17 with executed cases | All twelve functional requirements and NFR-001 to NFR-003 have executed cases. NFR-003 is checked at the store, not yet on the running server. NFR-004 and NFR-005 have none. | No requirement counts as met until it passes through the real server and a browser. The [RTM](../requirements/RTM.md) shows each row |

## Current classification

**NOT READY.**

Three areas still have no result: system and E2E, performance and staging. The work behind each one is built or waiting on a merge. The database store and the endpoints have not been joined on `main`, two severity 3 defects are open until PR #42 merges, and nothing yet checks that CI blocks a red run.

On 9 October the system had one endpoint, stored nothing and authenticated nobody. On 15 October it has sign in, every endpoint, the pages, a tested database store and 119 passing tests. The classification stays NOT READY because the evidence for a release is a joined system that has passed in a browser, and that does not exist yet.

## What would change the classification

CONDITIONALLY READY becomes defensible once PR #41 and PR #42 are merged, the browser journeys pass against the real server and the real database, the load run has a result, the CI gate blocks on failure, staging shows the tagged candidate, and no severity 3 defect is open. Known limitations would then be stated as conditions rather than hidden.

READY would additionally need every one of the seventeen requirements verified against its acceptance criteria. NFR-004 needs the five person check and NFR-005 needs a measured result. On the current scope and schedule, CONDITIONALLY READY is the realistic target.

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
