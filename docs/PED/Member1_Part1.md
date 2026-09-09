1.	Problem & Business Need
	
1.1	Problem Statement
The development of CivicConnect aims at improving the fragmented manner in which the organization handles service requests. Currently, there are several unstructured ways of requesting services, ranging from email, phone calls, WhatsApp messages, Excel sheets, and even paperwork.
This disjointed process results in operational and management of information issues. There could be duplications, missing, wrong assignments, and loss of requests through the different communication channels. The requestors will have very little idea if the requests have been received, assigned, delayed, completed, or closed. It will be hard for the staff to prioritize, identify ownership and manage the requests. The management will have very little information on the pending, overdue, and completed requests, as well as having a manual, inconsistent and auditable reporting process.
Essentially, the problem is that there is no single controlled record throughout the lifecycle of a service request. (Brief, 2026)

1.2	Business Need
The organization should implement a digital platform where the submission, management, monitoring and reporting on requests for service can be done in a secure and traceable manner. CivicConnect should ensure that there is improved visibility and accountability while avoiding unnecessary burdens.
-	Increase visibility of service requests.
-	Increase accountability for request ownership and updates.
-	Increase coordination between requestors and support staff.
-	Increase reliable information for managers regarding service activities.
-	Increase consistent and traceable information regarding service requests.
-	Help with reporting and analysis of service performance.
-	
1.3	Business Value
The intended value of CivicConnect can be summarised as:
Fragmented service requests → controlled digital service-request lifecycle → improved visibility, accountability and service management.

2.	Stakeholder Analysis
   
The stakeholder analysis will help to identify the different stakeholders involved, their needs and influence, along with conflicting demands which could affect requirements and scope. The requestor and staff and management roles are directly represented by the minimum business capabilities in the Master Project Brief.

3.	Scope Baseline
   
3.1	Scope Statement
The CivicConnect portal will offer a digital environment within which the submissions, administration, monitoring and reporting of community service requests can take place. The system will be able to meet the bare minimum capabilities required for requesters, staff and management as per the Master Project Brief. Any other functionality will only be considered if there is a justification of its stakeholder benefits and impacts on project aspects.

3.2	In-Scope Product Functionality
Requester Functionality
1.	Submit a new service request with appropriate information.
2.	Categorise a request using a controlled category mechanism.
3.	View the current status of submitted requests.
4.	View a history/list of previously submitted requests.
5.	Receive meaningful feedback when a request is accepted, rejected, updated or completed.
   
Staff Functionality
7.	View service requests relevant to authorised staff.
8.	Search, filter or sort requests using useful criteria.
9.	View full request details.
10.	Assign or accept responsibility for a request.
11.	Update request status through controlled transitions.
12.	Record relevant actions, comments or resolution information.
13.	Resolve or close requests where authorised.

Management
14.	View useful service activity information.
15.	Identify open, overdue, resolved and closed requests.
16.	View request information by category, status or other justified dimensions.
17.	Access enough information to support accountability and service-performance analysis.
3.3	Out-of-Scope for M1

M1 is a fundamental milestone, not a developmental milestone. The following are not necessary M1 project decisions or deliverables unless specifically designated as exploratory evidence:
-	Final technology-stack selection.
-	Final software architecture.
-	Detailed database schema/persistence implementation.
-	Detailed UI implementation.
-	API implementation.
-	Design-pattern implementation.
-	CI pipeline implementation.
-	Extensive application coding.
-	Production deployment.
  
3.5	Deliberate Scope Deferment
Decision: Team does not undertake commitment towards any other feature until M1 unless it is justifiable with the value added by the stakeholders and the impact of such feature on the project constraints have been analyzed.

Reasoning: Each new feature adds more responsibility to design, secure, implement, test, document and deploy the project. The team would first set a controlled baseline of minimal business capability before moving onto any new feature.
Expected benefits: This helps in protecting scheduling, resources, quality, security, and completion of projects without losing the choice of making justified changes through change control at a later stage.

4.1	Scope Constraint
The development team cannot keep adding features to the system indefinitely without keeping in mind the implications on the baseline. Every additional feature will have consequences on requirements, design, implementation, testing, time frame, costs, quality and risks involved.

4.2	Schedule Constraint
The project must progress through four formal milestones within the SEN381 delivery period. Schedule pressure should be managed through prioritisation and scope control rather than silently reducing testing or security.

4.3	Cost Constraint
The student has only a few skills, resources and time to complete this task. It is stated in the Master Project Brief that preference should be given to using free and affordable services wherever possible.

4.4	Quality Constraint
Quality assertions have to be ultimately substantiated with concrete evidence. CivicConnect cannot be deemed as a success simply because the application runs; there is a need for requirements, acceptance criteria, testing, quality gates, defects and more evidence.

4.5	Security Constraint
Security should be a part of the engineering process all through its life cycle. Early thought on security is essential with respect to authentication, authorization, least privilege, protection of sensitive data, handling of secrets, dependency security, security testing, and residual security risks.

4.6	Technology Constraint
There is no specified technology stack, architecture or platform. Technology choices for later stages need to take into consideration architecture compatibility, skills and learning curve, security, maintainability, testing, deployment, costs and platform constraints.

4.7	Constraint Trade-Off
A major CivicConnect constraint interaction is the effect of additional scope on schedule, resources and quality.
New stakeholder request → Increased scope → More engineering effort → Schedule pressure → Risk of reduced verification → Increased defect/rework risk
Scope expansion increases the need for more effort in terms of requirements analysis, design, development, testing, and documentation. In cases where there is no scope for moving the deadline, increased pressure results. If the response to such pressure is to reduce the level of verification and security testing, it may lead to increased risks of quality and security issues.

