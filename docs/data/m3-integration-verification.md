# M3 data/API integration verification

Date: 15 October 2026 | Contribution: Dewald Allers | Branch: `m3-data-integration-final` | Base: PR #41 at `b04db029549980a3bec3842ce00ff5e931287e59`

## Corrections and evidence boundary

Raw authenticated HTTP tests reproduced ignored browser versions, unversioned note writes, rejected due-date clearing and misleading masked requester ownership/history on the integration branch. The corrections enforce the existing frontend/data version handoff, reuse the atomic work-record path and preserve privacy while retaining the staff audit record. They also fix compiled migration lookup and prevent staging/production silently using memory without a database URL.

The API lifecycle guards match the existing data-store restrictions. Team review must reconcile these restrictions and the now-mandatory version field with the API/change-control baseline. This file does not approve a scope change or replace Tristan's controlled records.

## Executed checks

- `npm run lint` and `npm run typecheck`: passed locally.
- `npm test`: **150 passed, 2 intentionally skipped**, with source-only discovery after compilation. The skips are the compiled-server restart (requires a real database environment) and SQL fault injection on the memory adapter. The memory regression also proves that newly generated request/event references do not collide with seeded numeric references.
- `npm run test:postgres`: **31 passed, 1 intentionally skipped**, three test files; executed against the team's hosted PostgreSQL development database. The skipped case is SQL fault injection on the memory adapter, which cannot reject a SQL constraint.
- The real-database command executes the nine repository contract cases, authenticated HTTP integrity cases, and a compiled migration/server-restart case. All use randomly named temporary schemas which are removed afterwards; shared application tables are not cleared or bulk-seeded.
- The restart case compiles and executes the migration runner and server, creates/assigns/accepts a request, saves a private note and due date, then restarts the server. Request/version/history remain equal after a fresh login; the old in-memory session no longer works and the private note remains absent from requester feedback.
- SQL fault injection makes the database reject the event insert through HTTP. The response is a generic 500 and request version, work records and history remain unchanged. Ordinary stale writes return 409 with `code: "stale"` and no extra event.

The normal test suite uses embedded PostgreSQL for SQL tests unless explicitly configured otherwise; its compiled-server restart case needs `TEST_DATABASE_URL`. The Vitest configuration excludes emitted `dist/` test copies so compiling does not duplicate execution. The persistence workflow now runs the real-server integration command as well as the existing database verification.

## Traceability handoff

| Data outcome | Executable evidence |
| --- | --- |
| FR-002, NFR-002: valid persistence and one-event atomic changes | `request-store.test.ts`, `data-api.integration.test.ts`, `postgres-request-repository.test.ts` |
| FR-003/004/005/006/011/012: scoped lists, filtering, history and privacy | `request-repository.contract.ts`, `request-store.test.ts`, `data-api.integration.test.ts` |
| FR-009/010: work records, due dates and matching management views | `request-store.test.ts`, `persistence-lifecycle.test.ts`, `data-api.integration.test.ts` |
| NFR-003: request/work/history survives restart | `server-restart.integration.test.ts`, `scripts/verify-postgres.ts` |

These files supply data evidence for Tristan to link to the RTM/PED and review against the acceptance criteria; passing a subset is not whole-requirement or release approval.

## Remaining team/release work

PR integration and two legitimate approvals are still required. Liam owns deployed staging, the measured performance run and making CI a required branch-protection check. Tristan owns browser E2E/usability execution, the updated RTM/PED/registers, readiness review and release tag. None is claimed complete by these data tests.

The free shared Render development database expires on **13 November 2026**. Its connection credentials belong in private environment configuration, not this file or a PR. No paid resource was created for this verification.
