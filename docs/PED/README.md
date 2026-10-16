# CivicConnect Project Engineering Document

| Field | Entry |
| --- | --- |
| Document | CivicConnect Project Engineering Document (PED) |
| Current version | v3.0, in progress |
| Version date | 16 October 2026 |
| Status | In progress for M3. Each part is approved on the merge of the pull request that carries it |
| Previous baselines | v1.0, baselined 9 September 2026. v2.0, submitted as BL-002 on 30 September 2026 and approved on the merge of PR #30 on 1 October 2026 |
| Document control owner | Tristan Els |
| Contributors | Liam de Villiers, Dewald Allers, Tristan Els |
| Approval | Two approvals from members other than the author on every pull request into `main`, per the [team working agreement](team-working-agreement.md) |

This is the single engineering record for CivicConnect. It is not recreated at each milestone. Version 3.0 extends version 2.0 in place, and the M1 and M2 content stays readable underneath it. There is no separate Milestone 3 report, and none will be written alongside this document.

Version 3.0 is the primary M3 document, and it works as an evidence index. It says what we claim and points to the repository, the CI runs and the registers where the evidence lives. It does not copy them.

The PED is held as linked Markdown in this repository rather than as one file, so every part of it sits under the same version control, review and change control as the rest of the project. The section map below says where each part lives.

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
| v3.0 | In progress from 9 October 2026 | M3 | Defect Register, Technical Debt Register and release evidence summary. Change control extended to CR-009, and the decision log to DEC-018 and ADR-007. Test approach and 49 designed test cases. RTM filled in from `main` with executed cases. Backend: sign in and sessions, every endpoint, the PostgreSQL store with migrations, the CI audit and the persistence workflow, and the staging and load scripts. Client pages and wireframes. Two browser journeys with their own CI workflow. The M3 evidence index and submission information in this document. | PR #31 to #34, PR #36 to #42 and PR #44 merged into `main`, each approved by two members who did not author it. PR #43 carries this update. The release candidate is the tag `v3.0-m3`, on the head commit of PR #43 |

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

## Contributors and section ownership

| Member | GitHub account | Owns in v2.0 | Owns in v3.0 |
| --- | --- | --- | --- |
| Liam de Villiers | `Liamdv12` | Problem and business need, stakeholders, scope, constraints (v1.0). Technology selection and deployment direction, research informed design and integration decisions (v2.0) | Sign in and sessions, the endpoints, the CI gate and audit step, staging and the performance run |
| Dewald Allers | `DewaldAllers` | Requirements, acceptance criteria, AI Usage Register (v1.0). Architecturally significant requirements, architecture selection and diagrams, data and persistence baseline (v2.0) | The database store, migrations, queries, work records and the data verification |
| Tristan Els | `tristanels` | Risk Register, Forward Engineering Considerations, Engineering Decision Log, GitHub governance evidence (v1.0). Document control, change control, baseline register, RTM, assumptions and dependencies (v2.0) | The client pages, the evidence and test designs, the registers, the RTM, this document and the release tag |

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
| Requirements Traceability Matrix | [RTM.md](../requirements/RTM.md) | v3.0 | Implementation and evidence columns filled from `main`, with an acceptance check |
| Test approach and test cases | [testing/README.md](../testing/README.md), [test-cases.md](../testing/test-cases.md), [nfr-004-check.md](../testing/nfr-004-check.md), [nfr-004-results.md](../testing/nfr-004-results.md) | v1.0 | 49 cases designed, approved on merge of PR #34. The first use check sheet and its results are new in v3.0 |
| Change control register | [change/README.md](../change/README.md) | v3.0 | CR-001 to CR-006 approved, CR-007 to CR-009 raised |
| Baseline register and sign-off | [baselines/README.md](../baselines/README.md) | v2.0 | New in v2.0 |
| Risk Register | [risks/README.md](../risks/README.md) | v2.0 | Reviewed and extended |
| Assumptions and dependencies | [assumptions/README.md](../assumptions/README.md) | v2.0 | New in v2.0 |
| Forward Engineering Considerations | [forward-engineering/README.md](../forward-engineering/README.md) | v2.0 | Reviewed |
| Engineering Decision Log and ADR index | [decisions/README.md](../decisions/README.md) | v3.0 | 18 decisions and 7 ADRs |
| Defect Register | [defects/README.md](../defects/README.md) | v3.0 | 13 entries, 5 closed, 6 fixed, 2 in progress |
| Technical Debt Register | [technical-debt/README.md](../technical-debt/README.md) | v3.0 | 14 entries, 7 repaid, 7 open |
| Threat review | [threat-review.md](../risks/threat-review.md) | v3.0 | 16 threats, each with its control, its evidence and any gap |
| Release evidence summary | [release/README.md](../release/README.md) | v3.0 | Classified NOT READY on 16 October 2026 |
| GitHub governance evidence | [github-governance.md](../../evidence/github-governance.md) | v1.0 | Baselined, rechecked for v2.0 |
| AI Usage Register | [AI-Usage-Register.md](../ai-register/AI-Usage-Register.md) | v3.0 | Extended with the M2 and M3 entries |
| Source register | [sources.md](../sources.md) | v2.0 | Extended with SRC-M2 |
| Architecturally significant requirements and quality drivers | [architecture-and-data.md](architecture-and-data.md) | v2.0 | ASR-01 to ASR-05 |
| Architecture selection, diagrams and ADR | [ADR-001](../decisions/ADR-001-civicconnect-architecture.md) | v2.0 | Modular application server |
| Data and persistence model | [ADR-002](../decisions/ADR-002-request-history-persistence.md), [permission matrix](../data/permission-matrix.md), [history contract](../data/request-history-contract.md), [data handoff](../data/m3-repository-handoff.md) | v3.0 | Store built and verified against PostgreSQL 18 |
| Technology selection and deployment direction | [ADR-003](../decisions/ADR-003-technology-stack-and-deployment.md), [technology selection](../technology/technology-selection.md) | v2.0 | Versions pinned, client changed by CR-006 |
| Sign in, sessions and scope | [ADR-007](../decisions/ADR-007-authentication-and-sessions.md) | v3.0 | Merged in PR #38 |
| Initial design and integration decisions | [ADR-004](../decisions/ADR-004-request-lifecycle.md), [ADR-005](../decisions/ADR-005-authorization-policy.md), [ADR-006](../decisions/ADR-006-api-integration.md), [API v1](../integration/api-v1.md) | v3.0 | Implemented and tested |
| Client pages and wireframes | [app/frontend](../../app/frontend/README.md), [wireframes](../design/wireframes/README.md) | v3.0 | Requester, staff and management pages |
| Browser journeys | [app/e2e](../../app/e2e/README.md) | v3.0 | T-E2E-01 and T-E2E-02 pass in memory and on PostgreSQL |
| Demonstration guide | [docs/demo](../demo/README.md) | v3.0 | How to start the release candidate and the steps for the demonstration |
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

Full source records and fingerprints are in the [source register](../sources.md).
