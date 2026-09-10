'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import allSlides from '../../../data/slides.json';
import { getClass, slideCount } from '../../../data/classes';
import { useProgress } from '../../../lib/ProgressProvider';
import SlideView from '../../../components/SlideView';

const ACCENT_BAR = {
  1: 'bg-class-1',
  2: 'bg-class-2',
  3: 'bg-class-3',
  4: 'bg-class-4',
  5: 'bg-class-5',
};
const ACCENT_TEXT = {
  1: 'text-class-1',
  2: 'text-class-2',
  3: 'text-class-3',
  4: 'text-class-4',
  5: 'text-class-5',
};

export default function ClassSlidesPage({ params }) {
  const classId = Number(params.id);
  const cls = getClass(classId);
  const router = useRouter();
  const { progress, ready, recordSlide } = useProgress();

  const slides = useMemo(
    () => (cls ? allSlides.filter((s) => s.classId === classId) : []),
    [classId, cls]
  );
  const total = slides.length;

  const [index, setIndex] = useState(0);
  const initialized = useRef(false);
  const touchX = useRef(null);

  useEffect(() => {
    if (!ready || initialized.current || !cls) return;
    const saved = progress.classes[classId]?.lastSlide || 0;
    setIndex(Math.min(Math.max(saved, 0), total - 1));
    initialized.current = true;
  }, [ready, cls, classId, progress.classes, total]);

  useEffect(() => {
    if (!initialized.current) return;
    recordSlide(classId, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goNext = useCallback(() => setIndex((i) => Math.min(i + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  if (!cls) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="text-ink-soft">That class doesn&rsquo;t exist.</p>
        <Link href="/" className="mt-4 inline-block text-mark underline">
          Back to course
        </Link>
      </div>
    );
  }

  const slide = slides[index];
  const isLast = index === total - 1;
  const pct = total ? (index + 1) / total : 0;

  const currentPart = (() => {
    let label = null;
    for (let i = 0; i <= index; i++) {
      if (slides[i].kind === 'divider') label = slides[i].title;
    }
    return label;
  })();

  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchX.current = null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8">
      <div className="mb-4 flex items-center justify-between text-sm">
        <Link href="/" className="text-ink-faint hover:text-ink">
          &larr; All classes
        </Link>
        <span className={`font-medium ${ACCENT_TEXT[classId]}`}>
          Class {classId} &middot; {cls.title}
        </span>
      </div>

      <div className="mb-4 flex gap-2 text-xs">
        <Link
          href={`/class/${classId}/write`}
          className="rounded-full border border-line px-3 py-1 text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Writing task
        </Link>
        <Link
          href={`/class/${classId}/chat`}
          className="rounded-full border border-line px-3 py-1 text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Discussion
        </Link>
        <Link
          href={`/class/${classId}/quiz`}
          className="rounded-full border border-line px-3 py-1 text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Quiz
        </Link>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${ACCENT_BAR[classId]} transition-[width] duration-300 ease-out`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-xs text-ink-faint">
        <span>{currentPart || '\u00A0'}</span>
        <span>
          Slide {index + 1} of {total}
        </span>
      </div>

      <div
        className="mt-4 min-h-[420px] rounded-2xl border border-line bg-card shadow-slide sm:min-h-[480px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <SlideView slide={slide} classId={classId} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-30"
          >
            Back
          </button>

          {isLast ? (
            <button
              onClick={() => router.push(`/class/${classId}/quiz`)}
              className="rounded-md bg-mark px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Take the quiz &rarr;
            </button>
          ) : (
            <button
              onClick={goNext}
              className="rounded-md bg-ink px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
