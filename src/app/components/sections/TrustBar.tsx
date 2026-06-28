import { useEffect, useRef } from 'react';
import { STORAGE_KEYS, loadFromStorage, type TrustContent } from '@/admin/storage';

export const DEFAULT_TRUST: TrustContent = {
  text: 'Dipercaya pemilik klinik, arsitek, dan bisnis premium di Yogyakarta & sekitarnya.',
  visible: true,
};

export function TrustBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const content = loadFromStorage(STORAGE_KEYS.TRUST, DEFAULT_TRUST);

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
          gsap.from('[data-reveal-word]', {
            opacity: 0,
            x: -12,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.8 / 8,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              once: true,
            },
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

  if (!content.visible) return null;

  const words = content.text.split(' ');

  return (
    <section ref={sectionRef} style={{ padding: '24px 24px', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.01em',
          }}
        >
          {words.map((word, i) => (
            <span key={i} data-reveal-word style={{ display: 'inline-block', whiteSpace: 'pre' }}>
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
