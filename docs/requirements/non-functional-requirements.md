# Non-functional requirements

Version 0.3 | 9 September 2026 | Owner: Dewald Allers | Status: **requirements baseline proposal**

The first three requirements represent suggested and verifiable measures for the sensitive and accountable service records of CivicConnect. The usability and performance metrics are clearly **suggested targets**, not figures that can be obtained from the brief or from the organisation.

| ID | Requirement statement and measurement | Source / stakeholder | Priority and rationale | Acceptance |
| --- | --- | --- | --- | --- |
| NFR-001 | The system shall enforce the agreed permissions on every request read/change and reporting operation. In the permission test matrix, zero disallowed operations shall expose protected request data or change a record. | SRC-MASTER, sections 2 and 16, pp. 6 and 14; NEED-P2-04; permission details P-03 | Must Have - sensitive request information must be protected. | [AC-NFR-001](acceptance-criteria.md#ac-nfr-001) |
| NFR-002 | The system shall retain an attributable event for every successful submission, ownership/status change or recorded action, and prevent ordinary users from editing/deleting those history events. In the verification sequence, every successful action shall have exactly one corresponding event and no failed action shall be shown as successful. | SRC-MASTER, sections 2-3, pp. 6-7; NEED-P2-02/03/04 | Must Have - complete, trustworthy accountability supports FR-011. | [AC-NFR-002](acceptance-criteria.md#ac-nfr-002) |
| NFR-003 | The system shall preserve acknowledged requests and recorded changes across a controlled application restart. Verification shall show zero missing requests, changed saved values or missing history events when comparing the before/after dataset. | SRC-MASTER, section 2.1, p. 6; NEED-P2-04 | Must Have - request loss would reproduce the organisation's existing problem. | [AC-NFR-003](acceptance-criteria.md#ac-nfr-003) |
| NFR-004 | In a planned usability check, at least four of five representative first-time requesters shall submit a valid request and find its status without assistance within five minutes per participant. | SRC-MASTER, section 2.1, p. 6; NEED-P2-01/04; proposed target P-05 | Should Have - supports usability; small classroom sample is feasible but not proof for the whole user population. | [AC-NFR-004](acceptance-criteria.md#ac-nfr-004) |
| NFR-005 | Under the agreed verification environment/data volume and ten concurrent users, at least 95% of observations for each standard request-list, detail and management-summary operation shall finish successfully within two seconds, measured from the user action until the requested content is displayed. | SRC-MASTER, sections 2.1 and 4, pp. 6 and 8; NEED-P2-01/02/03/04; proposed target P-05 | Should Have - a provisional responsiveness target for usable day-to-day work; ten users is a test assumption, not a demand forecast. | [AC-NFR-005](acceptance-criteria.md#ac-nfr-005) |

The testing environment, amount of datasets and the selection of representative users must be agreed upon and recorded. This is to be done at a later date. Failures and timeouts of performance tests are considered failures rather than quick responses. The values in P-05 must be verified prior to accepting the baseline.

An uptime guarantee not supported by facts, a prediction of peak number of users, a retention period and a disaster recovery guarantee are excluded from the list. These should be elicited by the team if necessary from the stakeholder/constraint analysis. Access tests do not ensure security, and the test of restarting does not ensure hardware/data recovery.

## Consequences for later engineering

NFR-001 concerns itself with access boundaries and data exposure; NFR-002 concerns itself with consistency of the change and its history; NFR-003 concerns itself with persistence/recovery; NFR-004 concerns itself with interaction design; NFR-005 concerns itself with data access and workload testing/hosting capability. This is how these constraints will be evaluated when designing later on.

References: [Part 2 index](README.md#references) and [source register](../sources.md).
