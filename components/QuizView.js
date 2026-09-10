'use client';

import { useState } from 'react';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizView({ questions, accentClass, accentBg, onFinish }) {
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [done, setDone] = useState(false);

  const q = questions[qi];
  const answered = answers[qi] !== null;
  const score = answers.filter((a, i) => a === questions[i].correctIndex).length;

  function choose(i) {
    if (answered) return;
    const next = [...answers];
    next[qi] = i;
    setAnswers(next);
  }

  function advance() {
    if (qi + 1 < questions.length) {
      setQi(qi + 1);
    } else {
      const finalScore = answers.filter((a, i) => a === questions[i].correctIndex).length;
      setDone(true);
      onFinish(finalScore, questions.length);
    }
  }

  function restart() {
    setQi(0);
    setAnswers(Array(questions.length).fill(null));
    setDone(false);
  }

  if (done) {
    const finalScore = answers.filter((a, i) => a === questions[i].correctIndex).length;
    return (
      <div className="rounded-2xl border border-line bg-card px-6 py-10 text-center sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Quiz complete
        </p>
        <p className="mt-3 font-serif text-4xl font-semibold text-ink">
          {finalScore} / {questions.length}
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          {finalScore === questions.length
            ? 'Perfect score.'
            : finalScore / questions.length >= 0.6
            ? 'Solid grasp of this class — worth a quick review of the ones you missed.'
            : 'Worth another pass through the class slides before moving on.'}
        </p>

        <div className="mt-6 space-y-2 text-left">
          {questions.map((qq, i) => {
            const correct = answers[i] === qq.correctIndex;
            return (
              <div key={qq.id} className="flex items-start gap-2 text-sm">
                <span className={correct ? 'text-emerald-600' : 'text-mark'}>{correct ? '✓' : '✕'}</span>
                <span className="text-ink-soft">{qq.question}</span>
              </div>
            );
          })}
        </div>

        <button
          onClick={restart}
          className="mt-7 rounded-md border border-line px-5 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Retake quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs text-ink-faint">
        <span>
          Question {qi + 1} of {questions.length}
        </span>
        <span>Score so far: {score}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${accentBg} transition-[width] duration-300 ease-out`}
          style={{ width: `${((qi + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-card px-6 py-8 sm:px-10 sm:py-10">
        <h3 className="font-serif text-xl font-semibold leading-snug text-ink sm:text-2xl">
          {q.question}
        </h3>

        <div className="mt-6 space-y-2.5">
          {q.options.map((opt, i) => {
            const isSelected = answers[qi] === i;
            const isCorrectOpt = i === q.correctIndex;
            let style = 'border-line text-ink-soft hover:border-ink-faint';
            if (answered && isCorrectOpt) style = 'border-emerald-500/50 bg-emerald-50 text-ink';
            else if (answered && isSelected && !isCorrectOpt) style = 'border-mark/50 bg-mark/[0.05] text-ink';

            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={answered}
                className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-[15px] leading-relaxed transition-colors ${style} ${
                  answered ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className="mt-0.5 shrink-0 rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-ink-faint">
                  {LETTERS[i]}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-5 rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink-soft">
            <span className="font-medium text-ink">
              {answers[qi] === q.correctIndex ? 'Correct. ' : 'Not quite. '}
            </span>
            {q.explanation}
          </div>
        )}

        {answered && (
          <button
            onClick={advance}
            className="mt-6 rounded-md bg-ink px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            {qi + 1 < questions.length ? 'Next question' : 'See results'}
          </button>
        )}
      </div>
    </div>
  );
}
