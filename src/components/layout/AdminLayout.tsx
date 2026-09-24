import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CinematicVideo } from '../video/CinematicVideo';
import { AtmosphereOverlay } from '../cinematic/AtmosphereOverlay';
import { useAuth } from '../../hooks/useAuth';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  Sparkles,
  BookOpen,
  Building2,
  Briefcase,
  Send,
  HelpCircle,
  Globe,
  BarChart2,
  FileText,
  Activity,
  LogOut,
  Compass,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const ADMIN_SIDEBAR_COLLAPSED_KEY = 'udyog_admin_sidebar_collapsed';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(ADMIN_SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const navItems = [
    { to: '/admin', label: 'Command Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/beneficiaries', label: 'Beneficiary Intelligence', icon: Users },
    { to: '/admin/skills', label: 'Skill Taxonomy & Audit', icon: Sparkles },
    { to: '/admin/occupations', label: 'NCO-2015 Benchmarks', icon: Compass },
    { to: '/admin/training', label: 'Training Intelligence', icon: BookOpen },
    { to: '/admin/employers', label: 'Employer Oversight', icon: Building2 },
    { to: '/admin/jobs', label: 'Job Moderation', icon: Briefcase },
    { to: '/admin/applications', label: 'Hiring Conversion', icon: Send },
    { to: '/admin/complaints', label: 'Complaint Resolution', icon: HelpCircle },
    { to: '/admin/languages', label: '22 Indic Languages', icon: Globe },
    { to: '/admin/analytics', label: 'Regional Skill Maps', icon: BarChart2 },
    { to: '/admin/audit', label: 'Immutable Audit Log', icon: FileText },
    { to: '/admin/system', label: 'System Health & AI', icon: Activity },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <CinematicVideo />
      <AtmosphereOverlay />

      {/* Top Admin Header */}
      <header
        style={{
          position: 'relative',
          zIndex: 30,
          height: '56px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(7, 26, 58, 0.95)',
          borderBottom: '1px solid rgba(23, 74, 145, 0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="admin-mobile-toggle"
            aria-label="Toggle mobile menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'none',
              padding: '4px',
            }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #E53E3E 0%, #9B2C2C 100%)',
              border: '1px solid rgba(254, 178, 178, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <ShieldAlert size={18} />
          </div>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF' }}>
              Platform Command Center
            </span>
            <span
              style={{
                marginLeft: '8px',
                fontSize: '0.68rem',
                color: '#6EE7B7',
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(110, 231, 183, 0.3)',
              }}
            >
              RESTRICTED ACCESS
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Sign out"
            style={{
              padding: '6px',
              borderRadius: '6px',
              background: 'rgba(11, 36, 82, 0.8)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Main Admin Split Panel */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 10, overflow: 'hidden' }}>
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="admin-backdrop"
            style={{
              position: 'fixed',
              top: '56px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.65)',
              zIndex: 35,
              display: 'none',
            }}
          />
        )}
        <aside
          className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}
          style={{
            width: isCollapsed ? '64px' : '240px',
            background: 'rgba(7, 26, 58, 0.95)',
            borderRight: '1px solid rgba(23, 74, 145, 0.45)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            padding: isCollapsed ? '14px 6px' : '14px 10px',
            overflowY: 'auto',
            transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), left 0.25s ease',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  title={isCollapsed ? item.label : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: isCollapsed ? 0 : '10px',
                    padding: isCollapsed ? '9px 0' : '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    background: isActive ? 'linear-gradient(135deg, rgba(23, 74, 145, 0.8) 0%, rgba(18, 54, 111, 0.9) 100%)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 174, 219, 0.4)' : '1px solid transparent',
                  })}
                >
                  <Icon size={15} />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Collapse / Expand Toggle Button */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '12px',
              borderTop: '1px solid rgba(23, 74, 145, 0.3)',
              display: 'flex',
              justifyContent: isCollapsed ? 'center' : 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={toggleSidebar}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '6px',
                background: 'rgba(11, 36, 82, 0.7)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                color: 'var(--color-steel-light)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-mobile-toggle {
            display: block !important;
          }
          .admin-backdrop {
            display: block !important;
          }
          .admin-sidebar {
            position: fixed !important;
            top: 56px !important;
            bottom: 0 !important;
            left: -250px !important;
            z-index: 40 !important;
          }
          .admin-sidebar.mobile-open {
            left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
