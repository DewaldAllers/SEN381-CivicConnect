# Requirements Traceability Matrix

Version 3.0 | 15 October 2026 | Owner: Tristan Els | Status: **M3 evidence and acceptance check from `main` at `142f6b3` and the browser journeys, approved when its pull request merges**

Dewald Allers owns the requirement wording this matrix traces. I own the matrix, which means the columns, the statuses and the evidence links.

The matrix links a stakeholder need to a requirement, then follows that requirement into the engineering decisions and the evidence that satisfies it. It is one living matrix for the project. Requirement wording lives in the [functional](functional-requirements.md) and [non-functional](non-functional-requirements.md) requirement documents, and short names are used here so the same sentence is not maintained in two places.

Twelve columns do not fit in one readable table, so the matrix is split into three that share the requirement identifier. Together they carry the fields SRC-M2 section 4.2 (pp. 3-4) asks for.

## How this matrix progressed

Version 1.0 traced need, source, priority and acceptance criterion, and reserved a second table for design, implementation, test and release evidence. Every cell of that second table read TBD, because M1 had produced none of it.

Version 2.0 replaced the reserved table with the columns M2 needs and filled the four that could be filled honestly at the time: architecture responsibility, the data constraints from CR-003 and CR-004, three approved interface decisions, and the change record behind most requirements. Technology, implementation and verification stayed empty because DEC-007 was still open and no code existed.

Version 2.1 fills the rest. The quality driver column now carries ASR-01 to ASR-05 from the architecture work rather than candidates. The architecture column names the modules ADR-001 selected. The data column carries the ownership, integrity and access rules from ADR-002 and the permission matrix. The technology column carries the stack from ADR-003. Three requirements now carry real implementation and verification evidence, and their status moved from Approved to In Development.

Version 3.0 adds the verification plan. It lists the test cases designed for each requirement, with a status for each case and a place for the evidence. Evidence is added as each case runs and its work merges, so the matrix grows with the build.

Version 3.0 then fills the implementation and verification columns from `main` at commit `142f6b3`, where the database store sits behind the server. 150 tests pass, and two browser journeys pass in memory and on PostgreSQL. A new acceptance check reads every criterion against the executed cases. Thirteen requirements read Implemented, two read In Development because some of their criteria have no case yet, and two are deferred targets with no result. CR-007 to CR-009 are raised in the same pull request and take effect when it merges.

No functional requirement reads Not yet implemented any more. NFR-004 and NFR-005 read planned, because the five person check and the measured load run have not taken place. That is the accurate state of the build, and the matrix says so rather than describing intent as progress.

## Status vocabulary

Approved means baselined and unchanged. Changed means a change record has been authorised against it. In Development means implementation has begun and verification exists but the requirement is not met in full. Implemented means the requirement is met and verified. Deferred means the requirement stands but part of it is not approved.

Where a change has been raised and not yet authorised, the status stays at its current value and the raised change is named.

## Requirement identity and acceptance

