// frontend/src/components/results/ResultsOverview.jsx
import HealthScoreRing from './HealthScoreRing';
import { getScoreCategory } from '../../utils/constants';

function getGrade(score) {
  if (score >= 85) return { letter: 'A', color: '#10b981' };
  if (score >= 70) return { letter: 'B', color: '#84cc16' };
  if (score >= 50) return { letter: 'C', color: '#f59e0b' };
  if (score >= 30) return { letter: 'D', color: '#f97316' };
  return { letter: 'F', color: '#ef4444' };
}

export default function ResultsOverview({ analysis, onTabChange }) {
  const { healthScore = 0, shortVerdict, warnings = [], alternatives = [] } = analysis;
  const cat = getScoreCategory(healthScore);
  const grade = getGrade(healthScore);

  const warningCount = warnings.length;
  const benefitCount = (analysis.ingredients || []).filter((_, i) => i < 3).length > 0 ? 1 : 0;
  const recoCount = (alternatives || []).length;

  // Derive benefits from ingredients that aren't harmful
  const harmfulSet = new Set((analysis.harmfulIngredients || []).map(h => h.toLowerCase()));
  const beneficialIngredients = (analysis.ingredients || []).filter(
    ing => !harmfulSet.has(ing.toLowerCase())
  );
  const actualBenefitCount = Math.min(beneficialIngredients.length, 5);

  return (
    <div className="page-enter space-y-6">
      {/* Health Score Section */}
      <div className="card p-6 sm:p-8">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-6">
          Health Score
        </h2>

        <HealthScoreRing score={healthScore} size="large" />

        {/* Grade */}
        <div className="mt-8 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Grade</p>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all"
            style={{ borderColor: grade.color + '40', background: grade.color + '15' }}
          >
            <span className="font-display font-bold text-3xl" style={{ color: grade.color }}>
              {grade.letter}
            </span>
          </div>
        </div>

        {/* Verdict */}
        {shortVerdict && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-white/5">
            <p className="text-slate-300 text-sm text-center leading-relaxed">{shortVerdict}</p>
          </div>
        )}
      </div>

      {/* Quick Summary Tabs */}
      <div className="flex gap-3">
        <SummaryTab
          label="Warnings"
          count={warningCount}
          color="red"
          onClick={() => onTabChange('ingredients')}
        />
        <SummaryTab
          label="Benefits"
          count={actualBenefitCount}
          color="green"
          onClick={() => onTabChange('ingredients')}
        />
        <SummaryTab
          label="Recom..."
          count={recoCount}
          color="blue"
          onClick={() => onTabChange('ingredients')}
        />
      </div>
    </div>
  );
}

function SummaryTab({ label, count, color, onClick }) {
  const colors = {
    red:   { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', badge: 'bg-red-500' },
    green: { bg: 'bg-brand-500/10', border: 'border-brand-500/20', text: 'text-brand-400', badge: 'bg-brand-500' },
    blue:  { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500' },
  };
  const c = colors[color];

  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] ${c.bg} ${c.border}`}
    >
      <span className={`text-xs font-semibold ${c.text}`}>{label}</span>
      <span className={`text-xs font-bold text-white px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${c.badge}`}>
        {count}
      </span>
    </button>
  );
}
