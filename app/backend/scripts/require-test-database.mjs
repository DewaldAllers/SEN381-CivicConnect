if (!process.env.TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL must point to a PostgreSQL test service; this check cannot use an in-memory substitute");
}
