import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-only-insecure-secret-change-me';
const TUTOR_PASSWORD = process.env.TUTOR_PASSWORD || '';

export const STUDENT_COOKIE = 'swc_session';
export const TUTOR_COOKIE = 'swc_tutor';

// ---- PIN hashing (scrypt, built into Node — no extra dependency) ----------

export function hashPin(pin) {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.scryptSync(String(pin), salt, 32).toString('hex');
  return { hash, salt };
}

export function verifyPin(pin, hash, salt) {
  const check = crypto.scryptSync(String(pin), salt, 32).toString('hex');
  const a = Buffer.from(check, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ---- Signed session tokens (HMAC, not JWT — kept minimal on purpose) ------

function sign(payloadObj) {
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function unsign(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function createStudentToken(studentId, name) {
  return sign({ studentId, name, iat: Date.now() });
}

export function readStudentToken(token) {
  const data = unsign(token);
  if (!data || typeof data.studentId !== 'number') return null;
  return data;
}

export function createTutorToken() {
  return sign({ tutor: true, iat: Date.now() });
}

export function readTutorToken(token) {
  const data = unsign(token);
  return Boolean(data && data.tutor === true);
}

export function isTutorPasswordConfigured() {
  return Boolean(TUTOR_PASSWORD);
}

export function checkTutorPassword(password) {
  if (!TUTOR_PASSWORD) return false;
  const a = Buffer.from(String(password));
  const b = Buffer.from(TUTOR_PASSWORD);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ---- Request helpers --------------------------------------------------

export function getSessionStudent(request) {
  const token = request.cookies.get(STUDENT_COOKIE)?.value;
  if (!token) return null;
  return readStudentToken(token);
}

export function getSessionTutor(request) {
  const token = request.cookies.get(TUTOR_COOKIE)?.value;
  if (!token) return false;
  return readTutorToken(token);
}
