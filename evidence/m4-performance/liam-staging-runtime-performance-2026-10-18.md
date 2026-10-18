# Liam M4 staging, runtime and performance evidence

Date: 2026-10-18

## Tested candidate

- Full commit: `5d5e1bcc45a6e8445904dde4838c82876313a98f`.
- The local staging launcher reported the exact expected release at `http://localhost:4000`.
- This evidence applies to this candidate only. The final team tag must point to the approved final baseline.

## Backend verification

- Lint passed.
- TypeScript typecheck passed.
- Automated suite: 153 passed, 2 skipped, 11 test files (from the run on the candidate).

## Staging evidence from the local staging log

- `All migrations already applied`
- `PostgreSQL connected successfully.`
- `Using the PostgreSQL request repository.`
- `CivicConnect API running on port 4000`
- `== VERIFIED: staging at http://localhost:4000 is running release 5d5e1bcc45a6e8445904dde4838c82876313a98f (5d5e1bcc45a6)`

## Runtime permission verification

- The user-provided runner transcript records the runtime permission check passing. The expected temporary transcript was not found when this note was generated.

## NFR-005 performance exercise

- The existing exercise seeded 300 synthetic requests into the shared development database with team approval. They remain in the database; no cleanup or deletion was performed.
- Concurrency: 10; 200 measured requests per operation; 20 warm-up requests per operation excluded from the measurement.
- All three operations reported 100% within the proposed 2,000 ms target and no reported errors.
- Staff queue list: p95 388.1 ms; p99 538 ms; maximum 1,594.4 ms; 43.6 requests/second.
- Request detail: p95 181.7 ms; p99 189.3 ms; maximum 192.8 ms; 56.3 requests/second.
- Management summary: p95 529 ms; p99 1,118.4 ms; maximum 1,738.3 ms; 24 requests/second.
- Environment: Windows 10.0.26300, Intel Core i5-9400F, 31.9 GB RAM, Node v22.14.0.
- The staging API and load generator ran on the same local machine and competed for CPU. These are local HTTP measurements, not browser rendering time or production-capacity evidence.
- The two-second criterion is described in DEC-010 as proposed, not a baselined service-level commitment.
- The runner printed a blank exit-code value after it had saved and displayed the reports. The raw JSON and raw Markdown files are preserved below; the performance exercise was not repeated.

## Evidence artefacts and provenance

- `nfr-005-
2026-10-18T18-39-19-613Z
.json` is copied byte-for-byte from the original generated JSON report.
- `nfr-005-
2026-10-18T18-39-19-613Z
.md.generated.txt` preserves the original generated Markdown file byte-for-byte. It is stored as text because its typographic dash violates the repository Markdown writing rule.
- `nfr-005-
2026-10-18T18-39-19-613Z
.md` is the repository-friendly reading copy; only typographic dash/quote characters were normalised. Reported measurements and result rows were not changed.
- Original JSON SHA-256: `
02b02f6ced21210d5245b49ec9ad202b46aff18a71e53ca5e9057680a4fcb3bd
`.
- Original Markdown SHA-256: `
559b396ee1a4d451acd0506442c92ecc2636b60d9db5470ace4b6e84606c4954
`.

## Evidence limits and operational note

- The existing performance runner summary reported no request errors, but its wrapper displayed a blank process exit code after output generation. The resulting files were confirmed present locally.
- The shared database contains the 300 seeded synthetic requests in addition to pre-existing data. Do not delete these records without team approval.
- No secrets, database URLs, passwords or tokens are included in this evidence note.
