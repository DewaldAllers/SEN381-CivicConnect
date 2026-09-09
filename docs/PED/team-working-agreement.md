# Team working agreement

Version 0.1 draft for agreement | 9 September 2026 | Drafted by: Tristan Els | Status: **not yet agreed by the team**

SRC-M1 section 10 (p. 8) lists an agreed and controlled team working agreement as a submission readiness item. This is a draft. It becomes the agreement when all three members have approved it in a pull request, and not before. Any member may propose changes to it in review.

The rules below exist because the repository has already shown what happens without them. On 2026-09-08 a pull request was merged into `main` by its own author with no review recorded. That is described in the [GitHub governance evidence](../../evidence/github-governance.md) and is the reason several of these rules are written as absolutes instead of preferences.

## Members and ownership

| Member | GitHub account | Owns |
| --- | --- | --- |
| Liam de Villiers | `Liamdv12` | Problem and business need, stakeholder analysis, scope baseline, constraints |
| Dewald Allers | `DewaldAllers` | Requirements, acceptance criteria, RTM, AI Usage Register |
| Tristan Els | `tristanels` | Risk Register, Forward Engineering Considerations, Decision Log, GitHub governance evidence |

Ownership means the member drafts the artefact and answers for it first. It does not mean the other two may ignore it. SRC-MASTER section 8 (p. 10) states that all three students must understand the complete project, and that roles do not remove collective responsibility.

## Branch and merge rules

Nobody commits to `main`. All work happens on a branch named for its part.

Every change to `main` goes through a pull request. This includes documentation, because SRC-MASTER section 9 (p. 11) treats controlled artefacts and code the same way.

No member merges their own pull request, and no member approves their own pull request. Two approvals from the other two members are needed before merge. Where a pull request is authored by one member, the required approvals are the other two, which means every merge needs the whole team.

Nobody force pushes to a shared branch, and nobody rewrites history that has been pushed. If something is wrong, fix it with a new commit so the correction is visible.

Commits are staged as the work is done, not batched at the end. One commit per coherent change, with a message saying what changed and why. Avoid uploading files through the GitHub web interface, because the resulting commit has no useful message and binary uploads cannot be reviewed as a diff.

Where an artefact will be reviewed, commit it in a text format such as Markdown. A `.docx` may be submitted alongside it, but a binary alone gives a reviewer nothing to review.

## What a review has to contain

An approval is a statement that the reviewer read the change and accepts it into the controlled baseline. SRC-MASTER section 9.1 (p. 11) says rubber-stamping may receive no credit, so an approval with no engagement is worth nothing and costs the team marks.

A review should say at least one specific thing about the change. Useful questions to answer: does this match the requirement it claims to serve, is anything here untestable, does it contradict another artefact, does it create work for someone else that they do not know about, and should this enter the baseline now or after a correction.

If a review finds nothing wrong, say what was checked. "Read the twelve risk entries, checked each has a cause and a contingency, agree with the two rated 9" is a review. "LGTM" is not.

Reviews are expected within 12 hours on a working day. If a member cannot review in time, they say so in the pull request instead of leaving it silent.

## Handling the pull request that was not reviewed

PR #20 entered `main` without review. The team does not hide this and does not rewrite the history to remove it. Two things happen instead. It is recorded openly as a control that was not met, in the governance evidence and at the baseline gate. The merged content is then re-reviewed under a follow-up pull request, so it receives the review it did not get, and the correction is visible in the history.

SRC-MASTER section 23 (p. 22) prefers an analysed failure to a hidden one, and section 15 (p. 14) requires quality claims to rest on evidence.

## Artefact discipline

Identifiers are permanent. A requirement, risk, decision or concern keeps its ID for the life of the project. Superseded entries are marked as superseded, not deleted, so the history of the team's thinking stays readable.

Baselined content is not silently edited. After sign-off, a change goes through the change request and impact analysis process in SRC-MASTER section 14 (p. 13).

Nothing is claimed that the team cannot show. Do not write that the system is secure, that a control is applied, or that a target is met without the evidence to support it. Where a gap exists, record the gap.

Every artefact carries in-text citations and a reference list. SRC-M1's academic integrity note (p. 8) states that missing in-text citations and references result in a mark of zero.

## AI use

Material AI-assisted work is recorded in the AI Usage Register with the verification applied, as SRC-MASTER section 10 (p. 12) requires.

Every member must be able to explain, defend and modify any artefact they submit, whether or not an assistant helped produce it. SRC-MASTER section 10 (p. 12) states that "AI generated it" is never an acceptable engineering defence. In practice this means reading your own artefacts closely enough to restate them in your own words before you approve anything.

No credentials, personal data or confidential material goes into an external assistant.

## Individual defence preparation

Twenty of the fifty M1 marks are individual, and assessors may ask any member about any artefact regardless of who wrote it. The team therefore holds a walkthrough before the presentation, in which each member presents their own artefacts to the other two and answers questions on them.

Each member should be able to do the following without help: trace one requirement from its source through to its acceptance criteria, explain one engineering decision and its consequences, show one pull request they reviewed and say what they found, name the highest priority risk and defend its rating, and state one thing the team has deliberately not decided and what evidence is still needed.

## Meetings and communication

Decisions that affect more than one part are recorded in the Decision Log, not left in chat, because a decision nobody wrote down cannot be defended at a milestone.

Where a member finds a defect in another member's artefact, they raise it with that member directly and in the pull request, not silently work around it.

## Agreement

This document takes effect when all three members have approved it. It is not in force until every row below says Agreed.

To record agreement, each member replies on the pull request that carries this file with one line giving their name, the date, and the words "I have read the team working agreement and agree to it". A member who wants a change says so in the same reply instead of agreeing, and the change is made before anyone else agrees. When all three replies are recorded, one member edits the table below to replace Not yet with Agreed, adds the date and the pull request number, and raises that edit as its own pull request for the other two to approve.

This is deliberately not a checkbox that one person ticks for everybody. An agreement recorded by a single member is not evidence that three people agreed, and SRC-M1 section 10 (p. 8) lists the agreement as something the team agrees and controls.

| Member | Agreed | Date | Pull request |
| --- | --- | --- | --- |
| Liam de Villiers | Not yet | | |
| Dewald Allers | Not yet | | |
| Tristan Els | Not yet | | |

Until every row says Agreed, the honest statement at the baseline gate is that the working agreement is drafted and followed in practice but not yet formally agreed. Say that instead of presenting it as ratified.

## References

Sources cited as SRC-MASTER and SRC-M1 resolve in the [Part 3 index](../part-3-index.md#references).
