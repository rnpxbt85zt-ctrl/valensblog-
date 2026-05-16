'use client';
import { useLang } from '@/app/layout';
import { translations } from '@/lib/translations';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const { lang } = useLang();
  const t = translations[lang];
  const path = usePathname();
  if (path.startsWith('/admin')) return null;

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', marginTop: '4rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: 'var(--text2)', fontSize: '.9rem' }}>{t.footerText}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)', fontSize: '1.3rem', transition: 'color .2s' }}>📸</a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)', fontSize: '1.3rem', transition: 'color .2s' }}>🎵</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)', fontSize: '1.3rem', transition: 'color .2s' }}>💼</a>
        </div>
      </div>
    </footer>
  );
}
