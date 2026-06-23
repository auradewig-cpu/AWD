import { FileText, Globe, CheckCircle2, Circle } from 'lucide-react';
import { AdminCard } from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, type DemoData } from '@/admin/storage';

const CONTENT_SECTIONS: { key: string; label: string }[] = [
  { key: STORAGE_KEYS.HERO, label: 'Hero' },
  { key: STORAGE_KEYS.PRICING, label: 'Paket & Harga' },
  { key: STORAGE_KEYS.PROCESS, label: 'Proses Kerja' },
  { key: STORAGE_KEYS.FAQ, label: 'FAQ' },
  { key: STORAGE_KEYS.CONTACT, label: 'Kontak' },
  { key: STORAGE_KEYS.TRUST, label: 'Trust Bar' },
  { key: STORAGE_KEYS.WHY, label: 'Kenapa AWD' },
];

export function AdminDashboard() {
  const sectionStatus = CONTENT_SECTIONS.map((s) => ({
    label: s.label,
    custom: localStorage.getItem(s.key) !== null,
  }));
  const customCount = sectionStatus.filter((s) => s.custom).length;
  const demoCount = loadFromStorage<DemoData>(STORAGE_KEYS.DEMO, { entries: [] }).entries.length;

  return (
    <div>
      <h2
        style={{
          fontFamily: 'Inter Tight, sans-serif',
          fontSize: 24,
          fontWeight: 800,
          color: '#FAFAFA',
          margin: '0 0 6px',
        }}
      >
        Selamat datang 👋
      </h2>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>
        Ringkasan konten website AWD.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <AdminCard>
          <SummaryStat
            icon={<FileText size={20} color="#C6FF4A" />}
            value={`${customCount}/${CONTENT_SECTIONS.length}`}
            label="Section dengan konten kustom"
          />
        </AdminCard>
        <AdminCard>
          <SummaryStat
            icon={<Globe size={20} color="#4D8CFF" />}
            value={String(demoCount)}
            label="Total entri demo"
          />
        </AdminCard>
      </div>

      <AdminCard title="Status Konten">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sectionStatus.map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {s.custom ? (
                <CheckCircle2 size={16} color="#C6FF4A" />
              ) : (
                <Circle size={16} color="rgba(255,255,255,0.25)" />
              )}
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#FAFAFA' }}>{s.label}</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  color: s.custom ? '#C6FF4A' : 'rgba(255,255,255,0.4)',
                }}
              >
                {s.custom ? 'Kustom' : 'Default'}
              </span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

function SummaryStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {icon}
      <span style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 28, fontWeight: 800, color: '#FAFAFA' }}>
        {value}
      </span>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{label}</span>
    </div>
  );
}
