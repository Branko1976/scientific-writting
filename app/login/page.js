'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProgress } from '../../lib/ProgressProvider';
import { useLang } from '../../lib/LanguageProvider';
import { translateServerError } from '../../lib/i18n';

export default function LoginPage() {
  const router = useRouter();
  const { login, auth, authReady } = useProgress();
  const { t, lang } = useLang();

  const [next, setNext] = useState('/');
  const [step, setStep] = useState('name'); // 'name' | 'pin'
  const [name, setName] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNext(params.get('next') || '/');
  }, []);

  useEffect(() => {
    if (authReady && auth.loggedIn) router.replace(next);
  }, [authReady, auth.loggedIn, next, router]);

  async function handleNameSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError(t('login.errName'));
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/check?name=${encodeURIComponent(name.trim())}`);
      const data = await res.json();
      setIsNew(!data.exists);
      setStep('pin');
    } catch {
      setError(t('login.errGeneric'));
    } finally {
      setBusy(false);
    }
  }

  async function handlePinSubmit(e) {
    e.preventDefault();
    setError('');
    if (!/^\d{4}$/.test(pin)) {
      setError(t('login.errPin'));
      return;
    }
    if (isNew && pin !== confirmPin) {
      setError(t('login.errMismatch'));
      return;
    }
    setBusy(true);
    const result = await login(name.trim(), pin);
    setBusy(false);
    if (!result.ok) {
      setError(translateServerError(lang, result.error));
      return;
    }
    router.replace(next);
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
        {t('login.kicker')}
      </p>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">
        {step === 'name' ? t('login.signIn') : isNew ? t('login.choosePin') : t('login.enterPin')}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {step === 'name'
          ? t('login.nameHelp')
          : isNew
          ? t('login.firstTime', { name: name.trim() })
          : t('login.welcomeBack', { name: name.trim() })}
      </p>

      {step === 'name' && (
        <form onSubmit={handleNameSubmit} className="mt-6 space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('login.namePlaceholder')}
            maxLength={40}
            className="w-full rounded-md border border-line bg-card px-3 py-2.5 text-ink outline-none focus-visible:border-mark"
          />
          {error && <p className="text-sm text-mark">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {t('login.continue')}
          </button>
        </form>
      )}

      {step === 'pin' && (
        <form onSubmit={handlePinSubmit} className="mt-6 space-y-3">
          <input
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder={t('login.pinPlaceholder')}
            inputMode="numeric"
            maxLength={4}
            className="w-full rounded-md border border-line bg-card px-3 py-2.5 tracking-[0.3em] text-ink outline-none focus-visible:border-mark"
          />
          {isNew && (
            <input
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder={t('login.confirmPlaceholder')}
              inputMode="numeric"
              maxLength={4}
              className="w-full rounded-md border border-line bg-card px-3 py-2.5 tracking-[0.3em] text-ink outline-none focus-visible:border-mark"
            />
          )}
          {error && <p className="text-sm text-mark">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isNew ? t('login.create') : t('login.login')}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('name');
              setPin('');
              setConfirmPin('');
              setError('');
            }}
            className="w-full py-3 text-center text-sm text-ink-faint hover:text-ink-soft"
          >
            {t('login.notYou')}
          </button>
        </form>
      )}

      <p className="mt-8 text-xs text-ink-faint">
        {t('login.pinNote')}
      </p>

      <Link href="/" className="mt-4 inline-block py-2 text-sm text-ink-faint hover:text-ink">
        {t('login.back')}
      </Link>
    </div>
  );
}
