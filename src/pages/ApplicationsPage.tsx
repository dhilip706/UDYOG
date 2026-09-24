import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Send, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const APPLICATIONS_STORAGE_KEY = 'udyog_beneficiary_applications';

const STAGES = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Joined'] as const;

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadApplications() {
      let localApps: any[] = [];
      try {
        const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
        if (stored) {
          localApps = JSON.parse(stored);
        }
      } catch {}

      try {
        const res = await fetch('/api/jobs/user/applications', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const combined = [...localApps, ...(data.applications || [])];
          // deduplicate by id
          const seen = new Set();
          const deduped = combined.filter((app) => {
            if (seen.has(app.id)) return false;
            seen.add(app.id);
            return true;
          });
          setApplications(deduped);
        } else {
          setFallbackApps(localApps);
        }
      } catch {
        setFallbackApps(localApps);
      } finally {
        setIsLoading(false);
      }
    }

    function setFallbackApps(localApps: any[]) {
      setApplications(localApps || []);
    }

    loadApplications();
  }, [session]);

  const getStageIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('join')) return 4;
    if (s.includes('select')) return 3;
    if (s.includes('interview')) return 2;
    if (s.includes('shortlist')) return 1;
    return 0; // Applied
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out', paddingBottom: '60px' }}>
      {/* Header */}
      <div
        className="classic-navy-surface"
        style={{
          padding: '24px 28px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(11, 36, 82, 0.95) 0%, rgba(18, 54, 111, 0.85) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Send size={16} />
          <span>APPLICATION TRACKING PIPELINE</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Your Job Applications
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Track your hiring progression across the 5 stages: Applied → Shortlisted → Interview → Selected → Joined.
        </p>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-steel-light)', textAlign: 'center', padding: '40px' }}>
          Loading application pipeline...
        </div>
      ) : applications.length === 0 ? (
        <div
          className="classic-navy-surface"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <Building2 size={36} color="var(--color-steel-light)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.05rem', color: '#FFFFFF', marginBottom: '6px' }}>
            No Active Applications Yet
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '440px', margin: '0 auto 20px' }}>
            Browse local openings matched to your verified profile and apply with a single confirmation click.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/opportunities')}>
            Browse Local Opportunities
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {applications.map((app) => {
            const currentStageIndex = getStageIndex(app.status);

            return (
              <div
                key={app.id}
                className="classic-navy-surface"
                style={{
                  padding: '22px 24px',
                  background: 'rgba(11, 36, 82, 0.9)',
                }}
              >
                {/* Title & Employer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                      {app.jobTitle}
                    </h2>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span>{app.employerName}</span>
                      {app.location && <span>• {app.location}</span>}
                      {app.appliedAt && (
                        <span>• Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: 'rgba(23, 74, 145, 0.6)',
                      color: 'var(--color-steel-light)',
                      border: '1px solid rgba(139, 174, 219, 0.35)',
                    }}
                  >
                    Current Status: {app.status}
                  </span>
                </div>

                {/* 5-Stage Stepper Progress Tracker */}
                <div style={{ margin: '20px 0 16px', padding: '16px', background: 'rgba(7, 26, 58, 0.7)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                    {/* Connecting line */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '20px',
                        right: '20px',
                        height: '2px',
                        background: 'rgba(23, 74, 145, 0.5)',
                        zIndex: 1,
                      }}
                    />

                    {STAGES.map((stg, idx) => {
                      const isCompleted = idx <= currentStageIndex;
                      const isCurrent = idx === currentStageIndex;

                      return (
                        <div
                          key={stg}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            position: 'relative',
                            zIndex: 2,
                          }}
                        >
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '50%',
                              background: isCompleted ? 'var(--color-royal-bright)' : 'rgba(7, 26, 58, 0.9)',
                              border: isCurrent ? '2px solid #34D399' : isCompleted ? '2px solid var(--color-steel-light)' : '2px solid rgba(23, 74, 145, 0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              boxShadow: isCurrent ? '0 0 10px rgba(52, 211, 153, 0.5)' : 'none',
                            }}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: isCurrent ? 600 : 400,
                              color: isCurrent ? '#FFFFFF' : isCompleted ? 'var(--color-steel-light)' : 'var(--color-text-muted)',
                            }}
                          >
                            {stg}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline Note */}
                {app.timeline && app.timeline.length > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', background: 'rgba(7, 26, 58, 0.5)', padding: '10px 14px', borderRadius: '6px' }}>
                    <strong>Latest Update: </strong>
                    {app.timeline[app.timeline.length - 1].note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
