import { PhaseGoal, ScheduleItem } from './supabase';

export const START_DATE = new Date('2026-10-30T00:00:00');
export const END_DATE = new Date('2026-12-24T23:59:59');
export const TOTAL_DAYS = 56;
export const DAYS_PER_PHASE = 14;

export function calculateMonkModeDay(targetDate?: Date): {
  dayNumber: number;
  currentPhase: number;
  phaseDay: number;
  daysRemaining: number;
  percentComplete: number;
  isBeforeStart: boolean;
  isCompleted: boolean;
} {
  const start = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
  const effectiveDate = targetDate ?? new Date();
  const now = new Date(effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate());
  
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays < 1) {
    return {
      dayNumber: 1,
      currentPhase: 1,
      phaseDay: 1,
      daysRemaining: TOTAL_DAYS,
      percentComplete: 0,
      isBeforeStart: true,
      isCompleted: false,
    };
  }

  if (diffDays > TOTAL_DAYS) {
    return {
      dayNumber: TOTAL_DAYS,
      currentPhase: 4,
      phaseDay: DAYS_PER_PHASE,
      daysRemaining: 0,
      percentComplete: 100,
      isBeforeStart: false,
      isCompleted: true,
    };
  }

  const phase = Math.min(4, Math.max(1, Math.ceil(diffDays / DAYS_PER_PHASE)));
  const phaseDay = ((diffDays - 1) % DAYS_PER_PHASE) + 1;
  const daysRemaining = TOTAL_DAYS - diffDays;
  const percentComplete = Math.round((diffDays / TOTAL_DAYS) * 100);

  return {
    dayNumber: diffDays,
    currentPhase: phase,
    phaseDay,
    daysRemaining,
    percentComplete,
    isBeforeStart: false,
    isCompleted: false,
  };
}

export const PHASE_METADATA = [
  {
    phase: 1,
    name: 'Foundation & Velocity',
    subtitle: 'Strict Routine, Digital Detox & Core Architecture',
    days: 'Day 1 - 14',
    dateRange: 'Oct 30 - Nov 12',
    theme: 'emerald',
    focus: 'Eradicate distraction loops, lock in 11PM-6AM circadian rhythm, ship baseline architecture.',
  },
  {
    phase: 2,
    name: 'Momentum & Deep Execution',
    subtitle: 'Cognitive Endurance & Heavy Feature Builds',
    days: 'Day 15 - 28',
    dateRange: 'Nov 13 - Nov 26',
    theme: 'cyan',
    focus: 'Scale deep focus blocks to 6+ hours daily, master complex problem domains, maintain 100% clean nutrition.',
  },
  {
    phase: 3,
    name: 'Pressure & Stress Testing',
    subtitle: 'Mock Exams, Edge Cases & Bug Extermination',
    days: 'Day 29 - 42',
    dateRange: 'Nov 27 - Dec 10',
    theme: 'violet',
    focus: 'Simulate high-pressure exam/debug environments, optimize latency, harden personal resilience under fatigue.',
  },
  {
    phase: 4,
    name: 'Peak Mastery & Final Release',
    subtitle: 'Capstone Delivery, Polishing & Victory',
    days: 'Day 43 - 56',
    dateRange: 'Dec 11 - Dec 24',
    theme: 'amber',
    focus: 'Complete final capstone audits, zero tech debt, compile 56-day monk retrospective, celebrate finish on Dec 24.',
  },
];

