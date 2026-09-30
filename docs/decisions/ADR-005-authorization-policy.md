# ADR-005: Specification-Based Authorization Policy

## Status

Proposed for the M2 baseline. Approval is recorded on the merge of PR #30. The concrete permission matrix follows the approved P-03 and DEP-001 decision.

## Problem

NFR-001 requires permission enforcement on request read, change and reporting operations.

P-03 defines the need to control access according to role, action and approved data scope.

Duplicating role checks across controllers would make permission behaviour harder to maintain and test.

## Requirements

- NFR-001: Permission enforcement
- P-03: Role/action/data-scope permission model
- AC-NFR-001: Permission verification
- NFR-002: History integrity

## Alternatives

### Option 1: Controller-Level Checks

Each controller contains its own role and permission conditions.

### Option 2: Central Authorization Policy

One central policy evaluates role, action and resource scope.

### Option 3: Specification-Based Policy

Permission rules are represented as small specifications that can be combined by an authorization policy.

## Decision

Use a central AuthorizationPolicy implemented using small specification-style permission rules.

The policy will evaluate:

- authenticated principal
- requested action
- target resource
- permitted data scope

## Rationale

CivicConnect permissions are multi-dimensional because authorisation depends on the user, requested action and allowed scope.

Small permission specifications allow the individual rules to be tested independently while the central policy provides one consistent application entry point.

This avoids scattering security logic across controllers.

## Security Principle

Authorization must be enforced server-side.

Hiding a button in the user interface is not sufficient security evidence.

A denied request must not expose protected data or modify the protected record.

## Trade-Off

The specification approach introduces additional abstraction and therefore requires disciplined naming and testing.

The benefit is reduced duplication and clearer separation between request handling and security rules.

## Permission Matrix

The concrete role/action/data-scope matrix will follow the approved P-03/DEP-001 project decision.

## Implementation Evidence

Expected implementation:

AuthorizationPolicy
+
permission specifications
+
integration with backend request operations

## Verification

Verification should include:

- requester accessing their own request
- requester attempting to access another request
- authorised staff operating within scope
- staff operating outside scope
- denied action producing no protected data
- denied action producing no record change
