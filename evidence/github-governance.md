# GitHub governance observations

Observed: 2026-09-07 | Repository: https://github.com/DewaldAllers/SEN381-CivicConnect

Status: partial setup; **protected-main compliance blocked**. Relevant source: SRC-M1 sections 1, 3.1 and 8 question 8; see [source register](../docs/sources.md).

| Item | Observed state | Evidence / consequence |
| --- | --- | --- |
| Authenticated account | DewaldAllers | GitHub CLI and connected profile agree |
| Existing repository check | Exact name absent before creation | Repository lookup failed; authenticated owner's repository list contained no match |
| Repository creation | Private, default branch main | API readback after creation confirms private=true and default_branch=main |
| Bootstrap | GitHub-generated README only | Initial main commit creates a branch for later PRs; no engineering baseline approved |
| Liamdv12 invitation | Pending, Write | Invitation ID 332002618; created 2026-09-07T09:10:28Z; invitation-list readback confirms pending |
| Tristan Els access | Not invited | User states username has not yet been provided; invitation deferred |
| Main protection | Unavailable; **not protected** | Protection endpoint returns HTTP 403: 'Upgrade to GitHub Pro or make this repository public to enable this feature.' |
| Rulesets alternative | Unavailable | Rulesets endpoint returns the same HTTP 403 entitlement error |
| Required two approvals | Documented procedure only; **not enforced** | Two other team members required by SRC-M1 page 7 question 8; full Master rules unverified |
| Merge options | Merge commits enabled; squash/rebase disabled | Repository-settings API readback; retains individual staged commits |
| Auto-merge | Disabled | Repository-settings API readback |
| Issues | Enabled | Repository-settings API readback |
| Work branch | codex/m1-part2-requirements-foundation | Substantive artefacts prepared for an unmerged PR |
| Human reviews/sign-off | None recorded | AI checks do not constitute human approvals |

## Resolving the enforcement gap

The user confirmed private visibility. No visibility change or paid plan purchase is authorised by this setup. GitHub documentation says private protected branches require an eligible plan. Resolve entitlement or obtain and record an explicit lecturer-approved alternative, then reconcile the missing Master Brief. Until then, the repository must not be presented as compliant with protected-main controls.

When protection is available, implement the required two non-author approvals and applicable stale-review, admin, conversation, force-push and deletion controls. Read settings back and capture authentic evidence. Do not create a CI workflow simply to simulate enforcement or bypass review.

## Recheck commands

```text
gh api repos/DewaldAllers/SEN381-CivicConnect/branches/main/protection
gh api repos/DewaldAllers/SEN381-CivicConnect/rulesets
gh api repos/DewaldAllers/SEN381-CivicConnect/invitations
gh pr list --repo DewaldAllers/SEN381-CivicConnect
```

Run with the user's authenticated access. Recheck invitation and PR status at presentation time; this is a dated observation, not a live guarantee.
