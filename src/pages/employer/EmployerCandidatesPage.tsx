import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Users, Sparkles, Phone } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const EmployerCandidatesPage: React.FC = () => {
  const { session } = useAuth();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionStatuses, setActionStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCandidates() {
      try {
        const res = await fetch('/api/employer/candidates', {
          headers: { Authorization: `Bearer ${session?.token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCandidates(data.candidates);
        } else {
          setCandidates([]);
        }
      } catch {
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCandidates();
  }, [session]);

  const handlePipelineAction = (profileId: string, newStage: string) => {
    setActionStatuses((prev) => ({
      ...prev,
      [profileId]: newStage,
    }));
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out', paddingBottom: '60px' }}>
      {/* Header */}
      <div
        className="classic-navy-surface"
        style={{
          padding: '24px 28px',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(11, 36, 82, 0.95) 0%, rgba(18, 54, 111, 0.85) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Users size={16} />
          <span>EXPLAINABLE CANDIDATE MATCHING</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Matched Talent Discovery
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '640px' }}>
          Explainable matching factors based on verified competencies, local proximity, and practical experience. No arbitrary opaque percentage scores.
        </p>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-steel-light)', textAlign: 'center', padding: '40px' }}>
          Analyzing candidate competency alignments...
        </div>
      ) : candidates.length === 0 ? (
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
          <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF', margin: '0 0 8px 0' }}>No Matched Candidates Yet</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
            When beneficiaries with verified skills match your published job requirements, their explainable competency profiles and bridging recommendations will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {candidates.map((cand) => {
            const currentAction = actionStatuses[cand.profileId] || cand.status;

            return (
              <div
                key={cand.profileId}
                className="classic-navy-surface"
                style={{
                  padding: '24px',
                  background: 'rgba(11, 36, 82, 0.9)',
                }}
              >
                {/* Candidate Overview Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                        {cand.fullName}
                      </h2>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(23, 74, 145, 0.6)', color: 'var(--color-steel-light)' }}>
                        {cand.yearsExperience} Yrs Experience
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      {cand.currentOccupation} • {cand.district}, {cand.state} • For: <strong>{cand.targetJobTitle}</strong>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      background: currentAction === 'Interview' ? 'rgba(59, 130, 246, 0.25)' : currentAction === 'Shortlisted' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(23, 74, 145, 0.5)',
                      color: currentAction === 'Interview' ? '#93C5FD' : currentAction === 'Shortlisted' ? '#34D399' : 'var(--color-steel-light)',
                      border: '1px solid rgba(139, 174, 219, 0.35)',
                    }}
                  >
                    Pipeline Status: {currentAction}
                  </span>
                </div>

                {/* Explainable AI Match Note */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.75)',
                    border: '1px solid rgba(23, 74, 145, 0.4)',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '2px' }}>
                    <Sparkles size={14} />
                    <span>Explainable Matching Factor:</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.45 }}>
                    {cand.whyMatches}
                  </p>
                </div>

                {/* Grid Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.82rem', marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Education</span>
                    <span style={{ color: '#FFFFFF' }}>{cand.education}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Availability</span>
                    <span style={{ color: '#FFFFFF' }}>{cand.availability}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Work Preferences</span>
                    <span style={{ color: '#FFFFFF' }}>{cand.workPreferences}</span>
                  </div>
                </div>

                {/* Competency Tags & Gap Closing Recommendation */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    {cand.matchedSkills.map((sk: string, i: number) => (
                      <span key={i} style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.18)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                        ✓ Demonstrated: {sk}
                      </span>
                    ))}
                    {cand.missingSkills.map((sk: string, i: number) => (
                      <span key={i} style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                        Gap: {sk}
                      </span>
                    ))}
                  </div>

                  {cand.trainingToCloseGaps && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      <strong>Bridge Training Suggested: </strong>
                      {cand.trainingToCloseGaps}
                    </div>
                  )}
                </div>

                {/* Pipeline Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid rgba(23, 74, 145, 0.35)', paddingTop: '14px' }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePipelineAction(cand.profileId, 'Rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Phone size={13} />}
                    onClick={() => handlePipelineAction(cand.profileId, 'Contacted')}
                  >
                    Contact Candidate
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePipelineAction(cand.profileId, 'Shortlisted')}
                  >
                    Shortlist
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handlePipelineAction(cand.profileId, 'Interview')}
                  >
                    Schedule Interview
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
