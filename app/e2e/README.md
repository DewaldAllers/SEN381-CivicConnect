# Browser journeys

Two journeys that drive the real pages in Chrome against the real server. They carry the design ids `T-E2E-01` and `T-E2E-02` from the [test cases](../../docs/testing/test-cases.md), and the acceptance criteria they check are in each test name.

| Journey | What it does |
| --- | --- |
| T-E2E-01 | Thandi sends a request. Sipho finds it in his queue, accepts it, takes it, adds a private note, starts work and resolves it with resolution information. Thandi reads her updates and sees the resolution, "Assigned staff" and no staff name and no private note |
| T-E2E-02 | A request with a script tag in its title shows as plain text and runs nothing. A requester cannot open the staff page or call a staff endpoint. Two staff open the same request and one changes it first, so the other gets the "someone else changed this" message and can save on the latest version. Mary's counts match the lists behind them |

## Run them

You need Node.js and Google Chrome. From this folder:

```text
npm ci
npm test
```

The test run starts the backend itself on port 4300, signs in as the sample users with the password `demo`, and stops the server when it ends. Requests stay in memory.

To run them against PostgreSQL, set `TEST_DATABASE_URL` to the owner login of a development or test database, because the runner creates and drops a schema and the restricted app login cannot do that. Then run:

```text
node --env-file=../backend/.env run-on-postgres.mjs
```

That makes one temporary schema, runs the migrations in it, runs the journeys, prints how many requests, events and work records they saved, and drops the schema. The shared tables are not touched, and the address is not printed.

GitHub runs both modes on every pull request in the [browser journeys workflow](../../.github/workflows/e2e.yml).
