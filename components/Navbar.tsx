'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/app/layout';
import { translations } from '@/lib/translations';

export default function Navbar() {
  const { lang, setLang } = useLang();
  const t = translations[lang];
  const path = usePathname();
  const isAdmin = path.startsWith('/admin');

  if (isAdmin) return null; // Admin has its own nav

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(11,19,43,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '70px', gap: '2rem' }}>
        <Link href="/" style={{ fontFamily: 'var(--font)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>
          Valen&apos;s Journey
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto', alignItems: 'center' }}>
          <Link href="/" style={{ color: path === '/' ? 'var(--accent2)' : 'var(--text2)', fontWeight: 500, fontSize: '.95rem', transition: 'color .2s' }}>
            {t.home}
          </Link>
          <Link href="/articles" style={{ color: path === '/articles' ? 'var(--accent2)' : 'var(--text2)', fontWeight: 500, fontSize: '.95rem', transition: 'color .2s' }}>
            {t.articles}
          </Link>
          <Link href="/contact" style={{ color: path === '/contact' ? 'var(--accent2)' : 'var(--text2)', fontWeight: 500, fontSize: '.95rem', transition: 'color .2s' }}>
            {t.contact}
          </Link>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
            style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: '999px', padding: '.3rem .8rem',
              color: 'var(--text)', cursor: 'pointer', fontSize: '.85rem',
              fontWeight: 600, fontFamily: 'var(--font)',
            }}
          >
            {lang === 'en' ? '🇦🇷 ES' : '🇺🇸 EN'}
          </button>
        </div>
      </div>
    </nav>
  );
}
