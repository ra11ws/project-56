'use client';

import React, { useState } from 'react';
import { PhaseGoal } from '@/lib/supabase';
import { PHASE_METADATA } from '@/lib/defaults';
import {
  CheckSquare,
  Square,
  Plus,
  Filter,
  Sparkles,
  CheckCircle,
  Clock,
  ListTodo,
  Loader2,
} from 'lucide-react';

interface Props {
  phase: number;
  goals: PhaseGoal[];
  onToggleGoal: (goalId: string, currentStatus: boolean) => Promise<void>;
  onAddGoal: (phase: number, title: string) => Promise<void>;
  isLoading: boolean;
}

export function PhaseGoals({ phase, goals, onToggleGoal, onAddGoal, isLoading }: Props) {
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const phaseMeta = PHASE_METADATA.find((p) => p.phase === phase) || PHASE_METADATA[0];

  const filteredGoals = goals.filter((g) => {
    if (filter === 'completed') return g.completed;
    if (filter === 'pending') return !g.completed;
    return true;
  });

  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAddGoal(phase, newGoalTitle.trim());
      setNewGoalTitle('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (goalId: string, currentStatus: boolean) => {
    if (togglingId) return;
    try {
      setTogglingId(goalId);
      await onToggleGoal(goalId, currentStatus);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <section className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col h-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-800/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ListTodo className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Phase {phase} Non-Negotiable Directives
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            {phaseMeta.focus}
          </p>
        </div>

        {/* Progress Pill & Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">{completedCount}/{totalCount}</span>
            <span>({progressPercent}%)</span>
          </div>

          <div className="flex items-center bg-zinc-900/90 rounded-lg p-0.5 border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filter === 'all' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filter === 'pending' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filter === 'completed' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Mini Progress Bar for Active Phase */}
      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden my-4">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Goal Items List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[460px] custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-400 mb-2" />
            <span className="text-xs font-mono">Syncing phase goals with Supabase...</span>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            <Clock className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
            <p className="text-sm font-medium">No goals found for this filter.</p>
            <p className="text-xs text-zinc-600 mt-1">Add a custom directive below to lock it in.</p>
          </div>
        ) : (
          filteredGoals.map((goal, idx) => {
            const isToggling = togglingId === goal.id;
            return (
              <div
                key={goal.id}
                onClick={() => handleToggle(goal.id, goal.completed)}
                className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  goal.completed
                    ? 'bg-zinc-900/30 border-zinc-900 text-zinc-500 opacity-80 hover:opacity-100 hover:border-zinc-800'
                    : 'bg-zinc-900/60 border-zinc-800/90 text-zinc-200 hover:bg-zinc-900 hover:border-zinc-700 hover:shadow-md'
                }`}
              >
                <button
                  type="button"
                  aria-label={goal.completed ? 'Mark uncompleted' : 'Mark completed'}
                  className="mt-0.5 text-zinc-400 group-hover:text-emerald-400 transition-colors flex-shrink-0"
                  disabled={isToggling}
                >
                  {isToggling ? (
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                  ) : goal.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 text-sm font-medium leading-relaxed">
                  <span className={goal.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}>
                    {goal.title}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-zinc-600 opacity-60 group-hover:opacity-100 transition-opacity">
                  #{idx + 1}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Custom Directive / Goal */}
      <form onSubmit={handleAddSubmit} className="mt-4 pt-4 border-t border-zinc-800/70 flex gap-2">
        <input
          type="text"
          value={newGoalTitle}
          onChange={(e) => setNewGoalTitle(e.target.value)}
          placeholder={`Add new directive for Phase ${phase}...`}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!newGoalTitle.trim() || isSubmitting}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/40"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>Add</span>
        </button>
      </form>
    </section>
  );
}

