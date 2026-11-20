import React, { useState } from 'react';
import { Target, Flame, Mountain, Trophy, ChevronDown, ChevronUp, Sparkles, AlertTriangle } from 'lucide-react';
import { HeavyDumbbellIcon, OlympicPlateIcon, KettlebellIcon, GymRackDecorativePattern } from './GymDecorations';

interface BiggerMottoBannerProps {
  onQuickPrompt: (prompt: string) => void;
  openModal: (modal: 'bmi' | 'plan' | 'supplements' | 'beginner' | 'profile') => void;
  experienceLevel: string;
}

export const BiggerMottoBanner: React.FC<BiggerMottoBannerProps> = ({
  onQuickPrompt,
  openModal,
  experienceLevel,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="relative mb-6 rounded-2xl overflow-hidden border border-red-900/50 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black shadow-2xl">
      {/* Background Glow & Gym Decorative Visuals */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/40 via-zinc-950/80 to-black pointer-events-none" />
      <GymRackDecorativePattern />

      <div className="absolute top-4 right-6 opacity-15 pointer-events-none font-mono text-9xl font-black text-red-600 select-none">
        IRON
      </div>

      <div className="relative p-5 sm:p-7 z-10">
        {/* Banner Top Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            {/* Neon DO WORK Sign Badge */}
            <span className="px-3 py-1 rounded bg-red-600/20 border border-red-500 text-red-400 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
              DO WORK
            </span>
            <span className="text-zinc-400 text-xs font-mono uppercase tracking-wider hidden sm:inline">
              • NITISH SONI'S IRON GYM CODE
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-400 hover:text-zinc-200 text-xs font-medium flex items-center space-x-1 bg-zinc-900/80 hover:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-800 transition"
          >
            <span>{isExpanded ? 'Collapse Gym Wall' : 'Expand Motto Wall'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* High-Impact Gym Motto Wall with Dumbbell & Weight Plate Flanks */}
        {isExpanded && (
          <div className="relative my-4 text-center py-6 px-2 sm:px-6 rounded-xl bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md overflow-hidden">
            {/* Left & Right Decorative Flanking Equipment */}
            <div className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 flex-col items-center space-y-3 opacity-80">
              <HeavyDumbbellIcon size={56} className="filter drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
              <OlympicPlateIcon size={64} className="filter drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
            </div>

            <div className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col items-center space-y-3 opacity-80">
              <OlympicPlateIcon size={64} className="filter drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
              <HeavyDumbbellIcon size={56} className="filter drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
            </div>

            {/* Center Motto Typography */}
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-zinc-400 uppercase font-mono mb-1">
              THE
            </p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-100 font-mono uppercase drop-shadow-md">
              PAIN <span className="text-zinc-400 font-normal">YOU FEEL</span>
            </h2>
            <h2 className="text-4xl sm:text-6xl font-black tracking-wider text-red-500 font-mono uppercase my-1 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
              TODAY
            </h2>

            {/* Dumbbell Icon Divider */}
            <div className="flex items-center justify-center space-x-3 my-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
              <HeavyDumbbellIcon size={28} className="filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
            </div>

            <p className="text-xs sm:text-sm font-semibold tracking-widest text-zinc-300 uppercase font-mono my-1">
              — WILL BE THE —
            </p>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-100 font-mono uppercase">
              STRENGTH <span className="text-zinc-400 font-normal">YOU FEEL</span>
            </h3>
            <h3 className="text-4xl sm:text-6xl font-black tracking-wider text-red-500 font-mono uppercase mt-1 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
              TOMORROW
            </h3>

            {/* Beginner Alert Banner if user is beginner */}
            {experienceLevel === 'Beginner' && (
              <div className="mt-5 max-w-xl mx-auto bg-amber-950/40 border border-amber-600/50 rounded-lg p-3 text-left flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase font-mono">
                    BEGINNER PROTECTION RULE ACTIVE 🛡️
                  </h4>
                  <p className="text-xs text-amber-200/90 leading-relaxed mt-0.5">
                    "My friend, as a beginner, Nitish Soni will NOT allow complex 1-rep max deadlifts or kipping pull-ups.
                    We build foundation first on machines and dumbbell basics!"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4 Pillars Bottom Bar (Focus, Strength, Persistence, Success) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-zinc-800/80">
          <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-red-900/50 transition">
            <div className="p-2 rounded-md bg-red-950/80 border border-red-700/50 text-red-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-zinc-100 uppercase">FOCUS</div>
              <div className="text-[10px] text-zinc-400 leading-tight">Set mind on goal</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-red-900/50 transition">
            <div className="p-2 rounded-md bg-red-950/80 border border-red-700/50 text-red-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-zinc-100 uppercase">STRENGTH</div>
              <div className="text-[10px] text-zinc-400 leading-tight">Build body & life</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-red-900/50 transition">
            <div className="p-2 rounded-md bg-red-950/80 border border-red-700/50 text-red-400">
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-zinc-100 uppercase">PERSISTENCE</div>
              <div className="text-[10px] text-zinc-400 leading-tight">Don't stop until proud</div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-red-900/50 transition">
            <div className="p-2 rounded-md bg-red-950/80 border border-red-700/50 text-red-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-zinc-100 uppercase">SUCCESS</div>
              <div className="text-[10px] text-zinc-400 leading-tight">Daily discipline result</div>
            </div>
          </div>
        </div>

        {/* Quick Modal Launcher Toolbar */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            Nitish's Master Tools:
          </span>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => openModal('bmi')}
              className="bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-600 text-zinc-200 px-2.5 py-1 rounded font-medium transition"
              id="quick-bmi-tool"
            >
              📊 BMI Calculator
            </button>
            <button
              onClick={() => openModal('plan')}
              className="bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-600 text-zinc-200 px-2.5 py-1 rounded font-medium transition"
              id="quick-plan-tool"
            >
              🗓️ 7-Day Workout & Diet Plan
            </button>
            <button
              onClick={() => openModal('supplements')}
              className="bg-zinc-900 hover:bg-red-950/80 border border-zinc-700 hover:border-red-600 text-zinc-200 px-2.5 py-1 rounded font-medium transition"
              id="quick-supplements-tool"
            >
              💊 Supplements & Brands
            </button>
            <button
              onClick={() => openModal('beginner')}
              className="bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/80 text-amber-200 px-2.5 py-1 rounded font-medium transition"
              id="quick-beginner-shield-tool"
            >
              🛡️ Beginner Safety Shield
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
