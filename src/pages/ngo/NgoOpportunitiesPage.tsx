import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { JobOpportunity, BeneficiaryProfile } from '../../types/ngo';
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  CheckCircle2,
  Sparkles,
  DollarSign,
  UserCheck,
  Building2,
  Info,
} from 'lucide-react';

export const NgoOpportunitiesPage: React.FC = () => {
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryProfile[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedWorkType, setSelectedWorkType] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [recommendTargetProfileId, setRecommendTargetProfileId] = useState('');
  const [recommendSuccess, setRecommendSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [jobs, bens] = await Promise.all([
        ngoService.getOpportunities(),
        ngoService.getBeneficiaries(),
      ]);
      setOpportunities(jobs);
      setBeneficiaries(bens);
    }
    loadData();
  }, []);

  const filteredJobs = opportunities.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.employerName.toLowerCase().includes(search.toLowerCase()) ||
      job.requiredSkills.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesDistrict =
      selectedDistrict === 'ALL' || job.district === selectedDistrict;

    const matchesType =
      selectedWorkType === 'ALL' || job.jobType === selectedWorkType;

    return matchesSearch && matchesDistrict && matchesType;
  });

  const handleRecommend = (job: JobOpportunity) => {
    setSelectedJob(job);
    setRecommendTargetProfileId(beneficiaries[0]?.id || '');
    setRecommendSuccess(false);
  };

  const submitRecommendation = () => {
    if (!selectedJob || !recommendTargetProfileId) return;
    setRecommendSuccess(true);
    setTimeout(() => {
      setSelectedJob(null);
      setRecommendSuccess(false);
    }, 1800);
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Briefcase size={16} />
          <span>EMPLOYER OPPORTUNITIES & LOCAL JOBS</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Opportunity Discovery
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Explore verified employer positions and community livelihood openings. Match candidates transparently based on demonstrated competence and geographic preferences.
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
          marginBottom: '20px',
          fontSize: '0.82rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <Info size={18} color="#8BAEDB" style={{ flexShrink: 0 }} />
        <span>
          <strong>DEMO DATA:</strong> Openings displayed are curated partner opportunities within the Salem & Coimbatore pilot cluster. All matches include explainable skill rationale before beneficiary submission.
        </span>
      </div>

      {/* Filters & Search */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.88)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '22px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flex: '1 1 300px', position: 'relative' }}>
          <Search size={16} color="var(--color-steel-light)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, employer or skill (e.g. diagnostics, solar)..."
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              background: 'rgba(7, 26, 58, 0.75)',
              border: '1px solid rgba(23, 74, 145, 0.6)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '8px',
              background: 'rgba(7, 26, 58, 0.9)',
              border: '1px solid rgba(23, 74, 145, 0.6)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Districts</option>
            <option value="Salem">Salem</option>
            <option value="Coimbatore">Coimbatore</option>
          </select>

          <select
            value={selectedWorkType}
            onChange={(e) => setSelectedWorkType(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '8px',
              background: 'rgba(7, 26, 58, 0.9)',
              border: '1px solid rgba(23, 74, 145, 0.6)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="APPRENTICESHIP">Apprenticeship</option>
            <option value="CONTRACT">Contract</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              background: 'rgba(11, 36, 82, 0.88)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              borderRadius: '14px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(23, 74, 145, 0.5)',
                    color: '#8BAEDB',
                  }}
                >
                  {job.jobType.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building2 size={13} /> {job.openingsCount} Openings
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                {job.title}
              </h3>

              <div style={{ fontSize: '0.82rem', color: '#8BAEDB', marginBottom: '10px' }}>
                {job.employerName}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="var(--color-steel-light)" />
                  {job.district}, {job.state}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <DollarSign size={13} color="var(--color-steel-light)" />
                  ₹{job.salaryMin?.toLocaleString()} - ₹{job.salaryMax?.toLocaleString()}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} color="var(--color-steel-light)" />
                  {job.minExperienceYears}y exp
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0 0 14px 0', lineHeight: 1.45 }}>
                {job.description}
              </p>

              {/* Skills Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {job.requiredSkills.map((s: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(7, 26, 58, 0.8)',
                      border: '1px solid rgba(23, 74, 145, 0.4)',
                      color: 'var(--color-steel-light)',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(23, 74, 145, 0.35)' }}>
              <button
                type="button"
                onClick={() => handleRecommend(job)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                  border: '1px solid #8BAEDB',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <UserCheck size={14} />
                <span>Recommend Beneficiary</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommend Modal */}
      {selectedJob && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 10, 24, 0.78)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(11, 36, 82, 0.98)',
              border: '1px solid rgba(139, 174, 219, 0.45)',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Recommend for Opportunity
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-steel-light)', margin: '0 0 16px 0' }}>
              {selectedJob.title} • {selectedJob.employerName}
            </p>

            {recommendSuccess ? (
              <div
                style={{
                  padding: '20px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  color: '#34D399',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={32} style={{ margin: '0 auto 8px auto', display: 'block' }} />
                Beneficiary successfully linked with explainable match record!
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-steel-light)', marginBottom: '6px' }}>
                  Select Beneficiary Profile
                </label>
                <select
                  value={recommendTargetProfileId}
                  onChange={(e) => setRecommendTargetProfileId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.95)',
                    border: '1px solid rgba(23, 74, 145, 0.6)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                    outline: 'none',
                  }}
                >
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.fullName} ({b.currentOccupation} • {b.district})
                    </option>
                  ))}
                </select>

                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.7)',
                    border: '1px solid rgba(23, 74, 145, 0.4)',
                    fontSize: '0.78rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '20px',
                  }}
                >
                  <Sparkles size={14} color="#8BAEDB" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                  AI Matching will verify mandatory tool competencies and location alignment before transmitting profile.
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid rgba(23, 74, 145, 0.5)',
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitRecommendation}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                      border: '1px solid #8BAEDB',
                      color: '#FFFFFF',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Recommendation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
