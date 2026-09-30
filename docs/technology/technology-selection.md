# CivicConnect Technology Selection

## 1. Purpose

This document records the technology selection analysis for CivicConnect M2.

The selection is evaluated against the CivicConnect requirements, ASRs, team capability, maintainability, security, testing, dependency risk, cost and deployment compatibility.

## 2. Proposed Technology Baseline

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 19.3.0 |
| Frontend language | TypeScript | 6.0.x |
| Frontend tooling | Vite | 8.3.x |
| Backend runtime | Node.js | 24.21.0 LTS |
| Backend framework | Express | 5.2.1 |
| Backend language | TypeScript | 6.0.x |
| Database | PostgreSQL | 18.6 |
| Testing | Vitest | 5.0.x |
| API | REST-style HTTP | Versioned boundary |

## 3. Decision Drivers

The technology selection considers:

- Requirement and ASR fit
- Maintainability
- Security
- Testability
- Team capability
- Learning overhead
- Dependency maturity
- Development and operational cost
- Deployment compatibility
- Version compatibility
- Lock-in risk

## 4. Alternatives

### Alternative A

React + TypeScript + Vite + Node.js + Express + PostgreSQL.

### Alternative B

Angular + ASP.NET Core + SQL Server.

### Alternative C

React + Spring Boot + PostgreSQL.

## 5. Comparison

### Alternative A

Advantages:
- Consistent TypeScript ecosystem
- Suitable REST tooling
- Straightforward testing
- Small technology footprint
- Proportionate to current CivicConnect scope

Trade-offs:
- Dependency and package security must be managed
- TypeScript requires a build/type-checking stage

### Alternative B

Advantages:
- Mature enterprise tooling
- Strong Microsoft ecosystem
- Strong typing

Trade-offs:
- Separate frontend/backend languages
- Larger technology footprint
- Additional team learning overhead

### Alternative C

Advantages:
- Mature backend ecosystem
- Strong typing
- PostgreSQL compatibility

Trade-offs:
- Introduces Java as a separate backend ecosystem
- Larger technology footprint
- Additional learning and maintenance overhead

## 6. Proposed Selection

The proposed selection is Alternative A:

React + TypeScript + Vite
+
Node.js + Express + TypeScript
+
PostgreSQL

The selection is based on project-specific requirements and constraints rather than personal preference.

## 7. Security

Security responsibilities include:

- Server-side validation
- Authentication
- Server-side authorization
- HTTPS/TLS
- Secure environment configuration
- Dependency/security checking
- No committed credentials or secrets

## 8. Maintainability

The stack supports separation between presentation, backend application responsibilities and persistence.

The final module boundaries remain governed by the approved architecture decision.

## 9. Dependencies and Versions

The actual dependency versions used by the implementation must be recorded in package manifests and lock files.

The implementation must use reproducible dependency installation.

## 10. Licensing and Cost

The selected core technologies are open-source technologies and do not require per-user application licensing for the student project.

Exact dependency licenses must be checked from the installed package metadata before baseline approval.

## 11. Risks

- Dependency vulnerabilities
- Version incompatibility
- Incorrect environment configuration
- Technology unavailable in the institutional environment
- Team familiarity and learning curve

## 12. Proof-of-Concept Requirement

Before final baseline approval, the selected frontend, backend and database tooling should be demonstrated in the team's development environment.

## 13. A2 Evidence

[REPLACE WITH THE TEAM'S ACTUAL A2 TECHNOLOGY RESEARCH CITATION.]

The A2 research informs the comparison, while the final M2 decision is project-specific engineering judgement.