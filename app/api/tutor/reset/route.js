import { NextResponse } from 'next/server';
import { getSessionTutor } from '../../../../lib/auth';
import { resetAllData } from '../../../../lib/db';

export async function POST(request) {
  if (!getSessionTutor(request)) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  if (body?.confirm !== 'RESET') {
    return NextResponse.json({ error: 'Confirmation text did not match.' }, { status: 400 });
  }

  await resetAllData();
  return NextResponse.json({ ok: true });
}
