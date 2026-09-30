# Assumptions and dependencies

Version 2.1 | 30 September 2026 | Owner: Tristan Els | Status: **8 assumptions, 8 dependencies; 4 dependencies closed**

An assumption is something we are treating as true without evidence, and would have to unwind if it turned out to be false. A dependency is something we need from someone else before a decision can close. SRC-MASTER section 12 (p. 12) asks for assumptions that could materially affect the project to be considered for risk treatment, so every entry here names the risk it connects to or says that it carries none.

M1 held assumptions inside the artefacts that relied on them. The quality targets said they were proposals, the personal data position said its obligation was unconfirmed, and the stack deferment listed what was missing. That was readable in each place and invisible as a set. The architecture, persistence and technology decisions rest on several of them at once.

## Why this register exists

One assumption in this project has already been proved wrong, and it cost a control.

On 7 September the repository was created as private under DEC-001, on the assumption that branch protection would be available. Nothing in the GitHub repository creation flow says that protection depends on visibility under a free plan. The assumption was found to be false only when we tried to apply the control, which returned HTTP 403. In the two days between, a pull request reached `main` with no review recorded.

The lesson recorded in DEC-001 was that a required control should be tested at the point the environment is set up rather than assumed to be available. The wider version of that lesson is this register. An assumption that is written down can be checked by somebody. One that is only implied gets checked by an event.

## Assumptions

| ID | What we are assuming | Why it matters now | What happens if it is wrong | Evidence held | Related risk | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| ASM-001 | The Master Project Brief is the only stakeholder source available. No representative of the organisation can be consulted. | Every requirement traces to the brief, and the five proposals fill the gaps the brief leaves. The whole requirements baseline rests on this. | Several proposals would need re-checking against what the stakeholder actually wants, most likely P-02 and P-03, which carry the workflow and the access rule. That would reach the data model and the permission boundary. | None. The team has not asked whether a stakeholder is reachable. | RSK-005 | Dewald |
| ASM-002 | The Protection of Personal Information Act 4 of 2013 is the obligation most likely to apply, and we design as though it binds even though nobody has confirmed that it does. | It is why CR-004 puts a deletion and anonymisation route into the data model rather than leaving records permanent. | If it does not bind, we have built a capability we did not need, which is cheap. If it binds and we had assumed otherwise, the schema would have to change after the data model was baselined, which is not cheap. The asymmetry is the reason for the assumption. | None. No member has checked, and the lecturer has not been asked. | RSK-006 | Tristan |
| ASM-003 | CivicConnect serves one community organisation, and nobody has given us a user or request volume. The ten concurrent users in NFR-005 is a test assumption rather than a demand forecast. | It is why scalability is not treated as an architecture driver, and why the persistence choice is not being sized against a load figure. | An architecture proportionate to one small organisation would be the wrong shape for a larger one. The cost would be an architecture change rather than a tuning exercise. | The brief describes one community-focused organisation and gives no figures (SRC-MASTER section 2, p. 6). | RSK-004 | Dewald |
| ASM-004 | The organisation measures overdue work on calendar time rather than working hours. | CR-003 decides the rule on this basis. The management report in FR-010 and the M3 test data are both built to it. | The overdue counts would be wrong for every request whose due date falls over a weekend or overnight. Management reporting is one of the three capability groups in the brief, so a wrong count is a wrong deliverable, not a cosmetic defect. | None. It follows from ASM-001. | RSK-005 | Tristan |
| ASM-005 | The stack selected in M2 will install and run on the team machines and on the institutional environment. | Construction in M3 depends on it, and the selection is being made now. | Construction slips while the team either fixes the environment or reselects the stack, and the technology ADRs would have to be superseded rather than amended. | None yet. SRC-MASTER section 25 (p. 23) states that Belgium Campus does not guarantee it. A proof of concept is the evidence that would replace this assumption. | None yet. ADR-003 selects Node 22.14.0, Express 5.2.1, TypeScript 7.0.2, Vitest 5.0.2 and PostgreSQL 18.6. The backend, its tests and the type check run on the team machines and on the GitHub runner, which covers Node, Express, TypeScript and Vitest. React, Vite and PostgreSQL have not been run by anyone yet, and neither has anything on the institutional environment. | Liam |
| ASM-006 | A free tier will cover the staging deployment M3 requires. | It is why the cost constraint has not yet forced any decision, and why no platform cost appears in the project. | Either the staging requirement is unreachable, or it needs payment the cost constraint does not allow, and the team would have to deploy locally and explain what differs from production. | None. The free-tier limits of candidate platforms have not been researched. | RSK-010 | Liam |
| ASM-007 | The repository stays public for the life of the module, so branch protection stays available under the free plan. | The two-approval control is only enforced because DEC-008 made the repository public. The enforcement disappears with the visibility. | The team returns to operating a mandatory control by agreement, which is the situation RSK-001 described before it materialised. | API readback on 9 September returned `visibility: public` and `protected: true`. Neither is a guarantee about tomorrow. | RSK-001 | Dewald |
| ASM-008 | A single database instance is acceptable for the educational deployment. | It shapes the persistence decision and the availability position taken in the architecture. | The architecture would need a replication or failover story it does not currently have, and the data model decisions taken around a single instance would need revisiting. | None. This is the working position, not an approved decision. The persistence decision can accept it explicitly or reject it. | ADR-002 records the single store as a single point of failure and a possible query bottleneck, and declines to add replication without evidence. That makes the assumption explicit rather than approved. | Dewald |

