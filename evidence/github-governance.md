# GitHub governance evidence

Version 0.1 working draft | Observed 9 September 2026 | Owner: Tristan Els | Status: **draft for team review, not an approved baseline**

Repository: `DewaldAllers/SEN381-CivicConnect`

SRC-MASTER section 9 (p. 11) treats GitHub as part of the engineering control environment rather than as file storage, and SRC-M1 section 3.1 (p. 4) requires progressive repository evidence from the start of M1. This document records what the repository actually shows, including where it does not meet the required controls. SRC-MASTER section 23 (p. 22) says a working feature that violates required configuration or review controls may lose marks, so recording the gap is worth more than presenting the repository as compliant.

Every statement below is either verifiable from the git history in this clone, or marked as needing a check that requires repository settings access. Nothing is claimed on the basis that it ought to be true.

## Required controls against observed state

| Control required by SRC-MASTER section 9 (p. 11) | Observed state on 9 September 2026 | How this was checked |
| --- | --- | --- |
| One controlled team repository | Met. One repository, default branch `main`. | Clone and remote listing |
| `main` protected and treated as the controlled product state | **Not met.** Protection could not be enabled. The protection endpoint returned HTTP 403 with `Upgrade to GitHub Pro or make this repository public to enable this feature` on 2026-09-07, and the ruleset endpoint refused the same way. | Endpoint responses recorded 2026-09-07 by the repository owner. Needs recheck, see [commands](#recheck-commands) |
| No direct development on `main` for substantive changes | Partly met. Three feature branches exist and carry the substantive work. `main` received two commits directly from a branch that was merged nine minutes after it was created, see below. | `git log origin/main` |
| Pull Requests required for substantive changes entering `main` | Met in form. PR #20 was used. | Merge commit `eef0aa9` message |
| Minimum two approvals from members other than the author | **Not evidenced.** The author of all three commits in PR #20 is also the account that merged it. Whether any approval was recorded cannot be determined from git history. | `git log --format="%h author=%an"`. Needs check in the GitHub pull request view |
| Self-approval not accepted | **At risk.** See the entry above. | As above |
| Review quality, no rubber-stamping | Not evidenced yet. No review comments are visible in git history. | Needs check in the GitHub pull request view |
| Issues and tasks represent meaningful work | Not evidenced in this clone. Issue numbers #1 to #17 appear in a 7 September scaffold commit, and PR numbers reach #20. | Needs check in the GitHub issues view |
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

The same account authored all three commits and the merge. SRC-MASTER section 9 (p. 11) requires two approvals from members other than the author and does not accept self-approval. Git history cannot show whether an approval was recorded, so this needs checking in the pull request view before the team presents the repository as compliant. If no second and third approval exist, the honest position is to record it as a control that was not met, not to leave it unstated.

The elapsed time from first commit to merge was about nine minutes. A review inside that window is unlikely to be the meaningful review section 9.1 (p. 11) describes.

The commit `154ead6` carries GitHub's default message for a web upload and adds a 34 KB `.docx` file. A binary document cannot be reviewed as a diff, so a reviewer can see that it changed but not what changed. SRC-M1 section 3.1 (p. 4) states that bulk uploads do not demonstrate a controlled engineering process. This does not make the content wrong, and Part 1 owns that decision, but it does limit what the repository can evidence about how the content was produced.

## Consequences already recorded

The branch protection gap was recorded as a decision and a risk before this history existed. [DEC-001](../docs/decisions/README.md#dec-001-create-a-private-team-repository) records the private repository choice and the entitlement consequence found afterwards. [DEC-006](../docs/decisions/README.md#dec-006-defer-the-response-to-the-branch-protection-gap) records why the team has not yet chosen between making the repository public, applying for an eligible plan, or continuing with the control as a written procedure.

[RSK-001](../docs/risks/README.md) forecast that a substantive change could reach `main` without the required approvals while nothing enforced the rule. The history above is the first occasion where that could have happened, which moves the entry from forecast to something the team has to verify and respond to. [RSK-011](../docs/risks/README.md) forecast bulk upload patterns weakening the evidence of progressive work.

Recording these before the event, and then recording the event against them, is what makes the register live rather than decorative.

## Part 3 branch conduct

The Part 3 work follows the procedure the team cannot enforce technically.

Work is on `m1-part3-risk-decisions-governance`, created from `main` and never committed to `main` directly. Each artefact was committed as a separate described change, so a reviewer can read the history in stages. No commit was backdated and no history was rewritten. The branch will reach `main` only through a pull request, and Part 3 will not merge its own pull request regardless of whether GitHub would allow it.

Four commits as at the time of writing: `c9870c8` index and references, `99fe627` decision log, `fa665fd` risk register, `6a88c36` forward engineering considerations.

## Actions arising

| Action | Owner | Why |
| --- | --- | --- |
| Check PR #20 for recorded approvals and reviewers, and record the answer here | Tristan | The team cannot claim the two-approval control without knowing whether it was applied |
| If PR #20 has fewer than two non-author approvals, record it as a control not met and raise it at the baseline gate | All three | SRC-MASTER section 23 (p. 22) prefers an honest gap to an unsupported claim |
| Add a `.gitignore` to `main` at integration | Tristan | One exists only on the Part 2 branch |
| Decide the response to the protection gap, closing DEC-006 | All three | Currently deferred pending lecturer guidance and plan eligibility |
| Consider committing Part 1 content in a reviewable text format alongside the `.docx` | Liam | A binary file cannot be reviewed as a diff |

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
