// frontend/src/components/upload/BarcodeInput.jsx
import { useState } from 'react';

export default function BarcodeInput({ onAnalyze, loading }) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    const clean = code.trim().replace(/\s/g, '');
    if (/^\d{8,14}$/.test(clean)) onAnalyze({ type: 'barcode', data: clean });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📦</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          onKeyDown={handleKey}
          placeholder="Enter barcode number (8–14 digits)"
          maxLength={14}
          className="w-full rounded-xl bg-slate-900 border border-white/7 text-slate-200 placeholder-slate-600 text-sm pl-12 pr-4 py-3.5 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all tracking-widest font-mono"
        />
      </div>

      <p className="text-xs text-slate-600">
        Enter the barcode number found on the back of any packaged food. Works with EAN-13, UPC-A, and more formats (8-14 digits).
      </p>

      <button
        onClick={handleSubmit}
        disabled={!/^\d{8,14}$/.test(code.trim()) || loading}
        className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-brand-500/20"
      >
        {loading ? 'Looking up…' : '🔎 Lookup Product'}
      </button>
    </div>
  );
}
