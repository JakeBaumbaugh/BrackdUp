-- V13__add-tournament-creator

ALTER TABLE tournament ADD COLUMN IF NOT EXISTS creator_id INTEGER REFERENCES profile(id);