-- Additive and repeatable; preserve the original approval and QR/access history.
BEGIN;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS revoked_at timestamptz;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS revoked_by integer REFERENCES staff_accounts(id);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'visits'::regclass AND conname = 'visits_revocation_check') THEN
        ALTER TABLE visits ADD CONSTRAINT visits_revocation_check CHECK (
            (revoked_at IS NULL AND revoked_by IS NULL)
            OR (revoked_at IS NOT NULL AND revoked_by IS NOT NULL AND decision = 'approved')
        );
    END IF;
END $$;
COMMIT;
