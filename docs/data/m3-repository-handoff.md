# M3 repository handoff

Owner: Dewald Allers | Original implementation: [PR #31](https://github.com/DewaldAllers/SEN381-CivicConnect/pull/31) | Integration corrections: `m3-data-integration-final`, based on [PR #41](https://github.com/DewaldAllers/SEN381-CivicConnect/pull/41)

This implements Dewald's revised data/query allocation. Liam owns identity, endpoints, API tests, staging and the required CI gate. Tristan owns frontend and release evidence.

## Liam's integration boundary

Create one `RequestStore(new PostgresDatabase(pool))` for the application. Run `npm run db:migrate` before serving traffic. Construct `Principal { id, role, categoryRefs }` from the authenticated session and real stored category grants. Never copy a principal, requester ID, assignee grants or permission flag from a submitted JSON body. Requester submission is attributed to `principal.id`.

Runtime permission correction (15 October): use a separate `DATABASE_ADMIN_URL` for migrations, then the restricted `civicconnect_runtime` connection as the server's `DATABASE_URL`. Migration 003 preserves the active-category lock without category UPDATE rights. Apply the owner's explicit grants and run `npm run db:verify:runtime`; see [CI/runtime evidence](../../evidence/m3-ci-runtime-permissions.md). The restricted URL cannot run the schema-creating test commands, which need a privileged disposable `TEST_DATABASE_URL`.

| Client/API operation | Repository call |
| --- | --- |
| Category choices | `categories()` (active categories) |
| Submit request | `submit(principal, { categoryRef, title, description })` |
| Own list | `ownList(principal)` |
| Staff queue/filter/oldest first | `staffQueue(principal, { categoryRef, status, sort: 'oldest' })` |
| Detail | `get(principal, id)`; out-of-scope and missing both return null |
| History/feedback | `history(principal, id)`; requester reads only visible events. `feedback` is a requester-only alias |
| Assign | `assign(principal, { requestId, expectedVersion, assignee })`; load assignee and category grants from the identity store |
| Status | `changeStatus(principal, { requestId, expectedVersion, to, reason, resolution })` |
| Notes/actions | `recordWork(principal, { requestId, expectedVersion, text, kind, visibleToRequester })` |
| Due date | `setDueDate(principal, { requestId, expectedVersion, dueAt })`; use Date or null to clear |
| Management summary | `managementSummary(principal, filters, referenceTime)` |
| Matching management list | `managementList(principal, bucket, filters, referenceTime)` |

Staff and management reads use their granted category set in SQL; empty grants return nothing. All mutations require Staff role and category scope. Assignment additionally checks the target's Staff role and category grant. The endpoint must authenticate the trusted principals. A category grant revoked since a session was created must be reflected when constructing that principal.

All mutations need the version the caller observed. Include `version` in detail responses and send it as `expectedVersion` for changes, so a stale browser cannot silently overwrite another change. `StaleRequestError` maps to 409 with `code: "stale"`; `RequestNotFoundError` maps to 404 for missing/out-of-scope records. The real frontend adapter already sends the observed version, and the integration corrections enforce it for all four mutation endpoints. Missing/invalid versions return 400. Do not automatically retry stale writes.

## Mapping to Tristan's proposed client

Map `categoryId` to `categoryRef`, `rejectionReason` to `reason`, `resolutionInformation` to `resolution`, `dueDate` to `dueAt`, and `assigneeId` to the trusted assignee lookup. For staff/management, map repository `responsibleRef` back to `ownerId` and resolve the name through Liam's identity store. For requester responses, use `hasOwner` to show the generic `ownerName` "Assigned staff" or null; a masked owner ID must not make the page falsely say "Nobody yet". Expose the version. `submittedAt` is provided; Date values serialize to ISO strings. `categoryName` is returned from the category join.

For history, map `occurredAt` to `at`. Staff/management views retain `actorRef` for a trusted name lookup; requester views return null for staff actors and the adapter displays "Staff". Requester ownership feedback returns `{ ownershipChanged: true }` instead of staff identifiers, displayed as "Responsibility updated.", and requester detail/list responses mask `responsibleRef`. The stored audit record and staff/management views retain the original actor and old/new owner references. Rejection/resolution text is stored in the status event. Private notes are excluded by SQL before a requester response, so no browser-side privacy filter is needed. The authenticated HTTP case now checks T-FR-011-03 against both adapters.

## Data rules and reviewable proposals

- The six seeded categories match Tristan's mock (`c-facilities`, `c-it`, `c-security`, `c-maintenance`, `c-lost`, `c-other`). Their names are proposed development values, not stakeholder-approved facts. An inactive/unknown category rejects submission. P-01 field-length limits still need one shared API/client rule; the repository currently requires nonblank fields.
- `expectedVersion` increments for every successful ownership/status/work/due-date operation. Each operation writes exactly one history event, even when resolution also creates a work record. Failures roll back every write.
- In Progress requires a persisted owner. Rejected/Resolved transitions require real reason/resolution text. Notes/actions may be recorded before closure/rejection; ownership stops at Resolved/Closed/Rejected. Due dates may be set/cleared in Accepted/In Progress. These implementation rules are visible for team review.
- Open means Submitted/Accepted/In Progress. Overdue means Accepted/In Progress with `dueAt < referenceTime`; equality is not overdue. Missing dates are counted separately. Counts and lists use the same predicates, scope and filters; use the same reference time when comparing them.
- History and work records expose no edit/delete method; database triggers reject UPDATE/DELETE. Database administrators retain control of schema/privileges. A future approved redaction route requires an explicit migration and decision.
- Results currently return complete scoped lists. Measure with the performance fixture before making a volume claim; future pagination needs a coordinated client/API contract.

## Verification and evidence

The 24 repository/lifecycle/seed cases cover FR-002 through FR-006, FR-009 through FR-012 and the data outcomes of NFR-002/003. The existing 23 M2 cases remain. Tests execute real PostgreSQL SQL in PGlite; one disk-backed case closes/reopens storage and compares values/history.

`npm run db:verify` separately runs on a PostgreSQL 18 GitHub service, checks migration repeatability, genuine SQL-rejected event rollback, scoped queries, competing updates, report/list consistency and a fresh-process persistence read. The run prints the actual server version. The [persistence workflow](../../.github/workflows/persistence-checks.yml) runs lint/type checks and that command. The shared backend workflow still runs the full unit/component/API suite. Successful workflow runs are evidence; the workflow file alone is not a result.

ESLint checks executable logic with the Babel TypeScript syntax parser because typescript-eslint currently excludes TypeScript 7 from its supported peer range. TypeScript checks names, types and unused declarations. Sources: [ESLint configuration](https://eslint.org/docs/latest/use/configure/configuration-files), [Babel parser](https://babeljs.io/docs/babel-eslint-parser/), [typescript-eslint shared configs](https://typescript-eslint.io/users/configs/).

`npm run db:seed:perf` prepares configurable synthetic load data; it does not make a performance claim. The default 10,000 rows and 10 synthetic requester references are a repeatable test fixture, not an estimate of municipal demand. Liam should substitute his seeded identities, record environment/volume/clock, then measure the real endpoints. No real people or measured results are invented.

The [15 October integration verification](m3-integration-verification.md) adds real authenticated HTTP and compiled-server restart evidence. Remaining release verification includes browser E2E/usability journeys, a required CI gate, deployed staging and Liam's measured performance run. Tristan can link the executed data cases into the RTM/PED without marking those remaining checks complete.
