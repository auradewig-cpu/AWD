import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url' });

  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url as string)}&strategy=mobile`;
  const r = await fetch(api);
  const data = await r.json();
  res.json(data);
}
