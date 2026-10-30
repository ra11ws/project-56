'use client';

import React from 'react';
import { PHASE_METADATA } from '@/lib/defaults';
import { Calendar, Target, Flame, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  currentDay: number;
  totalDays: number;
  currentPhase: number;
  selectedPhase: number;
  onSelectPhase: (phase: number) => void;
  phaseGoalsStats: Record<number, { total: number; completed: number }>;
}

export function PhaseHeader({
  currentDay,
  totalDays,
  currentPhase,
  selectedPhase,
  onSelectPhase,
  phaseGoalsStats,
}: Props) {
  const percentComplete = Math.min(100, Math.round((currentDay / totalDays) * 100));
  const daysRemaining = Math.max(0, totalDays - currentDay);

  return (
    <header className="w-full bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Title & High-level Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/70">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-400" />
              Monk Mode Lock-In Active
            </span>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              Oct 30, 2026 – Dec 24, 2026
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
            PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">56</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            4 Phases × 14 Days of Uncompromising Deep Execution & Cognitive Restructuring.
          </p>
        </div>

        {/* Counter Display Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3 min-w-[130px] text-center shadow-inner">
            <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Timeline</div>
            <div className="text-2xl font-black text-white tracking-tight mt-0.5">
              Day {currentDay} <span className="text-sm font-semibold text-zinc-400">/ {totalDays}</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
              {percentComplete}% Completed
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-3 min-w-[130px] text-center shadow-inner">
            <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Countdown</div>
            <div className="text-2xl font-black text-cyan-400 tracking-tight mt-0.5">
              {daysRemaining} <span className="text-sm font-semibold text-zinc-400">Days</span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
              Ends Dec 24, 2026
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="my-5">
        <div className="flex justify-between text-xs text-zinc-400 mb-1.5 font-mono">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            56-Day Lock-in Velocity
          </span>
          <span>
            Phase {currentPhase} Active • {daysRemaining} days until release
          </span>
        </div>
        <div className="w-full bg-zinc-900/80 rounded-full h-2.5 overflow-hidden border border-zinc-800">
          <div
            className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 h-2.5 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            style={{ width: `${Math.max(2, percentComplete)}%` }}
          />
        </div>
      </div>

      {/* Phase Navigation Tab Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {PHASE_METADATA.map((phase) => {
          const isSelected = selectedPhase === phase.phase;
          const isCurrent = currentPhase === phase.phase;
          const isPast = currentPhase > phase.phase;
          const stats = phaseGoalsStats[phase.phase] || { total: 0, completed: 0 };
          const phasePercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

          return (
            <button
              key={phase.phase}
              type="button"
              onClick={() => onSelectPhase(phase.phase)}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-zinc-600 shadow-lg shadow-cyan-500/5 ring-1 ring-emerald-500/50'
                  : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/80 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      Phase {phase.phase}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                        Current
                      </span>
                    )}
                    {isPast && (
                      <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">{phase.days}</span>
                </div>

                <div className="font-semibold text-sm text-zinc-100 group-hover:text-white transition-colors">
                  {phase.name}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                  {phase.dateRange}
                </div>
              </div>

              {/* Phase mini goal stats */}
              <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 font-mono">
                  {stats.completed}/{stats.total} Goals
                </span>
                <span
                  className={`font-semibold font-mono ${
                    phasePercent === 100 ? 'text-emerald-400' : 'text-zinc-400'
                  }`}
                >
                  {phasePercent}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </header>
  );
}