export const DEFAULT_PHASE_GOALS: PhaseGoal[] = [
  // Phase 1 Goals (14 goals)
  { id: 'p1-1', phase: 1, title: 'Absolute 11:00 PM sleep to 6:00 AM wake rhythm locked in', completed: false, order_index: 1 },
  { id: 'p1-2', phase: 1, title: 'Zero sugar, zero alcohol, 100% clean whole food intake', completed: false, order_index: 2 },
  { id: 'p1-3', phase: 1, title: 'Execute 4-hour morning Deep Focus Block without phone in room', completed: false, order_index: 3 },
  { id: 'p1-4', phase: 1, title: 'Submit 10:00 PM Daily Review every single night', completed: false, order_index: 4 },
  { id: 'p1-5', phase: 1, title: 'Define complete data schema & core API architecture', completed: false, order_index: 5 },
  { id: 'p1-6', phase: 1, title: 'Read 20 pages of core engineering / theory books daily', completed: false, order_index: 6 },
  { id: 'p1-7', phase: 1, title: 'Consume 3.5 liters of clean water daily', completed: false, order_index: 7 },
  { id: 'p1-8', phase: 1, title: 'Daily 45-minute physical conditioning / zone 2 cardio', completed: false, order_index: 8 },
  { id: 'p1-9', phase: 1, title: 'Block all algorithmic feeds, short-form video & non-work sites', completed: false, order_index: 9 },
  { id: 'p1-10', phase: 1, title: 'Implement automated backup & logging pipeline', completed: false, order_index: 10 },
  { id: 'p1-11', phase: 1, title: 'Complete first 100 LeetCode / algorithmic problem sets', completed: false, order_index: 11 },
  { id: 'p1-12', phase: 1, title: 'Perform Sunday weekly retrospective and sprint planning', completed: false, order_index: 12 },
  { id: 'p1-13', phase: 1, title: 'Cold shower morning activation protocol', completed: false, order_index: 13 },
  { id: 'p1-14', phase: 1, title: 'Maintain perfect Day 1-14 habit tracker compliance score', completed: false, order_index: 14 },

  // Phase 2 Goals (12 goals)
  { id: 'p2-1', phase: 2, title: 'Scale total deep work execution to 6+ hours daily', completed: false, order_index: 1 },
  { id: 'p2-2', phase: 2, title: 'Implement complex backend microservices & real-time sync', completed: false, order_index: 2 },
  { id: 'p2-3', phase: 2, title: 'Pass timed mock exam drill 1 with >= 90% accuracy', completed: false, order_index: 3 },
  { id: 'p2-4', phase: 2, title: 'Refactor core modules to keep all query latencies < 50ms', completed: false, order_index: 4 },
  { id: 'p2-5', phase: 2, title: 'Zero fast food streak maintained across Phase 2', completed: false, order_index: 5 },
  { id: 'p2-6', phase: 2, title: 'Write comprehensive integration tests covering 85%+ code', completed: false, order_index: 6 },
  { id: 'p2-7', phase: 2, title: 'Conduct two 4-hour deep debug sessions on critical edge cases', completed: false, order_index: 7 },
  { id: 'p2-8', phase: 2, title: 'Log 5 distinct growth items every night in the 10 PM review', completed: false, order_index: 8 },
  { id: 'p2-9', phase: 2, title: 'Build interactive metrics dashboard for tracking velocity', completed: false, order_index: 9 },
  { id: 'p2-10', phase: 2, title: 'Complete 10km endurance run benchmark', completed: false, order_index: 10 },
  { id: 'p2-11', phase: 2, title: 'Maintain uninterrupted sleep schedule (11 PM - 6 AM)', completed: false, order_index: 11 },
  { id: 'p2-12', phase: 2, title: 'Finalize mid-point evaluation and celebrate Phase 2 finish', completed: false, order_index: 12 },

  // Phase 3 Goals (12 goals)
  { id: 'p3-1', phase: 3, title: 'Complete full-length simulation exam under strict time pressure', completed: false, order_index: 1 },
  { id: 'p3-2', phase: 3, title: 'Stress test system architecture with 10x synthetic load', completed: false, order_index: 2 },
  { id: 'p3-3', phase: 3, title: 'Identify and resolve all known P0/P1 bugs in debug logs', completed: false, order_index: 3 },
  { id: 'p3-4', phase: 3, title: 'Uphold strict monk mode isolation: zero social distractions', completed: false, order_index: 4 },
  { id: 'p3-5', phase: 3, title: 'Execute flawless morning deep focus sprint (7:00 AM - 11:00 AM)', completed: false, order_index: 5 },
  { id: 'p3-6', phase: 3, title: 'Document troubleshooting runbook & architecture disaster recovery', completed: false, order_index: 6 },
  { id: 'p3-7', phase: 3, title: 'Conduct daily posture, mobility, and breathwork sessions', completed: false, order_index: 7 },
  { id: 'p3-8', phase: 3, title: 'Achieve 100% submission rate on 10 PM daily logs', completed: false, order_index: 8 },
  { id: 'p3-9', phase: 3, title: 'Optimize UI load time and client-side rendering performance', completed: false, order_index: 9 },
  { id: 'p3-10', phase: 3, title: 'Review security audit checklist and lock down permissions', completed: false, order_index: 10 },
  { id: 'p3-11', phase: 3, title: 'Pass simulated technical interview / defense panel trial', completed: false, order_index: 11 },
  { id: 'p3-12', phase: 3, title: 'Prepare pre-release candidate build for final phase rollout', completed: false, order_index: 12 },

  // Phase 4 Goals (13 goals)
  { id: 'p4-1', phase: 4, title: 'Complete final capstone evaluation with perfect marks', completed: false, order_index: 1 },
  { id: 'p4-2', phase: 4, title: 'Deploy production release build with CI/CD automation', completed: false, order_index: 2 },
  { id: 'p4-3', phase: 4, title: 'Verify zero open bug reports or memory leaks', completed: false, order_index: 3 },
  { id: 'p4-4', phase: 4, title: 'Complete all 56 days of uninterrupted 11 PM - 6 AM sleep', completed: false, order_index: 4 },
  { id: 'p4-5', phase: 4, title: 'Synthesize 56 daily logs into comprehensive growth document', completed: false, order_index: 5 },
  { id: 'p4-6', phase: 4, title: 'Publish technical case study and codebase walk-through', completed: false, order_index: 6 },
  { id: 'p4-7', phase: 4, title: 'Complete final physical fitness benchmark testing', completed: false, order_index: 7 },
  { id: 'p4-8', phase: 4, title: 'Review 56-day habit transformation metrics and insights', completed: false, order_index: 8 },
  { id: 'p4-9', phase: 4, title: 'Deliver polished live demonstration video & documentation', completed: false, order_index: 9 },
  { id: 'p4-10', phase: 4, title: 'Archive all debug notes, exam scores, and sprint artifacts', completed: false, order_index: 10 },
  { id: 'p4-11', phase: 4, title: 'Design post-lock-in 2027 life & career mastery protocol', completed: false, order_index: 11 },
  { id: 'p4-12', phase: 4, title: 'Zero discipline compromises across the entire 56-day journey', completed: false, order_index: 12 },
  { id: 'p4-13', phase: 4, title: 'December 24 Victory Celebration: Lock-in conquered!', completed: false, order_index: 13 },
];

