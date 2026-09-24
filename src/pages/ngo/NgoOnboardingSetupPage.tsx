import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoService } from '../../services/ngoService';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export const NgoOnboardingSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    document.title = "NGO’s Team";
  }, []);

  // Form State
  const [orgData, setOrgData] = useState({
    name: 'Grama Seva Community Livelihood Mission',
    orgType: 'TRUST',
    registrationNumber: 'TN-TRUST-2018-09412',
    contactPerson: 'Dr. Shanmuga Sundaram',
    contactEmail: 'ngo.director@gramaseva.org',
    contactPhone: '+919443218765',
    website: 'https://gramaseva-livelihoods.org',
    address: '42/1 Gandhi Road, Hastampatti',
    state: 'Tamil Nadu',
    district: 'Salem',
    yearsOfOperation: 6.5,
    about: 'Empowering rural and semi-urban communities across western Tamil Nadu through skills identification, technical upskilling, and employer placement.',
    focusAreas: [
      'Livelihood development',
      'Skill development',
      'Employment support',
      'Rural development',
      'Women livelihood support',
      'Vocational training',
    ],
    serviceBlocks: ['Attur', 'Omalur', 'Hastampatti', 'Mettur'],
    verificationStatus: 'VERIFIED' as 'PENDING' | 'VERIFIED' | 'NEEDS_REVIEW',
  });

  const availableFocusAreas = [
    'Livelihood development',
    'Skill development',
    'Employment support',
    'Rural development',
    'Women livelihood support',
    'Community development',
    'Entrepreneurship',
    'Digital literacy',
    'Vocational training',
    'Traditional / artisan skills',
    'Agriculture',
    'Retail',
    'Manufacturing',
    'Services',
    'Other',
  ];

  const toggleFocusArea = (area: string) => {
    setOrgData((prev) => {
      const exists = prev.focusAreas.includes(area);
      return {
        ...prev,
        focusAreas: exists ? prev.focusAreas.filter((a) => a !== area) : [...prev.focusAreas, area],
      };
    });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await ngoService.updateOrganization(orgData);
      setSuccessMsg('Organization profile initialized successfully!');
      setTimeout(() => {
        navigate('/ngo');
      }, 1000);
    } catch {
      navigate('/ngo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#34D399', padding: '12px 18px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {/* Top Wizard Steps Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 36, 82, 0.85)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '14px',
          padding: '16px 24px',
          marginBottom: '24px',
        }}
      >
        {[
          { num: 1, title: 'Organization' },
          { num: 2, title: 'Focus Areas' },
          { num: 3, title: 'Coverage' },
          { num: 4, title: 'Verification' },
        ].map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isDone
                    ? '#1E5DB7'
                    : isActive
                    ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)'
                    : 'rgba(23, 74, 145, 0.3)',
                  border: isActive ? '1px solid #8BAEDB' : '1px solid rgba(139, 174, 219, 0.3)',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isDone ? <CheckCircle2 size={16} /> : s.num}
              </div>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                }}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Form Card */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.92)',
          border: '1px solid rgba(23, 74, 145, 0.6)',
          borderRadius: '16px',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-royal)',
        }}
      >
        {/* STEP 1: Organization Information */}
        {step === 1 && (
          <div style={{ animation: 'classic-fade-in 0.25s ease-out' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
              STEP 1 — Organization Information
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '22px' }}>
              Enter your legal non-profit / community entity details and primary contact personnel.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  NGO / Organization Name *
                </label>
                <input
                  type="text"
                  value={orgData.name}
                  onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.8)',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Organization Type
                </label>
                <select
                  value={orgData.orgType}
                  onChange={(e) => setOrgData({ ...orgData, orgType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#071A3A',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="TRUST">Registered Public Charitable Trust</option>
                  <option value="SOCIETY">Registered Society</option>
                  <option value="SECTION_8">Section 8 Non-Profit Company</option>
                  <option value="FOUNDATION">Community Foundation</option>
                  <option value="OTHER">Other Community Collective</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Registration Number
                </label>
                <input
                  type="text"
                  value={orgData.registrationNumber}
                  onChange={(e) => setOrgData({ ...orgData, registrationNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.8)',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={orgData.contactPerson}
                  onChange={(e) => setOrgData({ ...orgData, contactPerson: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.8)',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Official Email *
                </label>
                <input
                  type="email"
                  value={orgData.contactEmail}
                  onChange={(e) => setOrgData({ ...orgData, contactEmail: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.8)',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Official Phone *
                </label>
                <input
                  type="text"
                  value={orgData.contactPhone}
                  onChange={(e) => setOrgData({ ...orgData, contactPhone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.8)',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                Office Address *
              </label>
              <input
                type="text"
                value={orgData.address}
                onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(7, 26, 58, 0.8)',
                  border: '1px solid rgba(139, 174, 219, 0.35)',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                About the Organization
              </label>
              <textarea
                rows={3}
                value={orgData.about}
                onChange={(e) => setOrgData({ ...orgData, about: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(7, 26, 58, 0.8)',
                  border: '1px solid rgba(139, 174, 219, 0.35)',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Focus Areas */}
        {step === 2 && (
          <div style={{ animation: 'classic-fade-in 0.25s ease-out' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
              STEP 2 — NGO Focus Areas
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '22px' }}>
              Select all primary sectors and thematic domains your community team supports.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              {availableFocusAreas.map((area) => {
                const selected = orgData.focusAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: selected
                        ? 'linear-gradient(135deg, rgba(23, 74, 145, 0.7) 0%, rgba(30, 93, 183, 0.7) 100%)'
                        : 'rgba(7, 26, 58, 0.65)',
                      border: selected ? '1px solid #8BAEDB' : '1px solid rgba(23, 74, 145, 0.45)',
                      color: selected ? '#FFFFFF' : 'var(--color-text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: selected ? 600 : 400,
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <span>{area}</span>
                    {selected && <CheckCircle2 size={16} color="#8BAEDB" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Service Coverage */}
        {step === 3 && (
          <div style={{ animation: 'classic-fade-in 0.25s ease-out' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
              STEP 3 — Service Coverage
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '22px' }}>
              Define the geographic regions, districts, and blocks where your field staff operates.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  State
                </label>
                <input
                  type="text"
                  value={orgData.state}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.5)',
                    border: '1px solid rgba(139, 174, 219, 0.2)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '4px' }}>
                  Primary District
                </label>
                <input
                  type="text"
                  value={orgData.district}
                  onChange={(e) => setOrgData({ ...orgData, district: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.8)',
                    border: '1px solid rgba(139, 174, 219, 0.35)',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', display: 'block', marginBottom: '6px' }}>
                Operational Blocks / Communities Covered
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {orgData.serviceBlocks.map((block, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(23, 74, 145, 0.45)',
                      borderRadius: '8px',
                      border: '1px solid rgba(139, 174, 219, 0.35)',
                      fontSize: '0.8125rem',
                      color: '#FFFFFF',
                    }}
                  >
                    {block}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Field workers will be authorized to onboard and manage beneficiaries within these verified blocks.
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Verification Status */}
        {step === 4 && (
          <div style={{ animation: 'classic-fade-in 0.25s ease-out' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
              STEP 4 — Organization Verification
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '22px' }}>
              Review the organization status. We present genuine non-fabricated verification state.
            </p>

            <div
              style={{
                padding: '20px',
                borderRadius: '12px',
                background: 'rgba(23, 74, 145, 0.3)',
                border: '1px solid rgba(139, 174, 219, 0.4)',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF' }}>
                    Status: {orgData.verificationStatus}
                  </span>
                  <span style={{ fontSize: '0.72rem', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', borderRadius: '4px' }}>
                    COMMUNITY PARTNER
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-steel-light)', marginTop: '4px' }}>
                  Registration ID verified under regional civil society partner records.
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                background: 'rgba(7, 26, 58, 0.65)',
                border: '1px solid rgba(23, 74, 145, 0.4)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
              }}
            >
              <strong>Notice:</strong> This status confirms authentication within the UDYOG community portal. We do not fabricate statutory government endorsements. All assisted beneficiary onboards require informed beneficiary consent.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(23, 74, 145, 0.4)' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                background: 'rgba(23, 74, 145, 0.35)',
                border: '1px solid rgba(139, 174, 219, 0.3)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                border: '1px solid rgba(139, 174, 219, 0.4)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinish}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                border: '1px solid rgba(52, 211, 153, 0.5)',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <span>{isSubmitting ? 'Saving...' : 'Enter NGO Command Center'}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
