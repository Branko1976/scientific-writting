'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgress } from '../lib/ProgressProvider';
import { useLang } from '../lib/LanguageProvider';

export default function Header() {
  const { auth, authReady, logout } = useProgress();
  const router = useRouter();
  const { lang, setLang, t, onTutorPage } = useLang();

  async function handleLogout() {
    await logout();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-1.5 sm:px-5 sm:py-2">
        <Link href="/" className="group flex min-h-[44px] items-center gap-2">
          <span className="whitespace-nowrap font-serif text-base font-semibold text-ink transition-colors group-hover:text-mark sm:text-lg">
            Scientific Writing
          </span>
          <span className="hidden text-xs text-ink-faint sm:inline">
            {t('header.tagline')}
          </span>
        </Link>

        <div className="flex items-center gap-1.5 text-sm text-ink-soft sm:gap-3">
          {!onTutorPage && (
            <button
              type="button"
              onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
              aria-label={t('lang.switchLabel')}
              data-testid="lang-toggle"
              className="flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-md border border-line px-2.5 font-medium hover:border-ink hover:text-ink sm:px-3"
            >
              <span aria-hidden="true" className="hidden text-xs text-ink-faint sm:inline">
                {lang === 'ja' ? 'JA' : 'EN'} &rarr;
              </span>
              {t('lang.switchTo')}
            </button>
          )}
          {!authReady ? null : auth.loggedIn ? (
            <>
              <span className="hidden text-ink sm:inline">{auth.name}</span>
              <button onClick={handleLogout} className="min-h-[40px] whitespace-nowrap rounded px-2 py-2 hover:bg-card sm:px-3">
                {t('header.logout')}
              </button>
            </>
          ) : (
            <Link href="/login" className="flex min-h-[40px] items-center whitespace-nowrap rounded-md border border-line px-2.5 hover:border-ink hover:text-ink sm:px-3">
              {t('header.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
