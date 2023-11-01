-- V7__add-tournament-voters

CREATE TABLE IF NOT EXISTS tournament_voter (
    tournament_id INTEGER NOT NULL REFERENCES tournament (id),
    email TEXT NOT NULL,
    profile_id INTEGER REFERENCES profile (id),
    PRIMARY KEY(tournament_id, email)
);