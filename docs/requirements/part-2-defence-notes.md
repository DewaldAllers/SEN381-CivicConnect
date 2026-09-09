# Part 2 - Simple presentation and defence notes

Version 0.3 | 9 September 2026 | Owner: Dewald Allers | Status: **presentation preparation; review status must be stated accurately**

Use this to learn and practise. Present only the review/sign-off status that is true on the day. The current files are a **review draft**, with no executed product tests.

## A short presentation (about 2-3 minutes)

"My part defines what CivicConnect needs to do and how we will check whether it succeeds.

The Master Brief describes requests getting lost across different communication channels. Requesters need visibility, staff need clear responsibility, and management needs reliable information about the work (SRC-MASTER, sections 2-3, pp. 6-7).

I organised the draft into 12 functional requirements and five non-functional requirements. Functional requirements describe behaviour, such as submitting a request or recording its status. Non-functional requirements describe quality, such as limiting access or preserving saved records after a restart.

The priorities use MoSCoW. The brief's essential capabilities are Must Have. Oldest-first sorting is Should Have because filtering already lets staff find work. The proposed speed and usability targets also need team validation; they are not numbers supplied by the lecturer.

Here is one trace in the RTM. The brief says requesters lack progress visibility. That becomes NEED-P2-01 and FR-003: show a requester their own requests and current status. AC-FR-003 says requester A sees A's two requests, not requester B's, and sees the updated status after a refresh. Later we will link the design, implementation, test result and release evidence to this row.

Five proposed details still need confirmation, including required fields, status transitions, permissions, feedback and quality targets. These are visible so that assumptions are not mistaken for agreed requirements.

Codex helped draft and check the structure. Our AI register distinguishes that assistance from the human verification and peer review still required."

## What to show on screen

1. [FR-003 in the requirements table](functional-requirements.md), then [AC-FR-003](acceptance-criteria.md#ac-fr-003).
2. The [RTM trace example](RTM.md#one-trace-to-present), pointing out that future evidence is not yet available.
3. [NFR-001](non-functional-requirements.md) and the [proposals needing confirmation](decisions-to-confirm.md).
4. The [AI Usage Register](../ai-register/AI-Usage-Register.md), describing only verification you have actually completed.

## Ten likely questions and short answers

| Lecturer question | Answer to understand, not memorise word for word |
| --- | --- |
| 1. What is the difference between an FR and an NFR? | An FR says what the system does: show my request's status. An NFR says what quality or restriction applies: no unauthorised user can access protected request data. |
| 2. Why use unique IDs? | FR-003 remains an unambiguous reference when its wording changes. We can link it to criteria, a change, design and tests without relying on page numbers. Never reuse retired IDs. |
| 3. Why do acceptance criteria need to be measurable? | They turn 'it works' into an observable pass/fail judgement. For FR-003, the expected records and status are known, including a record the user must not see. |
| 4. What is an RTM, and why does it matter? | It is the Requirements Traceability Matrix. It shows where each requirement came from and how it will be verified. It helps find missing requirements, missing tests and the effects of change. |
| 5. How did a stakeholder need become a requirement? | The brief says requesters lack visibility. That supports the need to track progress, FR-003's own-request list/status and AC-FR-003's two-requester check. It was derived from the brief, not an interview we never conducted. |
| 6. How does the RTM grow later? | M1 links sources, requirements and criteria. M2 adds design; M3 adds implementation/PRs and actual tests; M4 adds acceptance and release evidence. Planned test IDs are not proof that tests passed. |
| 7. What if a baselined requirement changes? | Record the reason and impact, retain the ID and old baseline, assess affected scope, constraints, risks, design and tests, obtain approval, then update the wording, criteria and RTM together. |
| 8. How can an NFR affect architecture or technology? | NFR-003 requires saved data to survive a restart, so a design relying only on temporary memory would fail. NFR-001 needs enforceable access boundaries. These constrain later choices without selecting a stack now. |
| 9. Why isn't everything Must Have, and where did the numbers come from? | Filtering fulfils the basic request-finding capability, so sorting is negotiable. The usability/speed numbers are proposed, modest verification targets. We must validate the sample, load and environment; they are not researched facts or measured demand. |
| 10. How did AI help, and what did you verify? | Codex drafted the requirements and links and checked them against the briefs. Human verification is currently pending. After you review, name the source passages you checked and actual corrections you made; do not claim verification in advance. |

## Before Thursday

- Review the five proposals with the team; settle the category/field limits, permission matrix and overdue rules needed for pass/fail decisions.
- Practise the FR-003 trace once using the actual files. Be ready to explain how a requirement change affects scope, risks and later design or tests; the [dependency notes](RTM.md#requirement-dependencies) provide examples.
- Record your actual source checks and changes in the AI register; obtain the two other members' reviews.
- State unresolved review/sign-off limits honestly. Main branch protection is now configured, but it does not replace actual teammate reviews, agreed proposals or formal sign-off.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`; sections used: 2-3, 9-11 and 19, pp. 6-7, 11-12 and 16-17.

Belgium Campus ITversity (n.d.) *SEN381 Project Milestone 1: Engineering Foundation and Requirements Baseline*. Cited as `SRC-M1`; sections used: 6-8.

Full source records: [Part 2 source register](../sources.md).
