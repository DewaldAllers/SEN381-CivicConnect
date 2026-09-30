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

Use Alternative A as the proposed M2 technology baseline, with the following
verified versions for the backend implementation currently developed:

- Node.js 22.14.0
- TypeScript 7.0.2
- Express 5.2.1
- Vitest 5.0.2
- Supertest 7.3.0

The following technologies remain part of the proposed overall stack but are
not yet implemented in the current backend vertical slice:

- React — planned frontend technology
- Vite — planned frontend build tooling
- PostgreSQL — planned persistent data store

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

Render is a candidate staging platform because its free offering covers both static sites and web services, which suits a separately deployed frontend and API. Its free tier stops idle services and gives no availability commitment, so the production platform stays a controlled later decision (Render, n.d.).

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

## References

Render (n.d.) *Free instance types*. Available at: https://render.com/docs/free (Accessed: 30 September 2026).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 4 (project constraints, p. 8), 17 (environments, deployment and operations, pp. 14-15), 18 and 18.1 (cost, schedule and technology selection, pp. 15-16), 25 (student disclaimer, p. 23).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2*. Cited as `SRC-M2`. Sections used: 5.5 (technology-stack decision, p. 5), 5.8 (deployment compatibility, p. 6).

Full source records are in the [source register](../sources.md).
