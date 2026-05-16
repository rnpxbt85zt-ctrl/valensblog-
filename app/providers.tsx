'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Lang } from '@/lib/translations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});

export const useLang = () => useContext(LangContext);

export default function Providers({ children }: { children: React.ReactNode }) {
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
    <LangContext.Provider value={{ lang, setLang }}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </LangContext.Provider>
  );
}
