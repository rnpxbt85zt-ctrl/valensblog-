'use client';
import Link from 'next/link';
import { useLang } from '@/app/layout';
import { translations } from '@/lib/translations';

export default function Home() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <>
      {/* Hero */}
      <section style={{
        minHeight: '75vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #0b132b 0%, #112044 50%, #0b132b 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <p style={{ color: 'var(--accent2)', fontWeight: 600, fontSize: '.9rem', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: 'var(--font)' }}>
            🏊 Student-Athlete · Argentina → USA
          </p>
          <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.15, color: 'var(--text)', marginBottom: '1.5rem' }}>
            {t.heroTitle}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            {t.heroSubtitle}
          </p>
          <Link href="/articles" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '.8rem 2rem' }}>
            {t.heroBtn} →
          </Link>
        </div>
      </section>

      {/* About */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-narrow">
          <h2 style={{ fontFamily: 'var(--font)', fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--text)' }}>
            {t.aboutTitle}
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: '1.05rem', lineHeight: 1.9 }}>
            {t.aboutText}
          </p>

          {/* Categories */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['Swimming', 'Travel', 'Business', 'Lifestyle', 'Personal Growth'].map((cat) => (
              <Link key={cat} href={`/articles?category=${cat}`} className="badge badge-blue" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
