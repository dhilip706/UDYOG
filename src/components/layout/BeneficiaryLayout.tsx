import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CinematicVideo } from '../video/CinematicVideo';
import { AtmosphereOverlay } from '../cinematic/AtmosphereOverlay';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSelectionModal } from '../language/LanguageSelectionModal';
import { SupportedLanguageCode } from '../../types/language';
import { voiceService } from '../../services/voice/voiceService';
import {
  Compass,
  User,
  Sparkles,
  Award,
  BookOpen,
  TrendingUp,
  Briefcase,
  Send,
  HelpCircle,
  LogOut,
  Globe,
  Menu,
  X,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const BENEFICIARY_SIDEBAR_COLLAPSED_KEY = 'udyog_beneficiary_sidebar_collapsed';

export const BeneficiaryLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentLanguage, t, changeLanguage, supportedLanguages } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(BENEFICIARY_SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(BENEFICIARY_SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {}
      return next;
    });
  };

  const activeLang = supportedLanguages.find((l) => l.code === currentLanguage);

  const navItems = [
    { to: '/profile', label: t.nav.profile || 'My Profile', icon: User },
    { to: '/skills', label: t.nav.skills || 'My Skills', icon: Sparkles },
    { to: '/career', label: t.nav.career || 'Livelihood Plan', icon: TrendingUp },
    { to: '/learning', label: t.nav.learning || 'Learning Path', icon: BookOpen },
    { to: '/assessment', label: t.nav.assessment || 'Assessment', icon: Award },
    { to: '/opportunities', label: t.nav.opportunities || 'Opportunities', icon: Briefcase },
    { to: '/applications', label: t.nav.applications || 'Applications', icon: Send },
    { to: '/help', label: t.nav.help || 'Help & Grievance', icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

      {/* Top Header */}
      <header
        style={{
          position: 'relative',
          zIndex: 30,
          height: '60px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(7, 26, 58, 0.85)',
          borderBottom: '1px solid rgba(23, 74, 145, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-nav-toggle"
            aria-label="Toggle navigation menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'none',
            }}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div
            onClick={() => navigate('/career')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
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
            <span
              style={{
                fontSize: '1.05rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
              }}
            >
              UDYOG
            </span>
          </div>

          {/* Active Aisha Presence Badge */}
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
            <span>Aisha</span>
          </div>
        </div>

        {/* Right Header Actions */}
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
              const next = !isMuted;
              setIsMuted(next);
              voiceService.setMuted(next);
            }}
            title={isMuted ? 'Unmute voice' : 'Mute voice'}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'rgba(11, 36, 82, 0.8)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-steel-light)',
              cursor: 'pointer',
            }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title={t.nav.signOut || 'Sign out'}
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

      {/* Main Body with Sidebar & Content */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', zIndex: 10, overflow: 'hidden' }}>
        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 45,
            }}
          />
        )}

        {/* Collapsible Navigation Sidebar */}
        <aside
          className={`beneficiary-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}
          style={{
            width: isCollapsed ? '68px' : '220px',
            background: 'rgba(7, 26, 58, 0.88)',
            borderRight: '1px solid rgba(23, 74, 145, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
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
                  title={isCollapsed ? item.label : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `ben-nav-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    gap: isCollapsed ? 0 : '10px',
                    padding: isCollapsed ? '10px 0' : '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    background: isActive ? 'linear-gradient(135deg, rgba(23, 74, 145, 0.7) 0%, rgba(18, 54, 111, 0.8) 100%)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 174, 219, 0.4)' : '1px solid transparent',
                    transition: 'all 0.18s ease',
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

        {/* Dynamic Nested Content Area */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            position: 'relative',
          }}
        >
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
          .mobile-nav-toggle {
            display: block !important;
          }
          .desktop-collapse-btn {
            display: none !important;
          }
          .beneficiary-sidebar {
            position: fixed !important;
            top: 60px !important;
            bottom: 0 !important;
            left: -240px !important;
            width: 240px !important;
            z-index: 50 !important;
          }
          .beneficiary-sidebar.mobile-open {
            left: 0 !important;
          }
        }
        .ben-nav-link:hover:not(.active) {
          background: rgba(23, 74, 145, 0.25) !important;
          color: #FFFFFF !important;
        }
      `}</style>
    </div>
  );
};
