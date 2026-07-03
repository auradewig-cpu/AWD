export function SpeedGuaranteeBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? 4 : 6,
        background: 'rgba(198,255,74,0.1)',
        border: '1px solid rgba(198,255,74,0.25)',
        borderRadius: 999,
        padding: size === 'sm' ? '4px 10px' : '6px 14px',
        boxShadow: '0 0 12px rgba(198,255,74,0.08)',
        width: 'fit-content',
      }}
    >
      <span style={{ fontSize: size === 'sm' ? 10 : 13, lineHeight: 1 }}>⚡</span>
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: size === 'sm' ? 9 : 11,
          fontWeight: 700,
          color: '#C6FF4A',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        Lighthouse 90+ Guaranteed
      </span>
    </div>
  );
}
