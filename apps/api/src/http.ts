import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { performance } from 'node:perf_hooks';

import { DomainError } from '@gta6-rp/core';
import type { CharacterService, LedgerService, SessionService, Uuid } from '@gta6-rp/core';

import { health } from './health.js';

const MAX_BODY_BYTES = 16 * 1024;
const SESSION_TTL_MS = 15 * 60 * 1_000;
const MAX_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1_000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REQUEST_ID_PATTERN = /^[A-Za-z0-9:_-]{1,64}$/;
const SESSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const AMOUNT_PATTERN = /^(0|[1-9][0-9]{0,12})$/;

export interface BootstrapSessionConfig {
  /** Fixed server-side operator identity. Never supplied by the HTTP caller. */
  readonly accountId: Uuid;
  /** SHA-256 hex digest of a random, high-entropy operator bootstrap secret. */
  readonly tokenSha256: string;
  readonly sessionTtlMs?: number;
}

export interface CalmApiServices {
  readonly sessions: SessionService;
  readonly characters: CharacterService;
  readonly ledger: LedgerService;
  /** `null` disables the operational bootstrap endpoint completely. */
  readonly bootstrap: BootstrapSessionConfig | null;
}

interface ApiProblem {
  readonly status: number;
  readonly code: string;
}

interface RateWindow {
  readonly startedAt: number;
  readonly count: number;
}

class FixedWindowLimiter {
  readonly #windows = new Map<string, RateWindow>();

  public take(
    key: string,
    limit: number,
    windowMs: number,
    now = performance.now(),
  ): { readonly allowed: boolean; readonly retryAfterSeconds: number } {
    let current = this.#windows.get(key);
    if (current === undefined || now - current.startedAt >= windowMs) {
      current = { startedAt: now, count: 0 };
      this.#windows.delete(key);
    }
    if (this.#windows.size >= 10_000 && !this.#windows.has(key)) {
      const oldest = this.#windows.keys().next().value;
      if (oldest !== undefined) this.#windows.delete(oldest);
    }
    const next = { startedAt: current.startedAt, count: current.count + 1 };
    this.#windows.set(key, next);
    return {
      allowed: next.count <= limit,
      retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (now - next.startedAt)) / 1_000)),
    };
  }
}

function problem(status: number, code: string): ApiProblem {
  return { status, code };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requireExactKeys(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (!isRecord(value)) throw problem(400, 'INVALID_BODY');
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw problem(400, 'INVALID_BODY');
  }
  return value;
}

function requireString(value: unknown, code = 'INVALID_BODY'): string {
  if (typeof value !== 'string') throw problem(400, code);
  return value;
}

function parseUuid(value: unknown): Uuid {
  const candidate = requireString(value).trim();
  if (!UUID_PATTERN.test(candidate)) throw problem(400, 'INVALID_IDENTIFIER');
  return candidate.toLowerCase() as Uuid;
}

function parseAmountMinor(value: unknown): bigint {
  if (typeof value !== 'string' || !AMOUNT_PATTERN.test(value)) {
    throw problem(400, 'INVALID_AMOUNT');
  }
  const amount = BigInt(value);
  if (amount <= 0n) throw problem(400, 'INVALID_AMOUNT');
  return amount;
}

function requiredHeader(request: IncomingMessage, name: string): string {
  const value = request.headers[name.toLowerCase()];
  if (typeof value !== 'string' || !REQUEST_ID_PATTERN.test(value)) {
    throw problem(
      400,
      name.toLowerCase() === 'idempotency-key' ? 'INVALID_IDEMPOTENCY_KEY' : 'INVALID_HEADER',
    );
  }
  return value;
}

