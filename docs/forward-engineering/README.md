# Forward Engineering Considerations

Version 2.1 | 30 September 2026 | Owner: Tristan Els | Status: **reviewed against the M2 evidence; 10 entries, 1 closed**

These are later lifecycle concerns that already change something the team writes down now. A concern that only becomes real in M3 and changes nothing today was left out, and the last section says what was considered and not selected.

Seven entries came from M1. All seven were reviewed on 29 September. One closed, four moved, and three are unchanged in substance but now have a decision waiting on them rather than a milestone. Three entries are new, because M2 creates concerns that M1 could not have had: the project now has a schema to migrate, a deployment to roll back, and design decisions whose complexity has to be paid for later.

Nothing here selects a technology or an architecture. These are the questions the selections have to answer.

## What the M2 review changed

FEC-004 closed. It was the one entry that described a contradiction inside the current requirements rather than a missing future decision, and CR-003 settled the part that survived M1.

FEC-001 and FEC-002 both moved from open questions to conditions on work that is happening now. P-03 is approved in principle, so FEC-001 is no longer arguing that roles should be defined; it is the reason DEP-001 blocks the data model. CR-004 takes the deletion route out of FEC-002 and puts it into the data design, leaving a narrower residual.

FEC-005, FEC-006 and FEC-007 are unchanged in wording and have each acquired a risk that did not exist at M1, because the decisions they were waiting for are being made in this milestone.

FEC-008, FEC-009 and FEC-010 are new.

## What the M2 decisions answered

Three entries were answered in part when the architecture, data and technology decisions landed on 30 September.

FEC-001 has its matrix. The [permission matrix](../data/permission-matrix.md) defines own-request, staff category and management category scope, and states that a missing grant denies access. What it has not got is enforcement: the backend supplies a fixed approved scope rather than evaluating a grant, so the boundary the entry has been arguing for since M1 is designed and not yet applied.

FEC-005 has a named failure mode. ADR-002 records the single store as a single point of failure and declines to add replication without evidence. It still has no acceptable data loss position and no tested restore, which is what would close the entry.

FEC-008 was answered by the technology choice rather than deferred past it, which is what the entry asked for. PostgreSQL carries transactional schema change, so a migration can be a versioned artefact rather than a manual edit in three environments. No migration exists yet.

FEC-007 moved the other way. NFR-005 now has a stack to be measured on and still has no decision about which signals to record, and the first backend code was written without any. That is the cost the entry predicted, arriving on schedule.

## Register

