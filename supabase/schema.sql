-- =============================================
-- FuckNewsPoll - Schema SQL
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- App state: single-row table controlling the current round
CREATE TABLE app_state (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_active_round BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO app_state (id, is_active_round) VALUES (1, FALSE);

-- Votes table
CREATE TABLE votos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comediante TEXT NOT NULL CHECK (comediante IN ('mago', 'camilo')),
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX votos_device_id_unique ON votos (device_id);

-- Materialized vote count view
CREATE OR REPLACE VIEW vote_counts AS
  SELECT
    coalesce(sum(case when comediante = 'mago' then 1 else 0 end), 0) as mago_count,
    coalesce(sum(case when comediante = 'camilo' then 1 else 0 end), 0) as camilo_count,
    count(*) as total
  FROM votos;

-- =============================================
-- RLS Policies
-- =============================================

ALTER TABLE votos ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a vote
CREATE POLICY "Anyone can insert vote" ON votos
  FOR INSERT TO anon WITH CHECK (true);

-- Anyone can read votes
CREATE POLICY "Anyone can read votes" ON votos
  FOR SELECT TO anon USING (true);

-- Anyone can read app_state
CREATE POLICY "Anyone can read app_state" ON app_state
  FOR SELECT TO anon USING (true);

-- =============================================
-- IMPORTANT: Enable Realtime
-- Go to Supabase Dashboard > Database > Publications
-- Toggle ON both 'votos' and 'app_state' tables
-- in the 'supabase_realtime' publication
-- =============================================
