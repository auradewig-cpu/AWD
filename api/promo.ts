import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import QRCode from 'qrcode';

const sql = neon(process.env.DATABASE_URL!);

async function initTables() {
  await sql`CREATE TABLE IF NOT EXISTS promos (
    id SERIAL PRIMARY KEY, name VARCHAR(100),
    package VARCHAR(50), quota INTEGER,
    deadline TIMESTAMP, active BOOLEAN DEFAULT true,
    bonus_tiers JSONB,
    promo_price VARCHAR(50)
  )`;
  await sql`ALTER TABLE promos ADD COLUMN IF NOT EXISTS promo_price VARCHAR(50)`;
  await sql`ALTER TABLE promos ADD COLUMN IF NOT EXISTS syarat JSONB`;
  await sql`ALTER TABLE promos ADD COLUMN IF NOT EXISTS form_fields JSONB`;
  await sql`CREATE TABLE IF NOT EXISTS registrants (
    id SERIAL PRIMARY KEY, slot_number VARCHAR(20) UNIQUE,
    promo_id INTEGER, name VARCHAR(100), wa VARCHAR(20),
    city VARCHAR(100), package VARCHAR(50),
    referral_code VARCHAR(20) UNIQUE, referred_by VARCHAR(20),
    early_bird_tier INTEGER, status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
  )`;
  await sql`ALTER TABLE registrants ADD COLUMN IF NOT EXISTS testimoni_uploaded BOOLEAN DEFAULT false`;
  await sql`ALTER TABLE registrants ADD COLUMN IF NOT EXISTS post_uploaded BOOLEAN DEFAULT false`;
  await sql`ALTER TABLE registrants ADD COLUMN IF NOT EXISTS screenshots JSONB DEFAULT '[]'::jsonb`;
  await sql`ALTER TABLE registrants DROP COLUMN IF EXISTS screenshot_medsos_url`;
  await sql`ALTER TABLE registrants ADD COLUMN IF NOT EXISTS brand_name TEXT`;
  await sql`ALTER TABLE registrants ADD COLUMN IF NOT EXISTS bisnis_desc TEXT`;
  await sql`ALTER TABLE registrants ADD COLUMN IF NOT EXISTS referensi_web TEXT`;
  await sql`ALTER TABLE registrants ADD COLUMN IF NOT EXISTS testimoni_wa_url TEXT`;
  await sql`ALTER TABLE registrants ADD COLUMN IF NOT EXISTS post_sosmed_url TEXT`;
  await sql`ALTER TABLE registrants ADD COLUMN IF NOT EXISTS email VARCHAR(100)`;
}

function generateSlotNumber(pkg: string, slot: number) {
  const prefix = pkg === 'starter' ? 'STR' : 'BIZ';
  return `AWD-JUL-${prefix}-${String(slot).padStart(3, '0')}`;
}

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function maskPhone(p: string | null | undefined) {
  if (!p) return p;
  if (p.length <= 4) return p;
  return p.slice(0, 4) + 'x'.repeat(p.length - 4);
}

