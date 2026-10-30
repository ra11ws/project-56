-- Project 56 - Supabase Schema Definition
-- Run this script in your Supabase SQL Editor to set up tables and initial data.

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Phase Goals Table
CREATE TABLE IF NOT EXISTS phase_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase INT NOT NULL CHECK (phase BETWEEN 1 AND 4),
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Daily Logs Table (10 PM Daily Review)
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    day_number INT NOT NULL,
    growth_1 TEXT,
    growth_2 TEXT,
    growth_3 TEXT,
    growth_4 TEXT,
    growth_5 TEXT,
    is_exam_day BOOLEAN DEFAULT FALSE,
    is_debug_session_day BOOLEAN DEFAULT FALSE,
    reflection TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Base Schedule Table
CREATE TABLE IF NOT EXISTS schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    time_start TEXT NOT NULL,
    time_end TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('sleep', 'meal', 'deep_focus', 'review', 'workout', 'other')),
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Base Schedule Items
INSERT INTO schedule (title, time_start, time_end, category, order_index)
VALUES
    ('Restorative Sleep & Recovery', '11:00 PM', '06:00 AM', 'sleep', 1),
    ('Morning Routine & Hydration', '06:00 AM', '07:00 AM', 'other', 2),
    ('Deep Focus Block 1 (High Cognitive Load)', '07:00 AM', '11:00 AM', 'deep_focus', 3),
    ('Nutrient Dense Meal & Mind Reset', '11:00 AM', '12:00 PM', 'meal', 4),
    ('Deep Focus Block 2 (Execution & Building)', '12:00 PM', '04:00 PM', 'deep_focus', 5),
    ('Physical Training & Nature Walk', '04:00 PM', '05:30 PM', 'workout', 6),
    ('Evening Refuel (Dinner)', '05:30 PM', '06:30 PM', 'meal', 7),
    ('Deep Focus Block 3 / Learning / Review', '06:30 PM', '09:30 PM', 'deep_focus', 8),
    ('Nightly 10 PM Review & Shutdown', '09:30 PM', '10:30 PM', 'review', 9),
    ('Wind-down & Reading', '10:30 PM', '11:00 PM', 'other', 10)
ON CONFLICT DO NOTHING;

-- Seed Sample Phase Goals for Phase 1 (Foundation & Velocity)
INSERT INTO phase_goals (phase, title, completed, order_index)
VALUES
    (1, 'Zero junk food and zero alcohol lock-in', false, 1),
    (1, 'Sleep at 11:00 PM sharp every single night', false, 2),
    (1, 'Complete 4 hours uninterrupted Deep Focus Block 1', false, 3),
    (1, 'Daily 10 PM review submission without exception', false, 4),
    (1, 'Ship core system architecture & data models', false, 5),
    (1, 'Read 20 pages technical documentation or architecture book', false, 6),
    (1, 'Hydrate with 3.5 liters water daily', false, 7),
    (1, 'Daily 45-min cardio / strength session completed', false, 8),
    (1, 'Zero unapproved social media or screen distractions', false, 9),
    (1, 'Debug session log analysis for all blockers', false, 10),
    (1, 'Weekly retrospective milestone checklist passed', false, 11),
    (1, 'Maintain 100% monk mode tracking score', false, 12)
ON CONFLICT DO NOTHING;

-- Seed Sample Phase Goals for Phase 2 (Momentum & Core Feature Set)
INSERT INTO phase_goals (phase, title, completed, order_index)
VALUES
    (2, 'Master advanced algorithms and distributed patterns', false, 1),
    (2, 'Complete mock exam drill 1 under timed conditions', false, 2),
    (2, 'Refactor backend performance bottlenecks (<50ms response)', false, 3),
    (2, 'Zero sugar, 100% clean diet streak maintained', false, 4),
    (2, '6 hours of daily deep code execution logged', false, 5),
    (2, '10 PM daily reflections submitted on time', false, 6),
    (2, 'Execute end-to-end integration tests suite', false, 7),
    (2, 'Review code complexity metrics and simplify', false, 8),
    (2, '5km daily aerobic base training', false, 9),
    (2, 'Document core architecture decisions & runbook', false, 10)
ON CONFLICT DO NOTHING;

-- Seed Sample Phase Goals for Phase 3 (Pressure & High-Load Testing)
INSERT INTO phase_goals (phase, title, completed, order_index)
VALUES
    (3, 'Timed exam simulation 2 with 90%+ pass rate', false, 1),
    (3, 'Stress-test all critical paths and error handlers', false, 2),
    (3, 'Zero missed sleep windows (11 PM - 6 AM strict)', false, 3),
    (3, 'Conduct intensive 4-hour live debug workshop', false, 4),
    (3, 'Eliminate remaining technical debt items', false, 5),
    (3, 'Pre-flight production readiness inspection', false, 6),
    (3, 'Consistent physical training streak (no skipped days)', false, 7),
    (3, 'Submit daily growth item reflections every day', false, 8),
    (3, 'Optimize mental stamina for continuous problem solving', false, 9),
    (3, 'Prepare deployment strategy and fallback plans', false, 10)
ON CONFLICT DO NOTHING;

-- Seed Sample Phase Goals for Phase 4 (Peak Performance & Final Delivery)
INSERT INTO phase_goals (phase, title, completed, order_index)
VALUES
    (4, 'Complete final capstone exam / final milestone review', false, 1),
    (4, 'Finalize release build and deployment audit', false, 2),
    (4, 'Verify 100% monk mode discipline across all 56 days', false, 3),
    (4, 'Compile 56-day growth analytics and insights report', false, 4),
    (4, 'Deliver presentation / demo of completed project', false, 5),
    (4, 'Full system documentation published and tagged', false, 6),
    (4, 'Final fitness and stamina benchmark assessment', false, 7),
    (4, 'Celebrate victory on December 24 with clean conscience', false, 8),
    (4, 'Plan 2027 maintenance protocol & expansion goals', false, 9),
    (4, 'Archive project logs and reflection journals', false, 10)
ON CONFLICT DO NOTHING;

