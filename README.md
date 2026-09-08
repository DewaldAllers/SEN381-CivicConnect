# SEN381 CivicConnect

Software Engineering 381 | Belgium Campus ITversity | Milestone 1

**Status: Part 2 review draft prepared; no approved product baseline.**

This repository preserves controlled engineering artefacts, issues, branches, commits, reviews and later lifecycle evidence. The intended M1 output is a team-reviewed PED v1.0 engineering baseline [SRC-M1, sections 2-3].

## Start here

- [PED integration index](docs/PED/README.md)
- [Part 2 requirements, acceptance criteria and RTM](docs/requirements/README.md)
- [Short presentation and defence notes](docs/requirements/part-2-defence-notes.md)
- [Source register](docs/sources.md)
- [Contribution and review procedure](CONTRIBUTING.md)
- [Governance status](evidence/github-governance.md)
- [Pull Requests](https://github.com/DewaldAllers/SEN381-CivicConnect/pulls)

## Current blockers

1. The Master Brief is now available and read. The 12 FRs and 5 NFRs are drafted from it; [five detailed proposals](docs/requirements/decisions-to-confirm.md) need validation before baseline approval.
2. GitHub still returned HTTP 403 for private-repository main protection on 2026-09-08. Main is **not technically protected**. This is a governance gap, not an accepted exception.
3. Liamdv12 and tristanels now have Write access. Two non-author reviews and formal sign-off remain pending. The 17 earlier issues were deleted at the user's request; none has been recreated. Establish any future backlog through the agreed team workflow.

## Team and responsibility

| Member | GitHub | Responsibility currently established |
| --- | --- | --- |
| Dewald Allers | DewaldAllers | Part 2: requirements, acceptance criteria, RTM and AI Usage Register |
| Liam de Villiers | Liamdv12 | Remaining allocation to be agreed; Write access present |
| Tristan Els | tristanels | Remaining allocation to be agreed; Write access present |

Names come from SRC-A1; the Part 2 split comes from the user's request. All three members remain responsible for understanding the whole baseline [SRC-M1, section 6.2].

## Artefact structure

| Location | Purpose |
| --- | --- |
| `docs/PED/` | Integration, document control and baseline sign-off |
| `docs/requirements/` | Requirements, acceptance criteria, RTM and defence notes |
| `docs/stakeholders/` | Stakeholders, needs and conflicts |
| `docs/scope/` | In-scope, excluded and deferred scope |
| `docs/constraints/` | Constraints and their interactions |
| `docs/risks/` | Risk Register |
| `docs/decisions/` | Genuine engineering decisions and justified deferments |
| `docs/forward-engineering/` | Later concerns requiring attention now |
| `docs/ai-register/` | Material AI use and actual human verification |
| `evidence/` | Evidence index and governance observations |
| `templates/` | Reusable records for controlled changes and requirements |

All substantive foundation work is proposed on `codex/m1-part2-requirements-foundation` for review. The initial GitHub-generated README commit only bootstrapped an empty main branch; it was not a reviewed milestone baseline. No prior contribution history has been reconstructed.

M1 excludes final stack/architecture selection and detailed database, UI, API, CI or deployment implementation [SRC-M1, section 5]. Source identifiers resolve in the [source register](docs/sources.md).
