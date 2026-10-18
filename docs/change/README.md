# Change control register

Version 4.0 | 18 October 2026 | Owner: Tristan Els | Status: **final for M4; nine changes raised, four against the PED v1.0 baseline and five during M3 construction. All nine are approved, and none was raised during M4**

PED v1.0 was baselined on 9 September 2026. From that point a material change to a requirement, scope item, constraint or approved decision is controlled rather than absorbed into an edit. SRC-MASTER section 14 (p. 13) sets the path, and SRC-MASTER section 11 (p. 12) says baselined requirements may not be silently edited after sign-off.

This register holds the changes raised since that baseline, with the impact analysis behind each one. It is the record of what moved between v1.0 and v2.0 and why, so a reader can see the v1.0 position, the reason it changed, and what the change cost elsewhere.

## The path a change takes here

Change request, then impact analysis, then decision, then authorisation, then implementation, then verification, then the baseline update. Each change below carries the analysis and the recommendation. Authorisation is separate from the recommendation on purpose: the member who raises a change does not approve it.

Authorisation is recorded by the two approvals the team working agreement requires on the pull request that carries the change into `main`. A change with a recommendation and no approvals is raised, not approved, and the register says so. GitHub enforces this, because branch protection on `main` requires two approvals from accounts other than the author.

Verification of a documentation change is the review itself. Verification of a change that reaches code is the test or check named in the affected acceptance criterion, which is recorded in the RTM verification column when it exists.

## What needs a change request

A change needs this process when it alters the meaning of a baselined requirement, adds or removes scope, relaxes or tightens a constraint, moves an acceptance criterion, or reverses an approved decision.

It does not need this process when it corrects a typographic or link defect, adds evidence to an existing entry, or records a consequence against a decision that already exists. Those are ordinary commits under review.

Planned milestone progression is also not a change. M1 recorded architecture, technology, schema, interface, design patterns and deployment as out of scope for M1. Bringing them into scope at M2 is the project doing what the brief lays out, not a departure from the baseline, so it is recorded in the PED version history instead of here.

## Register

