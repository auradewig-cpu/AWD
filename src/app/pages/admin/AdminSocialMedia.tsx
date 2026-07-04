import { useState } from 'react';
import { ExternalLink, Instagram, Music2, Youtube, Facebook, MessageCircle } from 'lucide-react';
import { AdminCard, AdminInput, AdminButton, AdminSaveBar } from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, saveToServer, resetStorage } from '@/admin/storage';
import { ADMIN_CREDENTIALS } from '@/admin/config';

export interface SocialContent {
  instagram: string;
  tiktok: string;
  youtube: string;
  facebook: string;
  whatsapp: string;
}

export const DEFAULT_SOCIAL: SocialContent = {
  instagram: 'https://www.instagram.com/aldiwebdesigner/',
  tiktok: 'https://www.tiktok.com/@awd_010101',
  youtube: 'https://www.youtube.com/@AldiWebDesigner',
  facebook: 'https://www.facebook.com/profile.php?id=61590366697861',
  whatsapp: '6285286427559',
};

const PLATFORMS: Array<{ key: keyof SocialContent; label: string; icon: React.ReactNode; placeholder: string }> = [
  { key: 'instagram', label: 'Instagram', icon: <Instagram size={18} />, placeholder: 'https://instagram.com/username' },
  { key: 'tiktok', label: 'TikTok', icon: <Music2 size={18} />, placeholder: 'https://tiktok.com/@username' },
  { key: 'youtube', label: 'YouTube', icon: <Youtube size={18} />, placeholder: 'https://youtube.com/@channel' },
  { key: 'facebook', label: 'Facebook', icon: <Facebook size={18} />, placeholder: 'https://facebook.com/username' },
  { key: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={18} />, placeholder: '6285286427559' },
];

export function AdminSocialMedia() {
  const [form, setForm] = useState<SocialContent>(() => loadFromStorage(STORAGE_KEYS.SOCIAL, DEFAULT_SOCIAL));
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function markDirty() {
    setDirty(true);
    setSaved(false);
    setSaveError(null);
  }

  function set(key: keyof SocialContent, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    markDirty();
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const ok = await saveToServer(STORAGE_KEYS.SOCIAL, form, ADMIN_CREDENTIALS.password);
    if (ok) {
      saveToStorage(STORAGE_KEYS.SOCIAL, form);
      window.dispatchEvent(new Event('awd-social-updated'));
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setSaveError('Gagal menyimpan ke server. Periksa koneksi atau coba lagi.');
    }
    setSaving(false);
  }

  function handleReset() {
    resetStorage(STORAGE_KEYS.SOCIAL);
    setForm(DEFAULT_SOCIAL);
    setDirty(false);
    setSaved(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 22, fontWeight: 800, color: '#FAFAFA', margin: 0 }}>
          Social Media
        </h2>
        <AdminButton variant="secondary" icon={ExternalLink} onClick={() => window.open('/#/', '_blank')}>
          Lihat di Homepage
        </AdminButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <AdminCard title="Platform Links">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PLATFORMS.map((p) => (
              <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  {p.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <AdminInput label={p.label} value={form[p.key]} onChange={(v) => set(p.key, v)} placeholder={p.placeholder} />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
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

export default AdminSocialMedia;