## Dependencies

| ID | What we need | Who provides it | What it blocks | State on 29 September 2026 | Related risk |
| --- | --- | --- | --- | --- | --- |
| DEP-001 | The named role, action and data scope permission matrix behind P-03 | Dewald Allers | The data model, the architecture enforcement point, and the rows of the permission test matrix NFR-001 promises | **Closed 2026-09-30.** The [permission matrix](../data/permission-matrix.md) exists with scope definitions, role and action rules, and six review cases. It is proposed rather than approved, and the backend still supplies a fixed approved scope instead of evaluating a grant. | RSK-005, RSK-013 |
| DEP-002 | The M2 technology selection with versions and dependencies | Liam de Villiers | Every technology cell in the RTM, the verification environment that would let the P-05 targets be approved, the dependency audit, and the deployment direction | **Closed 2026-09-30.** [ADR-003](../decisions/ADR-003-technology-stack-and-deployment.md) records the stack with pinned versions and the deployment direction. | RSK-007, RSK-014 |
| DEP-003 | Assignment 2 design quality and design pattern research | External, on the A2 schedule across Weeks 3 and 4 | The two design problem decisions M2 requires | **Closed 2026-09-30.** Cited in ADR-001 as Part 3 section 3, comparing in-process, HTTP and asynchronous interaction. | RSK-018, RSK-020 |
| DEP-004 | Assignment 2 persistence research | External, on the A2 schedule | The transaction, validation, integrity and concurrency decisions inside the data model | **Closed 2026-09-30.** Cited in ADR-002 as Part 2 section 2.1, on the atomic write boundary for a change and its audit event. The boundary was taken from it; the MongoDB example it was demonstrated with was not. | RSK-015, RSK-020 |
| DEP-005 | Assignment 2 API and integration research | External, on the A2 schedule | Interface decisions, once implementation reaches a boundary that needs one | Outstanding, and not yet blocking, because no component boundary exists | RSK-020 |
| DEP-006 | All three members available to approve pull requests | The team | Every merge into `main`. Two approvals from non-authors on a team of three means every merge needs everyone. | Live. All three members have authored and approved pull requests since 9 September. | RSK-002 |
| DEP-007 | Repository owner access to read back the governance settings | Dewald Allers | The governance evidence at the M2 gate, because the 9 September readback is a dated observation rather than a standing guarantee | Available | RSK-001 |
| DEP-008 | A lecturer position on whether a public coursework repository is acceptable | External | Nothing today. It would reverse DEC-008 and remove branch protection if the answer is no. | Outstanding. Recorded in DEC-006 as missing information and never resolved, only made irrelevant by the team choosing for itself. | RSK-001 |

## What closed on 30 September

Four dependencies closed when the architecture, data and technology work merged.

DEP-001 and DEP-002 were the two blocking BL-002. The permission matrix now exists and the stack is selected, which is why fourteen RTM cells that read Planned on 29 September now carry a decision.

DEP-003 and DEP-004 closed as citations rather than as documents. The Assignment 2 sections the team used are named in ADR-001 and ADR-002, and each ADR states what it took from the research and what it left behind. DEP-005 stays open because no component boundary needs it yet.

Closing a dependency does not approve what filled it. The permission matrix is proposed, and the backend still supplies a fixed approved scope rather than evaluating a grant against it. That gap is RSK-013.

## How these are reviewed

Both registers are reviewed at each milestone gate alongside the Risk Register. An assumption is either confirmed, and then it stops being an assumption and becomes recorded evidence, or it is disproved, and then it becomes a change request with an impact analysis. Leaving one in this table for four milestones without either happening is itself a finding.

A dependency closes when the thing it names exists in the repository. Until then it stays here with a state, because a dependency described as in progress for three weeks is the clearest early signal that a baseline is not going to be ready.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 2 (project scenario, p. 6), 12 (risk, assumptions and constraint management, p. 12), 25 (student disclaimer, p. 23).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 3 (progressive evidence, pp. 2-3), 12 (required submission set, p. 9).

Republic of South Africa (2013) *Protection of Personal Information Act 4 of 2013*. Cited in ASM-002. Applicability is not confirmed.

Full source records are in the [source register](../sources.md).
