-- V15__add-tournament-types

DO $$
BEGIN

CREATE TABLE IF NOT EXISTS tournament_type (
    type TEXT PRIMARY KEY,
    line_1_label TEXT NOT NULL,
    line_2_label TEXT,
    line_2 BOOLEAN NOT NULL,
    spotify BOOLEAN NOT NULL,
    youtube BOOLEAN NOT NULL
);

IF (SELECT type FROM tournament_type WHERE type = 'MISC') IS NULL THEN
    INSERT INTO tournament_type (type, line_1_label, line_2_label, line_2, spotify, youtube) VALUES ('MISC', 'Line 1', 'Line 2', TRUE, FALSE, FALSE);
    INSERT INTO tournament_type (type, line_1_label, line_2_label, line_2, spotify, youtube) VALUES ('SONG', 'Title', 'Artist', TRUE, TRUE, TRUE);
    INSERT INTO tournament_type (type, line_1_label, line_2_label, line_2, spotify, youtube) VALUES ('MOVIE', 'Title', NULL, FALSE, FALSE, FALSE);
END IF;

IF (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'entry') IS NULL THEN
    ALTER TABLE song RENAME TO entry;
    ALTER TABLE entry RENAME COLUMN title TO line_1;
    ALTER TABLE entry RENAME COLUMN artist TO line_2;
    ALTER TABLE entry ALTER COLUMN line_2 DROP NOT NULL;
    ALTER TABLE entry ADD COLUMN type TEXT NOT NULL REFERENCES tournament_type(type) DEFAULT 'SONG';
    ALTER TABLE entry ALTER COLUMN type DROP DEFAULT;

    ALTER TABLE tournament ADD COLUMN type TEXT NOT NULL REFERENCES tournament_type(type) DEFAULT 'SONG';
    ALTER TABLE tournament ALTER COLUMN type DROP DEFAULT;

    ALTER TABLE tournament_match RENAME COLUMN song_1 TO entry_1;
    ALTER TABLE tournament_match RENAME COLUMN song_2 TO entry_2;
    ALTER TABLE tournament_match RENAME COLUMN song_winner TO entry_winner;
    ALTER TABLE tournament_match RENAME COLUMN song_1_vote_count TO entry_1_vote_count;
    ALTER TABLE tournament_match RENAME COLUMN song_2_vote_count TO entry_2_vote_count;
    ALTER TABLE tournament_match RENAME COLUMN song_1_description TO entry_1_description;
    ALTER TABLE tournament_match RENAME COLUMN song_2_description TO entry_2_description;

    ALTER TABLE vote RENAME COLUMN song_id TO entry_id;
END IF;

END $$;