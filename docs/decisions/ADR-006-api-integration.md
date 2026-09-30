# ADR-006: Initial Interface and Integration Decision

## Status

Proposed for M2 baseline — initial interface decision.

## Problem

The CivicConnect frontend needs to communicate with backend application functionality.

An explicit boundary is required so that the responsibilities and error behaviour are controlled rather than becoming accidental dependencies.

## Alternatives

### Option 1 — In-process frontend/backend integration

The frontend and backend would not use a network API boundary.

### Option 2 — HTTP/REST API

The frontend communicates with the backend through versioned HTTP endpoints.

### Option 3 — Asynchronous messaging

Frontend and backend interactions use messages/events.

## Decision

Use a REST-style HTTP API between the React frontend and backend.

Internal backend component collaboration remains in-process unless a later requirement provides evidence for another boundary.

## Rationale

The browser-to-server interaction is a genuine boundary.

REST provides:
- clear request/response responsibilities
- a defined security boundary
- independent frontend/backend development
- straightforward automated testing
- explicit error behaviour
- future versioning capability

Asynchronous messaging is not currently justified because CivicConnect does not have an identified requirement for asynchronous distributed processing.

## Initial Versioning

The API will use a versioned boundary:

/api/v1

## Security

Requests crossing the API boundary must pass through authentication and authorization controls.

The server remains responsible for validating input.

## Error Behaviour

The API will distinguish between:

- invalid input
- unauthenticated requests
- unauthorised requests
- missing resources
- invalid state conflicts
- server failures

## Change Compatibility

Changes should prefer backward-compatible additions.

Breaking interface changes should require controlled versioning and review.

## Deferred Evidence

Concrete endpoint definitions will be added only when the application implementation establishes those interfaces.
