import { useState } from 'react';
import { ExternalLink, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { AdminCard, AdminInput, AdminTextarea, AdminButton, AdminToggle, AdminSaveBar } from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, resetStorage, type WhyContent, type WhyRow } from '@/admin/storage';
import { DEFAULT_WHY } from '@/app/components/sections/WhyAWD';

function withSequentialOrder(rows: WhyRow[]): WhyRow[] {
  return rows.map((r, i) => ({ ...r, order: i + 1 }));
}

export function AdminWhy() {
  const [form, setForm] = useState<WhyContent>(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.WHY, DEFAULT_WHY);
    return { ...loaded, rows: loaded.rows.slice().sort((a, b) => a.order - b.order) };
  });
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function markDirty() {
    setDirty(true);
    setSaved(false);
  }

  function set<K extends keyof WhyContent>(key: K, value: WhyContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    markDirty();
  }

  function updateRow(id: string, patch: Partial<WhyRow>) {
    setForm((prev) => ({ ...prev, rows: prev.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
    markDirty();
  }

  function move(index: number, dir: -1 | 1) {
    setForm((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.rows.length) return prev;
      const rows = prev.rows.slice();
      [rows[index], rows[target]] = [rows[target], rows[index]];
      return { ...prev, rows: withSequentialOrder(rows) };
    });
    markDirty();
  }

  function removeRow(id: string) {
    setForm((prev) => ({ ...prev, rows: withSequentialOrder(prev.rows.filter((r) => r.id !== id)) }));
    markDirty();
  }

  function addRow() {
    setForm((prev) => ({
      ...prev,
      rows: [...prev.rows, { id: `row-${Date.now()}`, order: prev.rows.length + 1, label: 'Baris baru', awd: true, wordpress: false }],
    }));
    markDirty();
  }

  function handleSave() {
    saveToStorage(STORAGE_KEYS.WHY, { ...form, rows: withSequentialOrder(form.rows) });
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    resetStorage(STORAGE_KEYS.WHY);
    setForm({ ...DEFAULT_WHY, rows: DEFAULT_WHY.rows.slice().sort((a, b) => a.order - b.order) });
    setDirty(false);
    setSaved(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 22, fontWeight: 800, color: '#FAFAFA', margin: 0 }}>
          Kenapa AWD
        </h2>
        <AdminButton variant="secondary" icon={ExternalLink} onClick={() => window.open('/#/', '_blank')}>
          Lihat di Homepage
        </AdminButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AdminCard title="Header Kolom">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <AdminInput label="Kolom 1" value={form.col1Header} onChange={(v) => set('col1Header', v)} />
            <AdminInput label="Kolom 2" value={form.col2Header} onChange={(v) => set('col2Header', v)} />
            <AdminInput label="Kolom 3" value={form.col3Header} onChange={(v) => set('col3Header', v)} />
          </div>
        </AdminCard>

        <AdminCard title="Baris Perbandingan">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {form.rows.map((row, index) => (
              <div
                key={row.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '10px 12px',
                }}
              >
                <div style={{ flex: 1, minWidth: 160 }}>
                  <input
                    value={row.label}
                    onChange={(e) => updateRow(row.id, { label: e.target.value })}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10, padding: '10px 14px', color: '#FAFAFA', fontSize: 14,
                      fontFamily: 'Inter, sans-serif', outline: 'none',
                    }}
                  />
                </div>
                <AdminToggle checked={row.awd} onChange={(v) => updateRow(row.id, { awd: v })} label={form.col2Header} />
                <AdminToggle checked={row.wordpress} onChange={(v) => updateRow(row.id, { wordpress: v })} label={form.col3Header} />
                <button onClick={() => move(index, -1)} disabled={index === 0} aria-label="Naik" style={iconBtn(index === 0)}>
                  <ArrowUp size={15} />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === form.rows.length - 1} aria-label="Turun" style={iconBtn(index === form.rows.length - 1)}>
                  <ArrowDown size={15} />
                </button>
                <button onClick={() => removeRow(row.id)} aria-label="Hapus" style={dangerBtn}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <AdminButton variant="secondary" icon={Plus} onClick={addRow}>
              Tambah Baris
            </AdminButton>
          </div>
        </AdminCard>

        <AdminCard title="Callout Garansi">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AdminInput label="Judul" value={form.guaranteeTitle} onChange={(v) => set('guaranteeTitle', v)} />
            <AdminTextarea label="Deskripsi" value={form.guaranteeDescription} onChange={(v) => set('guaranteeDescription', v)} rows={3} />
            <AdminToggle checked={form.guaranteeVisible} onChange={(v) => set('guaranteeVisible', v)} label="Tampilkan callout garansi" />
          </div>
        </AdminCard>
      </div>

      <AdminSaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={handleReset} />
    </div>
  );
}

function iconBtn(disabled: boolean): React.CSSProperties {
  return {
    flexShrink: 0, width: 32, height: 32, borderRadius: 8,
    background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.7)', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };
}

const dangerBtn: React.CSSProperties = {
  flexShrink: 0, width: 32, height: 32, borderRadius: 8,
  background: 'transparent', border: '1px solid rgba(212,24,61,0.4)',
  color: '#ff6b6b', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};
