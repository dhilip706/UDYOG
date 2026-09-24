import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { JobApplicationItem } from '../../types/ngo';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  ChevronRight,
} from 'lucide-react';

const STATUS_STAGES = [
  'ALL',
  'SUBMITTED',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'JOINED',
  'CLOSED',
];

export const NgoApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplicationItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [activeApp, setActiveApp] = useState<JobApplicationItem | null>(null);
  const [newNote, setNewNote] = useState('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await ngoService.getApplications();
      setApplications(data);
    }
    loadData();
  }, []);

  const filtered = applications.filter((app) => {
    const matchesStatus =
      selectedStatus === 'ALL' || app.status === selectedStatus;
    const matchesSearch =
      !search ||
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.employerName.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (appId: string, newStatus: string) => {
    await ngoService.updateApplication(appId, newStatus, newNote || `Status updated to ${newStatus}`);
    setStatusUpdateSuccess(true);
    const updated = await ngoService.getApplications();
    setApplications(updated);
    if (activeApp && activeApp.id === appId) {
      const refreshed = updated.find((a) => a.id === appId);
      if (refreshed) setActiveApp(refreshed);
    }
    setTimeout(() => setStatusUpdateSuccess(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SELECTED':
      case 'JOINED':
        return '#34D399';
      case 'SHORTLISTED':
      case 'INTERVIEW':
        return '#60A5FA';
      case 'SUBMITTED':
        return '#FBBF24';
      default:
        return 'var(--color-steel-light)';
    }
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <FileText size={16} />
          <span>BENEFICIARY APPLICATION PIPELINE</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Application Support & Tracking
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Support candidates through every stage of their employment journey: document verification, employer shortlisting, interview preparation, and placement onboarding.
        </p>
      </div>

      {/* Stage Flow Indicator */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.88)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
        }}
      >
        {['Draft', 'Submitted', 'Shortlisted', 'Interview', 'Selected', 'Joined'].map((stage, idx) => (
          <React.Fragment key={stage}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
              <span
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: idx <= 2 ? 'rgba(23, 74, 145, 0.7)' : 'rgba(7, 26, 58, 0.6)',
                  color: idx <= 2 ? '#8BAEDB' : 'var(--color-steel-light)',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                }}
              >
                {idx + 1}
              </span>
              <span style={{ fontSize: '0.8rem', color: idx <= 2 ? '#FFFFFF' : 'var(--color-text-secondary)', fontWeight: 500 }}>
                {stage}
              </span>
            </div>
            {idx < 5 && <ChevronRight size={14} color="var(--color-steel-light)" style={{ flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Filters & Search */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.88)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flex: '1 1 300px', position: 'relative' }}>
          <Search size={16} color="var(--color-steel-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by applicant, job, or employer..."
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              background: 'rgba(7, 26, 58, 0.75)',
              border: '1px solid rgba(23, 74, 145, 0.6)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUS_STAGES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: selectedStatus === st ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)' : 'rgba(7, 26, 58, 0.6)',
                border: selectedStatus === st ? '1px solid #8BAEDB' : '1px solid rgba(23, 74, 145, 0.45)',
                color: selectedStatus === st ? '#FFFFFF' : 'var(--color-steel-light)',
                fontSize: '0.75rem',
                fontWeight: selectedStatus === st ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((app) => {
          const stColor = getStatusColor(app.status);

          return (
            <div
              key={app.id}
              style={{
                background: 'rgba(11, 36, 82, 0.88)',
                border: '1px solid rgba(23, 74, 145, 0.5)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                      {app.applicantName}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: `${stColor}20`,
                        color: stColor,
                        border: `1px solid ${stColor}40`,
                      }}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#8BAEDB', marginTop: '2px' }}>
                    {app.jobTitle} • {app.employerName}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveApp(app)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    background: 'rgba(23, 74, 145, 0.45)',
                    border: '1px solid rgba(139, 174, 219, 0.4)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  <Eye size={14} />
                  <span>View Details & Timeline</span>
                </button>
              </div>

              {/* Rationale Snippet */}
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', background: 'rgba(7, 26, 58, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(23, 74, 145, 0.35)' }}>
                <strong>Match Rationale:</strong> {app.matchExplanation}
              </div>

              {/* Matched Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)' }}>Verified Skills:</span>
                {app.matchedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                    }}
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail / Timeline Modal */}
      {activeApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 10, 24, 0.78)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(11, 36, 82, 0.98)',
              border: '1px solid rgba(139, 174, 219, 0.45)',
              borderRadius: '16px',
              padding: '26px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: '0 0 4px 0' }}>
                  {activeApp.applicantName}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#8BAEDB' }}>
                  {activeApp.jobTitle} • {activeApp.employerName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveApp(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-steel-light)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Status Update Controls */}
            <div style={{ background: 'rgba(7, 26, 58, 0.75)', borderRadius: '10px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(23, 74, 145, 0.4)' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '8px', fontWeight: 600 }}>
                Advance Pipeline Stage
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {['SHORTLISTED', 'INTERVIEW', 'SELECTED', 'JOINED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(activeApp.id, st)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: activeApp.status === st ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(23, 74, 145, 0.5)',
                      border: '1px solid rgba(139, 174, 219, 0.4)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Set {st}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Optional stage update note / interview details..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: 'rgba(7, 26, 58, 0.9)',
                  border: '1px solid rgba(23, 74, 145, 0.5)',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  outline: 'none',
                  marginBottom: '8px',
                }}
              />

              {statusUpdateSuccess && (
                <div style={{ fontSize: '0.78rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> Stage updated and audit log recorded!
                </div>
              )}
            </div>

            {/* Audit Trail Timeline */}
            <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="#8BAEDB" />
              <span>Application Audit Trail</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {activeApp.events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.6)',
                    border: '1px solid rgba(23, 74, 145, 0.35)',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8BAEDB', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{ev.status}</span>
                    <span>{new Date(ev.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{ev.note}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setActiveApp(null)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                  border: '1px solid #8BAEDB',
                  color: '#FFFFFF',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
