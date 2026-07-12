import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { AdminCard, AdminTextarea, AdminButton, AdminToggle, AdminSaveBar } from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, saveToServer, resetStorage, type TrustContent } from '@/admin/storage';
import { DEFAULT_TRUST } from '@/app/components/sections/TrustBar';

export function AdminTrust() {
  const [form, setForm] = useState<TrustContent>(() => loadFromStorage(STORAGE_KEYS.TRUST, DEFAULT_TRUST));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function set<K extends keyof TrustContent>(key: K, value: TrustContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
    setSaveError(null);
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const ok = await saveToServer(STORAGE_KEYS.TRUST, form);
    if (ok) {
      saveToStorage(STORAGE_KEYS.TRUST, form);
      window.dispatchEvent(new Event('awd-trust-updated'));
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setSaveError('Gagal menyimpan ke server. Periksa koneksi atau coba lagi.');
    }
    setSaving(false);
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

      {saveError && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#ff6b6b', textAlign: 'right', margin: '8px 0 0' }}>
          {saveError}
        </p>
      )}
      <AdminSaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={handleReset} />
      {saving && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'right', margin: '8px 0 0' }}>
          Menyimpan...
        </p>
      )}
    </div>
  );
}
export default AdminTrust;
