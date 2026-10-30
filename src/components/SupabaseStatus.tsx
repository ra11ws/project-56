'use client';

import React from 'react';
import { Database, ShieldCheck, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface Props {
  isConfigured: boolean;
  hasConnectionError: boolean;
  errorMessage?: string;
}

export function SupabaseStatus({ isConfigured, hasConnectionError, errorMessage }: Props) {
  if (isConfigured && !hasConnectionError) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
        <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
        <span>Supabase: Live Cloud Sync</span>
      </div>
    );
  }

  if (hasConnectionError) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono" title={errorMessage}>
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Supabase Sync Error (Using Local Storage)</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
      <Database className="w-3.5 h-3.5" />
      <span>Local Mode (Add keys to .env.local to enable cloud)</span>
    </div>
  );
}

