# Defect Register

Version 3.0 | Opened 9 October 2026 | Owner: Tristan Els | Status: **open for M3; 13 entries, 5 closed, 8 in progress**

A defect is something that behaves differently from what an approved artefact says it should. That covers product behaviour, and it also covers the controlled documents, because a register that contradicts the repository misleads whoever reads it next.

Every entry names how it was found, what it affected, what fixed it and what stops it coming back. SRC-M3 section 12 (p. 6) asks for defect, severity and impact, status, fix, and regression evidence where corrected.

## Severity scale

Severity is about consequence, not about how annoying the defect is to fix. The scale matches the impact bands already used in the [Risk Register](../risks/README.md) under DEC-005, so a severity 3 defect and an impact 3 risk mean the same size of problem.

| Score | Band | Meaning |
| --- | --- | --- |
| 1 | Minor | Cosmetic, or a limitation nobody relies on. Does not block a requirement. |
| 2 | Moderate | A requirement behaves incorrectly in some cases, or an artefact misleads a reader. A workaround exists. |
| 3 | Major | A requirement cannot be met, verification cannot run, or a control the brief requires cannot be evidenced. |

A severity 3 defect that is still open at the release review is a release blocker. A severity 2 is a candidate for conditional release with the limitation stated. Severity 1 goes to the [Technical Debt Register](../technical-debt/README.md) if it is not fixed.

## Status vocabulary

Open means found and not fixed. In Progress means a fix is being written. Fixed means the fix is merged and the regression check passes. Closed means fixed and verified at the release review. Deferred means accepted as a known limitation and moved to the technical debt register with a reason.

## How defects arrive here

Three routes have produced entries so far. Peer review on a pull request gave DEF-001 to DEF-005. A reviewer sending raw authenticated requests at an integration branch gave DEF-006 to DEF-011. The link and identifier checks run before a commit gave DEF-012 and DEF-013. Automated checks in CI become a fourth route once the gate blocks on failure under DEC-012.

A defect found and fixed inside the same commit, before anything was pushed, is not recorded. A defect that reached `main`, or that a reviewer had to catch, is.

## Register

