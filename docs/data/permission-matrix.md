# Proposed CivicConnect permission matrix

Status: proposed B/C design for team review in the pull request; **not yet approved or implemented**. This fills the role/action/data-scope detail requested by P-03 and Tristan's DEP-001 without changing the [M1 requirement wording](../requirements/decisions-to-confirm.md). The category-based scope rule below is our **proposal**, not a rule stated by the Master Brief. Liam's authorisation implementation must be checked against the approved version of this matrix.

## Scope definitions

| Scope | Exact proposed rule |
| --- | --- |
| Own request | `request.requesterRef` equals the authenticated principal's stable reference. Knowing a request reference alone gives no access. |
| Staff category scope | `request.categoryRef` is in the authenticated staff member's explicitly approved category set. An empty or missing set grants no request access. Being named as the responsible member does not override a revoked category grant. |
| Management category scope | `request.categoryRef` is in the authenticated manager's explicitly approved category set. An empty or missing set grants no report, request or history access. |

The category sets are server-trusted authorisation data, not a client-supplied flag. The team must decide who grants and revokes them, where they are stored, and how a request is reassigned if an owner's grant is removed. No category list, staff-to-category assignments or grant-administration role is asserted to exist today. P-01's approved category list and P-03's scope model must be reviewed together. The current backend's hard-coded `withinApprovedScope: true` is prototype evidence only and must not become the final access decision.

## Role, action and data-scope rules

An operation is allowed only when both its role/action rule **and** its data-scope rule pass. The active role is evaluated for the operation; a person who also has another role does not gain that role's actions implicitly. All actions not explicitly allowed below are denied. Authentication, request existence and the P-02 workflow/required-information checks are additional preconditions, not substitutes for authorisation.

| Role | Allowed action | Data scope and condition | Not allowed by this role |
| --- | --- | --- | --- |
| Requester | Submit a valid request | New request is attributed to the authenticated requester; category must be on the approved list. | Staff actions and management reports. |
| Requester | Read own request list, detail and current status | Own requests only. | Other requesters' records. |
| Requester | Read feedback shown in the request history | Own requests only; show requester-facing change/outcome information from P-04, not internal-only staff notes. | Editing/deleting events or reading internal-only notes. |
| Staff | Read queue, detail and full attributable history; filter and order queue | Staff category scope. | Requests outside approved categories or management-only reports. |
| Staff | Accept, assign responsibility, change status, record action/comment/due date/resolution | Staff category scope; P-02 transition/required-information rules also apply. An assignee must have a staff category grant for the request's category. Each successful audited action produces one event. | Assignment to an ineligible member, out-of-scope change or event editing/deletion. |
| Management | Read counts, matching lists, request detail and attributable history | Management category scope; the same scope must be used for counts and drill-down lists. | Request mutation, staff assignment or event editing/deletion. |

If a person needs both staff and management abilities, both roles must be assigned explicitly and the server must evaluate the role used for each operation. A staff member's scope does not automatically become management scope. No role may read all categories by default; access to every category requires explicit grants for every approved category. Request categories are not changed by any action in this matrix because category-change behaviour is not defined by the current requirements.

The proposed CR-004 privacy/redaction route is **not** granted to any of these ordinary roles. If that change is approved, the team must name its administrative role, action, approval procedure and event-preservation rule before implementing it. Category-grant administration is likewise a separate decision. Neither gap permits ordinary users to edit or delete history under NFR-002.

## Minimum review and verification examples

These are cases for the team to approve and later test, **not passing test evidence**.

| Case | Expected result |
| --- | --- |
| Requester A reads A's request; then tries B's reference | Own record allowed; B's data and history denied. |
| Staff member has category X but not Y | X queue/detail/action allowed subject to workflow; Y lookup and action denied. |
| Staff member assigns an X request to staff without X grant | Assignment denied; request and history unchanged. |
| Management has category X but not Y | Counts and matching lists include X only; Y detail/history denied. |
| Staff or management tries to edit/delete an event | Denied; event unchanged. |
| Category grant is missing or revoked | Access denied; any affected assigned request needs reassignment through an authorised process. |

The approved matrix should become the rows of AC-NFR-001's permission test. Authorisation must be enforced on the server's actual data-access paths, not only by hiding controls in the UI. [PED architecture/data contribution](../PED/architecture-and-data.md#proposed-permission-boundary-for-data-design) and [request/history contract](request-history-contract.md) explain where this boundary fits.
