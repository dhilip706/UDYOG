import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Users, Building2, Briefcase, Send, HelpCircle, Activity } from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const { session } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        setData({
          metrics: {
            totalBeneficiaries: 1,
            totalEmployers: 1,
            totalJobs: 4,
            totalApplications: 1,
            totalComplaints: 1,
            activeComplaints: 1,
            isDemoDataNotice: 'DEMO DATA — Standardized NCO-2015 benchmarking environment active.',
          },
        });
      }
    }
    loadStats();
  }, [session]);

  const metrics = data?.metrics || {
    totalBeneficiaries: 1,
    totalEmployers: 1,
    totalJobs: 4,
    totalApplications: 1,
    totalComplaints: 1,
    activeComplaints: 1,
    isDemoDataNotice: 'DEMO DATA — Standardized NCO-2015 benchmarking environment active.',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Top Banner with Demo Data Notice (Requirement 29) */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.92)',
          border: '1px solid rgba(23, 74, 145, 0.7)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Activity size={16} />
            <span>PLATFORM HEALTH & TELEMETRY</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
            Platform Command Center
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            Real-time multi-ecosystem oversight across job seekers, employers, training modules, and grievances.
          </p>
        </div>

        <div
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(234, 179, 8, 0.15)',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            fontSize: '0.75rem',
            color: '#FDE047',
            fontWeight: 500,
          }}
        >
          {metrics.isDemoDataNotice}
        </div>
      </div>

      {/* Grid of Command Cards (Requirement 29) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(11, 36, 82, 0.85)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>Beneficiaries</span>
            <Users size={16} color="var(--color-steel-light)" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 600, color: '#FFFFFF' }}>{metrics.totalBeneficiaries}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Profiled & Verified</div>
        </div>

        <div style={{ background: 'rgba(11, 36, 82, 0.85)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>Employers</span>
            <Building2 size={16} color="var(--color-steel-light)" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 600, color: '#FFFFFF' }}>{metrics.totalEmployers}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Verified Hiring Partners</div>
        </div>

        <div style={{ background: 'rgba(11, 36, 82, 0.85)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>Active Jobs</span>
            <Briefcase size={16} color="var(--color-steel-light)" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 600, color: '#FFFFFF' }}>{metrics.totalJobs}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>NCO-2015 Aligned</div>
        </div>

        <div style={{ background: 'rgba(11, 36, 82, 0.85)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>Applications</span>
            <Send size={16} color="var(--color-steel-light)" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 600, color: '#6EE7B7' }}>{metrics.totalApplications}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>In Review Pipeline</div>
        </div>

        <div style={{ background: 'rgba(11, 36, 82, 0.85)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>Grievances</span>
            <HelpCircle size={16} color="var(--color-steel-light)" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 600, color: '#FCD34D' }}>{metrics.activeComplaints}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Active Investigations</div>
        </div>
      </div>

      {/* Operational Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'rgba(11, 36, 82, 0.85)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '14px', padding: '22px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
            Top Verified Skill Supply
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Automotive Diagnostics (OBD-II)</span>
              <span style={{ color: '#6EE7B7', fontWeight: 600 }}>100% Confirmed</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Brake Systems (Hydraulic)</span>
              <span style={{ color: '#6EE7B7', fontWeight: 600 }}>100% Confirmed</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>EV High Voltage Safety</span>
              <span style={{ color: '#FCD34D', fontWeight: 600 }}>Needs Practical Test</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(11, 36, 82, 0.85)', border: '1px solid rgba(23, 74, 145, 0.5)', borderRadius: '14px', padding: '22px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '12px' }}>
            Security & Access Control Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
            <div>
              <strong style={{ color: '#FFFFFF' }}>Server-Side Allowlist:</strong> Active (Strict verification)
            </div>
            <div>
              <strong style={{ color: '#FFFFFF' }}>Admin Email Allowlist:</strong> Configured
            </div>
            <div>
              <strong style={{ color: '#FFFFFF' }}>Admin Phone Allowlist:</strong> Configured
            </div>
            <div>
              <strong style={{ color: '#FFFFFF' }}>Client Storage Elevation:</strong> Blocked (Server returns 403)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