| ID | Defect | Found | How found | Type | Sev | Affected | Fix | Regression evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEF-001 | The tracked `node_modules` tree was missing `supertest`, so `api.test.ts` could not load and four of the twenty three tests did not run. `npm test` reported 19 passed and one failed suite. | 2026-09-30 | Running the suite during M2 integration review, rather than counting the cases | Build | 3 | The API test file. Verification evidence for FR-008 and the RTM cells that cite it | DEC-013 removed the installed packages from tracking and kept the lock file, so the tree is rebuilt by `npm ci` | `npm ci` then `npm test` gives 4 files and 23 passing. `npx tsc --noEmit` exits 0. CI runs both on every push | Closed |
| DEF-002 | ADR-003 ended a sentence with `:contentReference[oaicite:10]{index=10}`, an assistant citation artefact left in place of the source behind the Render staging claim. | 2026-09-30 | Peer review of PR #28 | Documentation | 2 | ADR-003. The deployment direction claim had no source | Replaced with the Render free tier source and an access date, and a reference list added to the ADR | Repository wide scan for `contentReference` and `oaicite` returns nothing | Closed |
| DEF-003 | Section 13 of the technology selection read `[REPLACE WITH THE TEAM'S ACTUAL A2 TECHNOLOGY RESEARCH CITATION.]`, an unfilled template marker in a baselined artefact. | 2026-09-30 | Peer review of PR #28 | Documentation | 2 | Technology selection. Criterion D requires the research evidence to be named | Replaced with the Week 2 teaching basis and the Assignment 2 Part 2 section 2.1 citation that bounds the database choice. Assignment 2 registered as SRC-A2 | Repository wide scan for `[REPLACE` returns nothing | Closed |
| DEF-004 | The technology baseline table listed Node.js 24.21.0 and TypeScript 6.0.x while the CI workflow pinned 22.14.0 and the lock file resolved TypeScript 7.0.2. Three artefacts disagreed about what runs. | 2026-09-30 | Peer review of PR #28, comparing the documents against the lock file | Documentation | 2 | Technology selection and ADR-003. Criterion D is marked on recorded versions and compatibility assumptions | The table now matches the manifest, lock file and workflow, which are the versions that execute | Versions in the table, ADR-003, the backend README, `package.json` and `ci.yml` agree | Closed |
| DEF-005 | BL-002 recorded the permission matrix as not written while the matrix existed and was listed in the baseline contents. BL-002 and the PED index also described the baseline as approved while PR #30 was still open and the ADRs read as proposed. | 2026-09-30 | Peer review of PR #30 by Dewald Allers | Documentation | 2 | BL-002, the PED index, the project README and ADR-001 to ADR-006 | The matrix condition now names what sits outside the baseline, which is approval of the scope rule and enforcement at the data boundary. Every status line now says approval is recorded on the merge | Repository wide check for stale approval claims returns nothing. The six ADR status lines carry identical wording | Closed |
| DEF-006 | A page holding an old version of a request could overwrite a newer change. The assign, status and due date calls ignored the `expectedVersion` the client sends, so the 409 the client waits for never came. | 2026-10-15 | Review of PR #41 by Dewald Allers, with raw authenticated HTTP requests | Product | 3 | FR-007, FR-008, FR-009 and NFR-002. Two staff on one request could undo each other without knowing | PR #42 checks the version on assign, status, note and due date. CR-008 and DEC-017 record the rule | A stale write gets a 409 with `code: "stale"` and adds no event, in the tests in PR #42 | In Progress |
| DEF-007 | A note skipped the all-or-nothing save of the request, the work record and the event, and did not move or check the request version. | 2026-10-15 | Review of PR #41 by Dewald Allers | Product | 2 | FR-009 and NFR-002. A note could be saved without the version moving | PR #42 sends notes through the same versioned save as every other change | A stale note gets a 409 and leaves the history unchanged, in the tests in PR #42 | In Progress |
| DEF-008 | Clearing a due date from the client was refused. The page sends an empty date to clear one, and the API only accepted a real date. | 2026-10-15 | Review of PR #41 by Dewald Allers | Product | 2 | FR-009. A staff member could set a due date and never remove it | PR #42 accepts null or an empty date and records "Due date cleared" in the history | A clearing call returns the request with no due date, in the tests in PR #42 | In Progress |
| DEF-009 | A change the data store refuses, such as moving ownership after a request is Resolved, came back from the API as a 500 server error. | 2026-10-15 | Review of PR #41 by Dewald Allers | Product | 2 | FR-007, FR-008 and FR-009. The page showed a server error where a clear refusal was due | PR #42 applies the lifecycle limits in the application layer and answers 409 with a message. CR-008 records the limits | A refused change returns 409 and leaves the request and history unchanged, in the tests in PR #42 | In Progress |
| DEF-010 | The built server could not find the migration files, so the compiled program could not set up the database. Staging runs the compiled program. | 2026-10-15 | Review of PR #41 by Dewald Allers | Product | 3 | Staging and every check that starts the real server against PostgreSQL | PR #42 fixes the file lookup and makes staging and production refuse to start without a database | The restart check in PR #42 compiles the program, runs the migrations, creates a request, restarts the server and reads the request back | In Progress |
| DEF-011 | Once staff names were hidden from requesters, a request someone was looking after showed as "Nobody yet", and staff entries in the history had blank names. | 2026-10-15 | Review of PR #41 by Dewald Allers | Product | 2 | FR-004 and FR-011. A requester was told nobody had a request that staff were working on | PR #42 sends "Assigned staff" when an owner exists and "Staff" as the label on staff entries. CR-009 and DEC-018 record the rule | The privacy case in `request-store.test.ts` and the HTTP cases in PR #42 | In Progress |
| DEF-012 | CR-007 was cited by ADR-007, the API contract and the backend code, but the change register stopped at CR-006. ADR-007 merged without an entry in the ADR index. | 2026-10-15 | A scan of every identifier cited in `docs`, `app` and `README.md` against the registers, during the register refresh | Documentation | 2 | The change register, the decision log and ADR-007. A reader following CR-007 found nothing | CR-007 now has an entry, and ADR-007 is in the index | The scan returns no cited identifier that a register lacks | In Progress |
| DEF-013 | Two links to DEC-005 ended in `3-3` where the heading reads `3 by 3`, so they opened the decision log at the top. | 2026-10-15 | The link and anchor check run on the files changed for the register refresh | Documentation | 1 | The decision log and the Risk Register | Both links now point at the heading | The link check reports no broken anchor in either file | In Progress |

## What the defects tell us

Six product defects, DEF-006 to DEF-011, came from one review. Dewald read PR #41, which joins the endpoints to the database, and sent raw authenticated requests at it. All six were found on a branch, before they reached `main`.

They share one cause. Liam wrote the endpoints against the in-memory store, and Dewald wrote the database store with stricter rules. Each half passed its own tests, and the 119 tests on `main` pass. The six rules only broke when the two halves met. That is the case for checking the joined system against the real database, and it is why PR #42 adds raw HTTP checks, a repository contract run against PostgreSQL and a restart check on the compiled server.

DEF-006 and DEF-010 are severity 3. Under the rule above, a severity 3 defect still open at the release review is a release blocker. Both stay In Progress until PR #42 merges, and the release summary names them as blockers until then.

The two documentation defects, DEF-012 and DEF-013, came from checks I ran for the register refresh. A check of every cited identifier against the registers found the gap behind CR-007. The link check found the two bad anchors. Both checks take seconds, and I run them before every commit.

## Relationship to the other registers

A defect is something that is wrong now. A [risk](../risks/README.md) is something that might go wrong. A [technical debt](../technical-debt/README.md) item is something that is wrong and that the team has decided to live with for a stated reason.

An entry moves between them. DEF-001 was forecast as RSK-011 before it happened. A severity 1 defect nobody fixes becomes a debt item. A debt item that starts causing incorrect behaviour becomes a defect.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 3: Controlled Construction, Integration, Quality and Release Readiness*. Cited as `SRC-M3`. Sections used: 9 (automated verification and CI quality gates, p. 5), 12 (quality, defect and traceability evidence, p. 6), 15 (release quality review, pp. 7-8).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 9.1 (meaningful review, p. 11), 15 (quality engineering and evidence standard, p. 14).

Full source records are in the [source register](../sources.md).
