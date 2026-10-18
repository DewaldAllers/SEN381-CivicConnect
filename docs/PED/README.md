# CivicConnect Project Engineering Document

| Field | Entry |
| --- | --- |
| Document | CivicConnect Project Engineering Document (PED) |
| Current version | v4.0 Final |
| Version date | 18 October 2026 |
| Status | Final for M4. Each part is approved on the merge of the pull request that carries it |
| Previous baselines | v1.0, baselined 9 September 2026. v2.0, submitted as BL-002 on 30 September 2026 and approved on the merge of PR #30 on 1 October 2026. v3.0, submitted as tag `v3.0-m3` on 16 October 2026 |
| Document control owner | Tristan Els |
| Contributors | Liam de Villiers, Dewald Allers, Tristan Els |
| Approval | Two approvals from members other than the author on every pull request into `main`, per the [team working agreement](team-working-agreement.md) |

This is the single engineering record for CivicConnect. It is not recreated at each milestone. Version 4.0 finalises version 3.0 in place, and the M1, M2 and M3 content stays readable underneath it. There is no separate final report, and none will be written alongside this document.

Version 4.0 Final is the concluding version of the document, and it works as the final evidence index. It says what the final product is, how far the original scope was delivered, what we conclude and what remains. It points to the repository, the CI runs and the registers where the evidence lives, and it does not copy them.

The PED is held as linked Markdown in this repository rather than as one file, so every part of it sits under the same version control, review and change control as the rest of the project. The section map below says where each part lives.

## M4 submission information

