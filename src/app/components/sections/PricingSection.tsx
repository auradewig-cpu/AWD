import { useState, useEffect, useRef } from 'react';
import { Check, MessageCircle, ExternalLink } from 'lucide-react';
import { STORAGE_KEYS, loadFromStorage, loadFromServer, type PricingContent, type PricingTier } from '@/admin/storage';
import { SpeedGuaranteeBadge } from '../ui/SpeedGuaranteeBadge';

const WA_NUMBER = '6285286427559';

export const DEFAULT_PRICING: PricingContent = {
  labelNoAdmin: 'Tanpa Admin Panel',
  labelWithAdmin: '+ Admin Panel',
  tiers: [
    {
      id: 'starter',
      name: 'STARTER',
      subtitle: 'Landing page + admin panel',
      priceNoAdmin: 2500000,
      priceNoAdminOriginal: 5000000,
      priceWithAdmin: null,
      priceWithAdminOriginal: null,
      showAdminOption: false,
      recommended: false,
      features: [
        'Website Next.js custom (bukan template)',
        'Admin panel: edit teks, logo, warna, kontak',
        'Mobile responsive + SEO ready',
        'Lighthouse score 90+ garansi',
        'Deploy ke Vercel + domain .com 1 tahun',
        '2 putaran revisi',
      ],
      ctaText: 'Konsultasi Sekarang',
      waNumber: WA_NUMBER,
      waMessageTemplate: 'Halo Aldi, saya tertarik dengan paket {name} ({subtitle}). Boleh konsultasi lebih lanjut?',
      showDemoButton: true,
    },
    {
      id: 'business',
      name: 'BUSINESS',
      subtitle: 'Company profile + blog + admin panel',
      priceNoAdmin: 5000000,
      priceNoAdminOriginal: 10000000,
      priceWithAdmin: null,
      priceWithAdminOriginal: null,
      showAdminOption: false,
      recommended: true,
      features: [
        'Semua fitur STARTER',
        'Hingga 5 halaman',
        'Blog / artikel',
        'Galeri foto',
        'Formulir kontak + notifikasi email',
        '3 putaran revisi',
      ],
      ctaText: 'Konsultasi Sekarang',
      waNumber: WA_NUMBER,
      waMessageTemplate: 'Halo Aldi, saya tertarik dengan paket {name} ({subtitle}). Boleh konsultasi lebih lanjut?',
      showDemoButton: true,
    },
    {
      id: 'store',
      name: 'STORE',
      subtitle: 'Toko online + sistem pesanan',
      priceNoAdmin: 10000000,
      priceNoAdminOriginal: 18000000,
      priceWithAdmin: null,
      priceWithAdminOriginal: null,
      showAdminOption: false,
      recommended: false,
      features: [
        'Semua fitur BUSINESS',
        'Katalog produk (tambah/edit/hapus)',
        'Keranjang + checkout via WhatsApp',
        'Kelola pesanan masuk',
        'Upload foto produk',
        '4 putaran revisi',
      ],
      ctaText: 'Konsultasi Sekarang',
      waNumber: WA_NUMBER,
      waMessageTemplate: 'Halo Aldi, saya tertarik dengan paket {name} ({subtitle}). Boleh konsultasi lebih lanjut?',
      showDemoButton: true,
    },
    {
      id: 'pro',
      name: 'PRO',
      subtitle: 'Web app + database + payment gateway',
      priceNoAdmin: 18000000,
      priceNoAdminOriginal: 30000000,
      priceWithAdmin: null,
      priceWithAdminOriginal: null,
      showAdminOption: false,
      recommended: false,
      features: [
        'Semua fitur STORE',
        'Database + authentication',
        'Payment gateway (Midtrans/Xendit)',
        'Multi user & role',
        'Dashboard analitik',
        'SLA support 30 hari',
      ],
      ctaText: 'Konsultasi Sekarang',
      waNumber: WA_NUMBER,
      waMessageTemplate: 'Halo Aldi, saya tertarik dengan paket {name} ({subtitle}). Boleh konsultasi lebih lanjut?',
      showDemoButton: true,
    },
  ],
};

