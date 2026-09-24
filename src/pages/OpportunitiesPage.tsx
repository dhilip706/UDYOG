import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { UserProfileService } from '../services/profile/userProfileService';
import { LocationMatchingService, LocationMatchedJob, JobOpportunity } from '../services/intelligence/locationMatchingService';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const OpportunitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const profile = useMemo(() => {
    return UserProfileService.getProfile();
  }, []);

  const userDistrict = profile?.personal.district || profile?.workPreferences.preferredLocation || 'Coimbatore';
  const userState = profile?.personal.state || 'Tamil Nadu';
  const userSkills = (profile?.skills || []).map((s) => s.name);
  const userExpYears = profile?.livelihood.yearsOfExperience || 1.5;

  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [matchedJobs, setMatchedJobs] = useState<LocationMatchedJob[]>([]);

  useEffect(() => {
    async function loadOpportunities() {
      let liveJobs: JobOpportunity[] = [];
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          liveJobs = (data.jobs || []).map((j: any) => ({
            id: j.id,
            title: j.title,
            employerName: j.employerName || 'Employer',
            district: j.district || j.locationDistrict || '',
            state: j.state || 'Tamil Nadu',
            locality: j.locality || '',
            salaryMin: j.salaryMin || 0,
            salaryMax: j.salaryMax || 0,
            employmentType: j.employmentType || 'full-time',
            shift: j.shift || 'Day Shift',
            minExperienceYears: j.minExperienceYears || 0,
            requiredSkills: j.requiredSkills || [],
            preferredSkills: j.preferredSkills || [],
            requiredEducation: j.educationLevel || 'Not Specified',
            languageRequirements: j.languages || ['Tamil'],
            workingConditions: j.description || '',
            isDemo: false,
          }));
        }
      } catch {}

      try {
        const stored = localStorage.getItem('udyog_posted_jobs');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((pj: any) => {
              if (!liveJobs.some((j) => j.id === pj.id)) {
                liveJobs.push(pj);
              }
            });
          }
        }
      } catch {}

      const prioritized = LocationMatchingService.prioritizeOpportunities(
        liveJobs,
        userDistrict,
        userState,
        userSkills,
        userExpYears,
        currentLanguage
      );
      setMatchedJobs(prioritized);
    }

    loadOpportunities();
  }, [userDistrict, userState, userSkills, userExpYears, currentLanguage]);

  const filteredJobs = useMemo(() => {
    if (selectedTier === 'all') return matchedJobs;
    return matchedJobs.filter((m) => m.proximityPriority === parseInt(selectedTier));
  }, [matchedJobs, selectedTier]);

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out', paddingBottom: '60px' }}>
      {/* Header with Strict Location Matching Rule Notice */}
      <div
        className="classic-navy-surface"
        style={{
          padding: '24px 28px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(11, 36, 82, 0.95) 0%, rgba(18, 54, 111, 0.85) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
              <MapPin size={16} />
              <span>STRICT HOMETOWN-FIRST PROXIMITY RANKING</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
              Opportunities for You
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Ranked first by your home district (<strong style={{ color: '#fff' }}>{userDistrict}</strong>), followed by adjacent districts and state opportunities.
            </p>
          </div>

          {/* Proximity Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(7, 26, 58, 0.8)', padding: '4px', borderRadius: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Ranked' },
              { id: '1', label: `1. Home (${userDistrict})` },
              { id: '2', label: '2. Nearby Districts' },
              { id: '3', label: '3. Same State' },
              { id: '4', label: '4. Relocation' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTier(tab.id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 500,
                  color: selectedTier === tab.id ? '#FFFFFF' : 'var(--color-text-muted)',
                  background: selectedTier === tab.id ? 'var(--color-royal-bright)' : 'transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredJobs.length === 0 ? (
          <div
            className="classic-navy-surface"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              background: 'rgba(11, 36, 82, 0.9)',
              border: '1px dashed rgba(23, 74, 145, 0.65)',
              borderRadius: '14px',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', margin: '0 0 8px 0' }}>No opportunities available in your area yet.</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
              There are currently no active job vacancies in this area. When employers post openings matching your verified skills, they will appear here ranked by proximity.
            </p>
          </div>
        ) : (
          filteredJobs.map((matched) => {
          const { job, proximityPriority, proximityBadgeText, matchScore, matchedSkills, missingSkills, explanation } = matched;

          const isHometown = proximityPriority === 1;
          const isNearby = proximityPriority === 2;

          return (
            <div
              key={job.id}
              className="classic-navy-surface"
              style={{
                padding: '22px 24px',
                border: isHometown 
                  ? '1.5px solid rgba(52, 211, 153, 0.55)' 
                  : isNearby 
                  ? '1px solid rgba(139, 174, 219, 0.55)' 
                  : '1px solid rgba(23, 74, 145, 0.45)',
                boxShadow: isHometown ? '0 8px 24px rgba(16, 185, 129, 0.12)' : 'var(--shadow-royal)',
                position: 'relative',
              }}
            >
              {/* Top Meta Line: Proximity Badge & Explainable Score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    background: isHometown ? 'rgba(16, 185, 129, 0.2)' : isNearby ? 'rgba(23, 74, 145, 0.5)' : 'rgba(7, 26, 58, 0.8)',
                    color: isHometown ? '#34D399' : 'var(--color-steel-light)',
                    border: isHometown ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(139, 174, 219, 0.3)',
                  }}
                >
                  <MapPin size={12} />
                  <span>{proximityBadgeText}</span>
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Match Signal:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: matchScore >= 75 ? '#34D399' : '#FBBF24' }}>
                    {matchScore}/100
                  </span>
                </div>
              </div>

              {/* Job Title & Employer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                    {job.title}
                  </h2>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {job.employerName} • {job.locality ? `${job.locality}, ` : ''}{job.district}, {job.state}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF' }}>
                    ₹{job.salaryMin.toLocaleString('en-IN')} - ₹{job.salaryMax.toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>monthly compensation</span>
                </div>
              </div>

              {/* Explainable AI Match Note */}
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(7, 26, 58, 0.65)',
                  border: '1px solid rgba(23, 74, 145, 0.4)',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '2px' }}>
                  <Sparkles size={13} />
                  <span>Transparent Match Explanation:</span>
                </div>
                <span>{explanation}</span>
              </div>

              {/* Skills Tags & Missing Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {matchedSkills.map((sk, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.74rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                    }}
                  >
                    ✓ {sk}
                  </span>
                ))}
                {missingSkills.map((sk, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.74rem',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#F87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    + Training Available: {sk}
                  </span>
                ))}
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Min Experience: {job.minExperienceYears} Years • Shift: {job.shift || 'Day'}
                </span>

                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight size={15} />}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  View Details & Apply
                </Button>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
