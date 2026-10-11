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

## Milestone 3 persistence branch (in progress)

The `m3-dewald-persistence` branch adds the first PostgreSQL persistence boundary:

- `migrations/001_requests_and_events.sql` defines linked request and append-only-by-API event records, with status/reference constraints and query indexes.
- `RequestStore.submit` and `RequestStore.changeStatus` write the request and its one corresponding event in the same database transaction. A rejected operation or event-write failure rolls the whole operation back; a version check rejects stale changes.
- Eight additional tests run the migration and repository SQL in embedded PostgreSQL (PGlite), including duplicate, denied, invalid, stale and injected-failure cases. `npm run typecheck` is the static type check.

This is an **internal implementation hand-off**, not a completed NFR-001/002/003 claim. The existing HTTP endpoint still uses the M2 in-memory map and fixed Staff context. Liam's API/identity work must pass a real authenticated actor and approved data scope into the persistence boundary, then expose authorised reads. The migration and transaction also need an integration run against the team's actual PostgreSQL service; embedded test success does not prove staging connection, controlled-restart persistence or backup/restore.

### PostgreSQL setup for integration

Set `DATABASE_URL` in the environment (see `.env.example`; never commit credentials), then run:

```text
npm ci
npm run db:migrate
npm run typecheck
npm test
```

The migration runner records version `001_requests_and_events` and skips it on subsequent runs. It does not insert demo requests. Until identity and category grants are wired, do not expose `RequestStore.history` as an unauthorised HTTP read or treat a caller-supplied `withinApprovedScope` value as a trusted permission check.

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
