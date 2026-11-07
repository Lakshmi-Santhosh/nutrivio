// frontend/src/components/landing/LandingPage.jsx
import { useEffect, useRef } from 'react';

function useScrollReveal() {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.15 }
    );
    el.querySelectorAll('.reveal').forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Mini result card used in hero ── */
function ResultCard({ good }) {
  const score = good ? 78 : 28;
  const name = good ? 'Wheat Biscuit' : 'Instant Noodles';
  const verdict = good ? 'Good - Mostly Healthy' : 'Poor - Avoid Regularly';
  const ringColor = good ? '#10b981' : '#ef4444';
  const verdictColor = good ? 'text-brand-400' : 'text-red-400';
  const offset = good ? 21 : 70;
  const tags = good
    ? [
        { t: 'Wheat Flour', ok: true },
        { t: 'Sugar', ok: false },
        { t: 'Milk Solids', ok: true },
      ]
    : [
        { t: 'Palm Oil', ok: false },
        { t: 'MSG', ok: false },
        { t: 'Tartrazine', ok: false },
      ];

  return (
    <div className="rounded-2xl bg-gradient-to-b from-surface-50 to-surface-100 border border-white/10 shadow-2xl overflow-hidden p-0.5"
         style={{ boxShadow: good ? '0 8px 40px rgba(16,185,129,0.12)' : '0 8px 40px rgba(239,68,68,0.10)' }}>
      <div className="rounded-[0.85rem] bg-surface-200 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke={ringColor} strokeWidth="3" strokeLinecap="round"
                strokeDasharray="97.4" strokeDashoffset={offset} className="score-ring-circle" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-bold text-xs" style={{ color: ringColor }}>{score}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-bold truncate">{name}</p>
            <p className={`${verdictColor} text-[10px] font-medium`}>{verdict}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.map((tg) => (
            <span key={tg.t} className="ingredient-tag text-[9px] px-1.5 py-0.5 rounded-full border font-medium"
              style={{
                animationDelay: '0.2s',
                borderColor: tg.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.25)',
                color: tg.ok ? '#6ee7b7' : '#fca5a5',
                background: tg.ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
              }}>
              {tg.ok ? '+' : '!'} {tg.t}
            </span>
          ))}
        </div>
        {/* Mini bars */}
        <div className="space-y-1.5">
          {(good
            ? [{ l: 'Protein', p: 60, c: '#10b981' }, { l: 'Sugar', p: 30, c: '#fbbf24' }]
            : [{ l: 'Sodium', p: 85, c: '#ef4444' }, { l: 'Trans Fat', p: 55, c: '#f87171' }]
          ).map((n) => (
            <div key={n.l} className="flex items-center gap-1.5">
              <span className="text-[9px] text-slate-500 w-12 truncate">{n.l}</span>
              <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bar-fill-anim" style={{ width: `${n.p}%`, background: n.c }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage({ onScanProduct }) {
  const rootRef = useScrollReveal();

  return (
    <div ref={rootRef} className="flex flex-col">

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden min-h-[calc(100dvh-56px)] md:min-h-[calc(100dvh-64px)] flex items-center">
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-40" />
        {/* Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-[100px] animate-orb-1" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px] animate-orb-2" />

        <div className="relative w-full max-w-6xl mx-auto px-5 py-14 md:py-0">
          <div className="flex flex-col md:flex-row items-center gap-14 md:gap-12">

            {/* Left copy */}
            <div className="flex-1 text-center md:text-left stagger-children max-w-lg">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                </span>
                <span className="text-brand-400 text-xs font-semibold tracking-wide">AI-Powered Analysis</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-[3.4rem] text-white leading-[1.08] tracking-tight">
                Know What's In<br />
                <span className="text-gradient">Your Food.</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg mt-5 md:mt-6 leading-relaxed">
                Snap a photo of any ingredient label and get an instant health score, harmful ingredient warnings, and AI-powered recommendations.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 md:justify-start justify-center">
                <button onClick={onScanProduct}
                  className="group relative px-8 py-4 rounded-2xl bg-brand-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/50 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.97] overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                    Scan a Product
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sm text-slate-400 hover:text-brand-400 transition-colors flex items-center gap-1.5 group">
                  <span>See how it works</span>
                  <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>

              {/* Trust line */}
              <p className="mt-6 text-xs text-slate-500 tracking-wide">
                Free &middot; No sign-up &middot; Images never stored
              </p>
            </div>

            {/* Right: stacked cards */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative animate-float" style={{ width: 310 }}>
                {/* Strong green glow */}
                <div className="absolute -inset-16 bg-brand-500/15 rounded-full blur-[80px] -z-10" />

                {/* Bad card behind */}
                <div className="absolute -right-4 top-8 w-[250px] rotate-3 opacity-80 -z-[1]">
                  <ResultCard good={false} />
                </div>

                {/* Good card front */}
                <div className="relative z-10 w-[280px]">
                  <ResultCard good={true} />
                </div>

                {/* Floating chips */}
                <div className="absolute -top-5 -right-6 px-2.5 py-1 rounded-full bg-red-500/12 border border-red-500/25 text-red-400 text-[10px] font-semibold animate-float-chip shadow-lg" style={{ animationDelay: '0s' }}>
                  Palm oil detected
                </div>
                <div className="absolute -bottom-4 -left-6 px-2.5 py-1 rounded-full bg-amber-500/12 border border-amber-500/25 text-amber-400 text-[10px] font-semibold animate-float-chip shadow-lg" style={{ animationDelay: '1.5s' }}>
                  Added sugar: 12 g
                </div>
                <div className="absolute top-1/2 -right-10 px-2.5 py-1 rounded-full bg-brand-500/12 border border-brand-500/25 text-brand-400 text-[10px] font-semibold animate-float-chip shadow-lg hidden sm:block" style={{ animationDelay: '0.8s' }}>
                  AI Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS STRIP ════════════════ */}
      <section className="border-t border-white/5 bg-surface-100/60">
        <div className="max-w-5xl mx-auto px-5 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 sm:gap-x-16">
            {[
              { val: '500+', label: 'Ingredients in database' },
              { val: '< 3 sec', label: 'Average analysis time' },
              { val: '80%', label: 'Instant local lookups' },
              { val: '0', label: 'Images stored' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2.5 text-center sm:text-left">
                <span className="font-display font-bold text-lg text-white">{s.val}</span>
                <span className="text-slate-400 text-xs sm:text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ SEE IT IN ACTION ════════════════ */}
      <section className="py-20 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-14 reveal">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">See It in Action</h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-lg mx-auto">
              From ingredient label to full health report in seconds
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 reveal">
            {/* Phone mockup - label photo */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="phone-frame w-56 sm:w-64 bg-surface-200 overflow-hidden">
                  {/* Phone notch */}
                  <div className="h-7 bg-surface-100 flex items-center justify-center">
                    <div className="w-20 h-4 rounded-full bg-black/60" />
                  </div>
                  {/* Fake label content */}
                  <div className="p-4 space-y-3">
                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Ingredients</div>
                    <div className="bg-slate-800/80 rounded-lg p-3 border border-white/5">
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        Wheat Flour (Maida), Sugar, Refined Palm Oil, Milk Solids, Invert Syrup,
                        Raising Agents (503(ii), 500(ii)), Salt, Emulsifiers (322, 472e)...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-brand-400 font-medium">
                      <div className="w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                      Scanning with OCR...
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                  Step 1: Upload label
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <svg className="w-8 h-8 text-brand-500/50 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>

            {/* Phone mockup - result */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="phone-frame w-56 sm:w-64 bg-surface-200 overflow-hidden">
                  <div className="h-7 bg-surface-100 flex items-center justify-center">
                    <div className="w-20 h-4 rounded-full bg-black/60" />
                  </div>
                  <div className="p-4 space-y-3">
                    {/* Score */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 shrink-0">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"
                            strokeDasharray="97.4" strokeDashoffset="21" className="score-ring-circle" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-brand-400 font-bold text-xs">78</span>
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold">Health Score</p>
                        <p className="text-brand-400 text-[10px] font-medium">Good</p>
                      </div>
                    </div>
                    {/* Warning */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 flex items-start gap-2">
                      <span className="text-amber-400 text-xs mt-0.5">!</span>
                      <p className="text-[10px] text-amber-300/90">Contains refined palm oil and added sugar</p>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {['Wheat Flour', 'Palm Oil', 'Sugar'].map((t, i) => (
                        <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full border font-medium"
                          style={{
                            borderColor: i === 0 ? 'rgba(16,185,129,0.2)' : 'rgba(251,191,36,0.25)',
                            color: i === 0 ? '#6ee7b7' : '#fde68a',
                            background: i === 0 ? 'rgba(16,185,129,0.08)' : 'rgba(251,191,36,0.06)',
                          }}>
                          {i === 0 ? '+' : '!'} {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 text-xs text-slate-500 font-medium whitespace-nowrap">
                  Step 2: Get results
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section id="how-it-works" className="border-t border-white/5 bg-surface-100/30 py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14 reveal">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">How It Works</h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-lg mx-auto">
              Three simple steps to understand what's really in your food
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 reveal">
            {[
              {
                step: '01', title: 'Snap or Upload',
                desc: 'Take a photo of the ingredient label on any food package, or type the ingredients manually.',
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                ),
              },
              {
                step: '02', title: 'AI Analyzes',
                desc: 'Our 3-phase engine scans each ingredient against a health database and uses Gemini AI for deep analysis.',
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.59.659H9.06a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V18a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 18v-3.5" />
                  </svg>
                ),
              },
              {
                step: '03', title: 'Get Your Score',
                desc: 'See a clear health score, flagged harmful ingredients, nutrient breakdown, and healthier alternatives.',
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={item.step} className="step-connector flex flex-col items-center md:items-start text-center md:text-left p-6 rounded-2xl group hover:bg-surface-100/60 transition-all duration-300">
                {/* Large outlined step number */}
                <span className="font-display font-extrabold text-5xl text-brand-500/15 leading-none select-none">{item.step}</span>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mt-3 mb-3 group-hover:bg-brand-500/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-white text-base mb-1.5">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ COMMON HARMFUL INGREDIENTS ════════════════ */}
      <section className="py-16 sm:py-20 reveal">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10 reveal">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Ingredients We Flag</h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-lg mx-auto">
              Common additives and their risk levels, detected automatically
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 reveal">
            {[
              { name: 'Palm Oil', level: 'amber' },
              { name: 'Aspartame', level: 'red' },
              { name: 'MSG (E621)', level: 'amber' },
              { name: 'Maltodextrin', level: 'amber' },
              { name: 'Tartrazine', level: 'red' },
              { name: 'Sodium Benzoate', level: 'amber' },
              { name: 'TBHQ', level: 'red' },
              { name: 'High Fructose Corn Syrup', level: 'red' },
              { name: 'Carrageenan', level: 'amber' },
              { name: 'Oats', level: 'green' },
              { name: 'Turmeric', level: 'green' },
            ].map((ing) => {
              const dotColor = ing.level === 'red' ? 'bg-red-500' : ing.level === 'amber' ? 'bg-amber-500' : 'bg-brand-500';
              const borderColor = ing.level === 'red' ? 'border-red-500/20 hover:border-red-500/40' : ing.level === 'amber' ? 'border-amber-500/20 hover:border-amber-500/40' : 'border-brand-500/20 hover:border-brand-500/40';
              return (
                <div key={ing.name}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-100/80 border ${borderColor} transition-all duration-200 hover:scale-[1.04] cursor-default`}>
                  <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                  <span className="text-sm text-slate-300 font-medium">{ing.name}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-6 mt-8 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Avoid</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Caution</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-brand-500" /> Safe</span>
          </div>
        </div>
      </section>

      {/* ════════════════ WHY NUTRIVIO - BENTO ════════════════ */}
      <section className="border-t border-white/5 bg-surface-100/30 py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14 reveal">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Why Nutrivio?</h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-lg mx-auto">
              Built for people who care about what goes into their body
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 reveal">
            {/* Large hero card — spans 2 cols */}
            <div className="sm:col-span-2 group relative rounded-2xl p-8 bg-surface-100/50 border border-white/5 hover:border-brand-500/20 transition-all duration-300 hover:shadow-lg overflow-hidden cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              <div className="relative flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/10 group-hover:bg-brand-500/20 flex items-center justify-center text-brand-400 transition-all duration-300 shrink-0">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg mb-2">Powered by Google Gemini AI</h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                    Uses Gemini 1.5 Flash for deep ingredient understanding. The AI doesn't just list ingredients
                    &mdash; it understands context, detects hidden additives, and provides personalized health insights
                    with alternatives you can actually buy.
                  </p>
                  {/* Mini visual */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 rounded-full bg-brand-500/20 border-2 border-surface-200 flex items-center justify-center text-[8px] text-brand-400 font-bold">AI</div>
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border-2 border-surface-200 flex items-center justify-center text-[8px] text-blue-400 font-bold">DB</div>
                      <div className="w-6 h-6 rounded-full bg-amber-500/20 border-2 border-surface-200 flex items-center justify-center text-[8px] text-amber-400 font-bold">OCR</div>
                    </div>
                    <span className="text-[10px] text-slate-500">3-phase analysis engine</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Small cards */}
            {[
              {
                icon: (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>),
                title: 'Instant Results',
                desc: 'Local database handles 80% of lookups instantly. AI kicks in for the unknowns.',
                gradient: 'from-amber-500/15 to-orange-500/10',
              },
              {
                icon: (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>),
                title: 'Private & Secure',
                desc: 'Images analyzed in real-time and never stored on any server.',
                gradient: 'from-blue-500/15 to-cyan-500/10',
              },
              {
                icon: (<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>),
                title: 'Works Everywhere',
                desc: 'Installable as a PWA on iPhone and Android. Works offline.',
                gradient: 'from-purple-500/15 to-pink-500/10',
              },
            ].map((f) => (
              <div key={f.title}
                className="group relative rounded-2xl p-6 bg-surface-100/50 border border-white/5 hover:border-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-default overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-slate-400 group-hover:text-white transition-all duration-300 mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-display font-bold text-white text-sm mb-1.5">{f.title}</h3>
                  <p className="text-slate-400 group-hover:text-slate-300 text-sm leading-relaxed transition-colors duration-300">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section className="py-20 sm:py-24 reveal">
        <div className="max-w-2xl mx-auto px-5">
          <div className="gradient-border-panel p-10 sm:p-14 text-center relative overflow-hidden">
            {/* Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px]" />
            <div className="relative">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
                Ready to eat smarter?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-md mx-auto">
                Upload any food label and get a detailed health analysis in seconds.
              </p>
              <button onClick={onScanProduct}
                className="group relative inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-brand-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/50 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.97] overflow-hidden">
                <span className="relative z-10">Start Scanning</span>
                <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <p className="mt-5 text-xs text-slate-500">
                Works on any phone &middot; Install as an app &middot; No account needed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="border-t border-white/5 bg-surface-100/40 py-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <span className="font-display font-bold text-sm text-white">Nutrivio</span>
            </div>

            {/* Links */}
            <nav className="flex items-center gap-6">
              {['Home', 'Scan', 'About', 'Privacy'].map((l) => (
                <button key={l}
                  onClick={() => l === 'Scan' ? onScanProduct() : null}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                  {l}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-slate-600 leading-relaxed">
              Not medical advice. Always consult a healthcare professional before making dietary changes.
              <br className="hidden sm:block" />
              &copy; {new Date().getFullYear()} Nutrivio. Built with AI for healthier choices.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
