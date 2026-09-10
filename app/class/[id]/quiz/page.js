'use client';

import Link from 'next/link';
import quizzes from '../../../../data/quizzes.json';
import { getClass } from '../../../../data/classes';
import { useProgress } from '../../../../lib/ProgressProvider';
import QuizView from '../../../../components/QuizView';

const ACCENT_TEXT = {
  1: 'text-class-1',
  2: 'text-class-2',
  3: 'text-class-3',
  4: 'text-class-4',
  5: 'text-class-5',
};
const ACCENT_BG = {
  1: 'bg-class-1',
  2: 'bg-class-2',
  3: 'bg-class-3',
  4: 'bg-class-4',
  5: 'bg-class-5',
};

export default function ClassQuizPage({ params }) {
  const classId = Number(params.id);
  const cls = getClass(classId);
  const questions = quizzes[String(classId)] || [];
  const { recordQuiz } = useProgress();

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

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
      <div className="mb-6 flex items-center justify-between text-sm">
        <Link href={`/class/${classId}`} className="text-ink-faint hover:text-ink">
          &larr; Back to slides
        </Link>
        <span className={`font-medium ${ACCENT_TEXT[classId]}`}>
          Class {classId} Quiz
        </span>
      </div>

      <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{cls.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {questions.length} quick checks drawn straight from this class&rsquo;s slides.
      </p>

      {questions.length === 0 ? (
        <p className="mt-8 text-ink-soft">No quiz questions yet for this class.</p>
      ) : (
        <div className="mt-6">
          <QuizView
            questions={questions}
            accentClass={ACCENT_TEXT[classId]}
            accentBg={ACCENT_BG[classId]}
            onFinish={(score, total) => recordQuiz(classId, score, total)}
          />
        </div>
      )}
    </div>
  );
}
