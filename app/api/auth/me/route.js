import { NextResponse } from 'next/server';
import { getSessionStudent } from '../../../../lib/auth';

export async function GET(request) {
  const session = getSessionStudent(request);
  if (!session) return NextResponse.json({ loggedIn: false });
  return NextResponse.json({ loggedIn: true, id: session.studentId, name: session.name });
}
