-- V12__add-tournament-mode

ALTER TABLE tournament ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'SCHEDULED';

ALTER TABLE tournament_round ALTER COLUMN start_date DROP NOT NULL;
ALTER TABLE tournament_round ALTER COLUMN end_date DROP NOT NULL;