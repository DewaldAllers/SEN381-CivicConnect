# Part 2 - Requirements, acceptance criteria and traceability

**Version:** 0.3 | **Date:** 9 September 2026 | **Owner:** Dewald Allers | **Status:** **requirements baseline proposal**

This is my contribution to the PED v1.0 of requirements. It includes information regarding the behavior of the product. This does not include any implementation or testing results.

## Read in this order

1. [Functional requirements](functional-requirements.md) - what CivicConnect must do.
2. [Non-functional requirements](non-functional-requirements.md) - the required quality of that behaviour.
3. [Acceptance criteria](acceptance-criteria.md) - how satisfaction will be judged.
4. [Requirements Traceability Matrix](RTM.md) - the links between the evidence and requirements.
5. [Decisions to confirm](decisions-to-confirm.md) - five proposed details needing team validation.
6. [AI Usage Register](../ai-register/AI-Usage-Register.md).

## Evidence and stakeholder needs

Based on the Master Project Brief v1.1, the requests of the community organizations are documented through emails, calls, WhatsApp, Excel spreadsheet and in writing form. CivicConnect has to improve visibility, accountability and reporting through a structured requests control (SRC-MASTER sections 2-3 pages 6-7).

The Working requirement IDs give the rationale behind the Part 2 requirements. The requirements are taken from the brief and not from the interviews. The integration of these requirements can be done in the latter part of the project.

| Need ID | Stakeholder and need | Source |
| --- | --- | --- |
| NEED-P2-01 | Requester: submit a request and understand its progress and outcome. | SRC-MASTER, sections 2-3, pp. 6-7 |
| NEED-P2-02 | Staff: find relevant work, establish responsibility and record controlled progress. | SRC-MASTER, sections 2-3, pp. 6-7 |
| NEED-P2-03 | Management: identify outstanding/overdue work and understand service activity. | SRC-MASTER, sections 2-3, pp. 6-7 |
| NEED-P2-04 | Organisation and all users: protect sensitive information and maintain a reliable, usable record. | SRC-MASTER, sections 2.1, 4 and 16, pp. 6, 8 and 14 |

## Priority and status

We will be working on our project according to the prioritization rules of MoSCoW where **Must Have** is a requirement that must be included in the project as it is a part of the minimum functionality/record protection mentioned in the brief; **Should Have** is important but negotiable requirement depending on available time and resources; **Could Have** is a bonus requirement and finally Won't Have this basic baseline. The following list contains proposed priorities for our team discussion. No Could Have requirements are listed only to increase the number of requirements.

Ability to filter is a Must Have; sorting in the order of the oldest date is Should Have because the filtering requirement meets the minimum requirement of searching, filtering **or** sorting. Requirements of usability and speed for achieving the quality goals are Should Have requirements that are obvious from the proposal. Re-prioritization may be required depending on the evidence provided by the stakeholders.

All requirements are source-based. The business rules and measurement goals have been clearly mentioned in the proposals wherever needed. The future design and test columns remain as evidence in M1.

## Product scope boundary

They are all the requirements' contribution that relates to the submission of request, classification, tracking, authorized personnel dealing with it, feedback, and management in the application.

The following features are all explicitly excluded from the scope of the proposed product baseline:
- Email integration;
- SMS and WhatsApp integration;
- Automatic duplication checking;
- Additional analysis besides the ones for management views;
- Urgency rating;
- Reopened request after rejection/closure of the same.
They are not left out accidentally, but due to the fact that the Master Brief does not give any commitments to the team in terms of these and increase the amount of design, security and testing efforts.

## M1 boundary and integration

These constraints comprise of three members of the team, four milestones, low cost preference and quality expectations (SRC-MASTER, section 4, p. 8). The [requirement dependencies for RTM](RTM.md#requirement-dependencies) represent what the above requirements imply, without mentioning risks and forward engineering artifacts. The first milestone does not lead to a final decision on the technology, architecture, database, interface or deployment (SRC-M1, section 5, pp. 4-5).

If there is a modification of a baselined requirement: keep its identifier and previous version, explain the reasons and impacts, update the acceptance criteria, RTM and all the related documentation; determine the impact on scope, constraints, risks; seek approval for inclusion of the modification. Document the change and its review in the corresponding pull request.

## Abbreviations

FR = Functional Requirement; NFR = Non-Functional Requirement; AC = Acceptance Criteria; RTM = Requirements Traceability Matrix; PED = Project Engineering Document; PR = Pull Request; TBD = To Be Determined; AI = Artificial Intelligence.

`SRC-MASTER` identifies the CivicConnect Master Project Brief; `SRC-M1` identifies the Milestone 1 brief. Exact source copies and fingerprints are recorded in the [source register](../sources.md).

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`.

Belgium Campus ITversity (n.d.) *SEN381 Project Milestone 1: Engineering Foundation and Requirements Baseline*. Cited as `SRC-M1`.

The [source register](../sources.md) identifies the exact source copies, locators and any additional sources used in Part 2.
