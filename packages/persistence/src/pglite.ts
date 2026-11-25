import type { PGlite } from '@electric-sql/pglite';

import type { SqlExecutor, SqlParam, SqlResult, SqlRow, SqlScriptRunner, SqlSession } from './sql.js';

/**
 * Session over the embedded PostgreSQL engine (real PostgreSQL compiled to
 * WASM, persisting to a directory). It powers local verification with true
 * SQL semantics — constraints, transactions, WAL-persisted durability —
 * without a server.
 *
 * The embedded engine exposes a single connection, so the session serializes
 * work through an internal queue: a transaction holds the connection for its
 * whole critical section and every other call waits. Parallel callers still
 * interleave at statement boundaries the way separate pool connections would
 * at transaction boundaries, which is what the concurrency suites assert on.
 */
export class PgliteSession implements SqlSession {
  readonly #db: PGlite;
  #queue: Promise<unknown> = Promise.resolve();

  public constructor(db: PGlite) {
    this.#db = db;
  }

  public async query(text: string, params?: readonly SqlParam[]): Promise<SqlResult> {
    return this.#enqueue(async () => {
      const result = await this.#db.query(text, params ? [...params] : []);
      return { rows: (result as { rows?: SqlRow[] }).rows ?? [] };
    });
  }

  public async executeScript(script: string): Promise<void> {
    await this.#enqueue(() => this.#db.exec(script));
  }

  public async withTransaction<T>(
    work: (executor: SqlExecutor & SqlScriptRunner) => Promise<T>,
  ): Promise<T> {
    return this.#enqueue(async () => {
      await this.#db.query('BEGIN');
      try {
        const result = await work(directExecutor(this.#db));
        await this.#db.query('COMMIT');
        return result;
      } catch (error) {
        await this.#db.query('ROLLBACK');
        throw error;
      }
    });
  }

  public async close(): Promise<void> {
    await this.#enqueue(() => this.#db.close());
  }

  #enqueue<T>(job: () => Promise<T>): Promise<T> {
    const next = this.#queue.then(job, job);
    this.#queue = next.catch(() => undefined);
    return next;
  }
}

function directExecutor(db: PGlite): SqlExecutor & SqlScriptRunner {
  return {
    async query(text: string, params?: readonly SqlParam[]): Promise<SqlResult> {
      const result = await db.query(text, params ? [...params] : []);
      return { rows: (result as { rows?: SqlRow[] }).rows ?? [] };
    },
    async executeScript(script: string): Promise<void> {
      await db.exec(script);
    },
  };
}
