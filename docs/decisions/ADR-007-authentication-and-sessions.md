# ADR-007: Authentication, Sessions and Server-Side Scope

## Status

Proposed for the M3 release candidate. Approval is recorded on the merge of the pull request that carries it. Author: Liam de Villiers.

## Problem

NFR-001 requires permission to be enforced on request read, change and reporting operations, on the server's real data-access paths. At the M2 baseline the API took the caller's identity from the endpoint itself: a fixed staff principal with `withinApprovedScope: true`. That was prototype evidence only (TD-004). The permission matrix says the category sets must be server-trusted authorisation data and never a value the client sends.

The status endpoint also read `hasOwner` from the request body. A client could claim ownership to pass the P-02 rule for moving a request to In Progress.

## Requirements

- NFR-001 and AC-NFR-001: one allowed and one denied scenario per matrix row, through the real API.
- P-03 and the [permission matrix](../data/permission-matrix.md): role, action and data scope are all checked, and a missing or empty grant gives no access.
- ADR-005: one central `AuthorizationPolicy`, not checks scattered through controllers.
- The client contract (DEC-016, `app/frontend/js/api.js`): `POST /session` returns a token, later calls send `Authorization: Bearer <token>`, `DELETE /session` signs out.

## Alternatives

1. **Signed stateless token (JWT).** The server signs a token holding the user and role and checks the signature on each call. It needs no session store, but it needs a signing secret to be kept safe, and a token cannot be withdrawn at sign-out before it expires. Sessions would be built on a token format the team has no experience of checking.
2. **Server-side session with an opaque random token.** The token is 32 random bytes with no meaning. The server keeps the session and looks it up on each call.
3. **Cookie session.** The same server-side session, carried in a cookie. This brings cross-site request forgery into scope, and the client contract already uses a bearer header.
4. **External identity provider.** Right for a real municipality. Out of scope for a student milestone and not needed to demonstrate the access rules.

## Decision

Use option 2. Sessions are held on the server. The token is 32 random bytes, sent as a bearer token, and only its SHA-256 hash is stored. Sessions last 8 hours and are deleted at sign-out.

- **Passwords** are hashed with `scrypt` from Node's built-in `crypto` module, with a random salt per user, and compared in constant time. No new dependency is added. An unknown username still performs a hash comparison, and wrong-password and unknown-user give the identical 401 message, so a username cannot be probed.
- **Users and category grants** are seeded server configuration for M3. The shared seed password is read from `SEED_USER_PASSWORD`. In `production` or `staging` the server refuses to start without it, so the repository holds no staging credential.
- **Scope is derived on the server.** `ownsRequest` is `request.requesterId === principal.id`. `withinApprovedScope` is `principal.categoryIds` containing `request.categoryId`. Both feed the existing `AuthorizationPolicy`. Nothing about scope comes from the request body, the query string or a header.
- **A request outside the caller's scope returns the same 404 as a request that does not exist.** A reference number alone tells nobody anything. A caller who can see a request but is not allowed the action gets 403.
- **Assignee eligibility (FR-007):** an assignee must be Staff holding a grant for the request's category. Otherwise the call returns 409 and the owner and history are unchanged.
- **Ownership for the In Progress rule is read from the stored request.** The `hasOwner` body field is still accepted so existing callers do not break, and it is ignored (CR-007).

## Rationale

The opaque session satisfies the sign-out contract that the stateless token cannot, and it removes a signing secret and a hand-built token format from what the team has to defend. Reusing `AuthorizationPolicy` keeps ADR-005 intact: the decision gains real inputs and no second rule engine appears. Returning 404 for out-of-scope requests follows the frontend's rule and AC-FR-005's requirement that a denied attempt shows no protected details.

## Trade-offs

- Sessions live in memory. A restart signs everyone out, and the design supports one server instance only. Acceptable for M3, recorded as technical debt. A shared store or a signed token becomes necessary with a second instance.
- The client keeps the token in `sessionStorage`, where a cross-site scripting flaw could read it. The control is DEC-016's rule that user text is only ever shown as text, checked by an end-to-end test that submits a script tag.
- There is no lockout or rate limit on sign-in, so repeated password guessing is not slowed. Recorded as a known limitation and for the threat review.
- Grants cannot be changed while the system runs. Who grants and revokes them, and how a request is reassigned when a grant is removed, remain open in the permission matrix.
- A 404 for out-of-scope requests hides existence from a legitimate user who mistyped a reference. That is the intended trade.

## Consequences for verification

Every row of the permission matrix is exercised through HTTP in `app/backend/test/api.test.ts` (TC-API-01 to TC-API-04, 08, 11, 13, 18, 23, 31, 32). The token, password and seed-password rules are unit tested in `app/backend/test/auth-units.test.ts` (TC-UNIT-01 to TC-UNIT-09).

## Revisit trigger

A second server instance, a requirement for single sign-on, or grant administration entering scope. Any of these goes through the change control register.
