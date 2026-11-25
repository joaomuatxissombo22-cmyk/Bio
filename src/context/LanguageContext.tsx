import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { translatePtToZh } from '../i18n/zhDictionary';

export type SiteLanguage = 'pt' | 'en' | 'zh';

const STORAGE_KEY = 'biosfera_lang';

interface LanguageContextValue {
  lang: SiteLanguage;
  setLang: (next: SiteLanguage) => void;
  toggleLang: () => void;
  t: (pt: string, en: string, zh?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getInitialLanguage(): SiteLanguage {
  if (typeof window === 'undefined') return 'pt';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'pt' || saved === 'zh') {
      return saved;
    }
  } catch {
    // Ignore storage access restrictions
  }
  return 'pt';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SiteLanguage>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang =
      lang === 'en' ? 'en' : lang === 'zh' ? 'zh-Hant' : 'pt-AO';
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage access restrictions
    }
  }, [lang]);

  const setLang = useCallback((next: SiteLanguage) => {
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'pt' ? 'en' : prev === 'en' ? 'zh' : 'pt'));
  }, []);

  const t = useCallback(
    (pt: string, en: string, zh?: string) => {
      if (lang === 'en') return en;
      if (lang === 'zh') return zh ?? translatePtToZh(pt, en);
      return pt;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
