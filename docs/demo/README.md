# Demonstration guide

How to start the release candidate and the steps for the demonstration. The steps use made-up people and requests. Each one says what to show and what you should see.

## Before you start

You need Node.js 22 and Google Chrome. The database address is private and stays out of the repository. The team shares it privately, and it goes in `app/backend/.env` as one line:

```text
DATABASE_URL=<the PostgreSQL address>
```

Then, from `app/backend`:

```text
npm ci
npx tsx --env-file=.env src/server.ts
```

The server prints "PostgreSQL connected successfully" and "Using the PostgreSQL request repository", then listens on port 3000. Open http://localhost:3000.

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
10. **The evidence.** Show `npm test` in `app/backend`, which passes 150 tests, and `npm run lint` and `npx tsc --noEmit`, which are clean. Run `npm test` in `app/e2e` to show both browser journeys. Open the GitHub Actions page for the repository and show the runs. Open the [RTM acceptance check](../requirements/RTM.md#acceptance-check) and the [release evidence summary](../release/README.md), which reads NOT READY and says why.

## If something goes wrong

| What you see | What to do |
| --- | --- |
| The server stops with "address already in use" | Another server is on port 3000. Stop it, or start this one with `PORT=3001` in front of the command |
| The server stops with an error about the database | The address in `.env` is wrong or the database has expired. The free database ends on 13 November 2026. Run without `--env-file=.env` to use memory |
| Sign in says wrong username or password | The password is `demo`, and the usernames are in lower case |
| A page shows plain text with no styling | You opened the file from disk or from an editor's preview. Open http://localhost:3000 instead |
