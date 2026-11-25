-- The ledger is append-only: never rewrite or delete a financial history row.
-- Corrections must be new, balanced, attributable compensating transactions.
-- This guard applies to normal SQL writes as well as application commands.
-- A database superuser can bypass triggers; restrict production DB privileges.

CREATE FUNCTION calm_reject_ledger_history_mutation() RETURNS trigger AS $calm$
BEGIN
  RAISE EXCEPTION 'CALM ledger history is append-only';
  RETURN NULL;
END;
$calm$ LANGUAGE plpgsql;

CREATE TRIGGER calm_ledger_entries_append_only
  BEFORE UPDATE OR DELETE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION calm_reject_ledger_history_mutation();

CREATE TRIGGER calm_ledger_transactions_append_only
  BEFORE UPDATE OR DELETE ON ledger_transactions
  FOR EACH ROW EXECUTE FUNCTION calm_reject_ledger_history_mutation();
