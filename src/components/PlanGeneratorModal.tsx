import React, { useState } from 'react';
import { X, Calendar, Dumbbell, Utensils, Droplets, CheckCircle2, Shield, Loader2, Sparkles } from 'lucide-react';
import { PlanData } from '../types';

interface PlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  onSendToChat: (planPrompt: string) => void;
}

export const PlanGeneratorModal: React.FC<PlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSendToChat,
}) => {
  const [goal, setGoal] = useState('Fat Loss & Muscle Building');
  const [experienceLevel, setExperienceLevel] = useState(userProfile.experienceLevel || 'Beginner');
  const [dietPreference, setDietPreference] = useState(userProfile.dietPreference || 'Non-Vegetarian');
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          experienceLevel,
          dietPreference,
          heightCm: userProfile.heightCm,
          weightKg: userProfile.weightKg,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPlanData(data);
        setActiveDayIndex(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscussWithNitish = () => {
    if (!planData) return;
    const prompt = `Nitish sir, I generated a 7-Day Plan for ${planData.goal} (${planData.experienceLevel}, ${planData.dietPreference}). Target: ${planData.dailyCalorieTarget} kcal/day. Please review Day 1 (${planData.weeklySplit[0]?.focus}) and tell me form cues!`;
    onSendToChat(prompt);
    onClose();
  };

  const currentDay = planData?.weeklySplit[activeDayIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-red-900/60 rounded-2xl shadow-2xl p-6 text-zinc-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-950 border border-red-700/60 text-red-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-mono uppercase text-zinc-100">
                7-Day Workout Split & Calorie Diet Plan
              </h3>
              <p className="text-xs text-zinc-400">Tailored by Nitish Soni's 15-Year Gym Principles</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Generator Controls */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 bg-zinc-900/80 p-4 rounded-xl border border-zinc-800">
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-red-600"
            >
              <option value="Fat Loss & Muscle Building">Fat Loss & Muscle Recomp</option>
              <option value="Pure Hypertrophy">Hypertrophy (Muscle Mass)</option>
              <option value="Strength & Power">Strength & Power</option>
              <option value="Beginner Foundation & Mobility">Beginner Foundation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as any)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-red-600"
            >
              <option value="Beginner">Beginner (Protect Joints)</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced Veteran</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Diet</label>
            <select
              value={dietPreference}
              onChange={(e) => setDietPreference(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-red-600"
            >
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegetarian">Pure Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-zinc-100 font-bold font-mono text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-red-950/50 flex items-center justify-center space-x-1.5 transition"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{planData ? 'Re-Generate' : 'Generate Plan'}</span>
            </button>
          </div>
        </form>

        {/* Plan Display Tabs */}
        {planData && (
          <div className="space-y-4">
            {/* Macro Summary Header */}
            <div className="flex flex-wrap items-center justify-between bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs font-mono">
              <div>
                <span className="text-zinc-400 uppercase">Target Calories:</span>
                <span className="text-red-400 font-bold ml-2 text-sm">{planData.dailyCalorieTarget} kcal/day</span>
              </div>
              <div className="text-zinc-300">
                Level: <span className="text-amber-400 font-bold">{planData.experienceLevel}</span> | Diet: <span className="text-emerald-400 font-bold">{planData.dietPreference}</span>
              </div>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-thin">
              {planData.weeklySplit.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-3 py-2 rounded-lg text-xs font-mono uppercase font-bold shrink-0 transition border ${
                    activeDayIndex === idx
                      ? 'bg-red-950 text-red-300 border-red-600 shadow-lg shadow-red-900/30'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {day.day}: {day.focus}
                </button>
              ))}
            </div>

            {/* Current Day Details */}
            {currentDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Workout Split */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-red-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                    <Dumbbell className="w-4 h-4" />
                    Workout: {currentDay.focus}
                  </h4>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {currentDay.exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-200">{ex.name}</span>
                          <span className="text-red-400 font-mono font-semibold">
                            {ex.sets} sets × {ex.reps}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 italic">💡 {ex.keyTip}</p>
                        {ex.isBeginnerSafe && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
                            <Shield className="w-3 h-3" /> Beginner Safe
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diet Meals */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
                    <Utensils className="w-4 h-4" />
                    Meals & Hydration ({currentDay.waterLitres}L Water)
                  </h4>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {currentDay.meals.map((meal, mealIdx) => (
                      <div key={mealIdx} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300">
                            {meal.time} • {meal.name}
                          </span>
                          <span className="text-zinc-400 font-mono text-[11px]">
                            {meal.calories} kcal | {meal.proteinGrams}g Protein
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300">
                          {meal.items.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Discuss Button */}
            <button
              onClick={handleDiscussWithNitish}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-red-800 text-red-400 hover:text-red-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Discuss Form & Tips with Nitish Soni</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
