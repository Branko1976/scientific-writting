import { NextResponse } from 'next/server';
import { getSessionStudent } from '../../../../lib/auth';
import { upsertSlideProgress } from '../../../../lib/db';

export async function POST(request) {
  const session = getSessionStudent(request);
  if (!session) return NextResponse.json({ skipped: true });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const classId = Number(body?.classId);
  const position = Number(body?.position);
  if (!Number.isFinite(classId) || !Number.isFinite(position)) {
    return NextResponse.json({ error: 'Invalid data.' }, { status: 400 });
  }

  await upsertSlideProgress(session.studentId, classId, position);
  return NextResponse.json({ ok: true });
}
