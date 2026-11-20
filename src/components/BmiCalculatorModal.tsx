import React, { useState } from 'react';
import { X, Calculator, Scale, Activity, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { BmiData } from '../types';

interface BmiCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (bmiText: string) => void;
  userProfile: any;
}

export const BmiCalculatorModal: React.FC<BmiCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
  userProfile,
}) => {
  const [heightCm, setHeightCm] = useState<number>(userProfile.heightCm || 175);
  const [weightKg, setWeightKg] = useState<number>(userProfile.weightKg || 80);
  const [bmiResult, setBmiResult] = useState<BmiData | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/calculate-bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heightCm, weightKg, experienceLevel: userProfile.experienceLevel }),
      });
      const data = await res.json();
      if (res.ok) {
        setBmiResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareWithNitish = () => {
    if (!bmiResult) return;
    const msg = `Nitish sir, my height is ${bmiResult.heightCm}cm and weight is ${bmiResult.weightKg}kg. My calculated BMI is ${bmiResult.bmi} (${bmiResult.category}). Please suggest my calorie target and routine!`;
    onSendToChat(msg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-red-900/60 rounded-2xl shadow-2xl p-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-red-950 border border-red-700/60 text-red-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-mono uppercase text-zinc-100">
                BMI & Macro Target Calculator
              </h3>
              <p className="text-xs text-zinc-400">Nitish Soni's Body Mass Analysis</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-400 uppercase mb-1">
                Height (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-red-600"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-zinc-500">cm</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-zinc-400 uppercase mb-1">
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:border-red-600"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-zinc-500">kg</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:to-red-800 text-zinc-100 font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-red-950/50 flex items-center justify-center space-x-2 transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
            <span>Calculate BMI with Nitish</span>
          </button>
        </form>

        {/* Result Card */}
        {bmiResult && (
          <div className="mt-5 p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div>
                <span className="text-xs text-zinc-400 font-mono">YOUR BMI:</span>
                <span className="text-2xl font-black font-mono text-red-500 ml-2">{bmiResult.bmi}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  bmiResult.category === 'Normal'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : bmiResult.category === 'Underweight'
                    ? 'bg-blue-950 text-blue-400 border border-blue-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {bmiResult.category}
              </span>
            </div>

            <div className="text-xs text-zinc-300 leading-relaxed font-sans bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
              <span className="text-red-400 font-mono font-bold block mb-1">Nitish Soni's Advice:</span>
              "{bmiResult.advice}"
            </div>

            <button
              onClick={handleShareWithNitish}
              className="w-full py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-red-900/50 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Nitish for Customized Workout & Diet Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
