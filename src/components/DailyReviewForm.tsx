'use client';

import React, { useState } from 'react';
import { DailyLog } from '@/lib/supabase';
import {
  Moon,
  Send,
  CheckCircle,
  GraduationCap,
  Bug,
  Sparkles,
  Award,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Props {
  currentDay: number;
  onSubmitLog: (log: DailyLog) => Promise<boolean>;
  todayLog: DailyLog | null;
}

export function DailyReviewForm({ currentDay, onSubmitLog, todayLog }: Props) {
  const [formData, setFormData] = useState<{
    growth_1: string;
    growth_2: string;
    growth_3: string;
    growth_4: string;
    growth_5: string;
    is_exam_day: boolean;
    is_debug_session_day: boolean;
    reflection: string;
  }>({
    growth_1: todayLog?.growth_1 || '',
    growth_2: todayLog?.growth_2 || '',
    growth_3: todayLog?.growth_3 || '',
    growth_4: todayLog?.growth_4 || '',
    growth_5: todayLog?.growth_5 || '',
    is_exam_day: todayLog?.is_exam_day || false,
    is_debug_session_day: todayLog?.is_debug_session_day || false,
    reflection: todayLog?.reflection || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const todayIso = new Date().toISOString().split('T')[0];
      const logToSave: DailyLog = {
        log_date: todayIso,
        day_number: currentDay,
        growth_1: formData.growth_1.trim(),
        growth_2: formData.growth_2.trim(),
        growth_3: formData.growth_3.trim(),
        growth_4: formData.growth_4.trim(),
        growth_5: formData.growth_5.trim(),
        is_exam_day: formData.is_exam_day,
        is_debug_session_day: formData.is_debug_session_day,
        reflection: formData.reflection.trim(),
      };

      const success = await onSubmitLog(logToSave);
      if (success) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setErrorMessage('Failed to save log. Stored locally.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error?.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl relative">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-800/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Moon className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              10 PM Daily Review & Debrief
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Mandatory lock-in evening reflection. Log 5 dimensions of growth for Day {currentDay}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {todayLog ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Day {currentDay} Submitted
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              Pending Tonight
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* Day Toggles: Exam Day & Debug Session Day */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Exam Day Toggle */}
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, is_exam_day: !prev.is_exam_day }))}
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
              formData.is_exam_day
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-md shadow-amber-950/20 ring-1 ring-amber-500/30'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  formData.is_exam_day ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">Exam Day</div>
                <div className="text-[11px] text-zinc-400">Mock exam or timed challenge</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold ${
                formData.is_exam_day
                  ? 'bg-amber-500 border-amber-400 text-black'
                  : 'border-zinc-700 bg-zinc-800'
              }`}
            >
              {formData.is_exam_day ? '✓' : ''}
            </div>
          </button>

          {/* Debug Session Day Toggle */}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, is_debug_session_day: !prev.is_debug_session_day }))
            }
            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
              formData.is_debug_session_day
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 shadow-md shadow-rose-950/20 ring-1 ring-rose-500/30'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  formData.is_debug_session_day
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                <Bug className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">Debug Session Day</div>
                <div className="text-[11px] text-zinc-400">Deep bug investigation or edge case stress</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold ${
                formData.is_debug_session_day
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'border-zinc-700 bg-zinc-800'
              }`}
            >
              {formData.is_debug_session_day ? '✓' : ''}
            </div>
          </button>
        </div>

        {/* 5 Daily Growth Items */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
            5 Daily Growth & Mastery Items
          </label>

          {[
            {
              key: 'growth_1' as const,
              label: '1. Deep Work & Technical Output',
              placeholder: 'e.g., Shipped authentication module and fixed database index latency',
            },
            {
              key: 'growth_2' as const,
              label: '2. Physical Conditioning & Recovery',
              placeholder: 'e.g., 45-min interval session, 3.5L water, 0 cheats on nutrition',
            },
            {
              key: 'growth_3' as const,
              label: '3. Cognitive Discipline & Mental Friction',
              placeholder: 'e.g., Pushed through mid-afternoon fatigue block without phone checks',
            },
            {
              key: 'growth_4' as const,
              label: '4. Critical Blocker Overcome',
              placeholder: 'e.g., Resolved asynchronous race condition in state updater',
            },
            {
              key: 'growth_5' as const,
              label: "5. Tomorrow's Non-Negotiable Objective",
              placeholder: 'e.g., Deliver production ready end-to-end test suite by 2:00 PM',
            },
          ].map((item) => (
            <div key={item.key} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-zinc-300">{item.label}</span>
              </div>
              <input
                type="text"
                required
                value={formData[item.key]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [item.key]: e.target.value }))
                }
                placeholder={item.placeholder}
                className="w-full bg-zinc-900/90 border border-zinc-800/90 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          ))}
        </div>

        {/* Reflection / Nightly Notes */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono mb-1">
            Evening Retrospective & Notes (Optional)
          </label>
          <textarea
            rows={3}
            value={formData.reflection}
            onChange={(e) => setFormData((prev) => ({ ...prev, reflection: e.target.value }))}
            placeholder="Key insights, mindset shifts, or tactical adjustments for the next 24 hours..."
            className="w-full bg-zinc-900/90 border border-zinc-800/90 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
          />
        </div>

        {/* Feedback Alerts */}
        {submitSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Day {currentDay} review saved successfully to Supabase daily_logs!</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Day {currentDay} Review to Supabase...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Day {currentDay} Daily Review (10 PM Lock-In)</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}

