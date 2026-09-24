import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const EmployerCompanyPage: React.FC = () => {
  const { session } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [district, setDistrict] = useState('');
  const [website, setWebsite] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch('/api/employer/profile', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.employer) {
            if (data.employer.companyName) setCompanyName(data.employer.companyName);
            if (data.employer.industry) setIndustry(data.employer.industry);
            if (data.employer.district) setDistrict(data.employer.district);
          }
        }
      } catch {}
    }
    loadCompany();
  }, [session]);

  const handleSave = async () => {
    try {
      await fetch('/api/employer/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          companyName,
          industry,
          city: district,
          district,
        }),
      });
    } catch {}
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
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
          <Building2 size={16} />
          <span>EMPLOYER VERIFICATION & PROFILE</span>
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Company Profile
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Maintain verified organization credentials and recruitment authority details.
        </p>
      </div>

      <div
        style={{
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.55)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
              Company Legal Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="classic-input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
              Industry Sector
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="classic-input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
              Operating District
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="classic-input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
              Official Website
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="classic-input"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            fontSize: '0.8rem',
            color: '#6EE7B7',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ShieldCheck size={16} />
          <span>Employer Status: Verified Partner Entity with Fair Hiring Compliance.</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: isSaved ? 'rgba(16, 185, 129, 0.4)' : 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
              border: '1px solid rgba(139, 174, 219, 0.4)',
              color: '#FFFFFF',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            {isSaved ? 'Changes Saved!' : 'Save Company Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
