// frontend/src/components/results/HealthScoreRing.jsx
import { getScoreCategory } from '../../utils/constants';

export default function HealthScoreRing({ score, size = 'large' }) {
  const cat = getScoreCategory(score);
  const score10 = Math.round(score / 10);
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const isLarge = size === 'large';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${isLarge ? 'w-40 h-40 sm:w-48 sm:h-48' : 'w-32 h-32'}`}>
        {/* Glow */}
        <div
          className="absolute inset-4 rounded-full blur-xl opacity-25"
          style={{ background: cat.color }}
        />

        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Fill */}
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={cat.color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-0.5">
            <span className={`font-display font-bold text-white leading-none ${isLarge ? 'text-5xl' : 'text-3xl'}`}>
              {score10}
            </span>
            <span className={`text-slate-400 font-medium ${isLarge ? 'text-lg' : 'text-sm'}`}>/10</span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold"
        style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.color}30` }}
      >
        <span>{cat.emoji}</span>
        <span>{cat.label}</span>
      </div>
    </div>
  );
}
