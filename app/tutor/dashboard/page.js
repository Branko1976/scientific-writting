import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readTutorToken, TUTOR_COOKIE } from '../../../lib/auth';
import {
  listStudents,
  getAllProgress,
  getAllQuiz,
  getAllWriting,
  getChatMessages,
  isDbConfigured,
} from '../../../lib/db';
import { CLASSES, slideCount } from '../../../data/classes';
import TutorLogoutButton from '../../../components/TutorLogoutButton';
import ResetDataButton from '../../../components/ResetDataButton';

export const dynamic = 'force-dynamic';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default async function TutorDashboardPage() {
  const token = cookies().get(TUTOR_COOKIE)?.value;
  if (!readTutorToken(token)) redirect('/tutor');

  const [students, allProgress, allQuiz, allWriting] = await Promise.all([
    listStudents(),
    getAllProgress(),
    getAllQuiz(),
    getAllWriting(),
  ]);

  const chatByClass = {};
  for (const c of CLASSES) {
    chatByClass[c.id] = await getChatMessages(c.id, 0);
  }

  const progressLookup = {};
  for (const p of allProgress) progressLookup[`${p.studentId}:${p.classId}`] = p;
  const quizLookup = {};
  for (const q of allQuiz) quizLookup[`${q.studentId}:${q.classId}`] = q;

  const writingByClass = {};
  for (const c of CLASSES) writingByClass[c.id] = allWriting.filter((w) => w.classId === c.id);

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">Instructor</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-ink">Tutor Dashboard</h1>
        </div>
        <TutorLogoutButton />
      </div>

      {!isDbConfigured() && (
        <div className="mb-8 rounded-lg border border-mark/40 bg-mark/[0.05] px-4 py-3 text-sm text-ink">
          No database is connected yet, so this is showing in-memory dev data only, and it will not
          persist or be shared correctly in production. Connect a Postgres database in your Vercel
          project&rsquo;s Storage tab and redeploy.
        </div>
      )}

      <section className="mb-12">
        <h2 className="font-serif text-xl font-semibold text-ink">Roster &amp; Progress</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {students.length} student{students.length === 1 ? '' : 's'} registered. Cells show slides
          viewed / quiz score.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-paper">
                <th className="px-4 py-2.5 font-semibold text-ink">Student</th>
                {CLASSES.map((c) => (
                  <th key={c.id} className="px-4 py-2.5 font-semibold text-ink">
                    Class {c.id}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-ink-faint">
                    No students have signed in yet.
                  </td>
                </tr>
              )}
              {students.map((s, i) => (
                <tr key={s.id} className={i % 2 ? 'bg-card' : 'bg-paper/60'}>
                  <td className="border-t border-line px-4 py-2.5 font-medium text-ink">{s.name}</td>
                  {CLASSES.map((c) => {
                    const prog = progressLookup[`${s.id}:${c.id}`];
                    const quiz = quizLookup[`${s.id}:${c.id}`];
                    const total = slideCount(c.id);
                    const viewed = prog ? prog.maxSlide + 1 : 0;
                    return (
                      <td key={c.id} className="border-t border-line px-4 py-2.5 align-top text-ink-soft">
                        <div>
                          {viewed}/{total} slides
                        </div>
                        <div className="text-xs text-ink-faint">
                          {quiz ? `Quiz ${quiz.score}/${quiz.total}` : 'No quiz yet'}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-xl font-semibold text-ink">Writing Submissions</h2>
        <div className="mt-4 space-y-6">
          {CLASSES.map((c) => (
            <div key={c.id}>
              <h3 className="text-sm font-semibold text-ink">
                Class {c.id} &middot; {c.title}
              </h3>
              {writingByClass[c.id].length === 0 ? (
                <p className="mt-1.5 text-sm text-ink-faint">No submissions yet.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {writingByClass[c.id].map((w) => (
                    <details key={`${w.studentId}-${w.classId}`} className="rounded-lg border border-line bg-card px-4 py-2.5">
                      <summary className="cursor-pointer text-sm font-medium text-ink">
                        {w.studentName}{' '}
                        <span className="font-normal text-ink-faint">&middot; {formatDate(w.updatedAt)}</span>
                      </summary>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                        {w.content}
                      </p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold text-ink">Class Discussions</h2>
        <p className="mt-1 text-sm text-ink-soft">Read-only view of each class&rsquo;s chat.</p>
        <div className="mt-4 space-y-6">
          {CLASSES.map((c) => (
            <div key={c.id}>
              <h3 className="text-sm font-semibold text-ink">
                Class {c.id} &middot; {c.title}
              </h3>
              {chatByClass[c.id].length === 0 ? (
                <p className="mt-1.5 text-sm text-ink-faint">No messages yet.</p>
              ) : (
                <div className="mt-2 max-h-64 space-y-2 overflow-y-auto rounded-lg border border-line bg-card px-4 py-3">
                  {chatByClass[c.id].map((m) => (
                    <div key={m.id} className="text-sm">
                      <span className="font-medium text-ink">
                        {m.studentId == null ? 'Instructor' : m.authorName}
                      </span>{' '}
                      <span className="text-ink-faint">&middot; {formatDate(m.createdAt)}</span>
                      <p className="text-ink-soft">{m.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <ResetDataButton />
      </section>
    </div>
  );
}
