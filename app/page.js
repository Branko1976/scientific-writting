'use client';

import Link from 'next/link';
import { CLASSES, slideCount } from '../data/classes';
import { useProgress } from '../lib/ProgressProvider';
import ProgressBar from '../components/ProgressBar';

const ACCENT_TEXT = {
  1: 'text-class-1',
  2: 'text-class-2',
  3: 'text-class-3',
  4: 'text-class-4',
  5: 'text-class-5',
};
const ACCENT_BAR = {
  1: 'bg-class-1',
  2: 'bg-class-2',
  3: 'bg-class-3',
  4: 'bg-class-4',
  5: 'bg-class-5',
};
const ACCENT_BORDER = {
  1: 'border-class-1',
  2: 'border-class-2',
  3: 'border-class-3',
  4: 'border-class-4',
  5: 'border-class-5',
};

function classStatus(entry, total) {
  const max = entry?.maxSlide || 0;
  if (max <= 0) return 'new';
  if (max >= total - 1) return 'done';
  return 'progress';
}

export default function HomePage() {
  const { progress, ready, auth, authReady } = useProgress();

  const completedCount = ready
    ? CLASSES.filter((c) => classStatus(progress.classes[c.id], slideCount(c.id)) === 'done').length
    : 0;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:pt-16">
      <section className="mb-14 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
          Honours Student Program · Nagoya University
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.15] text-ink sm:text-5xl">
          Scientific Writing:
          <br />
          Principles and Practice
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          Five classes, sixty minutes each — from why scientific writing has its own rules to
          responding to peer review. Work through each class at your own pace, then check your
          understanding with the quick checks your instructor built into the material.
        </p>
        {ready && (
          <p className="mt-5 text-sm text-ink-faint">
            {completedCount === 0 && 'You haven\u2019t started a class yet.'}
            {completedCount > 0 && completedCount < 5 && `${completedCount} of 5 classes reviewed.`}
            {completedCount === 5 && 'All five classes reviewed — nicely done.'}
          </p>
        )}
        {authReady && !auth.loggedIn && (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-card px-4 py-3 text-sm">
            <span className="text-ink-soft">
              Log in to save your progress across devices and use the writing tasks and discussion.
            </span>
            <Link href="/login" className="shrink-0 font-medium text-mark hover:underline">
              Log in
            </Link>
          </div>
        )}
      </section>

      <section aria-label="Classes" className="space-y-3">
        {CLASSES.map((c) => {
          const entry = progress.classes[c.id];
          const total = slideCount(c.id);
          const status = ready ? classStatus(entry, total) : 'new';
          const pct = ready && entry ? Math.min(1, (entry.maxSlide + 1) / total) : 0;
          const quizBest = entry?.quizBest;

          const ctaLabel = status === 'done' ? 'Review' : status === 'progress' ? 'Continue' : 'Start class';

          return (
            <div
              key={c.id}
              className={`group flex flex-col gap-4 border-l-2 bg-card p-5 transition-colors sm:flex-row sm:items-center sm:gap-6 sm:p-6 ${ACCENT_BORDER[c.id]}`}
            >
              <div className={`font-serif text-3xl font-semibold tabular-nums ${ACCENT_TEXT[c.id]} sm:w-14`}>
                {String(c.id).padStart(2, '0')}
              </div>

              <div className="flex-1">
                <h2 className="font-serif text-xl font-semibold text-ink">{c.title}</h2>
                <p className="mt-0.5 text-sm text-ink-soft">{c.blurb}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="w-40 max-w-[40vw]">
                    <ProgressBar value={pct} colorClass={ACCENT_BAR[c.id]} />
                  </div>
                  <span className="text-xs text-ink-faint">{total} slides</span>
                  {quizBest && (
                    <span className="text-xs text-ink-faint">
                      · Quiz best {quizBest.score}/{quizBest.total}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex gap-3 text-xs">
                  <Link href={`/class/${c.id}/write`} className="text-ink-faint hover:text-ink-soft">
                    Writing task
                  </Link>
                  <Link href={`/class/${c.id}/chat`} className="text-ink-faint hover:text-ink-soft">
                    Discussion
                  </Link>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/class/${c.id}`}
                  className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  {ctaLabel}
                </Link>
                <Link
                  href={`/class/${c.id}/quiz`}
                  className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  Quiz
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-16 text-center">
        <Link href="/tutor" className="text-xs text-ink-faint hover:text-ink-soft">
          Instructor dashboard
        </Link>
      </div>
    </div>
  );
}
