# Test approach

Version 1.0 | 13 October 2026 | Owner: Tristan Els | Status: **raised for review in the M3 pull request, approved when it merges**

This page says how we test CivicConnect. The [test case designs](test-cases.md) hold the cases. The [RTM](../requirements/RTM.md) links each case to its requirement and, once a case has run, to its evidence.

## What we test against

Each case traces to an acceptance criterion in [acceptance-criteria.md](../requirements/acceptance-criteria.md). The criteria are the baseline, so a case never changes what a requirement means. If a case needs a different answer, the criterion changes first, through a change request.

## Levels

| Level | What it covers | Where it runs |
| --- | --- | --- |
| Unit | One rule on its own, such as the status table or the permission policy | Vitest, in the continuous integration run |
| Black-box | The behaviour a person can see, chosen from the requirement and not from the code | Vitest against the running server, using the techniques below |
| API or integration | The server with a real PostgreSQL database behind it, including rollbacks and restarts | Vitest, with the PostgreSQL service in continuous integration |
| E2E | A whole journey through the real pages in a browser | Playwright against the server |
| Performance | List, detail and summary calls under load (NFR-005) | A script against the staging copy |
| Manual | The five-person first-use check (NFR-004), set out in [the check sheet](nfr-004-check.md) | Done in person, with the results written down |

## Techniques

| Technique | Where we use it |
| --- | --- |
| Equivalence partitioning | Valid and invalid inputs, one case per group, such as a good title and a blank one |
| Boundary values | The length limits from P-01, and the overdue edge where the due time equals the reference time |
| Decision table | Combinations of role, scope and filter, and the permission matrix |
| State transition | The status table in P-02, both the moves that are allowed and the ones that are not |
| Error guessing | Inputs a person might try by mistake or on purpose, such as another user's reference or a script in a title |
| Fault injection | Forcing a failure while an event is written to prove the whole change rolls back |

## What the set covers

| Measure | Count |
| --- | --- |
| Cases designed | 49 |
| Unit | 5 |
| Black-box | 13 |
| API or integration | 26 |
| E2E | 3 |
| Performance | 1 |
| Manual | 1 |
| Negative cases | 22 |
| High priority cases | 37 |
| Black-box techniques used | Equivalence partitioning, boundary values, decision table, state transition |

Every requirement has at least one case. Priority follows the requirement. A case is High when it covers a Must requirement or a permission rule, and Medium otherwise.

## From design to evidence

A case is Designed when it is in this set. It becomes Passed or Failed when it runs. We record each run with the case identifier, the requirement, the commit, the environment, the input, the expected result, the actual result, the date and, for a failure, the defect. A failure goes in the Defect Register with a severity, a priority and a disposition.

The RTM carries the status of each case and links to its evidence. A case never shows Passed without a link to the run behind it.

## Test data

All users and requests are made up. The sample users are Thandi and Bongani (requesters), Sipho and Lerato (staff) and Mary (management). The performance data comes from the seed script, which builds the same mix of statuses and categories every time.

## Tools

Vitest for the first four levels, Playwright for the browser journeys, ESLint and the TypeScript compiler for static checks, and `npm audit` plus a secrets scan for the dependency check. The continuous integration workflow is where these run (TD-005, TD-006).
