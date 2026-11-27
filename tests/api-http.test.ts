import { createHash } from 'node:crypto';
import type { Server } from 'node:http';

import { afterAll, describe, expect, it } from 'vitest';

import {
  CharacterService,
  InMemorySessionStore,
  LedgerService,
  SessionService,
  newUuid,
} from '@gta6-rp/core';
import {
  PgAccountRepository,
  PgCharacterRepository,
  PgFinancialAccountRepository,
  PgLedgerRepository,
  PgSessionRepository,
} from '@gta6-rp/persistence';

import { createCalmHttpServer } from '../apps/api/src/http.js';
import type { CalmApiServices } from '../apps/api/src/http.js';
import { openDatabase } from './helpers/database.js';

const BOOTSTRAP_SECRET = 'calm-local-operator-secret-for-http-tests';
const OPERATOR_ACCOUNT_ID = newUuid();
const PLAYER_ACCOUNT_ID = newUuid();

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

async function listen(server: Server): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    const onError = (error: Error) => reject(error);
    server.once('error', onError);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', onError);
      resolve();
    });
  });
  const address = server.address();
  if (address === null || typeof address === 'string') throw new Error('Expected a TCP address.');
  return `http://127.0.0.1:${address.port}`;
}

async function closeServer(server: Server): Promise<void> {
  if (!server.listening) return;
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function responseBody(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

function jsonRequest(
  body: unknown,
  token?: string,
  headers: Record<string, string> = {},
): RequestInit {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token === undefined ? {} : { authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: JSON.stringify(body),
  };
}

describe('CALM HTTP API — authenticated F1 transport', () => {
  const databasePromise = openDatabase();
  let services!: CalmApiServices;
  let apiServer!: Server;
  let baseUrl!: string;
  let operatorToken!: string;
  let operatorSessions!: SessionService;
  let operatorCharacters!: CharacterService;

  afterAll(async () => {
    if (apiServer) await closeServer(apiServer);
    const database = await databasePromise;
    await database.dispose();
  });

  it('starts a loopback API with durable services and fixed operator bootstrap identity', async () => {
    const database = await databasePromise;
    const accounts = new PgAccountRepository(database.sql);
    await accounts.ensureAccount(OPERATOR_ACCOUNT_ID);
    await accounts.ensureAccount(PLAYER_ACCOUNT_ID);
    const characterStore = new PgCharacterRepository(database.sql);
    operatorSessions = new SessionService(new PgSessionRepository(database.sql));
    operatorCharacters = new CharacterService(characterStore);
    const ledger = new LedgerService(
      new PgFinancialAccountRepository(database.sql),
      new PgLedgerRepository(database.sql),
      {
        findOwnerAccount: async (characterId) =>
          (await characterStore.findById(characterId))?.accountId ?? null,
      },
    );
    services = {
      sessions: operatorSessions,
      characters: operatorCharacters,
      ledger,
      bootstrap: {
        accountId: OPERATOR_ACCOUNT_ID,
        tokenSha256: sha256(BOOTSTRAP_SECRET),
      },
    };
    apiServer = createCalmHttpServer(services);
    baseUrl = await listen(apiServer);

    const bootstrapResponse = await fetch(
      `${baseUrl}/v1/auth/bootstrap`,
      jsonRequest({ bootstrapToken: BOOTSTRAP_SECRET }),
    );
    const bootstrapBody = await responseBody(bootstrapResponse);
    expect(bootstrapResponse.status).toBe(201);
    expect(bootstrapBody).not.toHaveProperty('accountId');
    expect(bootstrapBody).not.toHaveProperty('capabilities');
    expect(typeof bootstrapBody['token']).toBe('string');
    operatorToken = String(bootstrapBody['token']);

    const resolved = await operatorSessions.authenticate(operatorToken);
    expect(resolved?.accountId).toBe(OPERATOR_ACCOUNT_ID);
    expect(resolved?.capabilities).toEqual(['economy.grant']);
  });

  it('rejects client-supplied account and capability claims, and enforces ownership', async () => {
    const forgedBootstrap = await fetch(
      `${baseUrl}/v1/auth/bootstrap`,
      jsonRequest({
        bootstrapToken: BOOTSTRAP_SECRET,
        accountId: PLAYER_ACCOUNT_ID,
        capabilities: ['economy.grant'],
      }),
    );
    expect(forgedBootstrap.status).toBe(400);
    expect(await responseBody(forgedBootstrap)).toMatchObject({ error: 'INVALID_BODY' });

    const forgedCharacter = await fetch(
      `${baseUrl}/v1/characters`,
      jsonRequest(
        { firstName: 'Client', lastName: 'Claim', accountId: PLAYER_ACCOUNT_ID },
        operatorToken,
      ),
    );
    expect(forgedCharacter.status).toBe(400);

    const ownResponse = await fetch(
      `${baseUrl}/v1/characters`,
      jsonRequest({ firstName: 'Ada', lastName: 'Operator' }, operatorToken),
    );
    expect(ownResponse.status).toBe(201);
    const ownCharacter = await responseBody(ownResponse);
    const ownCharacterId = String(ownCharacter['id']);

    const playerIssued = await operatorSessions.issue({
      accountId: PLAYER_ACCOUNT_ID,
      capabilities: [],
      ttlMs: 60_000,
    });
    const playerCharacterResponse = await fetch(
      `${baseUrl}/v1/characters`,
      jsonRequest({ firstName: 'Lucia', lastName: 'Player' }, playerIssued.token),
    );
    expect(playerCharacterResponse.status).toBe(201);
    const playerCharacter = await responseBody(playerCharacterResponse);
    const playerCharacterId = String(playerCharacter['id']);

    const listed = await fetch(`${baseUrl}/v1/characters`, {
      headers: { authorization: `Bearer ${operatorToken}` },
    });
    expect((await listed.json()) as unknown[]).toHaveLength(1);

    const stolenBalance = await fetch(`${baseUrl}/v1/characters/${playerCharacterId}/balance`, {
      headers: { authorization: `Bearer ${operatorToken}` },
    });
    expect(stolenBalance.status).toBe(403);

    const ownBalance = await fetch(`${baseUrl}/v1/characters/${ownCharacterId}/balance`, {
      headers: { authorization: `Bearer ${operatorToken}` },
    });
    expect(ownBalance.status).toBe(200);
    expect(await responseBody(ownBalance)).toMatchObject({ balanceMinor: '0' });

    const stolenTransfer = await fetch(
      `${baseUrl}/v1/economy/transfers`,
      jsonRequest(
        {
          fromCharacterId: playerCharacterId,
          toCharacterId: ownCharacterId,
          amountMinor: '1',
        },
        operatorToken,
        { 'idempotency-key': 'ownership-transfer-attempt' },
      ),
    );
    expect(stolenTransfer.status).toBe(403);
  });

  it('requires a grant reason and writes one immutable, attributable audit per idempotent grant', async () => {
    const character = await operatorCharacters.create(
      { accountId: OPERATOR_ACCOUNT_ID, capabilities: ['economy.grant'] },
      { firstName: 'Grant', lastName: 'Target' },
    );
    const unsafeBody = {
      toCharacterId: character.id,
      amountMinor: '2500',
      reason: 'staff correction',
      actorAccountId: PLAYER_ACCOUNT_ID,
      capabilities: ['economy.grant'],
    };
    const forgedGrant = await fetch(
      `${baseUrl}/v1/admin/economy/grants`,
      jsonRequest(unsafeBody, operatorToken, { 'idempotency-key': 'forged-grant-attempt' }),
    );
    expect(forgedGrant.status).toBe(400);

    const playerSession = await operatorSessions.issue({
      accountId: PLAYER_ACCOUNT_ID,
      capabilities: [],
      ttlMs: 60_000,
    });
    const deniedGrant = await fetch(
      `${baseUrl}/v1/admin/economy/grants`,
      jsonRequest(
        {
          toCharacterId: character.id,
          amountMinor: '2500',
          reason: 'Player cannot grant money',
        },
        playerSession.token,
        { 'idempotency-key': 'player-grant-attempt' },
      ),
    );
    expect(deniedGrant.status).toBe(403);

    const invalidReason = await fetch(
      `${baseUrl}/v1/admin/economy/grants`,
      jsonRequest(
        { toCharacterId: character.id, amountMinor: '2500', reason: '   ' },
        operatorToken,
        { 'idempotency-key': 'grant-empty-reason' },
      ),
    );
    expect(invalidReason.status).toBe(400);
    expect(await responseBody(invalidReason)).toMatchObject({ error: 'INVALID_AUDIT_REASON' });

    const grantBody = {
      toCharacterId: character.id,
      amountMinor: '2500',
      reason: 'Approved staff economy correction',
    };
    const first = await fetch(
      `${baseUrl}/v1/admin/economy/grants`,
      jsonRequest(grantBody, operatorToken, {
        'idempotency-key': 'grant-audit-durable-001',
        'x-correlation-id': 'staff-case-2026-001',
      }),
    );
    expect(first.status).toBe(201);
    expect((await responseBody(first))['posted']).toBe(true);

    const changedReasonReplay = await fetch(
      `${baseUrl}/v1/admin/economy/grants`,
      jsonRequest(
        { ...grantBody, reason: 'Different explanation for same idempotency key' },
        operatorToken,
        { 'idempotency-key': 'grant-audit-durable-001' },
      ),
    );
    expect(changedReasonReplay.status).toBe(409);
    expect(await responseBody(changedReasonReplay)).toMatchObject({
      error: 'IDEMPOTENCY_CONFLICT',
    });

    const replay = await fetch(
      `${baseUrl}/v1/admin/economy/grants`,
      jsonRequest(grantBody, operatorToken, {
        'idempotency-key': 'grant-audit-durable-001',
        'x-correlation-id': 'staff-case-retry',
      }),
    );
    expect(replay.status).toBe(200);
    expect((await responseBody(replay))['posted']).toBe(false);

    const database = await databasePromise;
    const audit = await database.sql.query(
      `SELECT action, actor_account_id, reason, correlation_id
         FROM privileged_action_audits
        WHERE correlation_id = $1`,
      ['staff-case-2026-001'],
    );
    expect(audit.rows).toHaveLength(1);
    expect(audit.rows[0]).toMatchObject({
      action: 'economy.grant',
      actor_account_id: OPERATOR_ACCOUNT_ID,
      reason: 'Approved staff economy correction',
      correlation_id: 'staff-case-2026-001',
    });
    const repeatedAudit = await database.sql.query(
      `SELECT count(*) AS count FROM privileged_action_audits a
        JOIN ledger_transactions t ON t.id = a.transaction_id
       WHERE t.idempotency_key = $1`,
      ['grant-audit-durable-001'],
    );
    expect(Number(repeatedAudit.rows[0]?.['count'])).toBe(1);
    await expect(
      database.sql.query(
        `UPDATE privileged_action_audits SET reason = 'rewritten'
          WHERE correlation_id = $1`,
        ['staff-case-2026-001'],
      ),
    ).rejects.toThrow(/append-only/i);
  });

  it('rolls back a grant if its audit cannot be written and does not reveal database details', async () => {
    const character = await operatorCharacters.create(
      { accountId: OPERATOR_ACCOUNT_ID, capabilities: ['economy.grant'] },
      { firstName: 'Atomic', lastName: 'Audit' },
    );
    const database = await databasePromise;
    const body = {
      toCharacterId: character.id,
      amountMinor: '500',
      reason: 'Atomicity test',
    };
    try {
      await database.sql.executeScript(`
        CREATE FUNCTION calm_test_reject_privileged_audit() RETURNS trigger AS $$
        BEGIN
          RAISE EXCEPTION 'injected audit insert failure';
        END;
        $$ LANGUAGE plpgsql;
        CREATE TRIGGER calm_test_reject_privileged_audit_insert
          BEFORE INSERT ON privileged_action_audits
          FOR EACH ROW EXECUTE FUNCTION calm_test_reject_privileged_audit();
      `);

      const firstAttempt = await fetch(
        `${baseUrl}/v1/admin/economy/grants`,
        jsonRequest(body, operatorToken, { 'idempotency-key': 'audit-failure-rollback-001' }),
      );
      expect(firstAttempt.status).toBe(500);
      const failureBody = await responseBody(firstAttempt);
      expect(failureBody).toMatchObject({ error: 'INTERNAL_ERROR' });
      expect(JSON.stringify(failureBody)).not.toContain('injected audit insert failure');

      const missingTransaction = await database.sql.query(
        'SELECT id FROM ledger_transactions WHERE idempotency_key = $1',
        ['audit-failure-rollback-001'],
      );
      expect(missingTransaction.rows).toHaveLength(0);
    } finally {
      await database.sql.executeScript(`
        DROP TRIGGER IF EXISTS calm_test_reject_privileged_audit_insert ON privileged_action_audits;
        DROP FUNCTION IF EXISTS calm_test_reject_privileged_audit();
      `);
    }

    const retry = await fetch(
      `${baseUrl}/v1/admin/economy/grants`,
      jsonRequest(body, operatorToken, { 'idempotency-key': 'audit-failure-rollback-001' }),
    );
    expect(retry.status).toBe(201);
  });

  it('replays an idempotent grant after the client disconnects post-commit', async () => {
    const database = await databasePromise;
    const character = await operatorCharacters.create(
      { accountId: OPERATOR_ACCOUNT_ID, capabilities: ['economy.grant'] },
      { firstName: 'Lost', lastName: 'Acknowledgment' },
    );
    const targetLedger = services.ledger;
    let releaseResponse!: () => void;
    let reportCommitted!: () => void;
    let reportServiceReturned!: () => void;
    const responseGate = new Promise<void>((resolve) => {
      releaseResponse = resolve;
    });
    const committed = new Promise<void>((resolve) => {
      reportCommitted = resolve;
    });
    const serviceReturned = new Promise<void>((resolve) => {
      reportServiceReturned = resolve;
    });
    let delayFirstResponse = true;
    const flakyLedger = new Proxy(targetLedger, {
      get(target, property) {
        if (property === 'grant') {
          return async (...args: Parameters<LedgerService['grant']>) => {
            const receipt = await target.grant(...args);
            if (delayFirstResponse) {
              delayFirstResponse = false;
              reportCommitted();
              await responseGate;
            }
            reportServiceReturned();
            return receipt;
          };
        }
        const value = Reflect.get(target, property, target) as unknown;
        return typeof value === 'function' ? value.bind(target) : value;
      },
    }) as LedgerService;
    const flakyServer = createCalmHttpServer({ ...services, ledger: flakyLedger, bootstrap: null });
    const flakyBaseUrl = await listen(flakyServer);
    try {
      const body = {
        toCharacterId: character.id,
        amountMinor: '700',
        reason: 'Lost connection retry test',
      };
      const controller = new AbortController();
      const lost = fetch(`${flakyBaseUrl}/v1/admin/economy/grants`, {
        ...jsonRequest(body, operatorToken, {
          'idempotency-key': 'grant-lost-acknowledgment-001',
          'x-correlation-id': 'lost-ack-first',
        }),
        signal: controller.signal,
      });
      await committed;
      controller.abort();
      await lost.then(
        () => {
          throw new Error('Expected the client request to be aborted.');
        },
        (error: unknown) => expect((error as Error).name).toBe('AbortError'),
      );
      releaseResponse();
      await serviceReturned;

      const replay = await fetch(
        `${flakyBaseUrl}/v1/admin/economy/grants`,
        jsonRequest(body, operatorToken, {
          'idempotency-key': 'grant-lost-acknowledgment-001',
          'x-correlation-id': 'lost-ack-retry',
        }),
      );
      expect(replay.status).toBe(200);
      expect((await responseBody(replay))['posted']).toBe(false);

      const audit = await database.sql.query(
        `SELECT count(*) AS count FROM privileged_action_audits a
          JOIN ledger_transactions t ON t.id = a.transaction_id
         WHERE t.idempotency_key = $1`,
        ['grant-lost-acknowledgment-001'],
      );
      expect(Number(audit.rows[0]?.['count'])).toBe(1);
    } finally {
      await closeServer(flakyServer);
    }
  });

  it('bounds request bodies, rate limits bootstrap attempts, and revokes sessions', async () => {
    const oversized = await fetch(
      `${baseUrl}/v1/auth/bootstrap`,
      jsonRequest({ bootstrapToken: 'x'.repeat(17 * 1024) }),
    );
    expect(oversized.status).toBe(413);

    const rateLimitedServer = createCalmHttpServer({
      ...services,
      sessions: new SessionService(new InMemorySessionStore()),
    });
    const rateLimitedUrl = await listen(rateLimitedServer);
    try {
      const statuses: number[] = [];
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const response = await fetch(
          `${rateLimitedUrl}/v1/auth/bootstrap`,
          jsonRequest({ bootstrapToken: 'wrong-token' }),
        );
        statuses.push(response.status);
      }
      expect(statuses.slice(0, 5)).toEqual([401, 401, 401, 401, 401]);
      expect(statuses[5]).toBe(429);
    } finally {
      await closeServer(rateLimitedServer);
    }

    const sessionRateService = new SessionService(new InMemorySessionStore());
    const sessionForLimit = await sessionRateService.issue({
      accountId: OPERATOR_ACCOUNT_ID,
      capabilities: [],
      ttlMs: 60_000,
    });
    const sessionLimitedServer = createCalmHttpServer({
      ...services,
      sessions: sessionRateService,
    });
    const sessionLimitedUrl = await listen(sessionLimitedServer);
    try {
      const statuses: number[] = [];
      for (let attempt = 0; attempt < 121; attempt += 1) {
        const response = await fetch(`${sessionLimitedUrl}/v1/characters`, {
          headers: { authorization: `Bearer ${sessionForLimit.token}` },
        });
        statuses.push(response.status);
        await response.arrayBuffer();
      }
      expect(statuses.slice(0, 120).every((status) => status === 200)).toBe(true);
      expect(statuses[120]).toBe(429);
    } finally {
      await closeServer(sessionLimitedServer);
    }

    const issued = await operatorSessions.issue({
      accountId: OPERATOR_ACCOUNT_ID,
      capabilities: [],
      ttlMs: 60_000,
    });
    const revoke = await fetch(`${baseUrl}/v1/auth/revoke`, {
      method: 'POST',
      headers: { authorization: `Bearer ${issued.token}` },
    });
    expect(revoke.status).toBe(200);
    const afterRevoke = await fetch(`${baseUrl}/v1/characters`, {
      headers: { authorization: `Bearer ${issued.token}` },
    });
    expect(afterRevoke.status).toBe(401);
  });

  it('reports health without exposing persistence or runtime integration as GTA VI support', async () => {
    const response = await fetch(`${baseUrl}/health`);
    expect(response.status).toBe(200);
    expect(await responseBody(response)).toMatchObject({
      service: 'gta6-rp-api',
      phase: 'pre-platform',
      gta6Adapter: 'reserved',
    });
  });
});
