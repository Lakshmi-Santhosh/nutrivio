// frontend/src/components/ui/LoadingSpinner.jsx
import { useState, useEffect } from 'react';

const STEPS = [
  { label: 'Detecting ingredients', icon: '🔍' },
  { label: 'Understanding composition', icon: '🧪' },
  { label: 'Calculating health impact', icon: '📊' },
  { label: 'Generating recommendations', icon: '✨' },
];

export default function LoadingSpinner({ step = 0 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const targets = [25, 55, 82, 100];
    const target = targets[Math.min(step, targets.length - 1)];
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= target) { clearInterval(timer); return target; }
        return p + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [step]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="page-enter flex flex-col items-center justify-center py-10 sm:py-16 px-6">
      {/* Title */}
      <h2 className="font-display font-bold text-xl text-white mb-2">Analyzing Ingredients</h2>
      <p className="text-slate-400 text-sm mb-8 text-center">
        Our AI is reading and analyzing the ingredients...
      </p>

      {/* Circular progress */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-8">
        {/* Glow */}
        <div className="absolute inset-4 rounded-full bg-brand-500/10 blur-xl" />

        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* Fill */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-4xl text-brand-400">{progress}%</span>
        </div>
      </div>

      {/* Steps checklist */}
      <div className="w-full max-w-xs space-y-3">
        {STEPS.map((s, i) => {
          const isDone = step > i || (step === i && progress >= [25, 55, 82, 100][i]);
          const isCurrent = step === i && !isDone;

          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                isDone
                  ? 'bg-brand-500'
                  : isCurrent
                    ? 'border-2 border-brand-400 animate-pulse-soft'
                    : 'border border-slate-700'
              }`}>
                {isDone && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <span className={`text-sm transition-colors duration-300 ${
                isDone ? 'text-brand-400' : isCurrent ? 'text-slate-200' : 'text-slate-600'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
