import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import QRCode from 'qrcode';

const sql = neon(process.env.DATABASE_URL!);

async function initTables() {
  await sql`CREATE TABLE IF NOT EXISTS promos (
    id SERIAL PRIMARY KEY, name VARCHAR(100),
    package VARCHAR(50), quota INTEGER,
    deadline TIMESTAMP, active BOOLEAN DEFAULT true,
    bonus_tiers JSONB
  )`;
  await sql`CREATE TABLE IF NOT EXISTS registrants (
    id SERIAL PRIMARY KEY, slot_number VARCHAR(20) UNIQUE,
    promo_id INTEGER, name VARCHAR(100), wa VARCHAR(20),
    city VARCHAR(100), package VARCHAR(50),
    referral_code VARCHAR(20) UNIQUE, referred_by VARCHAR(20),
    early_bird_tier INTEGER, status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
  )`;
}

function generateSlotNumber(pkg: string, slot: number) {
  const prefix = pkg === 'starter' ? 'STR' : 'BIZ';
  return `AWD-JUL-${prefix}-${String(slot).padStart(3, '0')}`;
}

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getEarlyBirdTier(slot: number, bonusTiers: any[]) {
  for (let i = 0; i < bonusTiers.length; i++) {
    if (slot >= bonusTiers[i].min && slot <= bonusTiers[i].max) return i + 1;
  }
  return bonusTiers.length;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await initTables();
  const action = req.query.action as string;

  if (req.method === 'GET' && action === 'active') {
    const promos = await sql`SELECT * FROM promos WHERE active = true`;
    const results = await Promise.all(promos.map(async (p: any) => {
      const count = await sql`
        SELECT COUNT(*) as count FROM registrants WHERE promo_id = ${p.id}
      `;
      const latest = await sql`
        SELECT name, city, package, created_at FROM registrants
        WHERE promo_id = ${p.id}
        ORDER BY created_at DESC LIMIT 5
      `;
      return {
        ...p,
        registered: parseInt(count[0].count),
        remaining: p.quota - parseInt(count[0].count),
        latest,
      };
    }));
    return res.json({ promos: results });
  }

  if (req.method === 'POST' && action === 'register') {
    const { name, wa, city, package: pkg, referred_by } = req.body;
    if (!name || !wa || !city || !pkg) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const promo = await sql`
      SELECT * FROM promos WHERE package = ${pkg} AND active = true LIMIT 1
    `;
    if (!promo.length) return res.status(404).json({ error: 'Promo tidak ditemukan' });

    const p = promo[0];
    const count = await sql`
      SELECT COUNT(*) as count FROM registrants WHERE promo_id = ${p.id}
    `;
    const registered = parseInt(count[0].count);

    if (registered >= p.quota) {
      return res.status(400).json({ error: 'Slot penuh!' });
    }

    const slot = registered + 1;
    const slotNumber = generateSlotNumber(pkg, slot);
    const referralCode = generateReferralCode();
    const earlyBirdTier = getEarlyBirdTier(slot, p.bonus_tiers.tiers);
    const bonus = p.bonus_tiers.tiers[earlyBirdTier - 1]?.bonus || '';

    await sql`
      INSERT INTO registrants
        (slot_number, promo_id, name, wa, city, package,
         referral_code, referred_by, early_bird_tier)
      VALUES
        (${slotNumber}, ${p.id}, ${name}, ${wa}, ${city}, ${pkg},
         ${referralCode}, ${referred_by || null}, ${earlyBirdTier})
    `;

    if (referred_by) {
      await sql`
        UPDATE registrants SET status = 'priority'
        WHERE referral_code = ${referred_by} AND status = 'pending'
      `;
    }

    const siteUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : (process.env.SITE_URL || 'https://aldiwebdesigner.xyz');
    const verifyUrl = `${siteUrl}/promo/status?code=${slotNumber}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200 });

    return res.json({
      success: true,
      ticket: {
        slotNumber,
        name,
        city,
        package: pkg,
        earlyBirdTier,
        bonus,
        referralCode,
        referralLink: `https://aldiwebdesigner.xyz/?ref=${referralCode}`,
        qrCode: qrDataUrl,
        verifyUrl,
      }
    });
  }

  if (req.method === 'GET' && action === 'live') {
    const latest = await sql`
      SELECT r.name, r.city, r.package, r.created_at, r.slot_number
      FROM registrants r
      JOIN promos p ON r.promo_id = p.id
      WHERE p.active = true
      ORDER BY r.created_at DESC LIMIT 5
    `;
    return res.json({ latest });
  }

  if (req.method === 'GET' && action === 'status') {
    const { code } = req.query;
    const reg = await sql`
      SELECT r.*, p.name as promo_name, p.bonus_tiers
      FROM registrants r JOIN promos p ON r.promo_id = p.id
      WHERE r.slot_number = ${code}
    `;
    if (!reg.length) return res.status(404).json({ error: 'Antrean tidak ditemukan' });
    return res.json({ registrant: reg[0] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
