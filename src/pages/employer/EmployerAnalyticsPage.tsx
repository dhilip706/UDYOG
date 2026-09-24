import React from 'react';
import { BarChart3 } from 'lucide-react';

export const EmployerAnalyticsPage: React.FC = () => {
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
          <BarChart3 size={16} />
          <span>RECRUITMENT & HIRING TELEMETRY</span>
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Hiring Metrics & Conversion
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Measure pipeline throughput from AI candidate discovery to verified employment outcomes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
            Pipeline Conversion Rates
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Matches to Review</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>85%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(7, 26, 58, 0.8)', borderRadius: '3px' }}>
                <div style={{ width: '85%', height: '100%', background: '#174A91', borderRadius: '3px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Review to Shortlist</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>62%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(7, 26, 58, 0.8)', borderRadius: '3px' }}>
                <div style={{ width: '62%', height: '100%', background: '#10B981', borderRadius: '3px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Shortlist to Interview</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>50%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(7, 26, 58, 0.8)', borderRadius: '3px' }}>
                <div style={{ width: '50%', height: '100%', background: '#3B82F6', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            borderRadius: '14px',
            padding: '22px',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
            Hiring Velocity & SLA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.825rem', color: 'var(--color-text-secondary)' }}>
            <div>
              <strong style={{ color: '#FFFFFF' }}>Average Time-to-Shortlist:</strong> 1.8 Days
            </div>
            <div>
              <strong style={{ color: '#FFFFFF' }}>Candidate Verification Rate:</strong> 100% Diagnostic Confirmed
            </div>
            <div>
              <strong style={{ color: '#FFFFFF' }}>Top In-Demand Competency:</strong> OBD-II Diagnostic Telemetry
            </div>
            <div>
              <strong style={{ color: '#FFFFFF' }}>Regional Target:</strong> Salem Hub & Surrounding Taluks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