export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  {
    id: 's1',
    title: 'Sleep & Neuro-Recovery',
    time_start: '11:00 PM',
    time_end: '06:00 AM',
    category: 'sleep',
    order_index: 1,
    description: 'Blackout room, 68°F, strict 7-hour cellular regeneration.',
  },
  {
    id: 's2',
    title: 'Morning Protocol & Hydration',
    time_start: '06:00 AM',
    time_end: '07:00 AM',
    category: 'other',
    order_index: 2,
    description: '1L water with electrolytes, cold shower, sunlight exposure.',
  },
  {
    id: 's3',
    title: 'Deep Focus Block 1: Architecture & Heavy Code',
    time_start: '07:00 AM',
    time_end: '11:00 AM',
    category: 'deep_focus',
    order_index: 3,
    description: 'Highest cognitive energy. No phone, zero tabs unrelated to core sprint.',
  },
  {
    id: 's4',
    title: 'Nutritious Meal & Sunlight Walk',
    time_start: '11:00 AM',
    time_end: '12:00 PM',
    category: 'meal',
    order_index: 4,
    description: 'High protein, healthy fats, clean carbs. Mental reset away from screens.',
  },
  {
    id: 's5',
    title: 'Deep Focus Block 2: Implementation & Systems',
    time_start: '12:00 PM',
    time_end: '04:00 PM',
    category: 'deep_focus',
    order_index: 5,
    description: 'Feature development, testing pipelines, and systems design.',
  },
  {
    id: 's6',
    title: 'Physical Training & Conditioning',
    time_start: '04:00 PM',
    time_end: '05:30 PM',
    category: 'workout',
    order_index: 6,
    description: 'Weight lifting, zone-2 aerobic work, and mobility drills.',
  },
  {
    id: 's7',
    title: 'Evening Meal & Hydration',
    time_start: '05:30 PM',
    time_end: '06:30 PM',
    category: 'meal',
    order_index: 7,
    description: 'Clean refuel meal. Hydrate and prepare for evening focus session.',
  },
  {
    id: 's8',
    title: 'Deep Focus Block 3: Debug, Exam & Learning',
    time_start: '06:30 PM',
    time_end: '09:30 PM',
    category: 'deep_focus',
    order_index: 8,
    description: 'Technical reading, debugging logs, mock exam drills, code review.',
  },
  {
    id: 's9',
    title: '10 PM Daily Review & Nightly Reflection',
    time_start: '09:30 PM',
    time_end: '10:30 PM',
    category: 'review',
    order_index: 9,
    description: 'Submit 5 daily growth items, mark Exam/Debug flags, inspect goals.',
  },
  {
    id: 's10',
    title: 'Digital Shutdown & Wind Down',
    time_start: '10:30 PM',
    time_end: '11:00 PM',
    category: 'other',
    order_index: 10,
    description: 'Screens off. Journaling, physical book reading, prepare for sleep.',
  },
];
