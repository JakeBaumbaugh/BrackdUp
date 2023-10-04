-- V4__add-vote-table

CREATE TABLE IF NOT EXISTS vote (
    profile_id INTEGER NOT NULL REFERENCES profile (id),
    match_id INTEGER NOT NULL REFERENCES tournament_match (id),
    song_id INTEGER REFERENCES song (id),
    timestamp TIMESTAMP NOT NULL,
    PRIMARY KEY(profile_id, match_id)
);