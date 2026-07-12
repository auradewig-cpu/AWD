import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { isAuthorized } from './_auth';

const sql = neon(process.env.DATABASE_URL!);

async function initTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      key VARCHAR(100) PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initTable();
  const key = req.query.key as string;
  if (!key) return res.status(400).json({ error: 'Missing key' });

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT value FROM site_content WHERE key = ${key}
    `;
    if (rows.length === 0) return res.json({ key, value: null });
    return res.json({ key, value: rows[0].value });
  }

  if (req.method === 'POST') {
    const { value } = req.body;
    if (!isAuthorized(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (value === null || (value?.tiers && value.tiers.length === 0)) {
      await sql`DELETE FROM site_content WHERE key = ${key}`;
      return res.json({ success: true });
    }
    await sql`
      INSERT INTO site_content (key, value, updated_at)
      VALUES (${key}, ${JSON.stringify(value)}, NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = ${JSON.stringify(value)}, updated_at = NOW()
    `;
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
