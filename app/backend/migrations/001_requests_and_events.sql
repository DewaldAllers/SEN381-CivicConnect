CREATE TABLE service_requests (
  id TEXT PRIMARY KEY,
  requester_ref TEXT NOT NULL CHECK (length(btrim(requester_ref)) > 0),
  category_ref TEXT NOT NULL CHECK (length(btrim(category_ref)) > 0),
  title TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  description TEXT NOT NULL CHECK (length(btrim(description)) > 0),
  status TEXT NOT NULL CHECK (status IN (
    'Submitted', 'Accepted', 'Rejected', 'In Progress', 'Resolved', 'Closed'
  )),
  responsible_ref TEXT,
  due_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  version INTEGER NOT NULL DEFAULT 0 CHECK (version >= 0)
);

CREATE TABLE request_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES service_requests(id) ON DELETE RESTRICT,
  actor_ref TEXT NOT NULL CHECK (length(btrim(actor_ref)) > 0),
  event_kind TEXT NOT NULL CHECK (event_kind IN ('SUBMITTED', 'STATUS_CHANGED')),
  previous_status TEXT,
  new_status TEXT NOT NULL CHECK (new_status IN (
    'Submitted', 'Accepted', 'Rejected', 'In Progress', 'Resolved', 'Closed'
  )),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (
    (event_kind = 'SUBMITTED' AND previous_status IS NULL AND new_status = 'Submitted')
    OR (event_kind = 'STATUS_CHANGED' AND previous_status IS NOT NULL)
  )
);

CREATE INDEX request_events_request_time_idx
  ON request_events (request_id, occurred_at, id);

CREATE INDEX service_requests_requester_time_idx
  ON service_requests (requester_ref, submitted_at DESC);

CREATE INDEX service_requests_category_status_time_idx
  ON service_requests (category_ref, status, submitted_at);
