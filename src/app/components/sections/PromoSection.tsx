import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Check, Gift, Share2, Clock, Users, Zap, ChevronRight, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';
import PromoRegisterModal from './PromoRegisterModal';

const WA_NUMBER = '6285286427559';
const DEADLINE = new Date('2026-07-31T23:59:59');

const defaultSyarat = [
  'Follow Semua Akun Medsos AWD (IG/TikTok/FB/YouTube), Like, Share & Save 3 post terbaru AWD di semua medsos. (⚠️ Pertahankan minimal 6 bulan agar paket tetap aktif)',
  'Screenshot bukti dan kirim ke WA admin AWD',
  'Wajib berikan ulasan Google positif sebelum website live',
  'Post sosmed dengan template yang kami kirim via WA',
];

interface PromoData {
  id: number;
  name: string;
  package: string;
  quota: number;
  deadline: string;
  active: boolean;
  bonus_tiers: { tiers: Array<{ min: number; max: number; bonus: string }> };
  promo_price?: string;
  syarat?: string[];
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
  syarat?: string[];
  form_fields?: Array<{id:string;label:string;type:string;required:boolean}>;
}

interface LiveEntry {
  name: string;
  city: string;
  package: string;
  created_at: string;
  slot_number: string;
  wa: string;
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

  useEffect(() => {
    fetchLive();
    let timer: ReturnType<typeof setInterval>;
    function start() { timer = setInterval(fetchLive, 30000); }
    function handler() { if (document.hidden) clearInterval(timer); else { clearInterval(timer); start(); } }
    start();
    document.addEventListener('visibilitychange', handler);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', handler); };
  }, [fetchLive]);

  if (!entries.length) return null;

  // Render as plain React text (never dangerouslySetInnerHTML) so registrant-
  // supplied name/city cannot inject HTML/script (stored XSS). Phone numbers are
  // never shown publicly.
  const items = entries.map((e) => {
    const pkg = e.package === 'starter' ? 'STARTER' : 'BUSINESS';
    const slot = e.slot_number?.split('-').pop() || '';
    return `🟢 Baru saja: ${e.name} dari ${e.city} daftar ${pkg} #${slot}`;
  });

