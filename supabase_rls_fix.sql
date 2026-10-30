-- ==========================================================
-- PROJECT 56 — SUPABASE RLS POLICIES & SCHEMA SYNC SCRIPT
-- ==========================================================
-- Copy and paste this script into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fvtzhtxzajydneryjqyh/sql/new

-- 1. Grant Anonymous Permissions via Row Level Security (RLS)
-- Phase Goals: Allow read, insert, update
ALTER TABLE phase_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon Select Goals" ON phase_goals;
DROP POLICY IF EXISTS "Anon Insert Goals" ON phase_goals;
DROP POLICY IF EXISTS "Anon Update Goals" ON phase_goals;
DROP POLICY IF EXISTS "Anon Delete Goals" ON phase_goals;

CREATE POLICY "Anon Select Goals" ON phase_goals FOR SELECT TO anon USING (true);
CREATE POLICY "Anon Insert Goals" ON phase_goals FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon Update Goals" ON phase_goals FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anon Delete Goals" ON phase_goals FOR DELETE TO anon USING (true);

-- Daily Logs: Allow read and insert
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon Select Daily Logs" ON daily_logs;
DROP POLICY IF EXISTS "Anon Insert Daily Logs" ON daily_logs;
DROP POLICY IF EXISTS "Anon Update Daily Logs" ON daily_logs;

CREATE POLICY "Anon Select Daily Logs" ON daily_logs FOR SELECT TO anon USING (true);
CREATE POLICY "Anon Insert Daily Logs" ON daily_logs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon Update Daily Logs" ON daily_logs FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Schedule: Allow read and insert
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anon Select Schedule" ON schedule;
DROP POLICY IF EXISTS "Anon Insert Schedule" ON schedule;

CREATE POLICY "Anon Select Schedule" ON schedule FOR SELECT TO anon USING (true);
CREATE POLICY "Anon Insert Schedule" ON schedule FOR INSERT TO anon WITH CHECK (true);

-- 2. Ensure Growth Items & Schedule Timing Columns Exist in daily_logs & schedule
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS growth_1 TEXT;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS growth_2 TEXT;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS growth_3 TEXT;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS growth_4 TEXT;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS growth_5 TEXT;
ALTER TABLE daily_logs ADD COLUMN IF NOT EXISTS reflection TEXT;

ALTER TABLE schedule ADD COLUMN IF NOT EXISTS time_start TEXT;
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS time_end TEXT;
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE schedule ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;

-- 3. Seed Default Goals for Phase 1 - 4 if empty
INSERT INTO phase_goals (phase_number, goal_text, is_completed)
SELECT 1, 'Absolute 11:00 PM sleep to 6:00 AM wake rhythm locked in', false
WHERE NOT EXISTS (SELECT 1 FROM phase_goals WHERE phase_number = 1);

INSERT INTO phase_goals (phase_number, goal_text, is_completed)
VALUES
    (1, 'Zero sugar, zero alcohol, 100% clean whole food intake', false),
    (1, 'Execute 4-hour morning Deep Focus Block without phone in room', false),
    (1, 'Submit 10:00 PM Daily Review every single night', false),
    (1, 'Define complete data schema & core API architecture', false),
    (1, 'Read 20 pages of core engineering / theory books daily', false),
    (1, 'Consume 3.5 liters of clean water daily', false),
    (1, 'Daily 45-minute physical conditioning / zone 2 cardio', false),
    (1, 'Block all algorithmic feeds, short-form video & non-work sites', false),
    (1, 'Implement automated backup & logging pipeline', false),
    (1, 'Complete first 100 LeetCode / algorithmic problem sets', false),
    (1, 'Perform Sunday weekly retrospective and sprint planning', false)
ON CONFLICT DO NOTHING;

-- Seed Base Schedule if empty
INSERT INTO schedule (activity, time_start, time_end, category, order_index)
SELECT 'Sleep & Neuro-Recovery', '11:00 PM', '06:00 AM', 'sleep', 1
WHERE NOT EXISTS (SELECT 1 FROM schedule);

INSERT INTO schedule (activity, time_start, time_end, category, order_index)
VALUES
    ('Morning Protocol & Hydration', '06:00 AM', '07:00 AM', 'other', 2),
    ('Deep Focus Block 1: Architecture & Heavy Code', '07:00 AM', '11:00 AM', 'deep_focus', 3),
    ('Nutritious Meal & Sunlight Walk', '11:00 AM', '12:00 PM', 'meal', 4),
    ('Deep Focus Block 2: Implementation & Systems', '12:00 PM', '04:00 PM', 'deep_focus', 5),
    ('Physical Training & Conditioning', '04:00 PM', '05:30 PM', 'workout', 6),
    ('Evening Meal & Hydration', '05:30 PM', '06:30 PM', 'meal', 7),
    ('Deep Focus Block 3: Debug, Exam & Learning', '06:30 PM', '09:30 PM', 'deep_focus', 8),
    ('10 PM Daily Review & Nightly Reflection', '09:30 PM', '10:30 PM', 'review', 9),
    ('Digital Shutdown & Wind Down', '10:30 PM', '11:00 PM', 'other', 10)
ON CONFLICT DO NOTHING;

