const KEY = 'swc:progress:v1';

const EMPTY = { name: '', classes: {} };

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return { ...EMPTY, ...parsed };
  } catch (e) {
    /* ignore corrupt data */
  }
  return { ...EMPTY };
}

export function loadProgress() {
  if (typeof window === 'undefined') return { ...EMPTY };
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return { ...EMPTY };
  return safeParse(raw);
}

export function saveProgress(data) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(data));
}

function classEntry(data, classId) {
  const key = String(classId);
  if (!data.classes[key]) {
    data.classes[key] = { lastSlide: 0, maxSlide: 0, quizBest: null };
  }
  return data.classes[key];
}

export function getClassProgress(classId) {
  const data = loadProgress();
  return classEntry(data, classId);
}

export function setLastSlide(classId, position) {
  const data = loadProgress();
  const entry = classEntry(data, classId);
  entry.lastSlide = position;
  entry.maxSlide = Math.max(entry.maxSlide || 0, position);
  saveProgress(data);
  return entry;
}

export function setQuizResult(classId, score, total) {
  const data = loadProgress();
  const entry = classEntry(data, classId);
  const prevBest = entry.quizBest ? entry.quizBest.score / entry.quizBest.total : -1;
  if (score / total >= prevBest) {
    entry.quizBest = { score, total, at: Date.now() };
  }
  saveProgress(data);
  return entry;
}

export function getStudentName() {
  return loadProgress().name || '';
}

export function setStudentName(name) {
  const data = loadProgress();
  data.name = name;
  saveProgress(data);
}

export function resetProgress() {
  saveProgress({ ...EMPTY });
}
