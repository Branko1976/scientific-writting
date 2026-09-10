'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProgress } from '../../lib/ProgressProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login, auth, authReady } = useProgress();

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
      setError('Enter your name.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/check?name=${encodeURIComponent(name.trim())}`);
      const data = await res.json();
      setIsNew(!data.exists);
      setStep('pin');
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handlePinSubmit(e) {
    e.preventDefault();
    setError('');
    if (!/^\d{4}$/.test(pin)) {
      setError('PIN must be 4 digits.');
      return;
    }
    if (isNew && pin !== confirmPin) {
      setError('PINs don\u2019t match.');
      return;
    }
    setBusy(true);
    const result = await login(name.trim(), pin);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace(next);
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
        Honours Student Program
      </p>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">
        {step === 'name' ? 'Sign in' : isNew ? 'Choose a PIN' : 'Enter your PIN'}
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        {step === 'name'
          ? 'Use the name you want your instructor to see on the class roster.'
          : isNew
          ? `First time for "${name.trim()}" \u2014 pick a 4-digit PIN so it's yours next time.`
          : `Welcome back, ${name.trim()}.`}
      </p>

      {step === 'name' && (
        <form onSubmit={handleNameSubmit} className="mt-6 space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={40}
            className="w-full rounded-md border border-line bg-card px-3 py-2.5 text-ink outline-none focus-visible:border-mark"
          />
          {error && <p className="text-sm text-mark">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      )}

      {step === 'pin' && (
        <form onSubmit={handlePinSubmit} className="mt-6 space-y-3">
          <input
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="4-digit PIN"
            inputMode="numeric"
            maxLength={4}
            className="w-full rounded-md border border-line bg-card px-3 py-2.5 tracking-[0.3em] text-ink outline-none focus-visible:border-mark"
          />
          {isNew && (
            <input
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Confirm PIN"
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
            {isNew ? 'Create account' : 'Log in'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('name');
              setPin('');
              setConfirmPin('');
              setError('');
            }}
            className="w-full text-center text-xs text-ink-faint hover:text-ink-soft"
          >
            Not you? Use a different name
          </button>
        </form>
      )}

      <p className="mt-8 text-xs text-ink-faint">
        This PIN just keeps your own progress separate from your classmates&rsquo; &mdash; it
        isn&rsquo;t a security password, so don&rsquo;t reuse one you care about.
      </p>

      <Link href="/" className="mt-6 inline-block text-sm text-ink-faint hover:text-ink">
        &larr; Back without signing in
      </Link>
    </div>
  );
}