| ID and requirement | Stakeholder need | Source | Priority | Acceptance criteria | Status |
| --- | --- | --- | --- | --- | --- |
| [FR-001: Submit a valid request](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-001](acceptance-criteria.md#ac-fr-001) | **Implemented** |
| [FR-002: Controlled category choice](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-002](acceptance-criteria.md#ac-fr-002) | **In Development** |
| [FR-003: Own request list and status](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-003](acceptance-criteria.md#ac-fr-003) | **Implemented** |
| [FR-004: Request feedback](functional-requirements.md) | NEED-P2-01 | SRC-MASTER, p. 7 | Must | [AC-FR-004](acceptance-criteria.md#ac-fr-004) | **Implemented**, CR-009 raised |
| [FR-005: Staff queue and details](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-005](acceptance-criteria.md#ac-fr-005) | **Implemented** |
| [FR-006: Category and status filtering](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-006](acceptance-criteria.md#ac-fr-006) | **Implemented** |
| [FR-007: Request ownership](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-007](acceptance-criteria.md#ac-fr-007) | **Implemented**, CR-008 raised |
| [FR-008: Controlled status transitions](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Must | [AC-FR-008](acceptance-criteria.md#ac-fr-008) | **Implemented**, CR-008 raised |
| [FR-009: Record work and due date](functional-requirements.md) | NEED-P2-02/03 | SRC-MASTER, pp. 6-7 | Must | [AC-FR-009](acceptance-criteria.md#ac-fr-009) | **Implemented**, CR-008 raised |
| [FR-010: Management summary and lists](functional-requirements.md) | NEED-P2-03 | SRC-MASTER, p. 7 | Must | [AC-FR-010](acceptance-criteria.md#ac-fr-010) | **Implemented** |
| [FR-011: Attributable lifecycle history](functional-requirements.md) | NEED-P2-02/03 | SRC-MASTER, pp. 6-7 | Must | [AC-FR-011](acceptance-criteria.md#ac-fr-011) | **Implemented**, CR-009 raised |
| [FR-012: Oldest first ordering](functional-requirements.md) | NEED-P2-02 | SRC-MASTER, p. 7 | Should | [AC-FR-012](acceptance-criteria.md#ac-fr-012) | **Implemented** |
| [NFR-001: Permission enforcement](non-functional-requirements.md) | NEED-P2-04 | SRC-MASTER, pp. 6, 14 | Must | [AC-NFR-001](acceptance-criteria.md#ac-nfr-001) | **Implemented** |
| [NFR-002: History completeness and integrity](non-functional-requirements.md) | NEED-P2-02/03/04 | SRC-MASTER, pp. 6-7 | Must | [AC-NFR-002](acceptance-criteria.md#ac-nfr-002) | **Implemented** |
| [NFR-003: Persistence across restart](non-functional-requirements.md) | NEED-P2-04 | SRC-MASTER, p. 6 | Must | [AC-NFR-003](acceptance-criteria.md#ac-nfr-003) | **In Development** |
| [NFR-004: First use usability](non-functional-requirements.md) | NEED-P2-01/04 | SRC-MASTER, p. 6 | Should | [AC-NFR-004](acceptance-criteria.md#ac-nfr-004) | Deferred target (CR-002, DEC-010) |
| [NFR-005: Responsiveness](non-functional-requirements.md) | NEED-P2-01/02/03/04 | SRC-MASTER, pp. 6, 8 | Should | [AC-NFR-005](acceptance-criteria.md#ac-nfr-005) | Deferred target (CR-002, DEC-010) |

## Engineering allocation

The quality driver column carries the architecturally significant requirements recorded in the [architecture and data section](../PED/architecture-and-data.md#b-architecturally-significant-requirements). The architecture column names the logical modules [ADR-001](../decisions/ADR-001-civicconnect-architecture.md) selected, which are responsibilities inside one deployable server rather than separate services.

| ID | Quality driver | Architecture responsibility | Data and persistence | Design and interface decision | Technology decision |
| --- | --- | --- | --- | --- | --- |
| FR-001 | ASR-03 durable records | Application boundary, Request Management, Persistence boundary | Request record with unique reference, requester reference, title, description, category reference, status and submission time (P-01). A rejected submission creates no record. | [ADR-006](../decisions/ADR-006-api-integration.md), `POST /api/v1/requests`, in the [API contract](../integration/api-v1.md). | ADR-003: Node 22.14.0, Express 5.2.1, TypeScript 7.0.2, PostgreSQL 18.6 |
| FR-002 | ASR-03 | Request Management | Category held as controlled reference data rather than free text. Only approved categories are selectable (P-01). | ADR-006, `GET /api/v1/categories`. | ADR-003 |
| FR-003 | ASR-01 scoped access, ASR-03 | Authorisation and scope checks, Request Management | Query scoped by `request.requesterRef` matching the authenticated principal. Knowing a reference alone gives no access ([permission matrix](../data/permission-matrix.md)). | ADR-006, `GET /api/v1/requests/mine`. | ADR-003 |
| FR-004 | ASR-02 attributable history | Authorisation and scope checks, History/Audit | Feedback is read from the request event sequence. Requester-facing events only, not internal staff notes (P-04, permission matrix). | [ADR-006](../decisions/ADR-006-api-integration.md) boundary. Feedback stays inside the request history, so there is no second source of status (P-04). | ADR-003 |
| FR-005 | ASR-01, ASR-05 bounded retrieval | Authorisation and scope checks, Request Management | Query scoped by the staff member's approved category grant. An empty grant set gives no access. | ADR-006, `GET /api/v1/requests`. | ADR-003 |
| FR-006 | ASR-05 | Request Management | Category reference and status must be queryable as filters. Indexes follow representative data. | ADR-006, the `categoryId` and `status` filters on `GET /api/v1/requests`. | ADR-003 |
| FR-007 | ASR-01, ASR-04 controlled workflow | Request Management, History/Audit | Responsible staff reference held on the request. An assignee must hold a category grant for that request's category. Every ownership change records an event. | ADR-006, `POST /api/v1/requests/:id/assign` and `GET /api/v1/staff`. | ADR-003 |
| FR-008 | ASR-02, ASR-04 | Request Management, History/Audit | Status constrained to the P-02 transitions, with Rejected and Closed terminal. The request change and its one matching event commit together ([ADR-002](../decisions/ADR-002-request-history-persistence.md)). | [ADR-004](../decisions/ADR-004-request-lifecycle.md): one central RequestStatusPolicy holds the transition table instead of the rules spreading across handlers. [ADR-006](../decisions/ADR-006-api-integration.md): `PATCH /api/v1/requests/:id/status`. | ADR-003 |
| FR-009 | ASR-02, ASR-04 | Request Management, History/Audit | Due date optional and stored in UTC (CR-003). Actions, comments and resolution held as request events carrying actor and recorded time. | ADR-006, `POST /api/v1/requests/:id/notes` and `PATCH /api/v1/requests/:id/due-date`. | ADR-003 |
| FR-010 | ASR-01, ASR-05 | Authorisation and scope checks, Request Management | Overdue computed from status and due date rather than stored as a second status (CR-003). Counts and drill-down lists use the same management category scope. Counts must survive anonymisation (CR-004). | Overdue is a computed flag, so nothing runs on a schedule to move records into an overdue state (CR-003). | ADR-003 |
| FR-011 | ASR-02, ASR-03 | History/Audit, Persistence boundary | Append-only event sequence carrying request reference, event kind, actor reference, time and the change. Append-only to ordinary users. Must tolerate a redacted actor and redacted free text without losing the event (CR-004). | ADR-006, `GET /api/v1/requests/:id/history`. | ADR-003 |
| FR-012 | ASR-05 | Request Management | Submission time must be orderable oldest first within the permitted scope. | ADR-006, the `sort` option on `GET /api/v1/requests`. | ADR-003 |
| NFR-001 | ASR-01 | Authorisation and scope checks, cross cutting | Authorisation evaluated on the server data-access paths before any query or change, not in the interface. Deny by default where no grant exists. Rows defined by the [permission matrix](../data/permission-matrix.md). | [ADR-005](../decisions/ADR-005-authorization-policy.md): one central AuthorizationPolicy built from small permission specifications, so role, action and scope rules stay testable on their own. | ADR-003 |
| NFR-002 | ASR-02 | Request Management, History/Audit, Persistence boundary | Exactly one event per successful audited action and none for a failed one. Request change and event commit atomically. A stale attempt is rejected as a conflict rather than overwriting (ADR-002). Ordinary users cannot edit or delete events; the CR-004 administrative route is the stated exception. | ADR-002 fixes the atomic business boundary. ADR-004 requires a valid transition to produce its event. | ADR-003 |
| NFR-003 | ASR-03 | Persistence boundary | Persistent store required. In-memory state alone is rejected by ADR-002. A restart check proves persistence, not recovery. | ADR-002 and ADR-006. The store sits behind the `RequestRepository` interface. | ADR-003: PostgreSQL 18.6 |
| NFR-004 | Interaction design, not an ASR | Presentation responsibility | None | Wireframes in `docs/design/wireframes`. DEC-016. | ADR-003, changed by CR-006: HTML, CSS and JavaScript |
| NFR-005 | ASR-05 | Request Management, Persistence boundary | The list, detail and management summary query shapes are the ones measured. Indexes follow the selected store and representative data. | ADR-006. `scripts/perf-nfr005.mjs` measures three calls. | ADR-003 |

## Evidence and control

The cells below describe `main` at commit `142f6b3` on 15 October 2026, plus the browser journeys in `app/e2e`. I ran the checks on that commit. 150 tests pass with 2 intentional skips, `npx tsc --noEmit` exits 0, `npm run lint` reports no warnings and `npm audit` reports 0 vulnerabilities. `npm run test:postgres` passes 31 tests with 1 intentional skip, and `npm run db:verify` passes, both against PostgreSQL 18.6. The CI run for the same commit passed.

Two sets of case ids appear in this matrix. The designs in the verification plan carry ids like T-FR-001-01. The cases written first carry ids like TC-API-05 in their test names, with the acceptance criterion in a second tag, and the acceptance criterion links the two. The data integration tests and the browser journeys carry the design id in their names, such as T-NFR-002-03 and T-E2E-01, so the link is direct.

| ID | Implementation evidence | Verification evidence | Change, risk and decision reference |
| --- | --- | --- | --- |
| FR-001 | `POST /api/v1/requests` in `src/api/app.ts`, checked in `src/application/request-application.ts`. Store: `submit` in `src/persistence/request-store.ts`. Page: `app/frontend/requester.html` with `js/requester.js`. | TC-API-05 and TC-API-06 in `test/api.test.ts` pass. TC-API-06 checks the title and description boundaries. The store cases in `test/request-store.test.ts` pass against real PostgreSQL SQL. T-E2E-01 sends one through the page. | CR-002, P-01, ADR-001, ADR-002 |
| FR-002 | `GET /api/v1/categories` and a category check on submit. Six seeded categories in `migrations/002_categories_and_work.sql`. Page: the category list on `requester.html`. | TC-API-07 passes. It sends a category outside the approved list straight to the server and expects a refusal. | CR-002, P-01, ADR-002 |
| FR-003 | `GET /api/v1/requests/mine`. Store: `ownList`. Page: the list on `requester.html`. | TC-API-10 passes. Each requester sees exactly their own requests, and one with none sees an empty list. T-E2E-01 checks the new status after a refresh. | CR-002, P-03, ADR-001, ADR-005, FEC-001 |
| FR-004 | `GET /api/v1/requests/:id/history` with requester events only. A requester sees "Staff" and "Assigned staff" in place of names (CR-009). Page: Updates on `requester.html`. | TC-API-26 passes, with an internal note hidden from the requester. The privacy case in `request-store.test.ts` keeps staff references out of a requester's feedback. T-E2E-01 checks that the requester sees the resolution and no private note. T-FR-011-03 passes. | CR-002, P-04, ADR-001 |
| FR-005 | `GET /api/v1/requests` for staff, scoped to the staff member's category grants. Store: `staffQueue`. Page: `staff.html` with `js/staff.js`. | TC-API-12 and TC-API-13 pass. Each staff member sees only the categories they hold. T-E2E-02 checks that a requester cannot open the staff page. | CR-002, P-03, ADR-005, FEC-001 |
| FR-006 | The `categoryId` and `status` filters on `GET /api/v1/requests`, applied in SQL in the store. Page: the filters on `staff.html`. | TC-API-14 passes. Filters return all and only the matching permitted requests and never widen access. | ASR-05, ADR-002 |
| FR-007 | `POST /api/v1/requests/:id/assign`. The assignee must be staff with a grant for the request's category. `GET /api/v1/staff` lists who can take a request. Page: take it or assign it on `staff.html`. | TC-API-16, TC-API-17 and TC-API-18 pass. TC-API-17 is a decision table of who may be assigned. T-NFR-002-03 checks a stale assignment. T-E2E-01 takes a request in the browser. | CR-002, P-03, ADR-001, ADR-004 |
| FR-008 | `PATCH /api/v1/requests/:id/status` through `request-status-policy.ts`, `request-service.ts` and `request-application.ts`. Page: change status on `staff.html`. | TC-API-19 to TC-API-24 pass, with the 9 transition cases in `request-status-policy.test.ts` and the 3 cases in `request-service.test.ts`. TC-API-21 is a decision table that includes a body claiming an owner (CR-007). T-E2E-01 resolves a request in the browser. | CR-002, P-02, ADR-004, ADR-006, RSK-019 |
| FR-009 | `POST /api/v1/requests/:id/notes` and `PATCH /api/v1/requests/:id/due-date`. Store: `recordWork` and `setDueDate`. Page: the note and due date panels on `staff.html`. | TC-API-26, TC-API-27 and TC-API-28 pass. A note keeps its author and time, an empty note is refused and a due date keeps its change history. T-FR-009-02 sets, changes and clears a due date. | CR-002, CR-003, P-02, FEC-004 |
| FR-010 | `GET /api/v1/management/summary` and `GET /api/v1/management/requests`, built on the same scope and filters. Store: `managementSummary` and `managementList`. Page: `manager.html` with `js/manager.js`. | TC-API-29, TC-API-30 and TC-API-31 pass. Counts match the lists behind them and the exact due time is not overdue. T-E2E-02 checks in the browser that the counts match the lists. | CR-002, CR-003, CR-004, P-02, FEC-004 |
| FR-011 | One event in `request_events` for every change, with database triggers that reject any update or delete. `GET /api/v1/requests/:id/history`. Page: History on `staff.html`. | TC-API-19 passes. A request moves through its whole life and each step leaves exactly one event, in order. T-FR-011-03 passes: a requester sees no staff references. | CR-003, CR-004, ADR-002, FEC-002, RSK-006 |
| FR-012 | `sort=oldest` on `GET /api/v1/requests`, in the store query. Page: the Oldest first box on `staff.html`. | TC-API-15 passes. Oldest first puts the earliest first and returns the same records. | ASR-05 |
| NFR-001 | `src/authorization/authorization-policy.ts`, applied in `request-application.ts`. The caller comes from a server-side session (`src/auth/`, ADR-007) and category grants come from the server's user directory. The store also scopes every read in SQL. | 12 cases tagged AC-NFR-001 pass: TC-API-01 to TC-API-04, TC-API-08, TC-API-11, TC-API-13, TC-API-18, TC-API-23, TC-API-31, TC-API-32 and TC-UNIT-09. The 9 cases in `authorization-policy.test.ts` pass. T-E2E-02 repeats the requester and token cases through the pages. | CR-002, P-03, ADR-005, DEP-001, FEC-001, RSK-013 |
| NFR-002 | The store commits a request change and exactly one event together (`request-store.ts`, ADR-002). Database triggers reject any update or delete of history. | TC-API-19, TC-REPO-01 to TC-REPO-04, T-NFR-002-01 (notes), T-NFR-002-02 and T-NFR-002-03 pass. T-NFR-002-02 makes the database refuse the event and checks that the note, the work record and the version roll back, and it runs on PostgreSQL. The store cases check one event for each change and the triggers that block edits and deletes. `npm run db:verify` checks the same against PostgreSQL 18. | CR-004, ADR-002, ADR-004, FEC-002, RSK-016, RSK-022 |
| NFR-003 | Requests, events and work records live in PostgreSQL through `request-store.ts`. The server uses `PostgresRequestRepository` when `DATABASE_URL` is set (PR #41), and staging and production refuse to start without it. | T-NFR-003-01 passes on PostgreSQL 18.6. It builds the server, runs the migrations, saves a request with an owner, a note and a due date, restarts the server and reads it back. `persistence-lifecycle.test.ts` closes and reopens storage and compares the values and the history, and `npm run db:verify` reads a request back in a new process. | ADR-002, FEC-005, FEC-008, RSK-015, RSK-022 |
| NFR-004 | The pages in `app/frontend`, plain HTML, CSS and JavaScript (CR-006). Wireframes in `docs/design/wireframes`. | T-NFR-004-01 planned, not run. The five person check has not taken place. | CR-002, P-05, DEC-010, RSK-004, FEC-003 |
| NFR-005 | `scripts/perf-nfr005.mjs` (PR #40) measures the list, detail and summary calls. `scripts/seed-performance.ts` (PR #31) loads test data. | T-NFR-005-01 planned, not run. The script is built and has no result yet. | CR-002, P-05, DEC-010, RSK-004, FEC-003, FEC-007 |

## Acceptance check

This is my reading of each acceptance criterion against the executed cases, made on 15 October 2026 from the test names and bodies. Covered means every criterion of the requirement has at least one executed case that asserts it. Partly means some criteria have no case yet. Not run means nothing has been executed. Dewald or Liam can challenge any row, and a challenge moves the row.

| ID | Result | Executed cases | What is not covered |
| --- | --- | --- | --- |
| FR-001 | Covered | TC-API-05, TC-API-06, the store cases for blank input and a non-requester, and T-E2E-01 | |
| FR-002 | Partly | TC-API-07 refuses a category outside the list. TC-API-05 and both journeys save the category that was chosen | A case that saves one request in each of the six categories (T-FR-002-01) |
| FR-003 | Covered | TC-API-10, TC-REPO-09, and T-E2E-01, where the list shows the new status after a refresh | |
| FR-004 | Covered | TC-API-19, TC-API-20, TC-API-22, TC-API-26, the store case for rejection and resolution feedback, T-FR-011-03 and T-E2E-01 | |
| FR-005 | Covered | TC-API-12, TC-API-13, TC-REPO-07 and T-E2E-02 | |
| FR-006 | Covered | TC-API-14 and the store case for hostile filter values | |
| FR-007 | Covered | TC-API-16, TC-API-17, TC-API-18, T-NFR-002-03 and T-E2E-01 | |
| FR-008 | Covered | TC-API-19 to TC-API-24, the 9 transition cases, the store cases and T-E2E-01 | |
| FR-009 | Covered | TC-API-26, TC-API-27, TC-API-28, T-FR-009-02 and the store cases | |
| FR-010 | Covered | TC-API-29, TC-API-30, TC-API-31, the store case for counts and lists, and T-E2E-02 | |
| FR-011 | Covered | TC-API-16, TC-API-19, T-FR-011-03 and the store case for chronological history | |
| FR-012 | Covered | TC-API-15, TC-REPO-08 and the store case for scope before filters and order | |
| NFR-001 | Covered against the proposed matrix | All six cases in the [permission matrix](../data/permission-matrix.md): TC-API-10 and TC-API-11 (own and other requester), TC-API-12 and TC-API-13 (staff scope), TC-API-17 (ineligible assignee), TC-API-31 (management scope), the store case that blocks edits and deletes of events, and the store cases for a missing or revoked grant. T-E2E-02 repeats the requester and token cases through the pages | P-03 is approved in principle only (CR-002), so the result is against a proposed matrix. Grants cannot change while the server runs (TD-009) |
| NFR-002 | Covered | TC-API-19, TC-REPO-01 to TC-REPO-04, T-NFR-002-01, T-NFR-002-02 (a database-rejected event rolls back, run on PostgreSQL), T-NFR-002-03, the store rollback cases and the case that blocks event edits and deletes | |
| NFR-003 | Partly | T-NFR-003-01 builds the server, runs the migrations, saves a request with an owner, a note and a due date, restarts the server and reads it back, on PostgreSQL 18.6. The reopen case and `npm run db:verify` check the same at the store | One request goes through the restart, not requests in every status |
| NFR-004 | Not run | | The five person check |
| NFR-005 | Not run | | The measured load run |

Thirteen requirements are Covered, two are Partly and two are Not run.

## Verification plan

Each requirement lists the [test cases](../testing/test-cases.md) designed for it. A case reads Designed until it has run. The evidence column stays empty until a run exists, and a case moves to Passed or Failed only with a link to that run.

| ID | Test cases | Level mix | Case status | Evidence |
| --- | --- | --- | --- | --- |
| FR-001 | T-FR-001-01 to T-FR-001-04 | Black-box, API | Designed | TC-API-05 and TC-API-06 pass on `main` at `142f6b3` |
| FR-002 | T-FR-002-01, T-FR-002-02 | API | Designed | TC-API-07 passes on `main` at `142f6b3` |
| FR-003 | T-FR-003-01 to T-FR-003-04 | API, Black-box, E2E | Designed | TC-API-10 passes on `main` at `142f6b3` |
| FR-004 | T-FR-004-01 to T-FR-004-03 | Black-box | Designed | TC-API-26 passes on `main` at `142f6b3` |
| FR-005 | T-FR-005-01, T-FR-005-02 | API | Designed | TC-API-12 and TC-API-13 pass on `main` at `142f6b3` |
| FR-006 | T-FR-006-01, T-FR-006-02 | Black-box, API | Designed | TC-API-14 passes on `main` at `142f6b3` |
| FR-007 | T-FR-007-01 to T-FR-007-03 | API | Designed | TC-API-16 to TC-API-18 pass on `main` at `142f6b3` |
| FR-008 | T-FR-008-01 to T-FR-008-05 | Unit, API, Black-box | Designed | TC-API-19 to TC-API-24, 9 policy cases and 3 service cases pass on `main` at `142f6b3` |
| FR-009 | T-FR-009-01 to T-FR-009-03 | API | Designed, T-FR-009-02 passed | TC-API-26 to TC-API-28 pass on `main` at `142f6b3` |
| FR-010 | T-FR-010-01 to T-FR-010-04 | Black-box, API | Designed | TC-API-29 to TC-API-31 pass on `main` at `142f6b3` |
| FR-011 | T-FR-011-01 to T-FR-011-03 | API | Designed, T-FR-011-03 passed | TC-API-19 passes on `main` at `142f6b3` |
| FR-012 | T-FR-012-01, T-FR-012-02 | Unit, Black-box | Designed | TC-API-15 passes on `main` at `142f6b3` |
| NFR-001 | T-NFR-001-01 to T-NFR-001-03 | API, Unit | Designed | 12 tagged cases and 9 policy cases pass on `main` at `142f6b3` |
| NFR-002 | T-NFR-002-01 to T-NFR-002-04 | API | Designed, T-NFR-002-01 (notes), T-NFR-002-02 and T-NFR-002-03 passed | TC-API-19 and the store cases pass on `main` at `142f6b3` |
| NFR-003 | T-NFR-003-01 | API | Designed, T-NFR-003-01 passed for one request | T-NFR-003-01 passes on PostgreSQL 18.6 and the reopen check passes, both on `main` at `142f6b3` |
| NFR-004 | T-NFR-004-01 | Manual | Designed | None yet |
| NFR-005 | T-NFR-005-01 | Performance | Designed | None yet |
| Journeys | T-E2E-01, T-E2E-02 | E2E | Passed | T-E2E-01 and T-E2E-02 pass in memory and on PostgreSQL 18.6, run by me on 15 October 2026. GitHub ran both modes on pull request #43 at commit `13c3206` and both passed, in [run 38784039455](https://github.com/DewaldAllers/SEN381-CivicConnect/actions/runs/38784039455). The tests are in [the journeys](../../app/e2e/tests/journeys.spec.js) and `app/e2e/README.md` says how to rerun them |

## The end to end trace

SRC-M2 section 9 (p. 9) asks for one meaningful path from requirement through to initial verification. FR-008 is the one that now runs the whole way.

Source. Staff have difficulty prioritising requests, identifying ownership and coordinating work, and there is weak accountability for changes to request status and actions taken (SRC-MASTER, section 2, p. 6).

Need. NEED-P2-02, staff want to find relevant work, establish responsibility and record controlled progress.

Requirement. FR-008, authorised staff may change a request status only through the agreed transitions and with the information each transition requires.

Constraint and quality driver. ASR-04 controlled workflow, and ASR-02 attributable history. A status change without its event is an incorrect outcome, not a delayed report.

Architecture responsibility. Request Management owns the current request state and validates the transition. History/Audit owns the event. ADR-001 places both inside one modular application server so the change and its event can share a local commit boundary.

Data decision. ADR-002 requires the request change and exactly one matching event to commit together, and a stale attempt to be rejected as a conflict rather than overwriting the persisted state.

Design decision. ADR-004 chose a central RequestStatusPolicy holding the transition table, over controller-level checks and over a full State pattern. P-02 has a small, explicit set of transitions, so the State pattern would buy flexibility the project has no use for and charge for it in classes. The cost recorded is that the policy becomes a business-rule component that has to be maintained whenever the lifecycle changes.

Technology decision. ADR-003, Node.js 22.14.0, Express 5.2.1, TypeScript 7.0.2 and Vitest 5.0.2, with PostgreSQL 18.6 proposed for the store.

Interface decision. ADR-006, `PATCH /api/v1/requests/:id/status`, documented in the [API contract](../integration/api-v1.md) with all five error responses.

Application artefact. `request-status.ts` holds the six statuses. `request-status-policy.ts` holds the transition table, including Rejected and Closed as terminal and the information each conditional move requires. `request-service.ts` applies authorisation and then the transition. `app/backend/src/api/app.ts` exposes the endpoint. `src/application/request-application.ts` reads the owner from the stored request, and `src/auth/` takes the caller from a session.

Verification. On `main` at `142f6b3`, 150 tests pass. For FR-008 they are the 9 transition cases, the 3 service cases and TC-API-19 to TC-API-24 through sign in and the endpoint. They include a 409 on an invalid transition, a refused rejection without a reason and a refused move to In Progress with no owner, even when the body claims one (CR-007). T-E2E-01 then takes a request from sent to resolved in the browser. `npx tsc --noEmit` passes. The checks run on every push and pull request through `.github/workflows/ci.yml` and `.github/workflows/e2e.yml`.

What is still missing. Nothing for FR-008 itself. The database store sits behind the server since PR #41, T-E2E-01 resolves a request in the browser, and the acceptance check counts FR-008 as Covered.

## The trace that still stops short

FR-003 and NFR-003 both stopped short earlier in M3, and both now run the whole way. FR-003 runs from the visibility problem in the scenario, through NEED-P2-01 and ASR-01 scoped access, to the requester scope rule in the permission matrix, to ADR-005, to `GET /api/v1/requests/mine`, to the requester page, and to TC-API-10 and T-E2E-01. NFR-003 runs from the need for records that survive a restart, through ASR-03 and ADR-002, to the PostgreSQL store, to T-NFR-003-01, which restarts the built server and reads the request back.

NFR-005 is the trace that stops short now. It runs from the need for pages that answer in good time, through NFR-005 and ASR-05, to the three query shapes in the store, to the load script in `scripts/perf-nfr005.mjs`. It stops there. The script is built and has no result, so there is nothing to compare against the proposed target. The target stays a proposal under DEC-010 until a result exists. NFR-004 stops in the same place, with the pages built and the five person check not yet run.

The earlier stops were joins between work done by different people, and the joins are done. This one is a measurement, and nobody can build a measurement, only run it.

If NFR-005 changed so that the target moved, the effects would reach AC-NFR-005, DEC-010, the load script's default and the release summary. That is a change request with an impact analysis, not an edit.

## Requirement dependencies

| Requirements | Scope and constraint connection | Risk and later consideration |
| --- | --- | --- |
| FR-001 to FR-004 | Requester submission and tracking. P-01 and P-04 approved under CR-002, and unapproved messaging integrations stay excluded. | Missing information or confusing feedback could lose requests or create duplicate submissions. Validation and testability matter here. |
| FR-005 to FR-009, NFR-001 | Authorised handling. The permission matrix and the P-02 transitions are the controls. | Excessive access or an invalid transition could expose sensitive information or show a misleading status. Trust boundaries and security testing follow from this group. |
| FR-010 | Oversight reporting. CR-003 settles the meaning of overdue and the clock it runs on. | An incorrect overdue rule misleads management. Consistent time handling, data quality and test fixtures follow from this. |
| FR-011, NFR-002, NFR-003 | A reliable, attributable service record, with a stated administrative exception under CR-004. | Lost or incomplete history undermines accountability. Persistence, atomic writes and recovery evidence follow from this. |
| FR-012, NFR-004, NFR-005 | Small team and low cost constraints. The quality targets are deferred under CR-002 and DEC-010 rather than approved. | Optional scope and unsupported load assumptions consume time. Usability, workload tests and later capacity and cost choices follow from this. |

## Keeping it current

A new requirement gets a new identifier with its source, need, priority and acceptance criterion, and a row in each of the three tables. A changed requirement keeps its identifier, records the change reference, and has its affected links and tests updated. Retired identifiers are not reused.

Before any baseline review, every requirement has an acceptance criterion, no criterion is orphaned, and no cell claims evidence that does not exist. A cell that reads Not yet implemented is a controlled statement. A cell that reads as done without a link behind it is a defect.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 2 to 3 (scenario and capabilities, pp. 6-7), 11 and 11.1 (requirements, traceability and expected final traceability, p. 12).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 4.2 (required RTM progression, pp. 3-4), 9 (required traceability demonstration, p. 9).

Full source records are in the [source register](../sources.md). The version 1.0 shape of this matrix is preserved in the repository history at commit `c0be056`, and version 2.0 at commit `76483f3`.
