'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TutorLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/tutor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Incorrect password.');
        setBusy(false);
        return;
      }
      router.push('/tutor/dashboard');
    } catch {
      setError('Something went wrong. Try again.');
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">Instructor</p>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-ink">Tutor dashboard</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Roster, progress, quiz scores, and writing submissions for all students.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        <input
          autoFocus
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-line bg-card px-3 py-2.5 text-ink outline-none focus-visible:border-mark"
        />
        {error && <p className="text-sm text-mark">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
