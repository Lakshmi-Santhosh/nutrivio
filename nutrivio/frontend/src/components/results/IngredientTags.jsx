// frontend/src/components/results/IngredientTags.jsx
import { useState } from 'react';

export default function IngredientTags({ ingredients = [], harmful = [] }) {
  const [expanded, setExpanded] = useState(false);
  const harmfulSet = new Set(harmful.map(h => h.toLowerCase()));
  const MAX_SHOW = 14;

  const displayed = expanded ? ingredients : ingredients.slice(0, MAX_SHOW);
  const hasMore = ingredients.length > MAX_SHOW;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {displayed.map((ing, i) => {
          const isHarmful = harmfulSet.has(ing.toLowerCase());
          return (
            <span
              key={i}
              className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                isHarmful
                  ? 'bg-red-500/10 text-red-400 border-red-500/25'
                  : 'bg-slate-800/80 text-slate-300 border-white/5'
              }`}
            >
              {isHarmful && <span className="mr-1">⚠</span>}
              {ing}
            </span>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-brand-400 hover:text-brand-300 font-medium"
        >
          {expanded ? '▲ Show less' : `▼ Show all ${ingredients.length} ingredients`}
        </button>
      )}

      {harmful.length > 0 && (
        <div className="flex items-center gap-2 pt-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs text-slate-500">Red = flagged ingredient</span>
        </div>
      )}
    </div>
  );
}
