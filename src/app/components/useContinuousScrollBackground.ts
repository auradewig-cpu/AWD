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
  loadMore: (maxFrame: number) => void;
}

const INITIAL_BATCH = 8;

// Preloads a 192-frame sequence progressively. Only the first 8 frames
// load on mount (deferred to browser idle); remaining frames load on
// demand via `loadMore()` as the user scrolls.
export function usePreloadedSequence(basePath: string, enabled: boolean): PreloadState {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedUpToRef = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const basePathRef = useRef(basePath);
  basePathRef.current = basePath;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;
    loadedUpToRef.current = 0;
    setLoaded(0);
    setReady(false);

    const onSettle = () => {
      if (cancelled) return;
      loadedCount += 1;
      setLoaded(loadedCount);
      if (loadedCount >= INITIAL_BATCH) setReady(true);
    };

    const startLoading = () => {
      if (cancelled) return;
      for (let i = 0; i < INITIAL_BATCH; i += 1) {
        const img = new Image();
        img.decoding = 'async';
        img.src = buildFrameUrl(basePath, i + 1);
        img.onload = onSettle;
        img.onerror = onSettle;
        images[i] = img;
      }
      loadedUpToRef.current = INITIAL_BATCH;
    };

    let cancelIdleId: number | undefined;
    let fallbackTimeoutId: ReturnType<typeof setTimeout> | undefined;
    if ('requestIdleCallback' in window) {
      cancelIdleId = (window as any).requestIdleCallback(startLoading, { timeout: 2000 });
    } else {
      fallbackTimeoutId = setTimeout(startLoading, 100);
    }

    return () => {
      cancelled = true;
      if (cancelIdleId !== undefined) (window as any).cancelIdleCallback(cancelIdleId);
      if (fallbackTimeoutId !== undefined) clearTimeout(fallbackTimeoutId);
      for (const img of images) {
        if (!img) continue;
        img.onload = null;
        img.onerror = null;
        img.src = '';
      }
      imagesRef.current = [];
    };
  }, [basePath, enabled]);

  const loadMore = (maxFrame: number) => {
    if (maxFrame <= loadedUpToRef.current) return;
    const images = imagesRef.current;
    if (!images || images.length === 0) return;
    const start = loadedUpToRef.current + 1;
    for (let i = start; i <= maxFrame; i++) {
      const idx = i - 1;
      if (images[idx]) continue;
      const img = new Image();
      img.decoding = 'async';
      img.src = buildFrameUrl(basePathRef.current, i);
      images[idx] = img;
    }
    loadedUpToRef.current = maxFrame;
  };

  return { images: imagesRef.current, ready, progress: Math.min(loaded / INITIAL_BATCH, 1), loadMore };
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
  /** Progressive frame loader for asset1 — called when scroll reaches each threshold. */
  loadMore1?: (maxFrame: number) => void;
  /** Progressive frame loader for asset2 — called when scroll reaches each threshold. */
  loadMore2?: (maxFrame: number) => void;
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
  loadMore1,
  loadMore2,
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

    // Force GPU compositing layer so iOS Safari repaints canvas every frame,
    // not only after scroll momentum ends.
    [canvas1, canvas2].forEach((c) => {
      const s = c.style as CSSStyleDeclaration & { webkitTransform: string; webkitBackfaceVisibility: string };
      s.transform = 'translateZ(0)';
      s.webkitTransform = 'translateZ(0)';
      s.willChange = 'transform';
      s.backfaceVisibility = 'hidden';
      s.webkitBackfaceVisibility = 'hidden';
    });

    const resizeCanvas = (canvas: HTMLCanvasElement) => {
      const isMobileDevice = window.innerWidth <= 768;
      const dpr = isMobileDevice
        ? 1
        : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    };

    const $body = document.body;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      $body.style.overscrollBehavior = 'none';
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

      // Progressive frame loading — only fetch what's needed for current scroll
      if (loadMore1) {
        if (p > 0.08) loadMore1(80);
        if (p > 0.20) loadMore1(150);
        if (p > 0.35) loadMore1(192);
      }
      if (loadMore2 && ready2) {
        const p2 = (p - HALF) / HALF;
        if (p2 > 0.15) loadMore2(80);
        if (p2 > 0.40) loadMore2(150);
        if (p2 > 0.70) loadMore2(192);
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

    // On iOS Safari, scroll events do not drive fixed-canvas repaints reliably.
    // A continuous RAF loop reads window.scrollY directly every frame instead.
    const isMobileUA = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let mobileRafActive = false;
    let mobileRafId: number | null = null;

    if (isMobileUA) {
      mobileRafActive = true;
      const tick = () => {
        if (!mobileRafActive) return;
        render();
        mobileRafId = requestAnimationFrame(tick);
      };
      mobileRafId = requestAnimationFrame(tick);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
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
      mobileRafActive = false;
      if (mobileRafId != null) cancelAnimationFrame(mobileRafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resizeAll);
      ro.disconnect();
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (isTouchDevice) {
        $body.style.overscrollBehavior = '';
      }
    };
  }, [canvas1Ref, canvas2Ref, images1, images2, ready1, ready2, onNearFold, nearFoldThreshold]);
}
