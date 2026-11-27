import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CharacterService, LedgerService, SessionService, requireUuid } from '@gta6-rp/core';
import {
  MigrationRunner,
  PgAccountRepository,
  PgCharacterRepository,
  PgFinancialAccountRepository,
  PgLedgerRepository,
  PgPoolSession,
  PgSessionRepository,
} from '@gta6-rp/persistence';

import { createCalmHttpServer } from './http.js';

export { health } from './health.js';
export { createCalmHttpServer } from './http.js';
export type { BootstrapSessionConfig, CalmApiServices } from './http.js';

const LOOPBACK_HOSTS = new Set(['127.0.0.1', '::1']);

function requireEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function readPort(value: string | undefined): number {
  if (value === undefined) return 8080;
  if (!/^\d{1,5}$/.test(value)) {
    throw new Error('CALM_API_PORT must be a decimal port between 1 and 65535.');
  }
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('CALM_API_PORT must be between 1 and 65535.');
  }
  return port;
}

async function start(): Promise<void> {
  const host = process.env['CALM_API_HOST']?.trim() || '127.0.0.1';
  if (!LOOPBACK_HOSTS.has(host)) {
    throw new Error(
      'The bootstrap API is restricted to loopback. Do not expose it through a public network or proxy.',
    );
  }
  const port = readPort(process.env['CALM_API_PORT']);

  const databaseUrl = requireEnvironment('DATABASE_URL');
  let parsedDatabaseUrl: URL;
  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }
  if (!['postgres:', 'postgresql:'].includes(parsedDatabaseUrl.protocol)) {
    throw new Error('DATABASE_URL must use the postgres or postgresql protocol.');
  }

  const bootstrapAccountId = requireUuid(
    requireEnvironment('CALM_BOOTSTRAP_ACCOUNT_ID'),
    'bootstrap account ID',
  );
  const bootstrapTokenSha256 = requireEnvironment('CALM_BOOTSTRAP_TOKEN_SHA256');
  if (!/^[a-fA-F0-9]{64}$/.test(bootstrapTokenSha256)) {
    throw new Error('CALM_BOOTSTRAP_TOKEN_SHA256 must contain exactly 64 hexadecimal characters.');
  }

  const sql = new PgPoolSession({
    connectionString: databaseUrl,
    max: 10,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    application_name: 'calm-api',
  });
  let server: ReturnType<typeof createCalmHttpServer> | undefined;
  let startupStage = 'applying database migrations';
  try {
    const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
    const migrationsDirectory = resolve(repositoryRoot, 'infrastructure/database/migrations');
    await new MigrationRunner(sql).applyDirectory(migrationsDirectory);

    const accounts = new PgAccountRepository(sql);
    startupStage = 'provisioning the fixed operator account';
    await accounts.ensureAccount(bootstrapAccountId);

    startupStage = 'constructing the application services';
    const characterStore = new PgCharacterRepository(sql);
    const services = {
      sessions: new SessionService(new PgSessionRepository(sql)),
      characters: new CharacterService(characterStore),
      ledger: new LedgerService(
        new PgFinancialAccountRepository(sql),
        new PgLedgerRepository(sql),
        {
          findOwnerAccount: async (characterId) =>
            (await characterStore.findById(characterId))?.accountId ?? null,
        },
      ),
      bootstrap: {
        accountId: bootstrapAccountId,
        tokenSha256: bootstrapTokenSha256,
      },
    } as const;
    server = createCalmHttpServer(services);

    startupStage = 'binding the loopback HTTP listener';
    await new Promise<void>((resolveListen, rejectListen) => {
      const onError = (error: Error) => rejectListen(error);
      server!.once('error', onError);
      server!.listen(port, host, () => {
        server!.off('error', onError);
        resolveListen();
      });
    });
    const displayHost = host.includes(':') ? `[${host}]` : host;
    process.stdout.write(`CALM API listening on http://${displayHost}:${port} (loopback only)\n`);

    let stopping = false;
    const stop = () => {
      if (stopping) return;
      stopping = true;
      server?.close(() => {
        void sql.close().then(
          () => process.exit(0),
          () => process.exit(1),
        );
      });
      setTimeout(() => process.exit(1), 10_000).unref();
    };
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
  } catch (error) {
    if (server?.listening)
      await new Promise<void>((resolveClose) => server!.close(() => resolveClose()));
    await sql.close().catch(() => undefined);
    const code =
      typeof error === 'object' &&
      error !== null &&
      typeof (error as { code?: unknown }).code === 'string' &&
      /^[A-Z0-9]{5}$/.test((error as { code: string }).code)
        ? ` SQLSTATE ${(error as { code: string }).code}`
        : '';
    throw new Error(`CALM API failed while ${startupStage}.${code} Sensitive details omitted.`, {
      cause: error,
    });
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  void start().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Unknown startup error.';
    process.stderr.write(`CALM API failed to start: ${message}\n`);
    process.exitCode = 1;
  });
}
