# GitHub governance evidence

Version 0.1 working draft | Observed 9 September 2026 | Owner: Tristan Els | Status: **draft for team review, not an approved baseline**

Repository: `DewaldAllers/SEN381-CivicConnect`

SRC-MASTER section 9 (p. 11) treats GitHub as part of the engineering control environment rather than as file storage, and SRC-M1 section 3.1 (p. 4) requires progressive repository evidence from the start of M1. This document records what the repository actually shows, including where it does not meet the required controls. SRC-MASTER section 23 (p. 22) says a working feature that violates required configuration or review controls may lose marks, so recording the gap is worth more than presenting the repository as compliant.

Every statement below is either verifiable from the git history in this clone, or marked as needing a check that requires repository settings access. Nothing is claimed on the basis that it ought to be true.

## Required controls against observed state

| Control required by SRC-MASTER section 9 (p. 11) | Observed state on 9 September 2026 | How this was checked |
| --- | --- | --- |
| One controlled team repository | Met. One repository, default branch `main`. | Clone and remote listing |
| `main` protected and treated as the controlled product state | **Not met at the time of writing.** Protection was refused while the repository was private under a free plan, returning HTTP 403 with `Upgrade to GitHub Pro or make this repository public to enable this feature` on 2026-09-07. The repository was made public on 2026-09-09 under DEC-008, so protection is now available but the rules have not yet been applied. | API readback 2026-09-09 returns `visibility: public`. Protection rules require the repository owner's account to apply |
| No direct development on `main` for substantive changes | Partly met. Three feature branches exist and carry the substantive work. `main` received two commits from a branch that was merged about nine minutes after its first commit. | `git log origin/main` |
| Pull Requests required for substantive changes entering `main` | Met in form. PR #20 was used. | Merge commit `eef0aa9`, PR API |
| Minimum two approvals from members other than the author | **Not met.** The reviews endpoint for PR #20 returns an empty list. No approval of any kind was recorded. | `GET /repos/.../pulls/20/reviews` on 2026-09-09 returned zero entries |
| Self-approval not accepted | **Not met.** PR #20 was authored by `Liamdv12` and merged by `Liamdv12`. | PR API: `author: Liamdv12`, `merged_by: Liamdv12` |
| Review quality, no rubber-stamping | Not applicable. No review took place, so review quality cannot be assessed. PR #20 was open for one minute and fifty one seconds, from `2026-09-08T18:59:48Z` to `2026-09-08T19:01:39Z`. | PR API `created_at` and `merged_at` |
| Issues and tasks represent meaningful work | Partly met. One issue, #19, covers the Member 1 foundation work. Issue numbers #1 to #17 appear in a 7 September scaffold commit but are not present in the repository. | `GET /issues?state=all` on 2026-09-09 returns one non-PR issue |
| Secrets not committed | Met so far. No credential, key or token appears in any tracked file. `main` carries no `.gitignore`; one exists only on the Part 2 branch. | `git ls-files` and inspection of tracked content |
| History progressive and authentic | Mixed. See the section below. | `git log` across all branches |

## Observed history on main

`main` holds four commits as at 9 September 2026.

| Commit | Time | Author | Subject |
| --- | --- | --- | --- |
| `bbd2c78` | 2026-09-07 11:10:13 +0200 | DewaldAllers | Initial commit |
| `b64ad1b` | 2026-09-08 20:52:48 +0200 | Liamdv12 | Add README for CivicConnect PED documentation |
| `154ead6` | 2026-09-08 20:54:09 +0200 | Liamdv12 | Add files via upload |
| `eef0aa9` | 2026-09-08 21:01:39 +0200 | Liamdv12 | Merge pull request #20 from DewaldAllers/feature/m1-member1-foundation |

Three points follow from this history, recorded as observations rather than conclusions about any member's intent.

The same account authored all three commits and merged the pull request. The reviews endpoint for PR #20 returns an empty list, so no approval was recorded by anyone. SRC-MASTER section 9 (p. 11) requires a minimum of two approvals from team members other than the author and states that self-approval is not accepted. This control was not met for the content currently on `main`.

PR #20 was open for one minute and fifty one seconds. Even if an approval had been recorded inside that window, it could not have been the meaningful review section 9.1 (p. 11) describes.

The commit `154ead6` carries GitHub's default message for a web upload and adds a 34 KB `.docx` file. A binary document cannot be reviewed as a diff, so a reviewer can see that it changed but not what changed. SRC-M1 section 3.1 (p. 4) states that bulk uploads do not demonstrate a controlled engineering process. This does not make the content wrong, and Part 1 owns that decision, but it does limit what the repository can evidence about how the content was produced.

