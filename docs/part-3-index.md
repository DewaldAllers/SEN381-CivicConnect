# Part 3 - risks, forward engineering, decisions and GitHub governance

Version 0.1 working draft | 8 September 2026 | Owner: Tristan Els | Status: **draft for team review, not an approved baseline**

This is the Part 3 share of the Milestone 1 (M1) required outputs (SRC-M1, section 3, p. 3). It covers four of the artefacts that go into the Project Engineering Document (PED) v1.0.

## Read in this order

1. [Engineering Decision Log](decisions/README.md). What the team has actually decided, and what it has deliberately not decided yet.
2. [Initial Risk Register](risks/README.md). What could go wrong, how each risk is rated, and who owns it.
3. [Forward Engineering Considerations](forward-engineering/README.md). Later lifecycle concerns that already affect M1 work.
4. [GitHub governance evidence](../evidence/github-governance.md). Observed repository controls, and the gap between what the brief requires and what the repository enforces.

Supporting file: the [team working agreement](PED/team-working-agreement.md), drafted from Part 3 because the governance rules and the agreement describe the same controls.

## What this branch contains

Part 3 only. Parts 1 and 2 belong to other members and are not copied here.

| Part | Owner | Artefacts |
| --- | --- | --- |
| Part 1 | Liam de Villiers | Problem and business need, stakeholder analysis, scope baseline, constraints |
| Part 2 | Dewald Allers | Functional and non-functional requirements, acceptance criteria, initial RTM, AI Usage Register |
| Part 3 | Tristan Els | Risk Register, Forward Engineering Considerations, Engineering Decision Log, GitHub governance evidence |
| Shared | All three | PED v1.0 integration, references, peer review and approvals, version history, baseline sign-off, presentation |

## How Part 3 depends on the other parts

Part 3 does not create requirements, scope or stakeholders. Where a risk, concern or decision points at a requirement, it cites the Part 2 identifier (`FR-nnn`, `NFR-nnn`, `AC-...`, `P-nn`) as drafted on the `m1-part2-requirements-foundation` branch. Those identifiers are still drafts, so every Part 3 reference to them inherits that draft status.

Two dependencies are unresolved. Both are recorded as risks, not assumed away:

Part 1 scope and constraint artefacts are not in the repository yet, so risks about scope stability are rated against the constraints in the brief (SRC-MASTER, section 4, p. 8) instead of an agreed team scope baseline. See [RSK-003](risks/README.md).

Part 2 requirements are a review draft with five open proposals, so acceptance criteria could still move. See [RSK-005](risks/README.md).

## Identifier conventions

| Prefix | Meaning | Owner |
| --- | --- | --- |
| `RSK-nnn` | Risk Register entry | Part 3 |
| `FEC-nnn` | Forward Engineering Consideration | Part 3 |
| `DEC-nnn` | Engineering Decision Log entry | Part 3, recording team and authorised decisions |
| `FR-nnn`, `NFR-nnn`, `AC-...`, `P-nn` | Requirement, acceptance criterion, open proposal | Part 2 |
| `NEED-P2-nn` | Working stakeholder need identifier | Part 2 |
| `SRC-...` | Source register entry | Part 2 source register, repeated below |

## Integration note

During drafting, Part 3 repeated the source identifiers it cites here because `docs/sources.md` was owned by Part 2 on a separate branch, and editing it would have caused an avoidable merge conflict. All three parts are now merged, so `docs/sources.md` is the project source register and the authority for source records and document fingerprints. The reference list below is retained as the Part 3 reading aid and uses the same `SRC-` identifiers. Where the two differ, `docs/sources.md` is correct. See [DEC-004](decisions/README.md).

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as **SRC-MASTER**. Sections used: 3 (capabilities, p. 7), 4 (constraints, p. 8), 9 (GitHub governance, p. 11), 10 (responsible AI, p. 12), 11 (requirements and traceability, p. 12), 12 (risk, p. 12), 13 (decisions and ADRs, p. 13), 15 (quality, p. 14), 16 (security, p. 14), 17 (environments, pp. 14-15), 18 (cost and schedule, p. 15), 23 (assessment rules, p. 22), Appendix A (artefact checklist, pp. 24-25).

Belgium Campus ITversity (n.d.) *SEN381 Project Milestone 1: Engineering Foundation and Requirements Baseline*. Cited as **SRC-M1**. Sections used: 3 (required outputs, p. 3), 3.1 (progressive GitHub evidence, p. 4), 4 (forward engineering considerations, p. 4), 5 (M1 boundaries, pp. 4-5), 6.1 (team evidence assessment, pp. 5-6), 8 (defence questions, p. 7), 9.1 (research and project evidence, p. 8), 10 (readiness checklist, p. 8).

GitHub (n.d.) *About protected branches*. Available at: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches (Accessed: 8 September 2026). Cited as **SRC-GH**.

GitHub (n.d.) *Managing a branch protection rule*. Available at: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule (Accessed: 8 September 2026). Cited as **SRC-GH**.

A citation supports why a control is required. It does not prove the team applied that control. Claims about what this repository actually does are dated observations backed by repository evidence, as required by SRC-M1, section 9.1, p. 8.
