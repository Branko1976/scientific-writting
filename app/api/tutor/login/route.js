import { NextResponse } from 'next/server';
import { checkTutorPassword, createTutorToken, isTutorPasswordConfigured, TUTOR_COOKIE } from '../../../../lib/auth';

export async function POST(request) {
  if (!isTutorPasswordConfigured()) {
    return NextResponse.json(
      { error: 'No TUTOR_PASSWORD is set for this deployment yet. Add one in your Vercel project\u2019s environment variables.' },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!checkTutorPassword(body?.password || '')) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(TUTOR_COOKIE, createTutorToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}
