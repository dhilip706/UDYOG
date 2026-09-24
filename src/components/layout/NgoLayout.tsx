import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { CinematicVideo } from '../video/CinematicVideo';
import { AtmosphereOverlay } from '../cinematic/AtmosphereOverlay';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { NgoAIAssistantDrawer } from '../ngo/NgoAIAssistantDrawer';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserPlus,
  Cpu,
  TrendingUp,
  Award,
  GraduationCap,
  BookOpen,
  Briefcase,
  Building2,
  GitCompare,
  FileCheck,
  BarChart3,
  CalendarDays,
  FolderHeart,
  HelpCircle,
  FileSpreadsheet,
  Building,
  Settings,
  Bot,
  LogOut,
  Globe,
  Menu,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const NGO_SIDEBAR_COLLAPSED_KEY = 'udyog_ngo_sidebar_collapsed';

interface NavItemDef {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  end?: boolean;
}

interface NavGroupDef {
  id: string;
  items: NavItemDef[];
}

export const NgoLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(NGO_SIDEBAR_COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(NGO_SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {}
      return next;
    });
  };

  // Dynamic Browser Tab Title: Strictly maintain "NGO’s Team" (Requirement 1 & 7)
  useEffect(() => {
    document.title = "NGO’s Team";
  }, [location.pathname]);

  // Exact 19 items across the 9 groups specified in Requirement 6
  const navGroups: NavGroupDef[] = [
    {
      id: 'overview',
      items: [
        { to: '/ngo', label: 'Overview', icon: LayoutDashboard, end: true },
      ],
    },
    {
      id: 'community-group',
      items: [
        { to: '/ngo/community', label: 'Community', icon: Users },
        { to: '/ngo/beneficiaries', label: 'Beneficiaries', icon: UserCheck },
        { to: '/ngo/onboarding', label: 'Onboarding', icon: UserPlus },
      ],
    },
    {
      id: 'skills-group',
      items: [
        { to: '/ngo/skills', label: 'Skills', icon: Cpu },
        { to: '/ngo/skill-gaps', label: 'Skill Gaps', icon: TrendingUp },
        { to: '/ngo/assessments', label: 'Assessments', icon: Award },
      ],
    },
    {
      id: 'training-group',
      items: [
        { to: '/ngo/training', label: 'Training', icon: GraduationCap, end: true },
        { to: '/ngo/training-programs', label: 'Training Programs', icon: BookOpen },
      ],
    },
    {
      id: 'opportunity-group',
      items: [
        { to: '/ngo/opportunities', label: 'Opportunities', icon: Briefcase },
        { to: '/ngo/employers', label: 'Employers', icon: Building2 },
        { to: '/ngo/matching', label: 'AI Matching', icon: GitCompare },
      ],
    },
    {
      id: 'applications-group',
      items: [
        { to: '/ngo/applications', label: 'Applications', icon: FileCheck },
        { to: '/ngo/outcomes', label: 'Employment Outcomes', icon: BarChart3 },
      ],
    },
    {
      id: 'programs-group',
      items: [
        { to: '/ngo/programs', label: 'Community Programs', icon: CalendarDays },
        { to: '/ngo/cases', label: 'Case Management', icon: FolderHeart },
        { to: '/ngo/complaints', label: 'Help & Complaints', icon: HelpCircle },
      ],
    },
    {
      id: 'reports-group',
      items: [
        { to: '/ngo/reports', label: 'Reports & Analytics', icon: FileSpreadsheet },
      ],
    },
    {
      id: 'settings-group',
      items: [
        { to: '/ngo/organization', label: 'Organization', icon: Building },
        { to: '/ngo/settings', label: 'Settings', icon: Settings },
      ],
    },
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

      {/* Top Header */}
      <header
        style={{
          position: 'relative',
          zIndex: 40,
          height: '62px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(7, 26, 58, 0.94)',
          borderBottom: '1px solid rgba(23, 74, 145, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Brand & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="ngo-mobile-toggle"
            aria-label="Toggle Navigation Menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              display: 'none',
              padding: '6px',
            }}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                NGO’s Team
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: 'var(--color-steel-light)',
                  padding: '2px 8px',
                  background: 'rgba(23, 74, 145, 0.45)',
                  border: '1px solid rgba(139, 174, 219, 0.3)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <CheckCircle2 size={11} color="#8BAEDB" />
                <span>COMMUNITY OPERATIONS</span>
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)' }}>
              Grama Seva Community Mission • Salem & Coimbatore Hub
            </div>
          </div>
        </div>

        {/* Right Controls: Language Selector, AI Assistant, Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Demo Data Tag */}
          <div
            className="ngo-demo-badge"
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              fontSize: '0.7rem',
              color: '#FDE047',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            DEMO DATA
          </div>

          {/* 22-Language Selector */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: '8px',
                background: 'rgba(11, 36, 82, 0.8)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                fontSize: '0.8rem',
                color: 'var(--color-steel-light)',
              }}
            >
              <Globe size={15} />
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value as any, 'user')}
                aria-label="Select Language"
                style={{
                  background: 'transparent',
                  color: '#FFFFFF',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                }}
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code} style={{ background: '#0B2452', color: '#FFFFFF' }}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Assistant Trigger Button */}
          <button
            type="button"
            onClick={() => setIsAssistantOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(23, 74, 145, 0.7) 0%, rgba(30, 93, 183, 0.7) 100%)',
              border: '1px solid rgba(139, 174, 219, 0.45)',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Bot size={16} color="#8BAEDB" />
            <span className="ngo-asst-label">AI Assistant</span>
          </button>

          {/* Sign Out */}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Sign out"
            style={{
              padding: '8px',
              borderRadius: '8px',
              background: 'rgba(11, 36, 82, 0.8)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
            aria-label="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Body: Permanent Desktop Left Sidebar + Content Outlet */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Desktop Sidebar Navigation */}
        <aside
          className="ngo-desktop-sidebar"
          style={{
            width: isCollapsed ? '68px' : '240px',
            flexShrink: 0,
            background: 'rgba(7, 26, 58, 0.92)',
            borderRight: '1px solid rgba(23, 74, 145, 0.45)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: isCollapsed ? '12px 6px 16px' : '12px 10px 24px',
            transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Sidebar Top Branding Header (Requirement 2, 3 & 4) */}
          <div
            style={{
              padding: isCollapsed ? '10px 4px 14px' : '10px 12px 14px',
              borderBottom: '1px solid rgba(23, 74, 145, 0.4)',
              marginBottom: '10px',
              textAlign: isCollapsed ? 'center' : 'left',
            }}
          >
            {isCollapsed ? (
              <div
                title="NGO’s Team — Community Workspace"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em',
                }}
              >
                NGO
              </div>
            ) : (
              <>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                  NGO’s Team
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)', marginTop: '3px' }}>
                  Community Workspace
                </div>
              </>
            )}
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
            {navGroups.map((group, groupIdx) => (
              <React.Fragment key={group.id}>
                {groupIdx > 0 && (
                  <hr
                    style={{
                      border: 'none',
                      borderTop: '1px solid rgba(23, 74, 145, 0.35)',
                      margin: '6px 8px',
                    }}
                  />
                )}
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    title={isCollapsed ? item.label : undefined}
                    className={({ isActive }) => `ngo-nav-link ${isActive ? 'active' : ''}`}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      gap: isCollapsed ? 0 : '10px',
                      padding: isCollapsed ? '9px 0' : '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(23, 74, 145, 0.7) 0%, rgba(18, 54, 111, 0.8) 100%)'
                        : 'transparent',
                      border: isActive ? '1px solid rgba(139, 174, 219, 0.35)' : '1px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.18s ease',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    })}
                  >
                    <item.icon size={16} color="currentColor" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                ))}
              </React.Fragment>
            ))}
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
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'rgba(11, 36, 82, 0.7)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                color: 'var(--color-steel-light)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </aside>

        {/* Mobile Slide-Out Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              top: '62px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(7, 26, 58, 0.98)',
              zIndex: 50,
              padding: '16px 14px 72px',
              overflowY: 'auto',
              borderRight: '1px solid rgba(23, 74, 145, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px 12px', borderBottom: '1px solid rgba(23, 74, 145, 0.4)', marginBottom: '10px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>NGO’s Team</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {navGroups.map((group, groupIdx) => (
                <React.Fragment key={group.id}>
                  {groupIdx > 0 && (
                    <hr
                      style={{
                        border: 'none',
                        borderTop: '1px solid rgba(23, 74, 145, 0.35)',
                        margin: '6px 8px',
                      }}
                    />
                  )}
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                        background: isActive ? 'rgba(23, 74, 145, 0.5)' : 'transparent',
                        textDecoration: 'none',
                      })}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px 60px',
            position: 'relative',
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Quick Bar (Requirements 14 & 25) */}
      <div
        className="ngo-mobile-bottom-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '56px',
          background: 'rgba(7, 26, 58, 0.96)',
          borderTop: '1px solid rgba(23, 74, 145, 0.5)',
          backdropFilter: 'blur(16px)',
          zIndex: 35,
          display: 'none',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
        }}
      >
        <NavLink to="/ngo" end style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-steel-light)', textDecoration: 'none', fontSize: '0.68rem', gap: '2px' }}>
          <LayoutDashboard size={18} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/ngo/beneficiaries" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-steel-light)', textDecoration: 'none', fontSize: '0.68rem', gap: '2px' }}>
          <UserCheck size={18} />
          <span>Profiles</span>
        </NavLink>
        <NavLink to="/ngo/onboarding" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-steel-light)', textDecoration: 'none', fontSize: '0.68rem', gap: '2px' }}>
          <UserPlus size={18} />
          <span>Onboard</span>
        </NavLink>
        <NavLink to="/ngo/matching" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-steel-light)', textDecoration: 'none', fontSize: '0.68rem', gap: '2px' }}>
          <GitCompare size={18} />
          <span>Match</span>
        </NavLink>
        <button
          type="button"
          onClick={() => setIsAssistantOpen(true)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8BAEDB', background: 'transparent', border: 'none', fontSize: '0.68rem', gap: '2px', cursor: 'pointer' }}
        >
          <Bot size={18} />
          <span>Assistant</span>
        </button>
      </div>

      {/* Omnipresent AI Assistant Drawer */}
      <NgoAIAssistantDrawer isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />

      {/* Responsive Layout CSS Overrides */}
      <style>{`
        .ngo-nav-link:hover {
          color: #FFFFFF !important;
          background: rgba(23, 74, 145, 0.35) !important;
          border-color: rgba(139, 174, 219, 0.25) !important;
        }
        @media (max-width: 900px) {
          .ngo-desktop-sidebar {
            display: none !important;
          }
          .ngo-mobile-toggle {
            display: block !important;
          }
          .ngo-mobile-bottom-bar {
            display: flex !important;
          }
          main {
            padding: 16px 14px 72px !important;
          }
        }
        @media (max-width: 600px) {
          .ngo-demo-badge {
            display: none !important;
          }
          .ngo-asst-label {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NgoLayout;
