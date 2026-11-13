'use client';

import Link from 'next/link';
import { CLASSES, slideCount, classTitle, classBlurb } from '../data/classes';
import { useLang } from '../lib/LanguageProvider';
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
  const { t, lang } = useLang();

  const completedCount = ready
    ? CLASSES.filter((c) => classStatus(progress.classes[c.id], slideCount(c.id)) === 'done').length
    : 0;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:pt-16">
      <section className="mb-14 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink-faint">
          {t('home.kicker')}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.15] text-ink sm:text-5xl">
          {t('home.title1')}
          <br />
          {t('home.title2')}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          {t('home.intro')}
        </p>
        {ready && (
          <p className="mt-5 text-sm text-ink-faint">
            {completedCount === 0 && t('home.notStarted')}
            {completedCount > 0 && completedCount < 5 && t('home.someDone', { n: completedCount })}
            {completedCount === 5 && t('home.allDone')}
          </p>
        )}
        {authReady && !auth.loggedIn && (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-card px-4 py-3 text-sm">
            <span className="text-ink-soft">
              {t('home.loginPrompt')}
            </span>
            <Link href="/login" className="shrink-0 font-medium text-mark hover:underline">
              {t('header.login')}
            </Link>
          </div>
        )}
      </section>

      <a
        href="https://www.asime.online/ja/#materials"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="textbook-banner"
        className="group mb-10 flex flex-col gap-4 rounded-2xl bg-ink px-5 py-5 text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6"
      >
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mark text-2xl"
          >
            &#128214;
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              {t('tb.kicker')}
            </p>
            <p className="mt-1 font-serif text-xl font-semibold leading-snug sm:text-2xl">
              {t('tb.title')}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              {t('tb.desc')}
            </p>
          </div>
        </div>
        <span className="flex min-h-[44px] shrink-0 items-center justify-center rounded-lg bg-white px-5 text-sm font-semibold text-ink group-hover:bg-white/90">
          {t('tb.cta')}
        </span>
      </a>

      <section aria-label="Classes" className="space-y-3">
        {CLASSES.map((c) => {
          const entry = progress.classes[c.id];
          const total = slideCount(c.id);
          const status = ready ? classStatus(entry, total) : 'new';
          const pct = ready && entry ? Math.min(1, (entry.maxSlide + 1) / total) : 0;
          const quizBest = entry?.quizBest;

          const ctaLabel = status === 'done' ? t('cta.review') : status === 'progress' ? t('cta.continue') : t('cta.start');

          return (
            <div
              key={c.id}
              className={`group flex flex-col gap-4 border-l-2 bg-card p-5 transition-colors sm:flex-row sm:items-center sm:gap-6 sm:p-6 ${ACCENT_BORDER[c.id]}`}
            >
              <div className={`font-serif text-3xl font-semibold tabular-nums ${ACCENT_TEXT[c.id]} sm:w-14`}>
                {String(c.id).padStart(2, '0')}
              </div>

              <div className="flex-1">
                <h2 className="font-serif text-xl font-semibold text-ink">{classTitle(c, lang)}</h2>
                <p className="mt-0.5 text-sm text-ink-soft">{classBlurb(c, lang)}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="w-40 max-w-[40vw]">
                    <ProgressBar value={pct} colorClass={ACCENT_BAR[c.id]} />
                  </div>
                  <span className="text-xs text-ink-faint">{t('home.slides', { n: total })}</span>
                  {quizBest && (
                    <span className="text-xs text-ink-faint">
                      · {t('home.quizBest', { s: quizBest.score, t: quizBest.total })}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex gap-1 text-sm">
                  <Link href={`/class/${c.id}/write`} className="-ml-1 rounded px-2 py-2 text-ink-faint hover:text-ink-soft">
                    {t('nav.writing')}
                  </Link>
                  <Link href={`/class/${c.id}/chat`} className="rounded px-2 py-2 text-ink-faint hover:text-ink-soft">
                    {t('nav.discussion')}
                  </Link>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/class/${c.id}`}
                  className="flex min-h-[44px] items-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  {ctaLabel}
                </Link>
                <Link
                  href={`/class/${c.id}/quiz`}
                  className="flex min-h-[44px] items-center rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {t('nav.quiz')}
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      <div className="mt-16 text-center">
        <Link href="/tutor" className="inline-block px-3 py-3 text-sm text-ink-faint hover:text-ink-soft">
          {t('home.instructor')}
        </Link>
      </div>
    </div>
  );
}
