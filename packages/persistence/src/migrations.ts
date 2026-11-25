import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { SqlRow, SqlSession } from './sql.js';
import type { SqlExecutor, SqlScriptRunner } from './sql.js';
import { readTimestamp } from './sql.js';

export interface AppliedMigration {
  readonly name: string;
  readonly appliedAt: Date;
}

const MIGRATIONS_TABLE = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  name TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

/**
 * Applies the additive SQL migrations in a directory, in file-name order,
 * exactly once each. Migrations never drop or rewrite existing data; each one
 * runs inside its own transaction together with its own bookkeeping row, so an
 * interrupted run leaves either the old or the new state, never a partial one.
 */
export class MigrationRunner {
  readonly #session: SqlSession;

  public constructor(session: SqlSession) {
    this.#session = session;
  }

  public async applied(): Promise<readonly AppliedMigration[]> {
    await this.#session.query(MIGRATIONS_TABLE);
    const result = await this.#session.query(
      'SELECT name, applied_at FROM schema_migrations ORDER BY name',
    );
    return result.rows.map((row: SqlRow) => ({
      name: String(row['name']),
      appliedAt: readTimestamp(row, 'applied_at'),
    }));
  }

  public async applyDirectory(directory: string): Promise<readonly AppliedMigration[]> {
    await this.#session.query(MIGRATIONS_TABLE);
    const already = new Set(
      (await this.#session.query('SELECT name FROM schema_migrations')).rows.map((row) =>
        String(row['name']),
      ),
    );

    const files = (await readdir(directory)).filter((file) => file.endsWith('.sql')).sort();

    const appliedNow: AppliedMigration[] = [];
    for (const file of files) {
      if (already.has(file)) continue;
      const script = await readFile(join(directory, file), 'utf8');
      await this.#session.withTransaction(async (executor: SqlExecutor & SqlScriptRunner) => {
        await executor.executeScript(script);
        await executor.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      });
      appliedNow.push({ name: file, appliedAt: new Date() });
    }
    return appliedNow;
  }
}
