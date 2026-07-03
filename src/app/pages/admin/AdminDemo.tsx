import { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminButton,
  AdminToggle,
  AdminBadge,
  AdminSaveBar,
} from '@/admin/components';
import {
  STORAGE_KEYS,
  loadDemoData,
  saveToStorage,
  resetStorage,
  DEMO_CATEGORIES,
  type DemoData,
  type DemoEntry,
  type DemoTier,
} from '@/admin/storage';

const TIERS: { id: DemoTier; name: string }[] = [
  { id: 'starter', name: 'STARTER' },
  { id: 'business', name: 'BUSINESS' },
  { id: 'store', name: 'STORE' },
  { id: 'pro', name: 'PRO' },
];

const CATEGORIES = DEMO_CATEGORIES;

const selectStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  padding: '12px 16px',
  color: '#FAFAFA',
  fontSize: 15,
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, sans-serif',
  fontSize: 13,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.65)',
  marginBottom: 8,
};

function newEntry(tier: DemoTier, order: number): DemoEntry {
  return {
    id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
    tier,
    name: '',
    category: 'Klinik & Estetika',
    thumbnailUrl: '',
    demoUrl: '',
    hasAdmin: false,
    adminUrl: '',
    adminUsername: '',
    adminPassword: '',
    description: '',
    status: 'draft',
    order,
  };
}

