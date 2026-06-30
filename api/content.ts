import type { VercelRequest, VercelResponse } from '@vercel/node';
import { get } from '@vercel/edge-config';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID || '';
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { key } = req.query;

  if (!key || typeof key !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter: key' });
  }

  if (req.method === 'GET') {
    try {
      const value = await get(key);
      return res.status(200).json({ key, value: value ?? null });
    } catch (err) {
      console.error('[api/content] GET error:', err);
      return res.status(500).json({ error: 'Failed to read from Edge Config' });
    }
  }

  if (req.method === 'POST') {
    const { value, password } = req.body;

    if (!password || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (value === undefined || value === null) {
      return res.status(400).json({ error: 'Missing body field: value' });
    }

    try {
      const response = await fetch(
        `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${VERCEL_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: [
              { operation: 'upsert', key, value },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[api/content] PATCH error:', response.status, errorText);
        return res.status(500).json({ error: 'Failed to write to Edge Config' });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[api/content] POST error:', err);
      return res.status(500).json({ error: 'Failed to write to Edge Config' });
    }
  }

  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
