import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WA_NUMBER = '6281234567890';

export function Footer() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(footerRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 90%', once: true },
        });
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '60px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, background: '#C6FF4A', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 14, color: '#07080A' }}>A</span>
              </div>
              <span style={{ fontFamily: 'Inter Tight, sans-serif', fontWeight: 800, fontSize: 18, color: '#FAFAFA' }}>AWD</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.6, maxWidth: 240 }}>
              Jasa pembuatan website & aplikasi web berbasis React/Next.js. Kualitas premium, harga transparan.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                <Instagram size={18} />
              </a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                <Youtube size={18} />
              </a>
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p style={{ color: '#FAFAFA', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Navigasi</p>
            {['Beranda', 'Paket Harga', 'Lihat Demo', 'Proses Kerja', 'FAQ', 'Kontak'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                style={{
                  display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 14,
                  fontFamily: 'Inter, sans-serif', textDecoration: 'none',
                  marginBottom: 10, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Paket */}
          <div>
            <p style={{ color: '#FAFAFA', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Paket</p>
            {['SPARK', 'IGNITE', 'BLAZE', 'BLAZE+', 'APEX'].map(tier => (
              <a
                key={tier}
                href="#pricing"
                style={{
                  display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 14,
                  fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none',
                  marginBottom: 10, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              >
                {tier}
              </a>
            ))}
          </div>

          {/* Kontak */}
          <div>
            <p style={{ color: '#FAFAFA', fontSize: 13, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Kontak</p>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(198,255,74,0.08)', border: '1px solid rgba(198,255,74,0.2)',
                color: '#C6FF4A', borderRadius: 8, padding: '10px 16px',
                fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 600,
                textDecoration: 'none', marginBottom: 12, transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(198,255,74,0.15)';
                e.currentTarget.style.borderColor = 'rgba(198,255,74,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(198,255,74,0.08)';
                e.currentTarget.style.borderColor = 'rgba(198,255,74,0.2)';
              }}
            >
              <MessageCircle size={16} />
              WhatsApp Aldi
            </a>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
              Yogyakarta & sekitarnya
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 24,
          display: 'flex', flexWrap: 'wrap', gap: 16,
          justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Inter, sans-serif' }}>
            © {year} AWD — Aldi Web Designer. Semua hak dilindungi.
          </p>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
              BUILT WITH REACT & NEXT.JS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
