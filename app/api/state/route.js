import { NextResponse } from 'next/server';
import { getSessionStudent } from '../../../lib/auth';
import { getProgressForStudent, getQuizForStudent } from '../../../lib/db';

export async function GET(request) {
  const session = getSessionStudent(request);
  if (!session) return NextResponse.json({ loggedIn: false, classes: {} });

  const [progress, quiz] = await Promise.all([
    getProgressForStudent(session.studentId),
    getQuizForStudent(session.studentId),
  ]);

  const classes = {};
  const ids = new Set([...Object.keys(progress), ...Object.keys(quiz)]);
  for (const id of ids) {
    classes[id] = {
      lastSlide: progress[id]?.lastSlide ?? 0,
      maxSlide: progress[id]?.maxSlide ?? 0,
      quizBest: quiz[id] ? { score: quiz[id].score, total: quiz[id].total } : null,
    };
  }

  return NextResponse.json({ loggedIn: true, name: session.name, classes });
}
