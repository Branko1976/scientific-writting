'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const INTERVAL_MS = 10000;

function clock(d) {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
}

// Re-fetches the server-rendered dashboard on a timer so new student activity
// shows up without a manual reload. Open <details>, scroll positions and the
// reset-confirm box are preserved because router.refresh() only re-renders
// the server output; it does not remount client state.
export default function AutoRefresh() {
  const router = useRouter();
  const [live, setLive] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef(null);

  const refresh = useCallback(() => {
    setRefreshing(true);
    router.refresh();
    setUpdatedAt(new Date());
    setTimeout(() => setRefreshing(false), 600);
  }, [router]);

  useEffect(() => {
    setUpdatedAt(new Date());
  }, []);

  useEffect(() => {
    if (!live) return undefined;

    function start() {
      clearInterval(timer.current);
      timer.current = setInterval(() => {
        if (document.visibilityState === 'visible') refresh();
      }, INTERVAL_MS);
    }

    function onVisibility() {
      // Catch up immediately when the tab becomes visible again.
      if (document.visibilityState === 'visible') {
        refresh();
        start();
      }
    }

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(timer.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [live, refresh]);

  return (
    <div className="flex flex-wrap items-center gap-x-1 text-xs text-ink-faint [&_button]:whitespace-nowrap" data-testid="auto-refresh">
      <span className="mr-2 flex items-center gap-1.5">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            live ? (refreshing ? 'bg-emerald-400' : 'bg-emerald-600') : 'bg-ink-faint'
          }`}
        />
        {live ? 'Live' : 'Paused'}
        {updatedAt && <span> &middot; updated {clock(updatedAt)}</span>}
      </span>
      <button onClick={refresh} className="min-h-[40px] px-2 hover:text-ink">
        Refresh now
      </button>
      <button onClick={() => setLive((v) => !v)} className="min-h-[40px] px-2 hover:text-ink">
        {live ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
