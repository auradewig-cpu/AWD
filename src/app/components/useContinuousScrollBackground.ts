import { useEffect, useRef, useState, type RefObject } from 'react';

export const FRAME_COUNT = 192;
const CROSSFADE_FRAMES = 12;
const HALF = 0.5;

export function buildFrameUrl(basePath: string, index: number): string {
  const n = String(index).padStart(4, '0');
  return `${basePath}/hero-sequence-${n}.webp`;
}

function frameFromT(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return Math.round(clamped * (FRAME_COUNT - 1)) + 1;
}

// Progress (0..1 of total document scroll) at which the crossfade window
// starts/ends: the last CROSSFADE_FRAMES of asset1 overlap with the first
// CROSSFADE_FRAMES of asset2, both inside this shared window around 50%.
const FOLD_START = HALF * ((FRAME_COUNT - CROSSFADE_FRAMES - 1) / (FRAME_COUNT - 1));
const FOLD_END = HALF + HALF * ((CROSSFADE_FRAMES - 1) / (FRAME_COUNT - 1));

interface PreloadState {
  images: HTMLImageElement[];
  ready: boolean;
  progress: number;
}

// Preloads a full 192-frame sequence as HTMLImageElements. Gated by
// `enabled` so the caller controls eager (asset1) vs lazy (asset2) start.
export function usePreloadedSequence(basePath: string, enabled: boolean): PreloadState {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    const onSettle = () => {
      if (cancelled) return;
      loadedCount += 1;
      setLoaded(loadedCount);
      if (loadedCount >= FRAME_COUNT) setReady(true);
    };

    for (let i = 0; i < FRAME_COUNT; i += 1) {
      const img = new Image();
      img.decoding = 'async';
      img.src = buildFrameUrl(basePath, i + 1);
      img.onload = onSettle;
      img.onerror = onSettle;
      images[i] = img;
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
      for (const img of images) {
        if (!img) continue;
        img.onload = null;
        img.onerror = null;
        img.src = '';
      }
      imagesRef.current = [];
    };
  }, [basePath, enabled]);

  return { images: imagesRef.current, ready, progress: loaded / FRAME_COUNT };
}

function drawFrame(canvas: HTMLCanvasElement, img: HTMLImageElement | undefined) {
  if (!img || !img.complete || img.naturalWidth === 0) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

interface DriveOptions {
  canvas1Ref: RefObject<HTMLCanvasElement | null>;
  canvas2Ref: RefObject<HTMLCanvasElement | null>;
  images1: HTMLImageElement[];
  images2: HTMLImageElement[];
  ready1: boolean;
  ready2: boolean;
  /** Fired once when scroll progress nears the 50% fold, to trigger asset2 preload. */
  onNearFold: () => void;
  nearFoldThreshold?: number;
}

// Drives both canvases off whole-document scroll progress: maps the first
// half to asset1 (frame 1..192), the second half to asset2, and crossfades
// opacity across a short window straddling the 50% split. Redraws each
// canvas only when its own computed frame index changes (dirty-flag).
export function useContinuousScrollDrive({
  canvas1Ref,
  canvas2Ref,
  images1,
  images2,
  ready1,
  ready2,
  onNearFold,
  nearFoldThreshold = 0.35,
}: DriveOptions): void {
  const lastDrawn1 = useRef(-1);
  const lastDrawn2 = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const nearFoldFiredRef = useRef(false);

  useEffect(() => {
    if (!ready1) return;
    const canvas1 = canvas1Ref.current;
    const canvas2 = canvas2Ref.current;
    if (!canvas1 || !canvas2) return;

    const resizeCanvas = (canvas: HTMLCanvasElement) => {
      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };

    const $body = document.body;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      $body.style.overscrollBehavior = 'none';
      $body.style.WebkitOverflowScrolling = 'auto';
    }

    function getProgress(): number {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return 0;
      return Math.min(1, Math.max(0, window.scrollY / docHeight));
    }

    function render() {
      const p = getProgress();

      if (!nearFoldFiredRef.current && p >= nearFoldThreshold) {
        nearFoldFiredRef.current = true;
        onNearFold();
      }

      const idx1 = frameFromT(p / HALF);
      const idx2 = frameFromT((p - HALF) / HALF);

      let opacity1: number;
      let opacity2: number;
      if (p <= FOLD_START) {
        opacity1 = 1;
        opacity2 = 0;
      } else if (p >= FOLD_END) {
        opacity1 = 0;
        opacity2 = 1;
      } else {
        const localT = (p - FOLD_START) / (FOLD_END - FOLD_START);
        opacity1 = 1 - localT;
        opacity2 = localT;
      }

      canvas1.style.opacity = String(opacity1);
      if (idx1 !== lastDrawn1.current) {
        lastDrawn1.current = idx1;
        drawFrame(canvas1, images1[idx1 - 1]);
      }

      if (ready2) {
        canvas2.style.opacity = String(opacity2);
        if (idx2 !== lastDrawn2.current) {
          lastDrawn2.current = idx2;
          drawFrame(canvas2, images2[idx2 - 1]);
        }
      }
    }

    function resizeAll() {
      resizeCanvas(canvas1);
      resizeCanvas(canvas2);
      lastDrawn1.current = -1;
      lastDrawn2.current = -1;
      render();
    }

    function onScroll() {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        render();
      });
    }

    resizeAll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resizeAll);

    // Document height changes whenever content above/below the fold
    // changes (e.g. FAQ accordion expand/collapse) - the 50% split must
    // track that, not just viewport resizes.
    const ro = new ResizeObserver(() => {
      lastDrawn1.current = -1;
      lastDrawn2.current = -1;
      render();
    });
    ro.observe(document.body);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resizeAll);
      ro.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (isTouchDevice) {
        $body.style.overscrollBehavior = '';
        $body.style.WebkitOverflowScrolling = '';
      }
    };
  }, [canvas1Ref, canvas2Ref, images1, images2, ready1, ready2, onNearFold, nearFoldThreshold]);
}
