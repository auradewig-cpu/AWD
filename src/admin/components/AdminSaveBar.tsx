import { Save, RotateCcw } from 'lucide-react';
import { AdminButton } from './AdminButton';

interface AdminSaveBarProps {
  onSave: () => void;
  onReset?: () => void;
  dirty: boolean;
  saved: boolean;
}

export function AdminSaveBar({ onSave, onReset, dirty, saved }: AdminSaveBarProps) {
  let statusLabel: { text: string; color: string } | null = null;
  if (saved) statusLabel = { text: 'Tersimpan ✓', color: '#C6FF4A' };
  else if (dirty) statusLabel = { text: 'Perubahan belum disimpan', color: '#FFD147' };

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        marginTop: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 14,
        background: 'rgba(13,15,13,0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 0',
      }}
    >
      {statusLabel && (
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: statusLabel.color,
            marginRight: 'auto',
          }}
        >
          {statusLabel.text}
        </span>
      )}
      {onReset && (
        <AdminButton variant="danger" onClick={onReset} icon={RotateCcw}>
          Reset ke Default
        </AdminButton>
      )}
      <AdminButton variant="primary" onClick={onSave} disabled={!dirty} icon={Save}>
        Simpan Perubahan
      </AdminButton>
    </div>
  );
}
