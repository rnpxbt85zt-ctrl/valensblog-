'use client';
import { useLang } from '@/app/providers';
import { translations } from '@/lib/translations';

export default function ContactPage() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container-narrow" style={{ maxWidth: '600px' }}>
        <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '2.5rem', marginBottom: '1rem' }}>
          {t.contactTitle}
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '1.05rem', marginBottom: '3rem', lineHeight: 1.8 }}>
          {lang === 'en' ? "Want to get in touch? Send me an email and I'll get back to you!" : '¿Querés contactarme? ¡Mandame un email y te respondo!'}
        </p>

        
          <a href="mailto:valentindefrutos1@gmail.com"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '1rem',
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1.25rem 2rem',
            color: 'var(--text)', fontSize: '1.1rem', fontWeight: 600,
            fontFamily: 'var(--font)', transition: 'border-color .2s',
          }}
        >
          ✉️ valentindefrutos1@gmail.com
        </a>

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>
            {lang === 'en' ? 'Or find me on:' : 'O encontrame en:'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="https://www.instagram.com/valendefrutoss/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">📸 Instagram</a>
            <a href="https://www.tiktok.com/@valendefrutoss" target="_blank" rel="noopener noreferrer" className="btn btn-outline">🎵 TikTok</a>
            <a href="https://www.linkedin.com/in/valentindefrutos" target="_blank" rel="noopener noreferrer" className="btn btn-outline">💼 LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
}
