'use client';

import React, { useState, useEffect } from 'react';
import { ScheduleItem } from '@/lib/supabase';
import {
  Moon,
  Utensils,
  Zap,
  Dumbbell,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
} from 'lucide-react';

interface Props {
  schedule: ScheduleItem[];
  isLoading: boolean;
}

export function ScheduleSidebar({ schedule, isLoading }: Props) {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const getCategoryBadge = (category: ScheduleItem['category']) => {
    switch (category) {
      case 'sleep':
        return {
          icon: Moon,
          color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
          label: 'Sleep Recovery',
        };
      case 'meal':
        return {
          icon: Utensils,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          label: 'Nutrition Refuel',
        };
      case 'deep_focus':
        return {
          icon: Zap,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
          label: 'Deep Focus Block',
        };
      case 'workout':
        return {
          icon: Dumbbell,
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          label: 'Conditioning',
        };
      case 'review':
        return {
          icon: Sparkles,
          color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
          label: '10 PM Review',
        };
      default:
        return {
          icon: Clock,
          color: 'text-zinc-400 bg-zinc-800 border-zinc-700',
          label: 'Routine',
        };
    }
  };

  return (
    <aside className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/70 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Clock className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Base Schedule
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Non-negotiable monk mode operating rhythm
          </p>
        </div>

        {currentTimeStr && (
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 font-mono block">CURRENT TIME</span>
            <span className="text-xs font-mono font-bold text-cyan-400 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
              {currentTimeStr}
            </span>
          </div>
        )}
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-2">
          <div className="text-[10px] text-zinc-400 uppercase font-mono">Sleep</div>
          <div className="text-xs font-bold text-indigo-400 mt-0.5">7 Hours</div>
          <div className="text-[9px] text-zinc-500">11 PM - 6 AM</div>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-2">
          <div className="text-[10px] text-zinc-400 uppercase font-mono">Deep Work</div>
          <div className="text-xs font-bold text-emerald-400 mt-0.5">11 Hours</div>
          <div className="text-[9px] text-zinc-500">3 Hard Blocks</div>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-2">
          <div className="text-[10px] text-zinc-400 uppercase font-mono">Fuel & Body</div>
          <div className="text-xs font-bold text-amber-400 mt-0.5">2.5 Hours</div>
          <div className="text-[9px] text-zinc-500">2 Clean Meals</div>
        </div>
      </div>

      {/* Timeline Items */}
      <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[600px] custom-scrollbar">
        {schedule.map((item, index) => {
          const badge = getCategoryBadge(item.category);
          const Icon = badge.icon;
          const isSleep = item.category === 'sleep';
          const isDeepFocus = item.category === 'deep_focus';

          return (
            <div
              key={item.id || index}
              className={`p-3 rounded-xl border transition-all ${
                isDeepFocus
                  ? 'bg-zinc-900/80 border-emerald-500/20 hover:border-emerald-500/40'
                  : isSleep
                  ? 'bg-zinc-900/80 border-indigo-500/20 hover:border-indigo-500/40'
                  : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${badge.color}`}
                >
                  <Icon className="w-3 h-3" />
                  {badge.label}
                </span>

                <span className="text-xs font-mono font-medium text-zinc-300">
                  {item.time_start} – {item.time_end}
                </span>
              </div>

              <div className="text-sm font-semibold text-zinc-100 mt-1">
                {item.title}
              </div>

              {item.description && (
                <div className="text-xs text-zinc-400 mt-1 leading-snug">
                  {item.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

