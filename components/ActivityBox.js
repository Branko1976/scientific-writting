'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLang } from '../lib/LanguageProvider';

// Answer box shown under in-class task slides (the orange slides in the deck).
// Saves automatically a moment after the student stops typing.
export default function ActivityBox({ slideN, initial, loggedIn, onSaved }) {
  const { t } = useLang();
  const [text, setText] = useState(initial || '');
  const [status, setStatus] = useState('idle'); // idle | saving | saved | error
  const timer = useRef(null);
  const latest = useRef(initial || '');

  useEffect(() => {
    setText(initial || '');
    latest.current = initial || '';
    setStatus('idle');
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideN]);

  async function save(value) {
    setStatus('saving');
    try {
      const res = await fetch('/api/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slideN, content: value }),
      });
      if (!res.ok) throw new Error('save failed');
      if (latest.current === value) setStatus('saved');
      onSaved?.(slideN, value);
    } catch {
      setStatus('error');
    }
  }

  function onChange(e) {
    const value = e.target.value;
    setText(value);
    latest.current = value;
    setStatus('idle');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save(value), 900);
  }

  function onBlur() {
    clearTimeout(timer.current);
    if (status === 'idle' && latest.current !== (initial || '')) save(latest.current);
  }

  if (!loggedIn) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-line bg-card px-4 py-3 text-sm text-ink-soft" data-testid="activity-login">
        <Link href="/login" className="font-medium text-mark underline">{t('act.loginLink')}</Link>{t('act.loginRest')}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-mark/40 bg-card p-4" data-testid="activity-box">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`act-${slideN}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-mark">
          {t('act.label')}
        </label>
        <span className="text-xs text-ink-faint" aria-live="polite" data-testid="activity-status">
          {status === 'saving' && t('act.saving')}
          {status === 'saved' && t('act.saved')}
          {status === 'error' && <span className="text-mark">{t('act.error')}</span>}
        </span>
      </div>
      <textarea
        id={`act-${slideN}`}
        value={text}
        onChange={onChange}
        onBlur={onBlur}
        rows={3}
        maxLength={2000}
        placeholder={t('act.placeholder')}
        className="mt-2 w-full resize-y rounded-lg border border-line bg-paper px-3 py-2.5 text-base leading-relaxed text-ink outline-none focus:border-mark"
      />
      <p className="mt-1 text-xs text-ink-faint">{t('act.note')}</p>
    </div>
  );
}
