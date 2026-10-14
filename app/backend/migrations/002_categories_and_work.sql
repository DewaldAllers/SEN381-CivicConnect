-- Development category proposal matching Tristan's client. Review under P-01.
CREATE TABLE request_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE CHECK (length(btrim(name)) > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO request_categories (id, name) VALUES
  ('c-facilities', 'Facilities'), ('c-it', 'IT support'),
  ('c-security', 'Security'), ('c-maintenance', 'Maintenance'),
  ('c-lost', 'Lost property'), ('c-other', 'Other');

-- Existing unknown category values cause a migration error; never silently remap.
ALTER TABLE service_requests ADD CONSTRAINT service_requests_category_fk
  FOREIGN KEY (category_ref) REFERENCES request_categories(id);

ALTER TABLE request_events ADD COLUMN visible_to_requester BOOLEAN NOT NULL DEFAULT TRUE;
-- Record time after any row-lock wait rather than at transaction start.
ALTER TABLE request_events ALTER COLUMN occurred_at SET DEFAULT clock_timestamp();
-- Locate the original checks by definition instead of generated names.
DO $$
DECLARE constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'request_events'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%event_kind%'
  LOOP
    EXECUTE format('ALTER TABLE request_events DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE request_events ADD CONSTRAINT request_events_kind_check CHECK (
  event_kind IN ('SUBMITTED', 'STATUS_CHANGED', 'OWNERSHIP_CHANGED', 'WORK_RECORDED', 'DUE_DATE_CHANGED')
);
ALTER TABLE request_events ADD CONSTRAINT request_events_status_pair_check CHECK (
  (event_kind = 'SUBMITTED' AND previous_status IS NULL AND new_status = 'Submitted')
  OR (event_kind <> 'SUBMITTED' AND previous_status IS NOT NULL AND previous_status IN (
    'Submitted', 'Accepted', 'Rejected', 'In Progress', 'Resolved', 'Closed'
  ))
);

CREATE TABLE work_records (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES service_requests(id) ON DELETE RESTRICT,
  actor_ref TEXT NOT NULL CHECK (length(btrim(actor_ref)) > 0),
  kind TEXT NOT NULL CHECK (kind IN ('ACTION', 'NOTE', 'RESOLUTION')),
  text TEXT NOT NULL CHECK (length(btrim(text)) > 0),
  visible_to_requester BOOLEAN NOT NULL DEFAULT FALSE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX work_records_request_time_idx ON work_records (request_id, recorded_at, id);
CREATE INDEX service_requests_category_due_idx ON service_requests (category_ref, due_at)
  WHERE status IN ('Accepted', 'In Progress');

-- A controlled redaction route needs a separate migration and decision.
CREATE FUNCTION reject_history_mutation() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'History and work records are append-only';
END $$;
CREATE TRIGGER request_events_append_only BEFORE UPDATE OR DELETE ON request_events
  FOR EACH ROW EXECUTE FUNCTION reject_history_mutation();
CREATE TRIGGER work_records_append_only BEFORE UPDATE OR DELETE ON work_records
  FOR EACH ROW EXECUTE FUNCTION reject_history_mutation();
