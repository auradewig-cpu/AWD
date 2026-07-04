import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Check, Download, Search, Plus, Trash2, RotateCcw, AlertTriangle, X } from 'lucide-react';
import { AdminCard, AdminButton } from '@/admin/components';

interface Registrant {
  id: number; slot_number: string; promo_id: number; name: string; wa: string;
  city: string; package: string; referral_code: string; referred_by: string | null;
  early_bird_tier: number; status: string; created_at: string;
}

interface PromoRow {
  id: number; name: string; package: string; quota: number;
  deadline: string; active: boolean; bonus_tiers: any;
}

const STATUSES = ['pending', 'verified', 'completed', 'rejected'];
const STATUS_COLORS: Record<string, string> = {
  pending: '#f97316', verified: '#C6FF4A', completed: '#00C853', rejected: '#EF4444',
};

export function AdminPromo() {
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [promos, setPromos] = useState<PromoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [confirmReset, setConfirmReset] = useState<number | null>(null);

  const [form, setForm] = useState({ name: '', package: 'starter', quota: 50, deadline: '' });
  const [editPromo, setEditPromo] = useState<PromoRow | null>(null);
  const [editQuota, setEditQuota] = useState(0);
  const [editDeadline, setEditDeadline] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [bonusTiers, setBonusTiers] = useState<Array<{min:number;max:number;bonus:string}>>([]);
  const [promoPrice, setPromoPrice] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/promo?action=registrants').then(r => r.json()),
        fetch('/api/promo?action=promos').then(r => r.json()),
      ]);
      if (r1.registrants) setRegistrants(r1.registrants);
      if (r2.promos) setPromos(r2.promos);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function api(action: string, body: any) {
    const r = await fetch(`/api/promo?action=${action}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, password: 'awd123' }),
    });
    const d = await r.json();
    if (d.success) fetchAll();
    return d;
  }

  async function handleCreate() {
    if (!form.name || !form.deadline) return;
    await api('create', { name: form.name, package: form.package, quota: form.quota, deadline: form.deadline });
    setShowCreate(false);
    setForm({ name: '', package: 'starter', quota: 50, deadline: '' });
  }

  function openEdit(promo: PromoRow) {
    setEditPromo(promo);
    setEditQuota(promo.quota);
    setEditDeadline(promo.deadline.slice(0, 16));
    setEditActive(promo.active);
    setBonusTiers(promo.bonus_tiers?.tiers?.map((t: any) => ({ ...t })) || []);
    setPromoPrice((promo as any).promo_price || '');
  }

  function updateTier(i: number, key: 'min' | 'max' | 'bonus', val: any) {
    const t = [...bonusTiers]; t[i] = { ...t[i], [key]: key === 'bonus' ? val : +val }; setBonusTiers(t);
  }

  function addTier() { setBonusTiers([...bonusTiers, { min: 0, max: 0, bonus: '' }]); }

  function removeTier(i: number) { setBonusTiers(bonusTiers.filter((_, idx) => idx !== i)); }

  async function saveEdit() {
    if (!editPromo) return;
    await api('update', {
      id: editPromo.id, quota: editQuota, deadline: editDeadline, active: editActive,
      bonus_tiers: { tiers: bonusTiers },
      promo_price: promoPrice,
    });
    setEditPromo(null);
  }

  function handleDeletePromo(id: number) {
    if (!confirm('Hapus promo ini dan semua pendaftarnya?')) return;
    api('delete', { id });
  }

  function handleResetRegistrants(promoId: number) {
    api('reset-registrants', { promoId });
    setConfirmReset(null);
  }

  function handleDeleteRegistrant(id: number) {
    if (!confirm('Hapus pendaftar ini?')) return;
    api('delete-registrant', { id });
  }

  function handleUpdateStatus(id: number, status: string) {
    api('update-status', { id, status });
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
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `registrants-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
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

      {/* Search + Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input placeholder="Cari nama, kota, atau slot..." value={search} onChange={e => setSearch(e.target.value)} style={{
            width: '100%', boxSizing: 'border-box', padding: '10px 14px 10px 36px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, color: '#FAFAFA', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
          }} />
        </div>
        <AdminButton variant="secondary" icon={Plus} onClick={() => setShowCreate(true)}>Buat Promo</AdminButton>
        <AdminButton variant="secondary" icon={Download} onClick={exportCsv}>Export CSV</AdminButton>
      </div>

      {/* Create Promo Form */}
      {showCreate && (
        <AdminCard title="Buat Promo Baru">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input placeholder="Nama Promo" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{
              padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: '#FAFAFA', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
            }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <select value={form.package} onChange={e => setForm(f => ({ ...f, package: e.target.value }))} style={{
                flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, color: '#FAFAFA', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
              }}>
                <option value="starter">STARTER</option>
                <option value="business">BUSINESS</option>
              </select>
              <input type="number" placeholder="Kuota" value={form.quota} onChange={e => setForm(f => ({ ...f, quota: parseInt(e.target.value) || 0 }))} style={{
                flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, color: '#FAFAFA', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
              }} />
            </div>
            <input type="datetime-local" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} style={{
              padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, color: '#FAFAFA', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
            }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <AdminButton variant="primary" icon={Check} onClick={handleCreate}>Simpan</AdminButton>
              <AdminButton variant="secondary" onClick={() => setShowCreate(false)}>Batal</AdminButton>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Promo List */}
      {promos.length > 0 && (
        <AdminCard title={`Promo Aktif (${promos.filter(p => p.active).length})`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {promos.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700, color: p.active ? '#C6FF4A' : 'rgba(255,255,255,0.3)', flex: 1, minWidth: 120 }}>{p.name} ({p.package})</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Kuota: {p.quota}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{new Date(p.deadline).toLocaleDateString('id-ID')}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => openEdit(p)} title="Edit" style={{ padding: '4px 8px', background: 'rgba(198,255,74,0.1)', border: '1px solid rgba(198,255,74,0.2)', color: '#C6FF4A', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'Inter, sans-serif' }}>Edit</button>
                  <button onClick={() => setConfirmReset(p.id)} title="Reset registrants" style={{ padding: '4px 8px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#f97316', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'Inter, sans-serif' }}><RotateCcw size={12} /></button>
                  <button onClick={() => handleDeletePromo(p.id)} title="Hapus" style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: 'Inter, sans-serif' }}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Confirm Reset */}
      {confirmReset !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#1a1d1a', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16, padding: '24px', maxWidth: 400, textAlign: 'center' }}>
            <AlertTriangle size={32} color="#EF4444" style={{ marginBottom: 12 }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#FAFAFA', margin: '0 0 16px' }}>Hapus semua pendaftar promo ini? Tindakan ini tidak bisa dibatalkan.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => handleResetRegistrants(confirmReset)} style={{ background: '#EF4444', color: '#FAFAFA', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', fontSize: 13 }}>Ya, Reset</button>
              <button onClick={() => setConfirmReset(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: 8, padding: '10px 20px', fontFamily: 'Inter, sans-serif', cursor: 'pointer', fontSize: 13 }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Promo Modal */}
      {editPromo && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#1a1d1a', border: '1px solid rgba(198,255,74,0.2)', borderRadius: 16, padding: '28px', maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 18, fontWeight: 700, color: '#FAFAFA', margin: 0 }}>Edit Promo: {editPromo.name}</h3>
              <button onClick={() => setEditPromo(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'block' }}>Kuota</label>
                  <input type="number" value={editQuota} onChange={e => setEditQuota(+e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FAFAFA', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'block' }}>Deadline</label>
                  <input type="datetime-local" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FAFAFA', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, display: 'block' }}>Harga Promo</label>
                <input value={promoPrice} onChange={e => setPromoPrice(e.target.value)} placeholder="contoh: Rp 1.500.000" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#FAFAFA', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                <input type="checkbox" checked={editActive} onChange={e => setEditActive(e.target.checked)} style={{ accentColor: '#C6FF4A' }} />
                Aktif
              </label>
              <div>
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, display: 'block' }}>Early Bird Bonus Tiers</label>
                {bonusTiers.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input placeholder="Min slot" value={t.min} onChange={e => updateTier(i, 'min', e.target.value)} style={{ width: 70, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FAFAFA', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                    <input placeholder="Max slot" value={t.max} onChange={e => updateTier(i, 'max', e.target.value)} style={{ width: 70, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FAFAFA', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                    <input placeholder="Bonus description" value={t.bonus} onChange={e => updateTier(i, 'bonus', e.target.value)} style={{ flex: 1, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FAFAFA', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                    <button onClick={() => removeTier(i)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: 8, cursor: 'pointer', padding: '8px 10px', fontSize: 13 }}>✕</button>
                  </div>
                ))}
                <button onClick={addTier} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'transparent', border: '1px solid rgba(198,255,74,0.2)', color: '#C6FF4A', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>+ Tambah Tier</button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={saveEdit} style={{ background: '#C6FF4A', color: '#07080A', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>Simpan</button>
                <button onClick={() => setEditPromo(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>Batal</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registrants Table */}
      <AdminCard title={`Registrants (${filtered.length})`}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
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
                    <select value={r.status} onChange={e => handleUpdateStatus(r.id, e.target.value)} style={{
                      fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600,
                      color: STATUS_COLORS[r.status] || '#FAFAFA', background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 8px',
                      cursor: 'pointer', outline: 'none',
                    }}>
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {r.status === 'pending' && (
                        <button onClick={() => api('verify', { slotNumber: r.slot_number })} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          background: 'rgba(198,255,74,0.1)', border: '1px solid rgba(198,255,74,0.2)',
                          color: '#C6FF4A', borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600,
                          fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                        }}><Check size={12} /></button>
                      )}
                      <button onClick={() => handleDeleteRegistrant(r.id)} style={{
                        display: 'inline-flex', alignItems: 'center',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#EF4444', borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
                      }}><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={9} style={{ padding: 24, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Belum ada registrant</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}

export default AdminPromo;
