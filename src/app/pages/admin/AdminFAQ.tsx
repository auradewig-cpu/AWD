import { useState } from 'react';
import { ExternalLink, Plus, ChevronUp, ChevronDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { AdminInput, AdminTextarea, AdminButton, AdminToggle, AdminSaveBar } from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, resetStorage, type FaqContent, type FaqItem } from '@/admin/storage';
import { DEFAULT_FAQ } from '@/app/components/sections/FAQ';

function withSequentialOrder(items: FaqItem[]): FaqItem[] {
  return items.map((it, i) => ({ ...it, order: i + 1 }));
}

export function AdminFAQ() {
  const [items, setItems] = useState<FaqItem[]>(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.FAQ, DEFAULT_FAQ);
    return loaded.items.slice().sort((a, b) => a.order - b.order);
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function markDirty() {
    setDirty(true);
    setSaved(false);
  }

  function updateItem(id: string, patch: Partial<FaqItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    markDirty();
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = prev.slice();
      [next[index], next[target]] = [next[target], next[index]];
      return withSequentialOrder(next);
    });
    markDirty();
  }

  function remove(id: string) {
    setItems((prev) => withSequentialOrder(prev.filter((it) => it.id !== id)));
    markDirty();
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: `faq-${Date.now()}`, order: prev.length + 1, question: 'Pertanyaan baru', answer: '', active: true },
    ]);
    markDirty();
  }

  function handleSave() {
    const content: FaqContent = { items: withSequentialOrder(items) };
    saveToStorage(STORAGE_KEYS.FAQ, content);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    resetStorage(STORAGE_KEYS.FAQ);
    setItems(DEFAULT_FAQ.items.slice().sort((a, b) => a.order - b.order));
    setDirty(false);
    setSaved(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 22, fontWeight: 800, color: '#FAFAFA', margin: 0 }}>
          FAQ
        </h2>
        <AdminButton variant="secondary" icon={ExternalLink} onClick={() => window.open('/#/', '_blank')}>
          Lihat di Homepage
        </AdminButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((item, index) => {
          const open = openId === item.id;
          return (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px' }}>
                <button
                  onClick={() => setOpenId(open ? null : item.id)}
                  style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600,
                    color: item.active ? '#FAFAFA' : 'rgba(255,255,255,0.4)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.question || '(tanpa pertanyaan)'}
                  </span>
                </button>
                <button onClick={() => move(index, -1)} disabled={index === 0} aria-label="Naik" style={iconBtn(index === 0)}>
                  <ArrowUp size={15} />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Turun" style={iconBtn(index === items.length - 1)}>
                  <ArrowDown size={15} />
                </button>
                <button onClick={() => remove(item.id)} aria-label="Hapus" style={dangerBtn}>
                  <Trash2 size={15} />
                </button>
                <button onClick={() => setOpenId(open ? null : item.id)} aria-label="Buka" style={iconBtn(false)}>
                  {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {open && (
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <AdminInput label="Pertanyaan" value={item.question} onChange={(v) => updateItem(item.id, { question: v })} />
                  <AdminTextarea label="Jawaban" value={item.answer} onChange={(v) => updateItem(item.id, { answer: v })} rows={4} />
                  <AdminToggle checked={item.active} onChange={(v) => updateItem(item.id, { active: v })} label="Aktif (tampilkan di homepage)" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <AdminButton variant="secondary" icon={Plus} onClick={addItem}>
          Tambah FAQ
        </AdminButton>
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
