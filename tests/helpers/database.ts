import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { PGlite } from '@electric-sql/pglite';

import { MigrationRunner, PgliteSession } from '@gta6-rp/persistence';

export const MIGRATIONS_DIR = resolve(process.cwd(), 'infrastructure/database/migrations');

/** Deterministic controllable clock shared by the session and ledger suites. */
export class MutableClock {
  #now: Date;

  public constructor(start: Date) {
    this.#now = start;
  }

  public now(): Date {
    return new Date(this.#now);
  }

  public advance(ms: number): void {
    this.#now = new Date(this.#now.getTime() + ms);
  }
}

export interface TestDatabase {
  readonly sql: PgliteSession;
  readonly directory: string;
  /** Close the engine but keep the on-disk cluster (restart harnesses reopen it). */
  close(): Promise<void>;
  /** Close the engine and remove its on-disk cluster. */
  dispose(): Promise<void>;
}

/** Open a fresh, fully migrated embedded PostgreSQL database. */
export async function openDatabase(): Promise<TestDatabase> {
  const directory = await mkdtemp(join(tmpdir(), 'calm-test-'));
  const sql = new PgliteSession(new PGlite(directory));
  await new MigrationRunner(sql).applyDirectory(MIGRATIONS_DIR);
  return {
    sql,
    directory,
    close: () => sql.close(),
    dispose: () => dispose(sql, directory),
  };
}

/** Reopen an existing database directory — the restart survival harness. */
export async function reopenDatabase(directory: string): Promise<TestDatabase> {
  const sql = new PgliteSession(new PGlite(directory));
  await new MigrationRunner(sql).applyDirectory(MIGRATIONS_DIR);
  return {
    sql,
    directory,
    close: () => sql.close(),
    dispose: () => dispose(sql, directory),
  };
}

/** Close the engine and remove its on-disk cluster (each is a full PostgreSQL data directory). */
async function dispose(sql: PgliteSession, directory: string): Promise<void> {
  await sql.close().catch(() => undefined);
  await rm(directory, { recursive: true, force: true }).catch(() => undefined);
}
