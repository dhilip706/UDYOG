import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const AdminComplaintsPage: React.FC = () => {
  const { session } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [resolutionStatus, setResolutionStatus] = useState<string>('RESOLVED');
  const [resolutionNote, setResolutionNote] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/complaints', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setComplaints(json.complaints);
        }
      } catch {
        setComplaints([]);
      }
    }
    load();
  }, [session]);

  const handleUpdate = async () => {
    if (!selectedComplaint) return;

    try {
      const res = await fetch(`/api/admin/complaints/${selectedComplaint.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          status: resolutionStatus,
          resolutionNote,
          eventNote: `Status updated to ${resolutionStatus}: ${resolutionNote}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComplaints((prev) =>
          prev.map((c) => (c.id === selectedComplaint.id ? data.complaint : c))
        );
        setSelectedComplaint(null);
        setResolutionNote('');
      }
    } catch {
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selectedComplaint.id
            ? { ...c, status: resolutionStatus, resolutionNote }
            : c
        )
      );
      setSelectedComplaint(null);
      setResolutionNote('');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
          Grievance Redressal & Support Administration
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Investigate workplace issues, training disputes, and certificate delays with full audit tracking.
        </p>
      </div>

      {selectedComplaint && (
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.98)',
            border: '1px solid rgba(23, 74, 145, 0.8)',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
            Resolve Grievance: #{selectedComplaint.id}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-steel-light)', marginBottom: '14px' }}>
            {selectedComplaint.subject}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Set Investigation Status
              </label>
              <select
                value={resolutionStatus}
                onChange={(e) => setResolutionStatus(e.target.value)}
                className="classic-input"
                style={{ width: '100%', background: 'rgba(7, 26, 58, 0.9)', color: '#FFFFFF' }}
              >
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="ACTION_REQUIRED">ACTION REQUIRED</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Resolution / Investigation Note
              </label>
              <input
                type="text"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Official note on action taken..."
                className="classic-input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setSelectedComplaint(null)}
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
              onClick={handleUpdate}
              style={{
                padding: '8px 18px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: '1px solid rgba(110, 231, 183, 0.4)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Submit Resolution
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {complaints.length === 0 ? (
          <div
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px dashed rgba(23, 74, 145, 0.65)',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '0 0 8px 0' }}>No Grievances Reported</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              No complaints or grievances have been lodged. User inquiries and platform disputes will appear here for formal moderation.
            </p>
          </div>
        ) : (
          complaints.map((c) => (
          <div
            key={c.id}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)' }}>
                    #{c.id} • {c.category}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: c.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                      border: c.status === 'RESOLVED' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(234, 179, 8, 0.5)',
                      fontSize: '0.7rem',
                      color: c.status === 'RESOLVED' ? '#6EE7B7' : '#FDE047',
                      fontWeight: 600,
                    }}
                  >
                    {c.status}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 2px 0' }}>
                  {c.subject}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {c.description}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedComplaint(c);
                  setResolutionStatus(c.status === 'RESOLVED' ? 'CLOSED' : 'RESOLVED');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: 'rgba(23, 74, 145, 0.5)',
                  border: '1px solid rgba(139, 174, 219, 0.4)',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                Take Action
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};