| Field | Entry |
| --- | --- |
| Team name | Virtual Group A |
| Team members | Tristan Els, Dewald Allers and Liam de Villiers |
| GitHub repository | https://github.com/DewaldAllers/SEN381-CivicConnect |
| Final commit, tag or release | Tag `v4.0-final`, named in the [release evidence summary](../release/README.md). The assessed version is the commit the tag points to, and `git rev-list -n 1 v4.0-final` prints it |
| PED version | v4.0 Final |
| Final RTM location | [RTM.md](../requirements/RTM.md), with its [final outcome](../requirements/RTM.md#final-outcome) section |
| Final product access and demonstration information | The [demonstration guide](../demo/README.md) starts the tagged version from a clean clone and lists the people, the steps and the six final stages. The server runs on a team machine at http://localhost:3000, in memory or against PostgreSQL. The final deployment state is staging, set out in the [release evidence summary](../release/README.md#final-deployment-state). The restricted database login is shared privately, and the repository holds no secret |
| CI and test evidence | The runs at https://github.com/DewaldAllers/SEN381-CivicConnect/actions, the [test approach](../testing/README.md) and the final outcome section of the RTM |
| Date submitted | Shown on the cover of the submitted PDF |

## M3 submission information

| Field | Entry |
| --- | --- |
| Team | Virtual Group A |
| Team members | Tristan Els, Dewald Allers and Liam de Villiers |
| GitHub repository | https://github.com/DewaldAllers/SEN381-CivicConnect |
| M3 release candidate | Tag `v3.0-m3`, named in the [release evidence summary](../release/README.md). The assessed version is the commit the tag points to |
| PED version | v3.0 |
| RTM | [RTM.md](../requirements/RTM.md) |
| CI and test evidence | The runs at https://github.com/DewaldAllers/SEN381-CivicConnect/actions, the [test approach](../testing/README.md) and the evidence columns of the RTM |
| Staging or test environment | The release evidence summary names the environment and how it is shown in the demonstration |
| Date submitted | 16 October 2026 |

## Version history

| Version | Date | Phase | What the version added or changed | Approval evidence |
| --- | --- | --- | --- | --- |
| v0.1 to v0.3 | 7 to 8 September 2026 | M1 drafting | Three members drafted in parallel on separate branches. Nothing was baselined. | Branch commits on `feature/m1-member1-foundation`, `m1-part2-requirements-foundation` and `m1-part3-risk-decisions-governance` |
| v1.0 | 9 September 2026 | M1 baseline | Problem and business need, stakeholders, scope baseline, constraints, 12 functional and 5 non-functional requirements, acceptance criteria, initial RTM, initial Risk Register, initial Engineering Decision Log, Forward Engineering Considerations, GitHub governance evidence, AI Usage Register and the team working agreement. | PR #21, #22, #23, #24, #25 and #26 merged into `main`. Working agreement agreed by all three members on 9 September 2026 |
| v2.0 | 30 September 2026 | M2 | Review of the v1.0 baseline and the four changes arising from it. Change control register, baseline register, assumptions and dependencies register. RTM rebuilt on the M2 columns and populated. Risk Register reviewed and extended to 22 entries. Architecturally significant requirements, architecture selection and data model. Technology stack with pinned versions and deployment direction. Two design decisions and the initial interface decision. Backend vertical slice with automated checks. | PR #27 and #29 merged into `main`, each approved by the two members who did not author it. PR #28 and the integration request PR #30 carry the remainder. Baseline record BL-002 |
| v3.0 | 9 to 16 October 2026 | M3 | Defect Register, Technical Debt Register and release evidence summary. Change control extended to CR-009, and the decision log to DEC-018 and ADR-007. Test approach and 49 designed test cases. RTM filled in from `main` with executed cases. Backend: sign in and sessions, every endpoint, the PostgreSQL store with migrations, the CI audit and the persistence workflow, and the staging and load scripts. Client pages and wireframes. Two browser journeys with their own CI workflow. The M3 evidence index and submission information in this document. | PR #31 to #34, PR #36 to #42 and PR #44 merged into `main`, each approved by two members who did not author it. PR #43 carries this update. The release candidate is the tag `v3.0-m3`, on the head commit of PR #43 |
| v4.0 Final | 18 October 2026 | M4 | The closing version. The RTM final outcome, the M1 scope to final delivery table with 88.75% scope completion, a final status for each M3 finding, the final registers, the final deployment state (staging, with a justified no-go for production), known limitations and future work, and the project reflection. Two new data checks, T-FR-002-01 and the six status T-NFR-003-01, and the fix for DEF-014. | PR #46 and the pull request that carries this update, each approved by two members who did not author it. The final version is the tag `v4.0-final` |

## What changed between v1.0 and v2.0

Version 1.0 answered what we are building and within what limits. Version 2.0 answers how we intend to build it, and commits enough of that answer to develop against.

We reviewed the v1.0 requirements, scope and constraints before recording any M2 decision. Most of them survived unchanged. Four changes were raised against the baseline and are tracked in the [change control register](../change/README.md). The largest is CR-002, which closes the five requirement proposals that v1.0 left open. Those proposals had to close before the data model and the permission boundary could be designed, because they carry the status transitions, the meaning of overdue and the role scope that the design depends on.

The architecture, data, technology and design decisions were then taken against that reviewed baseline and recorded as ADR-001 to ADR-006. BL-002 submits the set for approval, which is recorded on the merge of PR #30. Construction has begun against it: a backend vertical slice covering the request status lifecycle, the authorisation policy and one REST endpoint, with 23 passing tests running on every push and pull request.

Nothing baselined in v1.0 has been deleted. Where wording changed, the identifier stayed, the previous position is still readable in the artefact or in its change record, and the reason is in the register.

## What changed between v2.0 and v3.0

Version 2.0 answered how we would build it. Version 3.0 answers whether it works and whether we can release it.

We built it. A person can sign in, send a request and follow it to the end. Staff can work on it, and management can see the totals. The pages, the endpoints and the PostgreSQL store work together on `main`. 151 tests pass, two browser journeys pass in memory and on PostgreSQL, and CI checks the types, runs the tests and audits the dependencies on every push. The [release evidence summary](../release/README.md) says what that does and does not show. It still reads NOT READY, because there is no measured load result and staging has not shown a tagged candidate. The tag is cut, and the CI gate is set and shown blocking a failing change.

The design held. The modular server, the one-save-for-a-change-and-its-event rule, the central status policy, the central permission policy and the `/api/v1` boundary all went into the code as ADR-001 to ADR-006 described them. We made five controlled changes while building. We build all seventeen requirements (CR-005), the client is plain HTML, CSS and JavaScript (CR-006), the server ignores an owner claim in the request body (CR-007), every change carries the version the page last read (CR-008) and requesters see "Staff" in place of names (CR-009). Each has a decision entry or an ADR behind it.

Review found real defects before they reached `main`. Dewald's review of the integration branch found six product defects by sending raw requests at it, and the [Defect Register](../defects/README.md) records them with their fixes. All six are fixed and none of severity 3 is open. Nothing baselined in v2.0 has been deleted.

## What changed between v3.0 and v4.0

Version 3.0 answered whether it works and whether we can release it. Version 4.0 answers how far we got and what we conclude.

We started no new work. We closed the two gaps the M3 acceptance check named. T-FR-002-01 saves a request in each of the six categories, and T-NFR-003-01 now restarts the built server with a request in each of the six statuses. Both pass on PostgreSQL. 153 tests pass, up from 151, and 33 pass against PostgreSQL, up from 31. The first expanded PostgreSQL run failed because of a fault in the test setup, which is DEF-014, and PR #46 fixes it.

We counted the 40 original acceptance criteria and not the 17 requirements. 34 are Met, 3 are Partially Met and 3 are Not Met, which is 88.75%. Every Must requirement is Implemented, and the one qualification is that the permission matrix is approved in principle only. NFR-004 and NFR-005 are Partially implemented. They are the two requirements the change record said would leave first if time ran short.

We stayed in staging. The release classification is still NOT READY for production, because no load result and no staging run of the final version exist, and because the open limits on security, privacy and recovery are real. The [release evidence summary](../release/README.md#final-deployment-state) gives the evidence for each.

The registers reached their final state. All 14 defects are Closed. Eight of the 22 risks are Closed and 14 stay open, with four ratings moved. Seven of the 16 technical debt items are repaid and nine stay open, two of them new from the final data check. CR-007 to CR-009 are approved, and no change request was raised at M4. Nothing baselined in v3.0 has been deleted.

## M3 evidence index

Each row below follows the section headings SRC-M3 section 6 (p. 4) asks for. The state column says plainly what is in place and what is not. Detail stays in the linked artefact.

| M3 section | What we claim | Where the evidence is | State |
| --- | --- | --- | --- |
| 1. M3 overview | The release candidate covers all seventeen requirements under DEC-015. The candidate is not cut yet. | [Release evidence summary](../release/README.md), [CR-005](../change/README.md#cr-005-build-all-seventeen-requirements-for-the-m3-release-candidate) | Integration done. Release evidence in progress |
| 2. M2 baseline conformance | The M2 design went into the code as written. The modular server, the one-save rule for a change and its event, the status policy, the permission policy and the API boundary all exist. PostgreSQL 18.6 holds the data. | [ADR-001 to ADR-006](../decisions/README.md#adr-index), [architecture and data](architecture-and-data.md), [API v1](../integration/api-v1.md), the `src` folders in [app/backend](../../app/backend) | In place on `main` |
| 3. Controlled changes | Five changes were raised in M3 and each is recorded with its reason and effect. | [Change control register](../change/README.md) (CR-005 to CR-009), [decision log](../decisions/README.md) (DEC-014 to DEC-018, ADR-007) | CR-005 and CR-006 approved. CR-007 to CR-009 raised |
| 4. Construction and configuration | Work goes through branches and pull requests into a protected `main` with two approvals. Secrets stay out of the repository: the seed password and the database address come from the environment, `.env` files are ignored and the example file holds names only. | [GitHub governance evidence](../../evidence/github-governance.md), [backend README](../../app/backend/README.md), [ADR-007](../decisions/ADR-007-authentication-and-sessions.md), RSK-021 in the [Risk Register](../risks/README.md) | In place |
| 5. CI and automated verification | CI checks the types, runs the tests with a saved report and audits the dependencies. A high or critical finding in shipped code fails the build. A second workflow checks the database store against PostgreSQL 18, and a third runs the browser journeys in memory and on PostgreSQL. | `.github/workflows/ci.yml`, `.github/workflows/persistence-checks.yml`, `.github/workflows/e2e.yml`, the [Actions runs](https://github.com/DewaldAllers/SEN381-CivicConnect/actions), TD-005 in the [technical debt register](../technical-debt/README.md) | In place. `backend-checks` is a required check on `main`, and [PR #45](https://github.com/DewaldAllers/SEN381-CivicConnect/pull/45) shows a failing test blocked |
| 6. Quality strategy applied | The riskiest rules got the strongest checks: who may see and change a request (NFR-001, 12 tagged cases and the policy cases), one event for every change with a full rollback on failure (NFR-002, T-NFR-002-02), and stale writes (T-NFR-002-03). | [Test approach](../testing/README.md), [RTM](../requirements/RTM.md), DEC-017 and DEC-018 in the [decision log](../decisions/README.md) | In place for the API and the store |
| 7. Black-box, integration and system validation | Boundary values, decision tables and a state-transition run check the rules through real HTTP calls. Two browser journeys drive the real pages. | [Test cases](../testing/test-cases.md), the TC-API cases in [api.test.ts](../../app/backend/test/api.test.ts), the [browser journeys](../../app/e2e/README.md), the acceptance check in the [RTM](../requirements/RTM.md#acceptance-check) | API cases and both journeys pass, in memory and on PostgreSQL |
| 8. Performance and reliability | A load script follows AC-NFR-005 and a seed loads test data. A restart check and injected failures check reliability at the store. | [Load script](../../app/backend/scripts/perf-nfr005.mjs), [seed script](../../app/backend/scripts/seed-performance.ts), [data verification handoff](../data/m3-repository-handoff.md), TD-008 and TD-011 | Scripts built. The measured run has no result yet |
| 9. Defects and quality interpretation | Thirteen defects are recorded. Six product defects came from one review and share one cause, two halves written separately. All six are fixed, and no severity 3 defect is open. | [Defect Register](../defects/README.md) | Six fixed, two documentation defects fixed on merge |
| 10. Release readiness | The classification is NOT READY, with the reasons, what would change it and seven residual risks. | [Release evidence summary](../release/README.md) | NOT READY on 16 October 2026 |

The registers and the traceability matrix are continued in place and linked, not copied. The RTM is the [Requirements Traceability Matrix](../requirements/RTM.md), the risks are in the [Risk Register](../risks/README.md), the decisions are in the [decision log](../decisions/README.md), the debt is in the [Technical Debt Register](../technical-debt/README.md) and the AI use is in the [AI Usage Register](../ai-register/AI-Usage-Register.md).

The state column in the M3 index is the state on 16 October 2026. The [M3 findings, final status](#m3-findings-final-status) section below gives the final status.

## M4 evidence index

Each row follows an output SRC-M4 section 3 (p. 2) asks for. The state column says plainly what is in place and what is not. Detail stays in the linked artefact.

| M4 output | What we claim | Where the evidence is | State |
| --- | --- | --- | --- |
| Final integrated product | One version, the tag `v4.0-final`, holds the pages, the server and the PostgreSQL store working together. Two critical journeys run through it in a real browser. | [Demonstration guide](../demo/README.md), [browser journeys](../../app/e2e/README.md), [release evidence summary](../release/README.md) | In place |
| Existing functionality finalised | All 17 requirements are built. Fifteen are Implemented and two are Partially implemented. No new feature was added. | [RTM final outcome](../requirements/RTM.md#final-outcome) | In place |
| M1 scope to final delivery | Every original M1 commitment has a final status, and deferred items are kept apart from failed ones. | [M1 scope to final delivery](#m1-scope-to-final-delivery), [scope assessment](final-scope-assessment.md) | In place |
| Final acceptance demonstration | Each of the 40 acceptance criteria has a result and the evidence behind it. | [Scope assessment ledger](final-scope-assessment.md#criterion-ledger), [RTM acceptance check](../requirements/RTM.md#acceptance-check) | 34 Met, 3 Partially Met, 3 Not Met |
| M3 issue closure | Each M3 defect, check, risk and debt item has a final status. | [M3 findings, final status](#m3-findings-final-status) and the registers | In place |
| Final RTM | The existing RTM carries a final outcome for each requirement. | [RTM.md](../requirements/RTM.md) | In place |
| PED v4.0 | This document, finalised from v3.0 with its history kept. | This document | In place |
| Final project reflection | Short conclusions on value, scope, quality, risk, decisions, execution and what comes next. | [Project reflection and conclusion](#project-reflection-and-conclusion) | In place |
| Quantified scope completion | (34 + 0.5 × 3) ÷ 40 × 100 = 88.75%, above the 80% target. | [Scope assessment](final-scope-assessment.md#calculation-and-interpretation) | In place |
| Final deployment decision | Staging, with an evidence-based no-go for production. | [Final deployment state](#final-deployment-state), [release evidence summary](../release/README.md#final-deployment-state) | In place |

The registers are continued in place and linked, not copied: the [Risk Register](../risks/README.md#final-status-m4), the [Defect Register](../defects/README.md), the [Technical Debt Register](../technical-debt/README.md), the [change control register](../change/README.md), the [decision log](../decisions/README.md) and the [AI Usage Register](../ai-register/AI-Usage-Register.md).

## M1 scope to final delivery

Dewald's [scope assessment](final-scope-assessment.md) counts the 40 acceptance criteria in the approved M1 baseline, from the merge of PR #26 on 9 September 2026. It counts criteria and not tests, screens or commits. The [data finalisation record](../data/m4-data-finalisation.md) holds the checks behind the FR-002 and NFR-003 rows. The table below groups the criteria under the 16 original scope items and adds the items that were deferred or out of scope, so each one has a final status.

| M1 scope item | M1 priority and status | Final status | Acceptance criteria | Evidence | Conclusion or reason for variance |
| --- | --- | --- | --- | --- | --- |
| Requester 1: submit a request (FR-001) | Must, in scope | Implemented | 2 of 2 Met | TC-API-05, TC-API-06, T-E2E-01 | Delivered as committed |
| Requester 2: choose a category (FR-002) | Must, in scope | Implemented | 2 of 2 Met | TC-API-07, T-FR-002-01 | Delivered. The six categories are team configuration and no stakeholder confirmed them. No seeded staff member holds a grant for two of them (TD-015) |
| Requester 3 and 4: see status and own list (FR-003) | Must, in scope | Implemented | 2 of 2 Met | TC-API-10, TC-REPO-09, T-E2E-01 | Delivered as committed |
| Requester 5: meaningful feedback (FR-004) | Must, in scope | Implemented | 2 of 2 Met | TC-API-19, TC-API-22, TC-API-26, T-FR-011-03 | Delivered. Requesters see "Staff" and not names (CR-009) |
| Staff 7 and 9: queue and detail (FR-005) | Must, in scope | Implemented | 2 of 2 Met | TC-API-12, TC-API-13, T-E2E-02 | Delivered. Staff in the seed data cover four of the six categories (TD-015) |
| Staff 8: filter and sort (FR-006, FR-012) | Must and Should, in scope | Implemented | 4 of 4 Met | TC-API-14, TC-API-15 | Delivered as filter and sort. No full text search was committed |
| Staff 10: take or assign a request (FR-007) | Must, in scope | Implemented | 3 of 3 Met | TC-API-16 to TC-API-18 | Delivered. Eligibility comes from the category grants |
| Staff 11 and 13: status, resolve and close (FR-008) | Must, in scope | Implemented | 3 of 3 Met | TC-API-19 to TC-API-24 | Delivered. The server ignores an owner claim in the request (CR-007), and the lifecycle limits are our proposals (CR-008) |
| Staff 12: actions, notes and due dates (FR-009) | Must, in scope | Implemented | 2 of 2 Met | TC-API-26 to TC-API-28, T-FR-009-02 | Delivered as committed |
| Management 14 to 16: information, buckets and views (FR-010) | Must, in scope | Implemented | 3 of 3 Met | TC-API-29 to TC-API-31, T-E2E-02 | Delivered. Overdue counts as open too, and the page says so |
| Management 17: accountability information (FR-011) | Must, in scope | Implemented | 2 of 2 Met | TC-API-19, TC-API-26, T-FR-011-03 | Delivered. No analytics or export was committed |
| Protected access (NFR-001) | Must, in scope | Implemented against the proposed matrix | 2 Met, 1 Partially Met | Permission matrix, TC-API-01 to TC-API-04, T-E2E-02 | The exact matrix is approved in principle only (CR-002, P-03). Grants are fixed server settings (TD-009) |
| One event for every change (NFR-002) | Must, in scope | Implemented | 2 of 2 Met | TC-API-19, T-NFR-002-01 to T-NFR-002-03 | Delivered. The administrative redaction route from CR-004 is not built (TD-016) |
| Data kept across a restart (NFR-003) | Must, in scope | Implemented | 2 of 2 Met | T-NFR-003-01, six statuses on PostgreSQL | Delivered for a restart of the application. No backup or restore was shown (TD-010) |
| First use usability (NFR-004) | Should, in scope | Partially implemented | 1 Met, 2 Partially Met | [Five person check](../testing/nfr-004-results.md) | The pages exist and five people finished both tasks after an explanation. Nobody was timed one by one, so the timed rule is not shown |
| Response time under load (NFR-005) | Should, in scope | Partially implemented | 3 Not Met | `scripts/perf-nfr005.mjs` | The load script exists and no measured run exists (TD-008). The target stays a proposal |
| Features beyond the minimum, such as outside messaging, reopening closed requests, grant administration and extra analytics | Deliberately deferred by the scope baseline | Still deferred | Not applicable to the committed scope | [Scope baseline](Member1_Part1.md) | Correctly outside the committed scope, and not counted as failed |
| Technology stack, architecture, schema, client, API, patterns and CI | Out of scope for M1 as a milestone boundary | Delivered at M2 and M3 | Not applicable | ADR-001 to ADR-007, [app](../../app) | They entered scope when the milestones set them. They were never a product exclusion |
| Production deployment | Out of scope for M1 | Not done, by decision | Not applicable | [Release evidence summary](../release/README.md#final-deployment-state) | A deployment decision and not a committed product function. The final state is staging, with the reasons recorded |

Scope completion is (Met + 0.5 × Partially Met) ÷ applicable criteria × 100. The criteria are the 40 in the approved M1 baseline, so the calculation is (34 + 0.5 × 3) ÷ 40 × 100 = 88.75%. That is above the 80% target. Every Must requirement is Implemented. The one qualification on a Must requirement is the permission matrix under NFR-001, which is approved in principle only. The three Not Met criteria all belong to NFR-005, a Should requirement. The percentage is a control and not the whole judgement: it does not show that the product is ready for production, and the deployment section below says why it is not.

Approved changes did not move the count. CR-002 closed the five open proposals, CR-003 defined overdue on calendar time, CR-004 added a constraint on the data model, CR-005 put all 17 requirements into the M3 build, and CR-006 to CR-009 changed how the product is built. None of them added, removed or reworded an original criterion, so the denominator is the one approved on 9 September. The [change control register](../change/README.md) holds each one.

## M3 findings, final status

SRC-M4 section 7 (p. 4) asks for a final status on each kind of M3 finding. A closed item stays in its register with the evidence that closed it.

| M3 item | Final status |
| --- | --- |
| Important open defects | DEF-006 and DEF-010, both severity 3 and both found in the review of PR #41, were fixed in PR #42. I reran the suite on the final version, 153 tests and 33 on PostgreSQL, and both stay fixed. All 14 defects are Closed and none is open. |
| Failed or conditional quality checks | The two gaps in the M3 acceptance check, FR-002 and NFR-003, now have passing cases. The Windows test crash (TD-014) did not happen in the M4 runs, but we have not found its cause, so it stays open. NFR-004 remains an informal result and NFR-005 has no measurement. |
| Residual risks | The [Risk Register](../risks/README.md#final-status-m4) has a final rating and evidence for all 22 entries. Eight are Closed and 14 stay open. The release summary carries the residual risk table, with one row added for the missing staff grants. |
| Technical debt | Seven items are repaid. Nine stay open with their consequence stated, TD-008 to TD-016. TD-015 and TD-016 came from the final data check. |
| Incomplete integration | The pages, the server and the store work as one system. Two gaps remain. No staging run of the final version is in the repository, and no seeded staff member can work a request in Lost property or Other (TD-015). |
| Release and staging evidence | The staging and load scripts from M3 still stand, and the release summary is updated for the final counts. The classification stays NOT READY for production, with staging as the final state. |

## Significant decisions and their consequences

Three earlier decisions left the clearest marks on the final product. The [decision log](../decisions/README.md) holds the full entries.

ADR-002 said a change and its history event commit together or not at all. It is the decision with the clearest good result. The NFR-002 criteria are Met, the rollback and stale-write cases pass on PostgreSQL, and the browser journeys read their history through the pages. It also made the review sharp, because Dewald could send raw requests at the store and count one event for each change. It had a cost too. DEF-006 to DEF-011 appeared when the endpoints met the stricter store, because the two halves had been written apart.

DEC-007 deferred the stack to M2. It bought a choice made against requirements whose open questions had been found and closed, and CR-003 and CR-004 put constraints on the data design that a stack chosen on 8 September would not have met. It cost three weeks of construction time, which landed on M3. The result at the end is that all 17 requirements are built, and the two incomplete ones, NFR-004 and NFR-005, are the two DEC-015 named to leave first. We would keep the decision. The missing load run and timed usability check show what the late start cost.

CR-006 and DEC-016 replaced React and Vite with plain HTML, CSS and JavaScript pages served by Express. The client became four pages, one stylesheet and a small folder of scripts, with no build step, and CI runs both browser journeys against it. The cost shows in the decision's own trade-offs. The plain pages repeat code that components would share, and the server sets no Content-Security-Policy header yet (TD-012).

## Final deployment state

The final deployment state is staging, with a no-go for production. SRC-M4 section 11 (p. 5) allows this when the decision rests on evidence, and the [release evidence summary](../release/README.md#final-deployment-state) gives that evidence in a table, with the register entry behind each row. In short, sessions live in server memory and sign in has no attempt limit (security), the redaction route is not built and the data protection position is unconfirmed (privacy), one free database holds everything and no restore has been shown (integrity), no load result exists (reliability), and no staging run of the final version is in the repository (operations).

Before a production release we would need these things, in this order: a measured load result for NFR-005, a staging run of the tagged version with the rollback shown, a restore shown on a fresh database, the permission matrix approved, the redaction route built, sessions held in a shared store with a limit on sign in attempts, and staff grants for all six categories. None of them needs paid infrastructure. The demonstration runs the tagged version on a team machine, which shows the product working and is not a release.

## Known limitations and future work

| Limitation | What it means | What comes next |
| --- | --- | --- |
| NFR-005 has no measured result (TD-008, TD-011) | We do not know the response time under load | Run the load script against the database, then approve or amend the number |
| NFR-004 is an informal result (TD-008) | The five minute target is shown by observation only | Run the timed check from the [check sheet](../testing/nfr-004-check.md) and write down each time |
| The permission matrix is approved in principle only (CR-002, TD-009) | AC-NFR-001.1 reads Partially Met, and grants are fixed server settings | Get the matrix approved and add a way to change grants |
| The redaction route is not built (TD-016) | Personal data cannot be removed from a request | Build it with the safeguards in RSK-016 |
| One free database, no restore shown (TD-010) | The database ends on 13 November 2026, and losing it loses every request | Set up a new database from the migrations and show a restore |
| Sessions in memory, no sign in limit, no Content-Security-Policy header, no secret scanner in CI (TD-009, TD-012, TD-013) | A restart signs everyone out, and repeated password guesses are not slowed | Share the sessions, add the limit and the header, and add the scanner |
| No seeded staff member holds a grant for Lost property or Other (TD-015) | Requests in those two categories cannot be assigned with the supplied users | Give staff the grants |
| A test process on Windows sometimes crashes (TD-014) | A run can report fewer tests and fail for no reason in our code | Find the cause, or pin another version |

Four kinds of work were deferred on purpose and are not failures: outside messaging, reopening closed requests, grant administration and extra analytics. The scope baseline kept them out, and the final scope table says so.

## Project reflection and conclusion

The problem was that community service requests had no single place to be sent, worked and watched. The final product gives that to three roles. A requester sends a request and follows it, staff work it through the controlled statuses, and management sees the counts, with every change attributed in the history. Two browser journeys run it from sent to Resolved and through the refusals, in memory and on PostgreSQL.

We delivered 88.75% of the original acceptance criteria, with every Must requirement implemented. The gap is in the two Should requirements that measure the system, not in what it does. That matches the order DEC-015 set when it asked what would leave first.

Our confidence comes from 153 tests, 33 more against PostgreSQL, two journeys in CI, a clean dependency audit and a required check that blocked a failing change in PR #45. We are less sure about response time under load, a timed usability result, anything beyond a restart of one server, and the permission matrix and lifecycle limits, which stakeholders have not confirmed.

Fourteen defects were found and all are Closed. Six of them, the product defects from PR #41, came from two halves of the system written apart and checked only against their own tests. Nine debt items and 14 risks stay open, each with an owner in its register.

Three things shaped delivery most. Deferring the stack to M2 moved construction into M3. Splitting the work by area meant the integration review was where the product defects showed up. The required check kept a failing test off `main`.

If the project continued, the order in the limitations table is the order we would follow. CivicConnect delivers what it committed to for requesters, staff and management as a working, tested, single server system. It stays in staging because load, recovery, personal data removal and sign in hardening are not yet shown.

## Contributors and section ownership

| Member | GitHub account | Owns in v2.0 | Owns in v3.0 | Owns in v4.0 |
| --- | --- | --- | --- | --- |
| Liam de Villiers | `Liamdv12` | Problem and business need, stakeholders, scope, constraints (v1.0). Technology selection and deployment direction, research informed design and integration decisions (v2.0) | Sign in and sessions, the endpoints, the CI gate and audit step, staging and the performance run | The backend and deployment evidence, the staging and load position |
| Dewald Allers | `DewaldAllers` | Requirements, acceptance criteria, AI Usage Register (v1.0). Architecturally significant requirements, architecture selection and diagrams, data and persistence baseline (v2.0) | The database store, migrations, queries, work records and the data verification | The final data evidence and the M1 scope to final delivery assessment |
| Tristan Els | `tristanels` | Risk Register, Forward Engineering Considerations, Engineering Decision Log, GitHub governance evidence (v1.0). Document control, change control, baseline register, RTM, assumptions and dependencies (v2.0) | The client pages, the evidence and test designs, the registers, the RTM, this document and the release tag | This document, the final RTM, the registers, the release evidence summary and the final tag |

Ownership means the member drafts the part and answers for it first. All three of us answer for the whole document. Roles do not divide accountability for the engineered product, and any of us can be asked about any part of it.

## Section map

| PED section | Location | Version | Status |
| --- | --- | --- | --- |
| Problem, business need, stakeholders, scope, constraints | [Member1_Part1.md](Member1_Part1.md) | v1.0 | Baselined, under review for v2.0 scope effects |
| Team working agreement | [team-working-agreement.md](team-working-agreement.md) | v1.0 | Agreed 9 September 2026 |
| Functional requirements | [functional-requirements.md](../requirements/functional-requirements.md) | v1.0 | Baselined, affected by CR-002 |
| Non-functional requirements | [non-functional-requirements.md](../requirements/non-functional-requirements.md) | v1.0 | Baselined, affected by CR-002 and CR-004 |
| Acceptance criteria | [acceptance-criteria.md](../requirements/acceptance-criteria.md) | v1.0 | Baselined, affected by CR-002 and CR-003 |
| Requirement proposals P-01 to P-05 | [decisions-to-confirm.md](../requirements/decisions-to-confirm.md) | v1.0 | Closed or deferred by CR-002 |
| Requirements Traceability Matrix | [RTM.md](../requirements/RTM.md) | v4.0 | Final outcome section added. Evidence and status describe the final version |
| Test approach and test cases | [testing/README.md](../testing/README.md), [test-cases.md](../testing/test-cases.md), [nfr-004-check.md](../testing/nfr-004-check.md), [nfr-004-results.md](../testing/nfr-004-results.md) | v1.0 | 49 cases designed, approved on merge of PR #34. The first use check sheet and its results are new in v3.0 |
| Change control register | [change/README.md](../change/README.md) | v4.0 | All nine changes approved, none raised at M4 |
| Baseline register and sign-off | [baselines/README.md](../baselines/README.md) | v2.0 | New in v2.0 |
| Risk Register | [risks/README.md](../risks/README.md) | v3.0 | Final review: 22 entries, 8 closed, 14 open |
| Assumptions and dependencies | [assumptions/README.md](../assumptions/README.md) | v2.0 | New in v2.0 |
| Forward Engineering Considerations | [forward-engineering/README.md](../forward-engineering/README.md) | v2.0 | Reviewed |
| Engineering Decision Log and ADR index | [decisions/README.md](../decisions/README.md) | v4.0 | 18 decisions and 7 ADRs, with their final consequences |
| Defect Register | [defects/README.md](../defects/README.md) | v4.0 | 14 entries, all closed |
| Technical Debt Register | [technical-debt/README.md](../technical-debt/README.md) | v4.0 | 16 entries, 7 repaid, 9 open |
| Threat review | [threat-review.md](../risks/threat-review.md) | v3.0 | 16 threats, each with its control, its evidence and any gap |
| Release evidence summary | [release/README.md](../release/README.md) | v4.0 | NOT READY for production, staging with a justified no-go |
| M1 scope to final delivery assessment | [final-scope-assessment.md](final-scope-assessment.md) | v4.0 | 40 criteria: 34 Met, 3 Partially Met, 3 Not Met |
| M4 data finalisation record | [m4-data-finalisation.md](../data/m4-data-finalisation.md) | v4.0 | The six category and six status checks, with the failed first run kept |
| GitHub governance evidence | [github-governance.md](../../evidence/github-governance.md) | v1.0 | Baselined, rechecked for v2.0 |
| AI Usage Register | [AI-Usage-Register.md](../ai-register/AI-Usage-Register.md) | v3.0 | Extended with the M2 and M3 entries |
| Source register | [sources.md](../sources.md) | v4.0 | Extended with SRC-M2, SRC-M3 and SRC-M4 |
| Architecturally significant requirements and quality drivers | [architecture-and-data.md](architecture-and-data.md) | v2.0 | ASR-01 to ASR-05 |
| Architecture selection, diagrams and ADR | [ADR-001](../decisions/ADR-001-civicconnect-architecture.md) | v2.0 | Modular application server |
| Data and persistence model | [ADR-002](../decisions/ADR-002-request-history-persistence.md), [permission matrix](../data/permission-matrix.md), [history contract](../data/request-history-contract.md), [data handoff](../data/m3-repository-handoff.md) | v3.0 | Store built and verified against PostgreSQL 18 |
| Technology selection and deployment direction | [ADR-003](../decisions/ADR-003-technology-stack-and-deployment.md), [technology selection](../technology/technology-selection.md) | v2.0 | Versions pinned, client changed by CR-006 |
| Sign in, sessions and scope | [ADR-007](../decisions/ADR-007-authentication-and-sessions.md) | v3.0 | Merged in PR #38 |
| Initial design and integration decisions | [ADR-004](../decisions/ADR-004-request-lifecycle.md), [ADR-005](../decisions/ADR-005-authorization-policy.md), [ADR-006](../decisions/ADR-006-api-integration.md), [API v1](../integration/api-v1.md) | v3.0 | Implemented and tested |
| Client pages and wireframes | [app/frontend](../../app/frontend/README.md), [wireframes](../design/wireframes/README.md) | v3.0 | Requester, staff and management pages |
| Browser journeys | [app/e2e](../../app/e2e/README.md) | v3.0 | T-E2E-01 and T-E2E-02 pass in memory and on PostgreSQL |
| Demonstration guide | [docs/demo](../demo/README.md) | v4.0 | How to start the final version, the steps and the six final stages |
| Application and technical documentation | [root README](../../README.md), [backend README](../../app/backend/README.md) | v2.0 | Setup and run instructions for the backend |

## How this document is controlled

Identifiers are permanent. A requirement, risk, decision, concern, change or baseline keeps its identifier for the life of the project. The prefixes in use are `FR`, `NFR`, `AC`, `NEED-P2`, `P`, `RSK`, `FEC`, `DEC`, `ADR`, `CR`, `ASM`, `DEP`, `BL`, `ASR`, `DEF` and `TD`.

Baselined content is not silently edited. Once a baseline is approved, a material change to a requirement, scope item, constraint or approved decision goes through the [change control process](../change/README.md) before it is applied, and the superseded position stays readable.

Artefact version numbers follow the PED version. An artefact that formed part of the v1.0 baseline is v1.0, whatever draft number it carried while it was being written, and an artefact revised for M2 is v2.0. CR-001 records the correction of the version and status lines that were left at their drafting values when v1.0 was baselined.

Quality, security, performance and readiness claims carry the evidence that supports them, or they are not made. Where a control is not met, the gap is recorded rather than described as met.

Before a commit, I check that no file is empty, that no long dashes or curly quotes crept in, that every link and heading anchor resolves, and that every identifier cited in the documents or the code has an entry in a register. DEF-012 and DEF-013 came from those checks.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 6 and 6.1 (one evolving engineering record and the PED quality standard, pp. 8-9), 9 (GitHub governance, p. 11), 11 (requirements, traceability and baseline standard, p. 12), 13 (decisions and ADRs, p. 13), 14 (change management, p. 13).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 2 (M2 as a continuation, p. 2), 4 and 4.1 (one evolving PED and continued engineering documentation, p. 3), 6 (the M2 baseline, p. 7), 12 (required submission set, p. 9).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 3: Controlled Construction, Integration, Quality and Release Readiness*. Cited as `SRC-M3`. Sections used: 3 (minimum viable M3, p. 1), 4 and 5 (deliverables and the submission information block, pp. 2-3), 6 (PED v3.0 as an evidence index, p. 4).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Final Project / Milestone 4: Finalise, Consolidate and Conclude*. Cited as `SRC-M4`. Sections used: 3 (required final outputs, p. 2), 5 (M1 scope to final delivery, p. 3), 7 (M3 findings to final closure, p. 4), 8 (PED v4.0, p. 4), 10 (final reflection, p. 5), 11 (final deployment and go-live evidence, p. 5), submission requirements and the final submission information block (pp. 9-10).

Full source records and fingerprints are in the [source register](../sources.md).
