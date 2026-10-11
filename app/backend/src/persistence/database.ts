import { Pool } from "pg";

export interface SqlRow {
  [column: string]: unknown;
}

export interface SqlExecutor {
  query<Row extends SqlRow>(sql: string, values?: unknown[]): Promise<{ rows: Row[] }>;
}

export interface Database extends SqlExecutor {
  transaction<Result>(work: (client: SqlExecutor) => Promise<Result>): Promise<Result>;
}

/** Every statement in a transaction must use the same checked-out client. */
export class PostgresDatabase implements Database {
  constructor(private readonly pool: Pool) {}

  async query<Row extends SqlRow>(sql: string, values: unknown[] = []): Promise<{ rows: Row[] }> {
    const result = await this.pool.query<Row>(sql, values);
    return { rows: result.rows };
  }

  async transaction<Result>(work: (client: SqlExecutor) => Promise<Result>): Promise<Result> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await work({
        query: async <Row extends SqlRow>(sql: string, values: unknown[] = []) => {
          const queryResult = await client.query<Row>(sql, values);
          return { rows: queryResult.rows };
        },
      });
      await client.query("COMMIT");
      return result;
    } catch (error) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        throw new AggregateError([error, rollbackError], "Transaction and rollback both failed");
      }
      throw error;
    } finally {
      client.release();
    }
  }
}
