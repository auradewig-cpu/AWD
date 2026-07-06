import { ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DemoEntry {
  id: string;
  tier: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  demoUrl: string;
  description: string;
  status: string;
  order: number;
}

const tierColors: Record<string, string> = {
  starter: '#C6FF4A',
  business: '#00C853',
  store: '#f97316',
  pro: '#60A5FA',
};

export function DemoShowcase() {
  const [entries, setEntries] = useState<DemoEntry[]>([]);

  useEffect(() => {
    fetch('/api/content?key=demo')
      .then(r => r.json())
      .then(d => { if (d.value?.entries) setEntries(d.value.entries.filter((e: DemoEntry) => e.status === 'active').sort((a: DemoEntry, b: DemoEntry) => a.order - b.order)); })
      .catch(() => {});
  }, []);

  if (!entries.length) return null;

  return (
    <section style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div className="px-4 sm:px-6 lg:px-8" style={{ maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
            color: '#C6FF4A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
          }}>
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
            PORTFOLIO
            <div style={{ width: 20, height: 1, background: '#C6FF4A' }} />
          </div>
          <h2 style={{
            fontFamily: 'Inter Tight, sans-serif', fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            Hasil Kerja Nyata
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Demo langsung, bisa dicoba sendiri
          </p>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-4">
          {entries.map(demo => (
            <DemoCard key={demo.id} demo={demo} />
          ))}
        </div>

        <div className="flex md:hidden gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {entries.map(demo => (
            <div key={demo.id} className="snap-start shrink-0" style={{ width: '80%', maxWidth: 320 }}>
              <DemoCard demo={demo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function optimizeCloudinary(url: string): string {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/w_600,q_60,f_webp/');
}

function DemoCard({ demo }: { demo: DemoEntry }) {
  const color = tierColors[demo.tier] || '#C6FF4A';
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      background: 'rgba(10,12,10,0.75)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{
          width: '100%', height: 180, aspectRatio: '16/9',
          background: 'linear-gradient(135deg, rgba(198,255,74,0.05), rgba(0,0,0,0.4))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {!imgError && demo.thumbnailUrl && (
            <img
              src={optimizeCloudinary(demo.thumbnailUrl)}
              alt={demo.name}
              loading="lazy"
              onError={() => setImgError(true)}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'top',
              }}
            />
          )}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 4,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(198,255,74,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
              Preview
            </span>
          </div>
        </div>
      </a>

      <div style={{ padding: '16px 16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700,
            color, background: `${color}15`, borderRadius: 4, padding: '2px 8px',
            letterSpacing: '0.05em',
          }}>
            {demo.tier.toUpperCase()}
          </span>
        </div>
        <h3 style={{
          fontFamily: 'Inter Tight, sans-serif', fontSize: 17, fontWeight: 700,
          color: '#FAFAFA', margin: '0 0 4px', letterSpacing: '-0.01em',
        }}>
          {demo.name}
        </h3>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)',
          margin: '0 0 16px', lineHeight: 1.4, flex: 1,
        }}>
          {demo.description}
        </p>
        <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color, fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
          textDecoration: 'none', alignSelf: 'flex-start',
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          Lihat Demo <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
