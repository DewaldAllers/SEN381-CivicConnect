import { PGlite } from "@electric-sql/pglite";
import { type Database, type SqlExecutor, type SqlRow } from "../../src/persistence/database.js";

export class EmbeddedPostgresDatabase implements Database {
  constructor(private readonly db: PGlite) {}

  async query<Row extends SqlRow>(sql: string, values: unknown[] = []): Promise<{ rows: Row[] }> {
    if (values.length === 0) {
      const results = await this.db.exec(sql);
      return { rows: (results.at(-1)?.rows ?? []) as Row[] };
    }
    const result = await this.db.query<Row>(sql, values);
    return { rows: result.rows };
  }

  async transaction<Result>(work: (client: SqlExecutor) => Promise<Result>): Promise<Result> {
    return this.db.transaction((transaction) => work({
      query: async <Row extends SqlRow>(sql: string, values: unknown[] = []) => {
        if (values.length === 0) {
          const results = await transaction.exec(sql);
          return { rows: (results.at(-1)?.rows ?? []) as Row[] };
        }
        const result = await transaction.query<Row>(sql, values);
        return { rows: result.rows };
      },
    }));
  }
}

export function failingEventDatabase(database: Database): Database {
  return {
    query: (sql, values) => database.query(sql, values),
    transaction: (work) => database.transaction((client) => work({
      query: (sql, values) => {
        if (sql.includes("INSERT INTO request_events")) throw new Error("Injected event write failure");
        return client.query(sql, values);
      },
    })),
  };
}