4.8	Security vs Usability Trade-Off
While requesters might seek easy access, there is the issue of the security controls that may include authentication, authorization, and access control measures. Weak controls are bound to make the system insecure, while excessive controls make it difficult to use the system. CivicConnect will have to strike a balance.


5.	Team Working Agreement
   
5.1	Purpose
The Team Working Agreement details how the three CivicConnect team members will be working together, communicating, reviewing, and being accountable for the engineering process. There is an assignment of work among the team members but not of the responsibility of the engineering product.

5.2	Team Responsibilities
Member	Primary Responsibility
Member 1	Problem & Business Need; Stakeholder Analysis; Scope Baseline; Constraints; Team Working Agreement.
Member 2	Functional Requirements; NFRs; Acceptance Criteria; RTM; AI Usage Register.
Member 3	Risk Register; Forward Engineering Considerations; Engineering Decision Log; GitHub Governance.

Joint responsibilities:
-	Integration of final PED v1.0.
-	Evaluation of each other’s contribution.
-	References and citations check.
-	Pull Request reviews and approvals.
-	Baseline approval.
-	Preparation of presentation.
-	Knowledge and justification of the entire project.

5.3	Communication
-	Communicate critical project information through the defined team communication mechanism.
-	Report any blocker that is detected.
-	Do not make important engineering decisions in ad-hoc communication channels.
-	Document important decisions in the respective project artefact that needs to be controlled.
-	Let other team members know about any changes that might affect their responsibility.
-	Keep the communication professional during the entire project.

5.4	GitHub Working Agreement
This implies that GitHub will be used as an engineering control system instead of just being used for file storage.
Issue → Branch → Meaningful Commit → Pull Request → Review → Two Approvals → Protected Main
-	One team-controlled repository should be used except when a specific arrangement has been approved.
-	Protect the Main repository and treat it as the Controlled Product State.
-	Do not develop anything substantive in Main directly.
-	Use Pull Request process for any substantive code to be merged into Main.
-	At least two approvals by team members other than the author should be required.
-	Self-approval is not allowed.
-	Have issues/tasks for engineering activities.
-	Do not commit passwords, API keys, tokens, private keys or confidential credentials.
-	Preserve the history of repository.

5.5	Peer Review Agreement
Each team member will carry out substantive reviews of the contributions of other team members. Reviews should be done keeping in mind compatibility with requirements and acceptance criteria, correctness, maintainability, privacy/security, testing, changes in dependencies, traceability and if the change is needed in the controlled baseline.
Review Comment → Author Response → Correction → Re-review → Approval → Merge

5.6	Conflict Resolution
-	Pinpoint clearly the area of conflict.
-	Refer to the applicable specifications, brief or evidence.
-	Pinpoint the constraints that are impacted.
-	Analyze the alternatives.
-	Make your decision based on the most compelling evidence available.
-	Ensure that a real engineering decision is made where necessary.
-	In the absence of sufficient evidence, consciously delay the decision rather than making an arbitrary one.

5.7	Baseline Sign-Off Agreement
Prior to baselining PED v1.0, all three team members must ensure that the problem and business requirement have been identified, the stakeholder needs have been analyzed, the scope has been established, the constraints and risks have been assessed, the requirements and traceability are consistent, GitHub control has been set up, AI assistance has been documented, references are provided, and the PED has been reviewed by the team members.

6.	Member 1 Evidence Plan
As part of supporting personal accountability, Member 1 needs to provide genuine evidence on GitHub on the work that he owns. The Master Project Brief calls for commits, issues/task ownership, Pull Requests, contribution and reviews to documentation.
Evidence	Recommended Member 1 Activity
Issues	M1-01 Problem and Business Need; M1-02 Stakeholder Analysis; M1-03 Scope Baseline; M1-04 Constraints Analysis; M1-05 Team Working Agreement.
Branch	feature/m1-member1-foundation (or the team's agreed naming convention).
Commits	Meaningful commits for problem/business need, stakeholders, scope, constraints and team agreement.
Pull Request	Create a substantive PR containing Member 1's PED contribution.
Reviews	Meaningfully review Members 2 and 3's work and record useful comments.
Corrections	Respond to review comments and update your contribution before approval/merge.

7.	Member 1 Defence Preparation
Likely Question	Strong Answer
What problem does CivicConnect solve?	CivicConnect addresses fragmented service-request management across email, telephone, WhatsApp, spreadsheets and paper records. This fragmentation can cause requests to be duplicated, lost, incorrectly assigned or overlooked and limits visibility, accountability and reporting.
Who are the key stakeholders?	The main stakeholder groups are requesters, service staff and management/oversight, supported by the client/organisation, development team, security/governance stakeholders and future operations/support.
Why is stakeholder analysis important?	Stakeholder needs are a major source of requirements. Understanding influence, interest and competing expectations allows the team to establish controlled requirements and scope rather than relying on assumptions.
Why is scope control important?	Every additional feature creates obligations across requirements, design, security, implementation, testing, documentation, deployment and maintenance. Uncontrolled scope growth can therefore affect schedule, resources, quality, security and risk.
What happens if a stakeholder requests a new feature after baseline?	The team should not silently add it. The change must be assessed for its effects on requirements, architecture/design, security, quality/testing, scope, schedule, cost/resources and risk before deciding whether to accept, modify, defer or reject it.
Why is final technology selection not part of your M1 work?	M1 establishes the engineering foundation. Technology selection must later be justified against requirements, architecture fit, team capability, security, maintainability, testing, deployment, cost and platform limitations.
Give an example of a constraint ripple effect.	Additional scope increases engineering effort. With a fixed deadline this creates schedule and resource pressure. Reducing testing or security to recover time can increase defects and rework, creating further schedule pressure.




