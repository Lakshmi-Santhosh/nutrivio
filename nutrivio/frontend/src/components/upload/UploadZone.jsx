// frontend/src/components/upload/UploadZone.jsx
import { useState, useRef } from 'react';

export default function UploadZone({ onAnalyze, loading }) {
  const [preview, setPreview]   = useState(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile]         = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleChange = (e) => handleFile(e.target.files[0]);

  const handleAnalyze = () => {
    if (file) onAnalyze({ type: 'image', data: file });
  };

  const clear = () => {
    setPreview(null);
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-slate-400 text-sm">
          Upload a clear image of the ingredients list on the product packaging.
        </p>
      </div>

      {!preview ? (
        <>
          {/* Drag & Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              group relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-10
              flex flex-col items-center justify-center gap-4 min-h-[200px] overflow-hidden
              ${dragging
                ? 'border-brand-400 bg-brand-500/10 scale-[1.02]'
                : 'border-slate-700 hover:border-brand-500/40 bg-slate-900/40 hover:bg-slate-900/60'}
            `}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleChange}
              className="hidden"
            />
            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
              dragging
                ? 'bg-brand-500/15 border-brand-500/30 text-brand-400 scale-110'
                : 'bg-slate-800/80 border-white/5 text-slate-400 group-hover:text-brand-400 group-hover:border-brand-500/20 group-hover:bg-brand-500/10'
            }`}>
              <svg className="w-7 h-7 transition-transform duration-300 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="relative text-center">
              <p className="text-slate-300 font-medium text-sm">
                {dragging ? 'Drop your image here!' : 'Drag & drop your image here'}
              </p>
              <p className="text-slate-600 text-xs mt-1">JPG, PNG, WEBP up to 10MB</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-slate-600 font-medium">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Choose Image button */}
          <button
            onClick={() => inputRef.current?.click()}
            className="group w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            Choose Image
          </button>
        </>
      ) : (
        <div className="animate-fade-in space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
            <img src={preview} alt="Product label" className="w-full max-h-72 object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button
              onClick={clear}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-red-500/80 text-sm transition-all duration-200 hover:scale-110"
            >
              ✕
            </button>
            {/* File info badge */}
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white/70 text-[10px] font-medium">
              {file?.name?.slice(0, 20)}{file?.name?.length > 20 ? '...' : ''} - {(file?.size / 1024).toFixed(0)} KB
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="group w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2"
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
                Analyze This Label
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
