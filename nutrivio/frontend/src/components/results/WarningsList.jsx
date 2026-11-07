// frontend/src/components/results/WarningsList.jsx

const LEVEL_STYLE = {
  high:   { bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400',    icon: '🚨' },
  medium: { bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-400',  icon: '⚠️' },
  low:    { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   icon: 'ℹ️' },
};

export default function WarningsList({ warnings = [] }) {
  if (warnings.length === 0) {
    return (
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-500/5 border border-brand-500/15">
        <span>✅</span>
        <span className="text-brand-400 text-sm font-medium">No major warnings detected</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {warnings.map((w, i) => {
        const style = LEVEL_STYLE[w.level] || LEVEL_STYLE.low;
        return (
          <div
            key={i}
            className={`flex items-start gap-2.5 p-3 rounded-xl border ${style.bg} ${style.border}`}
          >
            <span className="text-base mt-0.5 shrink-0">{style.icon}</span>
            <p className={`text-sm ${style.text} leading-snug`}>{w.text}</p>
          </div>
        );
      })}
    </div>
  );
}