export function AdminDemo() {
  const [data, setData] = useState<DemoData>(() => loadDemoData());
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function mutate(updater: (entries: DemoEntry[]) => DemoEntry[]) {
    setData((prev) => ({ entries: updater(prev.entries) }));
    setDirty(true);
    setSaved(false);
  }

  function updateEntry(id: string, patch: Partial<DemoEntry>) {
    mutate((entries) => entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function addEntry(tier: DemoTier) {
    mutate((entries) => {
      const tierEntries = entries.filter((e) => e.tier === tier);
      const maxOrder = tierEntries.reduce((m, e) => Math.max(m, e.order), -1);
      return [...entries, newEntry(tier, maxOrder + 1)];
    });
  }

  function deleteEntry(id: string) {
    mutate((entries) => entries.filter((e) => e.id !== id));
  }

  function moveEntry(tier: DemoTier, id: string, dir: -1 | 1) {
    mutate((entries) => {
      const tierEntries = entries
        .filter((e) => e.tier === tier)
        .sort((a, b) => a.order - b.order);
      const idx = tierEntries.findIndex((e) => e.id === id);
      const swapIdx = idx + dir;
      if (idx < 0 || swapIdx < 0 || swapIdx >= tierEntries.length) return entries;
      const a = tierEntries[idx];
      const b = tierEntries[swapIdx];
      const aOrder = a.order;
      const bOrder = b.order;
      return entries.map((e) => {
        if (e.id === a.id) return { ...e, order: bOrder };
        if (e.id === b.id) return { ...e, order: aOrder };
        return e;
      });
    });
  }

  function handleSave() {
    saveToStorage(STORAGE_KEYS.DEMO, data);
    setDirty(false);
    setSaved(true);
  }

  function handleReset() {
    resetStorage(STORAGE_KEYS.DEMO);
    setData({ entries: [] });
    setDirty(false);
    setSaved(false);
  }

  return (
    <div>
      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          color: 'rgba(255,255,255,0.55)',
          margin: '0 0 16px',
          lineHeight: 1.6,
        }}
      >
        Kelola contoh website demo per paket. Demo dengan status <strong style={{ color: '#FFD147' }}>Draft</strong> tidak
        tampil di halaman publik — ubah ke <strong style={{ color: '#C6FF4A' }}>Aktif</strong> setelah lengkap.
      </p>

      <button
        onClick={() => {
          const entries = data.entries;

          const grouped: Record<string, any[]> = {};
          entries.forEach((e) => {
            if (!grouped[e.tier]) grouped[e.tier] = [];
            grouped[e.tier].push({
              id: e.id,
              tier: e.tier,
              name: e.name,
              category: e.category,
              description: e.description,
              url: e.demoUrl,
              adminUrl: e.adminUrl || '',
              adminUser: e.adminUsername,
              adminPass: e.adminPassword,
              thumbnail: e.thumbnailUrl || '',
              status: e.status,
              order: e.order,
            });
          });

          const lines = Object.entries(grouped)
            .map(
              ([tier, items]) =>
                `  ${tier}: ${JSON.stringify(items, null, 4).split('\n').join('\n  ')},`
            )
            .join('\n');

          const output = `// Copy paste ke src/data/demoData.ts\n${lines}`;
          navigator.clipboard.writeText(output);
          alert('Data berhasil di-copy! Paste ke demoData.ts');
        }}
        style={{
          background: '#C6FF4A',
          color: '#000',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        📋 Export Data ke Code
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {TIERS.map((tier) => {
          const entries = data.entries
            .filter((e) => e.tier === tier.id)
            .sort((a, b) => a.order - b.order);
          return (
            <AdminCard key={tier.id}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: entries.length ? 20 : 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#C6FF4A',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {tier.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {entries.length} demo
                  </span>
                </div>
                <AdminButton variant="secondary" icon={Plus} onClick={() => addEntry(tier.id)}>
                  Tambah Demo
                </AdminButton>
              </div>

              {entries.length === 0 ? (
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.35)',
                    margin: 0,
                    fontStyle: 'italic',
                  }}
                >
                  Belum ada demo untuk paket ini.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {entries.map((entry, idx) => (
                    <div
                      key={entry.id}
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 12,
                        padding: 18,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 16,
                          gap: 12,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <AdminBadge status={entry.status === 'active' ? 'aktif' : 'draft'} />
                          <span
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: 14,
                              fontWeight: 600,
                              color: 'rgba(255,255,255,0.85)',
                            }}
                          >
                            {entry.name || 'Demo tanpa nama'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <IconBtn
                            label="Naik"
                            disabled={idx === 0}
                            onClick={() => moveEntry(tier.id, entry.id, -1)}
                          >
                            <ArrowUp size={16} />
                          </IconBtn>
                          <IconBtn
                            label="Turun"
                            disabled={idx === entries.length - 1}
                            onClick={() => moveEntry(tier.id, entry.id, 1)}
                          >
                            <ArrowDown size={16} />
                          </IconBtn>
                          <IconBtn label="Hapus" danger onClick={() => deleteEntry(entry.id)}>
                            <Trash2 size={16} />
                          </IconBtn>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                          gap: 14,
                        }}
                      >
                        <AdminInput
                          label="Nama bisnis / demo"
                          value={entry.name}
                          onChange={(v) => updateEntry(entry.id, { name: v })}
                          placeholder="Klinik Kecantikan Aurelia"
                        />
                        <div>
                          <label style={labelStyle}>Kategori bisnis</label>
                          <select
                            value={entry.category}
                            onChange={(e) =>
                              updateEntry(entry.id, { category: e.target.value as DemoCategory })
                            }
                            style={selectStyle}
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c} style={{ background: '#0D0F0D' }}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <AdminInput
                          label="URL thumbnail"
                          type="url"
                          value={entry.thumbnailUrl}
                          onChange={(v) => updateEntry(entry.id, { thumbnailUrl: v })}
                          placeholder="https://..."
                        />
                        <AdminInput
                          label="URL demo penuh"
                          type="url"
                          value={entry.demoUrl}
                          onChange={(v) => updateEntry(entry.id, { demoUrl: v })}
                          placeholder="https://..."
                        />
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <AdminTextarea
                          label="Deskripsi singkat"
                          rows={2}
                          value={entry.description}
                          onChange={(v) => updateEntry(entry.id, { description: v })}
                          placeholder="1–2 kalimat tentang demo ini."
                        />
                      </div>

                      <div
                        style={{
                          marginTop: 16,
                          paddingTop: 16,
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                        }}
                      >
                        <AdminToggle
                          checked={entry.hasAdmin}
                          onChange={(v) => updateEntry(entry.id, { hasAdmin: v })}
                          label="Ada admin panel?"
                        />
                        <AdminToggle
                          checked={entry.status === 'active'}
                          onChange={(v) => updateEntry(entry.id, { status: v ? 'active' : 'draft' })}
                          label={entry.status === 'active' ? 'Aktif' : 'Draft'}
                        />
                      </div>

                      {entry.hasAdmin && (
                        <div
                          style={{
                            marginTop: 14,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: 14,
                          }}
                        >
                          <AdminInput
                            label="URL admin panel demo"
                            type="url"
                            value={entry.adminUrl}
                            onChange={(v) => updateEntry(entry.id, { adminUrl: v })}
                            placeholder="https://.../admin"
                          />
                          <AdminInput
                            label="Username demo"
                            value={entry.adminUsername}
                            onChange={(v) => updateEntry(entry.id, { adminUsername: v })}
                            placeholder="demo"
                          />
                          <AdminInput
                            label="Password demo"
                            value={entry.adminPassword}
                            onChange={(v) => updateEntry(entry.id, { adminPassword: v })}
                            placeholder="demo123"
                          />
                        </div>
                      )}

                      {entry.demoUrl && (
                        <a
                          href={entry.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            marginTop: 14,
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 13,
                            color: 'rgba(198,255,74,0.8)',
                            textDecoration: 'none',
                          }}
                        >
                          Pratinjau demo <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
          );
        })}
      </div>

      <AdminSaveBar onSave={handleSave} onReset={handleReset} dirty={dirty} saved={saved} />
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled = false,
  danger = false,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.1)',
        color: disabled ? 'rgba(255,255,255,0.2)' : danger ? '#ff6b6b' : 'rgba(255,255,255,0.6)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}
export default AdminDemo;
