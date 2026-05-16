'use client';
import Link from 'next/link';
import { useLang } from '@/app/providers';
import { translations } from '@/lib/translations';

const HERO_IMAGE = 'https://qhwhqlftmtceaxsuhpqq.supabase.co/storage/v1/object/public/blog-uploads/9D6DBC66-9354-48E2-A8EB-05F03F907855.JPG';

export default function Home() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <>
      {/* Hero with photo background */}
      <section style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(11,19,43,0.55) 0%, rgba(11,19,43,0.75) 60%, rgba(11,19,43,0.95) 100%)',
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'var(--accent2)', fontWeight: 600, fontSize: '.9rem', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: 'var(--font)' }}>
            🏊 Student-Athlete · Argentina → USA
          </p>
          <h1 style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.15, color: '#fff', marginBottom: '1.5rem', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            {t.heroTitle}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.8, textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
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