| ID | Date raised | Change | Main artefacts affected | Recommendation | Status |
| --- | --- | --- | --- | --- | --- |
| [CR-001](#cr-001-align-artefact-version-and-status-lines-with-the-ped-version) | 2026-09-29 | Align artefact version numbers and status lines with the PED version | All v1.0 artefact headers | Accept | Approved, PR #27 |
| [CR-002](#cr-002-close-the-five-requirement-proposals-p-01-to-p-05) | 2026-09-29 | Close the five requirement proposals P-01 to P-05 | FR-001 to FR-011, NFR-001 to NFR-005, acceptance criteria, RTM | Modify | Approved, PR #27 |
| [CR-003](#cr-003-define-overdue-on-calendar-time-in-one-recorded-time-zone) | 2026-09-29 | Define overdue on calendar time in one recorded time zone | FR-009, FR-010, FR-011 and their criteria | Accept | Approved, PR #27 |
| [CR-004](#cr-004-require-a-controlled-deletion-or-anonymisation-route-in-the-data-model) | 2026-09-29 | Require a controlled deletion or anonymisation route in the data model | NFR-002, data model constraint | Accept | Approved, PR #27 |
| [CR-005](#cr-005-build-all-seventeen-requirements-for-the-m3-release-candidate) | 2026-10-12 | Build all seventeen requirements for the M3 release candidate, reversing the DEC-014 freeze | FR-004, FR-009, FR-010, FR-012, NFR-004, NFR-005, DEC-014, RTM, release evidence summary | Accept | Approved, PR #32 |
| [CR-006](#cr-006-build-the-client-in-html-css-and-javascript-instead-of-react-and-vite) | 2026-10-12 | Build the client in HTML, CSS and JavaScript instead of React and Vite | ADR-003 frontend selection, ADR-006 wording, ASM-005, TD-007 | Accept | Approved, PR #32 |
| [CR-007](#cr-007-ignore-the-hasowner-field-in-the-status-request) | 2026-10-14 | Ignore the `hasOwner` field in the status request and read the owner from the stored request | FR-008, AC-FR-008, API v1 status endpoint | Accept | Approved, PR #43 |
| [CR-008](#cr-008-require-the-observed-version-on-every-change-and-apply-the-lifecycle-limits-at-the-api) | 2026-10-15 | Require the observed version on every change and apply the lifecycle limits at the API | FR-007, FR-008, FR-009, AC-FR-007 to AC-FR-009, API v1 write endpoints | Accept | Approved, PR #43 |
| [CR-009](#cr-009-show-requesters-a-generic-label-in-place-of-staff-names) | 2026-10-15 | Show requesters a generic label in place of staff names | FR-004, FR-011, AC-FR-004, AC-FR-011, requester pages | Accept | Approved, PR #43 |

---

## CR-001 Align artefact version and status lines with the PED version

| Field | Entry |
| --- | --- |
| Change ID | CR-001 |
| Requested by | Tristan Els |
| Date | 2026-09-29 |
| Requested change | Set every artefact that formed part of the PED v1.0 baseline to version 1.0, and remove the status lines that still describe baselined content as a draft awaiting team review. Artefacts revised for M2 become version 2.0. |
| Reason and expected value | The v1.0 baseline was approved while the artefact headers still carried the numbers they had during drafting, 0.1 and 0.3, and four files still said they were not an approved baseline. Someone opening the Risk Register today reads a line saying it is a draft, which contradicts the fact that it was signed off three weeks ago. SRC-MASTER section 6.1 (p. 9) requires version history and approval information on the PED and consistent identifiers across it. |
| Requirements affected | None in substance. Header lines only on the functional requirements, non-functional requirements, acceptance criteria, RTM and the proposal list. |
| Architecture and design affected | None. |
| UI, API and data affected | None. |
| Security and privacy impact | None. |
| Quality and testing impact | Removes an ambiguity about which version of an acceptance criterion a later test result belongs to. |
| Scope impact | None. |
| Schedule and resource impact | Under an hour of editing. |
| Cost impact | None. |
| Risk impact | Reduces the chance of presenting baselined evidence as a draft at the M2 gate, which would understate the M1 work. Related to RSK-011. |
| Recommendation | ACCEPT |
| Authorisation | Recorded by the approvals on the pull request that carries this register into `main`. |

## CR-002 Close the five requirement proposals P-01 to P-05

| Field | Entry |
| --- | --- |
| Change ID | CR-002 |
| Requested by | Tristan Els |
| Date | 2026-09-29 |
| Requested change | Approve P-01, P-02 and P-04 as written and treat their detail as approved requirement content. Approve P-03 in principle, with the named role, action and data scope matrix still to be produced before the data model is baselined. Defer P-05: NFR-004 and NFR-005 keep their numbers as proposed targets and are not treated as baselined acceptance thresholds until the verification environment, data volume and participant selection are defined. |
| Reason and expected value | Version 1.0 baselined 12 functional and 5 non-functional requirements whose testable detail sat in five proposals nobody had confirmed. RSK-005 recorded the consequence: a baseline signed off with acceptance criteria that cannot be tested. M2 now has to design a data model and a permission boundary, and both depend on P-02 and P-03. Designing against rules nobody agreed is how a requirement gets reinterpreted during implementation instead of being met. |
| Requirements affected | P-01 supplies the request fields and the controlled category list behind FR-001 to FR-003. P-02 supplies the status transitions and the due date behind FR-004 and FR-007 to FR-010. P-03 supplies the access scope behind FR-003 to FR-011, NFR-001 and NFR-002. P-04 supplies the feedback route behind FR-004, FR-008 and FR-009. P-05 supplies the numbers in NFR-004 and NFR-005. |
| Architecture and design affected | P-03 fixes where authorisation is enforced, which is the question FEC-001 has been holding open since M1. P-02 turns the status transitions into a domain rule that the architecture has to place somewhere deliberate, rather than logic that accumulates in screens. |
| UI, API and data affected | P-01 fixes the request record and makes the category list controlled reference data rather than free text. P-02 adds the due date and the status field. P-04 keeps feedback inside the request history, so no external messaging integration enters the data model or the interface surface. |
| Security and privacy impact | P-03 is the security boundary for the whole product. Approving it without the matrix would leave NFR-001 promising a permission test whose rows are unknown, which is why the matrix is a condition on the approval rather than a later task. |
| Quality and testing impact | AC-FR-001 to AC-FR-011 become testable once the detail is approved. AC-NFR-004 and AC-NFR-005 stay untestable while P-05 is deferred, and the RTM records their verification as Planned rather than implying a check exists. |
| Scope impact | No new scope. The approval confirms the exclusions already recorded in the requirements index, including external messaging and reopening a closed request. |
| Schedule and resource impact | Closing four proposals is a review session. The permission matrix is part of the M2 data and architecture work and is the only item here that costs real time. |
| Cost impact | None. |
| Risk impact | Closes RSK-005 for P-01, P-02 and P-04 and reduces it for P-03. RSK-004 stays open, because deferring P-05 is the honest position rather than the resolved one. The permission matrix becomes a dependency of the data model, recorded as DEP-001. |
| Recommendation | MODIFY. Approve three, approve one conditionally, defer one. |
| Authorisation | Recorded by the approvals on the pull request that carries this register into `main`. |

Deferring P-05 is a decision, not an omission. The numbers in NFR-004 and NFR-005 were set by us rather than taken from a stakeholder or a measurement, and the environment they would be measured in does not exist yet because the technology stack is being chosen in this milestone. Approving them now would baseline a threshold we cannot test and would probably have to change under this same process in M3. The requirement wording stays, the numbers stay visible as proposed, and the RTM says so.

## CR-003 Define overdue on calendar time in one recorded time zone

| Field | Entry |
| --- | --- |
| Change ID | CR-003 |
| Requested by | Tristan Els |
| Date | 2026-09-29 |
| Requested change | A request is overdue when the current time is later than its due date and its status is Accepted or In Progress. Overdue is calculated on calendar time, not working hours. Due dates and recorded event times are stored in UTC and displayed in Africa/Johannesburg. |
| Reason and expected value | FEC-004 recorded that P-02 gave the overdue rule but not the clock it runs on. FR-010 requires management to see overdue work, so the report cannot be built without this. Two implementations that both follow P-02 can disagree about whether a request due at 17:00 on a Friday is overdue at 09:00 on the Monday. The data model and the management view both need one answer, and M3 test data has to be constructed against it. |
| Requirements affected | FR-009 records the due date, FR-010 reports on it, FR-011 records event times. AC-FR-009 and AC-FR-010 gain a definite expected result. |
| Architecture and design affected | Overdue stays a computed flag rather than a stored status, so nothing has to run on a schedule to move records into an overdue state. That keeps the status machine in P-02 as the only thing that changes a request status. |
| UI, API and data affected | Every timestamp in the data model is stored in UTC and converted at display. This settles the history events as well as the due date, so the chronological order in FR-011 is unambiguous. |
| Security and privacy impact | None. |
| Quality and testing impact | AC-FR-010 becomes measurable. The M3 test data has to include a request whose due date falls overnight and one whose due date falls over a weekend, because those are the two cases a working hours rule would have answered differently. |
| Scope impact | Rejects working hours calculation. That would need a business hours calendar and a public holiday list, neither of which the brief supports and both of which would have to be maintained. |
| Schedule and resource impact | Small now. Expensive in M3, where it would mean changing the report, the test data and probably the stored timestamps at the same time. |
| Cost impact | None. |
| Risk impact | Closes the part of FEC-004 that survived M1. Leaves a residual: the organisation may in practice measure overdue in working hours, and we have no stakeholder access to confirm it. That is recorded as ASM-004 rather than treated as settled. |
| Recommendation | ACCEPT |
| Authorisation | Recorded by the approvals on the pull request that carries this register into `main`. |

## CR-004 Require a controlled deletion or anonymisation route in the data model

| Field | Entry |
| --- | --- |
| Change ID | CR-004 |
| Requested by | Tristan Els |
| Date | 2026-09-29 |
| Requested change | Record a constraint on the data design: the model must allow the personal data on a request and its history to be removed or anonymised through an administrative route restricted to a named role, while ordinary users still cannot edit or delete history events. NFR-002 keeps its wording and gains a stated exception for that route. |
| Reason and expected value | FEC-002 and RSK-006 both said that requests will carry contact details and matters such as security concerns and lost property, and that the team had agreed no retention or deletion position. NFR-002 forbids ordinary users from editing or deleting history, which is right for accountability and says nothing about whether anything can ever be removed. Retention and deletion are close to impossible to add to a schema built on the assumption that records are permanent, and the schema is being designed in this milestone. |
| Requirements affected | NFR-002 gains an explicit exception. No functional requirement changes wording. |
| Architecture and design affected | The role set needs a level above ordinary staff, which lands on P-03 and has to be in the permission matrix rather than added afterwards. |
| UI, API and data affected | The history table has to tolerate a redacted actor and redacted free text without losing the event itself, so that anonymising a request does not destroy the accountability record or the management counts built on it. |
| Security and privacy impact | This is the change. It gives the project a defensible position under a data protection obligation without claiming the system is compliant with one. The applicability of the Protection of Personal Information Act 4 of 2013 is still unconfirmed and stays recorded as an assumption. |
| Quality and testing impact | A later test has to show that anonymising a request leaves its history events countable for management reporting. Without that check the route could quietly break FR-010. |
| Scope impact | Adds an administrative capability the minimum business capabilities do not list. SRC-MASTER section 3.1 (p. 7) allows that where the effect on scope, security and risk has been considered, which is what this record does. The alternative is to state that CivicConnect can never remove personal data, and we cannot defend that for a system holding contact details and security concerns. |
| Schedule and resource impact | A column and relationship decision now. A small administrative path in M3. |
| Cost impact | None. |
| Risk impact | Reduces RSK-006. Introduces the risk that an anonymisation route becomes a way to erase accountability, which is why the route is restricted to a named role and the event survives the redaction. That residual is recorded in the Risk Register as RSK-016. |
| Recommendation | ACCEPT as a constraint on the data model, not as a new functional requirement for M2. |
| Authorisation | Recorded by the approvals on the pull request that carries this register into `main`. |

## CR-005 Build all seventeen requirements for the M3 release candidate

| Field | Entry |
| --- | --- |
| Change ID | CR-005 |
| Requested by | Tristan Els |
| Date | 2026-10-12 |
| Requested change | Build all seventeen requirements for the M3 release candidate. This replaces the eleven-requirement limit in DEC-014. The wording of the requirements does not change. |
| Reason and expected value | DEC-014 left six requirements out because we thought three people could not build everything in time. We can now split the work so the database, the endpoints and the client are built at the same time. Three of the six are Must Have. FR-009 and FR-010 are also the whole management part of the system, which the Master Brief lists as a minimum capability (SRC-MASTER section 3, p. 7). Without them the system serves two of the three user groups. The Master Brief marks us on how much of the agreed scope we deliver (SRC-MASTER section 21, p. 21), so anything left out has to be explained later. |
| Requirements affected | FR-004, FR-009, FR-010, FR-012, NFR-004 and NFR-005 come back in. The other eleven stay as they were. |
| Architecture and design affected | None. The modules in ADR-001 already cover these. FR-004 reads the history that FR-011 writes. FR-010 reads data the same way the staff queue does. |
| UI, API and data affected | New endpoints to read feedback and the management summary, and one to record actions, comments and due dates. The database gets a table for work records and a due date. Management is added as a role in the permission matrix. |
| Security and privacy impact | Management is a new role with its own limits on what it can see, so the permission tests for NFR-001 need extra rows. Feedback shows only what the requester may see, never internal staff notes. |
| Quality and testing impact | We need test cases for the six requirements. NFR-005 is measured in the M3 performance test, which needs the test setup and data size that TD-008 says are not defined yet. NFR-004 needs a check with five people. Both targets stay as proposals under DEC-010 until we have a measurement. |
| Scope impact | Reverses DEC-014. The product scope does not change, because DEC-014 never removed these six from the baseline. |
| Schedule and resource impact | This is the main cost. The work is split across all three of us: database first, then endpoints, then the client and the end-to-end tests. If we run out of time, requirements leave in this order: NFR-004, NFR-005, FR-012, then FR-009 and FR-010 together. Each one is its own change request with an impact analysis. SRC-MASTER section 18 (p. 15) asks us to record the trade-off when time is short. |
| Cost impact | None. |
| Risk impact | The risk is the one DEC-014 named: too much scope, with requirements left half built. The order above is the control. A requirement counts as met only when we have test results for it. |
| Recommendation | ACCEPT |
| Authorisation | Recorded by the approvals on the pull request that carries this change into `main`. |

## CR-006 Build the client in HTML, CSS and JavaScript instead of React and Vite

| Field | Entry |
| --- | --- |
| Change ID | CR-006 |
| Requested by | Tristan Els |
| Date | 2026-10-12 |
| Requested change | Build the client as plain HTML, CSS and JavaScript pages, served by the Express server. This replaces React 19.3.0 and Vite 8.3.x. TypeScript, Node.js, Express and PostgreSQL stay as ADR-003 says. |
| Reason and expected value | No client code exists, and nobody on the team has installed or run React or Vite (TD-007, ASM-005). We already work in HTML, CSS, JavaScript and Node.js. SRC-MASTER section 18.1 (p. 15) says to consider team skill and learning time when choosing technology. The client is the last part we build, and the end-to-end tests cannot run without it. We should not spend that time learning a new framework first. |
| Requirements affected | None. NFR-004 keeps its usability target. |
| Architecture and design affected | No change to ADR-001. The client stays separate from the server and only talks to it through the `/api/v1` interface in ADR-006. The Express server will also serve the pages, so staging is one service. We can split the client out later without changing the API. |
| UI, API and data affected | The API and the data do not change. ADR-006 says "React frontend". Read that as "browser client". |
| Security and privacy impact | React cleans up text before it shows it, and plain pages do not. Anything a user types, such as a title or a comment, must be shown as plain text and never as HTML. The permission checks stay on the server, as ADR-003 says. |
| Quality and testing impact | End-to-end tests use a browser tool and work the same on plain pages. We cannot use React's component test tools, so we keep the client simple and keep the rules in the backend, which is tested. |
| Scope impact | None. |
| Schedule and resource impact | Takes a new set of tools out of the work. Plain page code repeats more than React components do, and we accept that. |
| Cost impact | None. |
| Risk impact | React and Vite no longer count against the assumption in ASM-005. We lose reusable components and React's larger ecosystem. A new risk is user text shown as HTML. An end-to-end test that types a script tag into a field checks it. |
| Recommendation | ACCEPT |
| Authorisation | Recorded by the approvals on the pull request that carries this change into `main`. |

---

## CR-007 Ignore the hasOwner field in the status request

| Field | Entry |
| --- | --- |
| Change ID | CR-007 |
| Requested by | Liam de Villiers, recorded by me |
| Date | 2026-10-14 |
| Requested change | The status endpoint stops reading `hasOwner` from the request body. The server works out whether a request has an owner from the stored request. The field is still accepted and ignored, so older callers do not break. |
| Reason and expected value | Before this change a caller could send `hasOwner: true` and move a request to In Progress with nobody responsible. P-02 says In Progress needs an owner, and the rule meant little if the caller could claim one. Liam found it while adding sign in (ADR-007). |
| Requirements affected | FR-008 and AC-FR-008. The wording does not change. |
| Architecture and design affected | The application layer reads the owner from the stored request. The transition table in ADR-004 does not change. |
| UI, API and data affected | The `hasOwner` row in the status table of the [API contract](../integration/api-v1.md) now says the field is ignored. The client still sends it, and the server ignores it. |
| Security and privacy impact | Closes a way to skip a rule by saying so in the request. It fits NFR-001: what the server decides never comes from the caller. |
| Quality and testing impact | TC-API-21 in `api.test.ts` sends `hasOwner: true` with no owner and expects the move to be refused and nothing to change. |
| Scope impact | None. |
| Schedule and resource impact | Small. It came with the sign in work. |
| Cost impact | None. |
| Risk impact | Removes one way a status could be changed wrongly. No entry in the Risk Register needed to change. |
| Recommendation | ACCEPT |
| Authorisation | The code change merged in PR #38 on 15 October 2026 with approvals from Dewald Allers and me. The code cited this identifier before the register held it, which is DEF-012. This entry closes that gap. It was approved when PR #43 merged on 16 October 2026. |

## CR-008 Require the observed version on every change and apply the lifecycle limits at the API

| Field | Entry |
| --- | --- |
| Change ID | CR-008 |
| Requested by | Dewald Allers in PR #42, recorded by me |
| Date | 2026-10-15 |
| Requested change | Every call that changes a request (assign, status, note and due date) must send `expectedVersion`, the version the page last read. A missing or invalid value gets a 400. A value that no longer matches gets a 409 with `code: "stale"`. The API also applies the limits the data store already holds. Ownership cannot change once a request is Resolved, Closed or Rejected. A note cannot be added once a request is Closed or Rejected. A due date can be set or cleared only while a request is Accepted or In Progress. |
| Reason and expected value | FR-007 to FR-009 and P-02 do not say when an owner change, a note or a due date is allowed, or what happens when two people edit one request at the same time. Dewald's data work answered both questions in the store. When the endpoints did not follow, a page holding an old version could overwrite a newer change (DEF-006), and a refused change came back as a server error instead of a clear answer (DEF-009). The client already sends `expectedVersion` on every change. |
| Requirements affected | FR-007, FR-008 and FR-009, with AC-FR-007, AC-FR-008 and AC-FR-009. The wording does not change. The limits fill in what P-02 left open. |
| Architecture and design affected | None. The database holds the same limits. The application layer now refuses early with a clear answer, and the database check stays as the last word when two changes arrive together. |
| UI, API and data affected | Four write endpoints gain a required body field. Making a field required is not an additive change under the versioning rule in the API contract. The only caller is our client, which already sends the field, so we keep `v1` and record the change here. |
| Security and privacy impact | Stops one person silently undoing another's change. No new access is given. |
| Quality and testing impact | Dewald's tests in PR #42 send raw authenticated calls. A stale write gets a 409 and adds no event. A missing version gets a 400. A refused lifecycle change gets a 409 and not a 500. |
| Scope impact | None. |
| Schedule and resource impact | Small. The work merged in PR #42. |
| Cost impact | None. |
| Risk impact | Reduces the chance that two people change one request and one change is lost. No register entry covered it before, and DEF-006 does now. |
| Recommendation | ACCEPT. The lifecycle limits are proposals from the data work. No stakeholder has confirmed them, and they are recorded as proposals in the [handoff note](../data/m3-repository-handoff.md). |
| Authorisation | The code merged in PR #42 on 15 October 2026 with approvals from Liam de Villiers and me. This entry was approved when PR #43 merged on 16 October 2026. |

## CR-009 Show requesters a generic label in place of staff names

| Field | Entry |
| --- | --- |
| Change ID | CR-009 |
| Requested by | Dewald Allers in PR #31 and PR #42, recorded by me |
| Date | 2026-10-15 |
| Requested change | A requester never sees which member of staff looks after a request. The request shows "Assigned staff" when someone has it, and nothing when nobody does. The history shows "Staff" for events by staff, and an ownership change reads as a plain line with no names. Staff and management still see names. The stored record keeps who did what. |
| Reason and expected value | AC-FR-004 says anything outside what the requester may see stays hidden. AC-FR-011 says the history shows each actor to an authorised user. The permission matrix does not say whether a requester may see staff names. Requests can be about security or lost property, and staff are named people. A requester does not need a name to follow their own request. |
| Requirements affected | FR-004 and FR-011, with AC-FR-004 and AC-FR-011. The wording does not change. This is a reading of what the requester is permitted to see. |
| Architecture and design affected | The data store hides the reference when a requester reads. The API words the labels. Names for staff come from the sign in directory. |
| UI, API and data affected | For a requester, `ownerId` is null, `ownerName` is "Assigned staff" and each staff `actorName` is "Staff". The history list in the client shows "Staff" when a name is missing (PR #39). |
| Security and privacy impact | A requester learns less about staff. A requester can still see that staff acted, and when. |
| Quality and testing impact | A case in `request-store.test.ts` keeps staff references out of the requester's detail and feedback while the stored record stays complete. T-FR-011-03 in the [test designs](../testing/test-cases.md) passes through the real server. |
| Scope impact | None. |
| Schedule and resource impact | Small. The store change, the client change and the API change are all merged. |
| Cost impact | None. |
| Risk impact | A requester may want to know who to ask. They ask through the request, which staff can see. We accept that. |
| Recommendation | ACCEPT |
| Authorisation | The store change merged in PR #31 with approvals from Liam de Villiers and me. The client change merged in PR #39 with approvals from Dewald Allers and Liam de Villiers. The API change merged in PR #42 with approvals from Liam de Villiers and me. This entry was approved when PR #43 merged on 16 October 2026. |

---

## Considered and not raised

Three things looked like changes and are not.

The M1 out of scope list named final technology stack, architecture, database schema, interface implementation, API implementation, design patterns, CI and production deployment. All of those enter scope at M2. That is the milestone structure in SRC-MASTER section 20 (pp. 17-20) working as intended, so it is recorded in the PED version history rather than as a departure from the baseline.

The numbers in NFR-004 and NFR-005 have not been changed. CR-002 defers their approval; it does not relax them. If a measurement in M3 shows the target is wrong, that is a new change request with its own impact analysis, and the number moves then rather than being quietly loosened now.

The final scope assessment leaves NFR-004 and NFR-005 in scope as Partially implemented. A requirement that stays in scope with partial evidence is a result, so it needs no change request. DEC-015 said a requirement that left the candidate would get its own request, and none left. CR-004 stays approved as a constraint on the data model. The administrative route it describes is not built, which TD-016 records as debt.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 3.1 (additional features, p. 7), 6.1 (PED quality standard, p. 9), 9 (GitHub governance, p. 11), 11 (requirements, traceability and baseline standard, p. 12), 14 (change management standard, p. 13), 20 (milestone structure, pp. 17-20), Appendix E (change request and impact analysis template, pp. 27-28).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 4.1 (continued engineering documentation, p. 3), 5.1 (M1 baseline review and controlled evolution, p. 4).

Republic of South Africa (2013) *Protection of Personal Information Act 4 of 2013*. Cited in CR-004 as the obligation most likely to apply. Applicability is not confirmed.

Full source records are in the [source register](../sources.md).
