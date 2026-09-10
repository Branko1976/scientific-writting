// Data layer for students, progress, quiz results, writing submissions, and chat.
//
// If DATABASE_URL is set, everything is persisted to Postgres (works with any
// Postgres from the Vercel Marketplace — Neon, Supabase, etc). If it is not set,
// everything falls back to an in-memory store so `npm run dev` works with zero
// setup. The in-memory store does NOT persist across serverless invocations, so
// it must not be relied on in production — connect a real database before
// deploying the multi-user features.

const hasDb = Boolean(process.env.DATABASE_URL);

// ---------------------------------------------------------------------------
// In-memory fallback (dev only)
// ---------------------------------------------------------------------------
const mem = (globalThis.__swc_memdb ||= {
  students: [], // { id, name, nameLower, pinHash, pinSalt, createdAt }
  progress: new Map(), // `${studentId}:${classId}` -> { lastSlide, maxSlide, updatedAt }
  quiz: new Map(), // `${studentId}:${classId}` -> { score, total, updatedAt }
  writing: new Map(), // `${studentId}:${classId}` -> { content, updatedAt }
  chat: [], // { id, classId, studentId, authorName, body, createdAt }
  nextId: 1,
});

function memId() {
  return mem.nextId++;
}

// ---------------------------------------------------------------------------
// Postgres backend
// ---------------------------------------------------------------------------
let sqlClient = null;
let schemaReady = null;

async function getSql() {
  if (!sqlClient) {
    const postgres = (await import('postgres')).default;
    sqlClient = postgres(process.env.DATABASE_URL, {
      ssl: 'require',
      max: 3,
      idle_timeout: 20,
    });
  }
  if (!schemaReady) {
    schemaReady = ensureSchema(sqlClient);
  }
  await schemaReady;
  return sqlClient;
}

