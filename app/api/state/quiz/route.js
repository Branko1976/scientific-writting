import { NextResponse } from 'next/server';
import { getSessionStudent } from '../../../../lib/auth';
import { upsertQuizResult } from '../../../../lib/db';

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
  const score = Number(body?.score);
  const total = Number(body?.total);
  if (![classId, score, total].every(Number.isFinite)) {
    return NextResponse.json({ error: 'Invalid data.' }, { status: 400 });
  }

  await upsertQuizResult(session.studentId, classId, score, total);
  return NextResponse.json({ ok: true });
}
