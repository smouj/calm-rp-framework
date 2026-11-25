import { Pool, type PoolClient, type PoolConfig } from 'pg';

import type {
  SqlExecutor,
  SqlParam,
  SqlResult,
  SqlRow,
  SqlScriptRunner,
  SqlSession,
} from './sql.js';

/**
 * Production session over a `pg` connection pool. Every transaction checks
 * out its own client, so concurrent transactions get genuinely separate
 * connections and are serialized by PostgreSQL itself (row locks, unique
 * constraints, snapshot isolation).
 */
export class PgPoolSession implements SqlSession {
  readonly #pool: Pool;

  public constructor(config: PoolConfig | Pool) {
    this.#pool = config instanceof Pool ? config : new Pool(config);
  }

  public async query(text: string, params?: readonly SqlParam[]): Promise<SqlResult> {
    const result = await this.#pool.query(text, params ? [...params] : undefined);
    return { rows: result.rows as SqlRow[] };
  }

  public async executeScript(script: string): Promise<void> {
    await this.#pool.query(script);
  }

  public async withTransaction<T>(
    work: (executor: SqlExecutor & SqlScriptRunner) => Promise<T>,
  ): Promise<T> {
    const client: PoolClient = await this.#pool.connect();
    await client.query('BEGIN');
    try {
      const result = await work(clientExecutor(client));
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.#pool.end();
  }
}

function clientExecutor(client: PoolClient): SqlExecutor & SqlScriptRunner {
  return {
    async query(text: string, params?: readonly SqlParam[]): Promise<SqlResult> {
      const result = await client.query(text, params ? [...params] : undefined);
      return { rows: result.rows as SqlRow[] };
    },
    async executeScript(script: string): Promise<void> {
      await client.query(script);
    },
  };
}
