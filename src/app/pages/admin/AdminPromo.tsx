import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Check, Download, Search } from 'lucide-react';
import { AdminCard, AdminButton } from '@/admin/components';

interface Registrant {
  id: number;
  slot_number: string;
  promo_id: number;
  name: string;
  wa: string;
  city: string;
  package: string;
  referral_code: string;
  referred_by: string | null;
  early_bird_tier: number;
  status: string;
  created_at: string;
}

export function AdminPromo() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRegistrants = useCallback(async () => {
    try {
      const r = await fetch('/api/promo?action=registrants');
      const d = await r.json();
      if (d.registrants) setRegistrants(d.registrants);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRegistrants(); }, [fetchRegistrants]);

  async function handleVerify(slotNumber: string) {
    try {
      const r = await fetch('/api/promo?action=verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotNumber, password: 'awd123' }),
      });
      const d = await r.json();
      if (d.success) fetchRegistrants();
    } catch {}
  }

  const stats = {
    total: registrants.length,
    verified: registrants.filter(r => r.status === 'verified').length,
    pending: registrants.filter(r => r.status === 'pending').length,
    starter: registrants.filter(r => r.package === 'starter').length,
    business: registrants.filter(r => r.package === 'business').length,
  };

  const filtered = registrants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.city.toLowerCase().includes(search.toLowerCase()) ||
    r.slot_number.toLowerCase().includes(search.toLowerCase())
  );

  function exportCsv() {
    const header = 'Nama,WA,Kota,Paket,Slot,Status,Kode Referral,Tanggal\n';
    const rows = registrants.map(r =>
      `"${r.name}","${r.wa}","${r.city}","${r.package}","${r.slot_number}","${r.status}","${r.referral_code}","${new Date(r.created_at).toLocaleDateString('id-ID')}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrants-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return null;

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Daftar', value: stats.total, color: '#FAFAFA' },
          { label: 'Verified', value: stats.verified, color: '#C6FF4A' },
          { label: 'Pending', value: stats.pending, color: '#f97316' },
          { label: 'STARTER', value: stats.starter, color: '#C6FF4A' },
          { label: 'BUSINESS', value: stats.business, color: '#00C853' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: '0 0 6px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s.label}</p>
            <p style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 28, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Export */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input
            placeholder="Cari nama, kota, atau slot..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '10px 14px 10px 36px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: '#FAFAFA', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
            }}
          />
        </div>
        <AdminButton variant="secondary" icon={Download} onClick={exportCsv}>
          Export CSV
        </AdminButton>
      </div>

      {/* Table */}
      <AdminCard title={`Registrants (${filtered.length})`}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr>
                {['Slot', 'Nama', 'WA', 'Kota', 'Paket', 'Referral', 'Status', 'Tanggal', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#C6FF4A', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>{r.slot_number}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#FAFAFA', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>{r.name}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>{r.wa}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>{r.city}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: r.package === 'starter' ? '#C6FF4A' : '#00C853', background: r.package === 'starter' ? 'rgba(198,255,74,0.1)' : 'rgba(0,200,83,0.1)', borderRadius: 4, padding: '2px 8px', letterSpacing: '0.04em' }}>{r.package.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>{r.referral_code}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                    <span style={{
                      fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
                      color: r.status === 'verified' ? '#C6FF4A' : '#f97316',
                      background: r.status === 'verified' ? 'rgba(198,255,74,0.1)' : 'rgba(249,115,22,0.1)',
                      borderRadius: 999, padding: '2px 10px',
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                    {r.status === 'pending' && (
                      <button onClick={() => handleVerify(r.slot_number)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: 'rgba(198,255,74,0.1)', border: '1px solid rgba(198,255,74,0.2)',
                        color: '#C6FF4A', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600,
                        fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                      }}>
                        <Check size={12} /> Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={9} style={{ padding: 24, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Belum ada registrant</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}

export default AdminPromo;
