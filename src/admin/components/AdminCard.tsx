import type { ReactNode, CSSProperties } from 'react';

interface AdminCardProps {
  children: ReactNode;
  title?: string;
  style?: CSSProperties;
}

export function AdminCard({ children, title, style }: AdminCardProps) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: 24,
        ...style,
      }}
    >
      {title && (
        <h3
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 16,
            fontWeight: 700,
            color: '#FAFAFA',
            margin: '0 0 16px',
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
