import { useState, useEffect, useRef } from 'react';
import { Check, MessageCircle, ExternalLink } from 'lucide-react';
import { STORAGE_KEYS, loadFromStorage, type PricingContent, type PricingTier } from '@/admin/storage';

const WA_NUMBER = '6281234567890';

export const DEFAULT_PRICING: PricingContent = {
  labelNoAdmin: 'Tanpa Admin Panel',
  labelWithAdmin: '+ Admin Panel',
  tiers: [
    {
      id: 'spark',
      name: 'SPARK',
      subtitle: 'Landing Page / Promosi Awal',
      priceNoAdmin: 999000,
      priceNoAdminOriginal: 2500000,
      priceWithAdmin: null,
      priceWithAdminOriginal: null,
      showAdminOption: false,
      recommended: false,
      features: [
        'Landing page 1 halaman',
        'Desain custom (bukan template)',
        'Mobile responsive',
        'Kontak WA terintegrasi',
        'Domain .com 1 tahun (gratis)',
      ],
      ctaText: 'Konsultasi Sekarang',
      waNumber: WA_NUMBER,
      waMessageTemplate: 'Halo Aldi, saya tertarik dengan paket {name} ({subtitle}). Boleh konsultasi lebih lanjut?',
      showDemoButton: true,
    },
    {
      id: 'ignite',
      name: 'IGNITE',
      subtitle: 'Company Profile',
      priceNoAdmin: 3500000,
      priceNoAdminOriginal: 6000000,
      priceWithAdmin: null,
      priceWithAdminOriginal: null,
      showAdminOption: false,
      recommended: false,
      features: [
        'Multi-halaman (up to 7 halaman)',
        'Desain UI/UX custom',
        'SEO dasar terpasang',
        'Blog/artikel opsional',
        'Formulir kontak + email notifikasi',
      ],
      ctaText: 'Konsultasi Sekarang',
      waNumber: WA_NUMBER,
      waMessageTemplate: 'Halo Aldi, saya tertarik dengan paket {name} ({subtitle}). Boleh konsultasi lebih lanjut?',
      showDemoButton: true,
    },
    {
      id: 'blaze',
      name: 'BLAZE',
      subtitle: 'Web App dengan Sistem & Database',
      priceNoAdmin: 8000000,
      priceNoAdminOriginal: 14000000,
      priceWithAdmin: 12000000,
      priceWithAdminOriginal: 20000000,
      showAdminOption: true,
      recommended: false,
      features: [
        'Sistem interaktif custom (toko online, portal listing, booking, atau web app bisnis lainnya)',
        'Panel kelola mandiri — tambah/edit/hapus data tanpa sentuh kode',
        'Integrasi payment gateway jika dibutuhkan (Midtrans/Xendit — VA, QRIS, kartu)',
        'Manajemen data hingga 200 entri awal (produk, properti, jadwal, listing, dll)',
        'Notifikasi otomatis via email (ke pemilik bisnis dan/atau pengguna)',
        '3 putaran revisi desain',
        'Estimasi selesai: 14–21 hari kerja',
      ],
      ctaText: 'Konsultasi Sekarang',
      waNumber: WA_NUMBER,
      waMessageTemplate: 'Halo Aldi, saya tertarik dengan paket {name} ({subtitle}). Boleh konsultasi lebih lanjut?',
      showDemoButton: true,
    },
    {
      id: 'blazeplus',
      name: 'BLAZE+',
      subtitle: 'Web App Lengkap + Manajemen Bisnis',
      priceNoAdmin: 12000000,
      priceNoAdminOriginal: 22000000,
      priceWithAdmin: 16000000,
      priceWithAdminOriginal: 28000000,
      showAdminOption: true,
      recommended: true,
      features: [
        'Semua fitur BLAZE',
        'Multi-role pengguna: admin utama + staf/agen (hingga 5 akun)',
        'Dashboard analitik & laporan (grafik aktivitas, ringkasan data bisnis)',
        'Fitur relasional lanjutan — sistem poin, pipeline CRM sederhana, atau manajemen lead (dikonsultasikan sesuai kebutuhan bisnis)',
        '1 integrasi API pihak ketiga pilihan (WhatsApp, Google Maps, kalender, atau setara)',
        '4 putaran revisi desain',
        'Estimasi selesai: 21–30 hari kerja',
      ],
      ctaText: 'Konsultasi Sekarang',
      waNumber: WA_NUMBER,
      waMessageTemplate: 'Halo Aldi, saya tertarik dengan paket {name} ({subtitle}). Boleh konsultasi lebih lanjut?',
      showDemoButton: true,
    },
    {
      id: 'apex',
      name: 'APEX',
      subtitle: 'Custom Software / Web App Kompleks',
      priceNoAdmin: 18000000,
      priceNoAdminOriginal: 30000000,
      priceWithAdmin: 22000000,
      priceWithAdminOriginal: 38000000,
      showAdminOption: true,
      recommended: false,
      features: [
        'Custom software penuh',
        'Arsitektur microservices opsional',
        'Integrasi sistem ERP/CRM',
        'CI/CD pipeline setup',
        'SLA & dedicated support',
      ],
      ctaText: 'Konsultasi Sekarang',
      waNumber: WA_NUMBER,
      waMessageTemplate: 'Halo Aldi, saya tertarik dengan paket {name} ({subtitle}). Boleh konsultasi lebih lanjut?',
      showDemoButton: true,
    },
  ],
};

const INTENSITY: Record<string, number> = { spark: 1, ignite: 2, blaze: 3, blazeplus: 4, apex: 5 };

function IntensityIndicator({ level, total = 5 }: { level: number; total?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 16, height: 4, borderRadius: 2,
            background: i < level ? '#C6FF4A' : 'rgba(255,255,255,0.1)',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  );
}

function formatRp(amount: number) {
  if (amount >= 1000000) {
    const jt = amount / 1000000;
    return `Rp ${jt % 1 === 0 ? jt : jt.toFixed(1)}jt`;
  }
  return `Rp ${(amount / 1000).toFixed(0)}rb`;
}

function PricingCard({ tier, withAdmin }: { tier: PricingTier; withAdmin: boolean }) {
  const intensity = INTENSITY[tier.id] ?? 1;
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
          ⭐ PALING DIREKOMENDASIKAN
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
          <IntensityIndicator level={intensity} />
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
  const content = loadFromStorage(STORAGE_KEYS.PRICING, DEFAULT_PRICING);

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
          className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3"
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
