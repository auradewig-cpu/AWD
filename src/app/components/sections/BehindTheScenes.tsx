import { useEffect, useRef } from 'react';

export function BehindTheScenes() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let ctx: any;
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { SplitText } = await import('gsap/SplitText');
      gsap.registerPlugin(ScrollTrigger, SplitText);
      if (cancelled) return;
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          const split = new SplitText(headlineRef.current, { type: 'words' });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          });

          tl.from('[data-bts-eyebrow]', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' })
            .from(split.words, {
              opacity: 0,
              y: 24,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.05,
            }, 0.1)
            .from('[data-bts-sub]', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '<0.3');

          return () => split.revert();
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
      id="di-balik-layar"
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto', width: '100%', textAlign: 'center' }}>
          {/* Eyebrow */}
          <div data-bts-eyebrow>
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
                REKAYASA SUNGGUHAN • BUKAN BUILDER VISUAL
              </span>
            </div>
          </div>

          {/* Headline (PLACEHOLDER — pending Awea approval) */}
          <h2
            ref={headlineRef}
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 'clamp(30px, 4.5vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.08,
              color: '#FAFAFA',
              letterSpacing: '-0.03em',
              marginBottom: 20,
              textShadow: '0 1px 12px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.7)',
            }}
          >
            Bukan Sekadar Tampilan, Ada Mesin{' '}
            <span style={{ color: '#C6FF4A' }}>Sungguhan</span>
            {' '}di Baliknya.
          </h2>

          {/* Subheadline (PLACEHOLDER — pending Awea approval) */}
          <p
            data-bts-sub
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'rgba(255,255,255,0.68)',
              lineHeight: 1.65,
              maxWidth: 600,
              margin: '0 auto',
            }}
          >
            Setiap situs AWD dibangun dari kode React/Next.js asli — bukan
            drag-and-drop, bukan template, bukan plugin yang ditumpuk-tumpuk.
          </p>
        </div>
      </div>
    </section>
  );
}
