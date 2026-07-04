import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, ChevronRight, Upload, Share2, Copy, ExternalLink, Image, MessageCircle, Instagram, Music2, Youtube, Facebook } from 'lucide-react';

const WA_NUMBER = '6285286427559';

interface PromoRegisterModalProps {
  pkg: string;
  formFields?: Array<{ id: string; label: string; type: string; required: boolean }>;
  onClose: () => void;
  onSuccess: (ticket: TicketData) => void;
}

interface TicketData {
  slotNumber: string;
  name: string;
  city: string;
  package: string;
  earlyBirdTier: number;
  bonus: string;
  referralCode: string;
  referralLink: string;
  qrCode: string;
  verifyUrl: string;
  syarat?: string[];
  form_fields?: Array<{ id: string; label: string; type: string; required: boolean }>;
}

const MEDSOS_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: '#E4405F', url: 'https://www.instagram.com/aldiwebdesigner/' },
  { key: 'tiktok', label: 'TikTok', icon: Music2, color: '#000000', url: 'https://www.tiktok.com/@awd_010101' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2', url: 'https://www.facebook.com/profile.php?id=61590366697861' },
  { key: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000', url: 'https://www.youtube.com/@AldiWebDesigner' },
];

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      const maxDim = 1200;
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/webp', 0.8));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
        <span>Step {step}/{total}</span>
        <span>{['Data Diri', 'Follow & Screenshot', 'Info Bisnis'][step - 1]}</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? '#C6FF4A' : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
    </div>
  );
}

function Step1DataDiri({ formValues, setVal, onNext }: {
  formValues: Record<string, string>;
  setVal: (id: string, val: string) => void;
  onNext: () => void;
}) {
  const fields = [
    { id: 'name', label: 'Nama lengkap', type: 'text', required: true },
    { id: 'city', label: 'Kota', type: 'text', required: true },
    { id: 'wa', label: 'No. WhatsApp', type: 'text', required: true },
    { id: 'email', label: 'Email', type: 'email', required: false },
  ];
  const valid = fields.every(f => !f.required || formValues[f.id]?.trim());

  return (
    <div>
      <h3 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 20, fontWeight: 700, color: '#FAFAFA', margin: '0 0 4px' }}>Data Diri</h3>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 24px' }}>Isi data diri kamu</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {fields.map(f => (
          <input
            key={f.id}
            type={f.type}
            placeholder={`${f.label}${f.required ? ' *' : ''}`}
            value={formValues[f.id] || ''}
            onChange={e => setVal(f.id, e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '12px 14px', color: '#FAFAFA', fontSize: 14,
              fontFamily: 'Inter, sans-serif', outline: 'none',
            }}
          />
        ))}
        <div>
          <input
            placeholder="Punya kode referral? (opsional)"
            value={formValues.referred_by || ''}
            onChange={e => setVal('referred_by', e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '12px 14px', color: '#FAFAFA', fontSize: 14,
              fontFamily: 'Inter, sans-serif', outline: 'none',
            }}
          />
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>Masukkan kode referral teman kamu</p>
        </div>
      </div>
      <button onClick={onNext} disabled={!valid} style={{
        width: '100%', marginTop: 20,
        background: valid ? '#C6FF4A' : 'rgba(198,255,74,0.2)', color: valid ? '#07080A' : 'rgba(255,255,255,0.3)',
        border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700,
        fontFamily: 'Inter, sans-serif', cursor: valid ? 'pointer' : 'not-allowed',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        Lanjut <ChevronRight size={16} />
      </button>
    </div>
  );
}

