# CALM F1 HTTP API

**Status:** local HTTP transport for CALM-owned persistent F1 services. It is not a player identity
provider, public authentication service, or GTA VI runtime integration.

The API exposes server-authoritative sessions, characters, and economy operations. Account identity
comes from a persisted session. Request bodies cannot assign character ownership, choose capabilities,
or name the privileged actor.

## Local operation

Requirements: Node.js 22+, pnpm 10, and PostgreSQL. The app applies additive migrations at startup
and provisions one fixed operator account. It binds only to `127.0.0.1` or `::1`; remote, LAN and
`0.0.0.0` listeners are rejected. There is no CORS configuration and forwarded-IP headers are not
trusted.

Required process environment:

- `DATABASE_URL` — PostgreSQL connection URL.
- `CALM_BOOTSTRAP_ACCOUNT_ID` — fixed operator account UUID.
- `CALM_BOOTSTRAP_TOKEN_SHA256` — SHA-256 hex digest of a high-entropy secret of at least 32 random
  bytes. Keep the original secret in an operator secret manager; never commit or log it.

Optional `CALM_API_HOST` defaults to `127.0.0.1` and `CALM_API_PORT` defaults to `8080`. The process
does not load `.env` files.

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm --filter @gta6-rp/api start
```

For setup, request/response examples, rate-limit values and Windows instructions, see the
[Spanish API operation guide](../../docs/operations/API_F1_LOCAL.es.md).

## Authentication and route contract

`GET /health` is public. `POST /v1/auth/bootstrap` is protected by the configured operator secret.
It accepts only `bootstrapToken` and always issues the server-configured account a 15-minute session
with only `economy.grant`. It does not accept account IDs or capabilities. The token hash is compared
in constant time; the session bearer is stored only as a SHA-256 hash in PostgreSQL. Rotate the
bootstrap secret by changing its configured hash and restarting the process.

All other `/v1` routes require `Authorization: Bearer <session-token>`:

| Method and path                            | Operation                                                             |
| ------------------------------------------ | --------------------------------------------------------------------- |
| `POST /v1/auth/revoke`                     | Revoke the presented session.                                         |
| `GET /v1/characters`                       | List active characters owned by the session account.                  |
| `POST /v1/characters`                      | Create a character owned by the session account.                      |
| `GET /v1/characters/{characterId}/balance` | Read an owned character's cash balance.                               |
| `POST /v1/economy/transfers`               | Transfer integer minor units from an owned character.                 |
| `POST /v1/admin/economy/grants`            | Grant integer minor units with a required reason and idempotency key. |

Transport parsing rejects unknown object keys, accepts only decimal string amounts, and caps JSON
bodies at 16 KiB. Grant audit rows contain the session-resolved actor, reason, correlation ID and
finalized ledger transaction. They are committed atomically with the money movement and protected
against update/delete. Repeating the same idempotency key returns the original transaction without
duplicating either balance or audit history.
An additional deferred PostgreSQL constraint rejects any treasury posting that would commit without
its matching audit row, even if a SQL writer bypasses the application repository.

Errors use a stable JSON shape `{ "error": "CODE", "requestId": "uuid" }` and never return SQL
messages or stack traces. The transport distinguishes invalid input, unauthenticated/forbidden
requests, missing resources, idempotency conflicts, payload/media-type failures, rate limits and
internal errors.

## Deliberate readiness boundary

The API supports one local operator bootstrap; it does not issue player sessions or implement an
external identity-provider flow. The in-process rate limiter is suitable only for this single-process,
loopback workflow and resets on restart. Do not expose the process through a public reverse proxy.
A shared rate-limit store, trusted-proxy model, production migration role and player identity provider
must be designed and reviewed before any shared or public deployment.

The health endpoint reports `phase: pre-platform` and `gta6Adapter: reserved`. No game files,
leaked internals, ESX/QBCore compatibility, or GTA VI runtime support is implied by this API.
