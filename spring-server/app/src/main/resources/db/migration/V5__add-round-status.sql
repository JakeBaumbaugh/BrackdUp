-- V5__add-round-status

ALTER TABLE tournament_round ADD COLUMN IF NOT EXISTS status TEXT;