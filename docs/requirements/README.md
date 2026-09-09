# Part 2 - Requirements, acceptance criteria and traceability

**Version:** 0.3 | **Date:** 9 September 2026 | **Owner:** Dewald Allers | **Status:** **requirements baseline proposal**

This is my requirements contribution to the Project Engineering Document (PED) v1.0. It describes intended product behaviour; no implementation or test results are claimed.

## Read in this order

1. [Functional requirements](functional-requirements.md) - what CivicConnect must do.
2. [Non-functional requirements](non-functional-requirements.md) - the required quality of that behaviour.
3. [Acceptance criteria](acceptance-criteria.md) - how satisfaction will be judged.
4. [Requirements Traceability Matrix](RTM.md) - the links between the evidence and requirements.
5. [Decisions to confirm](decisions-to-confirm.md) - five proposed details needing team validation.
6. [AI Usage Register](../ai-register/AI-Usage-Register.md).

## Evidence and stakeholder needs

The Master Project Brief v1.1 defines a community organisation whose requests are scattered across email, calls, WhatsApp, spreadsheets and paper. CivicConnect must improve visibility, responsibility and reporting through a controlled request record (SRC-MASTER, sections 2-3, pp. 6-7).

These working need IDs explain the source of the Part 2 requirements. They are derived from the brief, not from interviews. They can be reconciled with the wider project during later integration; this branch does not contain the other sections.

| Need ID | Stakeholder and need | Source |
| --- | --- | --- |
| NEED-P2-01 | Requester: submit a request and understand its progress and outcome. | SRC-MASTER, sections 2-3, pp. 6-7 |
| NEED-P2-02 | Staff: find relevant work, establish responsibility and record controlled progress. | SRC-MASTER, sections 2-3, pp. 6-7 |
| NEED-P2-03 | Management: identify outstanding/overdue work and understand service activity. | SRC-MASTER, sections 2-3, pp. 6-7 |
| NEED-P2-04 | Organisation and all users: protect sensitive information and maintain a reliable, usable record. | SRC-MASTER, sections 2.1, 4 and 16, pp. 6, 8 and 14 |

## Priority and status

We use MoSCoW: **Must Have** means essential to the brief's minimum capabilities or protection of the record; **Should Have** means valuable but negotiable if time/resources are constrained; **Could Have** is optional; **Won't Have this baseline** is deferred. Priorities below are proposed for team agreement. No Could Have features are added just to lengthen the list.

Filtering is Must Have; oldest-first sorting is Should Have because filtering already fulfils the brief's minimum requirement to search, filter **or** sort. Quality targets for usability and speed are Should Have and explicitly proposed. Their priority must be revisited if stakeholder evidence makes them essential.

Each requirement is source-backed. The detailed business rules and measurement targets are identified as proposals where the brief does not supply the necessary detail. Later design and test columns remain future evidence in M1.

## Product scope boundary

This requirements contribution covers request submission, controlled categorisation, tracking, authorised staff handling, in-application feedback and management oversight.

The following are deliberately outside this proposed product baseline: external email, Short Message Service (SMS) and WhatsApp integration; automatic duplicate detection; extra analytics beyond the stated management views; urgency scoring; and reopening a rejected or closed request. These are not absent by accident: the Master Brief does not commit the team to them, and each would add design, security, implementation and test work. The team scope owner must validate these boundaries before baseline approval (SRC-MASTER, sections 3-4, pp. 7-8).

## M1 boundary and integration

The three-student team, four milestones, low-cost preference and measurable quality expectations constrain the work (SRC-MASTER, section 4, p. 8). The [RTM dependency notes](RTM.md#requirement-dependencies) explain the consequences of these requirements, not separate risk or forward-engineering deliverables. M1 does not make a final technology, architecture, database, interface or deployment choice (SRC-M1, section 5, pp. 4-5).

When a baselined requirement changes: retain its ID and old version; record the reason and impact; update acceptance criteria, RTM and later affected evidence; identify consequences for scope, constraints and risks; obtain approval before incorporating the change. Record the change and its review in the relevant pull request.

## Abbreviations

FR = Functional Requirement; NFR = Non-Functional Requirement; AC = Acceptance Criteria; RTM = Requirements Traceability Matrix; PED = Project Engineering Document; PR = Pull Request; TBD = To Be Determined; AI = Artificial Intelligence.

`SRC-MASTER` identifies the CivicConnect Master Project Brief; `SRC-M1` identifies the Milestone 1 brief. Exact source copies and fingerprints are recorded in the [source register](../sources.md).

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`.

Belgium Campus ITversity (n.d.) *SEN381 Project Milestone 1: Engineering Foundation and Requirements Baseline*. Cited as `SRC-M1`.

The [source register](../sources.md) identifies the exact source copies, locators and any additional sources used in Part 2.
