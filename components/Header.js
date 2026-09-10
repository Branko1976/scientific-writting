'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProgress } from '../lib/ProgressProvider';

export default function Header() {
  const { auth, authReady, logout } = useProgress();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-lg font-semibold text-ink transition-colors group-hover:text-mark">
            Scientific Writing
          </span>
          <span className="hidden text-xs text-ink-faint sm:inline">
            Principles &amp; Practice · Honours Program
          </span>
        </Link>

        <div className="flex items-center gap-3 text-sm text-ink-soft">
          {!authReady ? null : auth.loggedIn ? (
            <>
              <span className="hidden text-ink sm:inline">{auth.name}</span>
              <button onClick={handleLogout} className="rounded px-2 py-1 hover:bg-card">
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-md border border-line px-3 py-1.5 hover:border-ink hover:text-ink">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
