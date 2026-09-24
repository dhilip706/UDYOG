import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MapPin, Clock } from 'lucide-react';

export const AdminBeneficiariesPage: React.FC = () => {
  const { session } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/beneficiaries', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setBeneficiaries(json.beneficiaries);
        }
      } catch {
        setBeneficiaries([]);
      }
    }
    load();
  }, [session]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
          Beneficiary Talent Inventory
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Verified job seeker profiles, evidence statuses, and regional distribution.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {beneficiaries.length === 0 ? (
          <div
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px dashed rgba(23, 74, 145, 0.65)',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '0 0 8px 0' }}>No Beneficiaries Registered</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              No job seeker profiles currently exist in the database. As users onboard, their verified competency records will be listed here.
            </p>
          </div>
        ) : (
          beneficiaries.map((b) => (
          <div
            key={b.id}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF' }}>{b.fullName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-steel-light)', marginTop: '2px' }}>
                  {b.currentOccupation}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {b.district}, {b.state}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {b.yearsExperience} Years Experience
                  </span>
                </div>
              </div>

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
                Verified Profile
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
              {b.skills?.map((sk: any, idx: number) => (
                <span
                  key={idx}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: sk.evidenceStatus === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(23, 74, 145, 0.4)',
                    border: sk.evidenceStatus === 'CONFIRMED' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(139, 174, 219, 0.3)',
                    fontSize: '0.72rem',
                    color: sk.evidenceStatus === 'CONFIRMED' ? '#6EE7B7' : '#FFFFFF',
                  }}
                >
                  {sk.name} ({sk.evidenceStatus})
                </span>
              ))}
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};
