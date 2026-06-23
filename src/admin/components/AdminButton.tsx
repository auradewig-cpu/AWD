import type { ReactNode, CSSProperties, ComponentType } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

interface AdminButtonProps {
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ComponentType<{ size?: number }>;
  type?: 'button' | 'submit';
}

const variantStyles: Record<Variant, CSSProperties> = {
  primary: {
    background: '#C6FF4A',
    color: '#0D0F0D',
    border: '1px solid #C6FF4A',
  },
  secondary: {
    background: 'transparent',
    color: '#FAFAFA',
    border: '1px solid rgba(255,255,255,0.18)',
  },
  danger: {
    background: 'transparent',
    color: '#ff6b6b',
    border: '1px solid rgba(212,24,61,0.4)',
  },
};

export function AdminButton({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  icon: Icon,
  type = 'button',
}: AdminButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 10,
        padding: '11px 18px',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: 'Inter, sans-serif',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
      }}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
