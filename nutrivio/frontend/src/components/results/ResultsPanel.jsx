// frontend/src/components/results/ResultsPanel.jsx
import HealthScoreRing from './HealthScoreRing';
import NutrientBars    from './NutrientBars';
import IngredientTags  from './IngredientTags';
import WarningsList    from './WarningsList';
import AISummary       from './AISummary';
import Alternatives    from './Alternatives';

function Section({ title, icon, children }) {
  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

export default function ResultsPanel({ analysis, onReset }) {
  if (!analysis) return null;

  const {
    productName, brand, healthScore, shortVerdict, aiSummary,
    ingredients, harmfulIngredients, nutrients, warnings, alternatives,
    _productImageUrl,
  } = analysis;

  return (
    <div className="animate-slide-up space-y-4">
      {/* Header */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          {_productImageUrl && (
            <img
              src={_productImageUrl}
              alt={productName}
              className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-white text-base leading-snug truncate">
              {productName || 'Food Product'}
            </p>
            {brand && <p className="text-slate-500 text-xs mt-0.5">{brand}</p>}
          </div>
        </div>

        {/* Score */}
        <div className="mt-5 flex flex-col items-center">
          <HealthScoreRing score={healthScore ?? 0} />
        </div>

        {/* Verdict */}
        {shortVerdict && (
          <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <p className="text-slate-300 text-sm text-center leading-relaxed">{shortVerdict}</p>
          </div>
        )}
      </div>

      {/* Warnings */}
      {warnings?.length > 0 && (
        <Section title="Warnings" icon="⚠️">
          <WarningsList warnings={warnings} />
        </Section>
      )}

      {/* Nutrients */}
      {nutrients && Object.values(nutrients).some(v => v > 0) && (
        <Section title="Nutrition per 100g" icon="📊">
          <NutrientBars nutrients={nutrients} />
        </Section>
      )}

      {/* AI Summary */}
      {(aiSummary || shortVerdict) && (
        <Section title="AI Analysis" icon="🤖">
          <AISummary summary={aiSummary} verdict={null} />
        </Section>
      )}

      {/* Ingredients */}
      {ingredients?.length > 0 && (
        <Section title={`Ingredients (${ingredients.length})`} icon="🧪">
          <IngredientTags
            ingredients={ingredients}
            harmful={harmfulIngredients || []}
          />
        </Section>
      )}

      {/* Alternatives */}
      {alternatives?.length > 0 && (
        <Section title="Healthier Alternatives" icon="🥗">
          <Alternatives alternatives={alternatives} />
        </Section>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-3.5 rounded-xl border border-white/10 hover:border-brand-500/30 hover:bg-brand-500/5 text-slate-400 hover:text-brand-400 font-medium text-sm transition-all"
      >
        ← Analyze Another Product
      </button>
    </div>
  );
}
