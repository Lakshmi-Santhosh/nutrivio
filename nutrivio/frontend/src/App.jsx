// frontend/src/App.jsx
import { useState, useCallback } from 'react';
import Header              from './components/layout/Header';
import BottomNav           from './components/layout/BottomNav';
import LandingPage         from './components/landing/LandingPage';
import TabSwitcher         from './components/ui/TabSwitcher';
import LoadingSpinner      from './components/ui/LoadingSpinner';
import ErrorBox            from './components/ui/ErrorBox';
import UploadZone          from './components/upload/UploadZone';
import IngredientTextarea  from './components/upload/IngredientTextarea';
import ResultsOverview     from './components/results/ResultsOverview';
import IngredientAnalysis  from './components/results/IngredientAnalysis';
import AISummary           from './components/results/AISummary';
import AIChatPanel         from './components/results/AIChatPanel';
import { useAnalyze }      from './hooks/useAnalyze';

const UPLOAD_TABS = [
  { id: 'camera',  label: 'Camera',  icon: '📷' },
  { id: 'text',    label: 'Type',    icon: '✏️' },
];

const RESULT_TABS = [
  { id: 'overview',    label: 'Results' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'ai-summary',  label: 'AI Summary' },
  { id: 'ai-chat',     label: 'Ask AI' },
];

export default function App() {
  const [page, setPage]           = useState('landing');
  const [uploadTab, setUploadTab] = useState('camera');
  const [resultTab, setResultTab] = useState('overview');
  const { loading, loadingStep, result, error, analyze, reset } = useAnalyze();

  const handleScanProduct = useCallback(() => {
    setPage('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAnalyze = useCallback(async (input) => {
    setPage('processing');
    window.scrollTo({ top: 0 });
    const success = await analyze(input);
    if (success) {
      setPage('results');
      setResultTab('overview');
    } else {
      setPage('upload');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [analyze]);

  const handleReset = useCallback(() => {
    reset();
    setPage('upload');
    setResultTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [reset]);

  const handleNavigate = useCallback((target) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (target === 'landing' || target === 'about') {
      setPage('landing');
    } else if (target === 'upload') {
      setPage('upload');
    } else if (target === 'results-chat' && result) {
      setPage('results');
      setResultTab('ai-chat');
    } else if (target === 'history' || target === 'profile') {
      // Placeholder — stays on current page
    }
  }, [result]);

  const hasResults = !!result;

  return (
    <div className="min-h-dvh bg-[#0a0e1a] flex flex-col">
      <Header page={page} onNavigate={handleNavigate} />

      <main className="flex-1 pb-safe-nav">
        {/* ─── Landing ─── */}
        {page === 'landing' && (
          <LandingPage onScanProduct={handleScanProduct} />
        )}

        {/* ─── Upload ─── */}
        {page === 'upload' && (
          <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
            <div className="text-center mb-6 page-enter">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-white">
                Upload Product Image
              </h1>
            </div>

            <div className="card p-4 sm:p-6 space-y-4 page-enter" style={{ animationDelay: '0.1s' }}>
              <TabSwitcher tabs={UPLOAD_TABS} active={uploadTab} onChange={setUploadTab} />

              {uploadTab === 'camera'  && <UploadZone        onAnalyze={handleAnalyze} loading={loading} />}
              {uploadTab === 'text'    && <IngredientTextarea onAnalyze={handleAnalyze} loading={loading} />}

              {error && !loading && (
                <ErrorBox message={error} onRetry={handleReset} />
              )}
            </div>
          </div>
        )}

        {/* ─── Processing ─── */}
        {page === 'processing' && (
          <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6">
            <div className="card p-4 sm:p-6">
              <LoadingSpinner step={loadingStep} />
            </div>
          </div>
        )}

        {/* ─── Results ─── */}
        {page === 'results' && result && (
          <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
            {/* Product header */}
            <div className="flex items-center gap-3 mb-5 page-enter">
              {result._productImageUrl && (
                <img
                  src={result._productImageUrl}
                  alt={result.productName}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-white text-base truncate">
                  {result.productName || 'Food Product'}
                </p>
                {result.brand && <p className="text-slate-500 text-xs">{result.brand}</p>}
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-slate-500 hover:text-brand-400 px-3 py-1.5 rounded-lg border border-white/5 hover:border-brand-500/20 transition-all shrink-0"
              >
                New Scan
              </button>
            </div>

            {/* Result sub-tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-slate-900/80 border border-white/5 mb-5 overflow-x-auto hide-scrollbar">
              {RESULT_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setResultTab(tab.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`flex-1 min-w-[70px] px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    resultTab === tab.id
                      ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active result view */}
            {resultTab === 'overview' && (
              <ResultsOverview analysis={result} onTabChange={setResultTab} />
            )}
            {resultTab === 'ingredients' && (
              <IngredientAnalysis analysis={result} />
            )}
            {resultTab === 'ai-summary' && (
              <AISummary summary={result.aiSummary} verdict={result.shortVerdict} standalone />
            )}
            {resultTab === 'ai-chat' && (
              <AIChatPanel analysis={result} />
            )}
          </div>
        )}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav page={page} onNavigate={handleNavigate} hasResults={hasResults} />
    </div>
  );
}
