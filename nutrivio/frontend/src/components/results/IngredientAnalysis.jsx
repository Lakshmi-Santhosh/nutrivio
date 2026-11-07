// frontend/src/components/results/IngredientAnalysis.jsx
export default function IngredientAnalysis({ analysis }) {
  const { warnings = [], ingredients = [], harmfulIngredients = [], alternatives = [] } = analysis;
  const harmfulSet = new Set(harmfulIngredients.map(h => h.toLowerCase()));

  const warningItems = warnings.map((w) => {
    const text = w.text || '';
    const ingredient = text.replace(/^contains\s+/i, '').trim();
    const tag = w.level === 'high' ? 'High Risk' : w.level === 'medium' ? 'Moderate' : 'Low Risk';
    return { ingredient, tag, level: w.level || 'medium' };
  });

  const benefitItems = ingredients
    .filter(ing => !harmfulSet.has(ing.toLowerCase()))
    .slice(0, 5)
    .map(ing => ({ ingredient: ing, tag: 'Beneficial' }));

  return (
    <div className="page-enter space-y-5">
      <div className="card p-5">
        <h2 className="font-display font-bold text-lg text-white">Ingredient Analysis</h2>
      </div>

      {/* Warnings */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Warnings</span>
          </div>
          <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-md">{warningItems.length}</span>
        </div>
        {warningItems.length > 0 ? (
          <div className="space-y-2.5">
            {warningItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${item.level === 'high' ? 'bg-red-400' : item.level === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                  <span className="text-sm text-slate-200">{item.ingredient}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.level === 'high' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : item.level === 'medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'}`}>
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/15">
            <span className="text-brand-400 text-sm">No major warnings detected</span>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Benefits</span>
          </div>
          <span className="text-xs font-bold text-white bg-brand-500 px-2 py-0.5 rounded-md">{benefitItems.length}</span>
        </div>
        {benefitItems.length > 0 ? (
          <div className="space-y-2.5">
            {benefitItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />
                  <span className="text-sm text-slate-200">{item.ingredient}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/20">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-slate-500 text-sm">No specific benefits identified</span>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {alternatives.length > 0 && (
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-white">Recommendations</span>
            </div>
            <span className="text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded-md">{alternatives.length}</span>
          </div>
          <div className="space-y-2.5">
            {alternatives.map((alt, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <p className="text-sm text-slate-200 font-medium">{alt.name}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{alt.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
