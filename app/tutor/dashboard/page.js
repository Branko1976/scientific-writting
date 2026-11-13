import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readTutorToken, TUTOR_COOKIE } from '../../../lib/auth';
import {
  listStudents,
  getAllProgress,
  getAllQuiz,
  getAllWriting,
  getAllActivities,
  getChatMessages,
  isDbConfigured,
} from '../../../lib/db';
import { CLASSES, slideCount } from '../../../data/classes';
import slides from '../../../data/slides.json';

const TASK_SLIDES = slides.filter((s) => s.activity);
import TutorLogoutButton from '../../../components/TutorLogoutButton';
import ResetDataButton from '../../../components/ResetDataButton';
import AutoRefresh from '../../../components/AutoRefresh';
import { LangBadge, TranslateLink } from '../../../components/TutorBits';

export const dynamic = 'force-dynamic';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default async function TutorDashboardPage() {
  const token = cookies().get(TUTOR_COOKIE)?.value;
  if (!readTutorToken(token)) redirect('/tutor');

  const [students, allProgress, allQuiz, allWriting, allActivities] = await Promise.all([
    listStudents(),
    getAllProgress(),
    getAllQuiz(),
    getAllWriting(),
    getAllActivities(),
  ]);

  const langById = {};
  for (const s of students) langById[s.id] = s.lang || 'en';
  const jaCount = students.filter((s) => s.lang === 'ja').length;

  const answersBySlide = {};
  for (const a of allActivities) (answersBySlide[a.slideN] ||= []).push(a);

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
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-5 sm:pt-8">
      <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">Instructor</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-ink">Tutor Dashboard</h1>
        </div>
        <div className="flex flex-col items-start gap-0 sm:items-end">
          <TutorLogoutButton />
          <AutoRefresh />
        </div>
      </div>

      {!isDbConfigured() && (
        <div className="mb-8 rounded-lg border border-mark/40 bg-mark/[0.05] px-4 py-3 text-sm text-ink">
          No database is connected yet, so this is showing in-memory dev data only, and it will not
          persist or be shared correctly in production. Connect a Postgres database in your Vercel
          project&rsquo;s Storage tab and redeploy.
        </div>
      )}

      <section className="mb-10 rounded-lg border border-line bg-card px-5 py-4" data-testid="export-box">
        <h2 className="font-serif text-xl font-semibold text-ink">Export for grading</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Download spreadsheets (CSV, opens in Excel). Japanese text is kept as written.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="/api/tutor/export?type=grades"
            data-testid="export-grades"
            className="flex min-h-[44px] items-center rounded-md bg-ink px-4 text-sm font-medium text-white hover:opacity-90"
          >
            Grades summary (one row per student)
          </a>
          <a
            href="/api/tutor/export?type=answers"
            data-testid="export-answers"
            className="flex min-h-[44px] items-center rounded-md border border-line px-4 text-sm font-medium text-ink-soft hover:border-ink hover:text-ink"
          >
            All written answers (one row per answer)
          </a>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-xl font-semibold text-ink">Roster &amp; Progress</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {students.length} student{students.length === 1 ? '' : 's'} registered
          {students.length > 0 && (
            <span data-testid="lang-summary">
              {' '}&middot; {students.length - jaCount} using English, {jaCount} using Japanese
            </span>
          )}
          . Cells show slides viewed / quiz score. The EN / JA tag shows each student&rsquo;s interface language.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-paper">
                <th className="sticky left-0 z-10 border-r border-line bg-paper px-3 py-2.5 font-semibold text-ink sm:px-4">Student</th>
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
                  <td className={`sticky left-0 z-10 border-r border-t border-line px-3 py-2.5 font-medium text-ink sm:px-4 ${i % 2 ? 'bg-card' : 'bg-paper'}`}>{s.name}<LangBadge lang={s.lang} /></td>
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

      <section className="mb-12" data-testid="task-answers">
        <h2 className="font-serif text-xl font-semibold text-ink">In-Class Task Answers</h2>
        <p className="mt-1 text-sm text-ink-soft">
          What students typed on the orange task slides. Open a task to read the answers aloud or compare them.
        </p>
        <div className="mt-4 space-y-6">
          {CLASSES.map((c) => {
            const tasks = TASK_SLIDES.filter((t) => t.classId === c.id);
            return (
              <div key={c.id}>
                <h3 className="text-sm font-semibold text-ink">
                  Class {c.id} &middot; {c.title}
                </h3>
                <div className="mt-2 space-y-2">
                  {tasks.map((t) => {
                    const list = answersBySlide[t.n] || [];
                    return (
                      <details key={t.n} className="rounded-lg border border-line bg-card px-4 py-2.5">
                        <summary className="cursor-pointer text-sm text-ink">
                          <span className="font-semibold text-mark">{t.eyebrow}</span>{' '}
                          <span className="font-medium">{t.title}</span>{' '}
                          <span className="whitespace-nowrap text-ink-faint">
                            &middot; {list.length}/{students.length} answered
                          </span>
                        </summary>
                        {list.length === 0 ? (
                          <p className="mt-2 text-sm text-ink-faint">No answers yet.</p>
                        ) : (
                          <ul className="mt-2 space-y-2">
                            {list.map((a) => (
                              <li key={a.studentId} className="text-sm">
                                <span className="font-medium text-ink">{a.studentName}</span>
                                <LangBadge lang={langById[a.studentId]} />
                                <p className="whitespace-pre-wrap leading-relaxed text-ink-soft">{a.content}</p>
                                <TranslateLink text={a.content} />
                              </li>
                            ))}
                          </ul>
                        )}
                      </details>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
                        {w.studentName}
                        <LangBadge lang={langById[w.studentId]} />{' '}
                        <span className="font-normal text-ink-faint">&middot; {formatDate(w.updatedAt)}</span>
                      </summary>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                        {w.content}
                      </p>
                      <TranslateLink text={w.content} />
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
                      <TranslateLink text={m.body} />
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
