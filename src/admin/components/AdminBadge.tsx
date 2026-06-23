type Status = 'aktif' | 'nonaktif' | 'draft';

interface AdminBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, { bg: string; border: string; color: string; label: string }> = {
  aktif: { bg: 'rgba(198,255,74,0.12)', border: 'rgba(198,255,74,0.3)', color: '#C6FF4A', label: 'Aktif' },
  nonaktif: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', label: 'Nonaktif' },
  draft: { bg: 'rgba(255,209,71,0.12)', border: 'rgba(255,209,71,0.3)', color: '#FFD147', label: 'Draft' },
};

export function AdminBadge({ status }: AdminBadgeProps) {
  const s = statusStyles[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        borderRadius: 999,
        padding: '3px 10px',
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'JetBrains Mono, monospace',
        letterSpacing: '0.02em',
      }}
    >
      {s.label}
    </span>
  );
}
