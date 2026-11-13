-- Additive and repeatable for an existing local foundation database.
BEGIN;

CREATE TABLE IF NOT EXISTS staff_sessions (
    secret_hash text PRIMARY KEY,
    staff_id integer NOT NULL REFERENCES staff_accounts(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
    expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS staff_sessions_expiry ON staff_sessions(expires_at);

CREATE TABLE IF NOT EXISTS visits (
    id uuid PRIMARY KEY,
    visitor_name text NOT NULL CHECK (char_length(visitor_name) BETWEEN 1 AND 100),
    destination_id integer NOT NULL REFERENCES destinations(id),
    scheduled_at timestamptz(3) NOT NULL,
    decision text NOT NULL DEFAULT 'pending' CHECK (decision IN ('pending', 'approved', 'rejected')),
    decision_by integer REFERENCES staff_accounts(id),
    decided_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
    notice_version text NOT NULL,
    acknowledged_at timestamptz NOT NULL DEFAULT clock_timestamp(),
    visitor_secret_hash text NOT NULL UNIQUE,
    qr_secret text UNIQUE,
    CHECK ((decision = 'pending') = (decision_by IS NULL AND decided_at IS NULL)),
    CHECK (decision = 'pending' OR (decision_by IS NOT NULL AND decided_at IS NOT NULL)),
    CHECK ((decision = 'approved') = (qr_secret IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS visits_created ON visits(created_at DESC);

-- Shared by visit validation now and the device/clock endpoints in #9 later.
CREATE TABLE IF NOT EXISTS demo_device (
    id integer PRIMARY KEY CHECK (id = 1),
    destination_id integer NOT NULL REFERENCES destinations(id),
    clock_offset_ms bigint NOT NULL DEFAULT 0,
    revision integer NOT NULL DEFAULT 0,
    unlocked_until timestamptz NOT NULL DEFAULT 'epoch'
);
INSERT INTO demo_device (id, destination_id)
SELECT 1, min(id) FROM destinations
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS access_events (
    id uuid PRIMARY KEY,
    visit_id uuid NOT NULL REFERENCES visits(id),
    device_id integer NOT NULL REFERENCES demo_device(id),
    method text NOT NULL CHECK (method IN ('qr', 'manual')),
    occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
    effective_at timestamptz NOT NULL,
    destination_id integer NOT NULL REFERENCES destinations(id),
    staff_id integer REFERENCES staff_accounts(id),
    reason text,
    request_id uuid NOT NULL UNIQUE,
    CHECK (method <> 'manual' OR (staff_id IS NOT NULL AND reason IS NOT NULL AND char_length(trim(reason)) BETWEEN 1 AND 200))
);
CREATE INDEX IF NOT EXISTS access_events_visit ON access_events(visit_id, method);

COMMIT;
