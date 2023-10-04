-- V1__TOURNAMENT-SCHEMA

CREATE TABLE IF NOT EXISTS song (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    spotify TEXT,
    youtube TEXT
);

CREATE TABLE IF NOT EXISTS tournament (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    matches_per_round INTEGER DEFAULT 8
);

CREATE TABLE IF NOT EXISTS tournament_level (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER NOT NULL REFERENCES tournament (id),
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tournament_round (
    id SERIAL PRIMARY KEY,
    level_id INTEGER NOT NULL REFERENCES tournament_level (id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tournament_match (
    id SERIAL PRIMARY KEY,
    round_id INTEGER NOT NULL REFERENCES tournament_round(id),
    song_1 INTEGER NOT NULL REFERENCES song (id),
    song_2 INTEGER NOT NULL REFERENCES song (id),
    song_winner INTEGER REFERENCES song (id)
);