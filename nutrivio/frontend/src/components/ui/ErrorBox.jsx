// frontend/src/components/ui/ErrorBox.jsx
export default function ErrorBox({ message, onRetry }) {
  return (
    <div className="animate-fade-in rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">⚠️</span>
        <div className="flex-1">
          <p className="text-red-400 font-medium text-sm mb-1">Something went wrong</p>
          <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
