import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { AdminCard, AdminInput, AdminButton, AdminSaveBar } from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, saveToServer, resetStorage, type PricingContent, type PricingTier } from '@/admin/storage';
import { ADMIN_CREDENTIALS } from '@/admin/config';
import { DEFAULT_PRICING } from '@/app/components/sections/PricingSection';
import { AdminPricingTierEditor } from './AdminPricingTierEditor';

export function AdminPricing() {
  const [form, setForm] = useState<PricingContent>(() => loadFromStorage(STORAGE_KEYS.PRICING, DEFAULT_PRICING));
  const [openId, setOpenId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function markDirty() {
    setDirty(true);
    setSaved(false);
    setSaveError(null);
  }

  function setLabel<K extends keyof PricingContent>(key: K, value: PricingContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    markDirty();
  }

  function updateTier(next: PricingTier) {
    setForm((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) => (t.id === next.id ? next : t)),
    }));
    markDirty();
  }

  function recommendTier(id: string) {
    setForm((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) => ({ ...t, recommended: t.id === id ? !t.recommended : false })),
    }));
    markDirty();
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const ok = await saveToServer(STORAGE_KEYS.PRICING, form, ADMIN_CREDENTIALS.password);
    if (ok) {
      saveToStorage(STORAGE_KEYS.PRICING, form);
      window.dispatchEvent(new Event('awd-pricing-updated'));
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setSaveError('Gagal menyimpan ke server. Periksa koneksi atau coba lagi.');
    }
    setSaving(false);
  }

  function handleReset() {
    resetStorage(STORAGE_KEYS.PRICING);
    setForm(DEFAULT_PRICING);
    setDirty(false);
    setSaved(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 22, fontWeight: 800, color: '#FAFAFA', margin: 0 }}>
          Paket Harga
        </h2>
        <AdminButton variant="secondary" icon={ExternalLink} onClick={() => window.open('/#/', '_blank')}>
          Lihat di Homepage
        </AdminButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AdminCard title="Label Toggle">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <AdminInput label="Label Tanpa Admin" value={form.labelNoAdmin} onChange={(v) => setLabel('labelNoAdmin', v)} />
            <AdminInput label="Label + Admin Panel" value={form.labelWithAdmin} onChange={(v) => setLabel('labelWithAdmin', v)} />
          </div>
        </AdminCard>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {form.tiers.map((tier) => (
            <AdminPricingTierEditor
              key={tier.id}
              tier={tier}
              open={openId === tier.id}
              onToggleOpen={() => setOpenId(openId === tier.id ? null : tier.id)}
              onChange={updateTier}
              onRecommend={() => recommendTier(tier.id)}
            />
          ))}
        </div>
      </div>

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
export default AdminPricing;
