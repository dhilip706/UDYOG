import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CinematicVideo } from '../../components/video/CinematicVideo';
import { AtmosphereOverlay } from '../../components/cinematic/AtmosphereOverlay';
import { ArrowRight, HeartHandshake } from 'lucide-react';

export const NgoLandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "NGO’s Team";
  }, []);

  const pathwaySteps = [
    { title: 'Community', desc: 'Engage local families and grassroots groups across blocks' },
    { title: 'Capability', desc: 'Identify innate aptitude, practical experience & interests' },
    { title: 'Skills', desc: 'Structure evidence-backed skills mapped to NCO benchmarks' },
    { title: 'Training', desc: 'Bridge identified gaps with verified NSQF-aligned modules' },
    { title: 'Opportunity', desc: 'Connect to verified employer openings & enterprise' },
    { title: 'Livelihood', desc: 'Achieve sustainable dignity, fair wages & 90-day retention' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
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
          zIndex: 20,
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(7, 26, 58, 0.75)',
          borderBottom: '1px solid rgba(23, 74, 145, 0.4)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              NGO’s Team
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>
              Community Operations & Skilling Platform
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/ngo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
            border: '1px solid rgba(139, 174, 219, 0.4)',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(7, 26, 58, 0.6)',
          }}
        >
          <span>Enter NGO Workspace</span>
          <ArrowRight size={16} />
        </button>
      </header>

      {/* Hero Section */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '60px 24px 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(23, 74, 145, 0.4)',
            border: '1px solid rgba(139, 174, 219, 0.35)',
            color: 'var(--color-steel-light)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '20px',
            letterSpacing: '0.04em',
          }}
        >
          <HeartHandshake size={15} color="#8BAEDB" />
          <span>COMMUNITY EMPOWERMENT PLATFORM</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
            fontFamily: 'var(--font-display)',
            fontWeight: 500,
            color: '#FFFFFF',
            lineHeight: 1.15,
            marginBottom: '18px',
            maxWidth: '840px',
            letterSpacing: '-0.02em',
          }}
        >
          Empower capability. Build opportunity.
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: '720px',
            lineHeight: 1.6,
            marginBottom: '36px',
          }}
        >
          Help communities discover skills, access learning and connect with meaningful livelihood opportunities. The bridge from grassroots potential to verified sustainable employment.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>
          <button
            type="button"
            onClick={() => navigate('/ngo')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 32px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
              border: '1px solid rgba(139, 174, 219, 0.5)',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(7, 26, 58, 0.8), 0 0 1px rgba(139, 174, 219, 0.5)',
            }}
          >
            <span>Enter NGO Workspace</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/ngo/setup')}
            style={{
              padding: '16px 28px',
              borderRadius: '12px',
              background: 'rgba(11, 36, 82, 0.7)',
              border: '1px solid rgba(23, 74, 145, 0.6)',
              color: 'var(--color-text-primary)',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Organization Onboarding
          </button>
        </div>

        {/* Livelihood Pathway Progression */}
        <div
          style={{
            width: '100%',
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.6)',
            borderRadius: '16px',
            padding: '32px 24px',
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--shadow-royal)',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '8px', letterSpacing: '0.04em' }}>
            THE COMMUNITY PROGRESSION CONTINUUM
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '28px' }}>
            From Grassroots Capability to Verified Employment
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '14px',
              textAlign: 'left',
            }}
          >
            {pathwaySteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(7, 26, 58, 0.65)',
                  border: '1px solid rgba(23, 74, 145, 0.45)',
                  borderRadius: '12px',
                  padding: '16px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(23, 74, 145, 0.6)',
                    color: 'var(--color-steel-light)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
