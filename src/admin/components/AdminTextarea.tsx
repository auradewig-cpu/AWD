import type { CSSProperties } from 'react';

interface AdminTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const textareaStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  padding: '12px 16px',
  color: '#FAFAFA',
  fontSize: 15,
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'all 0.2s',
  resize: 'vertical',
};

export function AdminTextarea({ label, value, onChange, placeholder, rows = 4 }: AdminTextareaProps) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.65)',
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={textareaStyle}
        onFocus={(e) => {
          e.target.style.borderColor = '#C6FF4A';
          e.target.style.boxShadow = '0 0 0 2px rgba(198,255,74,0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255,255,255,0.08)';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
