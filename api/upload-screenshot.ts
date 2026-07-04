import type { VercelRequest, VercelResponse } from '@vercel/node';
import sharp from 'sharp';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const base64 = image.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(base64, 'base64');

    const webpBuf = await sharp(buf).webp({ quality: 80 }).toBuffer();
    const webpBase64 = webpBuf.toString('base64');
    const dataUrl = `data:image/webp;base64,${webpBase64}`;

    return res.json({ url: dataUrl });
  } catch (err: any) {
    console.error('[/api/upload-screenshot] Error:', err?.stack || err);
    return res.status(500).json({ error: 'Upload failed', detail: err?.message });
  }
}
