'use client';
import './globals.css';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Lang } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Language context
export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});
export const useLang = () => useContext(LangContext);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved === 'en' || saved === 'es') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Valen's Journey — Student-athlete from Argentina. Swimming, travel, business & personal growth." />
        <meta property="og:title" content="Valen's Journey" />
        <meta property="og:description" content="Student-athlete from Argentina. Swimming, travel, business & personal growth." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
        <title>Valen&apos;s Journey</title>
      </head>
      <body>
        <LangContext.Provider value={{ lang, setLang }}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LangContext.Provider>
      </body>
    </html>
  );
}
