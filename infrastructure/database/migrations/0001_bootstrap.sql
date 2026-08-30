BEGIN;

CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE characters (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  first_name TEXT NOT NULL CHECK (length(first_name) BETWEEN 1 AND 64),
  last_name TEXT NOT NULL CHECK (length(last_name) BETWEEN 1 AND 64),
  birth_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  retired_at TIMESTAMPTZ
);

CREATE INDEX characters_account_id_idx ON characters(account_id);

CREATE TABLE financial_accounts (
  id UUID PRIMARY KEY,
  owner_character_id UUID NOT NULL REFERENCES characters(id) ON DELETE RESTRICT,
  kind TEXT NOT NULL CHECK (kind IN ('cash', 'bank', 'business', 'escrow')),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX financial_accounts_owner_idx ON financial_accounts(owner_character_id);

CREATE TABLE ledger_transactions (
  id UUID PRIMARY KEY,
  idempotency_key TEXT UNIQUE,
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES ledger_transactions(id) ON DELETE RESTRICT,
  financial_account_id UUID NOT NULL REFERENCES financial_accounts(id) ON DELETE RESTRICT,
  amount_minor BIGINT NOT NULL CHECK (amount_minor <> 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ledger_entries_transaction_idx ON ledger_entries(transaction_id);
CREATE INDEX ledger_entries_account_idx ON ledger_entries(financial_account_id, created_at);

COMMIT;
