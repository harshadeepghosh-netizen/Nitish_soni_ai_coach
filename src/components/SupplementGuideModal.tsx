import React, { useState } from 'react';
import { X, Pill, ShieldAlert, CheckCircle, Leaf, Sparkles, AlertTriangle } from 'lucide-react';

interface SupplementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (prompt: string) => void;
}

export const SupplementGuideModal: React.FC<SupplementGuideModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [activeTab, setActiveTab] = useState<'modern' | 'ayurveda' | 'brands' | 'steroids'>('modern');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-red-900/60 rounded-2xl shadow-2xl p-6 text-zinc-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-950 border border-red-700/60 text-red-400">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-mono uppercase text-zinc-100">
                Supplements, Ayurveda & Steroid Truth
              </h3>
              <p className="text-xs text-zinc-400">Nitish Soni's Honest Guidance & Trusted Brands</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto space-x-2 border-b border-zinc-800 pb-2 mb-4">
          <button
            onClick={() => setActiveTab('modern')}
            className={`px-3 py-2 rounded-lg text-xs font-mono uppercase font-bold shrink-0 transition ${
              activeTab === 'modern' ? 'bg-red-950 text-red-300 border border-red-600' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            🏋️ Modern Science
          </button>

          <button
            onClick={() => setActiveTab('ayurveda')}
            className={`px-3 py-2 rounded-lg text-xs font-mono uppercase font-bold shrink-0 transition ${
              activeTab === 'ayurveda' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            🌿 Ayurveda & Herbs
          </button>

          <button
            onClick={() => setActiveTab('brands')}
            className={`px-3 py-2 rounded-lg text-xs font-mono uppercase font-bold shrink-0 transition ${
              activeTab === 'brands' ? 'bg-blue-950 text-blue-300 border border-blue-600' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            🏷️ Trusted Brands
          </button>

          <button
            onClick={() => setActiveTab('steroids')}
            className={`px-3 py-2 rounded-lg text-xs font-mono uppercase font-bold shrink-0 transition ${
              activeTab === 'steroids' ? 'bg-amber-950 text-amber-300 border border-amber-600' : 'bg-zinc-900 text-zinc-400'
            }`}
          >
            ⚠️ Steroids & SARMs Truth
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4 text-xs">
          {activeTab === 'modern' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800">
                <h4 className="font-bold text-red-400 uppercase font-mono mb-1">Whey & Plant Protein</h4>
                <p className="text-zinc-300 leading-relaxed">
                  "Think of protein powder as convenient food—pure bricks to rebuild torn muscle fibers post-workout."
                </p>
                <span className="text-[10px] text-zinc-500 font-mono block mt-1">Dose: 1-2 scoops/day after training.</span>
              </div>

              <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800">
                <h4 className="font-bold text-red-400 uppercase font-mono mb-1">Creatine Monohydrate</h4>
                <p className="text-zinc-300 leading-relaxed">
                  "The gold standard for ATP energy replenishment, power output, and muscle cell hydration."
                </p>
                <span className="text-[10px] text-zinc-500 font-mono block mt-1">Dose: 3-5g daily with plenty of water.</span>
              </div>

              <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800">
                <h4 className="font-bold text-red-400 uppercase font-mono mb-1">L-Carnitine</h4>
                <p className="text-zinc-300 leading-relaxed">
                  "Helps transport long-chain fatty acids into mitochondria to be burned for energy during LISS cardio."
                </p>
              </div>

              <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800">
                <h4 className="font-bold text-red-400 uppercase font-mono mb-1">Pre-Workout (Caution!)</h4>
                <p className="text-zinc-300 leading-relaxed">
                  "Useful for mental focus, but watch out for high caffeine tolerance and jitters. Never abuse pre-workouts."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ayurveda' && (
            <div className="bg-zinc-900 p-4 rounded-xl border border-emerald-900/40 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold uppercase text-sm">
                <Leaf className="w-5 h-5" />
                <span>Ayurveda = Internal Factory Maintenance</span>
              </div>

              <p className="text-zinc-300 leading-relaxed">
                "Modern supplements provide the raw materials (bricks and cement), while Ayurveda acts as the maintenance crew keeping your endocrine system, digestion, and stress in check."
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <h5 className="font-bold text-emerald-400 font-mono">Ashwagandha (KSM-66)</h5>
                  <p className="text-zinc-300 text-[11px] mt-1">
                    Reduces cortisol (stress hormone), improves sleep quality, and supports natural testosterone levels.
                  </p>
                </div>

                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <h5 className="font-bold text-emerald-400 font-mono">Shilajit (Purified Resin)</h5>
                  <p className="text-zinc-300 text-[11px] mt-1">
                    Rich in fulvic acid and 84+ trace minerals, boosting cellular vitality and nutrient absorption.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="space-y-3">
              <p className="text-zinc-400 font-mono">Nitish Soni's Recommended Lab-Tested Brands:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="font-bold font-mono text-zinc-100 uppercase block">Optimum Nutrition (ON)</span>
                  <p className="text-zinc-400 text-[11px]">Gold Standard Gold Standard Whey & Creatine. Globally trusted purity.</p>
                </div>

                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="font-bold font-mono text-zinc-100 uppercase block">Avvatar Protein</span>
                  <p className="text-zinc-400 text-[11px]">100% fresh cow's milk whey processed within 24 hours in India.</p>
                </div>

                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="font-bold font-mono text-zinc-100 uppercase block">MuscleBlaze</span>
                  <p className="text-zinc-400 text-[11px]">NABL lab-certified Biozyme whey with high absorption rates.</p>
                </div>

                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                  <span className="font-bold font-mono text-zinc-100 uppercase block">MuscleTech</span>
                  <p className="text-zinc-400 text-[11px]">Ultra-pure Platinum Creatine Monohydrate & Nitro-Tech series.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'steroids' && (
            <div className="bg-amber-950/30 border border-amber-600/50 p-4 rounded-xl space-y-3 text-amber-200">
              <div className="flex items-center space-x-2 font-mono font-bold uppercase text-amber-400 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>The Unfiltered Steroid & SARMs Truth</span>
              </div>

              <p className="leading-relaxed text-[11px]">
                "My friend, as a 15-year master trainer, I speak plain truth: Anabolic steroids, SARMs, and unprescribed peptides shutdown your natural HPTA axis, strain your liver, elevate hematocrit/LDL, and jeopardize your cardiovascular health."
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-zinc-950 p-2 rounded border border-amber-900/80 text-amber-300">
                  🚫 HPTA Shutdown & Infertility
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-amber-900/80 text-amber-300">
                  🚫 High Blood Pressure & Heart Damage
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-amber-900/80 text-amber-300">
                  🚫 Severe Liver Toxicity (Oral C-17 aa)
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-amber-900/80 text-amber-300">
                  🏆 Natural Longevity & Real Iron Pride
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Ask Button */}
        <div className="mt-5 pt-3 border-t border-zinc-800">
          <button
            onClick={() => {
              onSendToChat('Nitish sir, what is your opinion on combining Whey Protein with Ashwagandha and Creatine? Which brand should I buy?');
              onClose();
            }}
            className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 border border-red-800 text-red-400 text-xs font-mono font-bold uppercase rounded-xl flex items-center justify-center space-x-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ask Nitish for Personal Brand & Supplement Advice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
