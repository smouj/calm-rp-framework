-- Phase F1: authenticated sessions, ledger guarantees and the reserved treasury.
-- Additive only: no table or column defined in 0001 is dropped or narrowed.
BEGIN;

-- Server-issued session tokens. Clients present the opaque token; the
-- account identity is resolved from the stored hash, never accepted from
-- the wire. Capabilities are granted server-side at issue time.
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  capabilities TEXT NOT NULL DEFAULT '[]' CHECK (capabilities LIKE '[%]'),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL CHECK (expires_at > issued_at),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX sessions_account_idx ON sessions(account_id);
CREATE UNIQUE INDEX sessions_token_hash_idx ON sessions(token_hash);

-- Idempotency conflict detection: the canonical fingerprint of the command
-- that produced each ledger transaction, so a reused key with different
-- arguments can be rejected as a conflict instead of silently deduplicated.
ALTER TABLE ledger_transactions ADD COLUMN command_fingerprint TEXT;

-- Reserved system rows for double-entry minting: every grant debits the
-- treasury, so no balance is ever created outside a balanced transaction.
INSERT INTO accounts (id) VALUES ('00000000-0000-4000-8000-0000000000f1')
  ON CONFLICT (id) DO NOTHING;

INSERT INTO characters (id, account_id, first_name, last_name)
  VALUES ('00000000-0000-4000-8000-0000000000f2', '00000000-0000-4000-8000-0000000000f1', 'CALM Treasury', 'System')
  ON CONFLICT (id) DO NOTHING;

INSERT INTO financial_accounts (id, owner_character_id, kind, currency)
  VALUES ('00000000-0000-4000-8000-0000000000f3', '00000000-0000-4000-8000-0000000000f2', 'bank', 'USD')
  ON CONFLICT (id) DO NOTHING;

-- Defense in depth: no ledger transaction may commit with legs that do not
-- sum to zero, even when rows are written by direct SQL outside the
-- repository layer. Deferred to commit time so multi-leg inserts inside one
-- transaction are normal.
CREATE OR REPLACE FUNCTION calm_assert_transaction_balanced() RETURNS trigger AS $$
DECLARE
  total BIGINT;
BEGIN
  SELECT COALESCE(SUM(amount_minor), 0) INTO total
    FROM ledger_entries WHERE transaction_id = NEW.transaction_id;
  IF total <> 0 THEN
    RAISE EXCEPTION 'unbalanced ledger transaction %: legs sum to %', NEW.transaction_id, total;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER calm_ledger_transaction_balanced
  AFTER INSERT ON ledger_entries
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION calm_assert_transaction_balanced();

COMMIT;
