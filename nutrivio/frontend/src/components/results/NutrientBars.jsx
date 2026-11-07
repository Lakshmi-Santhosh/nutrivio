// frontend/src/components/results/NutrientBars.jsx
import { NUTRIENT_LIMITS } from '../../utils/constants';

function NutrientBar({ label, icon, value, max, unit }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#10b981';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1.5">
          <span>{icon}</span>
          <span>{label}</span>
        </span>
        <span className="text-slate-300 font-medium tabular-nums">
          {value}{unit}
          <span className="text-slate-600 ml-1">/ {max}{unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function NutrientBars({ nutrients }) {
  if (!nutrients) return null;

  return (
    <div className="space-y-3.5">
      {Object.entries(NUTRIENT_LIMITS).map(([key, meta]) => {
        const val = nutrients[key];
        if (val == null || val === 0) return null;
        return (
          <NutrientBar
            key={key}
            label={meta.label}
            icon={meta.icon}
            value={val}
            max={meta.max}
            unit={meta.unit}
          />
        );
      })}
    </div>
  );
}