async function ensureSchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      name_lower TEXT NOT NULL UNIQUE,
      pin_hash TEXT NOT NULL,
      pin_salt TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS progress (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      class_id INTEGER NOT NULL,
      last_slide INTEGER NOT NULL DEFAULT 0,
      max_slide INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (student_id, class_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS quiz_results (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      class_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (student_id, class_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS writing_submissions (
      student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      class_id INTEGER NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (student_id, class_id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id SERIAL PRIMARY KEY,
      class_id INTEGER NOT NULL,
      student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
      author_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS chat_class_idx ON chat_messages (class_id, id)`;
}

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------

export async function getStudentByName(name) {
  const nameLower = name.trim().toLowerCase();
  if (!hasDb) {
    return mem.students.find((s) => s.nameLower === nameLower) || null;
  }
  const sql = await getSql();
  const rows = await sql`SELECT * FROM students WHERE name_lower = ${nameLower} LIMIT 1`;
  return rows[0]
    ? { id: rows[0].id, name: rows[0].name, pinHash: rows[0].pin_hash, pinSalt: rows[0].pin_salt }
    : null;
}

export async function createStudent(name, pinHash, pinSalt) {
  const nameLower = name.trim().toLowerCase();
  if (!hasDb) {
    const student = { id: memId(), name: name.trim(), nameLower, pinHash, pinSalt, createdAt: Date.now() };
    mem.students.push(student);
    return student;
  }
  const sql = await getSql();
  const rows = await sql`
    INSERT INTO students (name, name_lower, pin_hash, pin_salt)
    VALUES (${name.trim()}, ${nameLower}, ${pinHash}, ${pinSalt})
    RETURNING id, name
  `;
  return { id: rows[0].id, name: rows[0].name, pinHash, pinSalt };
}

export async function getStudentById(id) {
  if (!hasDb) return mem.students.find((s) => s.id === id) || null;
  const sql = await getSql();
  const rows = await sql`SELECT id, name FROM students WHERE id = ${id} LIMIT 1`;
  return rows[0] || null;
}

export async function listStudents() {
  if (!hasDb) {
    return [...mem.students]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((s) => ({ id: s.id, name: s.name }));
  }
  const sql = await getSql();
  return sql`SELECT id, name FROM students ORDER BY name_lower ASC`;
}

// ---------------------------------------------------------------------------
// Slide progress
// ---------------------------------------------------------------------------

export async function upsertSlideProgress(studentId, classId, lastSlide) {
  if (!hasDb) {
    const key = `${studentId}:${classId}`;
    const prev = mem.progress.get(key) || { lastSlide: 0, maxSlide: 0 };
    mem.progress.set(key, {
      lastSlide,
      maxSlide: Math.max(prev.maxSlide, lastSlide),
      updatedAt: Date.now(),
    });
    return;
  }
  const sql = await getSql();
  await sql`
    INSERT INTO progress (student_id, class_id, last_slide, max_slide, updated_at)
    VALUES (${studentId}, ${classId}, ${lastSlide}, ${lastSlide}, now())
    ON CONFLICT (student_id, class_id)
    DO UPDATE SET
      last_slide = ${lastSlide},
      max_slide = GREATEST(progress.max_slide, ${lastSlide}),
      updated_at = now()
  `;
}

export async function getProgressForStudent(studentId) {
  if (!hasDb) {
    const out = {};
    for (const [key, val] of mem.progress.entries()) {
      const [sid, cid] = key.split(':');
      if (Number(sid) === studentId) out[cid] = val;
    }
    return out;
  }
  const sql = await getSql();
  const rows = await sql`SELECT class_id, last_slide, max_slide FROM progress WHERE student_id = ${studentId}`;
  const out = {};
  for (const r of rows) out[r.class_id] = { lastSlide: r.last_slide, maxSlide: r.max_slide };
  return out;
}

// For the tutor dashboard: every student's progress across every class.
export async function getAllProgress() {
  if (!hasDb) {
    return [...mem.progress.entries()].map(([key, val]) => {
      const [sid, cid] = key.split(':');
      return { studentId: Number(sid), classId: Number(cid), lastSlide: val.lastSlide, maxSlide: val.maxSlide };
    });
  }
  const sql = await getSql();
  const rows = await sql`SELECT student_id, class_id, last_slide, max_slide FROM progress`;
  return rows.map((r) => ({ studentId: r.student_id, classId: r.class_id, lastSlide: r.last_slide, maxSlide: r.max_slide }));
}

// ---------------------------------------------------------------------------
// Quiz results (keep best attempt)
// ---------------------------------------------------------------------------

export async function upsertQuizResult(studentId, classId, score, total) {
  if (!hasDb) {
    const key = `${studentId}:${classId}`;
    const prev = mem.quiz.get(key);
    if (!prev || score / total >= prev.score / prev.total) {
      mem.quiz.set(key, { score, total, updatedAt: Date.now() });
    }
    return;
  }
  const sql = await getSql();
  await sql`
    INSERT INTO quiz_results (student_id, class_id, score, total, updated_at)
    VALUES (${studentId}, ${classId}, ${score}, ${total}, now())
    ON CONFLICT (student_id, class_id)
    DO UPDATE SET
      score = CASE WHEN ${score}::float / ${total} >= quiz_results.score::float / quiz_results.total
                    THEN ${score} ELSE quiz_results.score END,
      total = CASE WHEN ${score}::float / ${total} >= quiz_results.score::float / quiz_results.total
                    THEN ${total} ELSE quiz_results.total END,
      updated_at = now()
  `;
}

export async function getQuizForStudent(studentId) {
  if (!hasDb) {
    const out = {};
    for (const [key, val] of mem.quiz.entries()) {
      const [sid, cid] = key.split(':');
      if (Number(sid) === studentId) out[cid] = val;
    }
    return out;
  }
  const sql = await getSql();
  const rows = await sql`SELECT class_id, score, total FROM quiz_results WHERE student_id = ${studentId}`;
  const out = {};
  for (const r of rows) out[r.class_id] = { score: r.score, total: r.total };
  return out;
}

// For the tutor dashboard: every student's quiz results across every class.
export async function getAllQuiz() {
  if (!hasDb) {
    return [...mem.quiz.entries()].map(([key, val]) => {
      const [sid, cid] = key.split(':');
      return { studentId: Number(sid), classId: Number(cid), score: val.score, total: val.total };
    });
  }
  const sql = await getSql();
  const rows = await sql`SELECT student_id, class_id, score, total FROM quiz_results`;
  return rows.map((r) => ({ studentId: r.student_id, classId: r.class_id, score: r.score, total: r.total }));
}

// ---------------------------------------------------------------------------
// Writing submissions
// ---------------------------------------------------------------------------

export async function upsertWriting(studentId, classId, content) {
  if (!hasDb) {
    mem.writing.set(`${studentId}:${classId}`, { content, updatedAt: Date.now() });
    return;
  }
  const sql = await getSql();
  await sql`
    INSERT INTO writing_submissions (student_id, class_id, content, updated_at)
    VALUES (${studentId}, ${classId}, ${content}, now())
    ON CONFLICT (student_id, class_id)
    DO UPDATE SET content = ${content}, updated_at = now()
  `;
}

export async function getWriting(studentId, classId) {
  if (!hasDb) {
    return mem.writing.get(`${studentId}:${classId}`) || null;
  }
  const sql = await getSql();
  const rows = await sql`
    SELECT content, updated_at FROM writing_submissions
    WHERE student_id = ${studentId} AND class_id = ${classId} LIMIT 1
  `;
  return rows[0] ? { content: rows[0].content, updatedAt: rows[0].updated_at } : null;
}

// For the tutor dashboard: every submission, with student names attached.
export async function getAllWriting() {
  if (!hasDb) {
    const byName = new Map(mem.students.map((s) => [s.id, s.name]));
    return [...mem.writing.entries()].map(([key, val]) => {
      const [sid, cid] = key.split(':');
      return {
        studentId: Number(sid),
        studentName: byName.get(Number(sid)) || 'Unknown',
        classId: Number(cid),
        content: val.content,
        updatedAt: val.updatedAt,
      };
    });
  }
  const sql = await getSql();
  const rows = await sql`
    SELECT w.student_id, s.name AS student_name, w.class_id, w.content, w.updated_at
    FROM writing_submissions w
    JOIN students s ON s.id = w.student_id
    ORDER BY w.updated_at DESC
  `;
  return rows.map((r) => ({
    studentId: r.student_id,
    studentName: r.student_name,
    classId: r.class_id,
    content: r.content,
    updatedAt: r.updated_at,
  }));
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

export async function postChatMessage(classId, studentId, authorName, body) {
  if (!hasDb) {
    const msg = { id: memId(), classId, studentId, authorName, body, createdAt: Date.now() };
    mem.chat.push(msg);
    return msg;
  }
  const sql = await getSql();
  const rows = await sql`
    INSERT INTO chat_messages (class_id, student_id, author_name, body)
    VALUES (${classId}, ${studentId}, ${authorName}, ${body})
    RETURNING id, class_id, student_id, author_name, body, created_at
  `;
  const r = rows[0];
  return { id: r.id, classId: r.class_id, studentId: r.student_id, authorName: r.author_name, body: r.body, createdAt: r.created_at };
}

export async function getChatMessages(classId, afterId = 0) {
  if (!hasDb) {
    return mem.chat.filter((m) => m.classId === classId && m.id > afterId).sort((a, b) => a.id - b.id);
  }
  const sql = await getSql();
  const rows = await sql`
    SELECT id, class_id, student_id, author_name, body, created_at
    FROM chat_messages
    WHERE class_id = ${classId} AND id > ${afterId}
    ORDER BY id ASC
    LIMIT 200
  `;
  return rows.map((r) => ({
    id: r.id,
    classId: r.class_id,
    studentId: r.student_id,
    authorName: r.author_name,
    body: r.body,
    createdAt: r.created_at,
  }));
}

export function isDbConfigured() {
  return hasDb;
}

// ---------------------------------------------------------------------------
// Full reset — wipes every student, all progress, quiz results, writing
// submissions, and chat messages. Used by the tutor dashboard's "Danger
// zone" before real students start (clears out any test accounts).
// ---------------------------------------------------------------------------

export async function resetAllData() {
  if (!hasDb) {
    mem.students.length = 0;
    mem.progress.clear();
    mem.quiz.clear();
    mem.writing.clear();
    mem.chat.length = 0;
    mem.nextId = 1;
    return;
  }
  const sql = await getSql();
  await sql`TRUNCATE TABLE chat_messages, writing_submissions, quiz_results, progress, students RESTART IDENTITY CASCADE`;
}
