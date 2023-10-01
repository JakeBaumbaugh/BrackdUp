-- V3__add-profile-table

CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    picture_link TEXT
);