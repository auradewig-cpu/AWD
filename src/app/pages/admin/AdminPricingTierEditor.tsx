import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { AdminInput, AdminTextarea, AdminButton, AdminToggle } from '@/admin/components';
import type { PricingTier } from '@/admin/storage';

interface Props {
  tier: PricingTier;
  open: boolean;
  onToggleOpen: () => void;
  onChange: (next: PricingTier) => void;
  onRecommend: () => void;
}

export function AdminPricingTierEditor({ tier, open, onToggleOpen, onChange, onRecommend }: Props) {
  function set<K extends keyof PricingTier>(key: K, value: PricingTier[K]) {
    onChange({ ...tier, [key]: value });
  }

  function setNumber<K extends keyof PricingTier>(key: K, raw: string) {
    const n = Number(raw.replace(/[^0-9]/g, ''));
    onChange({ ...tier, [key]: (Number.isNaN(n) ? 0 : n) as PricingTier[K] });
  }

  function updateFeature(index: number, value: string) {
    const features = tier.features.slice();
    features[index] = value;
    onChange({ ...tier, features });
  }

  function addFeature() {
    onChange({ ...tier, features: [...tier.features, ''] });
  }

  function removeFeature(index: number) {
    onChange({ ...tier, features: tier.features.filter((_, i) => i !== index) });
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: tier.recommended ? '1px solid rgba(198,255,74,0.35)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onToggleOpen}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: tier.recommended ? '#C6FF4A' : '#FAFAFA' }}>
            {tier.name || tier.id.toUpperCase()}
          </span>
          {tier.recommended && (
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: '#07080A', background: '#C6FF4A', borderRadius: 999, padding: '2px 8px' }}>
              REKOMENDASI
            </span>
          )}
        </span>
        {open ? <ChevronUp size={18} color="rgba(255,255,255,0.5)" /> : <ChevronDown size={18} color="rgba(255,255,255,0.5)" />}
      </button>

      {open && (
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AdminInput label="Nama Tier" value={tier.name} onChange={(v) => set('name', v)} />
          <AdminInput label="Subtitle" value={tier.subtitle} onChange={(v) => set('subtitle', v)} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <AdminInput label="Harga (Tanpa Admin)" value={String(tier.priceNoAdmin)} onChange={(v) => setNumber('priceNoAdmin', v)} />
            <AdminInput label="Harga Coret (Tanpa Admin)" value={String(tier.priceNoAdminOriginal)} onChange={(v) => setNumber('priceNoAdminOriginal', v)} />
          </div>

          <AdminToggle
            checked={tier.showAdminOption}
            onChange={(v) => set('showAdminOption', v)}
            label="Tawarkan opsi + Admin Panel"
          />

          {tier.showAdminOption && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <AdminInput label="Harga (+ Admin)" value={String(tier.priceWithAdmin ?? 0)} onChange={(v) => setNumber('priceWithAdmin', v)} />
              <AdminInput label="Harga Coret (+ Admin)" value={String(tier.priceWithAdminOriginal ?? 0)} onChange={(v) => setNumber('priceWithAdminOriginal', v)} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>
              Fitur
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tier.features.map((feat, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      value={feat}
                      onChange={(e) => updateFeature(i, e.target.value)}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10, padding: '10px 14px', color: '#FAFAFA', fontSize: 14,
                        fontFamily: 'Inter, sans-serif', outline: 'none',
                      }}
                    />
                  </div>
                  <button
                    onClick={() => removeFeature(i)}
                    aria-label="Hapus fitur"
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
              <AdminButton variant="secondary" icon={Plus} onClick={addFeature}>
                Tambah Fitur
              </AdminButton>
            </div>
          </div>

          <AdminInput label="Teks Tombol CTA" value={tier.ctaText} onChange={(v) => set('ctaText', v)} />
          <AdminInput label="Nomor WhatsApp" value={tier.waNumber} onChange={(v) => set('waNumber', v)} placeholder="6285286427559" />
          <AdminTextarea
            label="Template Pesan WhatsApp ({name} & {subtitle} otomatis diganti)"
            value={tier.waMessageTemplate}
            onChange={(v) => set('waMessageTemplate', v)}
            rows={3}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
            <AdminToggle checked={tier.showDemoButton} onChange={(v) => set('showDemoButton', v)} label="Tampilkan tombol 'Lihat Demo'" />
            <AdminToggle checked={tier.recommended} onChange={() => onRecommend()} label="Paling Direkomendasikan" />
          </div>
        </div>
      )}
    </div>
  );
}
