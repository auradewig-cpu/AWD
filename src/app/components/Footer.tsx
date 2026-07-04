import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Instagram, Youtube, MessageCircle, Music2, Facebook } from 'lucide-react';
import { STORAGE_KEYS, loadFromServer } from '@/admin/storage';
import { DEFAULT_SOCIAL, type SocialContent } from '@/app/pages/admin/AdminSocialMedia';

export function Footer() {
  const [social, setSocial] = useState<SocialContent>(DEFAULT_SOCIAL);
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    loadFromServer(STORAGE_KEYS.SOCIAL, DEFAULT_SOCIAL).then(setSocial);
  }, []);

  useEffect(() => {
    function handleUpdate() {
      loadFromServer(STORAGE_KEYS.SOCIAL, DEFAULT_SOCIAL).then(setSocial);
    }
    window.addEventListener('awd-social-updated', handleUpdate);
    return () => window.removeEventListener('awd-social-updated', handleUpdate);
  }, []);

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
          gsap.from(footerRef.current, {
            opacity: 0,
            y: 24,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: { trigger: footerRef.current, start: 'top 90%', once: true },
          });
        });
      }, footerRef);
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(run, { timeout: 1500 });
    } else {
      setTimeout(run, 500);
    }

    return () => { cancelled = true; ctx?.revert(); };
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
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, textDecoration: 'none' }}>
              <img
                src="https://res.cloudinary.com/dr0xe0tgr/image/upload/w_800,q_60,f_webp/v1782787491/ChatGPT_Image_30_Jun_2026_09.44.03_zxx3bh.webp"
                alt="AWD Logo"
                style={{ height: 32, width: 'auto', display: 'block' }}
              />
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: 'Inter, sans-serif', lineHeight: 1.6, maxWidth: 240 }}>
              Jasa pembuatan website & aplikasi web berbasis React/Next.js. Kualitas premium, harga transparan.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  <Instagram size={18} />
                </a>
              )}
              {social.tiktok && (
                <a href={social.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  <Music2 size={18} />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  <Youtube size={18} />
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  <Facebook size={18} />
                </a>
              )}
              {social.whatsapp && (
                <a href={`https://wa.me/${social.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C6FF4A'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  <MessageCircle size={18} />
                </a>
              )}
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
              href={`https://wa.me/${social.whatsapp}`}
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
