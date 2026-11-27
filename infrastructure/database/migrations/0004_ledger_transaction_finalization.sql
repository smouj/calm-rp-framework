-- A balanced transaction must be closed before commit. Entries may be added
-- only while the parent transaction is open; the parent row lock serializes
-- entry insertion against finalization, including direct SQL writers.
BEGIN;

CREATE TABLE ledger_transaction_finalizations (
  transaction_id UUID PRIMARY KEY
    REFERENCES ledger_transactions(id) ON DELETE RESTRICT,
  finalized_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Preserve valid history and fail closed if earlier data contains an empty or
-- unbalanced transaction. Such rows need an explicit data repair before this
-- migration can be applied.
INSERT INTO ledger_transaction_finalizations (transaction_id)
SELECT t.id
  FROM ledger_transactions t
  JOIN ledger_entries e ON e.transaction_id = t.id
 GROUP BY t.id
HAVING COUNT(e.id) > 0 AND COALESCE(SUM(e.amount_minor), 0) = 0;

DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM ledger_transactions t
      LEFT JOIN ledger_transaction_finalizations f ON f.transaction_id = t.id
     WHERE f.transaction_id IS NULL
  ) THEN
    RAISE EXCEPTION 'cannot finalize existing ledger: empty or unbalanced transactions found';
  END IF;
END;
$migration$;

CREATE FUNCTION calm_guard_ledger_entry_insert() RETURNS trigger AS $calm$
BEGIN
  PERFORM 1 FROM ledger_transactions WHERE id = NEW.transaction_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CALM ledger transaction does not exist';
  END IF;

  IF EXISTS (
    SELECT 1 FROM ledger_transaction_finalizations
     WHERE transaction_id = NEW.transaction_id
  ) THEN
    RAISE EXCEPTION 'CALM ledger transaction is finalized';
  END IF;

  RETURN NEW;
END;
$calm$ LANGUAGE plpgsql;

CREATE TRIGGER calm_ledger_entries_open_transaction
  BEFORE INSERT ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION calm_guard_ledger_entry_insert();

CREATE FUNCTION calm_finalize_ledger_transaction() RETURNS trigger AS $calm$
DECLARE
  entry_count BIGINT;
  total NUMERIC;
BEGIN
  PERFORM 1 FROM ledger_transactions WHERE id = NEW.transaction_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CALM ledger transaction does not exist';
  END IF;

  SELECT COUNT(*), COALESCE(SUM(amount_minor), 0)
    INTO entry_count, total
    FROM ledger_entries
   WHERE transaction_id = NEW.transaction_id;

  IF entry_count = 0 OR total <> 0 THEN
    RAISE EXCEPTION 'CALM ledger transaction must have non-empty balanced entries';
  END IF;

  NEW.finalized_at := clock_timestamp();
  RETURN NEW;
END;
$calm$ LANGUAGE plpgsql;

CREATE TRIGGER calm_ledger_transaction_finalize_once
  BEFORE INSERT ON ledger_transaction_finalizations
  FOR EACH ROW EXECUTE FUNCTION calm_finalize_ledger_transaction();

CREATE TRIGGER calm_ledger_finalizations_append_only
  BEFORE UPDATE OR DELETE ON ledger_transaction_finalizations
  FOR EACH ROW EXECUTE FUNCTION calm_reject_ledger_history_mutation();

CREATE FUNCTION calm_assert_ledger_transaction_finalized() RETURNS trigger AS $calm$
DECLARE
  entry_count BIGINT;
  total NUMERIC;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM ledger_transaction_finalizations
     WHERE transaction_id = NEW.id
  ) THEN
    RAISE EXCEPTION 'CALM ledger transaction must be finalized before commit';
  END IF;

  SELECT COUNT(*), COALESCE(SUM(amount_minor), 0)
    INTO entry_count, total
    FROM ledger_entries
   WHERE transaction_id = NEW.id;

  IF entry_count = 0 OR total <> 0 THEN
    RAISE EXCEPTION 'CALM ledger transaction must have non-empty balanced entries';
  END IF;

  RETURN NULL;
END;
$calm$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER calm_ledger_transaction_finalized
  AFTER INSERT ON ledger_transactions
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION calm_assert_ledger_transaction_finalized();

COMMIT;