  return (
    <div style={{ marginTop: 32, overflow: 'hidden', position: 'relative' }}>
      <div style={{ background: 'rgba(0,200,83,0.06)', border: '1px solid rgba(0,200,83,0.15)', borderRadius: 12, padding: '10px 0', overflow: 'hidden' }}>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <div style={{ display: 'inline-block', paddingLeft: '100%', animation: 'promo-ticker 20s linear infinite', fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
            {items.map((text, i) => (
              <span key={i}>
                {i > 0 && <span style={{ opacity: 0.4 }}>{'   •   '}</span>}
                {text}
              </span>
            ))}
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
  const price = data.promo_price || (isStarter ? 'Rp 1.500.000' : 'Rp 3.000.000');
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

function PromoForm(props: { pkg: string; fields?: Array<{id:string;label:string;type:string;required:boolean}>; onClose: () => void; onSuccess: (ticket: TicketData) => void }) {
  return <PromoRegisterModal {...props} />;
}

function PromoTicket({ ticket, onClose }: { ticket: TicketData; onClose: () => void }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const verifyUrl = `https://wa.me/6285286427559?text=Konfirmasi%20antrean%20${ticket.slotNumber}%20-%20${ticket.name}`;
  const waShare = `Halo%20Aldi%2C%20saya%20telah%20mendaftar%20promo%20Juli%202026.%0A%0ANomor%20Antrean%3A%20${ticket.slotNumber}%0ANama%3A%20${ticket.name}%0APaket%3A%20${ticket.package.toUpperCase()}%0ABonus%3A%20${ticket.bonus}%0A%0ABerikut%20tiket%20saya%3A%20${ticket.verifyUrl}`;

  const copyCode = () => {
    navigator.clipboard.writeText(ticket.referralCode).then(() => { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); });
  };

  const handleShare = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current, {
      backgroundColor: '#0a0a0a', scale: 2, useCORS: true, allowTaint: true,
      ignoreElements: (el) => el.tagName === 'CANVAS',
    });
    const ctx = canvas.getContext('2d');
    const qrCanvas = ticketRef.current.querySelector('.qr-wrapper canvas') as HTMLCanvasElement | null;
    if (ctx && qrCanvas) {
      const qrDataUrl = qrCanvas.toDataURL('image/png');
      const qrImg = new Image();
      await new Promise<void>((resolve, reject) => { qrImg.onload = () => resolve(); qrImg.onerror = reject; qrImg.src = qrDataUrl; });
      const qrRect = qrCanvas.getBoundingClientRect();
      const ticketRect = ticketRef.current.getBoundingClientRect();
      ctx.drawImage(qrImg, (qrRect.left - ticketRect.left) * 2, (qrRect.top - ticketRect.top) * 2, qrRect.width * 2, qrRect.height * 2);
    }
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'awd-ticket.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title: 'AWD Promo', text: 'Aku daftar promo AWD!' }); } catch {}
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'awd-ticket.png'; a.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', maxWidth: 440, width: '100%', boxSizing: 'border-box' }}>

        <div ref={ticketRef} style={{
          background: 'linear-gradient(135deg, #0E120A 0%, #1a2210 40%, #0E120A 100%)',
          border: '1px solid rgba(198,255,74,0.3)', borderRadius: 24,
          padding: '44px 28px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -30, width: 280, height: 280,
            background: 'radial-gradient(circle at 30% 40%, rgba(198,255,74,0.07) 0%, transparent 65%)',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -40, width: 200, height: 200,
            background: 'radial-gradient(circle at 70% 60%, rgba(198,255,74,0.04) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, transparent, #C6FF4A, transparent)',
            opacity: 0.4,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(198,255,74,0.15), transparent)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6FF4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#C6FF4A', letterSpacing: '0.18em', textTransform: 'uppercase' }}>AldiWebDesigner.xyz</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6FF4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Inter Tight, sans-serif', color: '#FAFAFA', marginBottom: 2, letterSpacing: '-0.02em' }}>PROMO AWD JULI 2026</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'Inter, sans-serif', marginBottom: 16 }}>Website Profesional, Bukan Template</div>

          <div style={{ width: 50, height: 2, background: 'rgba(198,255,74,0.25)', margin: '0 auto 16px', borderRadius: 1 }} />

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(198,255,74,0.1)', borderRadius: 999, padding: '4px 16px', marginBottom: 16 }}>
            <Check size={12} color="#C6FF4A" strokeWidth={3} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, color: '#C6FF4A', letterSpacing: '0.03em' }}>RESMI TERDAFTAR</span>
          </div>

          <h2 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 36, fontWeight: 800, color: '#FAFAFA', margin: '0 0 4px', letterSpacing: '-0.03em', textShadow: '0 0 20px rgba(198,255,74,0.08)' }}>{ticket.slotNumber}</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '0 0 20px' }}>{ticket.name} &middot; {ticket.city}</p>

          <div className="qr-wrapper" style={{ display: 'inline-flex', padding: 6, background: '#FAFAFA', borderRadius: 14, marginBottom: 18, boxShadow: '0 0 0 1px rgba(198,255,74,0.1)' }}>
            <QRCodeCanvas value={verifyUrl} size={130} bgColor="#ffffff" fgColor="#000000" />
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(198,255,74,0.08), rgba(198,255,74,0.03))', border: '1px solid rgba(198,255,74,0.12)', borderRadius: 12, padding: '12px 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Inter, sans-serif', fontSize: 11, marginBottom: 4 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Early Bird Bonus</span>
              <span style={{ color: '#C6FF4A', fontWeight: 700, fontSize: 11 }}>Tier {ticket.earlyBirdTier}</span>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 700, color: '#FAFAFA', margin: 0 }}>{ticket.bonus}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, alignItems: 'center', marginTop: 4 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: 'rgba(255,255,255,0.08)', letterSpacing: '0.06em' }}>aldiwebdesigner.xyz</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={handleShare} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#C6FF4A', color: '#07080A', border: 'none', borderRadius: 10, padding: '12px',
            fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
          }}>
            <Share2 size={15} /> Share ke Story
          </button>
          <button onClick={copyCode} style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: '1px solid rgba(198,255,74,0.3)', color: '#C6FF4A',
            borderRadius: 10, padding: '12px 14px', fontSize: 13, fontWeight: 600,
            fontFamily: 'Inter, sans-serif', cursor: 'pointer',
          }}>
            <Copy size={14} /> {copiedCode ? 'Tersalin' : 'Salin'}
          </button>
        </div>
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
    <section style={{ padding: '80px 0', position: 'relative', overflow: 'hidden', minHeight: promos.length ? 'auto' : '400px' }}>
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
          <PromoForm pkg={selectedPkg} fields={promos.find(p => p.package === selectedPkg)?.form_fields} onClose={() => setSelectedPkg(null)} onSuccess={(t) => { setSelectedPkg(null); setTicket(t); }} />
        )}
        {ticket && (
          <PromoTicket ticket={ticket} onClose={() => setTicket(null)} />
        )}
      </div>
    </section>
  );
}