function bearerToken(request: IncomingMessage): string {
  const header = request.headers.authorization;
  if (typeof header !== 'string') throw problem(401, 'UNAUTHENTICATED');
  const match = /^Bearer ([A-Za-z0-9_-]{43})$/i.exec(header.trim());
  if (match?.[1] === undefined || !SESSION_TOKEN_PATTERN.test(match[1])) {
    throw problem(401, 'UNAUTHENTICATED');
  }
  return match[1];
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const contentLength = request.headers['content-length'];
  if (contentLength !== undefined) {
    if (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_BODY_BYTES) {
      throw problem(413, 'BODY_TOO_LARGE');
    }
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.byteLength;
    if (size > MAX_BODY_BYTES) {
      throw problem(413, 'BODY_TOO_LARGE');
    }
    chunks.push(buffer);
  }
  if (size === 0) throw problem(400, 'INVALID_BODY');
  const contentType = request.headers['content-type'];
  if (typeof contentType !== 'string' || !/^application\/json(?:\s*;|\s*$)/i.test(contentType)) {
    throw problem(415, 'UNSUPPORTED_MEDIA_TYPE');
  }
  const contentEncoding = request.headers['content-encoding'];
  if (contentEncoding !== undefined && contentEncoding.toLowerCase() !== 'identity') {
    throw problem(415, 'UNSUPPORTED_MEDIA_TYPE');
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch {
    throw problem(400, 'INVALID_JSON');
  }
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: unknown,
  requestId: string,
): void {
  if (response.destroyed || response.writableEnded) return;
  const encoded = JSON.stringify(body);
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(encoded),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'no-referrer',
    'x-request-id': requestId,
  });
  response.end(encoded);
}

function domainProblem(error: DomainError): ApiProblem {
  if (error.code === 'FORBIDDEN') return problem(403, error.code);
  if (error.code.endsWith('_NOT_FOUND')) return problem(404, error.code);
  if (error.code === 'IDEMPOTENCY_CONFLICT' || error.code.endsWith('_EXISTS')) {
    return problem(409, error.code);
  }
  if (
    error.code === 'INSUFFICIENT_FUNDS' ||
    error.code === 'BALANCE_LIMIT' ||
    error.code === 'SELF_TRANSFER'
  ) {
    return problem(422, error.code);
  }
  if (
    error.code.startsWith('INVALID_') ||
    error.code === 'UNBALANCED_TRANSACTION' ||
    error.code === 'INVALID_AMOUNT'
  ) {
    return problem(400, error.code);
  }
  return problem(500, 'INTERNAL_ERROR');
}

function tokenMatches(presentedToken: string, expectedSha256: string): boolean {
  const presentedHash = createHash('sha256').update(presentedToken, 'utf8').digest();
  const expectedHash = Buffer.from(expectedSha256, 'hex');
  return (
    expectedHash.byteLength === presentedHash.byteLength &&
    timingSafeEqual(presentedHash, expectedHash)
  );
}

function requireEmptyBody(request: IncomingMessage): void {
  const contentLength = request.headers['content-length'];
  const hasTransferEncoding = request.headers['transfer-encoding'] !== undefined;
  if ((contentLength !== undefined && contentLength !== '0') || hasTransferEncoding) {
    throw problem(400, 'UNEXPECTED_BODY');
  }
}

function remoteAddress(request: IncomingMessage): string {
  // Do not trust X-Forwarded-For: no proxy trust list exists in this local-only service.
  return request.socket.remoteAddress ?? 'unknown';
}

function serializeCharacter(character: {
  readonly id: Uuid;
  readonly firstName: string;
  readonly lastName: string;
  readonly createdAt: Date;
  readonly retiredAt: Date | null;
}): Record<string, unknown> {
  return {
    id: character.id,
    firstName: character.firstName,
    lastName: character.lastName,
    createdAt: character.createdAt.toISOString(),
    retiredAt: character.retiredAt?.toISOString() ?? null,
  };
}