| ID | Concern | Why it matters now | Later activity affected | Information still missing | Risk if ignored | Links | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FEC-001 | Access control and trust boundaries | Five of the twelve requirements are written as "authorised staff" or "authorised management". P-03 now says what that means in principle, and the matrix that gives it rows does not exist. The architecture is being selected against a boundary nobody has drawn. | The architecture enforcement point. The permission test matrix NFR-001 depends on. M3 security assurance and threat review. | The named role, action and data scope matrix, tracked as DEP-001. Whether staff are scoped by category, by team, or not at all. | Authorisation added after the data model is fixed tends to be enforced in the interface instead of at the data boundary. The permission matrix NFR-001 promises could not then be tested honestly. | FR-005, FR-007, FR-010, FR-011, NFR-001, P-03, CR-002, DEP-001, RSK-013 | Open, condition on the data model |
| FEC-002 | Personal data, retention and deletion | Requests carry contact details and matters such as security concerns and lost property. CR-004 puts a deletion and anonymisation route into the data model, so the schema will no longer assume records are permanent. What may be kept and for how long is still unanswered. | The data model, now. M3 security review and secrets handling. M4 residual risk statement. | A retention period. Whether the obligation in ASM-002 actually binds this project. Who holds the role permitted to redact. | A retention rule added to a schema that already holds two years of history is a migration, not a setting. NFR-002 and a retention limit pull in opposite directions and have to be reconciled deliberately. | NFR-002, NFR-003, CR-004, ASM-002, RSK-006, RSK-016 | Open, narrowed by CR-004 |
| FEC-003 | Testability of the requirements as written | Three NFRs promise measurements the system has to be built to produce. NFR-002 requires exactly one recorded event per successful action, NFR-005 requires timing from user action to displayed content, and NFR-003 requires a before and after dataset comparison across a restart. None of these can be measured unless the design exposes them, and the design is being made now. | M3 test strategy, automated tests and quality gates. The traceability from requirement to test. | The verification environment and data volume, which depend on DEP-002. How elapsed time is measured and by what. How the before and after datasets are captured and compared. | An acceptance criterion that cannot be measured cannot be shown as satisfied, so the requirement is untraceable in practice. An untestable NFR produces no evidence. | NFR-002, NFR-003, NFR-005, CR-002, DEP-002, RSK-004 | Open |
| FEC-004 | How time and the word overdue are defined | FR-010 required management to see overdue work while FR-009 made the due date optional, so a reporting requirement depended on an optional field. P-02 closed the rule in M1 and left the clock open. | The data model and the management reporting view. M3 test data, because overdue cases have to be constructed. | None. CR-003 settles calendar time, UTC storage and the display time zone. What remains is an assumption rather than a gap. | Management reporting is one of the three capability groups in the brief. An overdue figure that two implementations would compute differently is not a report. | FR-009, FR-010, P-02, CR-003, ASM-004 | **Closed 2026-09-29 by CR-003** |
| FEC-005 | Persistence, backup and recovery | NFR-003 promises that acknowledged requests survive a controlled restart, which proves nothing about hardware failure or data corruption. The persistence decision is being made in this milestone, and it is the decision that fixes the failure mode. | The persistence decision, now. M3 staging deployment. M4 rollback, recovery and operational readiness evidence. | How much data loss is acceptable, if any. Whether backups are required for an educational deployment. Whether a restore has to be demonstrated or only described. | A restart test read as a recovery guarantee is an unsupported claim. Backup and restore added at M4 usually mean changing where data lives, which is an architecture change at the worst possible time. | NFR-003, ASM-008, RSK-010, RSK-015 | Open |
| FEC-006 | Environment parity and the deployment path | M3 requires a staging deployment and evidence that staging resembles production. The platform choice is bounded by free tiers nobody has researched, and it is being made now as part of the technology decision. | The deployment direction, now. M3 staging deployment, configuration and secrets handling. M4 production release and rollback. | Candidate platforms and their free-tier limits. What will differ between the team machines, staging and production. How configuration and secrets will be held once there is more than one environment. | Choosing a platform without checking its limits can make the M3 staging requirement unreachable, or reachable only by paying. | DEP-002, ASM-006, RSK-007, RSK-010, RSK-021 | Open |
| FEC-007 | Observability and knowing the service is degrading | NFR-005 sets a two second target for 95% of observations, which can only be checked if the system records how long operations take. Deciding to record that is cheaper than adding it later, and the code that would emit the signals is about to be written. | M3 operational monitoring concept and performance evidence. M4 observability and operational readiness. | Which signals matter beyond response time. Where logs would go and who would read them. Whether the educational deployment can run any monitoring at all. | Without recorded signals the only failure detector is a user complaining, and the performance claim rests on informal observation instead of measurement. | NFR-005, FEC-003 | Open |
| FEC-008 | Schema change and migration | The data model is being written this milestone and will change during M3 as requirements are implemented. Whether schema changes are versioned and reversible is partly decided by the persistence tooling chosen now, because some ecosystems carry migrations and some leave it to the team. | The persistence and technology decisions, now. Every schema change in M3. M4 production deployment, where a change has to run against data that matters. | Whether migrations will be versioned artefacts in the repository. Whether a migration has to be reversible. How the team will change a column on a table that already holds history events. | A schema changed by hand in three environments produces three schemas. At M4 the production deployment is the first time that stops being recoverable. | NFR-003, DEP-002, DEP-004, RSK-015 | New at M2 |
| FEC-009 | Release, rollback and the difference between them | SRC-MASTER section 17 (pp. 14-15) says deployment and release are not identical and that rollback must be considered before production release. The deployment direction chosen this milestone decides whether rollback is available at all, because a platform that keeps no previous version cannot roll back to one. | The deployment direction, now. M3 release readiness and rollback planning. M4 production release. | How release approval happens and who gives it. Whether the candidate platforms keep a previous deployment. What rolling back would do to data written since the release. | A rollback plan written at M4 against a platform that cannot roll back is a document, not a control. Rolling back code while the schema stays forward is the failure this usually becomes. | FEC-006, FEC-008, RSK-010 | New at M2 |
| FEC-010 | Maintainability and what the design decisions cost later | M1 left maintainability out because it had no specific content before there was an architecture. There is one now, and two design pattern decisions are about to be added to it. Each pattern buys something and charges for it in indirection that M3 and M4 pay. | M3 construction and the technical debt register. M4 evolution analysis and the decision consequence reflection. | Which parts of the system a new stakeholder need would be hardest to change. Which of the two patterns will be regretted. | A pattern adopted because it was researched rather than because it solved a problem here is debt taken on deliberately and forgotten immediately. SRC-M2 section 5.3 (p. 5) says complexity has to be justified by project evidence. | RSK-018, RSK-019 | New at M2, closes the gap M1 recorded |

