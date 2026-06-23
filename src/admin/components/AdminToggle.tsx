interface AdminToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function AdminToggle({ checked, onChange, label }: AdminToggleProps) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 40,
          height: 22,
          borderRadius: 999,
          background: checked ? '#C6FF4A' : 'rgba(255,255,255,0.12)',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: checked ? 22 : 4,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: checked ? '#0D0F0D' : '#FAFAFA',
            transition: 'left 0.2s',
          }}
        />
      </div>
      {label && (
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
          {label}
        </span>
      )}
    </label>
  );
}
