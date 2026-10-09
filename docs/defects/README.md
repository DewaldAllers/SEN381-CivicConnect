# Defect Register

Version 3.0 | Opened 9 October 2026 | Owner: Tristan Els | Status: **open for M3; 5 entries, 5 closed**

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

Three routes so far. Peer review on a pull request, which is where all five current entries came from. Automated checks in CI, once the gate blocks on failure under DEC-012. Test execution, once the M3 suite exists.

A defect found and fixed inside the same commit, before anything was pushed, is not recorded. A defect that reached `main`, or that a reviewer had to catch, is.

## Register

| ID | Defect | Found | How found | Type | Sev | Affected | Fix | Regression evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DEF-001 | The tracked `node_modules` tree was missing `supertest`, so `api.test.ts` could not load and four of the twenty three tests did not run. `npm test` reported 19 passed and one failed suite. | 2026-09-30 | Running the suite during M2 integration review, rather than counting the cases | Build | 3 | The API test file. Verification evidence for FR-008 and the RTM cells that cite it | DEC-013 removed the installed packages from tracking and kept the lock file, so the tree is rebuilt by `npm ci` | `npm ci` then `npm test` gives 4 files and 23 passing. `npx tsc --noEmit` exits 0. CI runs both on every push | Closed |
| DEF-002 | ADR-003 ended a sentence with `:contentReference[oaicite:10]{index=10}`, an assistant citation artefact left in place of the source behind the Render staging claim. | 2026-09-30 | Peer review of PR #28 | Documentation | 2 | ADR-003. The deployment direction claim had no source | Replaced with the Render free tier source and an access date, and a reference list added to the ADR | Repository wide scan for `contentReference` and `oaicite` returns nothing | Closed |
| DEF-003 | Section 13 of the technology selection read `[REPLACE WITH THE TEAM'S ACTUAL A2 TECHNOLOGY RESEARCH CITATION.]`, an unfilled template marker in a baselined artefact. | 2026-09-30 | Peer review of PR #28 | Documentation | 2 | Technology selection. Criterion D requires the research evidence to be named | Replaced with the Week 2 teaching basis and the Assignment 2 Part 2 section 2.1 citation that bounds the database choice. Assignment 2 registered as SRC-A2 | Repository wide scan for `[REPLACE` returns nothing | Closed |
| DEF-004 | The technology baseline table listed Node.js 24.21.0 and TypeScript 6.0.x while the CI workflow pinned 22.14.0 and the lock file resolved TypeScript 7.0.2. Three artefacts disagreed about what runs. | 2026-09-30 | Peer review of PR #28, comparing the documents against the lock file | Documentation | 2 | Technology selection and ADR-003. Criterion D is marked on recorded versions and compatibility assumptions | The table now matches the manifest, lock file and workflow, which are the versions that execute | Versions in the table, ADR-003, the backend README, `package.json` and `ci.yml` agree | Closed |
| DEF-005 | BL-002 recorded the permission matrix as not written while the matrix existed and was listed in the baseline contents. BL-002 and the PED index also described the baseline as approved while PR #30 was still open and the ADRs read as proposed. | 2026-09-30 | Peer review of PR #30 by Dewald Allers | Documentation | 2 | BL-002, the PED index, the project README and ADR-001 to ADR-006 | The matrix condition now names what sits outside the baseline, which is approval of the scope rule and enforcement at the data boundary. Every status line now says approval is recorded on the merge | Repository wide check for stale approval claims returns nothing. The six ADR status lines carry identical wording | Closed |

## What the register does not yet contain

No product defect has been recorded, because the M3 construction has not started. The five entries above are build and documentation defects found through review during M2.

That is worth stating plainly rather than presenting an empty table as a clean product. The first product defects should arrive when the persistence layer and the remaining endpoints are built and the M3 test suite runs against them.

## Relationship to the other registers

A defect is something that is wrong now. A [risk](../risks/README.md) is something that might go wrong. A [technical debt](../technical-debt/README.md) item is something that is wrong and that the team has decided to live with for a stated reason.

An entry moves between them. DEF-001 was forecast as RSK-011 before it happened. A severity 1 defect nobody fixes becomes a debt item. A debt item that starts causing incorrect behaviour becomes a defect.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 3: Controlled Construction, Integration, Quality and Release Readiness*. Cited as `SRC-M3`. Sections used: 9 (automated verification and CI quality gates, p. 5), 12 (quality, defect and traceability evidence, p. 6), 15 (release quality review, pp. 7-8).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 9.1 (meaningful review, p. 11), 15 (quality engineering and evidence standard, p. 14).

Full source records are in the [source register](../sources.md).
