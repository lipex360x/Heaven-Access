-- Store action outcomes separately: denied/duplicate reads are not access events.
BEGIN;
CREATE TABLE IF NOT EXISTS device_requests (
    request_id uuid PRIMARY KEY,
    staff_id integer NOT NULL REFERENCES staff_accounts(id) ON DELETE CASCADE,
    input_hash text NOT NULL,
    response jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
COMMIT;
