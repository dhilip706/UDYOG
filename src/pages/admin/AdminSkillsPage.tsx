import React, { useEffect, useState } from 'react';

export const AdminSkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/skills');
        if (res.ok) {
          const json = await res.json();
          setSkills(json.skills);
        }
      } catch {
        setSkills(['Engine Diagnostics', 'OBD-II Scanning', 'Brake Systems', 'EV High Voltage Safety', 'Solar Inverter Configuration']);
      }
    }
    load();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
          Skill Taxonomy & Evidence Audit
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Standardized competencies mapped across 7 core industrial sectors.
        </p>
      </div>

      <div
        style={{
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '14px',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '14px' }}>
          Standardized Competency Inventory ({skills.length} Registered Competencies)
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {skills.map((sk, idx) => (
            <span
              key={idx}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(23, 74, 145, 0.4)',
                border: '1px solid rgba(139, 174, 219, 0.35)',
                fontSize: '0.8rem',
                color: '#FFFFFF',
              }}
            >
              {sk}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
