# Threat review

Version 3.0 | 15 October 2026 | Owner: Tristan Els | Status: **approved when its pull request merges**

This review asks what could go wrong with the release candidate on purpose, or by mistake, and what stops it. It covers the server, the pages and the database at `main` commit `142f6b3`. SRC-MASTER section 16 (security engineering, p. 14) asks for the security position to rest on evidence, so every row names the test or check behind it, and every gap has an owner.

## How I did it

I read the code and [ADR-007](../decisions/ADR-007-authentication-and-sessions.md), and I listed what each person can do: send a request, work a request, read the totals. For each step I asked what a person could try that we did not intend. Then I looked for the control in the code and the test that checks it. Where I found no control, the row says so and points to the register entry that holds the gap.

## What we protect

Requests and their history, which can be about security or lost property and carry the requester's identity. Staff identity, which a requester should not need. The accuracy of the history, because the whole product rests on it. The database address and the sign in passwords.

## Where trust changes

| Boundary | What crosses it | What the server does |
| --- | --- | --- |
| Browser to server | Every request body, query and header | Treats all of it as untrusted. The caller comes from the session token and never from the body. Scope comes from the server's category grants |
| Server to database | SQL and the connection address | Uses parameters for every value. The address comes from the environment and the connection checks the database certificate |
| Server to browser | Titles, descriptions, notes and names | The pages show them as text only, and the API sends no framework banner |

## Threats

| What could go wrong | What stops it | Evidence | Gap and owner |
| --- | --- | --- | --- |
| Someone guesses passwords | Passwords are hashed with scrypt and a random salt and compared in constant time. A wrong password and an unknown user get the same 401 message | TC-API-01 and TC-API-02, the 13 cases in `auth-units.test.ts` | Nothing slows repeated guesses. TD-009, Liam |
| Someone steals a session token | Tokens are 32 random bytes, stored only as a hash, end after 8 hours and stop working at sign out | TC-API-03, TC-API-04, `auth-units.test.ts` | The browser keeps the token in `sessionStorage`, so a script running on the page could read it. Text-only rendering is the main defence, and a Content-Security-Policy would back it up. TD-012, Liam |
| A script in a title or note runs in someone else's browser | The pages build every element with text and never with HTML | T-E2E-02 sends a script tag and an image tag with an `onerror`, and checks that nothing runs and no dialog opens, in the requester's and the staff member's browser | No Content-Security-Policy header as a second layer. TD-012, Liam |
| A requester reads or changes another requester's request | One central policy checks role, action and ownership. A request that is not yours gets the same 404 as one that does not exist | TC-API-10, TC-API-11, TC-API-13 | |
| A requester or staff member reaches management or staff functions | The policy refuses by role. A requester cannot open the staff page or call a staff or management endpoint | TC-API-08, TC-API-18, TC-API-23, TC-API-32, T-E2E-02 | |
| Staff step outside their categories | Category grants live on the server. The store also applies them in SQL, and an empty set returns nothing | TC-API-12, TC-API-13, TC-REPO-07, the store case for revoked scope | Grants are fixed server settings and cannot change while the server runs. TD-009, Liam |
| A caller claims a role, an owner or a scope in the request body | The requester is the signed in user. Ownership is read from the stored request, and the body field is ignored (CR-007) | TC-API-21, TC-API-05 | |
| Two people overwrite each other's change | Every change carries the version the page last read, and the database checks it again | T-NFR-002-03, the stale case in `data-api.integration.test.ts`, T-E2E-02 | |
| Someone edits or deletes the history | Database triggers reject any update or delete of an event or work record, and no endpoint offers one | The store case for edits and deletes, `npm run db:verify` | A database administrator can still change the schema or the triggers. The data handoff note says so |
| A requester learns which staff member handles a request | Requesters get "Assigned staff" and "Staff", and the owner id is empty (DEC-018) | T-FR-011-03, T-E2E-01 | |
| SQL injection | Every value goes in as a parameter, and filter values are data | The store case for hostile filter values | |
| A large or malformed request knocks the server over | JSON bodies have the default size limit and the server answers 413 and 400. Errors give a generic 500 and log the message only, never a body or a token | TC-API-09 and the error handler in `app.ts` | Nothing limits how many requests one caller can send. TD-009, Liam |
| A weak or shared password is in use | In staging and production the server refuses to start without `SEED_USER_PASSWORD`. The sample password `demo` is for development only | `resolveSeedPassword` in `user-directory.ts`, the `auth-units` cases | |
| A secret is in the repository | The database address and the seed password come from the environment. `.env` files are ignored | The history scan below | The scan is a pattern search and no scanner runs in CI. TD-013, Tristan |
| A package with a known flaw is shipped | CI fails the build on a high or critical finding in shipped code | `npm audit`: 0 vulnerabilities across 355 packages, 101 of them shipped, on 15 October | |
| Traffic is read on the way | The server speaks plain HTTP. A deployed host puts TLS in front, and the database connection checks the certificate | The database address uses `sslmode=verify-full` | The release candidate has not been deployed behind TLS yet. Staging is Liam's |

## Checks I ran

The history scan looked through all 176 commits for connection strings with a password, private keys, cloud and token patterns, and password assignments. It found the throwaway password of the CI database container in the workflow files, which is a disposable test value. It found no private key, no token and no real password. The hosted database password has never been in the repository.

I also read the response headers the server sets. Every response carries `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` and `Referrer-Policy: no-referrer`. API responses carry `Cache-Control: no-store`. The server sends no `X-Powered-By` header (TC-API-33).

## Open positions

| Position | Register | Owner | When it closes |
| --- | --- | --- | --- |
| No limit on sign in attempts or request rate, sessions in memory | TD-009 | Liam | If the system is used beyond a demonstration |
| No Content-Security-Policy header | TD-012 | Liam | Before the release tag if time allows, otherwise recorded as an accepted limitation |
| Secrets are checked by pattern and not by a scanner in CI | TD-013 | Tristan | When a scanner is added to CI |
| The free database expires on 13 November 2026 and the rights of its role are unconfirmed | TD-010 | Dewald | Before the release tag |

## Limits of this review

This is a desk review with tests behind it. It is not a penetration test, and nobody outside the team has tried to break the system. It reads the system at student scale, and it does not claim the system is safe for a municipality. The permission matrix it checks against is approved in principle only (CR-002).

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 16 (security engineering, p. 14).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 3: Controlled Construction, Integration, Quality and Release Readiness*. Cited as `SRC-M3`. Sections used: 3 (minimum viable M3, p. 1).

Full source records are in the [source register](../sources.md).
