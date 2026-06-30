import { useEffect, useRef, useState } from 'react';
import {
  MessageSquare, MessageCircle, Figma, Palette, Code2, RotateCcw, Rocket,
  CheckCircle, FileText, Search, Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { STORAGE_KEYS, loadFromServer, type ProcessContent } from '@/admin/storage';

export const PROCESS_ICON_MAP: Record<string, LucideIcon> = {
  MessageSquare,
  MessageCircle,
  Figma,
  Palette,
  Code2,
  RotateCcw,
  Rocket,
  CheckCircle,
  FileText,
  Search,
  Settings,
};

export const DEFAULT_PROCESS: ProcessContent = {
  steps: [
    {
      id: 'step-1',
      order: 1,
      icon: 'MessageSquare',
      title: 'Brief & Konsultasi',
      badgeLabel: 'Gratis, tanpa komitmen',
      description: 'Ceritakan kebutuhan bisnismu. Kami dengarkan, kami sarankan, tanpa tekanan.',
      active: true,
    },
    {
      id: 'step-2',
      order: 2,
      icon: 'Figma',
      title: 'Desain Konsep',
      badgeLabel: 'Wireframe 2 hari kerja',
      description: 'Wireframe visual yang bisa langsung kamu komentari sebelum development dimulai.',
      active: true,
    },
    {
      id: 'step-3',
      order: 3,
      icon: 'Code2',
      title: 'Development',
      badgeLabel: 'Update progress harian via WA',
      description: 'Koding berbasis React/Next.js. Kamu lihat progressnya setiap hari lewat WhatsApp.',
      active: true,
    },
    {
      id: 'step-4',
      order: 4,
      icon: 'RotateCcw',
      title: 'Review & Revisi',
      badgeLabel: '2 putaran revisi gratis',
      description: 'Dua kesempatan revisi tanpa biaya tambahan. Sampai benar-benar sesuai ekspektasimu.',
      active: true,
    },
    {
      id: 'step-5',
      order: 5,
      icon: 'Rocket',
      title: 'Launch & Handover',
      badgeLabel: 'Deploy + source code diserahkan',
      description: 'Website live, source code jadi milikmu sepenuhnya. Kamu yang pegang kendali penuh.',
      active: true,
    },
  ],
};

const STEP_PALETTE = [
  { color: 'rgba(198,255,74,0.12)', iconColor: '#C6FF4A' },
  { color: 'rgba(77,140,255,0.08)', iconColor: '#4D8CFF' },
  { color: 'rgba(198,255,74,0.08)', iconColor: '#8FE000' },
  { color: 'rgba(77,140,255,0.08)', iconColor: '#4D8CFF' },
  { color: 'rgba(198,255,74,0.12)', iconColor: '#C6FF4A' },
];

export function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const [content, setContent] = useState<ProcessContent>(DEFAULT_PROCESS);

  useEffect(() => {
    loadFromServer(STORAGE_KEYS.PROCESS, DEFAULT_PROCESS).then(setContent);
  }, []);

  useEffect(() => {
    function handleUpdate() {
      loadFromServer(STORAGE_KEYS.PROCESS, DEFAULT_PROCESS).then(setContent);
    }
    window.addEventListener('awd-process-updated', handleUpdate);
    return () => window.removeEventListener('awd-process-updated', handleUpdate);
  }, []);

  const steps = content.steps
    .filter((s) => s.active)
    .slice()
    .sort((a, b) => a.order - b.order);

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
        const stepStagger = isMobile ? 0.075 : 0.15;
        const iconToText = isMobile ? 0.04 : 0.08;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        });

        // 1. Headline
        tl.from('[data-process-header]', {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, 0);

        // 2. Glass container fades in 0.2s after headline begins
        tl.from('[data-process-glass]', {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        }, 0.2);

        // 3. Connector line draws downward, in sync with container fade-in
        tl.from('[data-process-connector]', {
          scaleY: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0.2);

        // 4. Each step staggered, sequentially
        const stepsEls = gsap.utils.toArray<HTMLElement>('[data-process-step]');
        const stepsStart = 0.5;
        stepsEls.forEach((stepEl, i) => {
          const slot = stepsStart + i * stepStagger;
          const icon = stepEl.querySelector('[data-process-icon]');
          const text = stepEl.querySelector('[data-process-text]');
          const numberEl = stepEl.querySelector('[data-process-number]');

          // Icon box: scale + opacity with overshoot
          tl.from(icon, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
          }, slot);

          // Text block: slides in, follows its own icon by iconToText
          tl.from(text, {
            x: -20,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
          }, slot + iconToText);

          // Number badge: count up from 0 to final integer, in sync with icon
          const finalNum = i + 1;
          tl.to({ val: 0 }, {
            val: finalNum,
            duration: 0.3,
            ease: 'power1.out',
            onUpdate() {
              if (numberEl) {
                const v = (this.targets()[0] as { val: number }).val;
                numberEl.textContent = String(Math.round(v)).padStart(2, '0');
              }
            },
          }, slot);
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

  return (
    <section ref={sectionRef} id="proses" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div
          data-process-header
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: '#C6FF4A', letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
            PROSES KERJA
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
          </div>
          <h2 style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em',
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}>
            Dari Nol ke Launch, <br />
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>dalam 5 Langkah</span>
          </h2>
        </div>

        {/* Steps — shared glass container */}
        <div
          data-process-glass
          data-process-steps
          style={{
            display: 'flex', flexDirection: 'column', gap: 0, position: 'relative',
            background: 'rgba(7,8,10,0.70)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            padding: 28,
          }}
        >
          {/* Connector line — re-anchored to container padding (28) + icon-box center (28) */}
          <div
            data-process-connector
            style={{
              position: 'absolute', left: 56, top: 76, bottom: 76,
              width: 1, background: 'rgba(198,255,74,0.2)',
              transformOrigin: 'top',
            }}
          />

          {steps.map((step, idx) => {
            const Icon = PROCESS_ICON_MAP[step.icon] ?? MessageSquare;
            const palette = STEP_PALETTE[idx % STEP_PALETTE.length];
            const num = String(idx + 1).padStart(2, '0');
            return (
              <div
                key={step.id}
                data-process-step
                style={{
                  display: 'flex', gap: 28, alignItems: 'flex-start',
                  padding: '24px 0', position: 'relative',
                }}
              >
                {/* Number/Icon */}
                <div
                  data-process-icon
                  style={{
                    flexShrink: 0, width: 56, height: 56,
                    background: palette.color,
                    border: `1px solid ${palette.iconColor}22`,
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <Icon size={22} color={palette.iconColor} />
                </div>

                {/* Content */}
                <div data-process-text style={{ flex: 1, paddingTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                    <span
                      data-process-number
                      style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                        color: 'rgba(255,255,255,0.25)', fontWeight: 500,
                      }}
                    >
                      {num}
                    </span>
                    <span style={{
                      fontFamily: 'Inter Tight, sans-serif', fontSize: 18,
                      fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.01em',
                    }}>
                      {step.title}
                    </span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                      color: palette.iconColor, letterSpacing: '0.05em',
                    }}>
                      {step.badgeLabel}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 15,
                    color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 500,
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
