# ADR-003: Technology Stack and Deployment

## Status

Proposed for M2 baseline — pending team approval.

## Context

CivicConnect has reached the M2 stage where its technology and deployment direction must be sufficiently stable to support controlled development.

The technology decision must support the requirements, ASRs, approved architecture and data direction.

## Problem

The team needs a technology stack that is maintainable, secure, testable and practical for the current project scope without introducing unnecessary complexity.

## Alternatives Considered

### Alternative A

React + TypeScript + Vite
+
Node.js + Express + TypeScript
+
PostgreSQL

### Alternative B

Angular + ASP.NET Core + SQL Server

### Alternative C

React + Spring Boot + PostgreSQL

## Decision

Use Alternative A as the proposed M2 technology baseline:

- React 19.3.0
- TypeScript 6.0.x
- Vite 8.3.x
- Node.js 24.21.0 LTS
- Express 5.2.1
- PostgreSQL 18.6
- Vitest 5.0.x

## Rationale

The selected stack provides a consistent TypeScript development environment across the frontend and backend.

It also provides a relatively small technology footprint for the current CivicConnect scope while supporting API development, automated testing and maintainable separation of responsibilities.

Node.js 24.21.0 is selected from the LTS line rather than the newer Current line to reduce the risk of adopting a less established runtime baseline.

## Team Capability

The technology must be proven in the actual development environment before final approval.

A small proof of concept will be used to confirm that the frontend, backend and required development tooling work on the team's machines.

## Security

The technology baseline requires:

- Server-side validation
- Authentication
- Server-side authorization
- HTTPS/TLS
- Environment-based configuration
- Dependency/security checks
- No committed credentials or secrets

## Dependencies and Version Control

Versions will be pinned through package manifests and lock files.

Dependency updates must be reviewed rather than silently introducing version changes.

## Cost and Licensing

The selected core technologies are open-source.

The exact licenses of installed dependencies will be verified before baseline approval.

## Deployment Direction

The proposed deployment direction is:

User
→ React frontend
→ HTTPS
→ Node.js/Express API
→ PostgreSQL

The frontend and backend may be deployed as separate services while PostgreSQL is provided by a managed database service.

A specific production platform is intentionally not fixed at M2.

Render is a candidate staging platform because it supports static sites and web services on its free offering, but its free-tier operational limitations mean that the exact production platform should remain a controlled future decision. :contentReference[oaicite:10]{index=10}

## Configuration and Secrets

Environment-specific settings must be supplied through environment variables.

Secrets must not be committed to source control.

An `.env.example` file may document required variable names without containing secret values.

## Deployment Risks

- Provider limitations
- Database availability
- Configuration errors
- Networking/security configuration
- Free-tier limitations
- Future scaling requirements

## Deferred Decisions

The following remain open:

- Final production hosting provider
- Final scaling configuration
- Full production observability
- Final backup/recovery operational procedure

## Trade-Off

The selected technology direction keeps the system relatively simple and maintainable.

The trade-off is that the team remains responsible for dependency management, security configuration and disciplined version control.

## Evidence

- Technology selection analysis
- Architecture ADR
- Data/persistence ADR
- M2 requirements and ASR evidence
- Proof-of-concept results
- Relevant A2 research
