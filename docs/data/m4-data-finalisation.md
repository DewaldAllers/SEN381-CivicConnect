# M4 data finalisation and verification

Date: 17 October 2026 | Contribution: Dewald Allers | Branch: `m4-data-scope-finalisation` | Integration base: `dec53fa87226a147f3c06ddf2152a9f663c98d85` | Status: **data contribution for review, not final release approval**

## Purpose and scope

M4 closes the existing product rather than starting a new feature or testing programme. The M3 [RTM acceptance check](../requirements/RTM.md#acceptance-check) identified two specific data evidence gaps: saving one request in every category (FR-002), and a controlled server restart with requests in every proposed status (NFR-003). This contribution closes those targeted gaps and retains the existing scope, architecture and product code. No endpoint, database migration, UI feature, infrastructure or paid resource is added.

The [PED scope assessment](../PED/final-scope-assessment.md) inventories all 40 original non-empty M1 acceptance bullets and calculates the current evidence-based completion percentage. It remains subject to team review, final evidence and the frozen final candidate. It is not a replacement RTM.

## Checks added or extended

### T-FR-002-01: all six configured categories

The case in [data-api.integration.test.ts](../../app/backend/test/data-api.integration.test.ts) runs against both repository modes. It independently fixes the expected six category identifiers/names, compares the API list and the active SQL seed where a SQL store exists, submits one request per category, then reads it back through the API. It asserts the category, unique reference, Submitted status, version 0, exactly one history event and the complete own-list category set. It complements, rather than replaces, the invalid/inactive-category rejection tests.

This verifies the project's configured taxonomy, not stakeholder approval of those category names. The default SQL adapter is PGlite; the separately configured real-database run uses PostgreSQL.

### T-NFR-003-01: all six statuses across compiled-server restart

The existing case in [server-restart.integration.test.ts](../../app/backend/test/server-restart.integration.test.ts) now uses the real authenticated API to construct one acknowledged request in each of Submitted, Accepted, Rejected, In Progress, Resolved and Closed. Each has an assigned owner and a private staff note. Accepted/progressed work also receives a due date; resolution information is retained for the two requests that reach resolution. Terminal states are reached through legal transitions, not direct status edits in SQL.

Before the server stops, the case saves all request/event/work rows, staff detail/history, requester-visible history and the requester list. After restarting the compiled server against the same temporary schema, old sessions must be refused. Fresh logins must see exactly equal stored rows and API results. The private notes must remain absent from requester feedback. The fixture has six requests and eight work records: six private notes and two resolutions. Every request's history count equals its version plus the submission event.

The test timeout allows a slower remote educational database. It is not a relaxed NFR-005 latency target or a load measurement. The database itself is not restarted: this verifies a controlled application restart, as NFR-003 requires, not host loss or backup restoration.

## Failure found and corrected during verification

The first expanded PostgreSQL run recorded **32 passed, 1 failed, 1 skipped**. The compiled server could not start. Inspection found that the existing test copied an inherited `DATABASE_ADMIN_URL` while only overriding `DATABASE_URL` for its temporary schema. The migration runner prefers the admin variable, so the child's migration configuration could escape the test schema.

The corrected harness removes the inherited admin value from the app child and supplies the temporary fixture URL explicitly to the migration child. The isolated expanded restart then passed on PostgreSQL. The failed result is retained in the execution summary; it is not erased by reporting only a green retry. No history/application table is cleared or bulk-seeded. Fixtures create randomly named test schemas and remove only their own generated schema afterwards. Connection strings and credentials are not included in the reports committed to the repository.

## Executed verification

Environment: Windows, Node.js **22.18.0**, PostgreSQL **18.6 (Debian 18.6-1.pgdg12+2)** for remote checks. The CI workflow remains pinned to Node.js 22.14.0 and supplies its own PostgreSQL 18 service. Local evidence is not silently relabelled as that CI environment.

| Check | Actual result | Interpretation |
| --- | --- | --- |
| `npm run lint` | Passed, exit 0 | Existing TypeScript ESLint rules. The new JavaScript calculation checker is syntax-checked and exercised separately. |
| `npm run typecheck` | Passed, exit 0 | Existing TypeScript contracts compile without type errors. |
| Final default backend suite | **153 passed, 2 intentional skips**, 11 files | The expanded category case runs in memory and embedded SQL. Restart needs a real URL; SQL fault injection on memory is intentionally skipped. |
| Initial expanded PostgreSQL suite | **32 passed, 1 failed, 1 skipped** | Preserved failure led to the migration-environment isolation correction above. |
| Corrected isolated compiled-server restart | **1 passed** | Six statuses, all acknowledged data and permitted projections survive; fresh sign-in is required. |
| Final combined PostgreSQL suite after correction | **33 passed, 1 intentional skip**, 3 files | Authenticated data/API tests in memory and real PostgreSQL, the PostgreSQL repository contract and the expanded compiled-server restart all pass in one completed run. These are not 33 unique database-only tests. |
| Scope calculation checker | **40 criteria; 35.5 points; 88.75%** | Arithmetic and inventory pass; criterion sufficiency/approval still needs human review. |
| Calculation-checker negative tests | **7 checks passed** | One valid ledger is accepted; duplicate, missing, unknown, invalid-status, wrong-total and evidence-free rows are refused. These are document-control checks, not seven extra product tests. |

The structured [execution summary](../../evidence/m4-data-verification.json) records raw report hashes, selected case outcomes and the Git blob identities of the changed test/checker sources. Full local JSON reports remain ignored under `app/backend/test-results/`; PR CI preserves its normal JUnit/test artefacts. The expected injected event rejection produces an error log while its rollback assertions pass; that log is not an unreported failing test.

No Windows embedded-worker crash occurred in these default runs. That does not establish a cause or repay TD-014. No new browser journey, human usability observation, load result, staging deployment or recovery result is claimed here.

## Consequences and handoff

| Area | Dewald's conclusion | Remaining integration responsibility |
| --- | --- | --- |
| FR-002 | All six configured category save/read paths are now explicitly exercised. | Tristan can replace the corresponding missing-case statement in the existing RTM after review. |
| Category coverage in the demonstration | The [seeded user directory](../../app/backend/src/auth/user-directory.ts) gives no Staff identity a grant for Lost property or Other. Saving those categories does not prove a staff journey can process them with the supplied identities. | Liam and the team must confirm the intended grants or state the limitation before claiming all-category operational coverage. This contribution does not silently grant additional access. |
| NFR-003 | The expanded real-server fixture covers all proposed statuses and compares persisted values and history. | Tristan can reconcile the historical Partly row with this reviewed execution evidence. |
| NFR-002 | Existing atomic rollback, stale-write and one-event checks are retained and rerun. | Keep the distinction between ordinary-user append-only history and the unimplemented CR-004 administrative route. |
| Scope completion | The original criterion inventory and current calculation are ready for review. | All three members approve the classifications; Tristan integrates final RTM/PED links to the frozen version. |
| Database operations | Restricted runtime privileges from PR #44 remain unchanged. The free development instance expires on **13 November 2026**. | Preserve the limitation and a viable free environment for assessment. A backup/restore claim needs separate real evidence; M4 does not mandate building a new recovery system. |
| Deployment/performance | No final response-time or go-live claim is made by these correctness checks. | Liam supplies the existing load/staging completion and a defensible deployment or no-go decision. |

The data implementation remains the existing ADR-002 transaction design. The [continued architecture/data PED section](../PED/architecture-and-data.md#m4-data-conclusion-17-october-2026) explains its observed benefit, the rejected independent-save alternative and the remaining single-store/performance consequences. Each member still owns their own evidence, human review and final defence. This contribution does not declare the whole project complete.

## Evidence reconciliation, 18 October 2026

The results above are the dated 17 October data-verification record, not a claim that later team evidence does not exist. PR #46 merged as `5d5e1bcc45a6e8445904dde4838c82876313a98f`. Liam subsequently recorded local staging and the existing HTTP performance exercise against that exact application candidate in [PR #48](https://github.com/DewaldAllers/SEN381-CivicConnect/pull/48).

The [original report](https://github.com/DewaldAllers/SEN381-CivicConnect/blob/a9bedd1d7fde00fd23fa542d9c6332eaea57bb61/evidence/m4-performance/nfr-005-2026-10-18T18-39-19-613Z.json) records 300 seeded requests, 304 total, a scoped staff queue of 154, and 600 measured HTTP calls at concurrency 10 with no reported errors. All three operation types met the runner's proposed two-second target. The original JSON and generated Markdown SHA-256 values were independently recomputed during this AI-assisted reconciliation and match Liam's provenance note. No shared data was seeded or deleted during this review.

The [reconciled scope assessment](../PED/final-scope-assessment.md#calculation-and-interpretation) now proposes 35 Met, 5 Partially Met and 0 Not Met, or 37.5 / 40 = 93.75%. It keeps NFR-005 partial because formal environment/target acceptance and browser-rendered end-to-end timing are not established. The original 88.75% verification row and structured execution record above remain unchanged as the historical result of the 17 October run.

The staging log excerpt identifies the tested candidate, not a later final tag. Its runtime-permission outcome is reported evidence with the original temporary transcript unavailable, and the performance wrapper displayed a blank exit-code value. Preserve these limits. Successful local HTTP measurements do not establish production readiness, a database restore, rollback of a deployed release, or operational staff coverage for Lost property and Other. Tristan owns reconciling the final RTM, PED and registers; this data contribution supplies the evidence interpretation without silently approving the final release.

Source: `SRC-M4`, sections 5-11 and 15, pp. 3-8; source identity in the [existing register](../sources.md).
