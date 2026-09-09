# Part 3 defence notes

Version 0.1 | 9 September 2026 | Owner: Tristan Els

Working notes for the individual engineering defence. These are prompts, not a script to read out. SRC-M1 section 6.2.1 (p. 6) assesses delivery on explaining rather than reading, and section 6.2.2 (p. 6) assesses command of the artefacts themselves. Open the live files during questioning rather than describing them from memory.

## What to open, in order

The Decision Log, then the Risk Register, then the governance evidence. That order works because each one explains the next: the decisions created the situation, the register predicted what would go wrong, and the governance evidence records what actually happened.

## The strongest thing Part 3 has

The Risk Register predicted a failure before it occurred, and the repository history proves the sequence.

RSK-001 was written on 8 September. It said a change could reach `main` without the required approvals because nothing enforced the rule, rated it 6, and set a trigger: probability moves to 3 if that happens. That evening, PR #20 was opened, merged by its own author with no review recorded, one minute and fifty one seconds later. The entry now scores 9 and records the event.

This answers several questions at once. It shows the register is live rather than decorative, it shows a risk connecting to a real issue as SRC-MASTER section 12 (p. 12) requires, and it shows the team recording an uncomfortable fact instead of hiding it.

Be accurate and unemotional about it. The point is that the control failed and the team recorded it, not that a particular member made a mistake.

## Answers to the indicative questions in SRC-M1 section 8

**Which risk deserves the most attention now, and why?** Two score 9. RSK-002, reviewer availability, because the consequence is not delay but a forced choice between merging without the required approvals or missing the gate, and neither is fixable by working harder on documents. RSK-009, individual defence readiness, because the work was divided by part and the marks are individual, so the division that made production efficient is what creates the exposure.

**Which decision did your team intentionally not make, and what evidence is still needed?** DEC-007, the technology stack, architecture, persistence, CI and deployment platform. The requirements are still a draft with five open proposals, so the quality attributes that should drive the choice are not settled. Choosing now would mean choosing against requirements that may change. The entry records the criteria the M2 decision has to satisfy. DEC-006 was also a deferred decision, and it closed on 9 September when the team made the repository public.

**Why must a substantive change entering main receive two approvals from members other than the author?** Because approval is the point at which the team accepts a change into the controlled baseline, and an author cannot independently judge their own work. Two reviewers rather than one reduces the chance of a single reviewer waving something through. This project has direct evidence of why it matters: PR #20 entered `main` with zero approvals, and the content it added is a binary document that cannot be reviewed as a diff even now.

**Why are deployment, automated testing or operations relevant in M1 when they are implemented later?** Because they constrain what can be written down now. FEC-003 is the clearest case: three of the drafted NFRs promise measurements the system has to be built to produce, and if the design does not expose elapsed time or a comparable event record, those requirements cannot be verified at all. Deciding to expose them is cheap now and expensive later.

**Give one early shortcut that could create technical debt later.** Merging without review, which already happened. The debt is that content sits in the baseline having never been checked against the requirements or the scope, so any contradiction it contains will surface later, when it is more expensive.

**How would you know the system is degrading before users complain?** Currently the team would not, and FEC-007 records that as an open concern. NFR-005 sets a two second target for 95% of observations, which can only be checked if the system records operation timings. That is a design decision that has to be taken in M2 to be available in M3.

## Traceability, one thread end to end

Pick this thread and follow it live rather than describing it.

Master Brief section 3 (p. 7) says management must identify overdue requests. Dewald derived NEED-P2-03 from that, then FR-010, which requires overdue counts. FR-009 records a due date only "where available". FEC-004 records the contradiction: a request with no due date has no defined overdue state, so a required capability depends on an optional field. RSK-005 covers the open proposal P-02 that is meant to define overdue. The verification evidence does not exist yet, and M1 does not require it.

That thread runs from the brief, through a stakeholder need, a requirement, a defect in the requirement, a forward concern and a risk. It also shows Part 3 doing work on Part 2's artefact, which is what cross-review is for.

## Where Part 3 is weak

Say these before an assessor finds them.

Nothing in Part 3 has been approved by the team yet. The Decision Log records decisions with individual authority and proposals from Part 3, not team-approved baselines.

The risk probabilities are judgements without historical data. DEC-005 records why the team used a 3 by 3 scale rather than a 5 by 5, which is honest about the precision available.

Branch protection is available but not yet applied, so at the time of writing the control is still procedural.

The source register is duplicated between the Part 2 branch and the Part 3 index. DEC-004 records that as a known inconsistency to reconcile at integration, not an accident.

RSK-006 names the Protection of Personal Information Act as the obligation most likely to apply, and the team has not confirmed that. It is recorded as missing information rather than as an established legal position.

## References

Sources cited as SRC-MASTER and SRC-M1 resolve in the [Part 3 index](part-3-index.md#references).
