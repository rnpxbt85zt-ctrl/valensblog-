'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/app/providers';
import { translations } from '@/lib/translations';

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function Navbar() {
  const { lang, setLang } = useLang();
  const t = translations[lang];
  const path = usePathname();
  const isAdmin = path.startsWith('/admin');

  if (isAdmin) return null;

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
          <Link href="/" style={{ color: path === '/' ? 'var(--accent2)' : 'var(--text2)', fontWeight: 500, fontSize: '.95rem' }}>
            {t.home}
          </Link>
          <Link href="/articles" style={{ color: path === '/articles' ? 'var(--accent2)' : 'var(--text2)', fontWeight: 500, fontSize: '.95rem' }}>
            {t.articles}
          </Link>
          <Link href="/contact" style={{ color: path === '/contact' ? 'var(--accent2)' : 'var(--text2)', fontWeight: 500, fontSize: '.95rem' }}>
            {t.contact}
          </Link>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
            <a href="https://www.instagram.com/valendefrutoss/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)', transition: 'color .2s', display: 'flex' }} onMouseOver={e => (e.currentTarget.style.color = '#E1306C')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text2)')}>
              <InstagramIcon />
            </a>
            <a href="https://www.tiktok.com/@valendefrutoss" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)', transition: 'color .2s', display: 'flex' }} onMouseOver={e => (e.currentTarget.style.color = '#fff')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text2)')}>
              <TikTokIcon />
            </a>
            <a href="https://www.linkedin.com/in/valentindefrutos" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)', transition: 'color .2s', display: 'flex' }} onMouseOver={e => (e.currentTarget.style.color = '#0A66C2')} onMouseOut={e => (e.currentTarget.style.color = 'var(--text2)')}>
              <LinkedInIcon />
            </a>
          </div>

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
