import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ExternalLink, Rocket } from 'lucide-react';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import {
  loadDemoData,
  saveToStorage,
  STORAGE_KEYS,
  DEMO_CATEGORIES,
  type DemoTier,
  type DemoCategory,
  type DemoEntry,
} from '@/admin/storage';
import { DEMO_DATA } from '@/data/demoData';

const WA_NUMBER = '6285286427559';

const TIER_META: Record<DemoTier, { name: string; subtitle: string }> = {
  starter: { name: 'STARTER', subtitle: 'Landing page + admin panel' },
  business: { name: 'BUSINESS', subtitle: 'Company profile + blog + admin panel' },
  store: { name: 'STORE', subtitle: 'Toko online + sistem pesanan' },
  pro: { name: 'PRO', subtitle: 'Web app + database + payment gateway' },
};

const CATEGORIES = DEMO_CATEGORIES;

const VALID_TIERS = Object.keys(TIER_META) as DemoTier[];

const pillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 11,
  color: '#C6FF4A',
  background: 'rgba(198,255,74,0.08)',
  border: '1px solid rgba(198,255,74,0.2)',
  borderRadius: 999,
  padding: '4px 12px',
};

export function DemoTierPage() {
  const { tier } = useParams<{ tier: string }>();
  const [activeFilter, setActiveFilter] = useState<'Semua' | DemoCategory>('Semua');

  const isValid = !!tier && VALID_TIERS.includes(tier as DemoTier);
  const tierId = tier as DemoTier;

  const allEntries = useMemo(() => {
    // Coba baca dari localStorage dulu — data admin adalah source of truth
    try {
      const stored = loadDemoData();
      const entries = stored?.entries ?? [];
      if (entries.length > 0) {
        return entries;
      }
    } catch {
      // localStorage error → fallback ke static
    }

    // Hanya pakai static data kalau localStorage BENAR-BENAR kosong
    // (pertama kali buka di browser baru, sebelum admin input apapun)
    const staticEntries: DemoEntry[] = [];
    const allTiers = Object.entries(DEMO_DATA) as [string, any[]][];

    for (const [tierKey, tierItems] of allTiers) {
      for (const d of tierItems) {
        staticEntries.push({
          id: String(d.id),
          tier: tierKey as DemoTier,
          name: d.name,
          category: d.category as DemoCategory,
          description: d.description || '',
          demoUrl: d.url || d.demoUrl || '',
          hasAdmin: !!d.adminUrl,
          adminUrl: d.adminUrl || '',
          adminUsername: d.adminUser || d.adminUsername || '',
          adminPassword: d.adminPass || d.adminPassword || '',
          thumbnailUrl: d.thumbnail || d.thumbnailUrl || '',
          status: (d.status || 'active') as 'active' | 'draft',
          order: d.order ?? 0,
        });
      }
    }

    if (staticEntries.length > 0) {
      try {
        saveToStorage(STORAGE_KEYS.DEMO, { entries: staticEntries });
      } catch {}
    }

    return staticEntries;
  }, []); // run sekali saat mount — localStorage adalah source of truth

  const visibleEntries = useMemo(() => {
    if (!isValid) return [];
    return allEntries
      .filter((e) => e.tier === tierId && e.status === 'active')
      .filter((e) => activeFilter === 'Semua' || e.category === activeFilter)
      .sort((a, b) => a.order - b.order);
  }, [allEntries, isValid, tierId, activeFilter]);

  if (!isValid) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#07080A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 18,
        }}
      >
        <h1
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 26,
            fontWeight: 800,
            color: '#FAFAFA',
            margin: 0,
            textAlign: 'center',
          }}
        >
          Tier tidak ditemukan
        </h1>
        <Link
          to="/"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            color: '#C6FF4A',
            textDecoration: 'none',
          }}
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const meta = TIER_META[tierId];

  return (
    <div style={{ minHeight: '100vh', background: '#07080A', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main
        style={{
          flex: 1,
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          padding: '120px 24px 80px',
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            marginBottom: 28,
          }}
        >
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
            Beranda
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Demo</span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
          <span style={{ color: '#C6FF4A' }}>{meta.name}</span>
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h1
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: 800,
              color: '#FAFAFA',
              letterSpacing: '-0.02em',
              margin: '0 0 12px',
            }}
          >
            Contoh Website {meta.name}
          </h1>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 17,
              color: 'rgba(255,255,255,0.55)',
              margin: 0,
              maxWidth: 620,
              lineHeight: 1.6,
            }}
          >
            {meta.subtitle}. Jelajahi contoh nyata yang bisa kamu buka langsung untuk paket ini.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            margin: '36px 0 40px',
          }}
        >
          {(['Semua', ...CATEGORIES] as const).map((cat) => {
            const active = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '8px 16px',
                  borderRadius: 999,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: active ? '#C6FF4A' : 'rgba(255,255,255,0.04)',
                  color: active ? '#07080A' : 'rgba(255,255,255,0.6)',
                  border: active ? '1px solid #C6FF4A' : '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid or empty state */}
        {visibleEntries.length === 0 ? (
          <EmptyState />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {visibleEntries.map((entry, i) => (
              <DemoCard key={entry.id} entry={entry} index={i} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function DemoCard({ entry, index }: { entry: DemoEntry; index: number }) {
  const thumbSrc = entry.thumbnailUrl || `https://placehold.co/600x400/0d0d0d/C6FF4A?text=${encodeURIComponent(entry.name)}`;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: Math.min(index * 0.06, 0.3) }}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '16 / 10', background: '#0D0F0D' }}>
        <img
          src={thumbSrc}
          alt={entry.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Body */}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <h3
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 19,
              fontWeight: 700,
              color: '#FAFAFA',
              margin: 0,
            }}
          >
            {entry.name || 'Demo'}
          </h3>
          <span style={{ ...pillStyle, flexShrink: 0 }}>{entry.category}</span>
        </div>

        {entry.description && (
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: 'rgba(255,255,255,0.55)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {entry.description}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 'auto', paddingTop: 4 }}>
          <a
            href={entry.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: '#C6FF4A',
              color: '#07080A',
              borderRadius: 999,
              padding: '10px 18px',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              textDecoration: 'none',
            }}
          >
            Buka Demo <ExternalLink size={15} />
          </a>
          {entry.hasAdmin && (
            <a
              href={entry.adminUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                color: '#FAFAFA',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 999,
                padding: '10px 18px',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
              }}
            >
              Coba Admin Panel <ExternalLink size={15} />
            </a>
          )}
        </div>

        {entry.hasAdmin && (
          <div
            style={{
              background: '#07080A',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: 12,
              marginTop: 4,
            }}
          >
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                margin: '0 0 8px',
              }}
            >
              Kredensial Demo
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <CredRow label="User" value={entry.adminUsername} />
              <CredRow label="Pass" value={entry.adminPassword} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CredRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
      <span style={{ color: 'rgba(255,255,255,0.4)', minWidth: 36 }}>{label}</span>
      <span style={{ color: '#C6FF4A' }}>{value || '—'}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 18,
        padding: '64px 24px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px dashed rgba(255,255,255,0.1)',
        borderRadius: 16,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: 'rgba(198,255,74,0.08)',
          border: '1px solid rgba(198,255,74,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Rocket size={26} style={{ color: '#C6FF4A' }} />
      </div>
      <p
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 19,
          fontWeight: 700,
          color: '#FAFAFA',
          margin: 0,
        }}
      >
        Demo untuk paket ini sedang disiapkan
      </p>
      <a
        href={`https://wa.me/${WA_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#C6FF4A',
          color: '#07080A',
          borderRadius: 999,
          padding: '11px 22px',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          textDecoration: 'none',
        }}
      >
        Konsultasi Langsung →
      </a>
    </div>
  );
}

export default DemoTierPage;
