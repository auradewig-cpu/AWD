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

        tl.fromTo('[data-why-eyebrow]',
          { opacity: 0, letterSpacing: '0.2em' },
          { opacity: 1, letterSpacing: '0.05em', duration: 0.4, ease: 'power2.out' },
          0,
        );

        tl.from('[data-why-headline]', {
          opacity: 0, y: 20, duration: 0.5, ease: 'power2.out',
        }, 0);

        tl.from('[data-why-subheadline]', {
          opacity: 0, duration: 0.5, ease: 'power2.out',
        }, 0.1);

        const headerStart = '>-0.2';
        tl.from('[data-why-header-row]', {
          opacity: 0, scaleX: 0.96, duration: 0.3, ease: 'power2.out',
          transformOrigin: 'center center',
        }, headerStart);

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
    <section
      ref={sectionRef}
      id="kenapa-awd"
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '100px 24px',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* ── Header ── */}
        <div data-why-header style={{ textAlign: 'center', marginBottom: 56 }}>
          <div
            data-why-eyebrow
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              fontWeight: 600,
              color: '#00C853',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            — KENAPA AWD —
          </div>
          <h2
            data-why-headline
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              color: '#FAFAFA',
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            React/Next.js vs WordPress
          </h2>
          <p
            data-why-subheadline
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              color: '#9CA3AF',
              maxWidth: 480,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Bukan soal selera — ini soal keputusan teknikal yang berdampak langsung ke bisnis kamu.
          </p>
        </div>

        {/* ── Comparison Card ── */}
        <div
          data-why-table
          style={{
            background: 'rgba(10, 10, 10, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 200, 83, 0.2)',
            borderRadius: 16,
            padding: 32,
          }}
        >
          {/* Header Row */}
          <div
            data-why-header-row
            style={{
              display: 'grid',
              gridTemplateColumns: '4fr 3fr 3fr',
              borderBottom: '2px solid rgba(0, 200, 83, 0.3)',
              minHeight: 48,
            }}
          >
            <div
              style={{
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {content.col1Header}
            </div>
            <div
              style={{
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                fontWeight: 700,
                color: '#00C853',
                letterSpacing: '0.04em',
                background: 'rgba(0, 200, 83, 0.1)',
                borderRadius: 6,
                margin: '6px 4px',
              }}
            >
              {content.col2Header}
            </div>
            <div
              style={{
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {content.col3Header}
            </div>
          </div>

          {/* Data Rows */}
          {rows.map((row, i) => (
            <div
              key={row.id}
              data-why-row
              style={{
                display: 'grid',
                gridTemplateColumns: '4fr 3fr 3fr',
                minHeight: 48,
                borderBottom: i < rows.length - 1
                  ? '1px solid rgba(255,255,255,0.05)'
                  : 'none',
                background: i % 2 === 1
                  ? 'rgba(255,255,255,0.03)'
                  : 'transparent',
              }}
            >
              <div
                data-why-text
                style={{
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                {row.label}
              </div>

              {/* AWD Column */}
              <div
                style={{
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {row.awd ? (
                  <span
                    data-why-check
                    style={{
                      display: 'inline-flex',
                      width: 24,
                      height: 24,
                      background: 'rgba(0, 200, 83, 0.15)',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={13} color="#00C853" strokeWidth={3} />
                  </span>
                ) : (
                  <span
                    data-why-x
                    style={{
                      display: 'inline-flex',
                      width: 24,
                      height: 24,
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={13} color="#EF4444" strokeWidth={3} />
                  </span>
                )}
              </div>

              {/* WordPress Column */}
              <div
                style={{
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {row.wordpress ? (
                  <span
                    data-why-check
                    style={{
                      display: 'inline-flex',
                      width: 24,
                      height: 24,
                      background: 'rgba(0, 200, 83, 0.15)',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={13} color="#00C853" strokeWidth={3} />
                  </span>
                ) : (
                  <span
                    data-why-x
                    style={{
                      display: 'inline-flex',
                      width: 24,
                      height: 24,
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={13} color="#EF4444" strokeWidth={3} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Check size={14} color="#00C853" strokeWidth={3} />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            Semua paket AWD menggunakan React/Next.js
          </span>
        </div>

        {/* ── Lighthouse Guarantee ── */}
        {content.guaranteeVisible && (
          <div
            data-why-callout
            style={{
              background: 'rgba(198,255,74,0.05)',
              border: '1px solid rgba(198,255,74,0.2)',
              borderRadius: 16,
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                flexShrink: 0,
                background: 'rgba(198,255,74,0.12)',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Gauge size={26} color="#C6FF4A" />
            </div>
            <div>
              <p
                style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#FAFAFA',
                  marginBottom: 4,
                }}
              >
                {content.guaranteeTitle}
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.55)',
                  lineHeight: 1.5,
                }}
              >
                {content.guaranteeDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
