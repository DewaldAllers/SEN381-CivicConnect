# Contribution and review procedure

Status: v0.2 proposed procedure; team agreement pending.

SRC-M1 section 3.1 requires progressive issues, commits, branches and Pull Requests (PRs). SRC-MASTER section 9, page 11, confirms protected main and two approvals from team members other than the author. These references are resolved in [sources](docs/sources.md).

1. Open or take an issue with an agreed owner and observable completion criteria. Do not assume another member has accepted an assignment.
2. Fetch main and work on a descriptive branch, such as `docs/m1-stakeholders`. The Codex-assisted Part 2 branch uses `codex/m1-part2-requirements-foundation`.
3. Make coherent changes with source locators and stable artefact IDs. Preserve other members' work; discuss overlapping changes in the issue/PR.
4. Commit actual stages with meaningful messages. Record AI assistance when material. Do not backdate commits, invent contributors or manufacture activity.
5. Open a PR linking the issue, changed artefacts, evidence, known gaps and validation performed. Draft PRs are appropriate for incomplete work.
6. Obtain approval from **both other registered team members**, who must have eligible repository access. Reviewers examine the actual diff, sources, IDs, acceptance criteria, assumptions and cross-artefact consequences. Approval is a human action; AI checks do not count.
7. After substantive changes, obtain renewed reviews of the current content. Resolve review conversations. Check both reviewers are non-authors and actual team members.
8. Merge only after the required reviews and outstanding governance conditions are resolved. Use a merge commit to preserve the individual staged commits. Never self-approve, impersonate a reviewer or use admin powers to bypass review.
9. Formal baseline sign-off is a separate recorded team/gate action. Merging a document does not automatically make it PED v1.0 or prove lecturer acceptance.

## Enforcement status

Main is currently **unprotected**: private-repository branch protection is unavailable under the account's current entitlement. The procedure above cannot technically prevent a direct push. See [dated observations](evidence/github-governance.md). Keep substantive work in PRs while this is resolved. Do not weaken the two-reviewer rule to work around access or entitlement limits.

Once protection is available, reconcile the Master Brief and configure two required approvals, administrator enforcement, stale approval dismissal, conversation resolution and force-push/deletion restrictions as applicable. Verify by reading the settings back. Do not add fictitious CI checks; CI implementation is outside M1 scope.

## Requirement and baseline changes

Use [change-request.md](templates/change-request.md). Preserve requirement IDs; never reuse a retired ID. Record old/new wording, reason/source, affected needs and scope, acceptance criteria, RTM, constraints, risks, future considerations and later design/test/release evidence. Analyse cost/schedule/quality consequences before approval. Keep superseded baseline versions and approval evidence locatable.
