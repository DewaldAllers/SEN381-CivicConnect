# Demonstration guide

How to start the final version and the steps for the demonstration. The steps use made-up people and requests. Each one says what to show and what you should see.

## Before you start

Run the demonstration from the final version with `git checkout v4.0-final`, the tag the [release evidence summary](../release/README.md) names. You need Node.js 22 and Google Chrome. The database address is private and stays out of the repository. Dewald shares the restricted app login privately, and it goes in `app/backend/.env` as one line:

```text
DATABASE_URL=<the PostgreSQL address>
```

Then, from `app/backend`:

```text
npm ci
npx tsx --env-file=.env src/server.ts
```

The owner login that creates the tables is a separate address, `DATABASE_ADMIN_URL`, and only `npm run db:migrate` uses it. The migrations are already applied, so the demonstration does not need it.

The server prints "PostgreSQL connected successfully" and "Using the PostgreSQL request repository", then listens on port 3000. Open http://localhost:3000.

The shared database holds 300 synthetic requests from the load run, so PostgreSQL mode starts with 304 requests and 154 in the staff queue. Memory mode starts with three sample requests.

To run without a database, leave out `--env-file=.env`:

```text
npx tsx src/server.ts
```

The server then keeps requests in memory, loads three sample requests and forgets everything when it stops. This is the quickest way to start on a clean screen.

## The people

Every sample user has the password `demo`.

| Username | Name | Role | Categories |
| --- | --- | --- | --- |
| `thandi` | Thandi Nkosi | Requester | |
| `bongani` | Bongani Dlamini | Requester | |
| `sipho` | Sipho Mokoena | Staff | Facilities, IT support, Maintenance |
| `lerato` | Lerato Pillay | Staff | Facilities, Security |
| `mary` | Mary van Wyk | Management | All six |

Use a separate browser tab or window for each person. Each tab keeps its own sign in, so the people do not mix.

## The steps

1. **Sign in page.** Show the page and the photo. Sign in as `thandi`. You land on the requester page.
2. **Send a request.** Title "Dripping tap in the kitchen", description "The cold tap in the staff kitchen will not turn off.", category Facilities. Press Send request. You see the message with the new reference, and the request in the list as Submitted. Try a title of three letters first to show that the form names the field and saves nothing.
3. **Staff queue.** In a second window sign in as `sipho`. The new request is in the queue. Filter by category, then by status, then tick Oldest first. Clearing the filters brings the full list back.
4. **Work the request.** Open it. Set the new status to Accepted and press Change status, then press Take it myself. Add a note and leave "Show this to the requester" unticked. Set a due date two days ago to show the Overdue mark. Move it to In Progress, then to Resolved with the resolution "Washer replaced". The History at the bottom shows every step with who did it and when.
5. **The requester's view.** Back in Thandi's window, refresh and open the request. It reads Resolved, with the resolution in the updates. It says "Assigned staff" and "Staff" and shows no staff name and no private note. That is the rule in DEC-018.
6. **A stale change.** Sign in as `lerato` in a third window. Both staff open the same request from the queue. Lerato changes the status. Sipho then saves a note from his old page. He gets the message that someone else changed the request, and the page shows the latest version. Saving again works.
7. **Management.** Sign in as `mary`. The summary shows Open, Overdue, Resolved and Closed. Click each card. The list below always has as many rows as the number on the card. Overdue is also counted as open, and the page says so.
8. **A script in a title.** As Thandi, send a request titled `<script>alert(1)</script> test`. It shows as plain text, and no alert appears.
9. **Saved across a restart** (database mode only). Stop the server with Ctrl+C and start it again. Sign in as Thandi. The requests are still there, with the same history.
10. **The evidence.** Show `npm test` in `app/backend`, which passes 153 tests, and `npm run lint` and `npx tsc --noEmit`, which are clean. Run `npm test` in `app/e2e` to show both browser journeys. Open the GitHub Actions page for the repository and show the runs. Open the [load check results](../../evidence/m4-performance/nfr-005-2026-10-18T18-39-19-613Z.md), which show all 600 observed cases inside two seconds on one local machine. Open the [RTM acceptance check](../requirements/RTM.md#acceptance-check) and the [release evidence summary](../release/README.md), which reads CONDITIONALLY READY, with production a no-go, and says why.

## Final demonstration flow

SRC-M4 section 12 (p. 5) sets six stages. This table says where each one is shown from, with the time the brief suggests.

| Stage | About | What to show | Where it is |
| --- | --- | --- | --- |
| 1. Final product | 6 minutes | The final version, then a request from sent to Resolved across three people | Steps 1 to 5 and step 7 above. `git describe --tags` prints `v4.0-final` |
| 2. M1 scope to final delivery | 6 minutes | What was committed, what was delivered and why, one row for each requirement | The [final outcome table](../requirements/RTM.md#final-outcome) in the RTM and the [scope assessment](../PED/final-scope-assessment.md), which gives 93.75% |
| 3. M3 to final closure | 4 minutes | The fixes, the closed defects and the limits that remain | The [Defect Register](../defects/README.md), the [Technical Debt Register](../technical-debt/README.md) and the [Risk Register final status](../risks/README.md#final-status-m4) |
| 4. Final evidence | 4 minutes | Chosen acceptance criteria against their evidence | The [acceptance check](../requirements/RTM.md#acceptance-check), step 10 above and the [release evidence summary](../release/README.md) |
| 5. Project conclusion | 4 minutes | What the project achieved, the decisions with the clearest consequences and what remains | The conclusion in the [PED](../PED/README.md) |
| 6. Individual defence | Assessed separately | Each person answers from their own work | |

## If something goes wrong

| What you see | What to do |
| --- | --- |
| The server stops with "address already in use" | Another server is on port 3000. Stop it, or start this one with `PORT=3001` in front of the command |
| The server stops with an error about the database | The address in `.env` is wrong or the database has expired. The free database ends on 13 November 2026. Run without `--env-file=.env` to use memory |
| Sign in says wrong username or password | The password is `demo`, and the usernames are in lower case |
| A page shows plain text with no styling | You opened the file from disk or from an editor's preview. Open http://localhost:3000 instead |
