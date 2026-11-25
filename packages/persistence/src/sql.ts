/**
 * Driver-neutral SQL access for the CALM persistence layer.
 *
 * The same `SqlSession` contract is implemented over the production `pg`
 * connection pool and over the embedded PostgreSQL engine used for local,
 * restart-safe verification. Repositories written against this contract run
 * unchanged against both drivers and against a real server.
 */

export type SqlParam = string | number | bigint | boolean | null;

/** One result row. Values are driver-returned scalars (strings for most PG types). */
export type SqlRow = Record<string, unknown>;

export interface SqlResult {
  readonly rows: readonly SqlRow[];
}

export interface SqlExecutor {
  /**
   * Run a single statement with bound parameters (`$1`, `$2`, …).
   * BigInt parameters must be passed as strings; PostgreSQL casts them to
   * the target numeric type on arrival.
   */
  query(text: string, params?: readonly SqlParam[]): Promise<SqlResult>;
}

/** Runs multi-statement SQL scripts (no bound parameters). */
export interface SqlScriptRunner {
  executeScript(script: string): Promise<void>;
}

export interface SqlSession extends SqlExecutor, SqlScriptRunner {
  /**
   * Run `work` inside one atomic transaction. Either every statement
   * commits or every statement rolls back — including statements issued
   * by repository code that only sees the executor handed to it.
   */
  withTransaction<T>(work: (executor: SqlExecutor & SqlScriptRunner) => Promise<T>): Promise<T>;

  close(): Promise<void>;
}

const UNIQUE_VIOLATION = '23505';

/** Detect a PostgreSQL unique-constraint violation across driver wrappers. */
export function isUniqueViolation(error: unknown): boolean {
  if (typeof error === 'object' && error !== null) {
    const code = (error as { code?: unknown }).code;
    if (code === UNIQUE_VIOLATION) return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return /duplicate key value/i.test(message);
}

/** Read one driver-scalar as a BigInt (`bigint` columns come back as text). */
export function readBigInt(row: SqlRow, column: string): bigint {
  const value = row[column];
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number') return BigInt(value);
  if (typeof value === 'string' && /^-?\d+$/.test(value)) return BigInt(value);
  throw new Error(`Column ${column} is not an integer scalar: ${String(value)}`);
}

/** Normalize a driver timestamp (`Date` or PG text) into a `Date`. */
export function readTimestamp(row: SqlRow, column: string): Date {
  const value = row[column];
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    // PostgreSQL text form "2026-11-25 12:00:00.123+00" → ISO with "T" and a
    // full timezone offset so `Date` parses it deterministically in any locale.
    const normalized = value.replace(' ', 'T');
    const withZone = /([+-]\d{2})$/.test(normalized)
      ? `${normalized}00`
      : /Z$/.test(normalized)
        ? normalized
        : `${normalized}+00:00`;
    const parsed = new Date(withZone);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  throw new Error(`Column ${column} is not a timestamp scalar: ${String(value)}`);
}

/** Read a nullable driver timestamp. */
export function readTimestampOrNull(row: SqlRow, column: string): Date | null {
  const value = row[column];
  if (value === null || value === undefined) return null;
  return readTimestamp(row, column);
}

/** Read a nullable text column as a trimmed string or `null`. */
export function readTextOrNull(row: SqlRow, column: string): string | null {
  const value = row[column];
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') throw new Error(`Column ${column} is not text: ${String(value)}`);
  return value;
}
