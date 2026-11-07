// frontend/src/components/results/AIChatPanel.jsx
import { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../../services/api';

const SUGGESTED_QUESTIONS = [
  'Is this product good for weight loss?',
  'Can diabetics eat this?',
  'What are healthier alternatives?',
  'How often can I eat this product?',
];

export default function AIChatPanel({ analysis }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = {
        productName: analysis.productName || 'Unknown Product',
        brand: analysis.brand || '',
        healthScore: analysis.healthScore,
        shortVerdict: analysis.shortVerdict || '',
        aiSummary: analysis.aiSummary || '',
        ingredients: (analysis.ingredients || []).join(', '),
        warnings: (analysis.warnings || []).map(w => w.text).join('; '),
      };

      const { reply } = await chatWithAI(text.trim(), context);
      setMessages((prev) => [...prev, { role: 'ai', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: 'Sorry, I could not process your question. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="page-enter flex flex-col h-full">
      {/* Header */}
      <div className="card p-5 mb-4">
        <h2 className="font-display font-bold text-lg text-white">Ask Nutrivio AI</h2>
        <p className="text-slate-400 text-sm mt-1">Ask any nutrition question about this product.</p>
      </div>

      {/* Suggested Questions (show when no messages) */}
      {messages.length === 0 && (
        <div className="space-y-2.5 mb-4 stagger-children">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="w-full text-left p-3.5 rounded-xl border border-white/7 bg-surface-100 hover:bg-surface-50 hover:border-brand-500/20 text-slate-300 text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div ref={scrollRef} className="flex-1 overflow-y-auto hide-scrollbar space-y-3 mb-4 max-h-[50vh]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-500 text-white rounded-br-md'
                    : 'bg-surface-50 border border-white/5 text-slate-300 rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface-50 border border-white/5 p-3.5 rounded-2xl rounded-bl-md">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="relative mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your question..."
          disabled={loading}
          className="w-full rounded-xl bg-surface-100 border border-white/7 text-slate-200 placeholder-slate-600 text-sm pl-4 pr-12 py-3.5 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition-all disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
