import React from 'react';
import { ShieldCheck, Volume2, VolumeX, User, Sparkles, RefreshCw, Sliders } from 'lucide-react';
import { HeavyDumbbellIcon } from './GymDecorations';

interface HeaderProps {
  userProfile: {
    name: string;
    experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    heightCm: number;
    weightKg: number;
    dietPreference: string;
  };
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  openModal: (modal: 'bmi' | 'plan' | 'supplements' | 'beginner' | 'profile') => void;
  bgTheme: string;
  setBgTheme: (theme: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  setUserProfile,
  voiceEnabled,
  setVoiceEnabled,
  openModal,
  bgTheme,
  setBgTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-red-900/40 px-4 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Master Trainer Badge */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-black p-1 shadow-lg shadow-red-900/50 flex items-center justify-center border border-red-500/50">
              <HeavyDumbbellIcon size={28} className="filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-zinc-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-wider uppercase text-zinc-100 font-mono flex items-center gap-1.5">
                NITISH SONI
                <span className="text-xs px-2 py-0.5 rounded bg-red-950/80 border border-red-600/50 text-red-400 font-sans tracking-normal uppercase font-semibold">
                  15+ Yrs Master
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
              Old-School Iron Gym & Nutrition Guardian
            </p>
          </div>
        </div>

        {/* Control Badges & Quick Tools */}
        <div className="flex items-center flex-wrap gap-2">
          {/* User Profile Selector Pill */}
          <button
            onClick={() => openModal('profile')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
              !userProfile.isProfileSaved
                ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-900 border-2 border-yellow-400 text-white shadow-xl shadow-red-950/80 animate-pulse ring-2 ring-red-500/80 hover:brightness-110'
                : 'bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300'
            }`}
            id="user-profile-button"
            title={!userProfile.isProfileSaved ? 'Mandatory: Set up your Profile & Stats' : 'Update Champion Profile'}
          >
            <User className={`w-3.5 h-3.5 ${!userProfile.isProfileSaved ? 'text-yellow-300 animate-bounce' : 'text-red-500'}`} />
            <span className="font-mono flex items-center gap-1.5">
              {!userProfile.isProfileSaved ? (
                <>
                  <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider animate-pulse">
                    REQUIRED SETUP
                  </span>
                  <span className="hidden sm:inline font-bold">Give Details</span>
                </>
              ) : (
                <span>
                  {userProfile.name || 'Champion'} • {userProfile.experienceLevel} ({userProfile.weightKg}kg)
                </span>
              )}
            </span>
          </button>

          {/* Voice Toggle Button */}
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              voiceEnabled
                ? 'bg-red-950/80 border-red-600 text-red-300 shadow-lg shadow-red-900/30'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle Nitish Soni Speech Output"
            id="voice-toggle-button"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-red-400 animate-pulse" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            <span>Voice {voiceEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Gym Ambiance Selector */}
          <select
            value={bgTheme}
            onChange={(e) => setBgTheme(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-red-600"
            id="gym-theme-selector"
          >
            <option value="hardcore">🏋️ Gritty Hardcore Iron</option>
            <option value="chalk">🧱 Old-School Chalk & Brick</option>
            <option value="neon">⚡ DO WORK Industrial</option>
          </select>
        </div>
      </div>
    </header>
  );
};
