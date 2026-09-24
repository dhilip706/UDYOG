import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Plus, MapPin, IndianRupee, Users } from 'lucide-react';

export const EmployerJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch('/api/employer/jobs', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs);
        }
      } catch {
        setJobs([]);
      }
    }
    loadJobs();
  }, [session]);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.92)',
          border: '1px solid rgba(23, 74, 145, 0.65)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0' }}>
            Active Vacancies
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Manage published openings, skill requirements, and candidate matching pipelines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/employer/jobs/new')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
            border: '1px solid rgba(139, 174, 219, 0.5)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          <span>New Job Posting</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {jobs.length === 0 ? (
          <div
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px dashed rgba(23, 74, 145, 0.65)',
              borderRadius: '14px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '0 0 8px 0' }}>No Vacancies Published</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0 0 20px 0' }}>
              You have not posted any openings yet. Create a job requisition to start matching with verified candidates.
            </p>
            <button
              type="button"
              onClick={() => navigate('/employer/jobs/new')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
                border: '1px solid rgba(139, 174, 219, 0.5)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>Post Your First Job</span>
            </button>
          </div>
        ) : (
          jobs.map((job) => (
          <div
            key={job.id}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px 24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    {job.title}
                  </h2>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                      fontSize: '0.7rem',
                      color: '#6EE7B7',
                      fontWeight: 600,
                    }}
                  >
                    {job.status}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="var(--color-steel-light)" />
                    {job.district}, {job.state}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={13} color="var(--color-steel-light)" />
                    {job.openingsCount} Openings
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6EE7B7', fontWeight: 500 }}>
                    <IndianRupee size={13} />
                    {job.salaryMin?.toLocaleString('en-IN')} - {job.salaryMax?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/employer/candidates')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'rgba(23, 74, 145, 0.45)',
                  border: '1px solid rgba(139, 174, 219, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Review Matched Candidates
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};
