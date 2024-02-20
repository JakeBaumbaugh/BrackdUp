-- V14__add-tournament-background-image

CREATE TABLE IF NOT EXISTS image (
    id SERIAL PRIMARY KEY,
    data BYTEA,
    hash TEXT
);

ALTER TABLE tournament ADD COLUMN IF NOT EXISTS background_image_id INTEGER REFERENCES image(id);