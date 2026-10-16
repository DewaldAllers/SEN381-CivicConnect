-- FOR SHARE needs UPDATE privilege even when it only reads. Encapsulate that
-- single, fixed lock so the app role needs no category UPDATE privilege.
DO $migration$
DECLARE target_schema text := current_schema();
BEGIN
  EXECUTE format($definition$
    CREATE FUNCTION %I.active_request_category(input_category_ref text)
    RETURNS TABLE(id text)
    LANGUAGE sql SECURITY DEFINER
    SET search_path = pg_catalog, pg_temp
    AS %L
  $definition$, target_schema,
    format('SELECT c.id FROM %I.request_categories c WHERE c.id = input_category_ref AND c.active = TRUE FOR SHARE', target_schema));
  EXECUTE format('REVOKE ALL ON FUNCTION %I.active_request_category(text) FROM PUBLIC', target_schema);
END $migration$;
