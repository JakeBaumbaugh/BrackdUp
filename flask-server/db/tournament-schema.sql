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
    id INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE tournament_phase (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (tournament_id) REFERENCES tournament (id) NOT NULL
);

CREATE TABLE tournament_matchup (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    FOREIGN KEY (phase_id) REFERENCES tournament_phase (id) NOT NULL,
    FOREIGN KEY (song_1) REFERENCES song (id) NOT NULL,
    FOREIGN KEY (song_2) REFERENCES song (id),
    FOREIGN KEY (song_winner) REFERENCES song (id),
);