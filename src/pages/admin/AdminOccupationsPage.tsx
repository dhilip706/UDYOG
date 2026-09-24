import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export const AdminOccupationsPage: React.FC = () => {
  const [benchmarks, setBenchmarks] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/skills');
        if (res.ok) {
          const json = await res.json();
          setBenchmarks(json.benchmarks || []);
        }
      } catch {
        setBenchmarks([
          {
            ncoCode: '7231.0100',
            title: 'Automotive Diagnostic Specialist',
            sector: 'Automotive & Mobility',
            minEducation: 'ITI / Diploma',
            minExperienceYears: 2.0,
            requiredSkills: ['Engine Diagnostics', 'OBD-II Scanning', 'Brake Systems'],
          },
          {
            ncoCode: '7412.0201',
            title: 'Electric Vehicle (EV) Powertrain Technician',
            sector: 'Clean Mobility',
            minEducation: 'Diploma / Certificate in Electrical',
            minExperienceYears: 1.5,
            requiredSkills: ['EV High Voltage Safety', 'Battery Management Systems (BMS)'],
          },
          {
            ncoCode: '7411.0102',
            title: 'Solar PV Grid Installation Lead',
            sector: 'Renewable Energy',
            minEducation: 'ITI Electrician',
            minExperienceYears: 1.0,
            requiredSkills: ['Solar Inverter Configuration', 'PV String Voltage Testing'],
          },
        ]);
      }
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
          National Classification of Occupations (NCO-2015)
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Official occupational standards and qualification descriptors mapped to verified NSQF levels.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {benchmarks.map((b) => (
          <div
            key={b.ncoCode}
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
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', padding: '2px 6px', background: 'rgba(23, 74, 145, 0.4)', borderRadius: '4px' }}>
                    NCO {b.ncoCode}
                  </span>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                    {b.title}
                  </h2>
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--color-steel-light)', marginTop: '4px' }}>
                  Sector: {b.sector} • Minimum Experience: {b.minExperienceYears} Years
                </div>
              </div>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  fontSize: '0.7rem',
                  color: '#6EE7B7',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={12} />
                Verified Benchmark
              </span>
            </div>

            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                Required Skill Competencies:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {b.requiredSkills?.map((s: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(7, 26, 58, 0.7)',
                      border: '1px solid rgba(23, 74, 145, 0.5)',
                      fontSize: '0.72rem',
                      color: '#FFFFFF',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
