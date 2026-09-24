import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { BeneficiaryProfile, JobOpportunity, MatchAnalysis } from '../../types/ngo';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Send,
  Info,
} from 'lucide-react';

export const NgoMatchingPage: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryProfile[]>([]);
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [matchAnalysis, setMatchAnalysis] = useState<MatchAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [bens, jobs] = await Promise.all([
        ngoService.getBeneficiaries(),
        ngoService.getOpportunities(),
      ]);
      setBeneficiaries(bens);
      setOpportunities(jobs);
      if (bens.length > 0 && jobs.length > 0) {
        setSelectedProfileId(bens[0].id);
        setSelectedJobId(jobs[0].id);
        runEvaluation(bens[0].id, jobs[0].id);
      }
    }
    loadData();
  }, []);

  const runEvaluation = async (pId: string, jId: string) => {
    if (!pId || !jId) return;
    setLoading(true);
    setAppliedSuccess(false);
    try {
      const result = await ngoService.getMatchAnalysis(pId, jId);
      setMatchAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (id: string) => {
    setSelectedProfileId(id);
    runEvaluation(id, selectedJobId);
  };

  const handleJobChange = (id: string) => {
    setSelectedJobId(id);
    runEvaluation(selectedProfileId, id);
  };

  const handleApplyWithConsent = () => {
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
          <Sparkles size={16} />
          <span>EXPLAINABLE AI MATCHING ENGINE</span>
        </div>
        <h1 style={{ fontSize: '1.55rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
          Explainable Candidate Matching
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
          Deterministic, explainable skill alignment. We inspect proven technical capabilities, location preferences, and training completions rather than black-box opaque percentages.
        </p>
      </div>

      {/* Selectors Bar */}
      <div
        style={{
          background: 'rgba(11, 36, 82, 0.88)',
          border: '1px solid rgba(23, 74, 145, 0.5)',
          borderRadius: '14px',
          padding: '20px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-steel-light)', marginBottom: '8px', fontWeight: 600 }}>
            1. Select Beneficiary
          </label>
          <select
            value={selectedProfileId}
            onChange={(e) => handleProfileChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(7, 26, 58, 0.95)',
              border: '1px solid rgba(23, 74, 145, 0.6)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.fullName} — {b.currentOccupation} ({b.district})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-steel-light)', marginBottom: '8px', fontWeight: 600 }}>
            2. Select Opportunity Requisition
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => handleJobChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(7, 26, 58, 0.95)',
              border: '1px solid rgba(23, 74, 145, 0.6)',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {opportunities.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} — {j.employerName} ({j.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Match Results Card */}
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-steel-light)', fontSize: '0.85rem' }}>
          <Sparkles size={24} color="#8BAEDB" style={{ margin: '0 auto 12px auto' }} />
          <div>Evaluating explainable skill alignment and geographic fit...</div>
        </div>
      ) : matchAnalysis && (
        <div
          style={{
            background: 'rgba(11, 36, 82, 0.95)',
            border: '1px solid rgba(139, 174, 219, 0.45)',
            borderRadius: '16px',
            padding: '26px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '22px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                MATCH ASSESSMENT SUMMARY
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#FFFFFF', margin: '4px 0 6px 0' }}>
                {matchAnalysis.jobTitle}
              </h2>
              <div style={{ fontSize: '0.88rem', color: '#8BAEDB' }}>
                Employer: <strong>{matchAnalysis.employerName}</strong> • Candidate: <strong>{matchAnalysis.profileName}</strong>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'rgba(7, 26, 58, 0.85)',
                border: '1px solid rgba(23, 74, 145, 0.6)',
              }}
            >
              <div>
                <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>
                  {matchAnalysis.matchScore}%
                </div>
                <div style={{ fontSize: '0.68rem', color: '#8BAEDB', textTransform: 'uppercase', marginTop: '2px' }}>
                  Alignment Score
                </div>
              </div>
              <Sparkles size={24} color="#8BAEDB" />
            </div>
          </div>

          {/* Explainable Narrative */}
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '10px',
              background: 'rgba(23, 74, 145, 0.25)',
              border: '1px solid rgba(139, 174, 219, 0.3)',
              marginBottom: '26px',
              fontSize: '0.85rem',
              color: '#FFFFFF',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 600, color: '#8BAEDB', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={15} />
              <span>Why This Opportunity Matches:</span>
            </div>
            {matchAnalysis.whyThisMatchesSummary}
          </div>

          {/* Evidence Grid: Matched Factors vs Needs Development */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '26px' }}>
            {/* Positive Factors */}
            <div
              style={{
                background: 'rgba(7, 26, 58, 0.75)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '18px',
              }}
            >
              <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#34D399', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                <span>Demonstrated Competencies & Alignments</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {matchAnalysis.explainableFactors.matchedSkillsList.map((skill, sIdx) => (
                  <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#FFFFFF' }}>
                    <span style={{ color: '#34D399', fontWeight: 700 }}>✓</span>
                    <span>{skill} (Demonstrated Skill)</span>
                  </div>
                ))}

                {matchAnalysis.explainableFactors.isLocalLocationPreferenceMet && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#FFFFFF' }}>
                    <span style={{ color: '#34D399', fontWeight: 700 }}>✓</span>
                    <span>Local Geographic Alignment ({matchAnalysis.explainableFactors.locationDetails})</span>
                  </div>
                )}

                {matchAnalysis.explainableFactors.isExperienceRequirementMet && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#FFFFFF' }}>
                    <span style={{ color: '#34D399', fontWeight: 700 }}>✓</span>
                    <span>Experience Verified ({matchAnalysis.explainableFactors.experienceDetails})</span>
                  </div>
                )}

                {matchAnalysis.explainableFactors.relevantTrainingCompleted && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#FFFFFF' }}>
                    <span style={{ color: '#34D399', fontWeight: 700 }}>✓</span>
                    <span>Formal Training Module Completed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Needs Development */}
            <div
              style={{
                background: 'rgba(7, 26, 58, 0.75)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '18px',
              }}
            >
              <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FBBF24', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={16} />
                <span>Areas Needing Development or Follow-up</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {matchAnalysis.explainableFactors.areasNeedingDevelopment.length > 0 ? (
                  matchAnalysis.explainableFactors.areasNeedingDevelopment.map((gap, gIdx) => (
                    <div key={gIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#FFFFFF' }}>
                      <span style={{ color: '#FBBF24', fontWeight: 700 }}>○</span>
                      <span>{gap} (Recommended for bridge training)</span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    No significant skill gaps identified. Fully ready for placement.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderTop: '1px solid rgba(23, 74, 145, 0.4)', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)' }}>
              Candidate will be notified via SMS/voice in their preferred language upon submission.
            </div>

            {appliedSuccess ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399', fontSize: '0.85rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} />
                Application Submitted with Beneficiary Consent!
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApplyWithConsent}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
                  border: '1px solid #8BAEDB',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Send size={15} />
                <span>Submit Application with Beneficiary Consent</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
