DROP TABLE IF EXISTS song;
DROP TABLE IF EXISTS tournament;
DROP TABLE IF EXISTS tournament_phase;
DROP TABLE IF EXISTS tournament_matchup;

CREATE TABLE song (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    spotify TEXT,
    youtube TEXT
);

CREATE TABLE tournament (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE tournament_phase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_id INTEGER NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournament (id)
);

CREATE TABLE tournament_matchup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phase_id INTEGER NOT NULL,
    song_1 INTEGER NOT NULL,
    song_2 INTEGER,
    song_winner INTEGER,
    FOREIGN KEY (phase_id) REFERENCES tournament_phase (id),
    FOREIGN KEY (song_1) REFERENCES song (id),
    FOREIGN KEY (song_2) REFERENCES song (id),
    FOREIGN KEY (song_winner) REFERENCES song (id)
);