function getEarlyBirdTier(slot: number, bonusTiers: any[]) {
  if (!bonusTiers || !bonusTiers.length) return 1;
  for (let i = 0; i < bonusTiers.length; i++) {
    if (slot >= bonusTiers[i].min && slot <= bonusTiers[i].max) return i + 1;
  }
  return bonusTiers.length;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
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
    const { name, wa, city, email, package: pkg, referred_by, brand_name, bisnis_desc, referensi_web, screenshots } = req.body;
    if (!name || !wa || !city || !pkg) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const promo = await sql`
      SELECT * FROM promos WHERE package = ${pkg} AND active = true LIMIT 1
    `;
    if (!promo.length) return res.status(404).json({ error: 'Promo tidak ditemukan' });

    const p = promo[0];

    let slotNumber: string;
    let referralCode: string;
    let earlyBirdTier: number;
    let bonus: string;
    let inserted = false;

    for (let attempt = 0; attempt < 3; attempt++) {
      const count = await sql`
        SELECT COUNT(*) as count FROM registrants WHERE promo_id = ${p.id}
      `;
      const registered = parseInt(count[0].count);

      if (registered >= (p.quota ?? 0) && attempt === 0) {
        return res.status(400).json({ error: 'Slot penuh!' });
      }

      const slot = registered + 1 + attempt;
      slotNumber = generateSlotNumber(pkg, slot);
      referralCode = generateReferralCode();
      const tiers = p.bonus_tiers?.tiers || [];
      earlyBirdTier = getEarlyBirdTier(slot, tiers);
      bonus = tiers[earlyBirdTier - 1]?.bonus || '';

      try {
        await sql`
          INSERT INTO registrants
            (slot_number, promo_id, name, wa, city, package,
             referral_code, referred_by, early_bird_tier,
             email, brand_name, bisnis_desc, referensi_web, screenshots)
          VALUES
            (${slotNumber}, ${p.id}, ${name}, ${wa}, ${city}, ${pkg},
             ${referralCode}, ${referred_by || null}, ${earlyBirdTier},
             ${email || null}, ${brand_name || null}, ${bisnis_desc || null}, ${referensi_web || null},
             ${JSON.stringify(screenshots || [])})
        `;
        inserted = true;
        break;
      } catch (e: any) {
        if (attempt < 2 && e?.message?.includes('duplicate key')) {
          continue;
        }
        throw e;
      }
    }

    if (!inserted) {
      return res.status(500).json({ error: 'Gagal mendaftar, coba lagi' });
    }

    if (referred_by) {
      await sql`
        UPDATE registrants SET status = 'priority'
        WHERE referral_code = ${referred_by} AND status = 'pending'
      `;
    }

    const verifyUrl = `https://wa.me/6285286427559?text=Konfirmasi%20antrean%20${slotNumber}%20-%20${name}`;
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
        syarat: p.syarat,
        form_fields: p.form_fields,
      }
    });
  }

  if (req.method === 'GET' && action === 'live') {
    const latest = await sql`
      SELECT r.name, r.city, r.package, r.created_at, r.slot_number, r.wa
      FROM registrants r
      JOIN promos p ON r.promo_id = p.id
      WHERE p.active = true
      ORDER BY r.created_at DESC LIMIT 5
    `;
    const masked = latest.map((r: any) => ({ ...r, wa: maskPhone(r.wa) }));
    return res.json({ latest: masked });
  }

  if (req.method === 'GET' && action === 'status') {
    const { code } = req.query;
    const reg = await sql`
      SELECT r.*, p.name as promo_name, p.bonus_tiers
      FROM registrants r JOIN promos p ON r.promo_id = p.id
      WHERE r.slot_number = ${code}
    `;
    if (!reg.length) return res.status(404).json({ error: 'Antrean tidak ditemukan' });
    const registrant = { ...reg[0], wa: maskPhone(reg[0].wa) };
    return res.json({ registrant });
  }

  if (req.method === 'POST' && action === 'seed') {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await sql`DELETE FROM registrants`;
    await sql`DELETE FROM promos`;
    const defaultFields = '[{"id":"name","label":"Nama lengkap","type":"text","required":true},{"id":"wa","label":"No. WhatsApp","type":"text","required":true},{"id":"city","label":"Kota","type":"text","required":true}]';
    const defaultSyarat = '["Follow Semua Akun Medsos AWD (IG/TikTok/FB/YouTube), Like, Share \\u0026 Save 3 post terbaru AWD di semua medsos. (\\u26a0\\ufe0f Pertahankan minimal 6 bulan agar paket tetap aktif)","Screenshot bukti dan kirim ke WA admin AWD","Wajib berikan ulasan Google positif sebelum website live","Post sosmed dengan template yang kami kirim via WA"]';
    await sql`
      INSERT INTO promos (name, package, quota, deadline, active, bonus_tiers, form_fields, syarat)
      VALUES
        ('Promo Juli 2026', 'starter', 100, '2026-07-31 23:59:59', true,
         '{"tiers":[
           {"min":1,"max":10,"bonus":"Domain .com 2 tahun"},
           {"min":11,"max":30,"bonus":"Domain .com 1 tahun"},
           {"min":31,"max":50,"bonus":"Setup Google Business"},
           {"min":51,"max":100,"bonus":"Harga promo saja"}
         ]}'::jsonb,
         ${defaultFields}::jsonb,
         ${defaultSyarat}::jsonb),
        ('Promo Juli 2026', 'business', 50, '2026-07-31 23:59:59', true,
         '{"tiers":[
           {"min":1,"max":10,"bonus":"Domain .com 2 tahun"},
           {"min":11,"max":25,"bonus":"Domain .com 1 tahun"},
           {"min":26,"max":50,"bonus":"Harga promo saja"}
         ]}'::jsonb,
         ${defaultFields}::jsonb,
         ${defaultSyarat}::jsonb)
    `;
    return res.json({ success: true, message: 'Promo seeded' });
  }

  if (req.method === 'POST' && action === 'verify') {
    const { slotNumber, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await sql`UPDATE registrants SET status = 'verified' WHERE slot_number = ${slotNumber}`;
    return res.json({ success: true, message: 'Registrant verified' });
  }

  if (req.method === 'GET' && action === 'registrants') {
    const isAdmin = req.query.password === process.env.ADMIN_PASSWORD;
    if (isAdmin) {
      const rows = await sql`SELECT * FROM registrants ORDER BY created_at DESC`;
      return res.json({ registrants: rows });
    }
    const rows = await sql`
      SELECT id, name, city, package, slot_number, promo_id,
             early_bird_tier, status, referral_code, referred_by, created_at
      FROM registrants ORDER BY created_at DESC
    `;
    return res.json({ registrants: rows });
  }

  if (req.method === 'GET' && action === 'promos') {
    const rows = await sql`SELECT * FROM promos ORDER BY id DESC`;
    return res.json({ promos: rows });
  }

  if (req.method === 'POST' && action === 'create') {
    const { name, package: pkg, quota, deadline, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    await sql`
      INSERT INTO promos (name, package, quota, deadline, active, bonus_tiers)
      VALUES (${name}, ${pkg}, ${quota}, ${deadline}, true, '{"tiers":[]}'::jsonb)
    `;
    return res.json({ success: true });
  }

  if (req.method === 'POST' && action === 'update') {
    const { id, quota, deadline, active, bonus_tiers, promo_price, syarat, form_fields, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    await sql`
      UPDATE promos SET quota=${quota}, deadline=${deadline},
        active=${active}, bonus_tiers=${JSON.stringify(bonus_tiers || { tiers: [] })}::jsonb,
        promo_price=${promo_price || null},
        syarat=${JSON.stringify(syarat || [])}::jsonb,
        form_fields=${JSON.stringify(form_fields || [])}::jsonb
      WHERE id=${id}
    `;
    return res.json({ success: true });
  }

  if (req.method === 'POST' && action === 'delete') {
    const { id, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    await sql`DELETE FROM registrants WHERE promo_id = ${id}`;
    await sql`DELETE FROM promos WHERE id = ${id}`;
    return res.json({ success: true });
  }

  if (req.method === 'POST' && action === 'reset-registrants') {
    const { promoId, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    await sql`DELETE FROM registrants WHERE promo_id = ${promoId}`;
    return res.json({ success: true });
  }

  if (req.method === 'POST' && action === 'delete-registrant') {
    const { id, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    await sql`DELETE FROM registrants WHERE id = ${id}`;
    return res.json({ success: true });
  }

  if (req.method === 'GET' && action === 'closing') {
    const { slot } = req.query;
    const reg = await sql`
      SELECT id, slot_number, name, city, package, early_bird_tier, status,
             brand_name, bisnis_desc, referensi_web,
             testimoni_uploaded, post_uploaded,
             testimoni_wa_url, post_sosmed_url
      FROM registrants WHERE slot_number = ${slot}
    `;
    if (!reg.length) return res.status(404).json({ error: 'Registrant not found' });
    return res.json({ registrant: reg[0] });
  }

  if (req.method === 'POST' && action === 'update-closing') {
    const { slot, password, testimoni_wa_url, post_sosmed_url } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    const setClauses = [];
    const params: any[] = [];
    if (testimoni_wa_url) { setClauses.push('testimoni_wa_url'); params.push(testimoni_wa_url); }
    if (post_sosmed_url) { setClauses.push('post_sosmed_url'); params.push(post_sosmed_url); }
    if (testimoni_wa_url) { setClauses.push('testimoni_uploaded'); params.push(true); }
    if (post_sosmed_url) { setClauses.push('post_uploaded'); params.push(true); }
    if (setClauses.length) {
      const pairs = [];
      for (let i = 0; i < setClauses.length; i += 2) {
        pairs.push(`${setClauses[i]} = $${i/2 + 1}`);
      }
      params.push(slot);
      await sql`
        UPDATE registrants SET ${sql(pairs.join(', '))}
        WHERE slot_number = ${slot}
      `;
    }
    return res.json({ success: true });
  }

  if (req.method === 'POST' && action === 'mark-live') {
    const { slot, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    await sql`UPDATE registrants SET status = 'live' WHERE slot_number = ${slot}`;
    return res.json({ success: true, closingUrl: `${process.env.VERCEL_URL || 'https://awd-yss9.vercel.app'}/#/closing/${slot}` });
  }

  if (req.method === 'POST' && action === 'update-status') {
    const { id, status, password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    await sql`UPDATE registrants SET status = ${status} WHERE id = ${id}`;
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('[/api/promo] Unhandled error:', err?.stack || err);
    return res.status(500).json({ error: 'Internal server error', detail: err?.message });
  }
}
