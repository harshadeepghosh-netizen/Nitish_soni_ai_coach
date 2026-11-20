import React from 'react';
import { X, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface BeginnerShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (prompt: string) => void;
}

export const BeginnerShieldModal: React.FC<BeginnerShieldModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-amber-600/60 rounded-2xl shadow-2xl p-6 text-zinc-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-950 border border-amber-700/60 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-mono uppercase text-zinc-100">
                Beginner Protection Protocol 🛡️
              </h3>
              <p className="text-xs text-zinc-400">Nitish Soni's Iron Safety Code</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rule Explanation */}
        <div className="bg-amber-950/30 border border-amber-700/50 p-4 rounded-xl mb-4 space-y-2 text-xs text-amber-200">
          <h4 className="font-mono font-bold uppercase text-amber-300 text-sm">
            Nitish's Golden Rule for Beginners:
          </h4>
          <p className="leading-relaxed">
            "If you are in your first 6-12 months of lifting, your joint connective tissues, CNS motor patterns, and core stabilization muscles are still adapting. I strictly refuse to recommend dangerous ego-lifts that cause spinal herniation or rotator cuff tears!"
          </p>
        </div>

        {/* Safe vs Dangerous Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Approved Safe Movements */}
          <div className="bg-zinc-900 border border-emerald-900/50 p-4 rounded-xl space-y-2">
            <h5 className="font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
              <CheckCircle2 className="w-4 h-4" />
              APPROVED BEGINNER EXERCISES
            </h5>

            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <div>
                  <strong className="text-zinc-100">Leg Press & Goblet Squat:</strong> Protects lumbar spine while building quad strength.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <div>
                  <strong className="text-zinc-100">Lat Pulldowns & Seated Cable Rows:</strong> Teaches lat engagement safely without shoulder impingement.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <div>
                  <strong className="text-zinc-100">Chest Press Machine & Dumbbell Bench:</strong> Isolates pecs with stable paths.
                </div>
              </li>
            </ul>
          </div>

          {/* Dangerous Prohibited Movements */}
          <div className="bg-zinc-900 border border-red-900/50 p-4 rounded-xl space-y-2">
            <h5 className="font-mono font-bold uppercase text-red-400 flex items-center gap-1.5 border-b border-zinc-800 pb-2">
              <XCircle className="w-4 h-4" />
              PROHIBITED FOR BEGINNERS
            </h5>

            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <div>
                  <strong className="text-zinc-100">1-Rep Max Heavy Barbell Deadlifts:</strong> High risk of lumbar flexion rounding.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <div>
                  <strong className="text-zinc-100">Kipping Pull-ups:</strong> Uncontrolled momentum damages shoulder labrum.
                </div>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-400 font-bold">•</span>
                <div>
                  <strong className="text-zinc-100">Behind-The-Neck Presses:</strong> Places extreme shear force on rotator cuffs.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3 border-t border-zinc-800">
          <button
            onClick={() => {
              onSendToChat('Nitish sir, I am a beginner. Can you check my workout routine and replace any exercise that is unsafe for my joints?');
              onClose();
            }}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-amber-600/60 text-amber-300 text-xs font-mono font-bold uppercase rounded-xl flex items-center justify-center space-x-2 transition"
          >
            <span>Ask Nitish to Audit My Beginner Routine</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
