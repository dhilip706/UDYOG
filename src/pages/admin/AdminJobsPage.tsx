import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const AdminJobsPage: React.FC = () => {
  const { session } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/jobs', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setJobs(json.jobs);
        }
      } catch {
        setJobs([]);
      }
    }
    load();
  }, [session]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
          Job Post Moderation & Standards
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Vacancies posted across sectors with verified minimum wage standards.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {jobs.length === 0 ? (
          <div
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px dashed rgba(23, 74, 145, 0.65)',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '0 0 8px 0' }}>No Jobs Posted</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              No employer job vacancies currently exist in the database. Published job requisitions will appear here.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
          <div
            key={job.id}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '12px',
              padding: '18px 22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF' }}>{job.title}</span>
                {job.isDemo && (
                  <span
                    style={{
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(139, 174, 219, 0.2)',
                      border: '1px solid rgba(139, 174, 219, 0.4)',
                      fontSize: '0.65rem',
                      color: 'var(--color-steel-light)',
                    }}
                  >
                    DEMO
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', marginTop: '2px' }}>
                {job.employerName} • {job.district}, {job.state}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#6EE7B7' }}>
                ₹{job.salaryMin?.toLocaleString('en-IN')} - ₹{job.salaryMax?.toLocaleString('en-IN')}
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#6EE7B7',
                  fontWeight: 600,
                }}
              >
                {job.status}
              </span>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};
