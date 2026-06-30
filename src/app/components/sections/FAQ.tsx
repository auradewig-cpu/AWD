import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { STORAGE_KEYS, loadFromServer, type FaqContent } from '@/admin/storage';

export const DEFAULT_FAQ: FaqContent = {
  items: [
    {
      id: 'faq-1',
      order: 1,
      question: 'Berapa lama proses pembuatan website?',
      answer: 'Tergantung paket dan kompleksitas. SPARK bisa 3–5 hari kerja. IGNITE 7–10 hari. BLAZE ke atas 2–4 minggu. Estimasi lebih akurat diberikan setelah sesi brief gratis.',
      active: true,
    },
    {
      id: 'faq-2',
      order: 2,
      question: 'Apakah saya bisa lihat progress selama development?',
      answer: 'Ya. Setiap hari kerja kamu dapat update progress via WhatsApp — screenshot, link staging, atau video pendek. Kamu tidak pernah ditinggal tanpa kabar.',
      active: true,
    },
    {
      id: 'faq-3',
      order: 3,
      question: 'Bagaimana kalau saya tidak puas dengan hasilnya?',
      answer: 'Semua paket termasuk 2 putaran revisi gratis setelah demo pertama. Kami juga berkonsultasi sebelum mulai desain supaya visi sudah selaras dari awal.',
      active: true,
    },
    {
      id: 'faq-4',
      order: 4,
      question: 'Apakah source code menjadi milik saya?',
      answer: 'Ya, sepenuhnya. Setelah launch dan pembayaran lunas, seluruh source code diserahkan ke kamu. Tidak ada ketergantungan ke vendor.',
      active: true,
    },
    {
      id: 'faq-5',
      order: 5,
      question: 'Apakah ada biaya bulanan atau tersembunyi?',
      answer: 'Tidak ada hidden cost dari AWD. Biaya yang mungkin muncul: hosting (opsional, bisa di-handle sendiri), domain (gratis 1 tahun untuk SPARK ke atas), dan maintenance jika kamu butuh update setelah handover.',
      active: true,
    },
    {
      id: 'faq-6',
      order: 6,
      question: 'Stack teknologi apa yang digunakan?',
      answer: 'Next.js 14+ (App Router), React, Tailwind CSS, TypeScript. Database: PostgreSQL atau MongoDB sesuai kebutuhan. Deployment: Vercel (direkomendasikan), bisa custom server.',
      active: true,
    },
    {
      id: 'faq-7',
      order: 7,
      question: 'Apakah website bisa diupdate sendiri setelah jadi?',
      answer: 'Bisa. Untuk tier dengan admin panel, kamu bisa update konten, produk, atau halaman langsung dari dashboard tanpa coding. Untuk tier tanpa admin panel, update ringan bisa dipelajari, atau bisa request update berbayar.',
      active: true,
    },
    {
      id: 'faq-8',
      order: 8,
      question: 'Bagaimana cara mulai?',
      answer: 'Cukup klik tombol "Konsultasi Gratis" di atas — langsung terhubung ke WhatsApp Aldi. Ceritakan bisnismu, apa yang kamu butuhkan, dan Aldi akan rekomendasikan paket yang paling tepat. Tidak ada komitmen di sesi ini.',
      active: true,
    },
  ],
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [content, setContent] = useState<FaqContent>(DEFAULT_FAQ);

  useEffect(() => {
    loadFromServer(STORAGE_KEYS.FAQ, DEFAULT_FAQ).then(setContent);
  }, []);

  useEffect(() => {
    function handleUpdate() {
      loadFromServer(STORAGE_KEYS.FAQ, DEFAULT_FAQ).then(setContent);
    }
    window.addEventListener('awd-faq-updated', handleUpdate);
    return () => window.removeEventListener('awd-faq-updated', handleUpdate);
  }, []);

  const faqs = content.items
    .filter((f) => f.active)
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
          gsap.from('[data-faq-header]', {
            opacity: 0,
            y: 24,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
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
    <section ref={sectionRef} id="faq" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{
          background: 'rgba(10,10,10,0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 20,
          padding: '40px 36px',
        }}>
          {/* Header */}
          <div
            data-faq-header
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: '#C6FF4A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
            }}>
              <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
              FAQ
              <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
            </div>
            <h2 style={{
              fontFamily: 'Inter Tight, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em',
            }}>
              Pertanyaan yang Sering Muncul
            </h2>
          </div>

        {/* Accordion */}
        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10,
                marginBottom: 8,
                padding: '16px 20px',
              }}
            >
              <button
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '20px 0', background: 'none', border: 'none',
                  cursor: 'pointer', gap: 16, textAlign: 'left',
                }}
              >
                <span style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 600,
                  color: '#FFFFFF',
                  transition: 'color 0.2s', lineHeight: 1.4,
                }}>
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ flexShrink: 0 }}
                >
                  <ChevronDown size={18} color={openIndex === i ? '#00C853' : 'rgba(255,255,255,0.4)'} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p style={{
                      fontFamily: 'Inter, sans-serif', fontSize: 15,
                      color: 'rgba(255,255,255,0.75)', lineHeight: 1.7,
                      paddingBottom: 20,
                    }}>
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
