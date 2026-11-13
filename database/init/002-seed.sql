-- Fictional reference data. Do not use real visitor or tenant information.
INSERT INTO destinations (company_label, room_label, floor_label) VALUES
    ('Example Studio', 'Reception', '2'),
    ('Demo Consulting', 'Meeting room A', '4'),
    ('Sample Technology', 'Office 601', '6');

-- Public local-demo account: reception / HeavenDemo-2026!
-- scrypt (Node defaults, 64-byte output). No plaintext password is stored in the database.
-- This deterministic demo salt/hash is fixture data, not a production credential policy.
INSERT INTO staff_accounts (username, password_hash) VALUES
    ('reception', 'scrypt:heaven-access-local-demo:7e621c3fee6f7882383b1c1422453537e3a1a223410c75df63902e83f0ab6b247542f112c6274db369b22f33f19248eb9556fb214a97425302e971ea1a9272ad');
