# CivicConnect Project Engineering Document

| Field | Entry |
| --- | --- |
| Document | CivicConnect Project Engineering Document (PED) |
| Current version | v2.0 |
| Version date | 30 September 2026 |
| Status | Baselined as BL-002, accepted with conditions on 30 September 2026 |
| Previous baseline | v1.0, baselined 9 September 2026 |
| Document control owner | Tristan Els |
| Contributors | Liam de Villiers, Dewald Allers, Tristan Els |
| Approval | Two approvals from members other than the author on every pull request into `main`, per the [team working agreement](team-working-agreement.md) |

This is the single engineering record for CivicConnect. It is not recreated at each milestone. Version 2.0 extends version 1.0 in place, and the M1 content stays readable underneath it. There is no separate Milestone 2 report, and none will be written alongside this document at any later milestone.

The PED is held as linked Markdown in this repository rather than as one file, so every part of it sits under the same version control, review and change control as the rest of the project. The section map below says where each part lives.

## Version history

| Version | Date | Phase | What the version added or changed | Approval evidence |
| --- | --- | --- | --- | --- |
| v0.1 to v0.3 | 7 to 8 September 2026 | M1 drafting | Three members drafted in parallel on separate branches. Nothing was baselined. | Branch commits on `feature/m1-member1-foundation`, `m1-part2-requirements-foundation` and `m1-part3-risk-decisions-governance` |
| v1.0 | 9 September 2026 | M1 baseline | Problem and business need, stakeholders, scope baseline, constraints, 12 functional and 5 non-functional requirements, acceptance criteria, initial RTM, initial Risk Register, initial Engineering Decision Log, Forward Engineering Considerations, GitHub governance evidence, AI Usage Register and the team working agreement. | PR #21, #22, #23, #24, #25 and #26 merged into `main`. Working agreement agreed by all three members on 9 September 2026 |
| v2.0 | 30 September 2026 | M2 | Review of the v1.0 baseline and the four changes arising from it. Change control register, baseline register, assumptions and dependencies register. RTM rebuilt on the M2 columns and populated. Risk Register reviewed and extended to 22 entries. Architecturally significant requirements, architecture selection and data model. Technology stack with pinned versions and deployment direction. Two design decisions and the initial interface decision. Backend vertical slice with automated checks. | PR #27, #28 and #29 merged into `main`, each approved by the two members who did not author it. Baseline record BL-002 |

## What changed between v1.0 and v2.0

Version 1.0 answered what we are building and within what limits. Version 2.0 answers how we intend to build it, and commits enough of that answer to develop against.

We reviewed the v1.0 requirements, scope and constraints before recording any M2 decision. Most of them survived unchanged. Four changes were raised against the baseline and are tracked in the [change control register](../change/README.md). The largest is CR-002, which closes the five requirement proposals that v1.0 left open. Those proposals had to close before the data model and the permission boundary could be designed, because they carry the status transitions, the meaning of overdue and the role scope that the design depends on.

The architecture, data, technology and design decisions were then taken against that reviewed baseline and recorded as ADR-001 to ADR-006. BL-002 baselines the set. Construction has begun against it: a backend vertical slice covering the request status lifecycle, the authorisation policy and one REST endpoint, with 23 passing tests running on every push and pull request.

Nothing baselined in v1.0 has been deleted. Where wording changed, the identifier stayed, the previous position is still readable in the artefact or in its change record, and the reason is in the register.

## Contributors and section ownership

