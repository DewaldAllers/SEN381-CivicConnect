# Proposed details to confirm before baseline

Version 0.3 | 9 September 2026 | Owner: Dewald Allers | Status: **all five pending team/stakeholder validation**

The Master Brief supplies broad capabilities. The following details make this draft testable; they are proposals, not facts supplied by the lecturer (SRC-MASTER, section 3, p. 7). Review them with the team and the lecturer/client where clarification is necessary, and record the decision evidence here.

| ID | Proposed detail | Reason and affected requirements | Current decision |
| --- | --- | --- | --- |
| P-01 | Require a short title, description and one approved category. Assign a unique request reference and submission time. Select the actual category list and field-length limits before baseline. | A small, identifiable request record supports submission and tracking. SRC-MASTER, p. 7 says 'appropriate information' but does not list fields. FR-001 to FR-003. | Pending; category list/length limits TBD |
| P-02 | Use the status transitions below. Staff may record a due date on accepted work. A request is overdue when its due date has passed and its status is Accepted or In Progress; requests without a due date are shown separately as 'due date not set'. | Defines controlled progress and overdue reporting without inventing a fixed resolution deadline. FR-004, FR-007 to FR-010. | Pending; business confirmation needed |
| P-03 | Requesters read only their own requests. Staff read/update requests in their approved work scope; ownership can be assigned only to staff authorised for that scope. Management reads summaries and audit history for its approved scope. Create a named-role/action/data-scope permission matrix before baseline. | Protects potentially sensitive requests without assuming all staff may see everything. FR-003 to FR-011; NFR-001 and NFR-002. | Pending; exact permission matrix TBD |
| P-04 | Deliver acceptance, rejection, update and completion feedback in the request's CivicConnect history, visible on the next view/refresh after a successful change. Show rejection/resolution reasons. External messaging and reopening are deferred. | Satisfies meaningful feedback with a small scope. The brief does not prescribe a channel or reopening rules. FR-004, FR-008 and FR-009. | Pending; scope owner to agree |
| P-05 | Propose a usability target of 4/5 representative first-time users completing submission and status lookup without assistance within 5 minutes; propose 95% of standard list/detail/summary views within 2 seconds under 10 concurrent users. | Modest classroom verification targets, not measured demand or a lecturer-supplied service level. Confirm practicality, workload and environment before baseline. NFR-004 and NFR-005. | Pending; user sample/environment/volume TBD |

## Proposed status rules (P-02)

| From | To | Required condition |
| --- | --- | --- |
| New submission | Submitted | FR-001 validation succeeds; this is the initial status. |
| Submitted | Accepted | Authorised staff accept the request. |
| Submitted | Rejected | Authorised staff provide a rejection reason. |
| Accepted | In Progress | An authorised responsible staff member has been assigned. |
| In Progress | Resolved | Authorised staff provide resolution information. |
| Resolved | Closed | Authorised staff confirm closure. |

Rejected and Closed are terminal in this proposed baseline. Other transitions are refused without changing the request. 'Open' means Submitted, Accepted or In Progress. 'Completed' feedback covers resolution and closure. A resolved request can remain in the resolved group until closed. Overdue is a derived flag, not another status. These meanings need business agreement; they do not select an implementation.

Record approvals as: proposal ID, agreed/revised wording, reviewer/authority, date and PR or meeting evidence. Do not prefill signatures. Unresolved decisions that prevent a pass/fail judgement must be resolved before sign-off or explicitly handled by an authorised gate condition.