## Consequences already recorded

The branch protection gap was recorded as a decision and a risk before this history existed. [DEC-001](../docs/decisions/README.md#dec-001-create-a-private-team-repository) records the private repository choice and the entitlement consequence found afterwards. [DEC-006](../docs/decisions/README.md#dec-006-defer-the-response-to-the-branch-protection-gap) records why the team has not yet chosen between making the repository public, applying for an eligible plan, or continuing with the control as a written procedure.

[RSK-001](../docs/risks/README.md) forecast that a substantive change could reach `main` without the required approvals while nothing enforced the rule, and set a trigger saying its probability would rise to 3 if that happened. It happened the same evening. The entry now records the event rather than the forecast. [RSK-011](../docs/risks/README.md) forecast bulk upload patterns weakening the evidence of progressive work, and `154ead6` is an instance of that pattern.

Recording these before the event, and then recording the event against them, is what makes the register live rather than decorative.

## Part 3 branch conduct

The Part 3 work follows the procedure the team cannot enforce technically.

Work is on `m1-part3-risk-decisions-governance`, created from `main` and never committed to `main` directly. Each artefact was committed as a separate described change, so a reviewer can read the history in stages. No commit was backdated and no history was rewritten. The branch will reach `main` only through a pull request, and Part 3 will not merge its own pull request regardless of whether GitHub would allow it.

Four commits as at the time of writing: `c9870c8` index and references, `99fe627` decision log, `fa665fd` risk register, `6a88c36` forward engineering considerations.

## Actions arising

| Action | Owner | Status |
| --- | --- | --- |
| Check PR #20 for recorded approvals | Tristan | Done 2026-09-09. Zero reviews recorded |
| Decide the response to the protection gap, closing DEC-006 | All three | Done 2026-09-09. Repository made public under DEC-008 |
| Apply branch protection rules to `main` and read the settings back | Dewald, repository owner | Outstanding. Requires admin rights; see [rules to apply](#branch-protection-rules-to-apply) |
| Record PR #20 as a control not met at the baseline gate rather than leaving it unstated | All three | Outstanding |
| Re-review the content merged by PR #20 under a follow-up pull request, so it receives the review it did not get | Liam raises, Dewald and Tristan review | Outstanding |
| Add a `.gitignore` to `main` at integration | Tristan | Outstanding. One exists only on the Part 2 branch |
| Commit Part 1 content in a reviewable text format alongside the `.docx` | Liam | Outstanding. A binary cannot be reviewed as a diff |

## Branch protection rules to apply

The repository is public as of 2026-09-09, so these are available on the free plan. They require the owner's admin access. Settings, then Branches, then Add branch protection rule, with the branch name pattern `main`.

| Setting | Value | Which requirement it satisfies |
| --- | --- | --- |
| Require a pull request before merging | On | Direct development on `main` not permitted |
| Required number of approvals | 2 | Minimum two approvals |
| Dismiss stale pull request approvals when new commits are pushed | On | An approval should apply to the reviewed content, not to whatever arrives later |
| Require conversation resolution before merging | On | Review comments answered rather than ignored |
| Do not allow bypassing the above settings | On | Prevents an administrator merging around the rule, which would make the control cosmetic |
| Allow force pushes | Off | History stays authentic |
| Allow deletions | Off | The controlled product state cannot be removed |

GitHub does not offer a separate self-approval switch. Requiring two approvals from other accounts achieves it, because an author's own review does not count towards the required number.

After applying the rules, read them back and record the result here. SRC-M1 section 9.1 (p. 8) treats a citation to documentation as support for why a control matters, not as evidence that the team applied it.

## Recheck commands

These need an account with settings access on the repository. They were not run for this document, because the observations above were taken from git history in a clone.

```text
gh api repos/DewaldAllers/SEN381-CivicConnect/branches/main/protection
gh api repos/DewaldAllers/SEN381-CivicConnect/rulesets
gh api repos/DewaldAllers/SEN381-CivicConnect/collaborators
gh pr view 20 --repo DewaldAllers/SEN381-CivicConnect --json reviews,reviewDecision,author
```

The results are a dated observation, not a standing guarantee. Repository settings can change after the observation, so they should be rechecked at presentation time.

## References

Sources cited as SRC-MASTER, SRC-M1 and SRC-GH resolve in the [Part 3 index](../docs/part-3-index.md#references).
