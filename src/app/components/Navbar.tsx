import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Paket Harga', href: '#pricing' },
  { label: 'Lihat Demo', href: '#pricing' },
  { label: 'Proses Kerja', href: '#proses' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Kontak', href: '#kontak' },
];

const WA_NUMBER = '6285286427559';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleNavClick(href: string) {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const id = href.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const id = href.replace('#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(7,8,10,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              src="https://res.cloudinary.com/dwovnb9hh/image/upload/v1782642459/__task____Design_a_modern__202605310753_vxua01.webp"
              alt="AWD Logo"
              style={{ height: 40, width: 'auto', display: 'block' }}
            />
          </Link>

          {/* Desktop Nav */}
          <div style={{ alignItems: 'center', gap: 4 }} className="hidden md:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '8px 14px', borderRadius: 8,
                  color: 'rgba(255,255,255,0.68)', fontSize: 14, fontFamily: 'Inter, sans-serif',
                  fontWeight: 500, transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FAFAFA')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.68)')}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=Halo%20Aldi%2C%20saya%20ingin%20konsultasi%20gratis%20tentang%20pembuatan%20website.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                alignItems: 'center', gap: 6,
                background: '#C6FF4A', color: '#07080A',
                borderRadius: 999, padding: '9px 20px',
                fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                textDecoration: 'none', transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.filter = 'brightness(1.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
              className="hidden sm:inline-flex"
            >
              Konsultasi Gratis →
            </a>
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FAFAFA', padding: 4 }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            background: 'rgba(13,15,18,0.97)', backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 0 24px',
          }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '12px 24px', color: 'rgba(255,255,255,0.8)',
                  fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: 500,
                }}
              >
                {link.label}
              </button>
            ))}
            <div style={{ padding: '12px 24px 0' }}>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Halo%20Aldi%2C%20saya%20ingin%20konsultasi%20gratis.`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: '#C6FF4A', color: '#07080A',
                  borderRadius: 999, padding: '12px 24px',
                  fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                  textDecoration: 'none',
                }}
              >
                Konsultasi Gratis →
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
