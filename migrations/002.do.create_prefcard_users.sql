CREATE TABLE prefcard_users (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    position TEXT NOT NULL,
    password TEXT NOT NULL,
    date_create TIMESTAMP NOT NULL DEFAULT now(),
    date_modified TIMESTAMP
);

ALTER TABLE prefcard_cards
    ADD COLUMN
    user_id INTEGER REFERENCES prefcard_users(id)
    ON DELETE SET NULL;