function formatRp(amount: number) {
  if (amount >= 1000000) {
    const jt = amount / 1000000;
    return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)}jt`;
  }
  return `Rp ${(amount / 1000).toFixed(0)}rb`;
}

function PricingCard({ tier, withAdmin }: { tier: PricingTier; withAdmin: boolean }) {
  const usesAdminPrice = withAdmin && tier.showAdminOption && tier.priceWithAdmin !== null;
  const price = usesAdminPrice ? (tier.priceWithAdmin as number) : tier.priceNoAdmin;
  const originalPrice = usesAdminPrice ? (tier.priceWithAdminOriginal as number) : tier.priceNoAdminOriginal;
  const waMessage = tier.waMessageTemplate
    .replace(/\{name\}/g, tier.name)
    .replace(/\{subtitle\}/g, tier.subtitle);

  return (
    <div
      data-pricing-card
      data-highlight={tier.recommended ? 'true' : undefined}
      style={{
        background: tier.recommended ? 'rgba(14,18,10,0.78)' : 'rgba(10,12,10,0.75)',
        backdropFilter: 'blur(16px)',
        border: tier.recommended ? '1px solid rgba(198,255,74,0.35)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20, padding: '28px 24px',
        position: 'relative',
        boxShadow: tier.recommended ? '0 0 40px rgba(198,255,74,0.08)' : 'none',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Recommended ribbon */}
      {tier.recommended && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          background: '#C6FF4A', color: '#07080A',
          borderRadius: 999, padding: '4px 14px',
          fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.05em', whiteSpace: 'nowrap',
        }}>
          ⭐ PALING POPULER
        </div>
      )}

      {/* Tier name + intensity */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 13,
            fontWeight: 700, color: tier.recommended ? '#C6FF4A' : '#FAFAFA',
            letterSpacing: '0.08em',
          }}>
            {tier.name}
          </span>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
          {tier.subtitle}
        </p>
      </div>

      {/* Price */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 28,
            fontWeight: 700, color: tier.recommended ? '#C6FF4A' : '#FAFAFA',
            letterSpacing: '-0.02em',
          }}>
            {formatRp(price)}
          </span>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 14,
            color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through',
          }}>
            {formatRp(originalPrice)}
          </span>
        </div>
        {(withAdmin && !tier.showAdminOption) && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            Paket ini tidak termasuk admin panel
          </p>
        )}
      </div>

      {/* Features */}
      <div style={{ flex: 1, marginBottom: 24 }}>
        {tier.features.map((feat, fi) => (
          <div key={fi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%',
              background: 'rgba(198,255,74,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1,
            }}>
              <Check size={9} color="#C6FF4A" strokeWidth={3} />
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
              {feat}
            </span>
          </div>
        ))}
      </div>

      {/* Badge */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
        <SpeedGuaranteeBadge size="sm" />
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <a
          href={`https://wa.me/${tier.waNumber}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: tier.recommended ? '#C6FF4A' : 'rgba(198,255,74,0.1)',
            color: tier.recommended ? '#07080A' : '#C6FF4A',
            border: tier.recommended ? 'none' : '1px solid rgba(198,255,74,0.2)',
            borderRadius: 10, padding: '12px',
            fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif',
            textDecoration: 'none', transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.filter = 'brightness(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.filter = 'brightness(1)';
          }}
        >
          <MessageCircle size={15} />
          {tier.ctaText}
        </a>

        {tier.showDemoButton && (
          <a
            href={`/#/demo/${tier.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', boxSizing: 'border-box', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '10px',
              fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = '#FAFAFA';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            <ExternalLink size={13} />
            Lihat Demo
          </a>
        )}
      </div>
    </div>
  );
}

export function PricingSection() {
  const [withAdmin, setWithAdmin] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [content, setContent] = useState<PricingContent>(DEFAULT_PRICING);

  useEffect(() => {
    loadFromServer(STORAGE_KEYS.PRICING, DEFAULT_PRICING).then(setContent);
  }, []);

  useEffect(() => {
    function handleUpdate() {
      loadFromServer(STORAGE_KEYS.PRICING, DEFAULT_PRICING).then(setContent);
    }
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEYS.PRICING) {
        handleUpdate();
      }
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('awd-pricing-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('awd-pricing-updated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    let ctx: any;
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
        const isMobile = window.innerWidth < 768;
        const toggleLead = isMobile ? 0.075 : 0.15;
        const cardsLead = isMobile ? 0.1 : 0.2;
        const cardStagger = isMobile ? 0.05 : 0.1;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        });

        tl.from('[data-pricing-headline]', {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
        })
          .from('[data-pricing-toggle]', {
            opacity: 0,
            y: 10,
            duration: 0.5,
            ease: 'power2.out',
          }, toggleLead);

        const cards = gsap.utils.toArray<HTMLElement>('[data-pricing-card]');
        tl.from(cards, {
          opacity: 0,
          y: 50,
          scale: (i, target: HTMLElement) =>
            target.dataset.highlight === 'true' ? 0.92 : 0.94,
          duration: 0.5,
          ease: 'power3.out',
          stagger: cardStagger,
        }, `+=${cardsLead}`);

        tl.eventCallback('onComplete', () => {
          const highlightCard = sectionRef.current?.querySelector<HTMLElement>(
            '[data-pricing-card][data-highlight="true"]'
          );
          if (!highlightCard) return;
          gsap.timeline({ repeat: -1, yoyo: true })
            .to(highlightCard, {
              boxShadow: '0 0 20px rgba(198,255,74,0.4)',
              duration: 1.5,
              ease: 'sine.inOut',
            })
            .to(highlightCard, {
              boxShadow: '0 0 0px rgba(198,255,74,0)',
              duration: 1.5,
              ease: 'sine.inOut',
            });
        });
      });
    }, sectionRef);
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(run, { timeout: 1500 });
    } else {
      setTimeout(run, 500);
    }

    return () => { cancelled = true; ctx?.revert(); };
  }, []);

  return (
    <section ref={sectionRef} id="pricing" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div
        className="px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: 1400, margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div
          data-pricing-headline
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: '#C6FF4A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
            PAKET HARGA
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
          </div>
          <h2 style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em', marginBottom: 32,
          }}>
            Pilih Paket yang Pas untuk Bisnismu
          </h2>
        </div>

        {/* Toggle */}
        <div data-pricing-toggle style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999, padding: 4,
            gap: 4,
          }}>
            {[
              { label: content.labelNoAdmin, value: false },
              { label: content.labelWithAdmin, value: true },
            ].map(opt => (
              <button
                key={String(opt.value)}
                role="button"
                aria-pressed={withAdmin === opt.value}
                onClick={() => setWithAdmin(opt.value)}
                style={{
                  borderRadius: 999, padding: '8px 20px',
                  fontSize: 14, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: withAdmin === opt.value ? '#C6FF4A' : 'transparent',
                  color: withAdmin === opt.value ? '#07080A' : 'rgba(255,255,255,0.6)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3"
          style={{ alignItems: 'start', width: '100%' }}
        >
          {content.tiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} withAdmin={withAdmin} />
          ))}
        </div>
      </div>
    </section>
  );
}
