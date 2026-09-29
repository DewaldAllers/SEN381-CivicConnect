# Baseline register

Version 2.0 | 29 September 2026 | Owner: Tristan Els | Status: **BL-001 approved, BL-002 open**

A baseline is the point where a part of the project stops being open for editing and starts being open for change control. SRC-MASTER section 14 (p. 13) draws that line, and everything after it goes through the [change control register](../change/README.md).

This register records each baseline, what it contains, who approved it and on what evidence. It uses the sign-off fields in Appendix D of the Master Brief (p. 27).

## Register

| ID | Baseline | Version | Date | Outcome |
| --- | --- | --- | --- | --- |
| [BL-001](#bl-001-ped-v10-engineering-foundation-and-requirements-baseline) | Engineering foundation and requirements | PED v1.0 | 2026-09-09 | Accepted with conditions |
| [BL-002](#bl-002-architecture-technology-and-initial-design-baseline) | Architecture, technology and initial design | PED v2.0 | Not yet approved | Open |

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

This record was written on 29 September 2026 from the repository evidence, not on the day of the gate. No Appendix D record was produced at the time. What happened on 9 September was that each part entered `main` through a pull request approved by the other two members, and all three of us recorded agreement to the team working agreement. That is a real approval trail and it is what the outcome above rests on, but it is not the same as a sign-off record, and writing one now rather than backdating one is the honest way to close the gap.

Conditions that were open when v1.0 was baselined:

Proposals P-01 to P-05 were unconfirmed, so five requirement details and both quality targets were baselined as proposals. RSK-005 recorded that consequence at the time. CR-002 closes it.

PR #20 entered `main` without the two approvals SRC-MASTER section 9 (p. 11) requires, and was merged by its author. The [governance evidence](../../evidence/github-governance.md) records the API readback showing zero reviews. Protection now prevents a repeat, and the merged content still needs the re-review it did not get.

Artefact headers carried drafting version numbers and, in four files, a line saying the content was not an approved baseline. CR-001 corrects that.

Nothing in the v1.0 content was found to be wrong at this review. The conditions are about what was unfinished around it, not about the requirements themselves.

## BL-002 Architecture, technology and initial design baseline

| Field | Entry |
| --- | --- |
| Project | CivicConnect |
| Baseline type | Architecture, technology and initial design |
| Version | PED v2.0 |
| Date | Not yet approved |
| Scope reviewed | In progress. CR-002, CR-003 and CR-004 are the scope and requirement effects found so far. |
| Requirements and traceability checked | In progress. The RTM has been rebuilt on the M2 columns and carries a controlled status against every requirement. |
| Risk review completed | In progress. |
| Repository and governance controls checked | In progress. Protection on `main` needs a fresh readback at the gate, because the 9 September observation is a dated observation and not a standing guarantee. |
| Outcome | OPEN |

### What this baseline will contain

The baseline is the set of decisions stable enough to build against without reopening foundations every time someone writes code. It is not the finished design.

| Item | Owner | State on 29 September 2026 |
| --- | --- | --- |
| PED v2.0 document control and version history | Tristan Els | In this branch |
| Change control register, CR-001 to CR-004 | Tristan Els | In this branch |
| RTM rebuilt on the M2 columns | Tristan Els | In this branch |
| Risk Register reviewed and extended | Tristan Els | In this branch |
| Assumptions and dependencies register | Tristan Els | In this branch |
| Forward Engineering Considerations reviewed | Tristan Els | In this branch |
| Engineering Decision Log and ADR index | Tristan Els | In this branch |
| Architecturally significant requirements and quality drivers | Dewald Allers | Not yet in the repository |
| Architecture alternatives, selection, diagrams and ADRs | Dewald Allers | Not yet in the repository |
| Data and persistence model and its decision evidence | Dewald Allers | Not yet in the repository |
| Technology stack selection, versions and ADRs | Liam de Villiers | Not yet in the repository |
| Deployment direction and compatibility position | Liam de Villiers | Not yet in the repository |
| Two design problem decisions with ADRs and design evidence | Liam de Villiers | Not yet in the repository |
| Initial interface and integration decisions where implementation reaches them | Liam de Villiers | Not yet in the repository |
| Application and technical documentation matching the repository | All three | Not yet in the repository |

The baseline cannot be approved while items on that list are missing, because approving it would mean committing to decisions nobody has recorded.

### Open decisions and deferred concerns held outside the baseline

SRC-M2 section 6 (p. 7) asks for these to be identified separately from the baseline, so that a deferred decision is visibly deferred instead of looking like an oversight.

| Item | Why it is outside the baseline | What would close it |
| --- | --- | --- |
| The numeric targets in NFR-004 and NFR-005 | Deferred under CR-002. The environment they would be measured in does not exist until the stack is chosen. | A defined verification environment, data volume and participant selection, then a first measurement in M3 |
| The named role, action and data scope permission matrix | P-03 is approved in principle, the matrix is not written. Recorded as DEP-001. | The matrix, produced with the data model |
| Whether the Protection of Personal Information Act 4 of 2013 binds this project | No member has checked, and nobody has asked the lecturer. Recorded as an assumption, not a compliance claim. | A confirmed answer, or a recorded decision to treat it as binding regardless |
| Backup and recovery position | FEC-005. NFR-003 covers a controlled restart and says nothing about hardware failure or corruption. | A stated acceptable data loss position and whether a restore has to be demonstrated |
| Observability and how we would notice degradation | FEC-007. Nothing to observe until the application exists. | A decision on which signals to record, taken before the code that would have to emit them |
| Deployment platform and free tier limits | FEC-006. Sits inside the M2 technology decision and is not closed yet. | Researched candidate platforms with their limits, recorded against the deployment direction |
| CI pipeline maturity | SRC-M2 section 11 (p. 9) does not require one at M2. | Adopted progressively as the Week 4 collaboration work lands |

### How this baseline gets approved

The same way v1.0 did, and with the record written this time. When the items above are in the repository, all three of us review the set, the fields in this record are completed, and the outcome is entered as accepted, conditionally accepted or revision required. A conditional acceptance names its conditions here rather than leaving them in a discussion.

After approval, a material change to anything inside the baseline goes through the [change control register](../change/README.md) and the affected ADR, rather than being edited in place.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 9 (GitHub governance, p. 11), 11 (baseline standard, p. 12), 14 (change management, p. 13), Appendix D (baseline sign-off template, p. 27).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 6 (the M2 baseline, p. 7), 11 (explicit M2 boundaries, p. 9), 12 (required submission set, p. 9).

Full source records are in the [source register](../sources.md).
