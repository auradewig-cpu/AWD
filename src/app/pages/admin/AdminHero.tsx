import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import {
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminButton,
  AdminToggle,
  AdminSaveBar,
} from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, resetStorage, type HeroContent } from '@/admin/storage';
import { DEFAULT_HERO } from '@/app/components/sections/Hero';

export function AdminHero() {
  const [form, setForm] = useState<HeroContent>(() => loadFromStorage(STORAGE_KEYS.HERO, DEFAULT_HERO));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof HeroContent>(key: K, value: HeroContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  }

  function handleSave() {
    saveToStorage(STORAGE_KEYS.HERO, form);
    setDirty(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    resetStorage(STORAGE_KEYS.HERO);
    setForm(DEFAULT_HERO);
    setDirty(false);
    setSaved(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 22, fontWeight: 800, color: '#FAFAFA', margin: 0 }}>
          Hero Section
        </h2>
        <AdminButton variant="secondary" icon={ExternalLink} onClick={() => window.open('/#/', '_blank')}>
          Lihat di Homepage
        </AdminButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AdminCard title="Eyebrow & Headline">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AdminInput label="Eyebrow Text" value={form.eyebrow} onChange={(v) => update('eyebrow', v)} />
            <AdminInput label="Headline Baris 1" value={form.headlineLine1} onChange={(v) => update('headlineLine1', v)} />
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <AdminInput label="Headline Highlight" value={form.headlineHighlight} onChange={(v) => update('headlineHighlight', v)} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>
                  Warna Highlight
                </label>
                <input
                  type="color"
                  value={form.headlineHighlightColor}
                  onChange={(e) => update('headlineHighlightColor', e.target.value)}
                  style={{ width: 56, height: 44, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: 'pointer', padding: 2 }}
                />
              </div>
            </div>
            <AdminInput label="Headline Baris 2" value={form.headlineLine2} onChange={(v) => update('headlineLine2', v)} />
          </div>
        </AdminCard>

        <AdminCard title="Subheadline">
          <AdminTextarea label="Subheadline" value={form.subheadline} onChange={(v) => update('subheadline', v)} rows={3} />
        </AdminCard>

        <AdminCard title="Tombol CTA">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AdminInput label="Teks CTA Utama" value={form.ctaPrimaryText} onChange={(v) => update('ctaPrimaryText', v)} />
            <AdminInput label="Nomor WhatsApp CTA Utama" value={form.ctaPrimaryWaNumber} onChange={(v) => update('ctaPrimaryWaNumber', v)} placeholder="6285286427559" />
            <AdminInput label="Teks CTA Sekunder" value={form.ctaSecondaryText} onChange={(v) => update('ctaSecondaryText', v)} />
          </div>
        </AdminCard>

        <AdminCard title="Mockup & Badge">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AdminToggle checked={form.showMockup} onChange={(v) => update('showMockup', v)} label="Tampilkan mockup device" />
            <AdminInput label="Badge 1" value={form.badge1Text} onChange={(v) => update('badge1Text', v)} />
            <AdminInput label="Badge 2" value={form.badge2Text} onChange={(v) => update('badge2Text', v)} />
          </div>
        </AdminCard>
      </div>

      <AdminSaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={handleReset} />
    </div>
  );
}
export default AdminHero;
