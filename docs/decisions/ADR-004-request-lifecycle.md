# ADR-004: Controlled Request Status Lifecycle

## Status

Proposed for M2 baseline — pending team approval.

## Problem

FR-008 requires CivicConnect to prevent invalid request status transitions.

The status lifecycle must follow the agreed P-02 rules and successful changes must be recorded in history.

## Requirements

- FR-008 — Controlled status transitions
- P-02 — Proposed status rules
- AC-FR-008 — Status transition acceptance criteria
- NFR-002 — Attributable history

## Agreed Workflow

New submission
→ Submitted
→ Accepted
→ In Progress
→ Resolved
→ Closed

Rejected is a terminal status.

Closed is a terminal status.

Overdue is treated as a calculated condition rather than a separate lifecycle status.

Additional P-02 branches must be represented exactly according to the approved proposal.

## Alternatives

### Option 1 — Controller validation

Transition rules are written inside HTTP controllers.

### Option 2 — Central RequestStatusPolicy

A dedicated policy contains the legal transitions and required conditions.

### Option 3 — State Pattern

Each status receives a separate state object.

## Decision

Use a central RequestStatusPolicy / transition table.

## Why

The CivicConnect workflow contains a relatively small and explicit set of permitted transitions.

Centralising the rule:

- reduces duplicated business logic
- separates business rules from HTTP handling
- makes the lifecycle independently testable
- keeps the design proportionate

## Trade-Off

The policy becomes an important business-rule component and must be maintained when the lifecycle changes.

A full State Pattern would offer more flexibility for state-specific behaviour but would introduce additional classes and complexity that are not currently required.

## Expected Behaviour

Valid transition:
- passes lifecycle validation
- updates the request
- creates the corresponding history event

Invalid transition:
- is rejected
- leaves the stored status unchanged
- must not be represented as a successful history event

Missing required transition information must also cause rejection.

## Implementation Evidence

Expected implementation:

RequestStatusPolicy
+
status update application service
+
request history recording

## Verification

Tests must demonstrate:

- permitted transitions succeed
- invalid transitions fail
- missing rejection information fails
- In Progress without an owner fails
- unauthorised status changes fail
- failed changes do not create successful history events