function Step2Screenshot({ formValues, setVal, onNext, onBack }: {
  formValues: Record<string, string>;
  setVal: (id: string, val: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasScreenshot = !!formValues.screenshot_medsos_url;

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log('file selected:', file.name, Math.round(file.size / 1024) + 'KB');
    setUploading(true);
    try {
      const webpDataUrl = await compressImage(file);
      console.log('upload body size KB:', Math.round(webpDataUrl.length / 1024));
      const r = await fetch('/api/upload-screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: webpDataUrl }),
      });
      console.log('upload response status:', r.status);
      const text = await r.text();
      console.log('upload response body:', text);
      const d = JSON.parse(text);
      if (d.url) setVal('screenshot_medsos_url', d.url);
    } catch {} finally { setUploading(false); }
  }

  return (
    <div>
      <h3 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 20, fontWeight: 700, color: '#FAFAFA', margin: '0 0 4px' }}>Follow & Screenshot</h3>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>Follow semua akun medsos AWD, screenshot buktinya, lalu upload</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {MEDSOS_PLATFORMS.map(pl => (
          <a key={pl.key} href={pl.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: pl.color, fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif',
            textDecoration: 'none', cursor: 'pointer',
          }}>
            <pl.icon size={14} /> {pl.label}
          </a>
        ))}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <button onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: hasScreenshot ? 'rgba(0,200,83,0.1)' : 'rgba(255,255,255,0.04)',
        border: hasScreenshot ? '1px solid rgba(0,200,83,0.3)' : '1px dashed rgba(255,255,255,0.2)',
        borderRadius: 10, padding: '24px 14px', cursor: uploading ? 'wait' : 'pointer',
        fontFamily: 'Inter, sans-serif', fontSize: 13, color: hasScreenshot ? '#00C853' : 'rgba(255,255,255,0.5)',
      }}>
        {uploading ? 'Mengupload...' : hasScreenshot ? <><Check size={16} /> Screenshot terupload</> : <><Upload size={16} /> Upload screenshot bukti follow</>}
      </button>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button onClick={onBack} style={{
          flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '14px', fontSize: 14,
          fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
        }}>Kembali</button>
        <button onClick={onNext} disabled={!hasScreenshot} style={{
          flex: 1, background: hasScreenshot ? '#C6FF4A' : 'rgba(198,255,74,0.2)',
          color: hasScreenshot ? '#07080A' : 'rgba(255,255,255,0.3)',
          border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700,
          fontFamily: 'Inter, sans-serif', cursor: hasScreenshot ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          Lanjut <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Step3InfoBisnis({ formValues, setVal, onBack, onSubmit, submitting }: {
  formValues: Record<string, string>;
  setVal: (id: string, val: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const fields = [
    { id: 'brand_name', label: 'Nama Brand / Usaha', type: 'text', required: true },
    { id: 'bisnis_desc', label: 'Deskripsi Bisnis (bidang apa, target pasar)', type: 'textarea', required: true },
    { id: 'referensi_web', label: 'Link referensi website yang kamu suka (opsional)', type: 'text', required: false },
  ];
  const valid = fields.every(f => !f.required || formValues[f.id]?.trim());

  const inputStyle = {
    width: '100%' as const, boxSizing: 'border-box' as const,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '12px 14px', color: '#FAFAFA', fontSize: 14,
    fontFamily: 'Inter, sans-serif', outline: 'none',
  };

  return (
    <div>
      <h3 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 20, fontWeight: 700, color: '#FAFAFA', margin: '0 0 4px' }}>Info Bisnis</h3>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 24px' }}>Ceritakan tentang bisnis kamu</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {fields.map(f => (
          f.type === 'textarea' ? (
            <textarea key={f.id} placeholder={`${f.label}${f.required ? ' *' : ''}`} rows={3}
              value={formValues[f.id] || ''} onChange={e => setVal(f.id, e.target.value)}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80 } as any} />
          ) : (
            <input key={f.id} type={f.type} placeholder={`${f.label}${f.required ? ' *' : ''}`}
              value={formValues[f.id] || ''} onChange={e => setVal(f.id, e.target.value)} style={inputStyle} />
          )
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button onClick={onBack} style={{
          flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '14px', fontSize: 14,
          fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
        }}>Kembali</button>
        <button onClick={onSubmit} disabled={!valid || submitting} style={{
          flex: 1, background: valid && !submitting ? '#EF4444' : 'rgba(239,68,68,0.3)',
          color: '#FAFAFA', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700,
          fontFamily: 'Inter, sans-serif', cursor: valid && !submitting ? 'pointer' : 'not-allowed',
        }}>
          {submitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
        </button>
      </div>
    </div>
  );
}

export default function PromoRegisterModal({ pkg, onClose, onSuccess }: PromoRegisterModalProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  function setVal(id: string, val: string) {
    setFormValues(prev => ({ ...prev, [id]: val }));
  }

  async function handleSubmit() {
    if (!agreed) { setError('Setujui syarat & ketentuan'); return; }
    setError('');
    setSubmitting(true);
    try {
      const body: Record<string, any> = {
        package: pkg,
        name: formValues.name?.trim(),
        wa: formValues.wa?.trim(),
        city: formValues.city?.trim(),
        email: formValues.email?.trim() || undefined,
        referred_by: formValues.referred_by?.trim() || undefined,
        brand_name: formValues.brand_name?.trim() || undefined,
        bisnis_desc: formValues.bisnis_desc?.trim() || undefined,
        referensi_web: formValues.referensi_web?.trim() || undefined,
        screenshot_medsos_url: formValues.screenshot_medsos_url || undefined,
      };
      const r = await fetch('/api/promo?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Gagal mendaftar'); setSubmitting(false); return; }
      onSuccess(d.ticket);
    } catch { setError('Gagal terhubung ke server'); setSubmitting(false); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#0E120A', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '32px 28px', maxWidth: 440, width: '100%', boxSizing: 'border-box', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
        <h3 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 20, fontWeight: 700, color: '#FAFAFA', margin: '0 0 4px' }}>Daftar Promo Juli 2026</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 24px' }}>Paket: <strong style={{ color: '#EF4444', textTransform: 'uppercase' }}>{pkg}</strong></p>

        <ProgressBar step={step} total={3} />

        {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#EF4444', margin: '0 0 12px' }}>{error}</p>}

        {step === 1 && <Step1DataDiri formValues={formValues} setVal={setVal} onNext={() => setStep(2)} />}
        {step === 2 && <Step2Screenshot formValues={formValues} setVal={setVal} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && (
          <>
            <Step3InfoBisnis formValues={formValues} setVal={setVal} onBack={() => setStep(2)} onSubmit={handleSubmit} submitting={submitting} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 16 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: '#C6FF4A' }} />
              Saya setuju dengan syarat & ketentuan promo
            </label>
          </>
        )}
      </div>
    </div>
  );
}
