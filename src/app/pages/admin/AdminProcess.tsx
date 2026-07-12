import { useState } from 'react';
import { ExternalLink, Plus, ChevronUp, ChevronDown, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { AdminCard, AdminInput, AdminTextarea, AdminButton, AdminToggle, AdminSaveBar } from '@/admin/components';
import { STORAGE_KEYS, loadFromStorage, saveToStorage, saveToServer, resetStorage, type ProcessContent, type ProcessStep } from '@/admin/storage';
import { DEFAULT_PROCESS, PROCESS_ICON_MAP } from '@/app/components/sections/ProcessSteps';

const ICON_NAMES = Object.keys(PROCESS_ICON_MAP);

function withSequentialOrder(steps: ProcessStep[]): ProcessStep[] {
  return steps.map((s, i) => ({ ...s, order: i + 1 }));
}

export function AdminProcess() {
  const [steps, setSteps] = useState<ProcessStep[]>(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.PROCESS, DEFAULT_PROCESS);
    return loaded.steps.slice().sort((a, b) => a.order - b.order);
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function markDirty() {
    setDirty(true);
    setSaved(false);
    setSaveError(null);
  }

  function updateStep(id: string, patch: Partial<ProcessStep>) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    markDirty();
  }

  function move(index: number, dir: -1 | 1) {
    setSteps((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = prev.slice();
      [next[index], next[target]] = [next[target], next[index]];
      return withSequentialOrder(next);
    });
    markDirty();
  }

  function remove(id: string) {
    setSteps((prev) => withSequentialOrder(prev.filter((s) => s.id !== id)));
    markDirty();
  }

  function addStep() {
    setSteps((prev) => {
      const next: ProcessStep = {
        id: `step-${Date.now()}`,
        order: prev.length + 1,
        icon: 'MessageSquare',
        title: 'Langkah Baru',
        badgeLabel: '',
        description: '',
        active: true,
      };
      return [...prev, next];
    });
    markDirty();
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const content: ProcessContent = { steps: withSequentialOrder(steps) };
    const ok = await saveToServer(STORAGE_KEYS.PROCESS, content);
    if (ok) {
      saveToStorage(STORAGE_KEYS.PROCESS, content);
      window.dispatchEvent(new Event('awd-process-updated'));
      setDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setSaveError('Gagal menyimpan ke server. Periksa koneksi atau coba lagi.');
    }
    setSaving(false);
  }

  function handleReset() {
    resetStorage(STORAGE_KEYS.PROCESS);
    setSteps(DEFAULT_PROCESS.steps.slice().sort((a, b) => a.order - b.order));
    setDirty(false);
    setSaved(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'Inter Tight, sans-serif', fontSize: 22, fontWeight: 800, color: '#FAFAFA', margin: 0 }}>
          Proses Kerja
        </h2>
        <AdminButton variant="secondary" icon={ExternalLink} onClick={() => window.open('/#/', '_blank')}>
          Lihat di Homepage
        </AdminButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {steps.map((step, index) => {
          const open = openId === step.id;
          return (
            <div key={step.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px' }}>
                <button
                  onClick={() => setOpenId(open ? null : step.id)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, color: step.active ? '#FAFAFA' : 'rgba(255,255,255,0.4)' }}>
                    {step.title || '(tanpa judul)'}
                  </span>
                </button>
                <button onClick={() => move(index, -1)} disabled={index === 0} aria-label="Naik" style={iconBtn(index === 0)}>
                  <ArrowUp size={15} />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === steps.length - 1} aria-label="Turun" style={iconBtn(index === steps.length - 1)}>
                  <ArrowDown size={15} />
                </button>
                <button onClick={() => remove(step.id)} aria-label="Hapus" style={dangerBtn}>
                  <Trash2 size={15} />
                </button>
                <button onClick={() => setOpenId(open ? null : step.id)} aria-label="Buka" style={iconBtn(false)}>
                  {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {open && (
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>
                      Ikon
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {ICON_NAMES.map((name) => {
                        const Icon = PROCESS_ICON_MAP[name];
                        const selected = step.icon === name;
                        return (
                          <button
                            key={name}
                            onClick={() => updateStep(step.id, { icon: name })}
                            title={name}
                            style={{
                              width: 40, height: 40, borderRadius: 10, cursor: 'pointer',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              background: selected ? 'rgba(198,255,74,0.15)' : 'rgba(255,255,255,0.04)',
                              border: selected ? '1px solid #C6FF4A' : '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <Icon size={18} color={selected ? '#C6FF4A' : 'rgba(255,255,255,0.6)'} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <AdminInput label="Judul" value={step.title} onChange={(v) => updateStep(step.id, { title: v })} />
                  <AdminInput label="Badge / Subtitle" value={step.badgeLabel} onChange={(v) => updateStep(step.id, { badgeLabel: v })} />
                  <AdminTextarea label="Deskripsi" value={step.description} onChange={(v) => updateStep(step.id, { description: v })} rows={3} />
                  <AdminToggle checked={step.active} onChange={(v) => updateStep(step.id, { active: v })} label="Aktif (tampilkan di homepage)" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <AdminButton variant="secondary" icon={Plus} onClick={addStep}>
          Tambah Step
        </AdminButton>
      </div>

      {saveError && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#ff6b6b', textAlign: 'right', margin: '8px 0 0' }}>
          {saveError}
        </p>
      )}
      <AdminSaveBar dirty={dirty} saved={saved} onSave={handleSave} onReset={handleReset} />
      {saving && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'right', margin: '8px 0 0' }}>
          Menyimpan...
        </p>
      )}
    </div>
  );
}

function iconBtn(disabled: boolean): React.CSSProperties {
  return {
    flexShrink: 0, width: 32, height: 32, borderRadius: 8,
    background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.7)', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  };
}

const dangerBtn: React.CSSProperties = {
  flexShrink: 0, width: 32, height: 32, borderRadius: 8,
  background: 'transparent', border: '1px solid rgba(212,24,61,0.4)',
  color: '#ff6b6b', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
};
export default AdminProcess;
