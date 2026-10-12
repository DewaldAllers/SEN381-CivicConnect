# CivicConnect client

The pages people use: sign in, requester, staff and management. They are plain HTML, CSS and JavaScript, as set out in DEC-016 and CR-006, which are raised in the same milestone and approved when their pull request merges. There is nothing to install or build.

## Try it now

The backend does not have most of these endpoints yet, so a small stand-in server is included. It keeps data in memory and starts fresh every time.

```
cd app/frontend
node mock-server.mjs
```

Open http://localhost:3000 and sign in. The password for every sample user is `demo`.

| Username | Role | Sees |
| --- | --- | --- |
| `thandi`, `bongani` | Requester | Their own requests only |
| `sipho` | Staff | Facilities, IT support and Maintenance |
| `lerato` | Staff | Facilities and Security |
| `mary` | Management | All categories |

The sample categories and the title and description length limits are made up for trying the pages. The real category list and limits are still to be chosen (P-01).

## Files

| File | What it does |
| --- | --- |
| `index.html`, `js/signin.js` | Sign in, then go to the page for your role |
| `requester.html`, `js/requester.js` | Send a request (FR-001, FR-002), see your own list (FR-003), read the updates on each one (FR-004) |
| `staff.html`, `js/staff.js` | Queue with category and status filters and oldest first (FR-005, FR-006, FR-012). On one request: take it or assign it (FR-007), change status (FR-008), add a note and a due date (FR-009), read the history (FR-011) |
| `manager.html`, `js/manager.js` | Counts of open, overdue, resolved and closed requests and the matching lists (FR-010) |
| `js/api.js` | Every call to the server. If an endpoint changes, this is the only file to edit |
| `js/dom.js` | Helpers for building the page safely |
| `mock-server.mjs` | The stand-in server |

## Endpoints the client uses

Only the status change exists in the real backend today. The rest are what the client needs, written down so the backend can match them. All paths start with `/api/v1`. Every success reply is `{ "data": ... }` and every error is `{ "error": "..." }`, as in [api-v1](../../docs/integration/api-v1.md).

| Method and path | Who | Purpose |
| --- | --- | --- |
| `POST /session` | Anyone | Sign in with `username` and `password`. Returns `token` and the `user` (`id`, `name`, `role`). The real sign-in design is Liam's to decide, and only `js/api.js` and `js/signin.js` change if it differs |
| `DELETE /session` | Signed in | Sign out |
| `GET /categories` | Signed in | The approved category list |
| `POST /requests` | Requester | Send a request with `title`, `description`, `categoryId`. A 400 reply carries `fields` with one message per field |
| `GET /requests/mine` | Requester | Their own requests |
| `GET /requests` | Staff | The queue. Optional `categoryId`, `status`, `sort=oldest` |
| `GET /requests/:id` | Owner, staff or management in scope | One request |
| `GET /requests/:id/history` | Same | The history. Requesters get only the events marked for them |
| `GET /staff?categoryId=` | Staff | Staff who may take requests in that category |
| `POST /requests/:id/assign` | Staff | `assigneeId`. A person without the category grant gets 409 |
| `PATCH /requests/:id/status` | Staff | Already in the contract |
| `POST /requests/:id/notes` | Staff | `text` and `visibleToRequester` |
| `PATCH /requests/:id/due-date` | Staff | `dueDate` |
| `GET /management/summary` | Management | `open`, `overdue`, `resolved`, `closed`, `openWithoutDueDate`. Optional `categoryId`, `status` |
| `GET /management/requests` | Management | The list behind a count. `bucket` is `open`, `overdue`, `resolved` or `closed`, with the same filters |

A request outside the caller's scope gets the same 404 as a request that does not exist, so a reference alone tells nobody anything (NFR-001).

## Rules the pages follow

- Text typed by users is only ever shown as text, never as HTML.
- The pages never decide who may do what. The server does, and the pages show its answer. The status list shows every status and the server refuses the ones the rules do not allow.
- Times are shown in South African time and stored as UTC (CR-003).

## Current limits

- Express does not serve this folder yet. That is a small change in the backend, and Liam owns the backend.
- The pages have not been run against the real backend, because the backend does not have these endpoints. The end-to-end tests will run them against it once it does.
