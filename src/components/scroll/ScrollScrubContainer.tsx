import { useEffect, useState } from 'react';
import { ScrollScrubDesktop } from './ScrollScrubDesktop';
import { ScrollScrubMobile } from './ScrollScrubMobile';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function ScrollScrubContainer() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [staticFrame, setStaticFrame] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = (navigator as any).connection;
    const lowPerf = conn && (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g');
    if (reducedMotion || lowPerf) {
      setStaticFrame(true);
    }
  }, []);

  if (staticFrame) {
    return (
      <div
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          background: '#0A0A0A',
          zIndex: 1,
        }}
      >
        <img
          src="/frames/desktop/hero-sequence-0001.webp"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    );
  }

  return isMobile ? <ScrollScrubMobile /> : <ScrollScrubDesktop />;
}
