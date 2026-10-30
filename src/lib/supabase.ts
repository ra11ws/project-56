import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseAnonKey.includes('your-anon-key-placeholder') &&
    supabaseUrl.startsWith('https://')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface PhaseGoal {
  id: string;
  phase: number;
  title: string;
  completed: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DailyLog {
  id?: string;
  log_date: string;
  day_number: number;
  growth_1: string;
  growth_2: string;
  growth_3: string;
  growth_4: string;
  growth_5: string;
  is_exam_day: boolean;
  is_debug_session_day: boolean;
  reflection?: string;
  created_at?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  time_start: string;
  time_end: string;
  category: 'sleep' | 'meal' | 'deep_focus' | 'review' | 'workout' | 'other';
  order_index: number;
  description?: string;
}

// Adapters to seamlessly handle both schema formats (custom vs standard)
export function adaptGoalFromDb(row: Record<string, any>): PhaseGoal {
  return {
    id: String(row.id),
    phase: Number(row.phase ?? row.phase_number ?? 1),
    title: String(row.goal_text ?? row.title ?? row.name ?? 'Untitled Goal'),
    completed: Boolean(row.is_completed ?? row.completed ?? false),
    order_index: Number(row.order_index ?? row.order ?? 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function adaptDailyLogFromDb(row: Record<string, any>): DailyLog {
  return {
    id: row.id ? String(row.id) : undefined,
    log_date: String(row.date ?? row.log_date ?? new Date().toISOString().split('T')[0]),
    day_number: Number(row.day_number ?? 1),
    growth_1: String(row.growth_1 ?? ''),
    growth_2: String(row.growth_2 ?? ''),
    growth_3: String(row.growth_3 ?? ''),
    growth_4: String(row.growth_4 ?? ''),
    growth_5: String(row.growth_5 ?? ''),
    is_exam_day: Boolean(row.is_exam_day ?? false),
    is_debug_session_day: Boolean(row.is_debug_day ?? row.is_debug_session_day ?? false),
    reflection: row.reflection ? String(row.reflection) : undefined,
    created_at: row.created_at,
  };
}

export function adaptScheduleFromDb(row: Record<string, any>, index: number): ScheduleItem {
  const activity = String(row.activity ?? row.title ?? 'Monk Mode Routine');
  
  // Categorize based on activity name
  let category: ScheduleItem['category'] = 'other';
  const lower = activity.toLowerCase();
  if (lower.includes('sleep') || lower.includes('rest')) category = 'sleep';
  else if (lower.includes('meal') || lower.includes('lunch') || lower.includes('dinner')) category = 'meal';
  else if (lower.includes('deep') || lower.includes('focus') || lower.includes('code')) category = 'deep_focus';
  else if (lower.includes('workout') || lower.includes('gym') || lower.includes('run')) category = 'workout';
  else if (lower.includes('review') || lower.includes('10 pm')) category = 'review';

  return {
    id: String(row.id || `sched-${index}`),
    title: activity,
    time_start: String(row.time_start ?? row.start_time ?? ''),
    time_end: String(row.time_end ?? row.end_time ?? ''),
    category: (row.category as ScheduleItem['category']) || category,
    order_index: Number(row.order_index ?? index),
    description: row.description ? String(row.description) : undefined,
  };
}
