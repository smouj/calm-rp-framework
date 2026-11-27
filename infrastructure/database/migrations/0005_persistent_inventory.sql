-- F2: game-independent persistent inventory with ownership independent from
-- physical storage. The application locks containers before checking capacity;
-- these triggers provide the same serialization for direct SQL writes.

CREATE TABLE inventory_item_definitions (
  id TEXT PRIMARY KEY
    CHECK (id ~ '^[A-Za-z0-9:_.-]{1,64}$'),
  display_name TEXT NOT NULL
    CHECK (length(display_name) BETWEEN 2 AND 60)
    CHECK (display_name !~ '[[:cntrl:]]'),
  weight_grams INTEGER NOT NULL CHECK (weight_grams BETWEEN 1 AND 100000),
  max_stack INTEGER NOT NULL CHECK (max_stack BETWEEN 1 AND 1000),
  tradeable BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A container is a physical storage location. `owner_character_id` describes
-- its CALM owner; `kind` + `location_id` identify where it physically exists.
-- Vehicle/property/warehouse IDs are CALM UUIDs, not game-native identifiers.
CREATE TABLE inventory_containers (
  id UUID PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('character', 'vehicle', 'property', 'warehouse')),
  location_id UUID NOT NULL,
  owner_character_id UUID NOT NULL REFERENCES characters(id) ON DELETE RESTRICT,
  slot_capacity INTEGER NOT NULL CHECK (slot_capacity BETWEEN 1 AND 10000),
  weight_capacity_grams INTEGER NOT NULL CHECK (weight_capacity_grams BETWEEN 1 AND 1000000000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (kind, location_id),
  CHECK (kind <> 'character' OR location_id = owner_character_id)
);

CREATE INDEX inventory_containers_owner_idx
  ON inventory_containers(owner_character_id, kind);

CREATE TABLE inventory_stacks (
  id UUID PRIMARY KEY,
  container_id UUID NOT NULL REFERENCES inventory_containers(id) ON DELETE RESTRICT,
  owner_character_id UUID NOT NULL REFERENCES characters(id) ON DELETE RESTRICT,
  item_id TEXT NOT NULL REFERENCES inventory_item_definitions(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 1000),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(metadata) = 'object')
    CHECK (pg_column_size(metadata) <= 4096),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX inventory_stacks_container_idx
  ON inventory_stacks(container_id, item_id, owner_character_id);
CREATE INDEX inventory_stacks_owner_idx
  ON inventory_stacks(owner_character_id, item_id, container_id);

CREATE TABLE inventory_operations (
  id UUID PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE
    CHECK (idempotency_key ~ '^[A-Za-z0-9:_-]{1,128}$'),
  command_fingerprint TEXT NOT NULL
    CHECK (command_fingerprint ~ '^[0-9a-f]{64}$'),
  kind TEXT NOT NULL CHECK (kind IN ('mint', 'consume', 'move', 'transfer')),
  actor_account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  actor_character_id UUID REFERENCES characters(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (id, kind)
);

CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY,
  operation_id UUID NOT NULL UNIQUE,
  operation_kind TEXT NOT NULL,
  item_id TEXT NOT NULL REFERENCES inventory_item_definitions(id) ON DELETE RESTRICT,
  source_container_id UUID REFERENCES inventory_containers(id) ON DELETE RESTRICT,
  destination_container_id UUID REFERENCES inventory_containers(id) ON DELETE RESTRICT,
  source_owner_character_id UUID REFERENCES characters(id) ON DELETE RESTRICT,
  destination_owner_character_id UUID REFERENCES characters(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 1000),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(metadata) = 'object')
    CHECK (pg_column_size(metadata) <= 4096),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (operation_id, operation_kind)
    REFERENCES inventory_operations(id, kind) ON DELETE RESTRICT,
  CHECK (
    (operation_kind = 'mint'
      AND source_container_id IS NULL
      AND destination_container_id IS NOT NULL
      AND source_owner_character_id IS NULL
      AND destination_owner_character_id IS NOT NULL)
    OR
    (operation_kind = 'consume'
      AND source_container_id IS NOT NULL
      AND destination_container_id IS NULL
      AND source_owner_character_id IS NOT NULL
      AND destination_owner_character_id IS NULL)
    OR
    (operation_kind = 'move'
      AND source_container_id IS NOT NULL
      AND destination_container_id IS NOT NULL
      AND source_container_id <> destination_container_id
      AND source_owner_character_id IS NOT NULL
      AND destination_owner_character_id = source_owner_character_id)
    OR
    (operation_kind = 'transfer'
      AND source_container_id IS NOT NULL
      AND destination_container_id IS NOT NULL
      AND source_container_id <> destination_container_id
      AND source_owner_character_id IS NOT NULL
      AND destination_owner_character_id IS NOT NULL
      AND destination_owner_character_id <> source_owner_character_id)
  )
);

