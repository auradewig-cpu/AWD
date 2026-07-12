import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAdminAuth } from '@/admin/AuthContext';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        navigate('/admin/dashboard');
      } else {
        setError('Email atau password tidak cocok.');
        setLoading(false);
      }
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.');
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, padding: '12px 16px',
    color: '#FAFAFA', fontSize: 15, fontFamily: 'Inter, sans-serif',
    outline: 'none', transition: 'all 0.2s',
  };

  return (
    <div style={{
      background: '#07080A', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '20%', left: '30%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(77,140,255,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '20%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(198,255,74,0.04) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: '40px 36px',
          width: '100%', maxWidth: 420,
          position: 'relative', zIndex: 1,
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: '#C6FF4A', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 16, color: '#07080A' }}>A</span>
            </div>
            <span style={{ fontFamily: 'Inter Tight, sans-serif', fontWeight: 800, fontSize: 20, color: '#FAFAFA', letterSpacing: '-0.02em' }}>AWD</span>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Dashboard Admin Internal
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label htmlFor="admin-email" style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@awd.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = '#C6FF4A'; e.target.style.boxShadow = '0 0 0 2px rgba(198,255,74,0.15)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label htmlFor="admin-password" style={{ display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 48 }}
                onFocus={e => { e.target.style.borderColor = '#C6FF4A'; e.target.style.boxShadow = '0 0 0 2px rgba(198,255,74,0.15)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div
              onClick={() => setRemember(!remember)}
              style={{
                width: 18, height: 18, borderRadius: 4,
                border: `1px solid ${remember ? '#C6FF4A' : 'rgba(255,255,255,0.15)'}`,
                background: remember ? '#C6FF4A' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              {remember && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="#07080A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
              Ingat saya
            </span>
          </label>

          {error && (
            <div style={{
              background: 'rgba(212,24,61,0.1)', border: '1px solid rgba(212,24,61,0.2)',
              borderRadius: 8, padding: '10px 14px',
              fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#ff6b6b',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#C6FF4A', color: '#07080A',
              borderRadius: 10, padding: '14px',
              fontSize: 15, fontWeight: 700, fontFamily: 'Inter, sans-serif',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
            }}
          >
            <LogIn size={17} />
            {loading ? 'Memverifikasi...' : 'Masuk →'}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 16, textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.7 }}>
            Akses terbatas — hubungi admin untuk kredensial.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
