import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Building2 } from 'lucide-react';

export const AdminEmployersPage: React.FC = () => {
  const { session } = useAuth();
  const [employers, setEmployers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/employers', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setEmployers(json.employers);
        }
      } catch {
        setEmployers([]);
      }
    }
    load();
  }, [session]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
          Employer Verification & Oversight
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Registered hiring organizations, verified legal identities, and fair recruitment compliance.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {employers.length === 0 ? (
          <div
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px dashed rgba(23, 74, 145, 0.65)',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '0 0 8px 0' }}>No Employers Registered</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              No employer accounts currently exist in the database. Organizations will appear here upon registration and verification.
            </p>
          </div>
        ) : (
          employers.map((emp) => (
          <div
            key={emp.id}
            style={{
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '12px',
              padding: '18px 22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={18} color="var(--color-steel-light)" />
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF' }}>{emp.displayName}</span>
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
                  Verified Entity
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Contact Email: {emp.email || 'N/A'} • Role: {emp.role}
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>
              Compliance Active
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};
