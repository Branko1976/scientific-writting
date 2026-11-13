'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Clears all student data. One button: the first click arms it, the second
// click (within a few seconds) performs the reset. No typing needed.
export default function ResetDataButton() {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!armed) return undefined;
    const id = setTimeout(() => setArmed(false), 6000);
    return () => clearTimeout(id);
  }, [armed]);

  async function handleClick() {
    if (!armed) {
      setArmed(true);
      setDone(false);
      setError('');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/tutor/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'RESET' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not reset.');
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      setArmed(false);
    }
  }

  return (
    <div className="rounded-lg border border-mark/30 bg-mark/[0.04] px-5 py-4" data-testid="reset-box">
      <p className="text-sm font-medium text-ink">Reset class data</p>
      <p className="mt-1 text-sm text-ink-soft">
        Deletes every student account, all progress, quiz scores, task answers, writing
        submissions and chat messages. Export the results first if you need them for grading.
      </p>
      {done && <p className="mt-2 text-sm text-emerald-700" data-testid="reset-done">All data cleared.</p>}
      {error && <p className="mt-2 text-sm text-mark">{error}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={handleClick}
          disabled={busy}
          data-testid="reset-button"
          className={`min-h-[44px] rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
            armed ? 'bg-mark text-white hover:opacity-90' : 'border border-mark/40 text-mark hover:bg-mark/[0.06]'
          }`}
        >
          {busy ? 'Resetting\u2026' : armed ? 'Click again to delete everything' : 'Reset all data'}
        </button>
        {armed && !busy && (
          <button
            onClick={() => setArmed(false)}
            className="min-h-[44px] rounded-md border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
