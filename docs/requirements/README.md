# Part 2 - Requirements, acceptance criteria and traceability

**Version:** 0.2 review draft | **Date:** 8 September 2026 | **Responsible member:** Dewald Allers

This is the requirements contribution to the Project Engineering Document (PED) v1.0. It is ready for team review, not signed off as an approved baseline. It describes intended product behaviour; no implementation or test results are claimed.

## Read in this order

1. [Functional requirements](functional-requirements.md) - what CivicConnect must do.
2. [Non-functional requirements](non-functional-requirements.md) - the required quality of that behaviour.
3. [Acceptance criteria](acceptance-criteria.md) - how satisfaction will be judged.
4. [Requirements Traceability Matrix](RTM.md) - the links between the evidence and requirements.
5. [Decisions to confirm](decisions-to-confirm.md) - five proposed details needing team validation.
6. [AI Usage Register](../ai-register/AI-Usage-Register.md) and [presentation/defence notes](part-2-defence-notes.md).

## Evidence and stakeholder needs

The Master Project Brief v1.1 defines a community organisation whose requests are scattered across email, calls, WhatsApp, spreadsheets and paper. CivicConnect must improve visibility, responsibility and reporting through a controlled request record (sections 2-3, pp. 6-7).

These working need IDs connect Part 2 to the team stakeholder and scope sections. They are derived from the brief, not from interviews. The stakeholder-section owner should reconcile these IDs during PED integration rather than create duplicate needs.

| Need ID | Stakeholder and need | Source |
| --- | --- | --- |
| NEED-P2-01 | Requester: submit a request and understand its progress and outcome. | Master sections 2-3, pp. 6-7 |
| NEED-P2-02 | Staff: find relevant work, establish responsibility and record controlled progress. | Master sections 2-3, pp. 6-7 |
| NEED-P2-03 | Management: identify outstanding/overdue work and understand service activity. | Master sections 2-3, pp. 6-7 |
| NEED-P2-04 | Organisation and all users: protect sensitive information and maintain a reliable, usable record. | Master sections 2.1, 4 and 16, pp. 6, 8 and 14 |

## Priority and status

We use MoSCoW: **Must Have** means essential to the brief's minimum capabilities or protection of the record; **Should Have** means valuable but negotiable if time/resources are constrained; **Could Have** is optional; **Won't Have this baseline** is deferred. Priorities below are proposed for team agreement. No Could Have features are added just to lengthen the list.

Filtering is Must Have; oldest-first sorting is Should Have because filtering already fulfils the brief's minimum requirement to search, filter **or** sort. Quality targets for usability and speed are Should Have and explicitly proposed. Their priority must be revisited if stakeholder evidence makes them essential.

All entries are **Draft**. A capability stated in the brief is source-backed, but that does not mean the team's detailed wording or proposed business rules have been approved. Confirm the [five decisions](decisions-to-confirm.md), reconcile scope/constraints and obtain the required reviews before calling this a baseline. Later design/test columns may remain future evidence in M1.

## Boundaries and integration

The scope covered here is submission, categorisation, tracking, authorised staff handling, feedback and oversight. Notifications are proposed inside CivicConnect; external email/SMS/WhatsApp integration, automatic duplicate detection and extra analytics are not commitments in this draft. The brief does not prescribe those solutions. Validate these exclusions with the scope owner.

The three-student team, four milestones, low-cost preference and measurable quality expectations constrain the work (Master section 4, p. 8). The [RTM handover table](RTM.md#cross-artefact-handover) identifies risks and later concerns for other members to integrate. No final technology, architecture, database, interface or deployment choice is made.

When a baselined requirement changes: retain its ID and old version; record the reason and impact; update acceptance criteria, RTM, scope/constraints, risks and later affected evidence; obtain approval before incorporating the change. See [change request template](../../templates/change-request.md).

## Abbreviations and references

FR = Functional Requirement; NFR = Non-Functional Requirement; AC = Acceptance Criteria; RTM = Requirements Traceability Matrix; PED = Project Engineering Document; PR = Pull Request; TBD = To Be Determined; AI = Artificial Intelligence.

**Master** throughout these files means: Belgium Campus ITversity (2026), *SEN381 CivicConnect Master Project Brief*, version 1.1. **M1** means: Belgium Campus ITversity (n.d.), *SEN381 Project Milestone 1*. Master section 11 (p. 12) and M1 section 3 (p. 3) define the requirements/traceability standard. Exact source copies are recorded in the [source register](../sources.md).
