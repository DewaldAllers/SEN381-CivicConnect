# SEN381 CivicConnect

Software Engineering 381 | Belgium Campus ITversity | Milestone 1

**Status: engineering foundation in preparation; no approved product baseline.**

This repository preserves controlled engineering artefacts, issues, branches, commits, reviews and later lifecycle evidence. The intended M1 output is a team-reviewed PED v1.0 engineering baseline [SRC-M1, sections 2-3].

## Start here

- [PED integration index](docs/PED/README.md)
- [Part 2 work and evidence gaps](docs/requirements/README.md)
- [Source register](docs/sources.md)
- [Contribution and review procedure](CONTRIBUTING.md)
- [Governance status](evidence/github-governance.md)
- [Milestone issues](https://github.com/DewaldAllers/SEN381-CivicConnect/issues)

## Current blockers

1. The **SEN381 CivicConnect Master Project Brief** named in SRC-M1 section 1 has not been supplied. None of the three supplied PDFs defines the product scenario. Product actors, workflows, scope and service levels must be obtained before requirements can be baselined. See issue #2.
2. GitHub returned HTTP 403 for private-repository branch protection and rulesets on 2026-09-07. Main is **not technically protected**. This is a milestone governance gap, not an accepted exception. See issue #15.
3. Liamdv12's Write invitation is pending; Tristan's GitHub username is pending. Substantive changes require two other team members' reviews, and must remain unmerged until the review and governance conditions are resolved.

## Team and responsibility

| Member | GitHub | Responsibility currently established |
| --- | --- | --- |
| Dewald Allers | DewaldAllers | Part 2: requirements, acceptance criteria, RTM and AI Usage Register |
| Liam de Villiers | Liamdv12 | Remaining allocation to be agreed; invitation pending |
| Tristan Els | Pending | Remaining allocation to be agreed; invitation later |

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
