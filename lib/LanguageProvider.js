'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { translate, LANGS } from './i18n';
import { useProgress } from './ProgressProvider';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'swc_lang';

function readStored() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return LANGS.includes(v) ? v : null;
  } catch {
    return null;
  }
}

// Holds the student's interface language (English or Japanese).
// - Remembered per browser in localStorage.
// - Reported to the server while logged in, so the tutor dashboard can show it.
// - Tutor pages are always English, whatever the stored choice is.
export function LanguageProvider({ children }) {
  const pathname = usePathname() || '/';
  const { auth, authReady } = useProgress();
  const [stored, setStored] = useState('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = readStored();
    if (v) setStored(v);
    setReady(true);
  }, []);

  const onTutorPage = pathname.startsWith('/tutor');
  const lang = onTutorPage ? 'en' : stored;

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [lang]);

  // Tell the server which language this student is using.
  useEffect(() => {
    if (!ready || !authReady || !auth.loggedIn) return;
    fetch('/api/auth/lang', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: stored }),
    }).catch(() => {});
  }, [ready, authReady, auth.loggedIn, stored]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setStored(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* the choice still applies for this visit */
    }
  }, []);

  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, onTutorPage, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
