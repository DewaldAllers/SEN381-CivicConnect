# Non-functional requirements

Version 0.2 | 8 September 2026 | Owner: Dewald Allers | Status: **Draft for review**

The first three requirements express proposed, verifiable protections of CivicConnect's sensitive and accountable service record. The usability and performance numbers are explicitly **proposed targets**, not values supplied by the brief or measured in the organisation. See [P-03 and P-05](decisions-to-confirm.md).

| ID | Requirement statement and measurement | Source / stakeholder | Priority and rationale | Acceptance |
| --- | --- | --- | --- | --- |
| NFR-001 | The system shall enforce the agreed permissions on every request read/change and reporting operation. In the permission test matrix, zero disallowed operations shall expose protected request data or change a record. | Master sections 2 and 16, pp. 6 and 14; NEED-P2-04; permission details P-03 | Must Have - sensitive request information must be protected. | [AC-NFR-001](acceptance-criteria.md#ac-nfr-001) |
| NFR-002 | The system shall retain an attributable event for every successful submission, ownership/status change or recorded action, and prevent ordinary users from editing/deleting those history events. In the verification sequence, every successful action shall have exactly one corresponding event and no failed action shall be shown as successful. | Master sections 2-3, pp. 6-7; NEED-P2-02/03/04 | Must Have - complete, trustworthy accountability supports FR-011. | [AC-NFR-002](acceptance-criteria.md#ac-nfr-002) |
| NFR-003 | The system shall preserve acknowledged requests and recorded changes across a controlled application restart. Verification shall show zero missing requests, changed saved values or missing history events when comparing the before/after dataset. | Master section 2.1, p. 6; NEED-P2-04 | Must Have - request loss would reproduce the organisation's existing problem. | [AC-NFR-003](acceptance-criteria.md#ac-nfr-003) |
| NFR-004 | In a planned usability check, at least four of five representative first-time requesters shall submit a valid request and find its status without assistance within five minutes per participant. | Master section 2.1, p. 6; NEED-P2-01/04; proposed target P-05 | Should Have - supports usability; small classroom sample is feasible but not proof for the whole user population. | [AC-NFR-004](acceptance-criteria.md#ac-nfr-004) |
| NFR-005 | Under the agreed verification environment/data volume and ten concurrent users, at least 95% of observations for each standard request-list, detail and management-summary operation shall finish successfully within two seconds, measured from the user action until the requested content is displayed. | Master sections 2.1 and 4, pp. 6 and 8; NEED-P2-01/02/03/04; proposed target P-05 | Should Have - a provisional responsiveness target for usable day-to-day work; ten users is a test assumption, not a demand forecast. | [AC-NFR-005](acceptance-criteria.md#ac-nfr-005) |

The test environment, dataset volume and representative-user selection must be agreed and documented. They are currently TBD. Failed/timed-out performance operations count as failures, not fast responses. The values in P-05 require validation before baseline approval.

No unsupported uptime guarantee, peak-user forecast, retention period or disaster-recovery promise is added. The team should elicit these if the stakeholder/constraint analysis establishes a need. Access checks do not prove complete security; a restart check does not prove recovery from hardware failure or data corruption.

## Consequences for later engineering

NFR-001 affects access boundaries and data exposure; NFR-002 affects how a change and its history stay consistent; NFR-003 affects persistence/recovery; NFR-004 affects interaction design; NFR-005 affects data access, workload testing and hosting capacity. These are evaluation criteria for later design, not a choice of architecture or technology.

References and source copies: [Part 2 index](README.md# abbreviations-and-references) and [source register](../sources.md).
