// frontend/src/components/results/AISummary.jsx
export default function AISummary({ summary, verdict, standalone = false }) {
  if (!summary && !verdict) return null;

  if (standalone) {
    return (
      <div className="page-enter space-y-5">
        <div className="card p-5">
          <h2 className="font-display font-bold text-lg text-white">AI Nutrition Summary</h2>
        </div>

        <div className="card p-5 sm:p-6 space-y-4">
          {summary && (
            <div className="space-y-4">
              {summary.split('\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-slate-300 text-sm leading-relaxed border-l-2 border-brand-500/40 pl-4">
                  {para}
                </p>
              ))}
            </div>
          )}
          {!summary && verdict && (
            <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-brand-500/40 pl-4">
              {verdict}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {verdict && (
        <p className="text-slate-200 text-sm font-medium leading-relaxed border-l-2 border-brand-500 pl-3">
          {verdict}
        </p>
      )}
      {summary && (
        <p className="text-slate-400 text-sm leading-relaxed">{summary}</p>
      )}
    </div>
  );
}
