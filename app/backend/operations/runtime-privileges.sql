-- Run as the database/schema owner AFTER migrations. The civicconnect_runtime
-- LOGIN role must already exist with a strong privately configured password,
-- no role memberships and no superuser/CREATEDB/CREATEROLE/REPLICATION/BYPASSRLS.
-- Never grant membership in the owner role to the runtime role.
BEGIN;
DO $$
BEGIN
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO civicconnect_runtime', current_database());
  -- PostgreSQL grants TEMP to PUBLIC by default. This app needs no temp tables.
  -- Owner/migration operations still use the separate database owner login.
  EXECUTE format('REVOKE TEMPORARY ON DATABASE %I FROM PUBLIC', current_database());
END $$;
REVOKE ALL ON SCHEMA public FROM civicconnect_runtime;
GRANT USAGE ON SCHEMA public TO civicconnect_runtime;
REVOKE ALL ON TABLE public.service_requests, public.request_events,
  public.work_records, public.request_categories, public.schema_migrations FROM civicconnect_runtime;
GRANT SELECT ON TABLE public.request_categories TO civicconnect_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE public.service_requests TO civicconnect_runtime;
GRANT SELECT, INSERT ON TABLE public.request_events, public.work_records TO civicconnect_runtime;
REVOKE ALL ON SEQUENCE public.request_events_id_seq, public.work_records_id_seq FROM civicconnect_runtime;
GRANT USAGE ON SEQUENCE public.request_events_id_seq, public.work_records_id_seq TO civicconnect_runtime;
GRANT EXECUTE ON FUNCTION public.active_request_category(text) TO civicconnect_runtime;
COMMIT;
