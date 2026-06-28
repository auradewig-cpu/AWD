import { useEffect, useRef } from 'react';
import { Check, X, Gauge } from 'lucide-react';
import { STORAGE_KEYS, loadFromStorage, type WhyContent } from '@/admin/storage';

export const DEFAULT_WHY: WhyContent = {
  col1Header: 'FITUR',
  col2Header: 'AWD (REACT)',
  col3Header: 'WORDPRESS',
  rows: [
    { id: 'row-1', order: 1, label: 'Framework Modern', awd: true, wordpress: false },
    { id: 'row-2', order: 2, label: 'Kecepatan Load', awd: true, wordpress: false },
    { id: 'row-3', order: 3, label: 'SEO Teknikal', awd: true, wordpress: false },
    { id: 'row-4', order: 4, label: 'Keamanan', awd: true, wordpress: false },
    { id: 'row-5', order: 5, label: 'Custom UI/UX', awd: true, wordpress: false },
    { id: 'row-6', order: 6, label: 'Skalabilitas', awd: true, wordpress: false },
    { id: 'row-7', order: 7, label: 'Source Code Milikmu', awd: true, wordpress: false },
    { id: 'row-8', order: 8, label: 'Bebas Plugin Berbayar', awd: true, wordpress: false },
    { id: 'row-9', order: 9, label: 'Maintenance Mudah', awd: true, wordpress: false },
  ],
  guaranteeTitle: 'Garansi Skor Lighthouse 90+',
  guaranteeDescription: 'Setiap project diuji sungguhan — bukan angka statis. Performance, SEO, Accessibility, Best Practices. Janji yang bisa diverifikasi, bukan klaim kosong.',
  guaranteeVisible: true,
};

