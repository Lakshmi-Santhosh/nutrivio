// frontend/src/components/upload/IngredientTextarea.jsx
import { useState } from 'react';
import { SAMPLE_INGREDIENTS } from '../../utils/constants';

export default function IngredientTextarea({ onAnalyze, loading }) {
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSample = (sample) => setText(sample.text);

  const handleSubmit = () => {
    if (text.trim().length > 5) onAnalyze({ type: 'text', data: text.trim() });
  };

  const charCount = text.length;
  const isReady = text.trim().length > 5;

  return (
    <div className="space-y-4">
      {/* Sample chips */}
      <div>
        <p className="text-xs text-slate-500 mb-2.5 font-medium">Quick samples to try:</p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_INGREDIENTS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSample(s)}
              className="group text-xs px-3.5 py-2 rounded-full bg-slate-800/80 hover:bg-brand-500/10 border border-white/5 hover:border-brand-500/30 text-slate-300 hover:text-brand-400 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              <span className="group-hover:mr-0.5 transition-all">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className={`relative rounded-xl transition-all duration-300 ${focused ? 'ring-2 ring-brand-500/20' : ''}`}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Paste or type the ingredients list here...&#10;&#10;Example: Water, Sugar, Citric Acid, Sodium Benzoate, Red 40..."
          rows={6}
          className="w-full rounded-xl bg-slate-900 border border-white/7 text-slate-200 placeholder-slate-600 text-sm p-4 focus:outline-none focus:border-brand-500/50 resize-none transition-all"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs transition-colors duration-200 ${isReady ? 'text-brand-400' : 'text-slate-600'}`}>
            {charCount} characters
          </span>
          {isReady && (
            <span className="text-[10px] text-brand-400/70 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Ready
            </span>
          )}
        </div>
        {charCount > 0 && (
          <button
            onClick={() => setText('')}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors duration-200 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isReady || loading}
        className={`group w-full py-4 rounded-xl text-white font-semibold text-sm transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
          isReady
            ? 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.01] active:scale-[0.98]'
            : 'bg-brand-500/50 shadow-none cursor-not-allowed opacity-50'
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.59.659H9.06a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V18a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 18v-3.5" />
            </svg>
            Analyze Ingredients
          </>
        )}
      </button>
    </div>
  );
}
