'use client';
import { useState, useRef, useEffect } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: 'assistant', content: '👋 Hi! I\'m your Budget Bazar AI. Ask me about products, comparisons, or deals!' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: 'user', content: input };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages.slice(-6) }),
      });
      const { reply } = await res.json();
      setMessages(m => [...m, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, AI is temporarily unavailable. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000 }}>
      {open && (
        <div className="card" style={{ width: '360px', height: '480px', display: 'flex', flexDirection: 'column', marginBottom: '0.75rem', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Budget Bazar AI</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span className="live-dot" style={{ background: 'white', width: '6px', height: '6px' }}></span> Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '0.6rem 0.9rem', borderRadius: '1rem',
                  background: m.role === 'user' ? 'linear-gradient(135deg, var(--primary), #4f46e5)' : 'var(--bg-surface)',
                  fontSize: '0.875rem', lineHeight: 1.6,
                  borderBottomRightRadius: m.role === 'user' ? '0.2rem' : '1rem',
                  borderBottomLeftRadius: m.role === 'assistant' ? '0.2rem' : '1rem',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ background: 'var(--bg-surface)', padding: '0.6rem 0.9rem', borderRadius: '1rem' }}>
                  <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                </div>
              </div>
            )}
            <div ref={bottom} />
          </div>

          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
            <input
              style={{ flex: 1, borderRadius: '2rem' }}
              placeholder="Ask about products..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button className="btn btn-primary btn-sm" onClick={send} disabled={loading}>→</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '62px', height: '62px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          border: 'none', fontSize: '1.6rem', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.3s',
        }}
        title="Open AI Assistant"
      >
        {open ? '✕' : '🤖'}
      </button>
    </div>
  );
}
