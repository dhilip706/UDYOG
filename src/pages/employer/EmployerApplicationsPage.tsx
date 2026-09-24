import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Send } from 'lucide-react';

export const EmployerApplicationsPage: React.FC = () => {
  const { session } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>('SHORTLISTED');
  const [statusNote, setStatusNote] = useState<string>('');

  useEffect(() => {
    async function loadApplications() {
      try {
        const res = await fetch('/api/employer/applications', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications);
        }
      } catch {
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadApplications();
  }, [session]);

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;

    try {
      const res = await fetch(`/api/employer/applications/${selectedApp.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote || `Candidate transitioned to ${newStatus}.`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? data.application : a))
        );
        setSelectedApp(null);
        setStatusNote('');
      }
    } catch {
      // Local fallback
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selectedApp.id
            ? {
                ...a,
                status: newStatus,
                events: [...a.events, { status: newStatus, note: statusNote || `Status updated to ${newStatus}`, timestamp: new Date().toISOString() }],
              }
            : a
        )
      );
      setSelectedApp(null);
      setStatusNote('');
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.92)',
          border: '1px solid rgba(23, 74, 145, 0.65)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Send size={16} />
          <span>HIRING STAGE MANAGEMENT</span>
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Applicant Review Pipeline
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Track applicants from initial submission through technical review, interview scheduling, and final hiring outcome.
        </p>
      </div>

      {/* Modal for status transition */}
      {selectedApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(7, 26, 58, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'rgba(11, 36, 82, 0.98)',
              border: '1px solid rgba(23, 74, 145, 0.7)',
              borderRadius: '16px',
              padding: '26px',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
              Update Hiring Stage: {selectedApp.applicantName}
            </h2>
            <div style={{ fontSize: '0.825rem', color: 'var(--color-steel-light)', marginBottom: '16px' }}>
              Position: {selectedApp.jobTitle}
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                Select Stage
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="classic-input"
                style={{ width: '100%', background: 'rgba(7, 26, 58, 0.9)', color: '#FFFFFF' }}
              >
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="INTERVIEW">INTERVIEW SCHEDULED</option>
                <option value="SELECTED">SELECTED / OFFER</option>
                <option value="REJECTED">NOT SELECTED</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                Audit Note / Interview Feedback
              </label>
              <textarea
                rows={2}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="E.g., Evaluated diagnostic assessment score. Scheduled technical video round."
                className="classic-input"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: '1px solid rgba(23, 74, 145, 0.5)',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
                  border: '1px solid rgba(139, 174, 219, 0.4)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Update Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      {isLoading ? (
        <div style={{ color: 'var(--color-steel-light)', textAlign: 'center', padding: '40px' }}>
          Loading applicant records...
        </div>
      ) : applications.length === 0 ? (
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px dashed rgba(23, 74, 145, 0.65)',
            borderRadius: '14px',
            padding: '48px 24px',
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '0 0 8px 0' }}>No Applications Received</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
            When job seekers apply to your active job vacancies, their applications and interview progress will be managed here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {applications.map((app) => (
            <div
              key={app.id}
              style={{
                background: 'rgba(11, 36, 82, 0.85)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                borderRadius: '14px',
                padding: '22px 24px',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                      {app.applicantName}
                    </h2>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.5)',
                        fontSize: '0.72rem',
                        color: '#6EE7B7',
                        fontWeight: 600,
                      }}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-steel-light)', marginTop: '2px' }}>
                    Applied for: {app.jobTitle}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedApp(app);
                    setNewStatus(app.status);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: 'rgba(23, 74, 145, 0.5)',
                    border: '1px solid rgba(139, 174, 219, 0.4)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Manage Stage
                </button>
              </div>

              {/* Matched skills pill */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '14px 0' }}>
                {app.matchedSkills?.map((s: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      fontSize: '0.72rem',
                      color: '#6EE7B7',
                    }}
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>

              {/* Event history */}
              {app.events && app.events.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(23, 74, 145, 0.35)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '6px' }}>
                    PIPELINE LOGS:
                  </div>
                  {app.events.map((ev: any, idx: number) => (
                    <div key={idx} style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                      • {ev.note} <span style={{ opacity: 0.6 }}>({new Date(ev.timestamp).toLocaleDateString()})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
