import { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 193;
const PX_PER_FRAME = 20;
const SCROLL_HEIGHT = TOTAL_FRAMES * PX_PER_FRAME;

function padIndex(i: number): string {
  return String(i + 1).padStart(4, '0');
}

export function ScrollScrubDesktop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let count = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/desktop/hero-sequence-${padIndex(i)}.webp`;
      img.onload = img.onerror = () => {
        count++;
        setLoadProgress(count / TOTAL_FRAMES);
        if (count === TOTAL_FRAMES) setLoaded(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = imagesRef.current;
    let currentFrame = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
    }
    resize();
    window.addEventListener('resize', resize);

    function render() {
      const section = sectionRef.current;
      if (!section) { rafRef.current = requestAnimationFrame(render); return; }

      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;
      const targetFrame = Math.round(p * (TOTAL_FRAMES - 1));

      currentFrame += (targetFrame - currentFrame) * 0.1;
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrame)));

      const img = images[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        if (canvas!.width !== w * dpr || canvas!.height !== h * dpr) {
          canvas!.width = w * dpr;
          canvas!.height = h * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(img, 0, 0, w, h);
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [loaded]);

  if (!loaded) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
        }}
      >
        <div
          style={{
            width: 200,
            height: 4,
            borderRadius: 4,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.round(loadProgress * 100)}%`,
              height: '100%',
              background: '#00C853',
              transition: 'width 120ms linear',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} style={{ height: SCROLL_HEIGHT, position: 'relative' }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          zIndex: 1,
        }}
      />
    </div>
  );
}
