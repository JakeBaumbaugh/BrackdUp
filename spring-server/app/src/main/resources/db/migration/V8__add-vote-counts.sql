-- V8__add-vote-counts

ALTER TABLE tournament_match ADD COLUMN IF NOT EXISTS song_1_vote_count INTEGER;
ALTER TABLE tournament_match ADD COLUMN IF NOT EXISTS song_2_vote_count INTEGER;