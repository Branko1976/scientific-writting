'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getClass } from '../../../../data/classes';
import { writingTask } from '../../../../data/writingTasks';
import { useLang } from '../../../../lib/LanguageProvider';
import { useProgress } from '../../../../lib/ProgressProvider';

const ACCENT_TEXT = {
  1: 'text-class-1',
  2: 'text-class-2',
  3: 'text-class-3',
  4: 'text-class-4',
  5: 'text-class-5',
};

export default function ClassWritePage({ params }) {
  const classId = Number(params.id);
  const cls = getClass(classId);
  const { t, lang } = useLang();
  const task = writingTask(classId, lang);
  const { auth, authReady } = useProgress();

  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | saved | saving | error
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (!authReady || !auth.loggedIn) return;
    setStatus('loading');
    fetch(`/api/writing?classId=${classId}`)
      .then((r) => r.json())
      .then((data) => {
        setContent(data.content || '');
        setStatus('idle');
      })
      .catch(() => setStatus('idle'));
  }, [authReady, auth.loggedIn, classId]);

  const save = useCallback(async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, content }),
      });
      if (!res.ok) throw new Error();
      setStatus('saved');
      setShowCheck(true);
    } catch {
      setStatus('error');
    }
  }, [classId, content]);

  if (!cls || !task) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="text-ink-soft">{t('common.noClass')}</p>
        <Link href="/" className="mt-4 inline-block text-mark underline">
          {t('common.backCourse')}
        </Link>
      </div>
    );
  }

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
      <div className="mb-6 flex items-center justify-between text-sm">
        <Link href={`/class/${classId}`} className="-my-2 inline-block py-2 pr-2 text-ink-faint hover:text-ink">
          {t('common.backSlides')}
        </Link>
        <span className={`font-medium ${ACCENT_TEXT[classId]}`}>{t('write.header', { n: classId })}</span>
      </div>

      <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{task.title}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{task.prompt}</p>

      {authReady && !auth.loggedIn ? (
        <div className="mt-8 rounded-lg border border-line bg-card px-5 py-6 text-center">
          <p className="text-sm text-ink-soft">{t('write.login')}</p>
          <Link
            href={`/login?next=${encodeURIComponent(`/class/${classId}/write`)}`}
            className="mt-3 inline-block rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {t('header.login')}
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setStatus('idle');
              setShowCheck(false);
            }}
            placeholder={task.placeholder}
            rows={10}
            className="w-full rounded-lg border border-line bg-card px-4 py-3 text-[15px] leading-relaxed text-ink outline-none focus-visible:border-mark"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-ink-faint">
            <span>{t('write.words', { n: words })}</span>
            <span>
              {status === 'saving' && t('write.saving')}
              {status === 'saved' && t('write.saved')}
              {status === 'error' && <span className="text-mark">{t('write.error')}</span>}
            </span>
          </div>

          <button
            onClick={save}
            disabled={status === 'saving' || !content.trim()}
            className="mt-3 rounded-md bg-ink px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {t('write.save')}
          </button>

          {showCheck && (
            <div className="mt-6 rounded-lg border border-line bg-paper px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                {t('write.checkHeading')}
              </p>
              <ul className="mt-2 space-y-1.5">
                {task.selfCheck.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-soft">
                    <span className="text-ink-faint">&middot;</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
