-- V10__add-round-and-match-descriptions

ALTER TABLE tournament_round ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tournament_match ADD COLUMN IF NOT EXISTS song_1_description TEXT;
ALTER TABLE tournament_match ADD COLUMN IF NOT EXISTS song_2_description TEXT;