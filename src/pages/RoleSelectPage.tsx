import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CinematicVideo } from '../components/video/CinematicVideo';
import { AtmosphereOverlay } from '../components/cinematic/AtmosphereOverlay';
import { useAuth } from '../hooks/useAuth';
import { useAICompanion } from '../hooks/useAICompanion';
import { UserProfileService } from '../services/profile/userProfileService';
import { UserCheck, Briefcase, ArrowRight, AlertCircle, ArrowLeft, Lock, CheckCircle2 } from 'lucide-react';

export const RoleSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { session, selectRole, isLoading } = useAuth();
  const { speak } = useAICompanion();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<'BENEFICIARY' | 'EMPLOYER' | null>(null);

  // If user already has an assigned role, immediately redirect to their role dashboard
  useEffect(() => {
    if (session?.role) {
      if (session.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (session.role === 'EMPLOYER') {
        navigate('/employer', { replace: true });
      } else if (session.role === 'NGO') {
        navigate('/ngo', { replace: true });
      } else if (session.role === 'BENEFICIARY') {
        if (!UserProfileService.isProfileConfirmed()) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/career', { replace: true });
        }
      }
    }
  }, [session, navigate]);

  if (session?.role) {
    return null;
  }

  const handleRoleClick = (role: 'BENEFICIARY' | 'EMPLOYER') => {
    setErrorMsg(null);
    setPendingRole(role);
    if (role === 'BENEFICIARY') {
      speak('You are choosing the Job Seeker role. Please confirm to lock this choice.', 'GUIDING');
    } else if (role === 'EMPLOYER') {
      speak('You are choosing the Employer role. Please confirm to lock this choice.', 'GUIDING');
    }
  };

  const handleConfirmRole = async () => {
    if (!pendingRole) return;
    setErrorMsg(null);
    try {
      await selectRole(pendingRole);
      if (pendingRole === 'BENEFICIARY') {
        speak('Welcome to your career journey. Let us begin.', 'SUCCESS');
        navigate('/onboarding', { replace: true });
      } else if (pendingRole === 'EMPLOYER') {
        speak('Welcome to the employer portal. Post positions and discover verified candidates.', 'SUCCESS');
        navigate('/employer', { replace: true });
      }
    } catch (err: any) {
      const msg = err.message || 'Access restricted. Please verify your permissions.';
      setErrorMsg(msg);
      speak(msg, 'ERROR');
    }
  };

  const getRoleTitle = (role: 'BENEFICIARY' | 'EMPLOYER') => {
    switch (role) {
      case 'BENEFICIARY':
        return 'Job Seeker / Beneficiary';
      case 'EMPLOYER':
        return 'Hiring / Employer';
    }
  };

  const getRoleIcon = (role: 'BENEFICIARY' | 'EMPLOYER') => {
    switch (role) {
      case 'BENEFICIARY':
        return <UserCheck size={26} color="var(--color-steel-light)" />;
      case 'EMPLOYER':
        return <Briefcase size={26} color="var(--color-steel-light)" />;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        color: 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CinematicVideo />
      <AtmosphereOverlay />

      <main
        style={{
          position: 'relative',
          zIndex: 10,
          width: 'calc(100vw - 32px)',
          maxWidth: '560px',
          background: 'rgba(11, 36, 82, 0.92)',
          border: '1px solid rgba(23, 74, 145, 0.6)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 24px 60px -12px rgba(7, 26, 58, 0.9), 0 0 1px rgba(139, 174, 219, 0.3)',
          padding: '36px 32px',
          animation: 'classic-fade-in 0.4s ease-out',
        }}
      >
        {/* Companion Micro Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <img
            src="/images/aisha.jpg"
            alt="Aisha"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(139, 174, 219, 0.5)',
            }}
          />
          <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', fontWeight: 500 }}>
            Aisha • Guide
          </span>
        </div>

        {!pendingRole ? (
          <>
            <h1
              style={{
                fontSize: '1.6rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                marginBottom: '8px',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              How would you like to use the platform?
            </h1>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                marginBottom: '24px',
                lineHeight: 1.45,
              }}
            >
              Select your intended pathway. Role access is permanent and locked after confirmation.
            </p>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-primary)',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={16} color="var(--color-error)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Option 1: Job Seeker */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRoleClick('BENEFICIARY')}
                className="role-card-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 22px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(23, 74, 145, 0.4) 0%, rgba(18, 54, 111, 0.55) 100%)',
                  border: '1px solid rgba(139, 174, 219, 0.4)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(23, 74, 145, 0.65)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-steel-light)',
                      flexShrink: 0,
                    }}
                  >
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '3px' }}>
                      Job Seeker / Beneficiary
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      Voice onboarding, skill intelligence, adaptive skilling & local jobs
                    </div>
                  </div>
                </div>
                <ArrowRight size={18} color="var(--color-steel-light)" style={{ flexShrink: 0 }} />
              </button>

              {/* Option 2: Employer */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleRoleClick('EMPLOYER')}
                className="role-card-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '18px 22px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(23, 74, 145, 0.4) 0%, rgba(18, 54, 111, 0.55) 100%)',
                  border: '1px solid rgba(139, 174, 219, 0.4)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(23, 74, 145, 0.65)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-steel-light)',
                      flexShrink: 0,
                    }}
                  >
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '3px' }}>
                      Hiring / Employer
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      AI job post creator, candidate matching & recruitment pipeline
                    </div>
                  </div>
                </div>
                <ArrowRight size={18} color="var(--color-steel-light)" style={{ flexShrink: 0 }} />
              </button>
            </div>
          </>
        ) : (
          /* Confirmation Step */
          <div style={{ animation: 'classic-fade-in 0.3s ease-out' }}>
            <h1
              style={{
                fontSize: '1.5rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                marginBottom: '12px',
                color: 'var(--color-text-primary)',
              }}
            >
              Confirm Account Role
            </h1>

            <div
              style={{
                padding: '18px 20px',
                borderRadius: '12px',
                background: 'rgba(23, 74, 145, 0.3)',
                border: '1px solid rgba(139, 174, 219, 0.4)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(11, 36, 82, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getRoleIcon(pendingRole)}
              </div>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {getRoleTitle(pendingRole)}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-steel-light)', marginTop: '2px' }}>
                  You are creating a {getRoleTitle(pendingRole)} account.
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '10px',
                background: 'rgba(217, 119, 6, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                marginBottom: '24px',
              }}
            >
              <Lock size={18} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.85rem', color: '#FEF3C7', lineHeight: 1.45 }}>
                <strong>Permanent Selection:</strong> Your account role cannot be changed later once confirmed. Role switching is strictly disabled.
              </div>
            </div>

            {errorMsg && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-primary)',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={16} color="var(--color-error)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setErrorMsg(null);
                  setPendingRole(null);
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  background: 'rgba(11, 36, 82, 0.8)',
                  border: '1px solid rgba(139, 174, 219, 0.3)',
                  color: 'var(--color-steel-light)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleConfirmRole}
                style={{
                  flex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #174A91 0%, #1D4ED8 100%)',
                  border: '1px solid rgba(139, 174, 219, 0.5)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(23, 74, 145, 0.4)',
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <span>Locking Role & Connecting...</span>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Confirm & Continue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {session?.phoneNumber && (
          <div
            style={{
              marginTop: '22px',
              fontSize: '0.75rem',
              color: 'var(--color-text-subtle)',
              textAlign: 'center',
            }}
          >
            Signed in as: <strong style={{ color: 'var(--color-steel-light)' }}>{session.phoneNumber}</strong>
          </div>
        )}
      </main>

      <style>{`
        .role-card-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: rgba(139, 174, 219, 0.7) !important;
          background: linear-gradient(135deg, rgba(23, 74, 145, 0.6) 0%, rgba(18, 54, 111, 0.8) 100%) !important;
        }
      `}</style>
    </div>
  );
};
