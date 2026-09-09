# Acceptance criteria

Version 0.3 | 9 September 2026 | Owner: Dewald Allers | Status: **planned acceptance criteria; no tests executed**

Each heading represents an ID number for acceptance criteria and refers to one requirement. The bullets represent the criteria of that particular requirement and all need to pass. Criteria operationalize the backed by sources requirements in the [functional](functional-requirements.md) and [non-functional](non-functional-requirements.md) requirement tables (SRC-M1, section 3, page 3). Proposed rules will be used until validation by the team. Use synthetic test data and users. Expected results should not be mixed with actual results.

## AC-FR-001

- Provided that there are valid required fields and approved category, upon making one submission, then one request will be saved with the values entered, a unique reference number, the time it was submitted, requester identity, and initial Status of “Submitted.”
- Provided that either of the required field is blank or does not fall within the agreed boundaries of the field, upon attempting to submit, then the field will be identified and a request will not be made. Test required field and length boundaries of P-01.

## AC-FR-002

- For the accepted category list, since a request will be categorised, the selections will correspond to the accepted list, and the saved category corresponds to the selections.
- For a category which is not on the accepted list, for any attempt to submit, the submission will be rejected even though the invalid value is provided outside the form controls.

## AC-FR-003

- Since there are two requests for requester A and one request for requester B, and since requester A checks the request list, requester A sees their requests precisely, with correct reference, title, time of submission and status, and does not see requester B's request.
- For any saved staff status update, after refreshing, the updated status is shown. A requester without any requests shows a specific empty list.

## AC-FR-004

- In case the request is accepted, rejected, modified, resolved, or closed, and the requester accesses/reviews its history subsequently, then the feedback highlights the event, time of its occurrence, and new status. The above mentioned events should be verified separately.
- Rejection feedback is inclusive of the noted reason while the resolution feedback highlights the resolution details. Any information which is outside the range of permissible access for the requester shall remain hidden from him. In case of unsuccessful modification, success feedback shall not be generated.

## AC-FR-005

- For any staff member, requests within his permitted access range and outside, in case the member accesses the queue and a permitted request, then only permitted requests will appear and the selected request's details shall be those permitted.
- A direct attempt to open an out-of-scope request must be denied without showing protected details.

## AC-FR-006

- If there are records present in at least two categories and two statuses, and staff use the filter for category, for status and both of them, then each time the outcome will include all and only those records that are allowed and meet the criteria selected.
- Clearing filters restores the permitted list; no matches show an empty result; filters must never expand access.

## AC-FR-007

- If there is an un-owned request, and the authorized staff accept the ownership, then the identity of that authorized staff member will be considered as the current owner.
- If there is an eligible staff member and the authorized staff assign the request to the mentioned person, then the owner will be changed and recorded in the history of the system.
- An ineligible assignment target or unauthorised attempt must be rejected and the owner must stay unchanged.

## AC-FR-008

- If a permitted transition is done by authorized personnel according to the required information in the P-02 table, then the target status is recorded and is part of history.
- A transition not in the above table gets rejected. Rejection of an entry without rejection reason, resolution information, or an attempt to do In Progress without an owner gets rejected. In either of these cases, the stored status remains the same.
- A person without the required permission to change cannot resolve or close a request.

## AC-FR-009

- For a permitted request, if an authorized person records information such as actions, comments, and resolution information, then the entry is recorded against the request along with the correct author and recording date.
- For accepted work, if an authorized person records/changes an agreed due date, then the due date is stored with the change history, and the overdue status is determined according to P-02. A request with no due date is distinct from one which is not due yet.

## AC-FR-010

- For a given dataset where all statuses and categories are known, if management is looking at the summary as well as its linked lists, then the number of entries will correspond to the relevant permitted records, both before and after categorization/status filters.
- An Accepted/In Progress request which is past its due date is considered overdue; one which is due at the reference time or later is not considered overdue. Resolved, Closed and Rejected requests are not considered overdue. The requests that have no due date are shown as such and not considered to be on time.
- Open includes Submitted, Accepted and In Progress. Resolved and Closed are counted separately. Overdue could overlap with Open; the summary categories should not be provided as exclusive totals.

## AC-FR-011

- For a given request which has been submitted, assigned, progressed and given an action note, when an authorized user opens its history, then each event is shown chronologically with its actor, timestamp and relevant change.
- Ownership/status events show the old and new values. Users can see only the history data that they are allowed to see based on their permissions.

## AC-FR-012

- If three acceptable requests have different submission times, for the order of oldest-first chosen by the staff, the earliest would be first and the latest would be last. All records would still be there; ties could be in any order.
- In the sorting of a filtered set, only the order would change, while all matching records would stay the same.

## AC-NFR-001

- Perform one allowed and one denied scenario for all combinations listed in the team-approved role/action/data-scope permission matrix from P-03, including requester A reading the request of requester B and staff working out of scope.
- All allowed scenarios would work; all denied scenarios would result in no return of protected request data and no changes to any record. Conduct denied scenarios via the actual data access requests, not just hidden buttons. The method would be implemented later; API implementation is not implied in M1.
- Preserve the matrix, inputs, expected/actual results, and failures. P-03 remains open, thus this verification cannot prove compliance at the moment.
- 
## AC-NFR-002

- Repeat the cases of successful submissions, ownership, status, and action recording mentioned above. For each of the successfully performed actions, check that exactly one matching event with the correct actor, time, and change occurs in the history of the records.
- The attempts to modify or remove such events by requester, staff, and oversight permissions fail. Failed business actions are not reflected as successful events in the history.

## AC-NFR-003

- Create acknowledged requests for the set of proposed statuses, including ownership and notes along with history. Save the values of the requests and repeat the test application restart process.
- Test passes when all acknowledged requests and events persist with the same values. Keep the fixture and restart procedure intact. Non-submitted forms and catastrophic failure of the infrastructure are excluded from this test.

## AC-NFR-004

- Use five representative new requestors, an already prepared access session and the same task instructions: submit a valid sample request, and then find its current status. Start timing when the task instructions are issued; stop once both tasks are completed.
- At least four subjects can successfully complete both tasks without help in less than five minutes for each. Take timing results and note completion and help provided. Do not make up subjects and their results.
- This five-person usability check is initial evidence only, not proof for all users.

## AC-NFR-005

- Agree on and record environment, data volume and mix of requesters prior to baseline acceptance. Then run the standard list, detailed and summary request types with ten concurrent requesters and collect at least 100 observed cases per type.
- In each case type independently, at least 95 percent of all observed cases should be successful and show the requested data within two seconds. Measure end-to-end time; consider errors and timeouts as failures and separate warm-ups.
- Preserve configuration, load level and results timing. The target system and load level are defined in P-05; there is no actual measurement evidence yet.

## Later verification record

For each intended test keep: test ID, requirement/AC ID, artefact version/commit, environment, precondition/input, expected result, actual result, pass/fail, date and defect URL if fail. The [RTM](RTM.md) leaves future evidence columns open. Fulfilling these criteria does not necessarily mean that the entire product is safe or suitable for all scenarios.

Sources: SRC-MASTER, sections 3, 11 and 15, pp. 7, 12 and 14; SRC-M1, section 3, p. 3. Full references: [Part 2 index](README.md#references).
