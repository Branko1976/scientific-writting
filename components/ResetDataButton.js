'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetDataButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleReset() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/tutor/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: confirmText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not reset.');
      setDone(true);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div className="rounded-lg border border-mark/30 bg-mark/[0.04] px-5 py-4">
        <p className="text-sm font-medium text-ink">Danger zone</p>
        <p className="mt-1 text-sm text-ink-soft">
          Permanently deletes every student account, all progress, quiz scores, writing
          submissions, and chat messages. Use this once, right before real students start.
        </p>
        {done && <p className="mt-2 text-sm text-emerald-700">All data cleared.</p>}
        <button
          onClick={() => setOpen(true)}
          className="mt-3 rounded-md border border-mark/40 px-4 py-2 text-sm font-medium text-mark transition-colors hover:bg-mark/[0.06]"
        >
          Reset all data&hellip;
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-mark/40 bg-mark/[0.05] px-5 py-4">
      <p className="text-sm font-medium text-ink">
        Type <span className="font-mono">RESET</span> to permanently delete all student data
      </p>
      <input
        autoFocus
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="RESET"
        className="mt-2 w-40 rounded-md border border-line bg-card px-3 py-2 text-sm outline-none focus-visible:border-mark"
      />
      {error && <p className="mt-2 text-sm text-mark">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleReset}
          disabled={confirmText !== 'RESET' || busy}
          className="rounded-md bg-mark px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {busy ? 'Resetting\u2026' : 'Permanently delete everything'}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setConfirmText('');
            setError('');
          }}
          className="rounded-md border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
