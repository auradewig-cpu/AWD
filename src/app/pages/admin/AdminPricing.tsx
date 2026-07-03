import { useState } from 'react';
import { ExternalLink, RotateCcw } from 'lucide-react';
import { AdminButton, AdminSaveBar } from '@/admin/components';
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

  async function handleServerReset() {
    if (!confirm('Reset semua data pricing ke default? Data di server dan local akan dihapus.')) return;
    try {
      await fetch('/api/content?key=pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: null, password: 'Surakarta93' }),
      });
    } catch {}
    location.reload();
  }

  async function resetPricingToDefault() {
    const ok = await saveToServer(STORAGE_KEYS.PRICING, DEFAULT_PRICING, ADMIN_CREDENTIALS.password);
    if (ok) {
      saveToStorage(STORAGE_KEYS.PRICING, DEFAULT_PRICING);
      setForm(DEFAULT_PRICING);
      window.dispatchEvent(new Event('awd-pricing-updated'));
      alert('Pricing berhasil direset ke default baru.');
    }
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, gap: 12 }}>
        <AdminSaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={handleReset} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={resetPricingToDefault}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(198,255,74,0.1)',
              border: '1px solid rgba(198,255,74,0.25)',
              borderRadius: 10, padding: '10px 18px',
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              color: '#C6FF4A', cursor: 'pointer', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(198,255,74,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(198,255,74,0.1)'; }}
          >
            <RotateCcw size={14} />
            Reset ke Default Baru
          </button>
          <button
            onClick={handleServerReset}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,107,107,0.1)',
              border: '1px solid rgba(255,107,107,0.25)',
              borderRadius: 10, padding: '10px 18px',
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              color: '#ff6b6b', cursor: 'pointer', transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.1)'; }}
          >
            <RotateCcw size={14} />
            Reset ke Default
          </button>
        </div>
      </div>
      {saving && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'right', margin: '8px 0 0' }}>
          Menyimpan...
        </p>
      )}
    </div>
  );
}
export default AdminPricing;
