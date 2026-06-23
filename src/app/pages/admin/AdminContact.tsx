import { useState } from 'react';
import { ExternalLink, Plus, X } from 'lucide-react';
import { AdminCard, AdminInput, AdminTextarea, AdminButton, AdminSaveBar } from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, resetStorage, type ContactContent } from '@/admin/storage';
import { DEFAULT_CONTACT } from '@/app/components/sections/Contact';

export function AdminContact() {
  const [form, setForm] = useState<ContactContent>(() => loadFromStorage(STORAGE_KEYS.CONTACT, DEFAULT_CONTACT));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function markDirty() {
    setDirty(true);
    setSaved(false);
  }

  function set<K extends keyof ContactContent>(key: K, value: ContactContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    markDirty();
  }

  function setLabel(key: keyof ContactContent['fieldLabels'], value: string) {
    setForm((prev) => ({ ...prev, fieldLabels: { ...prev.fieldLabels, [key]: value } }));
    markDirty();
  }

  function updateBudget(index: number, value: string) {
    setForm((prev) => {
      const budgetRanges = prev.budgetRanges.slice();
      budgetRanges[index] = value;
      return { ...prev, budgetRanges };
    });
    markDirty();
  }

  function addBudget() {
    setForm((prev) => ({ ...prev, budgetRanges: [...prev.budgetRanges, ''] }));
    markDirty();
  }

  function removeBudget(index: number) {
    setForm((prev) => ({ ...prev, budgetRanges: prev.budgetRanges.filter((_, i) => i !== index) }));
    markDirty();
  }

  function handleSave() {
    saveToStorage(STORAGE_KEYS.CONTACT, form);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    resetStorage(STORAGE_KEYS.CONTACT);
    setForm(DEFAULT_CONTACT);
    setDirty(false);
    setSaved(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 22, fontWeight: 800, color: '#FAFAFA', margin: 0 }}>
          Kontak
        </h2>
        <AdminButton variant="secondary" icon={ExternalLink} onClick={() => window.open('/#/', '_blank')}>
          Lihat di Homepage
        </AdminButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AdminCard title="Headline">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AdminInput label="Headline" value={form.headline} onChange={(v) => set('headline', v)} />
            <AdminTextarea label="Subheadline" value={form.subheadline} onChange={(v) => set('subheadline', v)} rows={2} />
          </div>
        </AdminCard>

        <AdminCard title="Label Field">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <AdminInput label="Label Nama" value={form.fieldLabels.name} onChange={(v) => setLabel('name', v)} />
            <AdminInput label="Label Bisnis" value={form.fieldLabels.business} onChange={(v) => setLabel('business', v)} />
            <AdminInput label="Label Budget" value={form.fieldLabels.budget} onChange={(v) => setLabel('budget', v)} />
            <AdminInput label="Label Pesan" value={form.fieldLabels.message} onChange={(v) => setLabel('message', v)} />
          </div>
        </AdminCard>

        <AdminCard title="Pilihan Budget">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {form.budgetRanges.map((opt, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <input
                    value={opt}
                    onChange={(e) => updateBudget(i, e.target.value)}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10, padding: '10px 14px', color: '#FAFAFA', fontSize: 14,
                      fontFamily: 'Inter, sans-serif', outline: 'none',
                    }}
                  />
                </div>
                <button
                  onClick={() => removeBudget(i)}
                  aria-label="Hapus pilihan"
                  style={{
                    flexShrink: 0, width: 36, height: 36, borderRadius: 10,
                    background: 'transparent', border: '1px solid rgba(212,24,61,0.4)',
                    color: '#ff6b6b', cursor: 'pointer', display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            <AdminButton variant="secondary" icon={Plus} onClick={addBudget}>
              Tambah Pilihan Budget
            </AdminButton>
          </div>
        </AdminCard>

        <AdminCard title="WhatsApp & Tombol">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AdminInput label="Nomor WhatsApp" value={form.waNumber} onChange={(v) => set('waNumber', v)} placeholder="6281234567890" />
            <AdminInput label="Teks Tombol Submit" value={form.submitButtonText} onChange={(v) => set('submitButtonText', v)} />
          </div>
        </AdminCard>
      </div>

      <AdminSaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={handleReset} />
    </div>
  );
}
