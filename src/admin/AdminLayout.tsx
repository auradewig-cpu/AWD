import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Sparkles, Tag, ListOrdered, HelpCircle, Mail,
  Globe, MessageSquare, Zap, Gift, LogOut, Menu, ChevronLeft, ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { useAdminAuth } from './AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/hero', label: 'Hero Section', icon: Sparkles },
  { to: '/admin/pricing', label: 'Paket & Harga', icon: Tag },
  { to: '/admin/process', label: 'Proses Kerja', icon: ListOrdered },
  { to: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { to: '/admin/contact', label: 'Kontak', icon: Mail },
  { to: '/admin/demo', label: 'Demo Manager', icon: Globe },
  { to: '/admin/trust', label: 'Trust Bar', icon: MessageSquare },
  { to: '/admin/why', label: 'Kenapa AWD', icon: Zap },
  { to: '/admin/promo', label: 'Promo Manager', icon: Gift },
];

const ROUTE_LABELS: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((i) => [i.to, i.label]),
);

const ADMIN_EMAIL = 'admin@awd.com';

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdminAuth();

  const sidebarWidth = collapsed ? 64 : 240;
  const currentLabel = ROUTE_LABELS[location.pathname] ?? 'Admin';

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  const sidebarContent = (showLabels: boolean) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '18px 16px',
          height: 60,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: 32, height: 32, background: '#C6FF4A', borderRadius: 6, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 14, color: '#0D0F0D' }}>A</span>
        </div>
        {showLabels && (
          <span style={{ fontFamily: 'Inter Tight, sans-serif', fontWeight: 800, fontSize: 18, color: '#FAFAFA', letterSpacing: '-0.02em' }}>
            AWD
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: showLabels ? '10px 12px' : '10px 0',
              justifyContent: showLabels ? 'flex-start' : 'center',
              borderRadius: 10,
              textDecoration: 'none',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              color: isActive ? '#C6FF4A' : 'rgba(255,255,255,0.6)',
              background: isActive ? 'rgba(198,255,74,0.1)' : 'transparent',
              transition: 'all 0.15s',
            })}
            title={!showLabels ? label : undefined}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {showLabels && label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={handleLogout}
          title={!showLabels ? 'Logout' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            padding: showLabels ? '10px 12px' : '10px 0',
            justifyContent: showLabels ? 'flex-start' : 'center',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: '#ff6b6b',
            transition: 'all 0.15s',
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {showLabels && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0D0F0D', display: 'flex' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:block"
        style={{
          width: sidebarWidth,
          flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.08)',
          background: '#0D0F0D',
          position: 'sticky',
          top: 0,
          height: '100vh',
          transition: 'width 0.2s',
        }}
      >
        {sidebarContent(!collapsed)}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: 'absolute',
            top: 70,
            right: -12,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#1a1d1a',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}
          />
          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 240,
              background: '#0D0F0D',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              zIndex: 201,
            }}
          >
            {sidebarContent(true)}
          </aside>
        </>
      )}

      {/* Main column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            height: 60,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 20px',
            background: 'rgba(13,15,13,0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FAFAFA', padding: 4 }}
          >
            <Menu size={22} />
          </button>
          <h1
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              color: '#FAFAFA',
              margin: 0,
            }}
          >
            {currentLabel}
          </h1>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              className="hidden sm:inline"
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}
            >
              {ADMIN_EMAIL}
            </span>
            <button
              onClick={handleLogout}
              title="Logout"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4 }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: 24, maxWidth: '100%', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