CREATE INDEX inventory_movements_source_idx
  ON inventory_movements(source_container_id, created_at);
CREATE INDEX inventory_movements_destination_idx
  ON inventory_movements(destination_container_id, created_at);

-- A receipt is finalized exactly once after its movement is written. This
-- prevents a valid receipt from receiving extra audit rows after commit.
CREATE TABLE inventory_operation_finalizations (
  operation_id UUID PRIMARY KEY
    REFERENCES inventory_operations(id) ON DELETE RESTRICT,
  finalized_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE FUNCTION calm_reject_inventory_history_mutation() RETURNS trigger AS $calm$
BEGIN
  RAISE EXCEPTION 'CALM inventory history is append-only';
  RETURN NULL;
END;
$calm$ LANGUAGE plpgsql;

CREATE TRIGGER calm_inventory_item_definitions_immutable
  BEFORE UPDATE OR DELETE ON inventory_item_definitions
  FOR EACH ROW EXECUTE FUNCTION calm_reject_inventory_history_mutation();
CREATE TRIGGER calm_inventory_operations_append_only
  BEFORE UPDATE OR DELETE ON inventory_operations
  FOR EACH ROW EXECUTE FUNCTION calm_reject_inventory_history_mutation();
CREATE TRIGGER calm_inventory_movements_append_only
  BEFORE UPDATE OR DELETE ON inventory_movements
  FOR EACH ROW EXECUTE FUNCTION calm_reject_inventory_history_mutation();
CREATE TRIGGER calm_inventory_finalizations_append_only
  BEFORE UPDATE OR DELETE ON inventory_operation_finalizations
  FOR EACH ROW EXECUTE FUNCTION calm_reject_inventory_history_mutation();

CREATE FUNCTION calm_guard_inventory_stack_write() RETURNS trigger AS $calm$
DECLARE
  source_id UUID;
  excluded_stack_id UUID;
  target_slots INTEGER;
  target_weight_capacity INTEGER;
  current_slots BIGINT;
  current_weight NUMERIC;
  item_weight INTEGER;
  item_max_stack INTEGER;
  locked_container RECORD;
BEGIN
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    source_id := OLD.container_id;
    excluded_stack_id := OLD.id;
  END IF;

  -- A stable lock order keeps cross-container moves deadlock-resistant.
  FOR locked_container IN
    SELECT id
      FROM inventory_containers
     WHERE id = NEW.container_id OR id = source_id
     ORDER BY id
     FOR UPDATE
  LOOP
    NULL;
  END LOOP;

  SELECT weight_grams, max_stack
    INTO item_weight, item_max_stack
    FROM inventory_item_definitions
   WHERE id = NEW.item_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CALM inventory item definition does not exist';
  END IF;
  IF NEW.quantity > item_max_stack THEN
    RAISE EXCEPTION 'CALM inventory stack exceeds item maximum';
  END IF;

  SELECT slot_capacity, weight_capacity_grams
    INTO target_slots, target_weight_capacity
    FROM inventory_containers
   WHERE id = NEW.container_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CALM inventory container does not exist';
  END IF;

  SELECT COUNT(*), COALESCE(SUM(s.quantity::numeric * d.weight_grams), 0)
    INTO current_slots, current_weight
    FROM inventory_stacks s
    JOIN inventory_item_definitions d ON d.id = s.item_id
   WHERE s.container_id = NEW.container_id
     AND (excluded_stack_id IS NULL OR s.id <> excluded_stack_id);

  IF current_slots + 1 > target_slots THEN
    RAISE EXCEPTION 'CALM inventory container slot capacity exceeded';
  END IF;
  IF current_weight + NEW.quantity::numeric * item_weight > target_weight_capacity THEN
    RAISE EXCEPTION 'CALM inventory container weight capacity exceeded';
  END IF;

  NEW.updated_at := clock_timestamp();
  RETURN NEW;
END;
$calm$ LANGUAGE plpgsql;

CREATE TRIGGER calm_inventory_stack_capacity_guard
  BEFORE INSERT OR UPDATE ON inventory_stacks
  FOR EACH ROW EXECUTE FUNCTION calm_guard_inventory_stack_write();

CREATE FUNCTION calm_guard_inventory_container_capacity_update() RETURNS trigger AS $calm$
DECLARE
  current_slots BIGINT;
  current_weight NUMERIC;
BEGIN
  SELECT COUNT(*), COALESCE(SUM(s.quantity::numeric * d.weight_grams), 0)
    INTO current_slots, current_weight
    FROM inventory_stacks s
    JOIN inventory_item_definitions d ON d.id = s.item_id
   WHERE s.container_id = NEW.id;

  IF current_slots > NEW.slot_capacity THEN
    RAISE EXCEPTION 'CALM inventory container slot capacity is below current usage';
  END IF;
  IF current_weight > NEW.weight_capacity_grams THEN
    RAISE EXCEPTION 'CALM inventory container weight capacity is below current usage';
  END IF;
  RETURN NEW;
END;
$calm$ LANGUAGE plpgsql;

CREATE TRIGGER calm_inventory_container_capacity_update_guard
  BEFORE UPDATE OF slot_capacity, weight_capacity_grams ON inventory_containers
  FOR EACH ROW EXECUTE FUNCTION calm_guard_inventory_container_capacity_update();

CREATE FUNCTION calm_guard_inventory_movement_insert() RETURNS trigger AS $calm$
DECLARE
  item_is_tradeable BOOLEAN;
BEGIN
  PERFORM 1 FROM inventory_operations WHERE id = NEW.operation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CALM inventory operation does not exist';
  END IF;
  IF EXISTS (
    SELECT 1 FROM inventory_operation_finalizations
     WHERE operation_id = NEW.operation_id
  ) THEN
    RAISE EXCEPTION 'CALM inventory operation is finalized';
  END IF;
  IF NEW.operation_kind = 'transfer' THEN
    SELECT tradeable INTO item_is_tradeable
      FROM inventory_item_definitions WHERE id = NEW.item_id;
    IF NOT FOUND OR NOT item_is_tradeable THEN
      RAISE EXCEPTION 'CALM inventory item is not tradeable';
    END IF;
  END IF;
  RETURN NEW;
END;
$calm$ LANGUAGE plpgsql;

CREATE TRIGGER calm_inventory_movements_open_operation
  BEFORE INSERT ON inventory_movements
  FOR EACH ROW EXECUTE FUNCTION calm_guard_inventory_movement_insert();

CREATE FUNCTION calm_finalize_inventory_operation() RETURNS trigger AS $calm$
DECLARE
  finalize_kind TEXT;
  movement_count BIGINT;
BEGIN
  SELECT kind INTO finalize_kind
    FROM inventory_operations WHERE id = NEW.operation_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'CALM inventory operation does not exist';
  END IF;

  SELECT COUNT(*) INTO movement_count
    FROM inventory_movements m
   WHERE m.operation_id = NEW.operation_id AND m.operation_kind = finalize_kind;
  IF movement_count <> 1 THEN
    RAISE EXCEPTION 'CALM inventory operation must have exactly one movement before finalization';
  END IF;

  NEW.finalized_at := clock_timestamp();
  RETURN NEW;
END;
$calm$ LANGUAGE plpgsql;

CREATE TRIGGER calm_inventory_operation_finalize_once
  BEFORE INSERT ON inventory_operation_finalizations
  FOR EACH ROW EXECUTE FUNCTION calm_finalize_inventory_operation();

CREATE FUNCTION calm_assert_inventory_operation_finalized() RETURNS trigger AS $calm$
DECLARE
  movement_count BIGINT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM inventory_operation_finalizations
     WHERE operation_id = NEW.id
  ) THEN
    RAISE EXCEPTION 'CALM inventory operation must be finalized before commit';
  END IF;

  SELECT COUNT(*) INTO movement_count
    FROM inventory_movements WHERE operation_id = NEW.id;
  IF movement_count <> 1 THEN
    RAISE EXCEPTION 'CALM inventory operation must have exactly one movement before commit';
  END IF;
  RETURN NULL;
END;
$calm$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER calm_inventory_operation_finalized
  AFTER INSERT ON inventory_operations
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION calm_assert_inventory_operation_finalized();
