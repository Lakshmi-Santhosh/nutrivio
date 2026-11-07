// frontend/src/components/results/Alternatives.jsx
export default function Alternatives({ alternatives = [] }) {
  if (alternatives.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {alternatives.map((alt, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-white/5"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-base shrink-0">
            🥗
          </div>
          <div>
            <p className="text-slate-200 text-sm font-medium">{alt.name}</p>
            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{alt.reason}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
