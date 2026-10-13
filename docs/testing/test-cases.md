# Test case designs

Version 1.0 | 13 October 2026 | Owner: Tristan Els | Status: **raised for review in the M3 pull request, approved when it merges**

Every case below says what we check, how, and what we expect. The [test approach](README.md) explains the levels, the techniques and how a case turns into evidence. The [RTM](../requirements/RTM.md) links each requirement to its cases.

All cases use made-up users and made-up requests. The requesters are Thandi and Bongani, the staff are Sipho and Lerato, and the manager is Mary. Where a length limit or a category name depends on P-01, the case uses the value the team chooses for P-01.

Case identifiers are permanent. A case that changes keeps its identifier and a case that is dropped is never reused.

## Submit and track (FR-001 to FR-004)

| ID | What we check | Level | Technique | Kind | Priority | Expected result |
| --- | --- | --- | --- | --- | --- | --- |
| T-FR-001-01 | Thandi sends a request with a title, a description and an approved category | Black-box | Equivalence partitioning | Positive | High | One request is saved with the values entered, a unique reference, the time sent, Thandi as requester and the status Submitted |
| T-FR-001-02 | Thandi sends a request with a blank title, then a title of only spaces | Black-box | Equivalence partitioning | Negative | High | The reply names the title field and no request is saved |
| T-FR-001-03 | Thandi sends a title and a description exactly at the length limit, then one character over | Black-box | Boundary values | Negative | High | The request at the limit is saved and the one over the limit is refused with the field named |
| T-FR-001-04 | A caller sends a request with the description field missing | API or integration | Error guessing | Negative | Medium | A 400 reply carries one message per bad field and no request or event is saved |
| T-FR-002-01 | Thandi sends one request for each approved category | API or integration | Equivalence partitioning | Positive | Medium | Each saved request holds the category that was chosen |
| T-FR-002-02 | A caller sends a category id that is not on the list, straight to the server | API or integration | Equivalence partitioning | Negative | High | The request is refused and nothing is saved |
| T-FR-003-01 | Thandi has two requests and Bongani has one, and Thandi opens her list | API or integration | Equivalence partitioning | Positive | High | Thandi sees her two requests with the right reference, title, time and status, and never Bongani's |
| T-FR-003-02 | A staff member changes a status, then Thandi refreshes her list | E2E | Scenario | Positive | High | The list shows the new status |
| T-FR-003-03 | Bongani has no requests and opens his list | Black-box | Equivalence partitioning | Positive | Medium | The page shows an empty list with a clear message |
| T-FR-003-04 | Thandi asks for Bongani's request by its reference | API or integration | Error guessing | Negative | High | The reply is the same 404 as for a reference that does not exist, and no detail leaks |
| T-FR-004-01 | One request goes through accepted, rejected, in progress, resolved and closed, one run for each outcome, and Thandi reads her updates after each | Black-box | State transition | Positive | High | Each update shows what happened, when, and the new status |
| T-FR-004-02 | Staff reject a request with a reason, then resolve another with resolution information, and add an internal note to a third | Black-box | Equivalence partitioning | Positive | High | Thandi sees the reason and the resolution information, and does not see the internal note |
| T-FR-004-03 | Staff try a status change that the rules refuse, and Thandi reads her updates | Black-box | State transition | Negative | High | Thandi sees no update for the refused change |

## Handle requests (FR-005 to FR-009, FR-012)

| ID | What we check | Level | Technique | Kind | Priority | Expected result |
| --- | --- | --- | --- | --- | --- | --- |
| T-FR-005-01 | Sipho holds Facilities, IT support and Maintenance, and opens the queue while requests exist in all categories | API or integration | Equivalence partitioning | Positive | High | The queue holds only requests in his three categories |
| T-FR-005-02 | Sipho opens a Security request by its reference | API or integration | Error guessing | Negative | High | The reply is 404 and shows nothing about the request |
| T-FR-006-01 | Requests exist in two categories and two statuses, and staff filter by category, by status, by both, and then clear the filters | Black-box | Decision table | Positive | High | Each result holds all and only the matching requests Sipho may see, and clearing restores his full queue |
| T-FR-006-02 | A caller sends a filter value that tries to widen the result, such as a category outside Sipho's scope or an injected string | API or integration | Error guessing | Negative | High | The filter is treated as plain data and the result never grows beyond Sipho's scope |
| T-FR-007-01 | Sipho takes a request that has no owner | API or integration | Equivalence partitioning | Positive | High | Sipho becomes the owner and one ownership event is recorded |
| T-FR-007-02 | Sipho gives a request to Lerato, who holds that category | API or integration | Equivalence partitioning | Positive | Medium | The owner changes and the event shows the old and the new owner |
| T-FR-007-03 | Sipho gives a request to a staff member who does not hold that category | API or integration | Equivalence partitioning | Negative | High | The reply is 409, the owner stays the same and no event is recorded |
| T-FR-008-01 | Each allowed move: Submitted to Accepted, Submitted to Rejected with a reason, Accepted to In Progress with an owner, In Progress to Resolved with resolution information, Resolved to Closed | Unit | State transition | Positive | High | Every move is allowed |
| T-FR-008-02 | Moves the rules do not list, including Closed to Submitted and Rejected to Accepted | Unit | State transition | Negative | High | Every move is refused and the stored status does not change |
| T-FR-008-03 | Rejecting without a reason, resolving without resolution information, and starting work with no owner | Unit | Decision table | Negative | High | Each is refused with the missing item named |
| T-FR-008-04 | Thandi, as a requester, tries to resolve a request | API or integration | Error guessing | Negative | High | The reply is 403 and the status stays the same |
| T-FR-008-05 | A request is taken from Submitted to Closed through the server, one step at a time | Black-box | State transition | Positive | High | Every step is accepted, the final status is Closed and one event exists per step |
| T-FR-009-01 | Sipho records an action note on a request in his scope | API or integration | Equivalence partitioning | Positive | Medium | The note is saved with Sipho as author and the time recorded |
| T-FR-009-02 | Sipho sets a due date, changes it, then clears it | API or integration | Equivalence partitioning | Positive | Medium | Each change is saved with one event, and a request with no due date reads as due date not set |
| T-FR-009-03 | Sipho records a blank note, then a note on a request outside his scope | API or integration | Error guessing | Negative | Medium | Both are refused and nothing is saved |
| T-FR-012-01 | Three requests with different submission times, and staff sort oldest first | Unit | Equivalence partitioning | Positive | Medium | The earliest comes first and the latest last, with all three present |
| T-FR-012-02 | The same sort on a category filtered list | Black-box | Equivalence partitioning | Positive | Medium | Only the order changes and the same requests match |

