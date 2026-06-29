import { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 193;
const SWIPE_SENSITIVITY = 400;

function padIndex(i: number): string {
  return String(i + 1).padStart(4, '0');
}

export function ScrollScrubMobile() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef(0);
  const isTouching = useRef(false);
  const lastY = useRef(0);
  const accumulated = useRef(0);
  const frameDrawn = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let count = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/mobile/hero-sequence-${padIndex(i)}.webp`;
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = imagesRef.current;
    let currentFrame = 0;

    function onTouchStart(e: TouchEvent) {
      isTouching.current = true;
      lastY.current = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      if (!isTouching.current) return;
      e.preventDefault();
      const y = e.touches[0].clientY;
      const delta = lastY.current - y;
      lastY.current = y;
      accumulated.current += delta;
      accumulated.current = Math.max(0, Math.min(accumulated.current, SWIPE_SENSITIVITY));
    }

    function onTouchEnd() {
      isTouching.current = false;
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchEnd, { passive: true });

    function render() {
      const targetRaw = (accumulated.current / SWIPE_SENSITIVITY) * (TOTAL_FRAMES - 1);
      const targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(targetRaw)));

      currentFrame += (targetFrame - currentFrame) * 0.1;
      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrame)));

      const img = images[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.drawImage(img, 0, 0, w, h);

        if (!frameDrawn.current) {
          frameDrawn.current = true;
          if (imgRef.current) {
            imgRef.current.style.opacity = '0';
          }
        }
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: 0, zIndex: 1 }}>
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
        }}
      />

      <img
        ref={imgRef}
        src="/frames/mobile/hero-sequence-0001.webp"
        alt=""
        aria-hidden="true"
        fetchpriority="high"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          zIndex: 2,
          opacity: loaded ? 0 : 1,
          pointerEvents: loaded ? 'none' : 'auto',
          transition: 'opacity 0.5s ease',
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
    </div>
  );
}
