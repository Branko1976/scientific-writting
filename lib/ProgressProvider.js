'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  loadProgress,
  setLastSlide as persistLastSlide,
  setQuizResult as persistQuizResult,
  saveProgress,
} from './storage';

const ProgressContext = createContext(null);

async function postJson(url, body) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch {
    return null;
  }
}

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState({ name: '', classes: {} });
  const [ready, setReady] = useState(false);
  const [auth, setAuth] = useState({ loggedIn: false, name: '', id: null });
  const [authReady, setAuthReady] = useState(false);
  const merged = useRef(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  // Check session, then merge server-side progress into the local cache once.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.loggedIn) {
          setAuth({ loggedIn: true, name: data.name, id: data.id });
          await mergeFromServer();
        }
      } catch {
        /* stay logged out */
      } finally {
        setAuthReady(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function mergeFromServer() {
    if (merged.current) return;
    merged.current = true;
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      if (!data.loggedIn) return;

      const local = loadProgress();
      const next = { name: data.name, classes: { ...local.classes } };

      for (const [classId, serverEntry] of Object.entries(data.classes)) {
        const localEntry = local.classes[classId] || { lastSlide: 0, maxSlide: 0, quizBest: null };
        const useServerSlide = (serverEntry.maxSlide ?? 0) > (localEntry.maxSlide ?? 0);
        const localRatio = localEntry.quizBest ? localEntry.quizBest.score / localEntry.quizBest.total : -1;
        const serverRatio = serverEntry.quizBest ? serverEntry.quizBest.score / serverEntry.quizBest.total : -1;

        next.classes[classId] = {
          lastSlide: useServerSlide ? serverEntry.lastSlide : localEntry.lastSlide,
          maxSlide: Math.max(serverEntry.maxSlide ?? 0, localEntry.maxSlide ?? 0),
          quizBest: serverRatio >= localRatio ? serverEntry.quizBest : localEntry.quizBest,
        };
      }

      saveProgress(next);
      setProgress(next);

      // Push the merged result back up so both sides agree.
      for (const [classId, entry] of Object.entries(next.classes)) {
        postJson('/api/state/slide', { classId: Number(classId), position: entry.maxSlide });
        if (entry.quizBest) {
          postJson('/api/state/quiz', {
            classId: Number(classId),
            score: entry.quizBest.score,
            total: entry.quizBest.total,
          });
        }
      }
    } catch {
      /* best-effort merge; local progress still works */
    }
  }

  const recordSlide = useCallback(
    (classId, position) => {
      const entry = persistLastSlide(classId, position);
      setProgress((prev) => ({ ...prev, classes: { ...prev.classes, [String(classId)]: entry } }));
      if (auth.loggedIn) postJson('/api/state/slide', { classId, position });
    },
    [auth.loggedIn]
  );

  const recordQuiz = useCallback(
    (classId, score, total) => {
      const entry = persistQuizResult(classId, score, total);
      setProgress((prev) => ({ ...prev, classes: { ...prev.classes, [String(classId)]: entry } }));
      if (auth.loggedIn) postJson('/api/state/quiz', { classId, score, total });
    },
    [auth.loggedIn]
  );

  const login = useCallback(async (name, pin) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, pin }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Could not log in.' };
    setAuth({ loggedIn: true, name: data.name, id: data.id });
    merged.current = false;
    await mergeFromServer();
    return { ok: true, created: data.created };
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuth({ loggedIn: false, name: '', id: null });
    merged.current = false;
  }, []);

  return (
    <ProgressContext.Provider
      value={{ progress, ready, auth, authReady, recordSlide, recordQuiz, login, logout }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
