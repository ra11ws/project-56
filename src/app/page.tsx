'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  supabase,
  isSupabaseConfigured,
  PhaseGoal,
  DailyLog,
  ScheduleItem,
  adaptGoalFromDb,
  adaptDailyLogFromDb,
  adaptScheduleFromDb,
} from '@/lib/supabase';
import {
  calculateMonkModeDay,
  TOTAL_DAYS,
  START_DATE,
  DEFAULT_PHASE_GOALS,
  DEFAULT_SCHEDULE,
  PHASE_METADATA,
} from '@/lib/defaults';
import { PhaseHeader } from '@/components/PhaseHeader';
import { PhaseGoals } from '@/components/PhaseGoals';
import { DailyReviewForm } from '@/components/DailyReviewForm';
import { ScheduleSidebar } from '@/components/ScheduleSidebar';
import { NightlyReminder } from '@/components/NightlyReminder';
import { SupabaseStatus } from '@/components/SupabaseStatus';
import { Shield, Sparkles, Terminal, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [currentDayInfo, setCurrentDayInfo] = useState(() => calculateMonkModeDay(START_DATE));
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  
  // Data states
  const [goals, setGoals] = useState<PhaseGoal[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  
  // UI & Sync states
  const [isLoadingGoals, setIsLoadingGoals] = useState<boolean>(true);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState<boolean>(true);
  const [hasConnectionError, setHasConnectionError] = useState<boolean>(false);
  const [connectionErrorMessage, setConnectionErrorMessage] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const isConfigured = isSupabaseConfigured();

  // Compute live current day on client mount
  useEffect(() => {
    const liveInfo = calculateMonkModeDay();
    setCurrentDayInfo(liveInfo);
    setSelectedPhase(liveInfo.currentPhase);
  }, []);

  // Load Initial Data
  const loadData = async () => {
    setIsRefreshing(true);
    setHasConnectionError(false);
    setConnectionErrorMessage('');

    // 1. Load Goals
    try {
      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('phase_goals')
          .select('*');

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const adapted = data.map(adaptGoalFromDb);
          setGoals(adapted);
          localStorage.setItem('p56_goals', JSON.stringify(adapted));
        } else {
          loadCachedOrFallbackGoals();
        }
      } else {
        loadCachedOrFallbackGoals();
      }
    } catch (err: unknown) {
      console.warn('Supabase fetch goals error (using local storage):', err);
      setHasConnectionError(true);
      const error = err as Error;
      setConnectionErrorMessage(error?.message || 'Database connection error');
      loadCachedOrFallbackGoals();
    } finally {
      setIsLoadingGoals(false);
    }

    // 2. Load Schedule
    try {
      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('schedule')
          .select('*');

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const adapted = data.map((row, idx) => adaptScheduleFromDb(row, idx));
          setSchedule(adapted);
          localStorage.setItem('p56_schedule', JSON.stringify(adapted));
        } else {
          loadCachedOrFallbackSchedule();
        }
      } else {
        loadCachedOrFallbackSchedule();
      }
    } catch (err) {
      console.warn('Supabase schedule fetch error:', err);
      loadCachedOrFallbackSchedule();
    } finally {
      setIsLoadingSchedule(false);
    }

    // 3. Load Daily Logs
    try {
      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('daily_logs')
          .select('*');

        if (!error && data && data.length > 0) {
          const adapted = data.map(adaptDailyLogFromDb);
          setDailyLogs(adapted);
          localStorage.setItem('p56_daily_logs', JSON.stringify(adapted));
        } else {
          loadCachedLogs();
        }
      } else {
        loadCachedLogs();
      }
    } catch (err) {
      console.warn('Supabase daily_logs fetch error:', err);
      loadCachedLogs();
    }

    setIsRefreshing(false);
  };

  const loadCachedOrFallbackGoals = () => {
    try {
      const cached = localStorage.getItem('p56_goals');
      if (cached) {
        setGoals(JSON.parse(cached));
      } else {
        setGoals(DEFAULT_PHASE_GOALS);
        localStorage.setItem('p56_goals', JSON.stringify(DEFAULT_PHASE_GOALS));
      }
    } catch {
      setGoals(DEFAULT_PHASE_GOALS);
    }
  };

  const loadCachedOrFallbackSchedule = () => {
    try {
      const cached = localStorage.getItem('p56_schedule');
      if (cached) {
        setSchedule(JSON.parse(cached));
      } else {
        setSchedule(DEFAULT_SCHEDULE);
      }
    } catch {
      setSchedule(DEFAULT_SCHEDULE);
    }
  };

  const loadCachedLogs = () => {
    try {
      const cached = localStorage.getItem('p56_daily_logs');
      if (cached) {
        setDailyLogs(JSON.parse(cached));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toggle Goal Completed
  const handleToggleGoal = async (goalId: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;

    // Optimistic Update
    const updatedGoals = goals.map((g) =>
      g.id === goalId ? { ...g, completed: updatedStatus } : g
    );
    setGoals(updatedGoals);
    localStorage.setItem('p56_goals', JSON.stringify(updatedGoals));

    if (isConfigured && supabase) {
      try {
        // Try updating is_completed (custom schema), then fallback to completed
        const res1 = await supabase
          .from('phase_goals')
          .update({ is_completed: updatedStatus })
          .eq('id', goalId);

        if (res1.error) {
          await supabase
            .from('phase_goals')
            .update({ completed: updatedStatus, updated_at: new Date().toISOString() })
            .eq('id', goalId);
        }
      } catch (err) {
        console.error('Supabase update goal network error:', err);
      }
    }
  };

  // Add Custom Goal
  const handleAddGoal = async (phase: number, title: string) => {
    const newId = `goal-${Date.now()}`;
    const newGoal: PhaseGoal = {
      id: newId,
      phase,
      title,
      completed: false,
      order_index: goals.filter((g) => g.phase === phase).length + 1,
      created_at: new Date().toISOString(),
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('p56_goals', JSON.stringify(updatedGoals));

    if (isConfigured && supabase) {
      try {
        // Try inserting custom schema first (phase_number, goal_text, is_completed)
        let res = await supabase
          .from('phase_goals')
          .insert([
            {
              phase_number: phase,
              goal_text: title,
              is_completed: false,
            },
          ])
          .select();

        // Fallback to standard schema (phase, title, completed)
        if (res.error && res.error.message.includes('schema cache')) {
          res = await supabase
            .from('phase_goals')
            .insert([
              {
                phase,
                title,
                completed: false,
                order_index: newGoal.order_index,
              },
            ])
            .select();
        }

        if (!res.error && res.data && res.data[0]) {
          const syncedGoals = updatedGoals.map((g) =>
            g.id === newId ? adaptGoalFromDb(res.data[0]) : g
          );
          setGoals(syncedGoals);
          localStorage.setItem('p56_goals', JSON.stringify(syncedGoals));
        } else if (res.error) {
          console.warn('Supabase insert goal note:', res.error.message);
        }
      } catch (err) {
        console.error('Supabase insert goal network error:', err);
      }
    }
  };

  // Submit Daily Review Form
  const handleSubmitDailyLog = async (log: DailyLog): Promise<boolean> => {
    let savedSuccessfully = false;

    // Save to local cache first
    const updatedLogs = [log, ...dailyLogs.filter((l) => l.day_number !== log.day_number)];
    setDailyLogs(updatedLogs);
    localStorage.setItem('p56_daily_logs', JSON.stringify(updatedLogs));

    if (isConfigured && supabase) {
      try {
        // Try full payload first
        let res = await supabase.from('daily_logs').insert([
          {
            date: log.log_date,
            day_number: log.day_number,
            growth_1: log.growth_1,
            growth_2: log.growth_2,
            growth_3: log.growth_3,
            growth_4: log.growth_4,
            growth_5: log.growth_5,
            is_exam_day: log.is_exam_day,
            is_debug_day: log.is_debug_session_day,
            reflection: log.reflection,
          },
        ]);

        // If growth columns don't exist yet, try basic columns
        if (res.error && res.error.message.includes('schema cache')) {
          res = await supabase.from('daily_logs').insert([
            {
              date: log.log_date,
              day_number: log.day_number,
              is_exam_day: log.is_exam_day,
              is_debug_day: log.is_debug_session_day,
            },
          ]);
        }

        if (res.error) {
          console.warn('Supabase daily_logs insert notice:', res.error.message);
          // If RLS policy is missing, it's still saved in local storage
          savedSuccessfully = false;
        } else {
          savedSuccessfully = true;
        }
      } catch (err) {
        console.error('Supabase daily_logs network error:', err);
        savedSuccessfully = false;
      }
    } else {
      savedSuccessfully = true;
    }

    return savedSuccessfully;
  };

  // Stats calculation per phase
  const phaseGoalsStats = useMemo(() => {
    const stats: Record<number, { total: number; completed: number }> = {
      1: { total: 0, completed: 0 },
      2: { total: 0, completed: 0 },
      3: { total: 0, completed: 0 },
      4: { total: 0, completed: 0 },
    };

    goals.forEach((goal) => {
      if (stats[goal.phase]) {
        stats[goal.phase].total += 1;
        if (goal.completed) {
          stats[goal.phase].completed += 1;
        }
      }
    });

    return stats;
  }, [goals]);

  // Current phase's goals
  const activePhaseGoals = useMemo(() => {
    return goals.filter((g) => g.phase === selectedPhase);
  }, [goals, selectedPhase]);

  // Find today's log if submitted
  const todayLog = useMemo(() => {
    return dailyLogs.find((l) => l.day_number === currentDayInfo.dayNumber) || null;
  }, [dailyLogs, currentDayInfo.dayNumber]);

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navbar */}
      <nav className="w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-black text-sm tracking-wider shadow-lg shadow-emerald-500/20">
            56
          </div>
          <span className="font-bold tracking-tight text-white text-base">
            PROJECT <span className="text-emerald-400">56</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
            MONK MODE LOCK-IN
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SupabaseStatus
            isConfigured={isConfigured}
            hasConnectionError={hasConnectionError}
            errorMessage={connectionErrorMessage}
          />

          <button
            type="button"
            onClick={loadData}
            disabled={isRefreshing}
            title="Refresh state"
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Nightly Reminder Pill Bar */}
        <NightlyReminder />

        {/* Phase Header & Day Counter */}
        <PhaseHeader
          currentDay={currentDayInfo.dayNumber}
          totalDays={TOTAL_DAYS}
          currentPhase={currentDayInfo.currentPhase}
          selectedPhase={selectedPhase}
          onSelectPhase={setSelectedPhase}
          phaseGoalsStats={phaseGoalsStats}
        />

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Goals and Daily Review (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Phase Goals Component */}
            <PhaseGoals
              phase={selectedPhase}
              goals={activePhaseGoals}
              onToggleGoal={handleToggleGoal}
              onAddGoal={handleAddGoal}
              isLoading={isLoadingGoals}
            />

            {/* 10 PM Daily Review Form Component */}
            <DailyReviewForm
              currentDay={currentDayInfo.dayNumber}
              onSubmitLog={handleSubmitDailyLog}
              todayLog={todayLog}
            />
          </div>

          {/* Right Column: Base Schedule Sidebar (4 cols) */}
          <div className="lg:col-span-4 sticky top-20">
            <ScheduleSidebar schedule={schedule} isLoading={isLoadingSchedule} />
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-zinc-900 py-6 px-4 text-center text-xs text-zinc-400 font-mono mt-12">
        <p>PROJECT 56 • High-Stakes Monk Mode Lock-In • Day {currentDayInfo.dayNumber} of {TOTAL_DAYS}</p>
        <p className="mt-1 text-[11px] text-zinc-500">
          Supabase schema script ready at <code className="text-zinc-400">supabase_schema.sql</code>
        </p>
      </footer>
    </div>
  );
}
