import { NextResponse } from 'next/server';
import { getSessionStudent } from '../../../lib/auth';
import { getWriting, upsertWriting } from '../../../lib/db';

export async function GET(request) {
  const session = getSessionStudent(request);
  if (!session) return NextResponse.json({ error: 'Log in first.' }, { status: 401 });

  const classId = Number(new URL(request.url).searchParams.get('classId'));
  if (!Number.isFinite(classId)) {
    return NextResponse.json({ error: 'Invalid class.' }, { status: 400 });
  }

  const submission = await getWriting(session.studentId, classId);
  return NextResponse.json({ content: submission?.content || '', updatedAt: submission?.updatedAt || null });
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
  const classId = Number(body?.classId);
  const content = String(body?.content ?? '').slice(0, 8000);
  if (!Number.isFinite(classId)) {
    return NextResponse.json({ error: 'Invalid class.' }, { status: 400 });
  }

  await upsertWriting(session.studentId, classId, content);
  return NextResponse.json({ ok: true });
}
