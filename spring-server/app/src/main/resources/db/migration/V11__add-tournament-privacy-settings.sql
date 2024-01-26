-- V11__add-tournament-privacy-settings

ALTER TABLE tournament ADD COLUMN IF NOT EXISTS privacy TEXT NOT NULL DEFAULT 'VISIBLE';