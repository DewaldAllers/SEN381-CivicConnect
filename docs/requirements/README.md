# Part 2 - Requirements, acceptance criteria and traceability

**Version:** 0.3 | **Date:** 9 September 2026 | **Owner:** Dewald Allers | **Status:** **requirements baseline proposal**

This document represents my requirements contribution to the PED v1.0. It contains details on the intended behaviour of the product; implementation and testing results are not claimed.

## Read in this order

1. [Functional requirements](functional-requirements.md) - what CivicConnect must do.
2. [Non-functional requirements](non-functional-requirements.md) - the required quality of that behaviour.
3. [Acceptance criteria](acceptance-criteria.md) - how satisfaction will be judged.
4. [Requirements Traceability Matrix](RTM.md) - the links between the evidence and requirements.
5. [Decisions to confirm](decisions-to-confirm.md) - five proposed details needing team validation.
6. [AI Usage Register](../ai-register/AI-Usage-Register.md).

## Evidence and stakeholder needs

As seen in Master Project Brief v1.1, a community organization has its requests recorded in emails, phone calls, WhatsApp, Excel sheets and on paper. CivicConnect needs to enhance visibility, accountability and reporting by means of a structured requests control (SRC-MASTER, sections 2-3, pages 6-7).

These working requirements IDs provide the reason for the Part 2 requirements. The requirements are extracted from the brief and not from interviews. It is possible to integrate them into the rest of the project later on; they are not included in this branch.

| Need ID | Stakeholder and need | Source |
| --- | --- | --- |
| NEED-P2-01 | Requester: submit a request and understand its progress and outcome. | SRC-MASTER, sections 2-3, pp. 6-7 |
| NEED-P2-02 | Staff: find relevant work, establish responsibility and record controlled progress. | SRC-MASTER, sections 2-3, pp. 6-7 |
| NEED-P2-03 | Management: identify outstanding/overdue work and understand service activity. | SRC-MASTER, sections 2-3, pp. 6-7 |
| NEED-P2-04 | Organisation and all users: protect sensitive information and maintain a reliable, usable record. | SRC-MASTER, sections 2.1, 4 and 16, pp. 6, 8 and 14 |

## Priority and status

We follow MoSCoW: **Must Have** is a feature that is critical to the minimum functionality or record protection outlined in the brief; **Should Have** is valuable but can be negotiated away if time and resources are limited; **Could Have** is a bonus feature; and Won't Have this baseline is deferred. The following priorities are suggested for team discussion. No Could Have features are included purely to increase the number of requirements.

The ability to filter is Must Have; sorting by the oldest date first is Should Have since filtering satisfies the brief’s minimum requirement for searching, filtering **or** sorting. Usability and speed goals for quality are Should Have requirements that are clearly suggested. It will be necessary to re-evaluate the importance of these priorities if stakeholder evidence suggests otherwise.

All requirements are source-based. The business rules and measurement goals have been clearly outlined in proposals wherever the brief lacks the necessary detail. Future design and test columns are still evidence in M1.

## Product scope boundary

These are all the requirements contributions to do with the submission of request, categorization, tracking, authorized personnel handling, feedback and management within the application.

All the following features fall explicitly outside the scope of the proposed product baseline: Email integration, SMS and WhatsApp integration, automatic duplication detection, additional analysis beyond those for management views, urgency rating, and reopened request after rejection or closure of the same. They are not missing by chance but because the Master Brief does not make any commitment to the team on them and will increase the amount of design, security and testing efforts required.

## M1 boundary and integration

The constraints consist of three students in the team, four milestones, preference for low cost, and expectations for measurable quality (SRC-MASTER, section 4, p. 8). The [requirements dependencies for RTM](RTM.md#requirement-dependencies) describe the implications of these requirements, but not risks or forward-engineering artifacts. Milestone 1 does not result in making a final choice of technology, architecture, database, interface, or deployment (SRC-M1, section 5, pp. 4-5).

In case of modification of a baselined requirement: preserve its ID and old version, write down the reasons and impacts, revise the acceptance criteria, RTM and the subsequent related documents; identify implications on scope, constraints, risks; get the approval to include the modification. Document the change and its review in the relevant pull request.

## Abbreviations

FR = Functional Requirement; NFR = Non-Functional Requirement; AC = Acceptance Criteria; RTM = Requirements Traceability Matrix; PED = Project Engineering Document; PR = Pull Request; TBD = To Be Determined; AI = Artificial Intelligence.

`SRC-MASTER` identifies the CivicConnect Master Project Brief; `SRC-M1` identifies the Milestone 1 brief. Exact source copies and fingerprints are recorded in the [source register](../sources.md).

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`.

Belgium Campus ITversity (n.d.) *SEN381 Project Milestone 1: Engineering Foundation and Requirements Baseline*. Cited as `SRC-M1`.

The [source register](../sources.md) identifies the exact source copies, locators and any additional sources used in Part 2.
