# Baseline register

Version 2.1 | 30 September 2026 | Owner: Tristan Els | Status: **BL-001 approved; BL-002 submitted for approval**

A baseline is the point where a part of the project stops being open for editing and starts being open for change control. SRC-MASTER section 14 (p. 13) draws that line, and everything after it goes through the [change control register](../change/README.md).

This register records each baseline, what it contains, who approved it and on what evidence. It uses the sign-off fields in Appendix D of the Master Brief (p. 27).

## Register

| ID | Baseline | Version | Date | Outcome |
| --- | --- | --- | --- | --- |
| [BL-001](#bl-001-ped-v10-engineering-foundation-and-requirements-baseline) | Engineering foundation and requirements | PED v1.0 | 2026-09-09 | Accepted with conditions |
| [BL-002](#bl-002-architecture-technology-and-initial-design-baseline) | Architecture, technology and initial design | PED v2.0 | Submitted 2026-09-30 | Accept with conditions, recorded on merge of PR #30 |

---

## BL-001 PED v1.0 engineering foundation and requirements baseline

| Field | Entry |
| --- | --- |
| Project | CivicConnect |
| Baseline type | Engineering foundation and requirements |
| Version | PED v1.0 |
| Date | 9 September 2026 |
| Scope reviewed | Yes. Scope statement, in scope functionality, out of scope for M1 and the deliberate scope deferment are in the PED Part 1 section. |
| Requirements and traceability checked | Yes, with a condition. 12 functional and 5 non-functional requirements each carry a source, a priority and an acceptance criterion, and the initial RTM links them. The testable detail behind them sat in five unconfirmed proposals. |
| Risk review completed | Yes. Twelve risks rated on the 3 by 3 scale in DEC-005, with owners and contingencies. Two scored 9 and were defended in writing. |
| Repository and governance controls checked | Yes, and one control was not met. Branch protection on `main` was applied and read back on 9 September. PR #20, merged on 8 September, reached `main` with no review recorded and was merged by its own author. |
| Outcome | ACCEPTED WITH CONDITIONS |

This record was written on 29 September 2026 from the repository evidence. The approval it rests on is the one recorded on 9 September: each part entered `main` through a pull request approved by the other two members, and all three members recorded agreement to the team working agreement. The record is dated when it was written rather than backdated to the gate.

Conditions that were open when v1.0 was baselined:

Proposals P-01 to P-05 were unconfirmed, so five requirement details and both quality targets were baselined as proposals. RSK-005 recorded that consequence at the time. CR-002 closes it.

PR #20 entered `main` without the two approvals SRC-MASTER section 9 (p. 11) requires, and was merged by its author. The [governance evidence](../../evidence/github-governance.md) records the API readback showing zero reviews. Protection now prevents a repeat. A follow-up review of the merged content is carried as an open action.

Artefact headers carried drafting version numbers and, in four files, a line saying the content was not an approved baseline. CR-001 corrects that.

Nothing in the v1.0 content was found to be wrong at this review. The conditions are about what was unfinished around it, not about the requirements themselves.

## BL-002 Architecture, technology and initial design baseline

| Field | Entry |
| --- | --- |
| Project | CivicConnect |
| Baseline type | Architecture, technology and initial design |
| Version | PED v2.0 |
| Date | Submitted 30 September 2026 |
| Scope reviewed | Yes. CR-002, CR-003 and CR-004 carry the scope and requirement effects of the M1 review. No new scope entered at M2 beyond the administrative redaction route CR-004 adds, which is recorded as a constraint on the data model rather than a new capability. |
| Requirements and traceability checked | Yes. All 17 requirements carry an acceptance criterion, a quality driver, an architecture responsibility, a data rule and a technology decision. Three carry implementation and verification evidence. Fourteen read Not yet implemented. No criterion is orphaned. |
| Risk review completed | Yes. 22 entries reviewed on 29 and 30 September. Two closed, six ratings moved, and RSK-011 and RSK-019 are recorded as materialised rather than forecast. |
| Repository and governance controls checked | Yes, with one open action. Branch protection on `main` requires two approvals from non-authors and blocks bypass, force push and deletion. A follow-up review of the content PR #20 merged on 8 September is still outstanding. |
| Outcome | ACCEPT WITH CONDITIONS, recorded on the merge of PR #30 |

The conditions are the items listed under open decisions below. None blocks construction, and each carries an owner and a trigger.

The outcome above is a recommendation until PR #30 merges. Approval is recorded by that merge and by the two approvals on it, under the same rule as every other approval in this project. ADR-001 to ADR-006 carry the same wording, so no artefact describes the baseline as approved ahead of the merge that approves it.

### What this baseline contains

The baseline is the set of decisions stable enough to build against without reopening foundations every time someone writes code. It is not the finished design.

| Item | Owner | Evidence |
| --- | --- | --- |
| PED v2.0 document control and version history | Tristan Els | In the repository |
| Change control register, CR-001 to CR-004 | Tristan Els | In the repository |
| RTM rebuilt on the M2 columns | Tristan Els | In the repository |
| Risk Register reviewed and extended | Tristan Els | In the repository |
| Assumptions and dependencies register | Tristan Els | In the repository |
| Forward Engineering Considerations reviewed | Tristan Els | In the repository |
| Engineering Decision Log and ADR index | Tristan Els | In the repository |
| Architecturally significant requirements ASR-01 to ASR-05 | Dewald Allers | [PED architecture and data section](../PED/architecture-and-data.md) |
| Architecture alternatives, selection, diagrams and ADR | Dewald Allers | [ADR-001](../decisions/ADR-001-civicconnect-architecture.md), with component and entity diagrams in the PED section |
| Data model, ownership, integrity and the permission boundary | Dewald Allers | [ADR-002](../decisions/ADR-002-request-history-persistence.md), [permission matrix](../data/permission-matrix.md), [request and history contract](../data/request-history-contract.md) |
| Technology stack selection with pinned versions | Liam de Villiers | [ADR-003](../decisions/ADR-003-technology-stack-and-deployment.md), [technology selection](../technology/technology-selection.md) |
| Deployment direction and compatibility position | Liam de Villiers | ADR-003, deployment direction and configuration sections |
| Two design problem decisions with ADRs and application evidence | Liam de Villiers | [ADR-004](../decisions/ADR-004-request-lifecycle.md) request lifecycle, [ADR-005](../decisions/ADR-005-authorization-policy.md) authorisation policy |
| Initial interface and integration decision | Liam de Villiers | [ADR-006](../decisions/ADR-006-api-integration.md), [API v1 contract](../integration/api-v1.md) |
| Application and technical documentation matching the repository | All three | [backend README](../../app/backend/README.md), [project README](../../README.md) |

Every item on that list is now in the repository. Meaningful construction exists against it: a backend vertical slice covering the request status lifecycle, the authorisation policy and one REST endpoint, with 23 passing tests and a workflow that runs them on every push and pull request.

### Open decisions and deferred concerns held outside the baseline

SRC-M2 section 6 (p. 7) asks for these to be identified separately from the baseline.

| Item | Why it is outside the baseline | What would close it |
| --- | --- | --- |
| The numeric targets in NFR-004 and NFR-005 | Deferred under CR-002. The environment they would be measured in does not exist until the stack is chosen. | A defined verification environment, data volume and participant selection, then a first measurement in M3 |
| Team approval and enforcement of the permission matrix | The [matrix](../data/permission-matrix.md) is written and inside the baseline contents. What sits outside is team approval of its category-scope rule, and its enforcement at the data boundary. The backend supplies a fixed approved scope rather than evaluating a grant. | Approval of the scope rule, then an authorisation path that reads a real grant. Tracked as RSK-013 |
| Whether the Protection of Personal Information Act 4 of 2013 binds this project | Applicability is unconfirmed and held as ASM-002. DEC-011 designs as though it applies without claiming compliance. | A confirmed answer on applicability |
| Backup and recovery position | FEC-005. NFR-003 covers a controlled restart and says nothing about hardware failure or corruption. | A stated acceptable data loss position and whether a restore has to be demonstrated |
| Observability and how we would notice degradation | FEC-007. Nothing to observe until the application exists. | A decision on which signals to record, taken before the code that would have to emit them |
| Deployment platform and free tier limits | FEC-006. Sits inside the M2 technology decision and is not closed yet. | Researched candidate platforms with their limits, recorded against the deployment direction |
| CI pipeline maturity | SRC-M2 section 11 (p. 9) does not require one at M2. | Adopted progressively as the Week 4 collaboration work lands |

### How this baseline is approved

The same way v1.0 was, and with the record written on the day rather than three weeks later. Pull requests #27 and #29 are merged, each approved by the two members who did not author it. PR #28 and the integration request PR #30 carry the remainder, and the merge of PR #30 is what records this approval.

The fields above were completed against the artefacts in the repository rather than against intent. Until PR #30 merges they are a recommendation, which is why the outcome reads accept with conditions rather than accepted.

The outcome carries conditions rather than none, because the items listed under open decisions are held outside the baseline. Folding them in would mean claiming the team had settled things it has not.

Once approved, a material change to anything inside the baseline goes through the [change control register](../change/README.md) and the affected ADR rather than being edited in place. That covers the architecture in ADR-001, the persistence boundary in ADR-002, the stack and versions in ADR-003, the two design decisions in ADR-004 and ADR-005, the interface in ADR-006, and every requirement in the RTM.

### What is not in this baseline

BL-002 does not claim the application works. Three requirements are In Development and fourteen are not started. The backend stores requests in memory, supplies the caller identity instead of authenticating it, and records no history event, so NFR-001, NFR-002 and NFR-003 have design decisions and no satisfied evidence. RSK-022 exists to stop the 23 passing tests being read as more than they are.

What the baseline claims is narrower and is the thing M2 asks for: the team has enough controlled direction to build without reopening foundations every time someone writes code.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 9 (GitHub governance, p. 11), 11 (baseline standard, p. 12), 14 (change management, p. 13), Appendix D (baseline sign-off template, p. 27).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 6 (the M2 baseline, p. 7), 11 (explicit M2 boundaries, p. 9), 12 (required submission set, p. 9).

Full source records are in the [source register](../sources.md).
