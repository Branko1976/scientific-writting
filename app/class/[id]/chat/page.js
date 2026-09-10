'use client';

import Link from 'next/link';
import { getClass } from '../../../../data/classes';
import { useProgress } from '../../../../lib/ProgressProvider';
import ChatPanel from '../../../../components/ChatPanel';

const ACCENT_TEXT = {
  1: 'text-class-1',
  2: 'text-class-2',
  3: 'text-class-3',
  4: 'text-class-4',
  5: 'text-class-5',
};

export default function ClassChatPage({ params }) {
  const classId = Number(params.id);
  const cls = getClass(classId);
  const { auth, authReady } = useProgress();

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
        <span className={`font-medium ${ACCENT_TEXT[classId]}`}>Class {classId} Discussion</span>
      </div>

      <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{cls.title}</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Questions here are visible to your classmates and your instructor.
      </p>

      {authReady && !auth.loggedIn ? (
        <div className="mt-8 rounded-lg border border-line bg-card px-5 py-6 text-center">
          <p className="text-sm text-ink-soft">Log in to join the discussion.</p>
          <Link
            href={`/login?next=${encodeURIComponent(`/class/${classId}/chat`)}`}
            className="mt-3 inline-block rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Log in
          </Link>
        </div>
      ) : authReady ? (
        <div className="mt-6">
          <ChatPanel classId={classId} myName={auth.name} accentText={ACCENT_TEXT[classId]} />
        </div>
      ) : null}
    </div>
  );
}
