import React, { useState } from 'react';
import { X, User, Scale, Activity, Utensils, Save, ShieldAlert } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  setUserProfile,
}) => {
  const [name, setName] = useState(userProfile.name || '');
  const [experienceLevel, setExperienceLevel] = useState(userProfile.experienceLevel || 'Beginner');
  const [heightCm, setHeightCm] = useState(userProfile.heightCm || 175);
  const [weightKg, setWeightKg] = useState(userProfile.weightKg || 80);
  const [dietPreference, setDietPreference] = useState(userProfile.dietPreference || 'Non-Vegetarian');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name: name.trim() || 'Champion',
      experienceLevel,
      heightCm: Number(heightCm) || 175,
      weightKg: Number(weightKg) || 80,
      dietPreference,
      isProfileSaved: true,
    };
    setUserProfile(updated);
    try {
      localStorage.setItem('nitish_user_profile', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save user profile:', err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-zinc-950 border border-red-700/80 rounded-2xl shadow-2xl p-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-red-950 border border-red-700/60 text-red-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-mono uppercase text-zinc-100">
                Champion Profile & Stats
              </h3>
              <p className="text-xs text-zinc-400">Set stats so Nitish Soni tailors advice</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Setup Banner */}
        {!userProfile.isProfileSaved && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/90 border border-red-600 text-red-200 text-xs flex items-start space-x-2.5 shadow-lg animate-pulse">
            <ShieldAlert className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-yellow-300 block uppercase font-mono mb-0.5">
                🚨 Mandatory Initial Setup
              </span>
              <span>
                Please enter your details below and click Save before asking Nitish Soni for workout routines, calorie targets, or diet advice.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono text-zinc-400 uppercase mb-1">Your Name / Alias</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Champion"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block font-mono text-zinc-400 uppercase mb-1">Gym Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-red-600"
            >
              <option value="Beginner">Beginner (0-1 Yrs) — Protected Status 🛡️</option>
              <option value="Intermediate">Intermediate (1-3 Yrs)</option>
              <option value="Advanced">Advanced (3+ Yrs)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-zinc-400 uppercase mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block font-mono text-zinc-400 uppercase mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-zinc-400 uppercase mb-1">Dietary Preference</label>
            <select
              value={dietPreference}
              onChange={(e) => setDietPreference(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-red-600"
            >
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegetarian">Pure Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-zinc-100 font-bold font-mono text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Update Nitish Soni</span>
          </button>
        </form>
      </div>
    </div>
  );
};
