import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { STORAGE_KEYS, loadFromStorage, type ContactContent } from '@/admin/storage';

export const DEFAULT_CONTACT: ContactContent = {
  headline: 'Siap Mulai?',
  subheadline: 'Ceritakan bisnis kamu. Konsultasi pertama selalu gratis.',
  fieldLabels: {
    name: 'Nama',
    business: 'Nama Bisnis / Profesi',
    budget: 'Estimasi Budget',
    message: 'Pesan',
  },
  budgetRanges: [
    'Di bawah Rp 1jt',
    'Rp 1jt – 5jt',
    'Rp 5jt – 10jt',
    'Rp 10jt – 20jt',
    'Di atas Rp 20jt',
    'Belum tahu / minta rekomendasi',
  ],
  waNumber: '6285286427559',
  submitButtonText: 'Kirim via WhatsApp →',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '14px 16px',
  color: '#FFFFFF',
  fontSize: 15,
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

export function Contact() {
  const [form, setForm] = useState({ nama: '', bisnis: '', budget: '', pesan: '' });
  const sectionRef = useRef<HTMLElement>(null);
  const content = loadFromStorage(STORAGE_KEYS.CONTACT, DEFAULT_CONTACT);

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
          const tl = gsap.timeline({
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
          });

          tl.from('[data-contact-headline]', {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: 'power2.out',
          })
            .from('[data-contact-field]', {
              opacity: 0,
              y: 24,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.1,
            }, 0.3);
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

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.target.style.borderColor = '#00C853';
    e.target.style.boxShadow = '0 0 0 2px rgba(0,200,83,0.15)';
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
    e.target.style.boxShadow = 'none';
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Halo Aldi, saya ingin konsultasi.%0ANama: ${form.nama}%0ABisnis: ${form.bisnis}%0ABudget: ${form.budget}%0APesan: ${form.pesan}`;
    window.open(`https://wa.me/${content.waNumber}?text=${msg}`, '_blank');
  }

  return (
    <section ref={sectionRef} id="kontak" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Header */}
        <div
          data-contact-headline
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: '#C6FF4A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
            KONTAK
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
          </div>
          <h2 style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            {content.headline}
          </h2>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: 16,
            color: 'rgba(255,255,255,0.55)',
          }}>
            {content.subheadline}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(10,10,10,0.80)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20, padding: '48px 40px',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}
        >
          <div data-contact-field>
            <label htmlFor="nama" style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#FFFFFF', marginBottom: 8 }}>
              {content.fieldLabels.name}
            </label>
            <input
              id="nama"
              type="text"
              required
              placeholder="Nama lengkap kamu"
              value={form.nama}
              onChange={e => setForm({ ...form, nama: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div data-contact-field>
            <label htmlFor="bisnis" style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#FFFFFF', marginBottom: 8 }}>
              {content.fieldLabels.business}
            </label>
            <input
              id="bisnis"
              type="text"
              required
              placeholder="Klinik Dr. Andi, Firma XYZ, dsb."
              value={form.bisnis}
              onChange={e => setForm({ ...form, bisnis: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div data-contact-field>
            <label htmlFor="budget" style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#FFFFFF', marginBottom: 8 }}>
              {content.fieldLabels.budget}
            </label>
            <select
              id="budget"
              required
              value={form.budget}
              onChange={e => setForm({ ...form, budget: e.target.value })}
              style={{ ...inputStyle, background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: 10, padding: '14px 16px', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <option value="" disabled style={{ background: '#0D0F12' }}>Pilih range budget...</option>
              {content.budgetRanges.map(opt => (
                <option key={opt} value={opt} style={{ background: '#0D0F12', color: '#FAFAFA' }}>{opt}</option>
              ))}
            </select>
          </div>

          <div data-contact-field>
            <label htmlFor="pesan" style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#FFFFFF', marginBottom: 8 }}>
              {content.fieldLabels.message}
            </label>
            <textarea
              id="pesan"
              required
              rows={4}
              placeholder="Ceritakan kebutuhan website kamu, fitur yang diinginkan, dll."
              value={form.pesan}
              onChange={e => setForm({ ...form, pesan: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <button
            type="submit"
            data-contact-submit
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '16px 32px',
              marginTop: 8,
              backgroundColor: '#00C853',
              color: '#000000',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              border: '2px solid #00C853',
              borderRadius: 999,
              cursor: 'pointer',
              boxShadow: '0 0 32px rgba(0,200,83,0.4)',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#00E060';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#00C853';
            }}
          >
            <MessageCircle size={17} />
            {content.submitButtonText}
          </button>
        </form>
      </div>
    </section>
  );
}
