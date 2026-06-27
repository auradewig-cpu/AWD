import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { AdminCard, AdminTextarea, AdminButton, AdminToggle, AdminSaveBar } from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, resetStorage, type TrustContent } from '@/admin/storage';
import { DEFAULT_TRUST } from '@/app/components/sections/TrustBar';

export function AdminTrust() {
  const [form, setForm] = useState<TrustContent>(() => loadFromStorage(STORAGE_KEYS.TRUST, DEFAULT_TRUST));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof TrustContent>(key: K, value: TrustContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  }

  function handleSave() {
    saveToStorage(STORAGE_KEYS.TRUST, form);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    resetStorage(STORAGE_KEYS.TRUST);
    setForm(DEFAULT_TRUST);
    setDirty(false);
    setSaved(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 22, fontWeight: 800, color: '#FAFAFA', margin: 0 }}>
          Trust Bar
        </h2>
        <AdminButton variant="secondary" icon={ExternalLink} onClick={() => window.open('/#/', '_blank')}>
          Lihat di Homepage
        </AdminButton>
      </div>

      <AdminCard title="Konten Trust Bar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AdminTextarea label="Teks" value={form.text} onChange={(v) => set('text', v)} rows={3} />
          <AdminToggle checked={form.visible} onChange={(v) => set('visible', v)} label="Tampilkan trust bar di homepage" />
        </div>
      </AdminCard>

      <AdminSaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={handleReset} />
    </div>
  );
}
export default AdminTrust;
