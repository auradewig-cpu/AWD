import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Star, Zap } from 'lucide-react';
import { STORAGE_KEYS, loadFromServer, type HeroContent } from '@/admin/storage';
import { SpeedGuaranteeBadge } from '../ui/SpeedGuaranteeBadge';

export const DEFAULT_HERO: HeroContent = {
  eyebrow: 'BERBASIS REACT • BUKAN TEMPLATE',
  headlineLine1: 'Tampil',
  headlineHighlight: 'SeMAHAL',
  headlineHighlightColor: '#C6FF4A',
  headlineLine2: 'Kualitas Bisnismu.',
  subheadline: 'Website profesional mulai Rp999rb. Cepat, aman, desain custom — tanpa beban harga agency besar.',
  ctaPrimaryText: 'Konsultasi Gratis →',
  ctaPrimaryWaNumber: '6285286427559',
  ctaSecondaryText: 'Lihat Paket Harga',
  showMockup: true,
  badge1Text: '5.0 RATING',
  badge2Text: 'LOAD CEPAT 90+',
};

function PhoneMockup({ tilt, badge1Text, badge2Text }: { tilt: { x: number; y: number }; badge1Text: string; badge2Text: string }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <motion.div
        animate={{
          rotateX: tilt.y * -6,
          rotateY: tilt.x * 6,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
        style={{
          width: 260,
          height: 520,
          background: '#0D0F12',
          borderRadius: 36,
          border: '2px solid rgba(255,255,255,0.12)',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
          position: 'relative',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Notch */}
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 24, background: '#07080A', borderRadius: 12, zIndex: 10,
        }} />

        {/* Screen content - stylized website preview */}
        <div style={{ width: '100%', height: '100%', background: '#FAFAFA', paddingTop: 48 }}>
          {/* Website header */}
          <div style={{ background: '#1a1a2e', height: 44, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C6FF4A' }} />
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
            <div style={{ width: 32, height: 20, background: '#C6FF4A', borderRadius: 4 }} />
          </div>

          {/* Hero section */}
          <div style={{ background: '#0f0f1e', padding: '20px 12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: '60%', height: 8, background: 'rgba(198,255,74,0.6)', borderRadius: 4, marginBottom: 10 }} />
            <div style={{ width: '85%', height: 14, background: 'rgba(255,255,255,0.9)', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ width: '70%', height: 14, background: 'rgba(255,255,255,0.9)', borderRadius: 4, marginBottom: 14 }} />
            <div style={{ width: '75%', height: 5, background: 'rgba(255,255,255,0.3)', borderRadius: 3, marginBottom: 5 }} />
            <div style={{ width: '55%', height: 5, background: 'rgba(255,255,255,0.3)', borderRadius: 3, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ height: 28, width: 80, background: '#C6FF4A', borderRadius: 99 }} />
              <div style={{ height: 28, width: 72, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 99 }} />
            </div>
          </div>

          {/* Content blocks */}
          <div style={{ background: '#ffffff', padding: '16px 12px', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ background: '#f5f5f5', borderRadius: 8, padding: 10 }}>
                  <div style={{ width: 24, height: 24, background: '#e0e7ff', borderRadius: 6, marginBottom: 6 }} />
                  <div style={{ width: '80%', height: 5, background: '#d1d5db', borderRadius: 3, marginBottom: 4 }} />
                  <div style={{ width: '60%', height: 4, background: '#e5e7eb', borderRadius: 3 }} />
                </div>
              ))}
            </div>
            <div style={{ height: 60, background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 80, height: 24, background: '#C6FF4A', borderRadius: 99 }} />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 80, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2,
        }} />
      </motion.div>

      {/* Glass badge: Rating */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          position: 'absolute', top: 60, left: -80,
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ display: 'flex', gap: 2 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={12} fill="#C6FF4A" color="#C6FF4A" />
          ))}
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600, color: '#FAFAFA' }}>
          {badge1Text}
        </span>
      </motion.div>

      {/* Glass badge: Load cepat */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        style={{
          position: 'absolute', bottom: 100, right: -90,
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
        }}
      >
        <Zap size={14} fill="#C6FF4A" color="#C6FF4A" />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600, color: '#FAFAFA' }}>
          {badge2Text}
        </span>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<HeroContent>(DEFAULT_HERO);

  useEffect(() => {
    loadFromServer(STORAGE_KEYS.HERO, DEFAULT_HERO).then(setContent);
  }, []);

  useEffect(() => {
    function handleUpdate() {
      loadFromServer(STORAGE_KEYS.HERO, DEFAULT_HERO).then(setContent);
    }
    window.addEventListener('awd-hero-updated', handleUpdate);
    return () => window.removeEventListener('awd-hero-updated', handleUpdate);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: x * 0.5, y: y * 0.5 });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section
      id="beranda"
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '120px 24px 80px',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 80,
          alignItems: 'center',
        }}>
          {/* Left: Copy */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999, padding: '6px 14px',
                marginBottom: 24,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C6FF4A' }} />
                <span style={{
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                  color: 'rgba(255,255,255,0.68)', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  {content.eyebrow}
                </span>
              </div>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontFamily: 'Inter Tight, sans-serif',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 800,
                lineHeight: 1.05,
                color: '#FAFAFA',
                letterSpacing: '-0.03em',
                marginBottom: 20,
                textShadow: '0 1px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)',
              }}
            >
              {content.headlineLine1}{' '}
              <span style={{ color: content.headlineHighlightColor }}>{content.headlineHighlight}</span>
              {' '}{content.headlineLine2}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(15px, 2vw, 17px)',
                color: 'rgba(255,255,255,0.68)',
                lineHeight: 1.65,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              {content.subheadline}
            </motion.p>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.38 }}
              style={{ marginBottom: 28 }}
            >
              <SpeedGuaranteeBadge />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}
            >
              <a
                href={`https://wa.me/${content.ctaPrimaryWaNumber}?text=Halo%20Aldi%2C%20saya%20ingin%20konsultasi%20gratis%20tentang%20pembuatan%20website.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#C6FF4A', color: '#07080A',
                  borderRadius: 999, padding: '14px 28px',
                  fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                  textDecoration: 'none', transition: 'all 0.2s',
                  boxShadow: '0 0 40px rgba(198,255,74,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.filter = 'brightness(1.08)';
                  e.currentTarget.style.boxShadow = '0 0 50px rgba(198,255,74,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'brightness(1)';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(198,255,74,0.2)';
                }}
              >
                {content.ctaPrimaryText}
              </a>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FAFAFA',
                  borderRadius: 999, padding: '14px 28px',
                  fontSize: 15, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(198,255,74,0.4)';
                  e.currentTarget.style.color = '#C6FF4A';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.color = '#FAFAFA';
                }}
              >
                {content.ctaSecondaryText}
              </button>
            </motion.div>
          </div>

          {/* Right: Phone mockup */}
          {content.showMockup && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ display: 'flex', justifyContent: 'center', perspective: 1000 }}
            >
              <PhoneMockup tilt={tilt} badge1Text={content.badge1Text} badge2Text={content.badge2Text} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
