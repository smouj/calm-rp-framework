-- Privileged economy grants must be attributable to a server-resolved actor.
-- The row references a finalized ledger transaction, so it commits atomically
-- with the balanced money movement and cannot describe an unposted operation.

CREATE TABLE privileged_action_audits (
  transaction_id UUID PRIMARY KEY
    REFERENCES ledger_transaction_finalizations(transaction_id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action = 'economy.grant'),
  actor_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  reason TEXT NOT NULL
    CHECK (length(reason) BETWEEN 1 AND 256)
    CHECK (reason !~ '[[:cntrl:]]'),
  correlation_id TEXT NOT NULL CHECK (correlation_id ~ '^[A-Za-z0-9:_-]{1,64}$'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX privileged_action_audits_actor_created_idx
  ON privileged_action_audits(actor_account_id, created_at DESC);

CREATE TRIGGER calm_privileged_action_audits_append_only
  BEFORE UPDATE OR DELETE ON privileged_action_audits
  FOR EACH ROW EXECUTE FUNCTION calm_reject_ledger_history_mutation();

-- Defense in depth: a direct SQL treasury movement cannot bypass the audit
-- requirement even if it avoids LedgerService and PgLedgerRepository.
CREATE FUNCTION calm_assert_treasury_action_audited() RETURNS trigger AS $calm$
BEGIN
  IF EXISTS (
    SELECT 1 FROM ledger_entries
     WHERE transaction_id = NEW.transaction_id
       AND financial_account_id = '00000000-0000-4000-8000-0000000000f3'
  ) AND NOT EXISTS (
    SELECT 1 FROM privileged_action_audits
     WHERE transaction_id = NEW.transaction_id
       AND action = 'economy.grant'
  ) THEN
    RAISE EXCEPTION 'CALM treasury postings require a privileged action audit';
  END IF;

  RETURN NULL;
END;
$calm$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER calm_treasury_action_audit_required
  AFTER INSERT ON ledger_transaction_finalizations
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION calm_assert_treasury_action_audited();
