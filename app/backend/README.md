# CivicConnect Backend

## Purpose

This directory contains the initial CivicConnect backend implementation developed for Milestone 2.

The current implementation demonstrates a controlled vertical slice for request status management, authorization and the initial REST API boundary.

## Current Status

Implemented in the current M2 vertical slice:

- Request status definitions
- Controlled request status transitions
- Authorization policy
- Application service for request status changes
- Initial REST API endpoint
- Automated unit and API tests
- TypeScript type checking

The current implementation is not the complete CivicConnect application.

## Milestone 3 data and query layer

The `m3-dewald-persistence` branch implements Dewald's expanded data contribution:

- Versioned PostgreSQL migrations define requests, categories, work records and history, with foreign keys, indexes and append-only history triggers. Migration 002 seeds the six development categories used by Tristan's frontend. These values remain a P-01 proposal for team review; field-length limits are still Liam's input-validation handoff.
- Submission, ownership, status, notes/actions/resolution and due-date changes commit with exactly one corresponding event. Failed writes roll back; an expected-version check rejects competing stale changes. Status transitions use the stored owner and actual rejection/resolution text.
- Scoped queries provide own lists, staff queues, category/status filters, oldest-first ordering, detail, chronological history, requester-visible feedback, management counts and matching lists. Empty category grants give no access.
- 23 repository/lifecycle/seed cases plus 23 existing M2 tests cover rollback, denied scope, private notes, reporting boundaries, restart storage and seed repeatability.
- `npm run lint` checks executable code with ESLint; `npm run typecheck` checks types and unused declarations. The Babel syntax parser preserves TypeScript 7 because the current typescript-eslint peer range does not support it. This configuration does not claim TypeScript-aware ESLint rules.
- A separate persistence workflow runs ESLint, type checking and the real PostgreSQL check. Liam still owns the shared CI quality gate and required-status-check configuration.

The existing HTTP endpoint still uses the M2 in-memory map and fixed Staff context. Liam must connect the endpoints to `RequestStore` and construct its `Principal` from authenticated identity and stored category grants. Repository results do not prove that HTTP authentication or staging is complete. See the [integration handoff](../../docs/data/m3-repository-handoff.md).

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
