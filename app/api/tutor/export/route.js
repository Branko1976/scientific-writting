import { getSessionTutor } from '../../../../lib/auth';
import {
  listStudents,
  getAllProgress,
  getAllQuiz,
  getAllWriting,
  getAllActivities,
} from '../../../../lib/db';
import { CLASSES, slideCount } from '../../../../data/classes';
import { WRITING_TASKS } from '../../../../data/writingTasks';
import { hasJapanese } from '../../../../lib/i18n';
import slides from '../../../../data/slides.json';

export const dynamic = 'force-dynamic';

const TASK_SLIDES = slides.filter((s) => s.activity);

function cell(v) {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function toCsv(rows) {
  // BOM so Excel opens Japanese text correctly; CRLF line ends.
  return '﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n') + '\r\n';
}
function words(text) {
  const t = String(text || '').trim();
  if (!t) return 0;
  // Japanese has no spaces between words, so count characters for it instead.
  return hasJapanese(t) ? t.replace(/\s+/g, '').length : t.split(/\s+/).length;
}
function stamp(d) {
  if (!d) return '';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? '' : dt.toISOString().slice(0, 16).replace('T', ' ');
}

// CSV downloads for grading.
//   ?type=grades  -> one row per student (progress, quiz scores, counts)
//   ?type=answers -> one row per written answer (in-class tasks and writing tasks)
export async function GET(request) {
  if (!getSessionTutor(request)) {
    return new Response('Not authorized.', { status: 401 });
  }
  const type = new URL(request.url).searchParams.get('type') === 'answers' ? 'answers' : 'grades';

  const [students, progress, quiz, writing, activities] = await Promise.all([
    listStudents(),
    getAllProgress(),
    getAllQuiz(),
    getAllWriting(),
    getAllActivities(),
  ]);
  const langOf = (s) => (s.lang === 'ja' ? 'Japanese' : 'English');
  const byId = new Map(students.map((s) => [s.id, s]));
  const P = {};
  for (const p of progress) P[`${p.studentId}:${p.classId}`] = p;
  const Q = {};
  for (const q of quiz) Q[`${q.studentId}:${q.classId}`] = q;
  const W = {};
  for (const w of writing) W[`${w.studentId}:${w.classId}`] = w;
  const tasksPerClass = {};
  for (const c of CLASSES) tasksPerClass[c.id] = TASK_SLIDES.filter((t) => t.classId === c.id);
  const A = {};
  for (const a of activities) {
    if (String(a.content || '').trim()) A[`${a.studentId}:${a.slideN}`] = a;
  }

  let rows;
  if (type === 'grades') {
    const header = ['Student', 'Interface language'];
    for (const c of CLASSES) {
      header.push(
        `C${c.id} slides viewed`,
        `C${c.id} slides total`,
        `C${c.id} quiz score`,
        `C${c.id} quiz out of`,
        `C${c.id} task answers`,
        `C${c.id} tasks total`,
        `C${c.id} writing task (words; characters if Japanese)`
      );
    }
    header.push('Quiz total', 'Quiz out of', 'Task answers total', 'Tasks total', 'Writing tasks submitted (of 5)');
    rows = [header];
    for (const s of students) {
      const row = [s.name, langOf(s)];
      let qs = 0;
      let qt = 0;
      let ta = 0;
      let tt = 0;
      let ws = 0;
      for (const c of CLASSES) {
        const p = P[`${s.id}:${c.id}`];
        const q = Q[`${s.id}:${c.id}`];
        const w = W[`${s.id}:${c.id}`];
        const tasks = tasksPerClass[c.id];
        const answered = tasks.filter((t) => A[`${s.id}:${t.n}`]).length;
        const wcount = w ? words(w.content) : 0;
        row.push(
          p ? Math.min(slideCount(c.id), p.maxSlide + 1) : 0,
          slideCount(c.id),
          q ? q.score : '',
          q ? q.total : '',
          answered,
          tasks.length,
          wcount || ''
        );
        if (q) {
          qs += q.score;
          qt += q.total;
        }
        ta += answered;
        tt += tasks.length;
        if (wcount) ws += 1;
      }
      row.push(qs, qt, ta, tt, ws);
      rows.push(row);
    }
  } else {
    rows = [['Student', 'Interface language', 'Class', 'Type', 'Task', 'Answer', 'Written in Japanese', 'Last saved (UTC)']];
    for (const s of students) {
      for (const c of CLASSES) {
        for (const t of tasksPerClass[c.id]) {
          const a = A[`${s.id}:${t.n}`];
          if (!a) continue;
          rows.push([s.name, langOf(s), c.id, 'In-class task', `${t.eyebrow}: ${t.title}`, a.content, hasJapanese(a.content) ? 'yes' : 'no', stamp(a.updatedAt)]);
        }
        const w = W[`${s.id}:${c.id}`];
        if (w && String(w.content || '').trim()) {
          rows.push([s.name, langOf(s), c.id, 'Writing task', WRITING_TASKS[c.id]?.title || '', w.content, hasJapanese(w.content) ? 'yes' : 'no', stamp(w.updatedAt)]);
        }
      }
    }
  }
  void byId;

  const day = new Date().toISOString().slice(0, 10);
  return new Response(toCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="scientific-writing-${type}-${day}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
