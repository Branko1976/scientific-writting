import { NextResponse } from 'next/server';
import { getSessionStudent } from '../../../../lib/auth';
import { setStudentLang } from '../../../../lib/db';

// Records the interface language a logged-in student is using.
export async function POST(request) {
  const session = getSessionStudent(request);
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  await setStudentLang(session.studentId, body?.lang === 'ja' ? 'ja' : 'en');
  return NextResponse.json({ ok: true });
}
