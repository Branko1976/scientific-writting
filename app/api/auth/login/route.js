import { NextResponse } from 'next/server';
import { getStudentByName, createStudent } from '../../../../lib/db';
import { hashPin, verifyPin, createStudentToken, STUDENT_COOKIE } from '../../../../lib/auth';

const NAME_RE = /^.{1,40}$/;
const PIN_RE = /^\d{4}$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const name = String(body?.name || '').trim();
  const pin = String(body?.pin || '').trim();

  if (!NAME_RE.test(name)) {
    return NextResponse.json({ error: 'Enter your name.' }, { status: 400 });
  }
  if (!PIN_RE.test(pin)) {
    return NextResponse.json({ error: 'PIN must be exactly 4 digits.' }, { status: 400 });
  }

  const existing = await getStudentByName(name);
  let student;

  if (existing) {
    if (!verifyPin(pin, existing.pinHash, existing.pinSalt)) {
      return NextResponse.json({ error: 'That PIN doesn\u2019t match this name.' }, { status: 401 });
    }
    student = existing;
  } else {
    const { hash, salt } = hashPin(pin);
    student = await createStudent(name, hash, salt);
  }

  const token = createStudentToken(student.id, student.name);
  const res = NextResponse.json({ id: student.id, name: student.name, created: !existing });
  res.cookies.set(STUDENT_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  });
  return res;
}
