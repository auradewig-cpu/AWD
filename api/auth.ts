import type { VercelRequest, VercelResponse } from '@vercel/node';
import { checkPassword, issueToken } from './_auth';

// POST /api/auth  { password }  ->  { token }
// Verifies the admin password server-side and returns a short-lived HMAC token.
// The password is never returned and never stored client-side.
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { password } = req.body || {};
  if (!checkPassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return res.status(200).json({ token: issueToken() });
}
