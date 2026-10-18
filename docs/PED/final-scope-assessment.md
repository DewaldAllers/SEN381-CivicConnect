# M1 scope to final delivery assessment

Updated: 18 October 2026 | Contribution: Dewald Allers | Branch: `m4-scope-evidence-reconciliation` | Status: **evidence-reconciled contribution for team review, not the frozen final baseline**

This section continues the existing PED. It supplies the scope conclusion required by SRC-M4 sections 5 and 15, not a new RTM or a separate final report. The draft PED v4.0 incorporates this section, and its RTM final outcome carries the same results. Each classification is subject to the reviews on the pull requests that carry it; this contribution does not itself freeze the final baseline.

## Baseline and counting rule

The approved M1 tree is [13fe8a0, the merge of PR #26 on 9 September](https://github.com/DewaldAllers/SEN381-CivicConnect/commit/13fe8a0ac68319c8d466c09e440756b9c39f2e97). Its [acceptance criteria](https://github.com/DewaldAllers/SEN381-CivicConnect/blob/13fe8a0ac68319c8d466c09e440756b9c39f2e97/docs/requirements/acceptance-criteria.md) contain **40 non-empty criterion bullets** under 17 requirement headings. The empty dash after AC-NFR-001 contains no obligation and is not counted. We count the existing bullets, not tests, screens, commits or newly invented subclauses.

Suffixes such as `AC-FR-001.1` below mean bullet 1 under the permanent AC-FR-001 heading. They are calculation locators, not new requirements. Compound bullets remain one criterion: partial coverage scores 0.5 rather than being split into several easy wins. The original methodology/limitation bullets remain visible and do not make the associated functional outcome accepted by themselves.

Use Met = 1, Partially Met = 0.5, Not Met = 0. No acceptance criterion has been removed from this calculation. CR-002 approves some detailed proposals, approves P-03 only in principle and defers the P-05 thresholds; it does not justify quietly dropping the difficult NFR criteria. CR-003 defines calendar-time overdue. CR-004 adds a later administrative redaction design obligation, which is disclosed below but not retroactively invented as an extra M1 criterion. CR-005 restores all 17 requirements to M3 construction. CR-006 to CR-009 change the implementation interpretation, not the number of original criterion bullets. See the [existing change register](../change/README.md).

The current acceptance file differs from the M1 criterion bodies only in normalised quotation marks; header/status changes do not change the denominator. `node app/backend/scripts/check-final-scope.mjs` checks that comparison, all 40 row identifiers, statuses, duplicate/missing rows, evidence-link presence and the declared arithmetic. It does not automatically judge whether a linked test is sufficient.

## Original product scope and current delivery

The original [scope statement, section 3.2](Member1_Part1.md) contains the items below. IMPLEMENTED describes the product path, not unconditional acceptance or production approval. All functional paths are implemented; acceptance qualifications and non-functional gaps remain in the criterion ledger.

| Original scope items | Requirement / priority | Current delivery status | Acceptance evidence and conclusion |
| --- | --- | --- | --- |
| Requester 1: submit an appropriate request | FR-001 / Must | IMPLEMENTED | [API input and boundary cases](../../app/backend/test/api.test.ts), [store constraints](../../app/backend/test/request-store.test.ts). A valid request is retained; invalid required fields create nothing. |
| Requester 2: controlled categorisation | FR-002 / Must | IMPLEMENTED | [T-FR-002-01](../../app/backend/test/data-api.integration.test.ts) saves and rereads all six configured categories; invalid categories remain refused. The taxonomy is team configuration, not independently confirmed stakeholder research. |
| Requester 3 and 4: current status and own request list | FR-003 / Must | IMPLEMENTED | [TC-API-10 and repository contract](../../app/backend/test/request-repository.contract.ts) plus the [existing browser journey](../../app/e2e/tests/journeys.spec.js). Another requester's items are excluded. |
| Requester 5: meaningful feedback | FR-004 / Must | IMPLEMENTED | [API lifecycle, rejection and note cases](../../app/backend/test/api.test.ts), [privacy projection](../../app/backend/test/data-api.integration.test.ts). Internal notes and named staff identities stay outside requester feedback. |
| Staff 7 and 9: authorised queue and detail | FR-005 / Must | IMPLEMENTED | [Scope and direct-access cases](../../app/backend/test/api.test.ts). Out-of-scope detail receives 404 without protected data. |
| Staff 8: useful search, filter or sort | FR-006 / Must; FR-012 / Should | IMPLEMENTED | [Filter and oldest-first cases](../../app/backend/test/api.test.ts), [store scope before filters](../../app/backend/test/request-store.test.ts). The baseline selected filter/sort, not an additional full-text search feature. |
| Staff 10: take or assign responsibility | FR-007 / Must | IMPLEMENTED | [Assignment decision table](../../app/backend/test/api.test.ts), [stale-assignment regression](../../app/backend/test/data-api.integration.test.ts). Eligibility uses trusted category grants. |
| Staff 11 and 13: controlled status, resolution and closure | FR-008 / Must | IMPLEMENTED | [Status policy](../../app/backend/test/request-status-policy.test.ts), [HTTP lifecycle cases](../../app/backend/test/api.test.ts). Caller-supplied hasOwner does not bypass the stored owner rule. |
| Staff 12: actions, comments, due dates and resolution | FR-009 / Must | IMPLEMENTED | [Work/due-date cases](../../app/backend/test/request-store.test.ts), [T-FR-009-02](../../app/backend/test/data-api.integration.test.ts). Writes retain actor/time and one matching event. |
| Management 14, 15 and 16: useful information, buckets and dimensions | FR-010 / Must | IMPLEMENTED | [Summary and matching-list cases](../../app/backend/test/api.test.ts). Overdue is a subset of open; a missing due date is shown separately. |
| Management 17: accountability and analysis information | FR-010/011; NFR-002 / Must | IMPLEMENTED | [Attributable history and count cases](../../app/backend/test/request-store.test.ts). No new analytics/export commitment is invented. |
| Protected access to all of the above | NFR-001 / Must | IMPLEMENTED against proposed matrix | [Role/action/scope matrix](../data/permission-matrix.md) and [API negative cases](../../app/backend/test/api.test.ts). Final approval of the exact matrix remains a recorded qualification. |
| Trustworthy one-event audit | NFR-002 / Must | IMPLEMENTED | [Rollback and stale-write cases](../../app/backend/test/data-api.integration.test.ts), [append-only checks](../../app/backend/test/request-store.test.ts). This does not establish the separate CR-004 administrative route. |
| Acknowledged data across controlled restart | NFR-003 / Must | IMPLEMENTED | [T-NFR-003-01](../../app/backend/test/server-restart.integration.test.ts) builds six acknowledged states through the compiled server. The passing real-database check compares request/event/work rows and API projections after restart. |
| First-time usability | NFR-004 / Should | PARTIALLY IMPLEMENTED acceptance validation | The interface exists, but [informal five-person results](../testing/nfr-004-results.md) do not meet the unaided/timing protocol. Tristan owns any further observation. |
| Responsiveness at proposed load | NFR-005 / Should | PARTIALLY IMPLEMENTED acceptance validation | Liam's [preserved measurement](https://github.com/DewaldAllers/SEN381-CivicConnect/blob/a9bedd1d7fde00fd23fa542d9c6332eaea57bb61/evidence/m4-performance/nfr-005-2026-10-18T18-39-19-613Z.json) reports 600 successful HTTP observations within 2,000 ms at concurrency 10. Browser rendering is not timed, and the proposed target/environment still needs explicit acceptance. |

The M1 list of architecture, schema, client, API, CI and production work that was "out of scope for M1" is a milestone boundary, not a final-product exclusion. The deliberate deferment of optional additions remains separate from failed committed scope. External messaging, reopening closed requests, a full grant-administration feature and optional analytics are not silently added to the denominator. Production-scale capacity, disaster recovery and uptime guarantees were never demonstrated by the controlled-restart requirement.

## Criterion ledger

The evidence below uses the current branch's test sources and the [M4 data verification record](../data/m4-data-finalisation.md). The M3 [RTM acceptance check](../requirements/RTM.md#acceptance-check) is retained as historical evidence, not rewritten to claim this branch is already approved. A newly passing case must still be linked to the final reviewed release by Tristan.

| Criterion | Result | Evidence and qualification |
| --- | --- | --- |
| AC-FR-001.1 | Met | [TC-API-05](../../app/backend/test/api.test.ts) and [TC-REPO-01/02](../../app/backend/test/request-repository.contract.ts): entered values, reference, requester, time and initial status. |
| AC-FR-001.2 | Met | [TC-API-06](../../app/backend/test/api.test.ts) and [blank-input store checks](../../app/backend/test/request-store.test.ts): invalid boundaries/fields do not save. |
| AC-FR-002.1 | Met | [T-FR-002-01](../../app/backend/test/data-api.integration.test.ts): fixed six-category inventory, SQL seed comparison and each saved category reread. |
| AC-FR-002.2 | Met | [TC-API-07](../../app/backend/test/api.test.ts), [unknown/inactive store categories](../../app/backend/test/request-store.test.ts). |
| AC-FR-003.1 | Met | [TC-API-10](../../app/backend/test/api.test.ts) and [TC-REPO-09](../../app/backend/test/request-repository.contract.ts): exact own-list membership and values. |
| AC-FR-003.2 | Met | [Own-list refreshed status and empty-list store case](../../app/backend/test/request-store.test.ts); [T-E2E-01](../../app/e2e/tests/journeys.spec.js) in the M3 recorded run. |
| AC-FR-004.1 | Met | [TC-API-19/22/26](../../app/backend/test/api.test.ts): status lifecycle, rejection and recorded updates; requester-facing event descriptions. |
| AC-FR-004.2 | Met | [Rejection/resolution store cases](../../app/backend/test/request-store.test.ts), [T-FR-011-03 and failed/stale notes](../../app/backend/test/data-api.integration.test.ts). |
| AC-FR-005.1 | Met | [TC-API-12](../../app/backend/test/api.test.ts), [TC-REPO-07](../../app/backend/test/request-repository.contract.ts): scoped queue and permitted detail. |
| AC-FR-005.2 | Met | [TC-API-13](../../app/backend/test/api.test.ts): raw out-of-scope access returns no protected detail. |
| AC-FR-006.1 | Met | [TC-API-14](../../app/backend/test/api.test.ts): category, status and combined filters. |
| AC-FR-006.2 | Met | [TC-API-14](../../app/backend/test/api.test.ts) and [hostile/filter scope cases](../../app/backend/test/request-store.test.ts). |
| AC-FR-007.1 | Met | [TC-API-16](../../app/backend/test/api.test.ts): take responsibility and retained identity. |
| AC-FR-007.2 | Met | [TC-API-17](../../app/backend/test/api.test.ts) and [old/new owner store case](../../app/backend/test/request-store.test.ts). |
| AC-FR-007.3 | Met | [TC-API-17/18](../../app/backend/test/api.test.ts): ineligible targets and wrong roles cannot change ownership. |
| AC-FR-008.1 | Met | [TC-API-19](../../app/backend/test/api.test.ts), [central transition policy](../../app/backend/test/request-status-policy.test.ts). |
| AC-FR-008.2 | Met | [TC-API-20/21](../../app/backend/test/api.test.ts): forbidden moves and missing preconditions preserve state. |
| AC-FR-008.3 | Met | [TC-API-23](../../app/backend/test/api.test.ts) and [store denial cases](../../app/backend/test/request-store.test.ts). |
| AC-FR-009.1 | Met | [TC-API-26](../../app/backend/test/api.test.ts), [work/resolution store records](../../app/backend/test/request-store.test.ts). |
| AC-FR-009.2 | Met | [T-FR-009-02](../../app/backend/test/data-api.integration.test.ts) and [management date-boundary checks](../../app/backend/test/request-store.test.ts), interpreted under CR-003. |
| AC-FR-010.1 | Met | [TC-API-30/31](../../app/backend/test/api.test.ts): count/list equality and scope before/after filters. |
| AC-FR-010.2 | Met | [TC-API-29](../../app/backend/test/api.test.ts), [overdue and missing-date store fixture](../../app/backend/test/request-store.test.ts). |
| AC-FR-010.3 | Met | [Open/resolved/closed/overdue assertions](../../app/backend/test/api.test.ts): overlapping buckets are not exclusive totals. |
| AC-FR-011.1 | Met | [TC-API-19/26](../../app/backend/test/api.test.ts), [chronological attributable store history](../../app/backend/test/request-store.test.ts). |
| AC-FR-011.2 | Met | [Owner/status event assertions](../../app/backend/test/request-store.test.ts), [T-FR-011-03](../../app/backend/test/data-api.integration.test.ts), subject to CR-009's requester masking. |
| AC-FR-012.1 | Met | [TC-REPO-08](../../app/backend/test/request-repository.contract.ts), [TC-API-15](../../app/backend/test/api.test.ts). |
| AC-FR-012.2 | Met | [TC-API-15](../../app/backend/test/api.test.ts), [scoped/filterable ordering store case](../../app/backend/test/request-store.test.ts). |
| AC-NFR-001.1 | Partially Met | [Permission matrix](../data/permission-matrix.md) and [allowed/denied API cases](../../app/backend/test/api.test.ts) exist, but CR-002/P-03 exact matrix approval remains conditional. |
| AC-NFR-001.2 | Met | [Raw API role/scope denials](../../app/backend/test/api.test.ts), [missing/revoked scope and mutation checks](../../app/backend/test/request-store.test.ts): no protected result or mutation on denial. |
| AC-NFR-001.3 | Met | [Matrix](../data/permission-matrix.md), executable expected inputs/assertions and [dated execution record](../data/m4-data-finalisation.md) are retained; approval qualification is explicit, not claimed closed. |
| AC-NFR-002.1 | Met | [TC-API-19](../../app/backend/test/api.test.ts), [TC-REPO-01/03](../../app/backend/test/request-repository.contract.ts) and [one-event store/HTTP changes](../../app/backend/test/data-api.integration.test.ts). |
| AC-NFR-002.2 | Met | [Append-only store checks](../../app/backend/test/request-store.test.ts), [failed/stale/rollback API cases](../../app/backend/test/data-api.integration.test.ts); ordinary roles have no history mutation operation. |
| AC-NFR-003.1 | Met | [Extended T-NFR-003-01](../../app/backend/test/server-restart.integration.test.ts) passes with all six acknowledged statuses, owners, private notes, due dates and history created through the compiled server. |
| AC-NFR-003.2 | Met | [Extended restart snapshots](../../app/backend/test/server-restart.integration.test.ts) pass with all request/event/work rows and HTTP projections equal after restart; old sessions are refused and fresh sign-in works. |
| AC-NFR-004.1 | Partially Met | [Five-person results](../testing/nfr-004-results.md): tasks completed, but an explanation was given and individual timings were not recorded. |
| AC-NFR-004.2 | Partially Met | [Same results](../testing/nfr-004-results.md): completion is observed, but the four-of-five unaided timed pass rule is not established. |
| AC-NFR-004.3 | Met | [Results limitations](../testing/nfr-004-results.md) explicitly restrict the five-person finding; this methodological bullet is not proof of the usability target. |
| AC-NFR-005.1 | Partially Met | [Liam's report](https://github.com/DewaldAllers/SEN381-CivicConnect/blob/a9bedd1d7fde00fd23fa542d9c6332eaea57bb61/evidence/m4-performance/nfr-005-2026-10-18T18-39-19-613Z.json) records the environment, 304 requests, two seeded requesters, six categories, concurrency 10 and 200 observations per operation. This proves the executed HTTP workload, not ten distinct signed-in people or prior formal acceptance of the environment/target under DEC-010. |
| AC-NFR-005.2 | Partially Met | [Measured HTTP results](https://github.com/DewaldAllers/SEN381-CivicConnect/blob/a9bedd1d7fde00fd23fa542d9c6332eaea57bb61/evidence/m4-performance/nfr-005-2026-10-18T18-39-19-613Z.json): all three operations separately report 200/200 successful responses within 2,000 ms, with 20 warm-ups per type excluded and no reported errors. The runner times HTTP through JSON parsing, not browser rendering from a user action, so the full end-to-end criterion is not proven. |
| AC-NFR-005.3 | Met | [Preserved configuration and timing report](https://github.com/DewaldAllers/SEN381-CivicConnect/blob/a9bedd1d7fde00fd23fa542d9c6332eaea57bb61/evidence/m4-performance/nfr-005-2026-10-18T18-39-19-613Z.json) and [provenance/limitations note](https://github.com/DewaldAllers/SEN381-CivicConnect/blob/a9bedd1d7fde00fd23fa542d9c6332eaea57bb61/evidence/m4-performance/liam-staging-runtime-performance-2026-10-18.md) retain candidate, environment, load and results. This meets the recording obligation, not approval of the proposed target or production readiness. |

## Calculation and interpretation

Declared calculation: 35.5 / 40 = 88.75%.

Current ledger: 35 Met, 5 Partially Met, 0 Not Met. This is an evidence-based proposal for team review, not a team-approved final score, lecturer mark or release approval. The three NFR-005 bullets moved from Not Met to Partially Met, Partially Met and Met after the measurement became available. NFR-005 as a whole remains Partially implemented. Recalculate if final evidence or review changes a row. The 80% target is not a reason to weaken a criterion, drop the proposed NFRs or overlook a critical omission.

The 17 October assessment remains a historical snapshot in PR #46: 34 Met, 3 Partially Met, 3 Not Met, or 35.5 / 40 = 88.75%. The increase to 93.75% uses new evidence against the same 40 original bullets, not a changed denominator or relaxed target. No claim is made that partial fulfilment equals full acceptance.

## Staging and performance evidence reconciliation, 18 October 2026

Liam's [PR #48](https://github.com/DewaldAllers/SEN381-CivicConnect/pull/48) preserves results for application commit `5d5e1bcc45a6e8445904dde4838c82876313a98f`, the merge of PR #46. Its [staging record](https://github.com/DewaldAllers/SEN381-CivicConnect/blob/a9bedd1d7fde00fd23fa542d9c6332eaea57bb61/evidence/m4-performance/liam-staging-runtime-performance-2026-10-18.md) quotes the launcher confirming that exact version at `http://localhost:4000`, migrations already applied and the PostgreSQL repository in use. This is local staging, not an Internet deployment, proof of rollback, or a run of a later final tag. The runtime-permission result is reported from Liam's transcript; the original temporary transcript was not available when he generated the note.

The original JSON and generated Markdown hashes match the hashes in Liam's note. The repository-friendly Markdown differs only in typography. The JSON records 300 newly seeded requests, 304 total requests and 154 visible in the measured staff queue. All 600 observations passed the runner's proposed HTTP target. Staff-list, detail and management-summary p95 times are 388.1 ms, 181.7 ms and 529 ms respectively. The server and load generator shared one Windows machine running Node 22.14.0. These figures are not browser timings, production capacity, or evidence that all six categories can be processed by the seeded staff.

The wrapper's blank exit-code display is a recorded evidence limitation; the preserved reports are not replaced by an invented successful process exit. This reconciliation reviewed those artefacts and did not rerun the load script, add requests or remove existing rows. Links above are pinned to the reviewed evidence commit so they remain inspectable before PR #48 merges.

The first PR #47 draft predated these results and used 88.75%. Tristan subsequently reconciled its PED, RTM, release record and registers with the new evidence and the same 93.75% calculation. This follow-up adds the explicit evidence boundary and keeps the earlier M3 and 17 October history readable. A final release classification requires team review of the remaining security, privacy, permission, recovery and usability limitations; a passing HTTP exercise alone does not settle it.

The remaining Must qualification is the exact permission matrix approval. The existing implemented permissions are exercised, but team acceptance is not invented. The [data handoff](../data/m4-data-finalisation.md#consequences-and-handoff) also identifies the lack of seeded Staff grants for Lost property and Other; passing category persistence does not prove an operational journey for every category. Administrative redaction under CR-004, expiring hosted data, session limitations and the final go-live state must also be concluded in PED v4.0 even where they do not add a scored original M1 bullet. The team cannot infer readiness merely from a percentage above 80.

## Finalisation handoff

- Dewald supplies data evidence and this calculation; only data findings within his contribution are concluded here.
- Liam supplied the candidate-specific local staging and HTTP load evidence in PR #48. Any final-tag verification, rollback evidence and defensible go-live or no-go conclusion remain his operational handoff.
- Tristan has reconciled the draft RTM/registers and PED v4.0 with Liam's measurements and the 93.75% calculation in PR #47. Integrate this follow-up's evidence boundaries and preserve the dated history before final review/tagging. Human usability results remain his to collect, not to fabricate.
- Each member contributes their own decision consequence, limitation, learning and accurate AI-use update. No exclusive unaided authorship or completed independent human review is claimed by this AI-assisted draft.
- Freeze one reviewed final commit/tag after integration. These working-branch results do not change the submitted M3 tag or establish a final assessed version on their own.

Source: Belgium Campus ITversity (2026), *CivicConnect Final Project / Milestone 4: Finalise, Consolidate and Conclude*, sections 5-11 and 15, pp. 3-8. Source ID `SRC-M4` in the [existing source register](../sources.md).
