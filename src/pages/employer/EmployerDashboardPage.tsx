import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Send, TrendingUp, Mic, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const EmployerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    matchedCandidates: 0,
    submittedApplications: 0,
    shortlistedCount: 0,
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [jobsRes, appsRes, candRes] = await Promise.all([
          fetch('/api/employer/jobs', { headers: { Authorization: `Bearer ${session?.token}` } }),
          fetch('/api/employer/applications', { headers: { Authorization: `Bearer ${session?.token}` } }),
          fetch('/api/employer/candidates', { headers: { Authorization: `Bearer ${session?.token}` } }),
        ]);

        let loadedJobs: any[] = [];
        let loadedApps: any[] = [];
        let loadedCands: any[] = [];

        if (jobsRes.ok) {
          const jd = await jobsRes.json();
          loadedJobs = jd.jobs || [];
          setJobs(loadedJobs);
        }
        if (appsRes.ok) {
          const ad = await appsRes.json();
          loadedApps = ad.applications || [];
        }
        if (candRes.ok) {
          const cd = await candRes.json();
          loadedCands = cd.candidates || [];
        }

        setStats({
          activeJobs: loadedJobs.length,
          matchedCandidates: loadedCands.length,
          submittedApplications: loadedApps.length,
          shortlistedCount: loadedApps.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW').length,
        });
      } catch {
        setJobs([]);
        setStats({ activeJobs: 0, matchedCandidates: 0, submittedApplications: 0, shortlistedCount: 0 });
      }
    }

    loadDashboardData();
  }, [session]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Aisha Voice Assistant Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(23, 74, 145, 0.75) 0%, rgba(11, 36, 82, 0.95) 100%)',
          border: '1px solid rgba(139, 174, 219, 0.5)',
          borderRadius: '16px',
          padding: '28px 30px',
          marginBottom: '24px',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: '300px' }}>
          {/* Aisha Portrait */}
          <div
            style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              border: '2px solid var(--color-steel-light)',
              boxShadow: '0 0 16px rgba(139, 174, 219, 0.4)',
            }}
          >
            <img
              src="/images/aisha.jpg"
              alt="Aisha"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                color: 'var(--color-steel-light)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '4px',
              }}
            >
              <Sparkles size={13} />
              <span>Aisha • AI Voice Recruitment Assistant</span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: '2px 0 6px 0', lineHeight: 1.25 }}>
              Tell us who you need.
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '540px', lineHeight: 1.45 }}>
              Speak naturally in any language — we'll create the job and match the best candidates with verified diagnostic credentials.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => navigate('/employer/jobs/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
              border: '1px solid rgba(139, 174, 219, 0.55)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(7, 26, 58, 0.6)',
              transition: 'all 0.2s ease',
            }}
          >
            <Mic size={18} color="#8BAEDB" />
            <span>Speak Requirement</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div
          onClick={() => navigate('/employer/jobs')}
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '20px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>Active Positions</span>
            <Briefcase size={18} color="var(--color-steel-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#FFFFFF' }}>{stats.activeJobs}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Published vacancies</div>
        </div>

        <div
          onClick={() => navigate('/employer/candidates')}
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '20px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>Matched Candidates</span>
            <Users size={18} color="var(--color-steel-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#FFFFFF' }}>{stats.matchedCandidates}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>With verified skills</div>
        </div>

        <div
          onClick={() => navigate('/employer/applications')}
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '20px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>Submitted Applications</span>
            <Send size={18} color="var(--color-steel-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#FFFFFF' }}>{stats.submittedApplications}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Ready for review</div>
        </div>

        <div
          onClick={() => navigate('/employer/applications')}
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '20px',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>Shortlisted</span>
            <TrendingUp size={18} color="var(--color-steel-light)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: '#6EE7B7' }}>{stats.shortlistedCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Proceeding to interview</div>
        </div>
      </div>

      {/* Quick Access to Active Postings */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '14px',
          padding: '22px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
            Recent Job Postings
          </h2>
          <button
            type="button"
            onClick={() => navigate('/employer/jobs')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-steel-light)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            View All ({stats.activeJobs}) →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {jobs.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              No active job postings yet. Click &quot;Launch AI Job Creator&quot; to publish your first role.
            </div>
          ) : (
            jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: 'rgba(7, 26, 58, 0.6)',
                  border: '1px solid rgba(23, 74, 145, 0.4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#FFFFFF' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>
                    {job.district} • {job.openingsCount} Openings • ₹{job.salaryMin?.toLocaleString('en-IN')} - ₹{job.salaryMax?.toLocaleString('en-IN')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/employer/candidates')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: 'rgba(23, 74, 145, 0.5)',
                    border: '1px solid rgba(139, 174, 219, 0.4)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Review Candidates
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
