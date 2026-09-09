# Engineering Decision Log

Version 0.1 working draft | 8 September 2026 | Owner: Tristan Els | Status: **draft for team review, not an approved baseline**

This log records decisions the team has actually taken, and decisions it has deliberately left open because the evidence needed to choose is not available yet. It does not record intentions or plans. SRC-MASTER section 13 (p. 13) sets the fields; SRC-M1 section 3 (p. 3) limits M1 to genuine decisions already made and justified deferment.

A deferred decision is a real engineering decision. It commits the team to a position (do not choose yet), states what evidence would settle it, and names the trigger to revisit. SRC-M1 section 4 (p. 4) treats deferment as acceptable and often correct when the team can say what is still missing.

## Status of approvals

No entry in this log has been approved by the team yet. Two of the entries were authorised by an individual member acting within their own part, and the rest are proposals from Part 3. The Master Brief requires two approvals from members other than the author before a substantive change enters `main` (SRC-MASTER section 9, p. 11), so approval is recorded through the Part 3 pull request, not by editing this line.

| ID | Date | Decision | Type | Authority so far | Status |
| --- | --- | --- | --- | --- | --- |
| [DEC-001](#dec-001-create-a-private-team-repository) | 2026-09-07 | Create one private team repository | Taken | Individual (repository owner) | Executed, consequence now known |
| [DEC-002](#dec-002-defer-requirements-until-the-master-brief-was-located) | 2026-09-07 | Do not derive requirements until the Master Brief was located | Taken | Individual (Part 2 owner) | Closed 2026-09-07 |
| [DEC-003](#dec-003-branch-and-pull-request-workflow-instead-of-committing-to-main) | 2026-09-07 | Work on feature branches, merge through pull requests | Taken | Individual, applied by both active members | In force |
| [DEC-004](#dec-004-keep-part-3-on-its-own-branch-and-reuse-the-agreed-folder-paths) | 2026-09-08 | Keep Part 3 on its own branch, reuse agreed folder paths, do not edit another member's files | Taken | Part 3 owner | In force |
| [DEC-005](#dec-005-use-a-3-3-probability-and-impact-scale) | 2026-09-08 | Rate risks on a 3 by 3 probability and impact scale | Taken | Part 3 owner, proposed to team | Proposed |
| [DEC-006](#dec-006-defer-the-response-to-the-branch-protection-gap) | 2026-09-08 | Do not change repository visibility or buy a plan to obtain branch protection | Deferred | Part 3 owner, needs team and lecturer input | Closed 2026-09-09, superseded by DEC-008 |
| [DEC-007](#dec-007-defer-stack-architecture-persistence-ci-and-deployment-platform) | 2026-09-08 | Do not select stack, architecture, persistence, CI or deployment platform | Deferred | Part 3 owner, proposed to team | Open |
| [DEC-008](#dec-008-make-the-repository-public-to-obtain-branch-protection) | 2026-09-09 | Make the repository public so that branch protection becomes available | Taken | Team | Executed, protection applied and confirmed 2026-09-09 |

---

## DEC-001 Create a private team repository

| Field | Entry |
| --- | --- |
| Context | The team needed one controlled repository before any artefact could be version controlled. SRC-MASTER section 9 (p. 11) requires one controlled team repository and treats GitHub as an engineering control, not file storage. |
| Constraints | No budget. Free GitHub accounts. Coursework under academic integrity rules. |
| Alternatives | Public repository. Private repository. A GitHub organisation holding the repository. |
| Decision | Create `DewaldAllers/SEN381-CivicConnect` as a private repository with default branch `main`, on 2026-09-07. |
| Rationale | Private visibility keeps unfinished coursework away from other teams while the baseline is unsettled. |
| Trade-offs | Visibility was traded against plan entitlement. That trade was not visible to the team at the time the choice was made. |
| Risks | Recorded as [RSK-001](../risks/README.md). |
| Evidence | Repository exists and is private. Governance readback is dated 2026-09-07 in [GitHub governance evidence](../../evidence/github-governance.md). |
| Later consequence | GitHub refused branch protection on a private repository under a free plan, returning HTTP 403 with the message `Upgrade to GitHub Pro or make this repository public to enable this feature`. The repository ruleset endpoint refused the same way. The two-approval control the brief requires was therefore procedural and not enforced for the first two days of the project, and on 2026-09-08 an unreviewed change reached `main` during that window. This consequence was found after the decision, not predicted before it. Reversed on 2026-09-09 by [DEC-008](#dec-008-make-the-repository-public-to-obtain-branch-protection). |
| Would the team decide differently | The private choice was reasonable on the evidence available on 2026-09-07. Nothing in the GitHub repository creation flow states that branch protection depends on visibility under a free plan, and the team found out only when it tried to apply the control. The learning is not that private was wrong, but that a required control should be tested at the point the environment is set up, not assumed to be available. |
| Revisit trigger | Closed by DEC-008. |

## DEC-002 Defer requirements until the Master Brief was located

| Field | Entry |
| --- | --- |
| Context | Work started from the Milestone 1 brief while the governing Master Project Brief had not been located. SRC-M1 section 1 (p. 1) names the Master Brief as the governing document and says a requirement is not removed because M1 does not repeat it. |
| Constraints | M1 requires requirements traceable to a stakeholder or source (SRC-MASTER section 11, p. 12). No CivicConnect scenario was available at the time. |
| Alternatives | Derive plausible requirements from the milestone brief alone and correct them later. Wait for the Master Brief. Ask the lecturer and pause. |
| Decision | Do not derive functional or non-functional requirements until the Master Brief was in hand. |
| Rationale | Requirements invented without a source cannot be traced, and a traceability matrix built on invented sources would have to be rebuilt rather than corrected. |
| Trade-offs | Cost time early in the milestone in exchange for avoiding rework across requirements, acceptance criteria and the RTM. |
| Risks | Schedule pressure later in the milestone. Related to [RSK-008](../risks/README.md). |
| Evidence | Source register entry for SRC-MASTER records the brief being located on the course portal and read on 2026-09-07. Requirements were first committed on 2026-09-08 (`b188d7a`). |
| Later consequence | The brief was located the same day, so the delay was under one day. The requirements drafted afterwards cite specific Master Brief sections and pages instead of assumptions. |
| Revisit trigger | Closed. No longer open. |

## DEC-003 Branch and pull request workflow instead of committing to main

| Field | Entry |
| --- | --- |
| Context | SRC-MASTER section 9 (p. 11) does not permit direct development on `main` for substantive controlled changes and requires pull requests with two approvals from members other than the author. SRC-M1 section 3.1 (p. 4) requires progressive repository evidence from the start of M1, including for documentation. |
| Constraints | Branch protection is unavailable, so the workflow depends on team discipline. Three members, each owning a separate part. |
| Alternatives | Commit documentation straight to `main` and use pull requests only for application code. One shared branch for all three members. One branch per member, merged by pull request. |
| Decision | Each member works on their own feature branch and merges to `main` only through a pull request. Documentation is treated as a substantive change, not an exception. |
| Rationale | The brief assesses documentation as controlled artefact evidence, so it needs the same controls as code. Separate branches let three members work in parallel without blocking each other. |
| Trade-offs | Slower than committing directly, and it needs both other members available to review. It also creates merge work at integration, since three branches touch the same PED. |
| Risks | Reviewer availability. Recorded as [RSK-002](../risks/README.md). |
| Evidence | Branches `m1-part2-requirements-foundation`, `m1-part3-risk-decisions-governance` and `feature/m1-member1-foundation`. `main` still holds only the initial commit `bbd2c78`. |
| Later consequence | Commits are staged and readable per change instead of arriving as one upload. SRC-MASTER section 23 (p. 22) gives limited or no credit to evidence reconstructed immediately before assessment, so the staged history matters. |
| Revisit trigger | Integration of the three parts into PED v1.0, when the merge order has to be agreed. |

## DEC-004 Keep Part 3 on its own branch and reuse the agreed folder paths

| Field | Entry |
| --- | --- |
| Context | A repository scaffold committed on 2026-09-07 (`554f981`) created folder paths for every PED area, then removed the paths outside Part 2 so that branch held one member's work only. The Part 3 folders were left unclaimed. |
| Constraints | Three branches will merge into one PED. Two members are editing at the same time. `docs/sources.md` is owned by Part 2. |
| Alternatives | Invent new Part 3 folder paths. Reuse the paths from the 7 September scaffold. Wait for Parts 1 and 2 to merge first, then add Part 3 on top. |
| Decision | Reuse the scaffold paths `docs/risks/`, `docs/forward-engineering/`, `docs/decisions/` and `evidence/github-governance.md`. Do not edit `docs/sources.md` or `README.md` before integration. Repeat the cited source identifiers in the Part 3 index instead. |
| Rationale | Reusing the agreed paths means the three branches merge without path conflicts. Not editing another member's files avoids conflicts in exactly the files most likely to be edited at the same time. |
| Trade-offs | The source register is duplicated in two places until integration, which is a known inconsistency, not an accident. Waiting for the other branches would have been cleaner but would have left Part 3 with no progressive commit history. |
| Risks | Duplicate reference lists could disagree at integration. Recorded as [RSK-003](../risks/README.md). |
| Evidence | Commit `c9870c8` on `m1-part3-risk-decisions-governance`. |
| Later consequence | Integration has to merge the two reference lists into `docs/sources.md` and delete the integration note in the Part 3 index. That work is known now instead of being discovered at sign-off. |
| Revisit trigger | PED v1.0 integration. |

## DEC-005 Use a 3 by 3 probability and impact scale

| Field | Entry |
| --- | --- |
| Context | SRC-MASTER section 12 (p. 12) requires probability, impact and priority on every risk, and rejects vague entries. A rating scale has to be defined before risks can be ranked, otherwise priority is opinion. |
| Constraints | Three students, one milestone, no historical project data to calibrate probabilities against. |
| Alternatives | A 5 by 5 scale. A 3 by 3 scale. Qualitative ratings with no arithmetic. |
| Decision | Rate probability and impact from 1 to 3 each, with written definitions, and set priority from the product. |
| Rationale | A 5 by 5 scale implies precision the team cannot support with no historical data, and the middle bands would be guesses dressed as measurements. A 3 by 3 scale forces a decision between low, medium and high, which the team can defend. |
| Trade-offs | Less discrimination between risks. Several risks share the same score, so the register needs written justification per risk, because rank order alone does not separate them. |
| Risks | Two risks with the same score may need different responses. The register carries a note where that happens. |
| Evidence | Scale definitions in the [Risk Register](../risks/README.md). |
| Later consequence | Risks reviewed at M2, M3 and M4 have to use the same scale, or the trend across milestones is meaningless. |
| Revisit trigger | The team disagrees with a rating during review, or a milestone review finds the three bands too coarse. |

## DEC-006 Defer the response to the branch protection gap

| Field | Entry |
| --- | --- |
| Context | `main` cannot be protected on this repository. The endpoint returns HTTP 403 with `Upgrade to GitHub Pro or make this repository public to enable this feature`, and the ruleset endpoint refuses the same way. SRC-MASTER section 9 (p. 11) requires protected `main` and two non-author approvals. |
| Constraints | No budget for a paid plan. Repository visibility belongs to the whole team, and possibly to the lecturer. Milestone 1 is due 2026-09-09. |
| Alternatives | Make the repository public, which enables branch protection immediately at no cost. Apply for the GitHub Student Developer Pack for free Pro. Buy GitHub Pro. Keep the repository private, record the gap, and operate the control by agreement. |
| Decision | Do not choose yet. Keep the repository private for now, record the gap openly, and operate the two-approval rule as a documented procedure until the team and the lecturer have decided. |
| Rationale | Making a coursework repository public affects academic integrity for all three members and is not one member's decision to take. The Student Developer Pack is free but its approval time is outside the team's control and may not arrive before the deadline. Buying a plan is outside the cost constraint in SRC-MASTER section 4 (p. 8). |
| Trade-offs | The team presents a control it follows but cannot enforce. Declaring that openly costs less than claiming compliance the repository does not show, because an assessor can read the settings. SRC-MASTER section 23 (p. 22) says a working feature that violates required controls may lose marks, and section 15 (p. 14) says quality claims need evidence. |
| Risks | An unreviewed or force-pushed change reaches `main` while nothing enforces the rule. Recorded as [RSK-001](../risks/README.md). |
| Evidence | Dated endpoint responses in [GitHub governance evidence](../../evidence/github-governance.md). |
| Missing information | Whether the lecturer permits or expects a public coursework repository. Whether any team member already holds an eligible plan. Whether the Student Developer Pack application would be approved before 2026-09-09. |
| Later consequence | Closed on 2026-09-09. The team resolved the missing information by deciding to make the repository public, which removed the entitlement barrier at no cost. See [DEC-008](#dec-008-make-the-repository-public-to-obtain-branch-protection). The deferment lasted about one day and cost nothing, because no design or implementation work depended on it. |
| Revisit trigger | Closed. |

## DEC-008 Make the repository public to obtain branch protection

| Field | Entry |
| --- | --- |
| Context | [DEC-006](#dec-006-defer-the-response-to-the-branch-protection-gap) left the response to the branch protection gap open. On 2026-09-08 an unreviewed change reached `main` while nothing enforced the two-approval rule, which turned the forecast in [RSK-001](../risks/README.md) into an actual event and made the deferment costly to continue. |
| Constraints | No budget for a paid plan (SRC-MASTER section 4, p. 8). Milestone 1 due 2026-09-09. Branch protection on a free plan requires a public repository. |
| Alternatives | Keep the repository private and continue with an unenforceable procedure. Apply for the GitHub Student Developer Pack and wait. Buy GitHub Pro. Make the repository public. |
| Decision | Make the repository public. Confirmed public on 2026-09-09 by API readback showing `visibility: public`. |
| Rationale | It is the only option that removes the entitlement barrier at no cost and within the schedule. The Student Developer Pack approval time is outside the team's control, and buying a plan breaks the cost constraint. |
| Trade-offs | Coursework becomes readable by anyone, including other teams. The team accepts a plagiarism exposure it cannot control in exchange for a mandatory control it can now enforce. The repository holds no secrets or personal data, so the exposure is limited to the team's own written work. |
| Risks | Other teams could copy the artefacts. This does not remove the team's own accountability, and the commit history shows authorship and dates. Recorded as a residual risk, not mitigated away. |
| Evidence | API readback on 2026-09-09 returns `private: False` and `visibility: public`. Recorded in [GitHub governance evidence](../../evidence/github-governance.md). |
| Later consequence | Branch protection was applied the same morning and confirmed by API readback returning `protected: true` for `main`. Making the setting available was not the same as configuring it, so the control was only met once the rules existed and were read back. |
| Revisit trigger | Lecturer instruction to make coursework repositories private, or completion of the module. |

## DEC-007 Defer stack, architecture, persistence, CI and deployment platform

| Field | Entry |
| --- | --- |
| Context | SRC-M1 section 5 (pp. 4-5) states that final technology stack, final architecture, database schema, UI implementation, API implementation, CI pipeline and production deployment are not M1 deliverables. SRC-MASTER section 18.1 (pp. 15-16) makes technology selection an assessed engineering decision requiring evidence. |
| Constraints | Belgium Campus does not guarantee that any chosen stack is available or supported on institutional machines (SRC-MASTER section 25, p. 23). Team capability and learning curve are part of the selection (SRC-MASTER section 18.1, p. 15). Free or low cost is preferred (SRC-MASTER section 4, p. 8). |
| Alternatives | Choose the stack now from familiarity and start building. Choose now and record the reasoning at M2. Defer and record the criteria the choice must satisfy. |
| Decision | Do not select the stack, architecture, persistence, CI or deployment platform during M1. Record the criteria the M2 decision has to satisfy instead. |
| Rationale | The requirements are still a draft with five open proposals, so the quality attributes that should drive the choice are not settled. Choosing now would mean choosing against requirements that may change, and the brief asks teams to justify the choice against requirements and constraints. |
| Trade-offs | Less time to build in M3. The team accepts a later start in exchange for a decision that can be defended with evidence, since SRC-MASTER section 7 (p. 9) says an ADR is not enough without a defence of the alternatives and consequences. |
| Risks | Compressed construction time and learning curve. Recorded as [RSK-007](../risks/README.md) and [RSK-008](../risks/README.md). |
| Missing information | The settled non-functional requirements, particularly the access control, history retention and performance targets. Whether the chosen tooling runs on the BC Desktop platform. Free-tier limits of any hosting candidate. |
| Decision criteria for M2 | Fit against the baselined requirements and quality attributes. Team capability and realistic learning curve. Availability on the institutional environment. Dependency maturity and security support. Testing and automation support. Deployment and operational compatibility. Development and likely operational cost. Lock-in risk and the consequence if the technology becomes unavailable. These are the factors listed in SRC-MASTER section 18.1 (p. 15). |
| Later consequence | Recorded at M2. |
| Revisit trigger | Requirements baselined and the five Part 2 proposals closed, which is when the quality drivers become stable enough to choose against. |

## References

Sources cited as SRC-MASTER, SRC-M1 and SRC-GH resolve in the [Part 3 index](../part-3-index.md#references).
