import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CinematicVideo } from '../video/CinematicVideo';
import { AtmosphereOverlay } from '../cinematic/AtmosphereOverlay';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSelectionModal } from '../language/LanguageSelectionModal';
import { SupportedLanguageCode } from '../../types/language';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  PlusCircle,
  Users,
  Send,
  BarChart3,
  LogOut,
  Compass,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';

const EMPLOYER_SIDEBAR_COLLAPSED_KEY = 'udyog_employer_sidebar_collapsed';

export const EmployerLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(EMPLOYER_SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(EMPLOYER_SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const activeLang = supportedLanguages.find((l) => l.code === currentLanguage);

  const navItems = [
    { to: '/employer', label: 'Command Hub', icon: LayoutDashboard, end: true },
    { to: '/employer/company', label: 'Company Profile', icon: Building2 },
    { to: '/employer/jobs', label: 'Active Vacancies', icon: Briefcase, end: true },
    { to: '/employer/jobs/new', label: 'AI Voice Job Creator', icon: PlusCircle },
    { to: '/employer/candidates', label: 'Matched Candidates', icon: Users },
    { to: '/employer/applications', label: 'Hiring Pipeline', icon: Send },
    { to: '/employer/analytics', label: 'Hiring Metrics', icon: BarChart3 },
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

      {/* Header */}
      <header
        style={{
          position: 'relative',
          zIndex: 30,
          height: '60px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(7, 26, 58, 0.9)',
          borderBottom: '1px solid rgba(23, 74, 145, 0.45)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="employer-mobile-toggle"
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
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div
            onClick={() => navigate('/employer')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
                border: '1px solid rgba(139, 174, 219, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Compass size={18} />
            </div>

            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                UDYOG Employer Portal
              </span>
              <span style={{ marginLeft: '8px', fontSize: '0.72rem', color: 'var(--color-steel-light)', padding: '2px 6px', background: 'rgba(23, 74, 145, 0.4)', borderRadius: '4px' }}>
                RECRUITER SUITE
              </span>
            </div>
          </div>

          {/* Aisha Voice Assistant Presence Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'rgba(11, 36, 82, 0.75)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              fontSize: '0.75rem',
              color: 'var(--color-steel-light)',
            }}
          >
            <img
              src="/images/aisha.jpg"
              alt="Aisha"
              style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span>Aisha • AI Hiring Assistant</span>
          </div>
        </div>

        {/* Right Header Actions: Language & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setIsLangModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '8px',
              background: 'rgba(11, 36, 82, 0.8)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <Globe size={13} color="var(--color-steel-light)" />
            <span>{activeLang?.nativeName || 'Language'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Sign out"
            style={{
              padding: '6px',
              borderRadius: '8px',
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

      {/* Main Grid with Collapsible Sidebar */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 10, overflow: 'hidden' }}>
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="employer-backdrop"
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 35,
              display: 'none',
            }}
          />
        )}

        <aside
          className={`employer-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}
          style={{
            width: isCollapsed ? '68px' : '230px',
            background: 'rgba(7, 26, 58, 0.92)',
            borderRight: '1px solid rgba(23, 74, 145, 0.45)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px 8px',
            transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), left 0.25s ease',
            position: 'relative',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                    gap: isCollapsed ? '0' : '10px',
                    padding: isCollapsed ? '10px 0' : '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    background: isActive ? 'linear-gradient(135deg, rgba(23, 74, 145, 0.7) 0%, rgba(18, 54, 111, 0.8) 100%)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 174, 219, 0.4)' : '1px solid transparent',
                  })}
                >
                  <Icon size={18} />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Collapse / Expand Toggle Button */}
          <div
            style={{
              paddingTop: '12px',
              borderTop: '1px solid rgba(23, 74, 145, 0.3)',
              display: 'flex',
              justifyContent: isCollapsed ? 'center' : 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={toggleSidebar}
              className="desktop-collapse-btn"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(23, 74, 145, 0.3)',
                border: '1px solid rgba(139, 174, 219, 0.25)',
                color: 'var(--color-steel-light)',
                cursor: 'pointer',
              }}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>

      <LanguageSelectionModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={currentLanguage as SupportedLanguageCode}
        supportedLanguages={supportedLanguages}
        onSelectLanguage={(code) => changeLanguage(code)}
      />

      <style>{`
        @media (max-width: 768px) {
          .employer-mobile-toggle {
            display: block !important;
          }
          .employer-backdrop {
            display: block !important;
          }
          .desktop-collapse-btn {
            display: none !important;
          }
          .employer-sidebar {
            position: fixed !important;
            top: 60px !important;
            bottom: 0 !important;
            left: -260px !important;
            width: 240px !important;
            z-index: 40 !important;
          }
          .employer-sidebar.mobile-open {
            left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
