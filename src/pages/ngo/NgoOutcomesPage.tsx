import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { OutcomesFunnel, PlacedBeneficiary } from '../../types/ngo';
import {
  TrendingUp,
  Award,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const NgoOutcomesPage: React.FC = () => {
  const [funnel, setFunnel] = useState<OutcomesFunnel | null>(null);
  const [placedList, setPlacedList] = useState<PlacedBeneficiary[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await ngoService.getOutcomes();
      setFunnel(data.funnel);
      setPlacedList(data.placedBeneficiaries);
    }
    loadData();
  }, []);

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <TrendingUp size={16} />
          <span>SUSTAINED EMPLOYMENT IMPACT</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Employment Outcomes & Retention
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Tracking the full transformation continuum from capability discovery to 30-day and 90-day wage retention milestones.
        </p>
      </div>

      {/* Notice */}
      <div
        style={{
          background: 'rgba(23, 74, 145, 0.25)',
          border: '1px solid rgba(139, 174, 219, 0.3)',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '22px',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <Info size={18} color="#8BAEDB" style={{ flexShrink: 0 }} />
        <span>
          <strong>DEMO DATA:</strong> Employment outcomes reflect the regional demonstration pilot cohort in Salem and Coimbatore. Placement confirmations are cross-verified via employer payroll verification records.
        </span>
      </div>

      {/* Impact Continuum Sequence */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.9)',
          border: '1px solid rgba(23, 74, 145, 0.55)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '26px',
        }}
      >
        <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
          Employment Progression Funnel
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Profile Created', value: funnel?.profiledCount || 4 },
            { label: 'Training Completed', value: funnel?.trainingCompletedCount || 3 },
            { label: 'Matched Requisitions', value: funnel?.matchedOpportunitiesCount || 4 },
            { label: 'Applications Sent', value: funnel?.submittedApplicationsCount || 1 },
            { label: 'Shortlisted', value: funnel?.shortlistedCount || 1 },
            { label: 'Interviews Held', value: funnel?.interviewedCount || 1 },
            { label: 'Joined / Placed', value: funnel?.selectedCount || 1, highlight: true },
          ].map((step, idx) => (
            <div
              key={idx}
              style={{
                background: step.highlight ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)' : 'rgba(7, 26, 58, 0.8)',
                border: step.highlight ? '1px solid #10B981' : '1px solid rgba(23, 74, 145, 0.45)',
                borderRadius: '10px',
                padding: '14px 10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.45rem', fontWeight: 700, color: step.highlight ? '#34D399' : '#FFFFFF', marginBottom: '4px' }}>
                {step.value}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention Milestones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginBottom: '26px' }}>
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.88)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={24} color="#34D399" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF' }}>
              {funnel?.retention30Days || 1} Beneficiary (100%)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>
              30-Day Employment Retention Verified
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(11, 36, 82, 0.88)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} color="#60A5FA" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF' }}>
              {funnel?.retention90Days || 1} Beneficiary (100%)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)' }}>
              90-Day Sustained Employment Track Record
            </div>
          </div>
        </div>
      </div>

      {/* Placed Beneficiaries Table / Cards */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
        Verified Placement Registry
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {placedList.map((p, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(11, 36, 82, 0.88)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '12px',
              padding: '18px 22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                  {p.beneficiaryName}
                </h4>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#34D399',
                  }}
                >
                  {p.status}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-steel-light)', marginTop: '3px' }}>
                {p.jobTitle} • {p.employer} ({p.district})
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34D399' }}>{p.monthlySalary}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-steel-light)' }}>Confirmed Compensation</div>
              </div>

              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(23, 74, 145, 0.4)', fontSize: '0.78rem', color: '#8BAEDB' }}>
                {p.followUpStatus}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
