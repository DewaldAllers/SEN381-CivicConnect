# CivicConnect Backend

## Purpose

This directory contains the CivicConnect backend developed from the Milestone 2 slice into Milestone 3.

It provides authenticated request APIs backed by PostgreSQL when `DATABASE_URL` is configured. Users, grants and sessions remain seeded/in-memory configuration under ADR-007.

## Current Status

Implemented across the M2 slice and M3 integration:

- Request status definitions
- Controlled request status transitions
- Authorization policy
- Application service for request status changes
- Initial REST API endpoint
- Authenticated submission, scoped queries, assignment, work notes, due dates and management APIs
- PostgreSQL repository adapter and versioned atomic request/history writes
- Automated unit and API tests
- TypeScript type checking

The current implementation is not the complete CivicConnect application.

## Milestone 3 data and query layer

Dewald's expanded data contribution, including the integration corrections on `m3-data-integration-final`:

- Versioned PostgreSQL migrations define requests, categories, work records and history, with foreign keys, indexes and append-only history triggers. Migration 002 seeds the six development categories used by Tristan's frontend. These values remain a P-01 proposal for team review; field-length limits are still Liam's input-validation handoff.
- Submission, ownership, status, notes/actions/resolution and due-date changes commit with exactly one corresponding event. Failed writes roll back; an expected-version check rejects competing stale changes. Status transitions use the stored owner and actual rejection/resolution text.
- Scoped queries provide own lists, staff queues, category/status filters, oldest-first ordering, detail, chronological history, requester-visible feedback, management counts and matching lists. Empty category grants give no access.
- Repository, lifecycle, seed and authenticated API cases cover rollback, denied scope, private notes/staff references, reporting boundaries, restart storage and seed repeatability. See the dated [integration evidence](../../docs/data/m3-integration-verification.md) for executed results.
- `npm run lint` checks executable code with ESLint; `npm run typecheck` checks types and unused declarations. The Babel syntax parser preserves TypeScript 7 because the current typescript-eslint peer range does not support it. This configuration does not claim TypeScript-aware ESLint rules.
- A separate persistence workflow runs ESLint, type checking and the real PostgreSQL check. Liam still owns the shared CI quality gate and required-status-check configuration.

Liam's integration connects the authenticated HTTP boundary to `PostgresRequestRepository`. Every assignment, status, note and due-date write requires the browser's `expectedVersion`; stale writes return 409 with `code: "stale"`. Staging/production refuses to start without `DATABASE_URL`; local development can still use the in-memory repository. Run migrations before starting the server. This does not by itself prove deployed staging or browser journeys. See the [integration handoff](../../docs/data/m3-repository-handoff.md).

### PostgreSQL setup for integration

Set `DATABASE_URL` in the environment (see `.env.example`; never commit credentials), then run:

```text
npm ci
npm run db:migrate
npm run lint
npm run typecheck
npm test
```

The migration runner records versions 001 and 002, serialises concurrent runners and skips applied versions. It seeds categories but no requests/users/grants. An existing request with an unknown category makes migration 002 fail atomically; review and explicitly map such development data before retrying. `.env` files are examples of local configuration only: these commands read process environment variables and do not automatically load `.env`.

For a development/test PostgreSQL database, set `TEST_DATABASE_URL` and run `npm run db:verify`. It creates one randomly named schema, checks both versioned migrations, atomic writes, database-rejected event rollback, scoped reads, concurrent updates and management summaries. A fresh Node process verifies persisted request/owner/due-date/work/history after the original connection pool closes. The command removes only its temporary schema and needs permission to create/drop schemas. It does not verify staging, backup/restore or HTTP authentication.

With the same test environment, `npm run test:postgres` compiles the backend and runs the repository contract, authenticated HTTP integrity checks and a compiled-server restart check against PostgreSQL. It uses fresh temporary schemas, never clears the shared application's public tables, and requires schema-create/drop permission. Without `TEST_DATABASE_URL`, `npm test` uses embedded PostgreSQL for SQL cases and skips the real-server restart case. Vitest discovers only source tests, not the copies emitted into `dist/`.

The team's free Render development database expires on **13 November 2026**. Share connection credentials privately as environment configuration, not in this repository. Use a TLS-verifying connection URL for external access; the server does not disable certificate verification.

### Performance fixtures

Set `TEST_DATABASE_URL` to a disposable development/test database and run `npm run db:seed:perf`. The default is 10,000 synthetic requests across six categories and all six statuses, with lifecycle events and resolution work records. Set `PERF_REQUESTER_REFS` and `PERF_STAFF_REF` to identities Liam actually seeds before API load testing. `PERF_REFERENCE_TIME` fixes the fixture clock, `PERF_REQUEST_COUNT` changes volume, and `PERF_NAMESPACE` changes its ID prefix. Reusing a namespace fails atomically; existing records are never replaced. This prepares data; Liam's performance run supplies measured results.

## Technology

### Runtime

- Node.js `22.14.0`
- npm `10.9.2`

### Dependencies

- Express `5.2.1`
- TypeScript `7.0.2`
- Vitest `5.0.2`
- Supertest `7.3.0`
- TSX `4.23.15`

### Development Type Definitions

- `@types/express` `5.0.6`
- `@types/node` `26.6.3`
- `@types/supertest` `7.2.1`

Exact dependency versions are also recorded in `package.json` and `package-lock.json`.

## Project Structure

```text
backend/
├── src/
│   ├── api/
│   │   └── app.ts
│   ├── application/
│   │   └── request-service.ts
│   ├── authorization/
│   │   └── authorization-policy.ts
│   ├── domain/
│   │   ├── request-status.ts
│   │   └── request-status-policy.ts
│   └── server.ts
│
├── test/
│   ├── api.test.ts
│   ├── authorization-policy.test.ts
│   ├── request-service.test.ts
│   └── request-status-policy.test.ts
│
├── package.json
├── package-lock.json
└── tsconfig.json
