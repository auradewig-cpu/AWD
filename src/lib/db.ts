import { neon } from '@neondatabase/serverless';
export const sql = neon(process.env.DATABASE_URL!);

export async function initPromoTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS promos (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      package VARCHAR(50),
      quota INTEGER,
      deadline TIMESTAMP,
      active BOOLEAN DEFAULT true,
      bonus_tiers JSONB
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS registrants (
      id SERIAL PRIMARY KEY,
      slot_number VARCHAR(20) UNIQUE,
      promo_id INTEGER REFERENCES promos(id),
      name VARCHAR(100),
      wa VARCHAR(20),
      city VARCHAR(100),
      package VARCHAR(50),
      referral_code VARCHAR(20) UNIQUE,
      referred_by VARCHAR(20),
      early_bird_tier INTEGER,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  const existing = await sql`SELECT id FROM promos WHERE name = 'Promo Juli 2026'`;
  if (existing.length === 0) {
    await sql`
      INSERT INTO promos (name, package, quota, deadline, active, bonus_tiers)
      VALUES
        ('Promo Juli 2026', 'starter', 100, '2026-07-31 23:59:59', true,
         '{"tiers":[
           {"min":1,"max":10,"bonus":"Domain .com 2 tahun"},
           {"min":11,"max":30,"bonus":"Domain .com 1 tahun"},
           {"min":31,"max":50,"bonus":"Setup Google Business"},
           {"min":51,"max":100,"bonus":"Harga promo saja"}
         ]}'::jsonb),
        ('Promo Juli 2026', 'business', 50, '2026-07-31 23:59:59', true,
         '{"tiers":[
           {"min":1,"max":10,"bonus":"Domain .com 2 tahun"},
           {"min":11,"max":25,"bonus":"Domain .com 1 tahun"},
           {"min":26,"max":50,"bonus":"Harga promo saja"}
         ]}'::jsonb)
    `;
  }
}
