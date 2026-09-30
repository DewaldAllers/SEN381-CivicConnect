# ADR-001: CivicConnect logical architecture

## Status

Proposed for PED v2.0 / BL-002; pending team review and approval. This ADR does not supersede M1 DEC-007 by itself and does not select a technology stack or deployment platform.

## Context and problem

CivicConnect must accept and track requests, let authorised staff progress work, retain attributable history and provide scoped management views. FR-003/005/010 and NFR-001 require a permission boundary; FR-008/009/011 and NFR-002 require consistent workflow and history; NFR-003 requires durable records. No independent scale or third-party integration demand is documented. The team has three members. See the [PED architecture/data section](../PED/architecture-and-data.md#b-architecturally-significant-requirements) for ASR-01–ASR-05 and source links.

## Alternatives considered

| Direction | Benefit | Cost or reason not selected |
| --- | --- | --- |
| Undifferentiated layered application | Smallest setup and deployment footprint. | Does not make authorisation, workflow and history ownership explicit enough for NFR-001/002. |
| Modular application server with separate logical responsibilities | Keeps one local coordination/commit boundary while making rules and data access testable by responsibility. | Modules still deploy together; boundaries require discipline. |
| Independent request and audit services or asynchronous events | Would permit later independent deployment/consumers. | Adds remote or delayed failures, duplicate/ordering handling and operational/security work without a current CivicConnect driver. |

## Proposed decision

Use a modular application server with a distinct client/presentation boundary. Within the server, application operations coordinate authorisation, Request Management, History/Audit and persistence access. Request Management owns the current request state; History/Audit owns the event format and chronological history responsibility. A successful audited action changes state and records its corresponding event as one logical persistence operation. The server, not a UI control, applies the approved role/action/data-scope rule to every request, history and reporting operation.

These are logical modules and responsibilities, not a claim that each box is a service or that the architecture is already implemented. The browser-to-server interface, technology versions, physical tiers and hosting are Liam's decisions. His proposed ADR-006 for a REST browser boundary and in-process backend collaboration is compatible; approval and integration remain pending.

## Rationale and consequences

This choice directly addresses ASR-01–ASR-04 without creating a distributed consistency problem for the history required by NFR-002. Assignment 2 Part 3 §3 compared in-process, HTTP and asynchronous interaction for Request Management → History/Audit; its local-interface recommendation supports this internal boundary, but the M2 decision is based on the current CivicConnect requirements. The architecture also allows scoped queries for ASR-05 without assuming a separate reporting store.

The server modules form one deployable unit; the client may be deployed separately under Liam's technology/deployment decision. The server likely shares one data availability boundary. Failure of that boundary may stop request handling and reporting; backup/recovery and database choice are not solved by modularity. A module must not bypass the central authorisation check or directly write another module's data. Cross-module interface and transaction details must be implemented and verified, not inferred from the diagram.

## Assumptions, risks and deferred decisions

- P-01–P-04 details in `main` are still proposals; Tristan's separate CR-002/003/004 work has not entered this branch. The [proposed P-03 permission matrix](../data/permission-matrix.md) and any controlled privacy route need team review before a final data baseline.
- No credible workload volume or uptime target supports service separation; the NFR-005 numbers are provisional test targets.
- Liam owns technology, deployment and initial interface/design decisions. No database, runtime, framework or production topology is selected here.
- A single persistent store is an availability and recovery risk, not a proven acceptable service level.

Revisit if approved requirements introduce an external consumer, independently deployable modules, a measured scaling constraint, or a security boundary that cannot be handled inside this architecture. Any material change after baseline approval goes through the team's change control.

## Evidence and links

Requirements: [functional](../requirements/functional-requirements.md), [non-functional](../requirements/non-functional-requirements.md), [proposed details](../requirements/decisions-to-confirm.md). Model and diagram: [PED architecture/data contribution](../PED/architecture-and-data.md). Related data decision: [ADR-002](ADR-002-request-history-persistence.md). Research: team *SEN381 Assignment 2* (2026), Part 3 §3, used as comparative support only. No code or test result is claimed by this ADR.
