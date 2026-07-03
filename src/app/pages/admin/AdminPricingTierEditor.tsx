import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { AdminInput, AdminButton, AdminToggle } from '@/admin/components';
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
            <AdminInput label="Harga" value={tier.price} onChange={(v) => set('price', v)} placeholder="Rp 2.500.000" />
            <AdminInput label="Harga Coret" value={tier.originalPrice} onChange={(v) => set('originalPrice', v)} placeholder="Rp 5.000.000" />
          </div>

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
            <AdminToggle checked={tier.showDemoButton} onChange={(v) => set('showDemoButton', v)} label="Tampilkan tombol 'Lihat Demo'" />
            <AdminToggle checked={tier.recommended} onChange={() => onRecommend()} label="Paling Direkomendasikan" />
          </div>
        </div>
      )}
    </div>
  );
}