## Oversight and history (FR-010, FR-011)

| ID | What we check | Level | Technique | Kind | Priority | Expected result |
| --- | --- | --- | --- | --- | --- | --- |
| T-FR-010-01 | Requests due the day before, at the reference time and the day after, plus a resolved request past its date and a request with no due date | Black-box | Boundary values | Positive | High | Only the open request past its due date counts as overdue. The due-at-reference request, the resolved request and the request with no date do not |
| T-FR-010-02 | Mary opens the summary and then each list behind a count, with and without a filter | Black-box | Equivalence partitioning | Positive | High | Every count equals the number of rows in its list |
| T-FR-010-03 | A manager who holds only Facilities opens the summary | API or integration | Equivalence partitioning | Negative | High | Counts and lists cover Facilities only |
| T-FR-010-04 | One open request past its due date | Black-box | Decision table | Positive | Medium | It counts under open and under overdue, so the counts are not exclusive |
| T-FR-011-01 | A request is submitted, assigned, moved on and given a note, and staff open its history | API or integration | Scenario | Positive | High | Events appear oldest first, each with actor, time and change |
| T-FR-011-02 | Ownership and status events in that history | API or integration | Equivalence partitioning | Positive | Medium | Each shows the old and the new value |
| T-FR-011-03 | Thandi opens the history of her request after an internal note and an ownership change | API or integration | Equivalence partitioning | Negative | High | She sees only the events meant for her, with no staff references |

## Quality requirements (NFR-001 to NFR-005)

| ID | What we check | Level | Technique | Kind | Priority | Expected result |
| --- | --- | --- | --- | --- | --- | --- |
| T-NFR-001-01 | One allowed and one denied call for every row of the [permission matrix](../data/permission-matrix.md), sent straight to the server | API or integration | Decision table | Negative | High | Allowed calls work. Denied calls return no protected data and change no record |
| T-NFR-001-02 | The authorisation policy for requester, staff and management, in scope and out of scope | Unit | Decision table | Negative | High | The policy allows and denies each case as the matrix says |
| T-NFR-001-03 | A call with no sign-in, then a call with a token that is not valid | API or integration | Error guessing | Negative | High | Both get 401 and no data |
| T-NFR-002-01 | One successful submit, assign, status change, note and due date change | API or integration | Scenario | Positive | High | Each action leaves exactly one matching event with the right actor, time and change |
| T-NFR-002-02 | A failure is forced while the event is written | API or integration | Fault injection | Negative | High | The request change rolls back and no event exists |
| T-NFR-002-03 | Two staff change the same request from the same version | API or integration | Concurrency | Negative | High | One change is saved and the other gets 409 with the code stale |
| T-NFR-002-04 | A requester, staff member and manager each try to edit or delete an event | API or integration | Error guessing | Negative | High | All attempts fail and the event stays the same |
| T-NFR-003-01 | Requests in several statuses with owners, notes and history, then the server stops and starts again | API or integration | Scenario | Positive | High | Every request and event holds the same values after the restart |
| T-NFR-004-01 | Five first-time requesters send a request and find its status, with the same instructions | Manual | Task observation | Positive | Medium | At least four finish both tasks without help in under five minutes each. We record who needed help |
| T-NFR-005-01 | Ten concurrent users run the list, detail and summary calls, at least 100 cases of each, after a warm-up | Performance | Load | Positive | High | At least 95 percent of the cases in each type succeed in under two seconds |

## Whole journeys

| ID | What we check | Level | Technique | Kind | Priority | Expected result |
| --- | --- | --- | --- | --- | --- | --- |
| T-E2E-01 | In the browser, Thandi sends a request, Sipho takes it, accepts it and resolves it with resolution information, and Thandi reads her updates | E2E | Scenario | Positive | High | Each page shows the right state at each step and Thandi sees the resolution information (FR-001, FR-003, FR-004, FR-007, FR-008) |
| T-E2E-02 | In the browser, a request with a script in its title is sent, a second staff member changes it from an old version, and Mary opens the summary | E2E | Scenario | Negative | High | The title shows as text, the second change gets the stale message and the latest version, a requester cannot open the staff page, and Mary's counts match her lists (NFR-001, FR-010) |
