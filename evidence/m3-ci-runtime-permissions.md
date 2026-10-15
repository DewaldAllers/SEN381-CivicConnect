# M3 CI gate and runtime database permissions

15 October 2026 | Author: Dewald Allers | Branch: `m3-runtime-permissions-ci-evidence`

## Required CI gate: live repository setting

I enabled `backend-checks` as a required status check on `main`, pinned to GitHub Actions app ID 15368. Strict/up-to-date checking is enabled. I kept the existing two approvals, stale-approval dismissal, conversation resolution and admin enforcement enabled, with force pushes and deletions disabled. The backend job runs TypeScript checking, automated tests and a blocking high/critical shipped-dependency audit. A failed required job prevents merging; an administrator has no configured bypass.

Read back with `gh api repos/DewaldAllers/SEN381-CivicConnect/branches/main/protection`:

```json
{
  "required_status_checks": {
    "strict": true,
    "checks": [{ "context": "backend-checks", "app_id": 15368 }]
  },
  "required_approving_review_count": 2,
  "enforce_admins": true,
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

This is a dated, condensed API readback, not a new policy file consumed by GitHub. Re-read live settings for assessment. No red PR was merged or bypass attempt performed as part of this change. The database workflow remains additional verification, not a required context: it uses backend-path filtering and would otherwise leave documentation-only PRs waiting for an absent check. One meaningful required failure satisfies SRC-M3 section 9; requiring every workflow is not necessary. The new browser workflow is separately reviewed in PR #43.

## Database audit and correction

The original `civicconnect_app` login owned the database/schema/tables and had CREATEDB and CREATEROLE. It remains the private owner/migration login, not the recommended runtime identity. A new `civicconnect_runtime` login has no role memberships, ownership, SUPERUSER, CREATEDB, CREATEROLE, REPLICATION or BYPASSRLS.

| Object | Runtime permissions |
| --- | --- |
| Database / public schema | CONNECT / USAGE; no schema CREATE or TEMP privilege |
| `request_categories` | SELECT only |
| `service_requests` | SELECT, INSERT, UPDATE; no DELETE/TRUNCATE |
| `request_events`, `work_records` | SELECT, INSERT only; no UPDATE/DELETE/TRUNCATE |
| Event/work identity sequences | USAGE only |
| `schema_migrations` | None |
| `active_request_category(text)` | EXECUTE; can only read/lock a matching active category |

PostgreSQL requires an UPDATE privilege to use `FOR SHARE` even when no category is changed. Migration 003 preserves the category lock through a fixed-SQL SECURITY DEFINER helper rather than granting category writes to the app. Its table is schema-qualified, its search path is fixed to `pg_catalog, pg_temp`, and PUBLIC execution is revoked. Only the database owner role and explicitly granted runtime login execute it. New migrations/new tables need explicit grant review; there is no blanket future-table grant.

`operations/runtime-privileges.sql` also revokes the default PUBLIC TEMP grant on this database. The database owner role retains administrative/migration ability. This is one backend database identity, not database-per-person authorisation: the server still enforces requester ownership and staff/management category scope.

## Executed verification and limits

The restricted login connected to the hosted PostgreSQL 18.6 database. `db:verify:runtime` verified every listed table permission, absence of ownership/administrative attributes/memberships/DDL/TEMP privileges, and successfully submitted, assigned, accepted, noted and changed a due date with version 4 and exactly five events. A single outer transaction rolled back all synthetic rows. Identity sequence numbers can be consumed without a committed row.

DELETE of requests, UPDATE of history/work/categories, and CREATE TABLE were rejected with SQLSTATE 42501 using non-destructive/rollback-only probes. Shared application records were not deleted or reset. The persistence workflow now reproduces the restricted-login check on its disposable PostgreSQL service as well as the existing integration/restart checks. This evidence is not a claim that staging or performance testing has been executed.

Local lint and type checking passed, and `npm test` passed 151 cases with two intentional skips. The helper's extra regression checks its fixed search path, SECURITY DEFINER flag and revoked PUBLIC execute grant. The real-database `test:postgres` run passed 31 cases with one intentional memory-only skip after adding migration 003. These counts do not include a staging deployment or performance result.

## Private handoff and expiry

- `app/backend/.env.database` and `.env.database-runtime` now contain the verified restricted app connection as `DATABASE_URL`.
- `.codex-work/CivicConnect-Database-Connection.txt` now contains that same restricted URL for private sharing with Liam. Never paste it in a public PR, register, frontend file or screenshot.
- `app/backend/.env.database-admin` preserves the existing owner connection as `DATABASE_ADMIN_URL`. Use it only for migrations/maintenance. `TEST_DATABASE_URL` also needs a privileged test connection because those test commands create/drop isolated schemas.
- These local files are gitignored. Liam must replace any older database-owner URL he saved for the app; changing my saved file does not update another computer or a deployed service. I did not revoke or rotate the database owner credentials, so no teammate was locked out.
- The free database expires on **13 November 2026**. No payment or paid upgrade was made. Recreate/move the environment using migrations and update private settings before expiry; existing data needs a separately verified export/restore if it must be retained. Migrations alone are not a data backup.

The required-check setting is live immediately. The helper/permission tooling and setup changes still follow the two-reviewer PR process before they become the main-branch release baseline. Liam still owns the measured load run and staging demonstration; Tristan owns linkage of this evidence into the PED/RTM/release review.
