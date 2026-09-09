# Acceptance criteria

Version 0.3 | 9 September 2026 | Owner: Dewald Allers | Status: **planned acceptance criteria; no tests executed**

Each heading is a stable acceptance-criteria ID linked to one requirement. Its bullets are the criteria for that requirement; all must pass. These criteria operationalise the source-backed requirements in the [functional](functional-requirements.md) and [non-functional](non-functional-requirements.md) requirement tables (SRC-M1, section 3, p. 3). They use the [proposed rules](decisions-to-confirm.md) until the team validates them. Use synthetic test records and users. Keep expected and actual results separate in later test evidence.

## AC-FR-001

- Given valid required fields and an approved category, when a requester submits once, then one request is saved with its supplied values, a unique reference, submission time, requester identity and initial Submitted status, and confirmation shows the reference.
- Given a blank required field or a value outside the agreed field limits, when submission is attempted, then the relevant field is identified and no request is created. Test each required field and the agreed length boundaries from P-01.

## AC-FR-002

- Given the approved category list, when a requester categorises a request, then the choices match that list and the saved category matches the selection.
- Given a category not in the approved list, when submission is attempted, then it is rejected even if the invalid value is supplied outside the normal form controls.

## AC-FR-003

- Given requester A has two requests and requester B has one, when A views their request list, then A sees exactly their two requests, with the correct reference, title, submission time and current status, and does not see B's request.
- Given a saved staff status change, when A refreshes their list, then the new status appears. A requester with no requests sees an explicit empty result.

## AC-FR-004

- Given a request is accepted, rejected, updated, resolved or closed, when its requester next views/refreshes its history, then feedback identifies that event, its time and the resulting status. Verify each event separately.
- Rejection feedback includes the recorded reason; resolution feedback includes resolution information. Information outside the requester's approved visibility is not disclosed. A failed change does not produce success feedback.

## AC-FR-005

- Given a staff member and requests inside/outside their agreed permission scope, when the member opens the queue and a permitted request, then only permitted requests appear and the selected request's permitted details match its saved record.
- A direct attempt to view an out-of-scope request is denied without disclosing its protected details.

## AC-FR-006

- Given records across at least two categories and two statuses, when staff apply a category filter, a status filter and then both, then each result contains all and only the permitted records matching the selected condition(s).
- Clearing filters restores the permitted list; a combination with no matches shows an empty result. Filtering never widens access scope.

## AC-FR-007

- Given an unowned request, when authorised staff accept responsibility, then their identity is shown as the current owner.
- Given an eligible staff member, when authorised staff assign the request to that member, then the new owner is shown and the ownership change is recorded in history. An ineligible target or unauthorised attempt is rejected and the owner remains unchanged.

## AC-FR-008

- Given each source status in the P-02 table and its required information, when authorised staff perform the corresponding permitted transition, then the target status is saved and appears in history.
- A transition absent from that table is rejected. Missing rejection reason, missing resolution information, or attempting In Progress without an owner is rejected. In each case, the stored status remains unchanged.
- A user without the required change permission cannot resolve or close a request.

## AC-FR-009

- Given a permitted request, when authorised staff record an action, comment or resolution information, then the entry is linked to that request with the correct author and recording time and remains available on a later view.
- Given accepted work, when authorised staff record/change an agreed due date, then the date and change history are retained and the overdue result follows P-02. A request with no due date remains distinguishable from one not yet due.

## AC-FR-010

- Given a known dataset containing every proposed status and categories, when management views the summary and its linked lists, then the counts match the corresponding permitted records, both before and after category/status filtering.
- At a fixed reference time, an Accepted/In Progress request with a past due date is overdue; one due exactly at that time or later is not. Resolved, Closed and Rejected requests are not overdue. Requests with no due date are listed as such and not silently counted as on time.
- Open includes Submitted, Accepted and In Progress. Resolved and Closed counts remain distinct. Overdue can overlap Open; summary groups must not be presented as mutually exclusive totals.

## AC-FR-011

- Given a request has been submitted, assigned, progressed and given an action note, when an authorised viewer opens its history, then each event appears in chronological order with its actor, time and recorded change.
- Ownership/status events identify the previous and resulting values. Viewers see only the history information their permission scope allows.

## AC-FR-012

- Given three permitted requests with different submission times, when staff select oldest-first order, then the earliest is first and the latest is last. All records remain present; ties may use any order.
- When sorting a filtered list, the matching records remain the same and only their order changes.

## AC-NFR-001

- Given the team-approved role/action/data-scope permission matrix from P-03, execute one allowed and one denied case wherever each combination applies, including requester A attempting to read requester B's request and staff acting outside their scope.
- All allowed cases succeed; every denied case returns no protected request data and changes no record. Repeat denied cases through direct data-access requests rather than testing only hidden buttons. The mechanism is designed later; no API implementation is implied in M1.
- Retain the matrix, inputs, expected/actual results and failures. P-03 is unresolved, so this check cannot currently establish compliance.

## AC-NFR-002

- Perform the successful submission, ownership, status and action-recording cases above. For each successful action, compare the changed record with its history: exactly one corresponding event has the correct actor, time and change, with none missing.
- Attempts to change or delete those events using requester, staff or oversight permissions are denied. Failed business actions are not represented as successful history events.

## AC-NFR-003

- Prepare acknowledged requests spanning the proposed statuses, with ownership, notes and history. Capture their saved values, perform a controlled application restart, then retrieve them again.
- Pass only if every acknowledged record and event remains present with the same saved values. Retain the fixture, before/after comparison and restart procedure. Unsubmitted forms and catastrophic infrastructure failure are outside this check.

## AC-NFR-004

- Use five representative first-time requesters, a prepared access session and the same task instructions: submit a valid sample request, then locate its current status. Start timing when the task is given; stop when both tasks are complete.
- At least four participants complete both tasks correctly without hints within five minutes each. Record times, completion and assistance needed. Do not invent participants or outcomes.
- P-05 and the participant selection require agreement. This small check provides initial usability evidence, not a population-wide claim.

## AC-NFR-005

- Agree and record the environment, request-data volume and user mix before baseline approval. Later, run the standard list, detail and summary operations under ten concurrent users, collecting at least 100 timed observations per operation type.
- For each type separately, at least 95% of observations must both succeed and display the requested content within two seconds. Measure end-to-end; count errors/timeouts as failures and document any warm-up separately.
- Retain configuration, workload and raw timing/results. Both the target and workload are proposed in P-05; no measured performance evidence exists yet.

## Later verification record

For each planned test retain: Test ID, requirement/AC ID, artefact version/commit, environment, input/precondition, expected result, actual result, pass/fail, date and defect link if failed. The [RTM](RTM.md) reserves future evidence columns. Passing these criteria does not by itself prove the whole product is secure or fit for every possible situation.

Sources: SRC-MASTER, sections 3, 11 and 15, pp. 7, 12 and 14; SRC-M1, section 3, p. 3. Full references: [Part 2 index](README.md#references).
