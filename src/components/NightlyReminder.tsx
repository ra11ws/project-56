'use client';

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff, Sparkles, Check, AlertTriangle, Clock } from 'lucide-react';

export function NightlyReminder() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [timeUntil10PM, setTimeUntil10PM] = useState<string>('');
  const [testSent, setTestSent] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setIsSupported(false);
    }

    const calculateCountdown = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(22, 0, 0, 0); // 10:00 PM

      // If it's already past 10 PM today, calculate for 10 PM tomorrow
      if (now.getTime() > target.getTime()) {
        target.setDate(target.getDate() + 1);
      }

      const diffMs = target.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntil10PM(
        `${String(diffHrs).padStart(2, '0')}h ${String(diffMins).padStart(2, '0')}m ${String(diffSecs).padStart(2, '0')}s`
      );

      // Check if exact minute matches 22:00:00 and trigger notification
      if (
        now.getHours() === 22 &&
        now.getMinutes() === 0 &&
        now.getSeconds() === 0 &&
        Notification.permission === 'granted'
      ) {
        new Notification('🚨 PROJECT 56 — 10 PM DAILY REVIEW LOCK-IN', {
          body: "It's 10:00 PM. Cease all work and complete your 5 daily growth items now.",
          icon: '/favicon.ico',
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser notifications are not supported in this browser.');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification('✅ Project 56 Reminder Active', {
          body: 'Browser notifications configured! You will receive daily alerts at 10:00 PM sharp.',
          icon: '/favicon.ico',
        });
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
  };

  const triggerTestNotification = () => {
    if (permission !== 'granted') {
      requestPermission();
      return;
    }

    new Notification('🔔 [TEST] Project 56 — 10 PM Review Alert', {
      body: 'Lock-in check! Your 10:00 PM daily reflection reminder is armed and active.',
      icon: '/favicon.ico',
    });

    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Info */}
        <div className="flex items-center gap-3.5">
          <div
            className={`p-2.5 rounded-xl border ${
              permission === 'granted'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            {permission === 'granted' ? (
              <BellRing className="w-5 h-5 animate-pulse" />
            ) : permission === 'denied' ? (
              <BellOff className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Nightly 10:00 PM Lock-In Reminder
              </h3>
              {permission === 'granted' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Armed & Ready
                </span>
              ) : permission === 'denied' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Blocked in Browser
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Permission Required
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Next trigger in:</span>
              <span className="text-cyan-400 font-bold">{timeUntil10PM || 'Calculating...'}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {permission !== 'granted' ? (
            <button
              type="button"
              onClick={requestPermission}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-950/40 transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Browser Notification</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={triggerTestNotification}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              {testSent ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Notification Sent!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Send Test 10 PM Ping</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

