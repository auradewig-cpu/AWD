import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Check, Upload, ExternalLink, Image, ChevronRight } from 'lucide-react';

export function ClosingPage() {
  const { slotNumber } = useParams<{ slotNumber: string }>();
  const [registrant, setRegistrant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testimoniFile, setTestimoniFile] = useState<File | null>(null);
  const [postFile, setPostFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!slotNumber) return;
    fetch(`/api/promo?action=closing&slot=${slotNumber}`)
      .then(r => r.json())
      .then(d => setRegistrant(d.registrant))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slotNumber]);

  async function uploadFile(file: File): Promise<string> {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
    const canvas = document.createElement('canvas');
    let w = img.width, h = img.height;
    const maxDim = 1200;
    if (w > maxDim || h > maxDim) { const r = Math.min(maxDim / w, maxDim / h); w = Math.round(w * r); h = Math.round(h * r); }
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
    const webp = canvas.toDataURL('image/webp', 0.8);
    const res = await fetch('/api/upload-screenshot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: webp }) });
    const d = await res.json();
    return d.url;
  }

  async function handleSubmit() {
    if (!testimoniFile || !postFile || !slotNumber) return;
    setUploading(true);
    try {
      const testimoniUrl = await uploadFile(testimoniFile);
      const postUrl = await uploadFile(postFile);
      const res = await fetch('/api/promo?action=update-closing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot: slotNumber, password: 'awd123', testimoni_wa_url: testimoniUrl, post_sosmed_url: postUrl }),
      });
      const d = await res.json();
      if (d.success) setSubmitted(true);
    } catch {} finally { setUploading(false); }
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07080A', color: 'rgba(255,255,255,0.3)', fontFamily: 'sans-serif', fontSize: 14 }}>Memuat...</div>;

  if (!registrant) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07080A', color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif', fontSize: 14, flexDirection: 'column', gap: 12 }}>
      <p>Data tidak ditemukan</p>
      <a href="/" style={{ color: '#C6FF4A', textDecoration: 'none' }}>Kembali ke beranda</a>
    </div>
  );

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07080A', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,200,83,0.1)', marginBottom: 20 }}>
          <Check size={32} color="#00C853" />
        </div>
        <h2 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 24, fontWeight: 700, color: '#FAFAFA', margin: '0 0 8px' }}>Terima Kasih!</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 24px', lineHeight: 1.6 }}>Berkas kamu sudah kami terima. Tim AWD akan segera memproses website-mu. Pantau terus WhatsApp untuk info selanjutnya.</p>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#C6FF4A', color: '#07080A', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}>Kembali ke Beranda <ChevronRight size={16} /></a>
      </div>
    </div>
  );

  const btnStyle = {
    width: '100%' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.2)',
    borderRadius: 10, padding: '20px 14px', cursor: 'pointer' as const,
    fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07080A', padding: '40px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 28, fontWeight: 700, color: '#FAFAFA', margin: '0 0 4px' }}>Closing</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>{registrant.name} &middot; {registrant.slot_number}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px', marginBottom: 16 }}>
          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#FAFAFA', marginBottom: 16, display: 'block' }}>1. Upload Screenshot Testimoni WA</label>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '-12px 0 16px' }}>Kirim testimoni ke admin via WA, lalu screenshot dan upload buktinya</p>
          <input type="file" accept="image/*" id="testimoni-input" style={{ display: 'none' }} onChange={e => setTestimoniFile(e.target.files?.[0] || null)} />
          <label htmlFor="testimoni-input" style={btnStyle}>
            {testimoniFile ? <><Check size={16} color="#00C853" /> {testimoniFile.name}</> : <><Upload size={16} /> Pilih file screenshot testimoni</>}
          </label>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px', marginBottom: 24 }}>
          <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#FAFAFA', marginBottom: 16, display: 'block' }}>2. Upload Bukti Post Sosmed</label>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '-12px 0 16px' }}>Post template yang kami kirim ke sosmed kamu, screenshot buktinya, lalu upload</p>
          <input type="file" accept="image/*" id="post-input" style={{ display: 'none' }} onChange={e => setPostFile(e.target.files?.[0] || null)} />
          <label htmlFor="post-input" style={btnStyle}>
            {postFile ? <><Check size={16} color="#00C853" /> {postFile.name}</> : <><Upload size={16} /> Pilih file screenshot post</>}
          </label>
        </div>

        <button onClick={handleSubmit} disabled={!testimoniFile || !postFile || uploading} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: testimoniFile && postFile && !uploading ? '#C6FF4A' : 'rgba(198,255,74,0.2)',
          color: testimoniFile && postFile && !uploading ? '#07080A' : 'rgba(255,255,255,0.3)',
          border: 'none', borderRadius: 10, padding: '16px', fontSize: 15, fontWeight: 700,
          fontFamily: 'Inter, sans-serif', cursor: testimoniFile && postFile && !uploading ? 'pointer' : 'not-allowed',
        }}>
          {uploading ? 'Mengupload...' : 'Kirim Semua Berkas'}
        </button>
      </div>
    </div>
  );
}

export default ClosingPage;