## The two that most constrain the rest of Milestone 2

FEC-001 and FEC-008.

FEC-001 sets the order of work. The permission matrix has to exist before the data model, and the data model before the enforcement point is allocated to a module. Reversing that order is what produces authorisation checks in screens, which is the failure the entry has described since M1. It is also the entry that has been open longest without moving, and DEP-001 now makes the blockage visible rather than implied.

FEC-008 is new and constrains a decision that is being made this week. Migration support is a property of the persistence tooling, not something added to it afterwards, so it belongs in the technology comparison rather than in M3 where the first schema change happens. It is the clearest case in this register of a later lifecycle concern that has to be answered by a decision taken now.

## Considered and not selected

M1 considered scalability, maintainability and operational cost as candidate entries and recorded why each was left out. All three were revisited on 29 September.

Scalability stays out. M1 said it should be revisited once Part 1 produced stakeholder evidence about the size of the organisation. Part 1 is now in the repository and gives no volume figures, so the position is unchanged and the reason is now recorded as ASM-003 rather than as a pending question. Treating scale as a driver would mean designing against a number nobody has established.

Maintainability is now in, as FEC-010. M1 said it would become concrete once there was an architecture to evaluate, and that is what M2 produces.

Operational cost stays inside FEC-006 rather than becoming its own entry. Splitting it would create two entries pointing at the same missing information, which is the free-tier research nobody has done.

One further candidate was considered and left out. Accessibility has no entry, because nothing in the brief or the requirements sets an accessibility expectation, and NFR-004 measures first-use completion rather than conformance to a standard. Adding an entry would mean inventing an obligation. If a usability decision in M2 makes an accessibility claim, this position needs revisiting rather than the claim standing unsupported.

## References

Republic of South Africa (2013) *Protection of Personal Information Act 4 of 2013*. Cited in FEC-002 as the obligation most likely to apply. Applicability is not confirmed, and is recorded as ASM-002.

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 15 (quality engineering, p. 14), 16 (security engineering, p. 14), 17 (environments, deployment and operations, pp. 14-15), 18 (cost and schedule, p. 15).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 5.3 (proportional architecture, p. 5), 5.4 (data and persistence baseline, p. 5), 5.8 (deployment compatibility, p. 6), 6 (open decisions held outside the baseline, p. 7).

Belgium Campus ITversity (n.d.) *SEN381 Project Milestone 1: Engineering Foundation and Requirements Baseline*. Cited as `SRC-M1`. Sections used: 4 (forward engineering considerations, p. 4), 5 (M1 boundaries, pp. 4-5).

Full source records are in the [source register](../sources.md). Requirement identifiers resolve in the [requirements index](../requirements/README.md).
