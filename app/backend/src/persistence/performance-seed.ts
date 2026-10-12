import { type Database } from "./database.js";

export interface PerformanceSeedOptions {
  count: number;
  namespace: string;
  requesterRefs: string[];
  staffRef: string;
  referenceTime: Date;
}

/** Synthetic load fixtures only; no deletion, no invented performance results. */
export async function seedPerformance(database: Database, options: PerformanceSeedOptions): Promise<void> {
  if (!Number.isInteger(options.count) || options.count < 1 || options.count > 100000) {
    throw new Error("Seed count must be between 1 and 100000");
  }
  if (!/^[a-zA-Z0-9_-]{1,40}$/.test(options.namespace)) throw new Error("Invalid seed namespace");
  if (!options.requesterRefs.length || options.requesterRefs.some((id) => !id.trim()) || !options.staffRef.trim()) {
    throw new Error("Seed identity references are required");
  }
  if (!Number.isFinite(options.referenceTime.getTime())) throw new Error("Invalid reference time");

  await database.transaction(async (client) => {
    // One namespace is one repeatable fixture. Reusing it fails rather than
    // overwriting a record or adding a duplicate event sequence.
    await client.query(`CREATE TEMP TABLE perf_fixture ON COMMIT DROP AS
      SELECT $1::text || '-' || n AS id, n,
        ($2::text[])[1 + ((n - 1) % cardinality($2::text[]))] AS requester,
        (ARRAY['c-facilities','c-it','c-security','c-maintenance','c-lost','c-other'])[1 + ((n - 1) % 6)] AS category,
        (ARRAY['Submitted','Accepted','In Progress','Resolved','Closed','Rejected'])[1 + (((n - 1) / 6) % 6)] AS status,
        $3::timestamptz - n * INTERVAL '1 minute' AS submitted_at,
        CASE WHEN n % 4 = 0 THEN NULL ELSE $3::timestamptz + ((n % 3) - 1) * INTERVAL '1 day' END AS due_at
      FROM generate_series(1, $4::integer) AS n`,
    [options.namespace, options.requesterRefs, options.referenceTime, options.count]);
    await client.query(`INSERT INTO service_requests
      (id, requester_ref, category_ref, title, description, status, responsible_ref, due_at, submitted_at, version)
      SELECT id, requester, category, 'Synthetic request ' || n,
        'Synthetic performance fixture; not a real service request', status,
        CASE WHEN status IN ('In Progress','Resolved','Closed') THEN $1::text ELSE NULL END,
        CASE WHEN status IN ('Accepted','In Progress','Resolved','Closed') THEN due_at ELSE NULL END,
        submitted_at,
        CASE status WHEN 'Submitted' THEN 0 WHEN 'Accepted' THEN 1 WHEN 'In Progress' THEN 3
          WHEN 'Resolved' THEN 4 WHEN 'Closed' THEN 5 WHEN 'Rejected' THEN 1 END
          + CASE WHEN status IN ('Accepted','In Progress','Resolved','Closed') AND due_at IS NOT NULL THEN 1 ELSE 0 END
      FROM perf_fixture`, [options.staffRef]);
    await client.query(`INSERT INTO request_events
      (request_id, actor_ref, event_kind, previous_status, new_status, details, occurred_at)
      SELECT id, requester, 'SUBMITTED', NULL, 'Submitted', '{}'::jsonb, submitted_at FROM perf_fixture
      UNION ALL
      SELECT id, $1::text, 'STATUS_CHANGED', 'Submitted', 'Accepted', '{}'::jsonb, submitted_at + INTERVAL '1 second'
        FROM perf_fixture WHERE status IN ('Accepted','In Progress','Resolved','Closed')
      UNION ALL
      SELECT id, $1::text, 'OWNERSHIP_CHANGED', 'Accepted', 'Accepted',
        jsonb_build_object('previousOwner', NULL, 'newOwner', $1::text), submitted_at + INTERVAL '2 seconds'
        FROM perf_fixture WHERE status IN ('In Progress','Resolved','Closed')
      UNION ALL
      SELECT id, $1::text, 'STATUS_CHANGED', 'Accepted', 'In Progress', '{}'::jsonb, submitted_at + INTERVAL '3 seconds'
        FROM perf_fixture WHERE status IN ('In Progress','Resolved','Closed')
      UNION ALL
      SELECT id, $1::text, 'STATUS_CHANGED', 'In Progress', 'Resolved',
        jsonb_build_object('resolution', 'Synthetic repair completed'), submitted_at + INTERVAL '4 seconds'
        FROM perf_fixture WHERE status IN ('Resolved','Closed')
      UNION ALL
      SELECT id, $1::text, 'STATUS_CHANGED', 'Resolved', 'Closed', '{}'::jsonb, submitted_at + INTERVAL '5 seconds'
        FROM perf_fixture WHERE status = 'Closed'
      UNION ALL
      SELECT id, $1::text, 'STATUS_CHANGED', 'Submitted', 'Rejected',
        jsonb_build_object('reason', 'Synthetic duplicate report'), submitted_at + INTERVAL '1 second'
        FROM perf_fixture WHERE status = 'Rejected'
      UNION ALL
      SELECT id, $1::text, 'DUE_DATE_CHANGED', 'Accepted', 'Accepted',
        jsonb_build_object('previousDueAt', NULL, 'newDueAt', due_at), submitted_at + INTERVAL '1.5 seconds'
        FROM perf_fixture WHERE status IN ('Accepted','In Progress','Resolved','Closed') AND due_at IS NOT NULL
      ORDER BY 7, 1`, [options.staffRef]);
    await client.query(`INSERT INTO work_records (request_id, actor_ref, kind, text, visible_to_requester, recorded_at)
      SELECT id, $1::text, 'RESOLUTION', 'Synthetic repair completed', TRUE, submitted_at + INTERVAL '4 seconds'
      FROM perf_fixture WHERE status IN ('Resolved','Closed')`, [options.staffRef]);
  });
}