/** Create the local, server-authoritative CALM API. No game runtime is implied. */
export function createCalmHttpServer(services: CalmApiServices): Server {
  const limiter = new FixedWindowLimiter();
  const bootstrap = services.bootstrap;
  if (bootstrap !== null) {
    if (!UUID_PATTERN.test(bootstrap.accountId) || !/^[0-9a-f]{64}$/i.test(bootstrap.tokenSha256)) {
      throw new Error('Invalid CALM bootstrap session configuration.');
    }
    if (
      bootstrap.sessionTtlMs !== undefined &&
      (!Number.isSafeInteger(bootstrap.sessionTtlMs) ||
        bootstrap.sessionTtlMs < 60_000 ||
        bootstrap.sessionTtlMs > MAX_SESSION_TTL_MS)
    ) {
      throw new Error('CALM bootstrap session TTL must be between 60 seconds and 30 days.');
    }
  }

  const server = createServer(async (request, response) => {
    const requestId = randomUUID();
    const ip = remoteAddress(request);
    let path: string;
    try {
      path = new URL(request.url ?? '/', 'http://localhost').pathname;
    } catch {
      sendJson(response, 400, { error: 'INVALID_URL', requestId }, requestId);
      return;
    }
    try {
      if (request.method === 'GET' && path === '/health') {
        sendJson(response, 200, health(), requestId);
        return;
      }

      if (request.method === 'POST' && path === '/v1/auth/bootstrap') {
        if (bootstrap === null) {
          response.shouldKeepAlive = false;
          response.setHeader('connection', 'close');
          throw problem(404, 'NOT_FOUND');
        }
        const body = requireExactKeys(await readJson(request), ['bootstrapToken']);
        const rate = limiter.take(`bootstrap:${ip}`, 5, 10 * 60_000);
        if (!rate.allowed) {
          response.setHeader('retry-after', String(rate.retryAfterSeconds));
          throw problem(429, 'RATE_LIMITED');
        }
        const bootstrapToken = requireString(body['bootstrapToken']);
        if (
          Buffer.byteLength(bootstrapToken, 'utf8') > 256 ||
          !tokenMatches(bootstrapToken, bootstrap.tokenSha256)
        ) {
          throw problem(401, 'UNAUTHENTICATED');
        }
        const issued = await services.sessions.issue({
          accountId: bootstrap.accountId,
          capabilities: ['economy.grant'],
          ttlMs: bootstrap.sessionTtlMs ?? SESSION_TTL_MS,
        });
        sendJson(
          response,
          201,
          { token: issued.token, expiresAt: issued.session.expiresAt.toISOString() },
          requestId,
        );
        return;
      }

      if (request.method === 'POST' && path === '/v1/auth/revoke') {
        requireEmptyBody(request);
        const ipRate = limiter.take(`authenticated-ip:${ip}`, 300, 60_000);
        if (!ipRate.allowed) {
          response.setHeader('retry-after', String(ipRate.retryAfterSeconds));
          throw problem(429, 'RATE_LIMITED');
        }
        const token = bearerToken(request);
        const session = await services.sessions.authenticate(token);
        if (session === null) throw problem(401, 'UNAUTHENTICATED');
        const rate = limiter.take(`session:${session.sessionId}`, 120, 60_000);
        if (!rate.allowed) {
          response.setHeader('retry-after', String(rate.retryAfterSeconds));
          throw problem(429, 'RATE_LIMITED');
        }
        await services.sessions.revoke(session.sessionId);
        sendJson(response, 200, { revoked: true }, requestId);
        return;
      }

      if (request.method === 'GET' && path === '/v1/characters') {
        const { principal } = await authenticateRequest(request, services, limiter, ip);
        const characters = await services.characters.listOwn(principal);
        sendJson(response, 200, characters.map(serializeCharacter), requestId);
        return;
      }

      if (request.method === 'POST' && path === '/v1/characters') {
        const body = requireExactKeys(await readJson(request), ['firstName', 'lastName']);
        const { principal } = await authenticateRequest(request, services, limiter, ip);
        const character = await services.characters.create(principal, {
          firstName: requireString(body['firstName']),
          lastName: requireString(body['lastName']),
        });
        sendJson(response, 201, serializeCharacter(character), requestId);
        return;
      }

      const balanceMatch = /^\/v1\/characters\/([^/]+)\/balance$/.exec(path);
      if (request.method === 'GET' && balanceMatch?.[1] !== undefined) {
        const { principal } = await authenticateRequest(request, services, limiter, ip);
        const characterId = parseUuid(balanceMatch[1]);
        await services.characters.requireOwn(principal, characterId);
        const balanceMinor = await services.ledger.getCharacterBalance(characterId);
        sendJson(response, 200, { characterId, balanceMinor: balanceMinor.toString() }, requestId);
        return;
      }

      if (request.method === 'POST' && path === '/v1/economy/transfers') {
        const body = requireExactKeys(await readJson(request), [
          'fromCharacterId',
          'toCharacterId',
          'amountMinor',
        ]);
        const { principal } = await authenticateRequest(request, services, limiter, ip);
        const receipt = await services.ledger.transfer(principal, {
          requestId: requiredHeader(request, 'idempotency-key'),
          fromCharacterId: parseUuid(body['fromCharacterId']),
          toCharacterId: parseUuid(body['toCharacterId']),
          amountMinor: parseAmountMinor(body['amountMinor']),
        });
        sendJson(
          response,
          receipt.posted ? 201 : 200,
          {
            transactionId: receipt.transactionId,
            requestId: receipt.requestId,
            posted: receipt.posted,
          },
          requestId,
        );
        return;
      }

      if (request.method === 'POST' && path === '/v1/admin/economy/grants') {
        const body = requireExactKeys(await readJson(request), [
          'toCharacterId',
          'amountMinor',
          'reason',
        ]);
        const { principal } = await authenticateRequest(request, services, limiter, ip);
        const grantRate = limiter.take(`grant:${principal.accountId}`, 30, 60_000);
        if (!grantRate.allowed) {
          response.setHeader('retry-after', String(grantRate.retryAfterSeconds));
          throw problem(429, 'RATE_LIMITED');
        }
        const externalCorrelationId = request.headers['x-correlation-id'];
        const correlationId =
          typeof externalCorrelationId === 'string' &&
          REQUEST_ID_PATTERN.test(externalCorrelationId)
            ? externalCorrelationId
            : requestId.replaceAll('-', '');
        const receipt = await services.ledger.grant(principal, {
          requestId: requiredHeader(request, 'idempotency-key'),
          toCharacterId: parseUuid(body['toCharacterId']),
          amountMinor: parseAmountMinor(body['amountMinor']),
          reason: requireString(body['reason']),
          correlationId,
        });
        sendJson(
          response,
          receipt.posted ? 201 : 200,
          {
            transactionId: receipt.transactionId,
            requestId: receipt.requestId,
            posted: receipt.posted,
          },
          requestId,
        );
        return;
      }

      if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
        response.shouldKeepAlive = false;
        response.setHeader('connection', 'close');
        throw problem(404, 'NOT_FOUND');
      }
      if (request.method !== 'GET') {
        response.setHeader('allow', 'GET, POST');
        response.shouldKeepAlive = false;
        response.setHeader('connection', 'close');
        throw problem(405, 'METHOD_NOT_ALLOWED');
      }
      throw problem(404, 'NOT_FOUND');
    } catch (error) {
      const apiProblem = isApiProblem(error)
        ? error
        : error instanceof DomainError
          ? domainProblem(error)
          : problem(500, 'INTERNAL_ERROR');
      if (response.headersSent) {
        response.destroy();
        return;
      }
      if (apiProblem.status === 413 || apiProblem.code === 'UNEXPECTED_BODY') {
        response.shouldKeepAlive = false;
        response.setHeader('connection', 'close');
      }
      sendJson(response, apiProblem.status, { error: apiProblem.code, requestId }, requestId);
    }
  });

  server.requestTimeout = 15_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  return server;
}

async function authenticateRequest(
  request: IncomingMessage,
  services: CalmApiServices,
  limiter: FixedWindowLimiter,
  ip: string,
): Promise<{ readonly principal: ReturnType<SessionService['principalOf']> }> {
  const ipRate = limiter.take(`authenticated-ip:${ip}`, 300, 60_000);
  if (!ipRate.allowed) throw problem(429, 'RATE_LIMITED');
  const session = await services.sessions.authenticate(bearerToken(request));
  if (session === null) throw problem(401, 'UNAUTHENTICATED');
  const sessionRate = limiter.take(`session:${session.sessionId}`, 120, 60_000);
  if (!sessionRate.allowed) throw problem(429, 'RATE_LIMITED');
  return { principal: services.sessions.principalOf(session) };
}

function isApiProblem(value: unknown): value is ApiProblem {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { status?: unknown }).status === 'number' &&
    typeof (value as { code?: unknown }).code === 'string'
  );
}
