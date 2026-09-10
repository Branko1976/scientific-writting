import { NextResponse } from 'next/server';
import { getSessionStudent } from '../../../../lib/auth';
import { getChatMessages, postChatMessage } from '../../../../lib/db';

export async function GET(request, { params }) {
  const session = getSessionStudent(request);
  if (!session) return NextResponse.json({ error: 'Log in first.' }, { status: 401 });

  const classId = Number(params.classId);
  const after = Number(new URL(request.url).searchParams.get('after') || 0);
  if (!Number.isFinite(classId)) return NextResponse.json({ error: 'Invalid class.' }, { status: 400 });

  const messages = await getChatMessages(classId, Number.isFinite(after) ? after : 0);
  return NextResponse.json({ messages });
}

export async function POST(request, { params }) {
  const session = getSessionStudent(request);
  if (!session) return NextResponse.json({ error: 'Log in first.' }, { status: 401 });

  const classId = Number(params.classId);
  if (!Number.isFinite(classId)) return NextResponse.json({ error: 'Invalid class.' }, { status: 400 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const text = String(body?.body || '').trim().slice(0, 2000);
  if (!text) return NextResponse.json({ error: 'Message is empty.' }, { status: 400 });

  const message = await postChatMessage(classId, session.studentId, session.name, text);
  return NextResponse.json({ message });
}
