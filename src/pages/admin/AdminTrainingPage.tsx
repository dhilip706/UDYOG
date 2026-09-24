import React from 'react';

export const AdminTrainingPage: React.FC = () => {
  const trainingStreams = [
    {
      sector: 'Automotive & Clean Mobility',
      courseTitle: 'EV Powertrain Diagnostics & High-Voltage Isolation',
      provider: 'Accredited Regional Advanced Mobility Center',
      duration: '40 Hours',
      skillGapAddressed: 'EV High Voltage Safety, BMS Balancing',
      activeEnrollment: 24,
      completionRate: '94%',
    },
    {
      sector: 'Renewable Energy',
      courseTitle: 'Suryamitra Grid-Tie Solar PV Commissioning',
      provider: 'National Institute of Solar Energy Accredited Hub',
      duration: '60 Hours',
      skillGapAddressed: 'PV String Inverter Voltage Synchronization',
      activeEnrollment: 38,
      completionRate: '91%',
    },
    {
      sector: 'Industrial Manufacturing',
      courseTitle: 'PLC Panel Wiring & Motor Control Drives (LOTO)',
      provider: 'Industrial Automation Skill Academy',
      duration: '50 Hours',
      skillGapAddressed: 'VFD Parameterization & Safety Interlocks',
      activeEnrollment: 19,
      completionRate: '96%',
    },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
          Training Intelligence & Regional Skill Gaps
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Skill Gap → Training Demand → Training Provision → Verified Placement.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {trainingStreams.map((ts, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
                  {ts.sector.toUpperCase()}
                </span>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: '2px 0 4px 0' }}>
                  {ts.courseTitle}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Provider: {ts.provider} • Duration: {ts.duration}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#6EE7B7' }}>{ts.completionRate}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Completion Rate</div>
              </div>
            </div>

            <div
              style={{
                marginTop: '12px',
                padding: '10px 12px',
                borderRadius: '6px',
                background: 'rgba(7, 26, 58, 0.6)',
                border: '1px solid rgba(23, 74, 145, 0.4)',
                fontSize: '0.8rem',
              }}
            >
              <strong style={{ color: 'var(--color-steel-light)' }}>Direct Skill Gap Addressed:</strong>{' '}
              <span style={{ color: '#FFFFFF' }}>{ts.skillGapAddressed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
