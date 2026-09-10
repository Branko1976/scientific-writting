import { NextResponse } from 'next/server';
import { getStudentByName } from '../../../../lib/db';

export async function GET(request) {
  const name = new URL(request.url).searchParams.get('name') || '';
  if (!name.trim()) return NextResponse.json({ exists: false });
  const student = await getStudentByName(name);
  return NextResponse.json({ exists: Boolean(student) });
}
