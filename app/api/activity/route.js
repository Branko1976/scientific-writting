import { NextResponse } from 'next/server';
import { getSessionStudent } from '../../../lib/auth';
import { getActivitiesForStudent, upsertActivity } from '../../../lib/db';
import slides from '../../../data/slides.json';

const TASKS = new Map(slides.filter((s) => s.activity).map((s) => [s.n, s.classId]));

export async function GET(request) {
  const session = getSessionStudent(request);
  if (!session) return NextResponse.json({ error: 'Log in first.' }, { status: 401 });
  const classId = Number(new URL(request.url).searchParams.get('classId'));
  if (!Number.isFinite(classId)) return NextResponse.json({ error: 'Invalid class.' }, { status: 400 });
  const responses = await getActivitiesForStudent(session.studentId, classId);
  return NextResponse.json({ responses });
}

export async function POST(request) {
  const session = getSessionStudent(request);
  if (!session) return NextResponse.json({ error: 'Log in first.' }, { status: 401 });
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const slideN = Number(body?.slideN);
  if (!TASKS.has(slideN)) return NextResponse.json({ error: 'Not a task slide.' }, { status: 400 });
  const content = String(body?.content ?? '').slice(0, 2000);
  await upsertActivity(session.studentId, TASKS.get(slideN), slideN, content);
  return NextResponse.json({ ok: true });
}
