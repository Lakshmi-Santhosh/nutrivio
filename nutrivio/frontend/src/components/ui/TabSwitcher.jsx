// frontend/src/components/ui/TabSwitcher.jsx
export default function TabSwitcher({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
            active === tab.id
              ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-md shadow-brand-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }`}
        >
          <span className={`text-base transition-transform duration-300 ${active === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
          <span>{tab.label}</span>
          {active === tab.id && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-brand-400" />
          )}
        </button>
      ))}
    </div>
  );
}
