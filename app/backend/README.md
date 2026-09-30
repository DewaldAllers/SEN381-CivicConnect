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