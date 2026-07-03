import { lazy, Suspense, useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { TrustBar } from '../components/sections/TrustBar';
import { ProcessSteps } from '../components/sections/ProcessSteps';
import { BehindTheScenes } from '../components/sections/BehindTheScenes';
import { PricingSection } from '../components/sections/PricingSection';
import { SpeedScanSection } from '../components/sections/SpeedScanSection';
import { WhyAWD } from '../components/sections/WhyAWD';
import { FAQ } from '../components/sections/FAQ';
import { Contact } from '../components/sections/Contact';
import { Footer } from '../components/Footer';
import { ScrollScrubContainer } from '@/components/scroll/ScrollScrubContainer';
import { SpeedGuaranteeBadge } from '../components/ui/SpeedGuaranteeBadge';

const HeroDesktop = lazy(() => import('../components/sections/Hero').then(m => ({ default: m.Hero })));

const HERO_CONTENT = {
  eyebrow: 'BERBASIS REACT • BUKAN TEMPLATE',
  headlineLine1: 'Tampil',
  headlineHighlight: 'SeMAHAL',
  headlineHighlightColor: '#C6FF4A',
  headlineLine2: 'Kualitas Bisnismu.',
  subheadline: 'Website profesional mulai Rp999rb. Cepat, aman, desain custom — tanpa beban harga agency besar.',
  ctaPrimaryText: 'Konsultasi Gratis →',
  ctaPrimaryWaNumber: '6285286427559',
  ctaSecondaryText: 'Lihat Paket Harga',
};

function MobileHero() {
  return (
    <section
      id="beranda"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '120px 24px 80px',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999, padding: '6px 14px',
            width: 'fit-content',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C6FF4A' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.68)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {HERO_CONTENT.eyebrow}
            </span>
          </div>
          <h1 style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 800, lineHeight: 1.05,
            color: '#FAFAFA',
            letterSpacing: '-0.03em',
            margin: 0,
            textShadow: '0 1px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)',
          }}>
            {HERO_CONTENT.headlineLine1}{' '}
            <span style={{ color: HERO_CONTENT.headlineHighlightColor }}>{HERO_CONTENT.headlineHighlight}</span>
            {' '}{HERO_CONTENT.headlineLine2}
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: 'rgba(255,255,255,0.68)',
            lineHeight: 1.65, margin: 0, maxWidth: 480,
          }}>
            {HERO_CONTENT.subheadline}
          </p>
          <SpeedGuaranteeBadge />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <a
              href={`https://wa.me/${HERO_CONTENT.ctaPrimaryWaNumber}?text=Halo%20Aldi%2C%20saya%20ingin%20konsultasi%20gratis%20tentang%20pembuatan%20website.`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#C6FF4A', color: '#07080A',
                borderRadius: 999, padding: '14px 28px',
                fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                textDecoration: 'none',
                boxShadow: '0 0 40px rgba(198,255,74,0.2)',
              }}
            >
              {HERO_CONTENT.ctaPrimaryText}
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
                cursor: 'pointer',
              }}
            >
              {HERO_CONTENT.ctaSecondaryText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <ScrollScrubContainer />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navbar />
        <Suspense fallback={<MobileHero />}>
          {isDesktop ? <HeroDesktop /> : <MobileHero />}
        </Suspense>
        <TrustBar />
        <PricingSection />
        <SpeedScanSection />
        <ProcessSteps />
        <BehindTheScenes />
        <WhyAWD />
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
