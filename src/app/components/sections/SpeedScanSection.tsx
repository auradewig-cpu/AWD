import { useState } from 'react';

export function SpeedScanSection() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <section id="speed-scan" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="px-4 sm:px-6 lg:px-8" style={{ maxWidth: 900, margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            Website Kamu Dapat Nilai Berapa?
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Cek kecepatan website kamu via tools terpercaya. Gratis, instant.
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setShowPopup(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#C6FF4A', color: '#07080A', border: 'none', borderRadius: 12,
            padding: '14px 32px', fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif',
            cursor: 'pointer', boxShadow: '0 0 40px rgba(198,255,74,0.2)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(1)'; }}
          >
            Cek Sekarang
          </button>
        </div>
      </div>

      {showPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowPopup(false)}>
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 280 }}
            onClick={e => e.stopPropagation()}>
            <p style={{ color: '#FAFAFA', fontWeight: 700, fontFamily: 'Inter, sans-serif', textAlign: 'center', margin: '0 0 8px', fontSize: 16 }}>Cek Website Kamu Via:</p>
            <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer"
              style={{ background: '#4285F4', color: '#fff', padding: '12px 24px', borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontWeight: 600, fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
              🚀 PageSpeed Insights
            </a>
            <a href="https://gtmetrix.com/" target="_blank" rel="noopener noreferrer"
              style={{ background: '#FF6B35', color: '#fff', padding: '12px 24px', borderRadius: 8, textAlign: 'center', textDecoration: 'none', fontWeight: 600, fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
              📊 GTmetrix
            </a>
            <button onClick={() => setShowPopup(false)}
              style={{ background: 'transparent', color: '#666', border: 'none', cursor: 'pointer', marginTop: 4, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
