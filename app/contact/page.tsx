'use client';
import { useState } from 'react';
import { useLang } from '@/app/providers';
import { translations } from '@/lib/translations';

export default function ContactPage() {
  const { lang } = useLang();
  const t = translations[lang];
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container-narrow" style={{ maxWidth: '600px' }}>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '2.5rem', marginBottom: '2rem' }}>{t.contactTitle}</h1>

        {status === 'success' ? (
          <div style={{ background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 'var(--radius)', padding: '1.5rem', color: '#4ade80' }}>
            ✅ {t.contactSuccess}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label>{t.contactName}</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Valen..." maxLength={100} />
            </div>
            <div>
              <label>{t.contactEmail}</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="valen@example.com" maxLength={200} />
            </div>
            <div>
              <label>{t.contactMessage}</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="..." maxLength={2000} style={{ resize: 'vertical' }} />
            </div>
            {status === 'error' && <p style={{ color: '#f87171', fontSize: '.9rem' }}>Something went wrong. Please try again.</p>}
            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : t.contactSend}
            </button>
          </form>
        )}

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>Or find me on:</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">📸 Instagram</a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">🎵 TikTok</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">💼 LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
}
