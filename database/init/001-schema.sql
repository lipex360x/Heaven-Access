-- Foundation only. Visit/session/access tables follow the accepted contract in #1.
CREATE TABLE staff_accounts (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password_hash text NOT NULL
);

CREATE TABLE destinations (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_label text NOT NULL,
    room_label text NOT NULL,
    floor_label text,
    UNIQUE (company_label, room_label)
);
