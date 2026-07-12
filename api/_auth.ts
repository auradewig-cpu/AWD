// Shared server-side auth helpers for the admin API.
// Files prefixed with "_" are NOT exposed as routes by Vercel — import-only.
//
// Security model: the admin password NEVER reaches the client bundle. The client
// posts the password once to /api/auth, the server verifies it and returns a
// short-lived stateless HMAC token. Every admin-guarded endpoint then checks the
// token (not the password). The HMAC key falls back to ADMIN_PASSWORD so no new
// environment variable is required for deployment.
import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || '';
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function sign(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
}

export function issueToken(): string {
  const payload = String(Date.now() + TTL_MS);
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

export function verifyToken(token: unknown): boolean {
  if (!SECRET || typeof token !== 'string' || !token.includes('.')) return false;
  const [encPayload, sig] = token.split('.');
  if (!encPayload || !sig) return false;

  let payload: string;
  try {
    payload = Buffer.from(encPayload, 'base64url').toString();
  } catch {
    return false;
  }

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const exp = parseInt(payload, 10);
  return Number.isFinite(exp) && Date.now() < exp;
}

// Constant-time comparison of a submitted password against ADMIN_PASSWORD.
export function checkPassword(password: unknown): boolean {
  const admin = process.env.ADMIN_PASSWORD || '';
  if (!admin || typeof password !== 'string') return false;
  const a = Buffer.from(password);
  const b = Buffer.from(admin);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Pull a bearer token from either the Authorization header or a `token` field.
export function getRequestToken(req: {
  headers: Record<string, any>;
  query?: Record<string, any>;
  body?: any;
}): string | undefined {
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7);
  if (req.query && typeof req.query.token === 'string') return req.query.token;
  if (req.body && typeof req.body.token === 'string') return req.body.token;
  return undefined;
}

export function isAuthorized(req: {
  headers: Record<string, any>;
  query?: Record<string, any>;
  body?: any;
}): boolean {
  return verifyToken(getRequestToken(req));
}