| Member | GitHub account | Owns in v2.0 |
| --- | --- | --- |
| Liam de Villiers | `Liamdv12` | Problem and business need, stakeholders, scope, constraints (v1.0). Technology selection and deployment direction, research informed design and integration decisions (v2.0) |
| Dewald Allers | `DewaldAllers` | Requirements, acceptance criteria, AI Usage Register (v1.0). Architecturally significant requirements, architecture selection and diagrams, data and persistence baseline (v2.0) |
| Tristan Els | `tristanels` | Risk Register, Forward Engineering Considerations, Engineering Decision Log, GitHub governance evidence (v1.0). Document control, change control, baseline register, RTM, assumptions and dependencies (v2.0) |

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
| Requirements Traceability Matrix | [RTM.md](../requirements/RTM.md) | v2.0 | Rebuilt on the M2 columns |
| Change control register | [change/README.md](../change/README.md) | v2.0 | New in v2.0 |
| Baseline register and sign-off | [baselines/README.md](../baselines/README.md) | v2.0 | New in v2.0 |
| Risk Register | [risks/README.md](../risks/README.md) | v2.0 | Reviewed and extended |
| Assumptions and dependencies | [assumptions/README.md](../assumptions/README.md) | v2.0 | New in v2.0 |
| Forward Engineering Considerations | [forward-engineering/README.md](../forward-engineering/README.md) | v2.0 | Reviewed |
| Engineering Decision Log and ADR index | [decisions/README.md](../decisions/README.md) | v2.0 | Reviewed and extended |
| GitHub governance evidence | [github-governance.md](../../evidence/github-governance.md) | v1.0 | Baselined, rechecked for v2.0 |
| AI Usage Register | [AI-Usage-Register.md](../ai-register/AI-Usage-Register.md) | v2.0 | Extended with the M2 entries |
| Source register | [sources.md](../sources.md) | v2.0 | Extended with SRC-M2 |
| Architecturally significant requirements and quality drivers | [architecture-and-data.md](architecture-and-data.md) | v2.0 | ASR-01 to ASR-05 |
| Architecture selection, diagrams and ADR | [ADR-001](../decisions/ADR-001-civicconnect-architecture.md) | v2.0 | Modular application server |
| Data and persistence model | [ADR-002](../decisions/ADR-002-request-history-persistence.md), [permission matrix](../data/permission-matrix.md), [history contract](../data/request-history-contract.md) | v2.0 | Proposed for BL-002 |
| Technology selection and deployment direction | [ADR-003](../decisions/ADR-003-technology-stack-and-deployment.md), [technology selection](../technology/technology-selection.md) | v2.0 | Versions pinned |
| Initial design and integration decisions | [ADR-004](../decisions/ADR-004-request-lifecycle.md), [ADR-005](../decisions/ADR-005-authorization-policy.md), [ADR-006](../decisions/ADR-006-api-integration.md), [API v1](../integration/api-v1.md) | v2.0 | ADR-004 and ADR-005 implemented |
| Application and technical documentation | [root README](../../README.md), [backend README](../../app/backend/README.md) | v2.0 | Setup and run instructions for the backend |

A row marked as not yet in the repository names a part of v2.0 that has an owner and no artefact.

## How this document is controlled

Identifiers are permanent. A requirement, risk, decision, concern, change or baseline keeps its identifier for the life of the project. The prefixes in use are `FR`, `NFR`, `AC`, `NEED-P2`, `P`, `RSK`, `FEC`, `DEC`, `ADR`, `CR`, `ASM`, `DEP` and `BL`.

Baselined content is not silently edited. Once a baseline is approved, a material change to a requirement, scope item, constraint or approved decision goes through the [change control process](../change/README.md) before it is applied, and the superseded position stays readable.

Artefact version numbers follow the PED version. An artefact that formed part of the v1.0 baseline is v1.0, whatever draft number it carried while it was being written, and an artefact revised for M2 is v2.0. CR-001 records the correction of the version and status lines that were left at their drafting values when v1.0 was baselined.

Quality, security, performance and readiness claims carry the evidence that supports them, or they are not made. Where a control is not met, the gap is recorded rather than described as met.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 6 and 6.1 (one evolving engineering record and the PED quality standard, pp. 8-9), 9 (GitHub governance, p. 11), 11 (requirements, traceability and baseline standard, p. 12), 13 (decisions and ADRs, p. 13), 14 (change management, p. 13).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 2 (M2 as a continuation, p. 2), 4 and 4.1 (one evolving PED and continued engineering documentation, p. 3), 6 (the M2 baseline, p. 7), 12 (required submission set, p. 9).

Full source records and fingerprints are in the [source register](../sources.md).
