# CivicConnect

Community service request management platform. SEN381 integrated team project, Belgium Campus ITversity, 2026.

Liam de Villiers, Dewald Allers, Tristan Els.

CivicConnect replaces a service request process currently spread across email, telephone, WhatsApp, spreadsheets and paper, where requests get duplicated, lost or misassigned and nobody can say who owns one. The system gives a request a single controlled record from submission to closure, so requesters can see progress, staff can see what is theirs, and management can see what is outstanding and overdue.

## Current state

The Architecture, Technology and Initial Design Baseline was approved on 30 September 2026 and is recorded as [BL-002](docs/baselines/README.md). The requirements baseline, PED v1.0, was approved on 9 September 2026.

Construction has begun. The backend carries a vertical slice covering the request status lifecycle, the authorisation policy and one REST endpoint, with 23 passing tests. Three of the seventeen requirements are in development and fourteen have not been started. The request store is in memory, the caller identity is supplied rather than authenticated, and no history event is recorded yet.

## Running the backend

Requires Node.js 22.14.0 and npm 10.9.2.

```
cd app/backend
npm install
npm test
npm run dev
```

`npm test` runs the 23 Vitest cases. `npx tsc --noEmit` runs the type check. Both also run on every push and pull request through `.github/workflows/ci.yml`. The [backend README](app/backend/README.md) covers the module layout and the current limitations.

## The engineering record

Everything in this repository is one evolving Project Engineering Document. Start at the index, which carries the document control, the version history and a map of where each section lives.

[Project Engineering Document index](docs/PED/README.md)

| Area | Where |
| --- | --- |
| Requirements, acceptance criteria and proposals | [docs/requirements](docs/requirements/README.md) |
| Requirements Traceability Matrix | [docs/requirements/RTM.md](docs/requirements/RTM.md) |
| Architecturally significant requirements and data model | [docs/PED/architecture-and-data.md](docs/PED/architecture-and-data.md) |
| Architecture decision records | [docs/decisions](docs/decisions/README.md) |
| Technology selection | [docs/technology/technology-selection.md](docs/technology/technology-selection.md) |
| Permission matrix and history contract | [docs/data](docs/data/permission-matrix.md) |
| API v1 contract | [docs/integration/api-v1.md](docs/integration/api-v1.md) |
| Change control register | [docs/change](docs/change/README.md) |
| Baseline register and sign-off | [docs/baselines](docs/baselines/README.md) |
| Risk Register | [docs/risks](docs/risks/README.md) |
| Assumptions and dependencies | [docs/assumptions](docs/assumptions/README.md) |
| Forward Engineering Considerations | [docs/forward-engineering](docs/forward-engineering/README.md) |
| AI Usage Register | [docs/ai-register](docs/ai-register/AI-Usage-Register.md) |
| Source register | [docs/sources.md](docs/sources.md) |
| GitHub governance evidence | [evidence/github-governance.md](evidence/github-governance.md) |

## Repository layout

```
app/backend/        Backend vertical slice: domain, application, authorization, api
app/backend/test/   Vitest cases for the above
docs/               The Project Engineering Document
evidence/           Repository governance observations
.github/workflows/  Automated checks
```

## How this repository is controlled

`main` is the controlled product state and is protected. Nothing is committed to it directly. Every change, documentation included, enters through a pull request with two approvals from members other than the author, which on a team of three means every merge needs all of us. Force pushes and branch deletion are off, and administrators cannot bypass the rule.

No credentials, keys, tokens or personal data are committed. The repository is public, so anything pushed is readable immediately.

The rules and the reasoning behind them are in the [team working agreement](docs/PED/team-working-agreement.md). The observed state of the controls, including the one occasion they were not met, is in the [governance evidence](evidence/github-governance.md).
