import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, Gift, Share2, Clock, Users, Zap, ChevronRight } from 'lucide-react';

const WA_NUMBER = '6285286427559';
const DEADLINE = new Date('2026-07-31T23:59:59');

interface PromoData {
  id: number;
  name: string;
  package: string;
  quota: number;
  deadline: string;
  active: boolean;
  bonus_tiers: { tiers: Array<{ min: number; max: number; bonus: string }> };
  registered: number;
  remaining: number;
  latest: Array<{ name: string; city: string; package: string; created_at: string }>;
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
}

interface LiveEntry {
  name: string;
  city: string;
  package: string;
  created_at: string;
  slot_number: string;
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    function tick() {
      const diff = DEADLINE.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace' }}>
      {[
        { label: 'Hari', value: timeLeft.d },
        { label: 'Jam', value: timeLeft.h },
        { label: 'Menit', value: timeLeft.m },
        { label: 'Detik', value: timeLeft.s },
      ].map((u) => (
        <div key={u.label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#C6FF4A', lineHeight: 1, marginBottom: 4, minWidth: 48 }}>{String(u.value).padStart(2, '0')}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{u.label}</div>
        </div>
      ))}
    </div>
  );
}

function SlotProgressBar({ registered, quota }: { registered: number; quota: number }) {
  const pct = Math.min((registered / quota) * 100, 100);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif', fontSize: 13, marginBottom: 6 }}>
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>
          <Users size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          <span style={{ verticalAlign: 'middle' }}>{registered} / {quota} slot terisi</span>
        </span>
        <span style={{ color: '#EF4444', fontWeight: 700 }}>{pct >= 80 ? '⚠️ Hampir penuh!' : ''}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? '#EF4444' : '#C6FF4A', borderRadius: 3, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

function LiveFeed() {
  const [entries, setEntries] = useState<LiveEntry[]>([]);

  const fetchLive = useCallback(async () => {
    try {
      const r = await fetch('/api/promo?action=live');
      const d = await r.json();
      if (d.latest) setEntries(d.latest);
    } catch {}
  }, []);

  useEffect(() => { fetchLive(); const id = setInterval(fetchLive, 30000); return () => clearInterval(id); }, [fetchLive]);

  if (!entries.length) return null;

  const items = entries.map((e) => {
    const pkg = e.package === 'starter' ? 'STARTER' : 'BUSINESS';
    return `🟢 Baru saja: ${e.name} dari ${e.city} daftar ${pkg} #${e.slot_number?.split('-').pop() || ''}`;
  });
  const joined = items.join(' &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp; ');

  return (
    <div style={{ marginTop: 32, overflow: 'hidden', position: 'relative' }}>
      <div style={{ background: 'rgba(0,200,83,0.06)', border: '1px solid rgba(0,200,83,0.15)', borderRadius: 12, padding: '10px 0', overflow: 'hidden' }}>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'promo-ticker 20s linear infinite', fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            <span dangerouslySetInnerHTML={{ __html: joined }} />
          </div>
        </div>
      </div>
      <style>{`@keyframes promo-ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }`}</style>
    </div>
  );
}

function PromoCard({ data, onDaftar }: { data: PromoData; onDaftar: () => void }) {
  const isStarter = data.package === 'starter';
  const pkgLabel = isStarter ? 'STARTER' : 'BUSINESS';
  const pkgSub = isStarter ? 'Landing page + admin panel' : 'Company profile + blog + admin panel';
  const price = isStarter ? 'Rp 1.500.000' : 'Rp 3.000.000';
  const originalPrice = isStarter ? 'Rp 5.000.000' : 'Rp 10.000.000';
  const features = isStarter
    ? ['Website Next.js custom', 'Admin panel', 'Mobile responsive + SEO', 'Lighthouse 90+ garansi', 'Domain .com 1 tahun']
    : ['Semua fitur STARTER', 'Hingga 5 halaman', 'Blog / artikel', 'Galeri foto', 'Formulir kontak + notifikasi email'];

  return (
    <div style={{
      background: 'rgba(14,18,10,0.85)', border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: 20, padding: '28px 24px', position: 'relative', overflow: 'hidden',
      boxShadow: '0 0 40px rgba(239,68,68,0.06)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 20,
        zIndex: 10,
        filter: 'drop-shadow(0 4px 12px rgba(239,68,68,0.6))',
      }}>
        <div style={{
          background: 'linear-gradient(180deg, #ef4444, #b91c1c)',
          color: 'white',
          width: 56,
          padding: '12px 4px 20px',
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 800,
          lineHeight: 1.4,
          clipPath: 'polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)',
        }}>
          🔥<br/>PROMO<br/>
          <span style={{fontSize:9}}>s/d<br/>31 Juli</span>
        </div>
      </div>

      <div style={{ marginBottom: 16, marginTop: 8 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#EF4444', letterSpacing: '0.08em', marginBottom: 4 }}>{pkgLabel}</div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{pkgSub}</p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 700, color: '#C6FF4A', letterSpacing: '-0.02em' }}>{price}</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>{originalPrice}</span>
        </div>
      </div>

      <SlotProgressBar registered={data.registered} quota={data.quota} />

      <div style={{ margin: '16px 0', padding: '12px 16px', background: 'rgba(0,0,0,0.6)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Gift size={13} color="#EF4444" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#EF4444', letterSpacing: '0.03em' }}>EARLY BIRD BONUS</span>
        </div>
        {data.bonus_tiers.tiers.map((t, i) => {
          const isActive = data.registered >= t.min && data.registered <= t.max;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, opacity: isActive ? 1 : 0.5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? '#C6FF4A' : 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: isActive ? '#C6FF4A' : '#ffffff' }}>
                Slot #{t.min}-{t.max}: {t.bonus}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Clock size={13} color="rgba(255,255,255,0.4)" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Berakhir dalam:</span>
        </div>
        <CountdownTimer />
      </div>

      <button onClick={onDaftar} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: '#EF4444', color: '#FAFAFA', border: 'none', borderRadius: 10, padding: '14px',
        fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
        boxShadow: '0 0 20px rgba(239,68,68,0.3)', transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        Daftar Sekarang <ChevronRight size={16} />
      </button>
    </div>
  );
}

function PromoForm({ pkg, onClose, onSuccess }: { pkg: string; onClose: () => void; onSuccess: (ticket: TicketData) => void }) {
  const [name, setName] = useState('');
  const [wa, setWa] = useState('');
  const [city, setCity] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    if (!name.trim() || !wa.trim() || !city.trim()) { setError('Semua field wajib diisi'); return; }
    if (!agreed) { setError('Setujui syarat & ketentuan'); return; }
    setSubmitting(true);
    try {
      const r = await fetch('/api/promo?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), wa: wa.trim(), city: city.trim(), package: pkg, referred_by: referredBy.trim() || undefined }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || 'Gagal mendaftar'); setSubmitting(false); return; }
      onSuccess(d.ticket);
    } catch { setError('Gagal terhubung ke server'); setSubmitting(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, padding: '12px 14px', color: '#FAFAFA', fontSize: 14,
    fontFamily: 'Inter, sans-serif', outline: 'none',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#0E120A', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '32px 28px', maxWidth: 440, width: '100%', boxSizing: 'border-box' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
        <h3 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 20, fontWeight: 700, color: '#FAFAFA', margin: '0 0 4px' }}>Daftar Promo Juli 2026</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 24px' }}>Paket: <strong style={{ color: '#EF4444', textTransform: 'uppercase' }}>{pkg}</strong></p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input placeholder="Nama lengkap" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          <input placeholder="No. WhatsApp" value={wa} onChange={e => setWa(e.target.value)} style={inputStyle} />
          <input placeholder="Kota" value={city} onChange={e => setCity(e.target.value)} style={inputStyle} />
          <div>
            <input placeholder="Punya kode referral? (opsional)" value={referredBy} onChange={e => setReferredBy(e.target.value)} style={inputStyle} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>Masukkan kode referral teman kamu</p>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ accentColor: '#C6FF4A' }} />
            Saya setuju dengan syarat & ketentuan promo
          </label>
          {error && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#EF4444', margin: 0 }}>{error}</p>}
          <button onClick={handleSubmit} disabled={submitting} style={{
            width: '100%', background: submitting ? 'rgba(239,68,68,0.5)' : '#EF4444', color: '#FAFAFA',
            border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700,
            fontFamily: 'Inter, sans-serif', cursor: submitting ? 'not-allowed' : 'pointer',
          }}>
            {submitting ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PromoTicket({ ticket, onClose }: { ticket: TicketData; onClose: () => void }) {
  const [qrImg, setQrImg] = useState(ticket.qrCode || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!qrImg) {
      import('qrcode').then((QRCode) => {
        QRCode.toDataURL(ticket.verifyUrl, { width: 200 }).then(setQrImg);
      });
    }
  }, [ticket.verifyUrl, qrImg]);

  const waShare = `Halo%20Aldi%2C%20saya%20telah%20mendaftar%20promo%20Juli%202026.%0A%0ANomor%20Antrean%3A%20${ticket.slotNumber}%0ANama%3A%20${ticket.name}%0APaket%3A%20${ticket.package.toUpperCase()}%0ABonus%3A%20${ticket.bonus}%0A%0ABerikut%20tiket%20saya%3A%20${ticket.verifyUrl}`;

  const copyRef = () => {
    navigator.clipboard.writeText(ticket.referralCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#0E120A', border: '1px solid rgba(198,255,74,0.25)', borderRadius: 20, padding: '32px 28px', maxWidth: 420, width: '100%', boxSizing: 'border-box', textAlign: 'center' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}><X size={18} /></button>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(198,255,74,0.1)', borderRadius: 999, padding: '4px 12px', marginBottom: 16 }}>
          <Check size={12} color="#C6FF4A" strokeWidth={3} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#C6FF4A' }}>Pendaftaran Berhasil!</span>
        </div>

        <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 700, color: '#FAFAFA', margin: '0 0 4px', letterSpacing: '-0.02em' }}>{ticket.slotNumber}</h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 24px' }}>{ticket.name} &middot; {ticket.city}</p>

        {qrImg && (
          <div style={{ display: 'inline-flex', padding: 8, background: '#FAFAFA', borderRadius: 12, marginBottom: 20 }}>
            <img src={qrImg} alt="QR Code" style={{ width: 140, height: 140, display: 'block' }} />
          </div>
        )}

        <div style={{ background: 'rgba(198,255,74,0.06)', border: '1px solid rgba(198,255,74,0.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Inter, sans-serif', fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Early Bird Bonus</span>
            <span style={{ color: '#C6FF4A', fontWeight: 600 }}>Tier {ticket.earlyBirdTier}</span>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#FAFAFA', margin: 0 }}>{ticket.bonus}</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Kode Referral Kamu</span>
            <button onClick={copyRef} style={{ background: 'transparent', border: 'none', color: '#C6FF4A', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Share2 size={12} /> {copied ? 'Tersalin!' : 'Salin'}
            </button>
          </div>
          <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700, color: '#C6FF4A' }}>{ticket.referralCode}</code>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>Bagikan kode ini ke temanmu</p>
        </div>

        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12, padding: '16px', marginBottom: 20, textAlign: 'left' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, color: '#EF4444', margin: '0 0 8px' }}>Syarat & Ketentuan:</p>
          <ol style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
            {['Follow + Like + Share + Save 3 post terbaru AWD di semua medsos (IG/TikTok/FB/YouTube)', 'Screenshot bukti dan kirim ke WA AWD', 'Wajib berikan ulasan Google positif sebelum website live', 'Post sosmed dengan template yang kami kirim via WA', '⚠️ Pertahankan follow minimal 3 bulan agar paket tetap aktif'].map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        <a href={`https://wa.me/${WA_NUMBER}?text=${waShare}`} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none',
          background: '#C6FF4A', color: '#07080A', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif',
        }}>
          <Zap size={16} /> Bagikan Tiket Ini
        </a>
      </div>
    </div>
  );
}

export function PromoSection() {
  const [promos, setPromos] = useState<PromoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [ticket, setTicket] = useState<TicketData | null>(null);

  const fetchPromos = useCallback(async () => {
    try {
      const r = await fetch('/api/promo?action=active');
      const d = await r.json();
      if (d.promos) setPromos(d.promos);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPromos(); }, [fetchPromos]);

  if (loading) return null;
  if (!promos.length) return null;

  return (
    <section style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: '#EF4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            <div style={{ width: 20, height: 1, background: '#EF4444' }} />
            PROMO TERBATAS
            <div style={{ width: 20, height: 1, background: '#EF4444' }} />
          </div>
          <h2 style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            🔥 Promo Spesial Juli 2026
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Harga spesial early bird — semakin cepat daftar, semakin besar bonusnya!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 800, margin: '0 auto' }}>
          {promos.map((p) => (
            <PromoCard key={p.id} data={p} onDaftar={() => setSelectedPkg(p.package)} />
          ))}
        </div>

        <LiveFeed />

        {selectedPkg && !ticket && (
          <PromoForm pkg={selectedPkg} onClose={() => setSelectedPkg(null)} onSuccess={(t) => { setSelectedPkg(null); setTicket(t); }} />
        )}
        {ticket && (
          <PromoTicket ticket={ticket} onClose={() => setTicket(null)} />
        )}
      </div>
    </section>
  );
}
