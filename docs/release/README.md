# Release evidence summary

Version 4.0 | Opened 9 October 2026, updated 18 October 2026 | Owner: Tristan Els | Status: **final for M4; CONDITIONALLY READY, staging with a justified no-go for production**

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

The results below come from the final version, tag `v4.0-final`, plus the browser journeys in `app/e2e`. I ran the checks on 18 October 2026 on the code the tag carries. The staging and load evidence comes from Liam's run on commit `5d5e1bc`, the merge of PR #46. `git diff --stat 5d5e1bc v4.0-final` lists only files under `docs` and `evidence`, so the tag carries the code he measured.

| Evidence area | Result | Interpretation | Concern or action |
| --- | --- | --- | --- |
| Build and CI | Passing | CI installs the packages, checks the types, runs the tests with a saved report and audits the dependencies. A high or critical finding in shipped code fails the build (PR #36). A second workflow runs lint and checks the database store against PostgreSQL 18 on backend pull requests (PR #31). A third workflow, added with the browser journeys, runs them in memory and on PostgreSQL on every pull request. | TD-005 is repaid. Dewald made `backend-checks` a required check on `main` on 15 October, with up-to-date branches required. [Pull request #45](https://github.com/DewaldAllers/SEN381-CivicConnect/pull/45) held one failing test, the check went red, GitHub blocked the merge and refused it, and I closed it unmerged |
| Automated regression | 153 tests passing, 2 intentional skips | 11 files: 52 API, 23 store, 23 data and API integration, 13 authentication, 10 in-memory repository, 9 authorisation policy, 9 repository contract, 9 transition, 3 service and 2 persistence lifecycle. The cases use boundary values (TC-API-06), decision tables (TC-API-17 and TC-API-21), a state-transition run (TC-API-19), a concurrency case (T-NFR-002-03) and fault injection (T-NFR-002-02). | The M3 minimum is 15 meaningful cases across a stated mix, and the suite is above it at every level. The 2 skips need a real database or a SQL constraint, and the PostgreSQL run below covers the database one |
| API and integration | Passing, in memory and on PostgreSQL | `api.test.ts` and `data-api.integration.test.ts` send raw authenticated HTTP requests through sign in to the endpoints. `npm run test:postgres` passes 33 tests with 1 intentional skip on PostgreSQL 18.6. It includes the contract cases, the HTTP cases, T-FR-002-01, which saves a request in each of the six categories, and T-NFR-003-01, which restarts the built server with a request in each of the six statuses. `npm run db:verify` passes. | These checks use temporary schemas and leave the shared tables untouched |
| System and E2E | 2 journeys passing | T-E2E-01 takes a request from sent to resolved through three people's pages. T-E2E-02 covers a script in a title, a requester reaching staff pages, a stale change and the management counts. Both pass in memory and on PostgreSQL 18.6 on the final version, and the PostgreSQL run saved 2 requests, 9 history events and 3 work records. | GitHub ran both modes on pull request #43 at commit `13c3206`, and both passed, in [run 38784039455](https://github.com/DewaldAllers/SEN381-CivicConnect/actions/runs/38784039455). M3 requires at least 2 critical E2E cases |
| Static and security | Passing | `npx tsc --noEmit` exits 0. `npm run lint` reports no warnings. `npm audit` reports 0 vulnerabilities across 355 packages, 101 of them shipped. Passwords are hashed with scrypt and session tokens are stored as hashes (ADR-007). T-E2E-02 checks that a script in a title runs nothing. | The [threat review](../risks/threat-review.md) covers 16 threats. Its open positions are TD-009, TD-010, TD-012 and TD-013 |
| Performance | One local run, all within target | `scripts/perf-nfr005.mjs` (PR #40) follows AC-NFR-005. Liam ran it on 18 October 2026 against local staging with PostgreSQL: 10 concurrent requesters and 200 observed cases for each of the list, detail and summary calls, with 20 warm-up requests per call kept apart. All 600 finished within the proposed 2 seconds with no errors. The p95 times were 388.1 ms for the staff queue, 181.7 ms for a request and 529 ms for the management summary. The [results](../../evidence/m4-performance/nfr-005-2026-10-18T18-39-19-613Z.md) and the [record](../../evidence/m4-performance/liam-staging-runtime-performance-2026-10-18.md) are in the repository. | The server and the load generator shared one machine, the timing is HTTP time without browser display, the data held 304 requests, and the run left 300 synthetic requests in the shared database. It shows no production capacity. The target stays a proposal (TD-008, TD-011) |
| Staging | Local run, expected release reported | `scripts/deploy-staging.mjs` (PR #40) builds one named commit into a clean folder, starts it on its own port with its own secret, asks the server which release it is and fails if the answer is wrong. On 18 October 2026 Liam ran it for commit `5d5e1bc`. The log in the [record](../../evidence/m4-performance/liam-staging-runtime-performance-2026-10-18.md) ends with the script's own line that staging at http://localhost:4000 is running that release, after it connected to PostgreSQL and found every migration applied. Rolling back is the same command with the previous tag. | The run was on one team machine, which the brief accepts when the demonstration plan is stated. The record also notes the runtime permission check passing and saves no transcript, so the preserved evidence for the runtime login stays Dewald's [record for PR #44](../../evidence/m3-ci-runtime-permissions.md) |
| Known defects | 14 raised, all closed | DEF-006 to DEF-011 are product defects that Dewald found by reviewing PR #41. PR #42 fixed all six. DEF-012 and DEF-013 are documentation defects I found. DEF-014 is a test setup fault Dewald found in the first expanded PostgreSQL run, fixed in PR #46. No severity 3 defect is open. | All fourteen are Closed after the regression checks passed on the final version |
| Acceptance | 14 of 17 requirements covered, 3 partly, none not run | The [acceptance check in the RTM](../requirements/RTM.md#acceptance-check) reads every criterion against the executed cases. T-FR-002-01 and the six-status T-NFR-003-01 closed the gaps for FR-002 and NFR-003. NFR-001 reads Partly because the permission matrix is approved in principle only. NFR-004 has an informal check with five people that I did not time, and NFR-005 has one local load run. The [final outcome](../requirements/RTM.md#final-outcome) gives 35 of 40 criteria Met and 5 Partially Met, which is 93.75% | The NFR-004 result stays informal. The load run was local and measured HTTP time only |

## Current classification

**CONDITIONALLY READY. Final deployment state: staging, with a justified no-go for production.**

At M3 the classification was NOT READY, because two items stood between it and CONDITIONALLY READY: a measured load result and a staging run. Liam has done both. On 18 October 2026 the load check put all 600 observed cases inside the proposed two seconds, and local staging reported the expected release. The CI gate is set and shown blocking a failing change, the PED and the RTM describe the final version, and no severity 3 defect is open. The tag `v4.0-final` points at the commit that carries this page. CONDITIONALLY READY means the evidence supports a staging release with the limits stated. It does not mean production, and the next section gives the reasons production is a no-go.

The classification is about release, not about the build. All seventeen requirements are in the final version. Fifteen read Implemented, and every Must requirement is among them, with the one qualification that the permission matrix is approved in principle only. Scope completion is 93.75%, and no severity 3 defect is open.

## Final deployment state

SRC-M4 section 11 (p. 5) asks the team to declare and defend one final deployment state: production, simulated production, or staging under a justified no-go. CivicConnect stays in staging. A production release would hold real requests, some about security concerns and lost property, in a system with the open items below. Each row gives the concern, the evidence and where the register records it.

| Concern | Evidence | Recorded in |
| --- | --- | --- |
| Security | Sessions live in server memory, so a restart signs everyone out and only one server can run. Sign in has no limit on attempts. The server sets no Content-Security-Policy header. No secret scanner runs in CI. | TD-009, TD-012, TD-013, the [threat review](../risks/threat-review.md) |
| Privacy | The redaction route from CR-004 is not built, so personal data cannot be removed from a request. Nobody has confirmed whether the Protection of Personal Information Act binds the project. | TD-016, ASM-002, RSK-006 |
| Integrity | One database instance, on a free plan that expires on 13 November 2026. T-NFR-003-01 shows a restart and nothing more. No backup or restore has been shown. | TD-010, RSK-015 |
| Reliability | The only load result is one local run, with the server and the load generator on one machine. It shows no production capacity, and no run has used a separate load generator or a representative volume. | TD-008, TD-011 |
| Operations | Staging ran on one team machine, and the shared development database holds 300 synthetic requests from the load run. No seeded staff member can work a request in Lost property or Other. | TD-015 |
| Authorisation | The permission matrix is approved in principle only, and category grants are fixed server settings. | CR-002, TD-009, RSK-013 |

The demonstration runs the tagged version on a team machine against PostgreSQL. That shows the product working. It is not a release.

## What would change the classification

Those conditions are met, and the classification is CONDITIONALLY READY. The known limits stay stated as conditions rather than hidden.

READY would also need a timed check with a written record for NFR-004, a load result for NFR-005 from a separate load generator, the permission matrix approved and the redaction route built. None of that needs paid infrastructure. On the final scope and schedule, staying in staging is the position the evidence supports.

## Residual risk

These are the uncertainties that remain after verification, not the work still outstanding. Outstanding work belongs in the technical debt register. A risk belongs here when the tests pass and something could still go wrong.

| Residual risk | Why it remains | Current mitigation | Next action and owner |
| --- | --- | --- | --- |
| Production scale load is untested | A three person student environment cannot represent a municipal workload, and no demand figure exists for CivicConnect. ASM-003 records that no volume was ever supplied. | The small performance exercise of 18 October 2026, which ran on one machine and shows no production capacity, plus the ADR-001 architecture review | Re-test against a representative environment and a real volume figure before any production use. Dewald |
| The single store is a single point of failure | ADR-002 records it and declines replication without evidence to justify the cost. ASM-008 carries the assumption that one instance is acceptable for an educational deployment. The development database is a free hosted instance that expires on 13 November 2026 (TD-010). | The migrations rebuild the schema and the categories on a new database. NFR-003 covers a controlled restart only | State an acceptable data loss position, demonstrate a restore and move off the free instance. Dewald |
| The institutional environment is unproven | ASM-005 assumes the selected stack runs on the team machines and on the Belgium Campus environment. The backend, the pages and PostgreSQL run on team machines and in CI, and the pages need no build step. None of it has run on an institutional machine. | The same install steps run on a clean GitHub runner on every push | Install and run the system on an institutional machine. Liam |
| Overdue is measured on calendar time | ASM-004 and CR-003. No stakeholder confirmed whether the organisation measures overdue in working hours. | CR-003 records the rule, the time zone and the reasoning, so the position is explicit rather than implied | Confirm with a stakeholder if one becomes reachable. Tristan |
| The data protection position is unconfirmed | ASM-002 and DEC-011. Nobody has established whether the Protection of Personal Information Act binds a student project. | The data model is designed as though it applies, under CR-004, and no artefact claims compliance. The redaction route is not built (TD-016). Requesters never see staff names (DEC-018) | Obtain a confirmed answer on applicability. Tristan |
| Sessions live in server memory and sign in has no limit | ADR-007 and TD-009. A restart signs everyone out, only one server can run and repeated password guesses are not slowed. | Passwords are hashed with scrypt, the shared seed password comes from the environment, sessions end after 8 hours and an unknown user gets the same answer as a wrong password | Add a limit on sign in attempts if the system is used beyond a demonstration. Liam |
| The lifecycle limits and the required version are our proposals | CR-008 and DEC-017. No stakeholder has confirmed when a note, an owner change or a due date is allowed. | The limits are recorded in the handoff note, the change record and the decision log, so they are visible and can change by change request | Confirm with a stakeholder if one becomes reachable. Tristan |
| Two categories cannot be worked with the seeded staff | TD-015. No seeded staff member holds a grant for Lost property or Other, so a request in either stays unassigned. | Management can see the request, and the limit is stated here and in the RTM | Give a staff member the grants, or keep the limit stated wherever an all-category claim is made. Liam |
| Synthetic load data stays in the shared database | The load run seeded 300 synthetic requests with team approval, and they were not deleted. A demonstration against PostgreSQL shows 304 requests, with 154 in the staff queue. | Memory mode starts with three sample requests, and the record says the data stays unless the team approves deleting it | Keep the data for the assessment, or delete it with the team's approval afterwards. Dewald |

A passing test narrows uncertainty rather than removing it. The open entries in the [Risk Register](../risks/README.md#final-status-m4) and the [technical debt register](../technical-debt/README.md) carry the rest.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 3: Controlled Construction, Integration, Quality and Release Readiness*. Cited as `SRC-M3`. Sections used: 9 (automated verification and CI quality gates, p. 5), 13 (performance and basic release readiness, p. 7), 14 (staging and test deployment, p. 7), 15 (release quality review and residual risk, pp. 7-8), 16 (residual risk statement, p. 8).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Final Project / Milestone 4: Finalise, Consolidate and Conclude*. Cited as `SRC-M4`. Sections used: 3 (required final outputs, p. 2), 11 (final deployment and go-live evidence, p. 5).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 15 (quality engineering and evidence standard, p. 14), 17 (environments, deployment and operations, pp. 14-15), 23 (assessment rules, p. 22).

Full source records are in the [source register](../sources.md).
