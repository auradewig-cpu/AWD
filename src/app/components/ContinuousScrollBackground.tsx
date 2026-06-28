import { useRef, useState } from 'react';
import {
  buildFrameUrl,
  usePreloadedSequence,
  useContinuousScrollDrive,
} from './useContinuousScrollBackground';

const ASSET1_BASE = '/sequences/asset1';
const ASSET2_BASE = '/sequences/asset2';
const FALLBACK_FRAME = 96;

// Synchronous, pre-paint detection (lazy useState initializer, not
// useEffect) so mobile/reduced-motion never mounts the heavy canvas path
// even for one frame. Safe here: pure client-side Vite SPA, no SSR.
function detectStatic(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const conn = (navigator as any).connection;
  if (conn) {
    if (conn.saveData) return true;
    if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') return true;
  }
  return false;
}

/**
 * Single fixed background spanning the whole document. Maps total scroll
 * progress 0-50% to asset1 (frame 1-192) and 50-100% to asset2, crossfading
 * across a short window at the 50% split. No pinning - sections scroll
 * normally, this just renders behind them (z-index 0).
 */
export function ContinuousScrollBackground() {
  const [isStatic] = useState(detectStatic);
  const [asset2Enabled, setAsset2Enabled] = useState(false);

  const { images: images1, ready: ready1, progress: progress1, loadMore: loadMore1 } = usePreloadedSequence(
    ASSET1_BASE,
    !isStatic,
  );
  const { images: images2, ready: ready2, loadMore: loadMore2 } = usePreloadedSequence(
    ASSET2_BASE,
    !isStatic && asset2Enabled,
  );

  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);

  useContinuousScrollDrive({
    canvas1Ref,
    canvas2Ref,
    images1,
    images2,
    ready1,
    ready2,
    onNearFold: () => setAsset2Enabled(true),
    loadMore1,
    loadMore2,
  });

  // Global scrim: keeps every section's plain text readable against
  // whatever frame happens to be behind it, on top of each hero-style
  // section's own stronger local gradient. Positioned absolute (not fixed)
  // so it spans the full document height inside HomePage's relative wrapper,
  // letting the vertical gradient correlate to real scroll position:
  // lighter at Hero (top), progressively darker toward Contact/Footer (bottom).
  const scrim = (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        background:
          'linear-gradient(to bottom,' +
          ' rgba(7,8,10,0.35) 0%,' +
          ' rgba(7,8,10,0.55) 30%,' +
          ' rgba(7,8,10,0.78) 65%,' +
          ' rgba(7,8,10,0.92) 100%)',
      }}
    />
  );

  if (isStatic) {
    return (
      <>
        <img
          src={buildFrameUrl(ASSET1_BASE, FALLBACK_FRAME)}
          alt=""
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        {scrim}
      </>
    );
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: '#07080A',
        }}
      >
        <canvas
          ref={canvas1Ref}
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        />
        <canvas
          ref={canvas2Ref}
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', opacity: 0,
          }}
        />

        {/* LCP anchor: visible immediately from preloaded frame, fades once canvas takes over */}
        <img
          src={buildFrameUrl(ASSET1_BASE, 1)}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: ready1 ? -1 : 1,
            opacity: ready1 ? 0 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />

        {!ready1 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 160,
                height: 3,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.round(progress1 * 100)}%`,
                  height: '100%',
                  background: '#C6FF4A',
                  transition: 'width 120ms linear',
                }}
              />
            </div>
          </div>
        )}
      </div>
      {scrim}
    </>
  );
}

export default ContinuousScrollBackground;
