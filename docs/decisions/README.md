# Engineering Decision Log and ADR index

Version 2.0 | 29 September 2026 | Owner: Tristan Els | Status: **reviewed at the M2 gate; 11 decisions, 6 ADRs expected**

This log records decisions the team has actually taken, and decisions it has deliberately left open because the evidence needed to choose is not available yet. It does not record intentions or plans. SRC-MASTER section 13 (p. 13) sets the fields.

A deferred decision is a real engineering decision. It commits the team to a position, which is do not choose yet, states what evidence would settle it, and names the trigger to revisit. DEC-007 is the one that has now been carried long enough to see what the deferment actually cost, and its consequence is recorded below rather than left as a promise.

## Status of approvals

The eight M1 entries were approved on 9 September, when the branches carrying them merged into `main` through pull requests #21 to #26 with the two approvals SRC-MASTER section 9 (p. 11) requires. They are no longer proposals. Approval is recorded by the merge, not by editing a status line, which is why each entry names the pull request or the readback that evidences it.

The three M2 entries are raised on this branch and carry the same rule: they become approved when the pull request carrying them is approved and merged.

| ID | Date | Decision | Type | Authority | Status |
| --- | --- | --- | --- | --- | --- |
| [DEC-001](#dec-001-create-a-private-team-repository) | 2026-09-07 | Create one private team repository | Taken | Repository owner, ratified on merge of PR #22 | Closed, reversed by DEC-008 |
| [DEC-002](#dec-002-defer-requirements-until-the-master-brief-was-located) | 2026-09-07 | Do not derive requirements until the Master Brief was located | Taken | Part 2 owner, ratified on merge of PR #23 | Closed 2026-09-07 |
| [DEC-003](#dec-003-branch-and-pull-request-workflow-instead-of-committing-to-main) | 2026-09-07 | Work on feature branches, merge through pull requests | Taken | Team, ratified on merge of PR #22 | In force, now enforced by branch protection |
| [DEC-004](#dec-004-keep-part-3-on-its-own-branch-and-reuse-the-agreed-folder-paths) | 2026-09-08 | Keep Part 3 on its own branch, reuse agreed folder paths, do not edit another member's files | Taken | Part 3 owner, ratified on merge of PR #22 | Closed at integration |
| [DEC-005](#dec-005-use-a-3-3-probability-and-impact-scale) | 2026-09-08 | Rate risks on a 3 by 3 probability and impact scale | Taken | Team, ratified on merge of PR #22 | In force, used again at the M2 review |
| [DEC-006](#dec-006-defer-the-response-to-the-branch-protection-gap) | 2026-09-08 | Do not change repository visibility or buy a plan to obtain branch protection | Deferred | Part 3 owner | Closed 2026-09-09, superseded by DEC-008 |
| [DEC-007](#dec-007-defer-stack-architecture-persistence-ci-and-deployment-platform) | 2026-09-08 | Do not select stack, architecture, persistence, CI or deployment platform | Deferred | Team, ratified on merge of PR #22 | Revisit trigger fired 2026-09-29, closing under the M2 selection |
| [DEC-008](#dec-008-make-the-repository-public-to-obtain-branch-protection) | 2026-09-09 | Make the repository public so that branch protection becomes available | Taken | Team | In force, held as ASM-007 |
| [DEC-009](#dec-009-hold-the-ped-as-linked-markdown-in-the-repository) | 2026-09-29 | Hold the PED as linked Markdown under version control rather than as one document | Taken | Raised on this branch | Raised |
| [DEC-010](#dec-010-defer-the-p-05-quality-targets-rather-than-approving-them) | 2026-09-29 | Defer the NFR-004 and NFR-005 targets rather than baselining them | Deferred | Raised on this branch | Raised |
| [DEC-011](#dec-011-design-as-though-the-data-protection-obligation-applies-without-claiming-compliance) | 2026-09-29 | Design as though the data protection obligation applies, without claiming compliance | Taken | Raised on this branch | Raised |

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
| Later consequence | Commits are staged and readable per change instead of arriving as one upload. SRC-MASTER section 23 (p. 22) gives limited or no credit to evidence reconstructed immediately before assessment, so the staged history matters. The workflow stopped depending on discipline on 9 September, when branch protection made it the only way to reach `main`. The M2 work follows the same pattern on `m2-ped-continuity-and-change-control`. |
| Revisit trigger | Fired at PED v1.0 integration, when the merge order was agreed and all three branches merged. Closed as a trigger; the workflow itself stays in force. |

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
| Later consequence | Reconciled on 2026-09-09 after all three parts merged. `docs/sources.md` is now the single project source register and the authority for source records and fingerprints. The Part 3 index keeps its reference list as a reading aid and says which register wins if they disagree. The work was known in advance instead of being discovered at sign-off, which is what the entry was for. |
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
| Later consequence | The scale was used again at the M2 review on 29 September, which is what makes the rating moves comparable. Four M1 ratings moved and nine new entries were rated on the same bands, so the change between milestones reads as a change in the project rather than a change in the measuring instrument. The coarseness the trade-off predicted showed up: six of the nine new entries scored 6, and the register relies on the written justification to separate them. |
| Revisit trigger | The team disagrees with a rating during review, or a milestone review finds the three bands too coarse. Not fired at M2, although the clustering at 6 is the first sign of it. |

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
| Later consequence | Branch protection was applied the same morning and confirmed by API readback returning `protected: true` for `main`. Making the setting available was not the same as configuring it, so the control was only met once the rules existed and were read back. The control has held since: every change into `main` after 9 September went through a pull request with two approvals. The decision also created a standing assumption, recorded as ASM-007, because the enforcement disappears the moment the repository goes private again. A second consequence arrives with the application: a public repository means a committed credential is readable immediately rather than eventually, which is RSK-021. |
| Revisit trigger | Lecturer instruction to make coursework repositories private, or completion of the module. Tracked as DEP-008, which has never been answered and was only made irrelevant by the team deciding for itself. |

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
| Later consequence | The deferment ran from 8 to 29 September, three weeks of the project with no stack. What it bought was a selection made against a requirements baseline whose ambiguities have since been found and closed, rather than against the draft that existed on 8 September. Four changes came out of the M1 review, and two of them, CR-003 and CR-004, put constraints directly on the persistence and data decisions. Choosing the stack on 8 September would have meant choosing before those constraints existed. What it cost is three weeks of construction time, which lands on M3 rather than here, and the compressed decision window that RSK-014 now records. The criteria listed above were written on 8 September and are still the criteria the selection has to answer, which is the part of the deferment that worked best: it left something concrete behind rather than an intention. |
| Revisit trigger | Fired on 29 September. CR-002 closes four of the five proposals and defers the fifth, so the quality drivers are now stable enough to choose against. The entry closes when the M2 technology and architecture ADRs are recorded, tracked as DEP-002. |

## DEC-009 Hold the PED as linked Markdown in the repository

| Field | Entry |
| --- | --- |
| Context | SRC-MASTER section 6 (p. 8) requires one Project Engineering Document that evolves through all four phases, and section 6.1 (p. 9) requires version history, consistent identifiers and no silent overwriting of baselined content. The team has been producing the PED as linked Markdown since M1 without recording that as a decision, which means the structure of the main deliverable rested on nobody. |
| Constraints | Every part of the PED is reviewed through pull requests and needs the two approvals SRC-MASTER section 9 (p. 11) requires. Three members edit in parallel. The document has to be navigable by an assessor who has not seen it before. |
| Alternatives | One Markdown file holding the whole PED. A word processor document committed as a binary. Linked Markdown files with an index carrying the document control. |
| Decision | Keep the PED as linked Markdown files under `docs/`, with [docs/PED/README.md](../PED/README.md) carrying the document control, version history and section map. |
| Rationale | Three members editing one file conflict on every merge. A binary cannot be reviewed as a diff, which PR #20 demonstrated when a 34 KB `.docx` entered `main` with nothing a reviewer could read. Linked Markdown gives each part its own history, so a reviewer sees what changed rather than that something changed. |
| Trade-offs | There is no single printable artefact to hand over, and a reader can miss part of the document unless the index is maintained. The section map in the PED index carries that weight, and it has to list the parts that do not exist yet or the gap becomes invisible. |
| Risks | An assessor navigating the repository may not find a section that is not on the map. Mitigated by the map listing unbuilt sections with their owners. |
| Evidence | The PED index and its section map. The repository structure follows Appendix C of the Master Brief (p. 26). |
| Later consequence | Recorded at M3. |
| Revisit trigger | An assessor or the lecturer asks for the PED as one submitted document, or the section map stops being maintained. |

## DEC-010 Defer the P-05 quality targets rather than approving them

| Field | Entry |
| --- | --- |
| Context | NFR-004 promises that four of five first-time requesters complete a submission and status lookup unaided within five minutes. NFR-005 promises 95% of standard operations inside two seconds under ten concurrent users. Both numbers came from P-05, which the team wrote rather than took from a stakeholder or a measurement. CR-002 had to decide whether to approve them into the baseline alongside the other four proposals. |
| Constraints | The environment the targets would be measured in does not exist, because the stack is being chosen in this milestone. SRC-MASTER section 15 (p. 14) requires quality claims to rest on evidence, and section 23 (p. 22) rejects unsupported claims. The M2 baseline has to be stable enough to build against. |
| Alternatives | Approve both targets as written and treat them as baselined thresholds. Approve them with a note that they are provisional. Remove the numbers and leave the requirements qualitative. Defer approval of the numbers while keeping the requirement wording. |
| Decision | Defer. NFR-004 and NFR-005 keep their wording and their numbers, and the numbers stand as proposed targets rather than as baselined acceptance thresholds until the verification environment, data volume and participant selection are defined. |
| Rationale | A threshold that cannot be measured cannot be met or missed, so baselining it would put a number into the controlled baseline that no evidence could ever support or refute. Removing the numbers would be worse: the requirement would lose the only thing that makes it testable later. Deferring keeps the intent visible and the commitment honest. |
| Trade-offs | The RTM carries two requirements whose verification reads Planned for longer than the others, which looks like an omission until the reason is read. In exchange, the team does not have to raise a change request in M3 against a threshold it never had evidence for. |
| Risks | RSK-004, now rated 2 rather than 4, because the consequence of a wrong target is no longer a change against baselined content. |
| Evidence | CR-002 in the [change control register](../change/README.md). The deferral is recorded against NFR-004 and NFR-005 in the RTM and in BL-002 as a decision held outside the baseline. |
| Missing information | The verification environment and its data volume, which depend on DEP-002. How the five representative participants would be selected. How elapsed time would be measured. |
| Later consequence | Recorded at M3, after the first measurement. |
| Revisit trigger | The verification environment is defined, or a first measurement in M3 gives the team real numbers to approve against. |

## DEC-011 Design as though the data protection obligation applies, without claiming compliance

| Field | Entry |
| --- | --- |
| Context | Service requests will hold contact details and matters such as security concerns and lost property. RSK-006 and FEC-002 have recorded since M1 that no member has confirmed which data protection obligations bind a student project, and that the Protection of Personal Information Act 4 of 2013 is the one most likely to apply. The data model is being designed now, and it is the last cheap moment to answer this. |
| Constraints | No legal advice is available to the team. No stakeholder can be consulted, which is ASM-001. NFR-002 forbids ordinary users from editing or deleting history events, and that requirement is baselined. SRC-MASTER section 16 (p. 14) requires residual security risks to be recorded rather than the system being described as secure. |
| Alternatives | Confirm the obligation first and design afterwards. Assume it does not apply and build records that are permanent. Assume it applies and design a deletion route. Ask the lecturer and pause the data model. |
| Decision | Design as though the obligation applies. The data model has to support removing or anonymising the personal data on a request and its history through a route restricted to a named role, and no artefact describes CivicConnect as compliant with any data protection law. |
| Rationale | The two outcomes are not symmetric. If the obligation does not bind and we built the route anyway, the cost is one administrative path nobody uses. If it binds and we assumed otherwise, the schema has to change after the data model is baselined and after M3 has written code against it. Confirming first would stall the data model on an answer the team has no route to obtain. |
| Trade-offs | The project carries a capability the minimum business capabilities do not list, and the route creates its own risk of erasing accountability, which is RSK-016. The team also accepts holding an unconfirmed position for the rest of the project rather than resolving it. |
| Risks | RSK-006 and RSK-016. |
| Evidence | CR-004 in the [change control register](../change/README.md). The constraint appears against NFR-002 and FR-011 in the RTM. The unconfirmed obligation is held as ASM-002. |
| Missing information | Whether the Act binds this project. A retention period. Which role holds the redaction permission, which is part of DEP-001. |
| Later consequence | Recorded at M3, when the route is built or deliberately not built. |
| Revisit trigger | A confirmed answer on applicability, or a lecturer instruction on how student projects should treat personal data. |

## ADR index

SRC-MASTER section 13 (p. 13) asks for an Architecture Decision Record, or an equivalent structured record, on major architecture, technology, persistence, integration, authentication, deployment and infrastructure choices. The entries above use the same fields, so the distinction here is scope rather than format: a `DEC` entry is any recorded decision, and an `ADR` is one of the foundational choices that the M2 baseline is made of and that later decisions inherit from.

Every ADR carries the fields in SRC-MASTER section 13 (p. 13) and Appendix A (p. 25): context, constraints, alternatives, decision, rationale, trade-offs, risks, evidence and a later consequence that is filled in when evidence emerges rather than left blank. Where a decision rests on Assignment 2 research, the ADR cites the finding it used. It does not reproduce the research, which SRC-M2 section 4.1 (p. 3) rules out.

| ID | Decision | Owner | State on 29 September 2026 |
| --- | --- | --- | --- |
| ADR-001 | Architecture style selection for CivicConnect, with the alternatives considered and the enforcement point for authorisation stated explicitly | Dewald Allers | Not yet recorded |
| ADR-002 | Persistence model and store selection, including the failure mode and the position on backup and recovery | Dewald Allers | Not yet recorded |
| ADR-003 | Technology stack selection with versions, dependencies, licensing and the deployment direction | Liam de Villiers | Not yet recorded |
| ADR-004 | First design problem and the pattern or approach chosen for it | Liam de Villiers | Not yet recorded |
| ADR-005 | Second design problem and the pattern or approach chosen for it | Liam de Villiers | Not yet recorded |
| ADR-006 | Initial interface or integration decision, once implementation reaches a boundary that needs one | Liam de Villiers | Not yet recorded, and not yet blocking |

The identifiers are reserved so that the RTM, the risk register and the baseline can link to them before they exist. If the decision set turns out to be different, the numbers move with it rather than an empty record being written to fill a row.

## References

Belgium Campus ITversity (2026) *SEN381 CivicConnect Master Project Brief*, version 1.1. Cited as `SRC-MASTER`. Sections used: 6 and 6.1 (one evolving engineering record and the PED quality standard, pp. 8-9), 9 (GitHub governance, p. 11), 13 (engineering decision and ADR standard, p. 13), 15 (quality engineering, p. 14), 16 (security engineering, p. 14), 18.1 (technology selection, p. 15), 23 (assessment rules, p. 22), Appendix A (ADR quality checklist, p. 25), Appendix C (repository structure, p. 26).

Belgium Campus ITversity (2026) *SEN381 CivicConnect Project Milestone 2: Architecture, Technology and Initial Design Baseline*. Cited as `SRC-M2`. Sections used: 4.1 (continued engineering documentation, p. 3), 5.3 (architecture decision and diagrams, p. 5), 5.6 (initial design decisions, pp. 5-6), 5.7 (initial API and integration decisions, p. 6).

Republic of South Africa (2013) *Protection of Personal Information Act 4 of 2013*. Cited in DEC-011. Applicability is not confirmed and is held as ASM-002.

Sources cited as SRC-GH resolve in the [Part 3 index](../part-3-index.md#references). Full source records are in the [source register](../sources.md).
