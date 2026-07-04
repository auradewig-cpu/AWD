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

    const formData = new FormData();
    formData.append('file', new Blob([webpBuf], { type: 'image/webp' }), 'upload.webp');
    formData.append('upload_preset', 'ml_default');

    const uploadRes = await fetch(
      'https://api.cloudinary.com/v1_1/dr0xe0tgr/image/upload',
      { method: 'POST', body: formData }
    );
    const data = await uploadRes.json();
    if (!data.secure_url) return res.status(500).json({ error: 'Upload failed', detail: data });

    return res.json({ url: data.secure_url });
  } catch (err: any) {
    console.error('[/api/upload-screenshot] Error:', err?.stack || err);
    return res.status(500).json({ error: 'Upload failed', detail: err?.message });
  }
}