export function WhyAWD() {
  const sectionRef = useRef<HTMLElement>(null);
  const content = loadFromStorage(STORAGE_KEYS.WHY, DEFAULT_WHY);
  const rows = content.rows.slice().sort((a, b) => a.order - b.order);

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
        const rowStagger = isMobile ? 0.04 : 0.08;
        const iconOffset = isMobile ? 0.06 : 0.12;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: '[data-why-table]', start: 'top 80%', once: true },
        });

        // 1. Eyebrow: fade in + letterSpacing 0.2em -> 0.05em
        tl.fromTo('[data-why-eyebrow]',
          { opacity: 0, letterSpacing: '0.2em' },
          { opacity: 1, letterSpacing: '0.05em', duration: 0.4, ease: 'power2.out' },
          0,
        );

        // 2. Headline: y 20 -> 0, fade in
        tl.from('[data-why-headline]', {
          opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        }, 0);

        // 3. Subheadline: fade in, 0.1s after headline starts
        tl.from('[data-why-subheadline]', {
          opacity: 0, duration: 0.5, ease: 'power2.out',
        }, 0.1);

        // 4. Table header row: fade in + scaleX 0.96 -> 1
        const headerStart = '>-0.2';
        tl.from('[data-why-header-row]', {
          opacity: 0, scaleX: 0.96, duration: 0.3, ease: 'power2.out',
          transformOrigin: 'center center',
        }, headerStart);

        // 5. Data rows, top to bottom, stagger per row.
        // Anchor rows to a fixed absolute time (end of header tween) so each
        // row's start is an independent numeric position — using a moving '>'
        // here compounds across iterations and double-'+=' labels are invalid.
        const rows = gsap.utils.toArray<HTMLElement>('[data-why-row]');
        const rowsBase = tl.duration();
        let lastRowTextStart = 0;
        rows.forEach((rowEl, idx) => {
          const rowTextStart = rowsBase + idx * rowStagger;
          lastRowTextStart = idx * rowStagger;

          const texts = rowEl.querySelectorAll('[data-why-text]');
          tl.from(texts, {
            opacity: 0, x: -10, duration: 0.4, ease: 'power2.out',
          }, rowTextStart);

          const checks = rowEl.querySelectorAll('[data-why-check]');
          if (checks.length) {
            tl.from(checks, {
              scale: 0, duration: 0.4, ease: 'back.out(2)', transformOrigin: 'center center',
            }, rowTextStart + iconOffset);
          }
          const xs = rowEl.querySelectorAll('[data-why-x]');
          if (xs.length) {
            tl.from(xs, {
              scale: 0, duration: 0.3, ease: 'power2.out', transformOrigin: 'center center',
            }, rowTextStart + iconOffset);
          }
        });

        // 6. Callout: 0.3s after last data row's reveal, fadeUp + scale, then one-time border pulse.
        const calloutStart = rowsBase + lastRowTextStart + iconOffset + 0.4 + 0.3;
        tl.from('[data-why-callout]', {
          opacity: 0, y: 16, scale: 0.97, duration: 0.5, ease: 'power2.out',
        }, calloutStart);

        tl.fromTo('[data-why-callout]',
          { boxShadow: '0 0 0px rgba(198,255,74,0)' },
          {
            boxShadow: '0 0 16px rgba(198,255,74,0.5)',
            duration: 0.6, ease: 'power2.inOut',
            yoyo: true, repeat: 1,
          },
          '>',
        );
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
    <section ref={sectionRef} id="kenapa-awd" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div
          data-why-header
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div data-why-eyebrow style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: '#C6FF4A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
            KENAPA AWD
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
          </div>
          <h2 data-why-headline style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            React/Next.js vs WordPress
          </h2>
          <p data-why-subheadline style={{
            fontFamily: 'Inter, sans-serif', fontSize: 16,
            color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto',
          }}>
            Bukan soal selera — ini soal keputusan teknikal yang berdampak langsung ke bisnis kamu.
          </p>
        </div>

        {/* Table */}
        <div
          data-why-table
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, overflow: 'hidden', marginBottom: 32,
          }}
        >
          {/* Header row */}
          <div data-why-header-row style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,4fr) minmax(0,3fr) minmax(0,3fr)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div className="px-2 py-3 sm:px-6 sm:py-4" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span className="text-[9px] sm:text-[11px]">{content.col1Header}</span>
            </div>
            <div className="px-1 py-3 sm:px-6 sm:py-4" style={{ textAlign: 'center', borderLeft: '1px solid rgba(198,255,74,0.1)', borderRight: '1px solid rgba(198,255,74,0.1)' }}>
              <span className="text-[9px] sm:text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#C6FF4A', letterSpacing: '0.04em' }}>{content.col2Header}</span>
            </div>
            <div className="px-1 py-3 sm:px-6 sm:py-4" style={{ textAlign: 'center' }}>
              <span className="text-[9px] sm:text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{content.col3Header}</span>
            </div>
          </div>

          {rows.map((row, i) => (
            <div
              key={row.id}
              data-why-row
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,4fr) minmax(0,3fr) minmax(0,3fr)',
                borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}
            >
              <div data-why-text className="px-2 py-3 sm:px-6 sm:py-3.5 text-xs sm:text-sm" style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.65)' }}>
                {row.label}
              </div>
              <div className="px-1 py-3 sm:px-6 sm:py-3.5" style={{ textAlign: 'center', borderLeft: '1px solid rgba(198,255,74,0.06)', borderRight: '1px solid rgba(198,255,74,0.06)' }}>
                {row.awd ? (
                  <span data-why-check className="w-4 h-4 sm:w-5 sm:h-5" style={{ display: 'inline-flex', background: 'rgba(198,255,74,0.15)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={10} color="#C6FF4A" strokeWidth={3} />
                  </span>
                ) : (
                  <span data-why-x className="w-4 h-4 sm:w-5 sm:h-5" style={{ display: 'inline-flex', background: 'rgba(255,100,100,0.1)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={10} color="#FF6B6B" strokeWidth={3} />
                  </span>
                )}
              </div>
              <div className="px-1 py-3 sm:px-6 sm:py-3.5" style={{ textAlign: 'center' }}>
                {row.wordpress ? (
                  <span data-why-check className="w-4 h-4 sm:w-5 sm:h-5" style={{ display: 'inline-flex', background: 'rgba(198,255,74,0.15)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={10} color="#C6FF4A" strokeWidth={3} />
                  </span>
                ) : (
                  <span data-why-x className="w-4 h-4 sm:w-5 sm:h-5" style={{ display: 'inline-flex', background: 'rgba(255,100,100,0.1)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={10} color="#FF6B6B" strokeWidth={3} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lighthouse callout */}
        {content.guaranteeVisible && (
          <div
            data-why-callout
            style={{
              background: 'rgba(198,255,74,0.05)',
              border: '1px solid rgba(198,255,74,0.2)',
              borderRadius: 16, padding: '24px 28px',
              display: 'flex', alignItems: 'center', gap: 20,
            }}
          >
            <div style={{
              width: 52, height: 52, flexShrink: 0,
              background: 'rgba(198,255,74,0.12)', borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Gauge size={26} color="#C6FF4A" />
            </div>
            <div>
              <p style={{
                fontFamily: 'Inter Tight, sans-serif', fontSize: 17,
                fontWeight: 700, color: '#FAFAFA', marginBottom: 4,
              }}>
                {content.guaranteeTitle}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                {content.guaranteeDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
