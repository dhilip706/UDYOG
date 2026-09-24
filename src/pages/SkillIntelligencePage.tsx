import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfileService } from '../services/profile/userProfileService';
import { SkillIntelligenceRepository } from '../services/intelligence/skillIntelligenceRepository';
import { SkillProfileAnalysis, ExtractedSkill, AssessmentResult } from '../types/skillIntelligence';
import { AnalysisTransitionView } from '../components/intelligence/AnalysisTransitionView';
import { SkillDashboardView } from '../components/intelligence/SkillDashboardView';
import { Phase2CompletionScreen } from '../components/intelligence/Phase2CompletionScreen';
import { StructuredUserProfile } from '../types/onboarding';

export const SkillIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StructuredUserProfile | null>(null);
  const [analysis, setAnalysis] = useState<SkillProfileAnalysis | null>(null);
  const [viewState, setViewState] = useState<'TRANSITION' | 'DASHBOARD' | 'COMPLETION'>('TRANSITION');

  useEffect(() => {
    const loadedProfile = UserProfileService.getProfile();
    if (loadedProfile) {
      setProfile(loadedProfile);
      const existingAnalysis = SkillIntelligenceRepository.generateOrLoadAnalysis(loadedProfile);
      setAnalysis(existingAnalysis);
    }
  }, []);

  const companionName = 'Aisha';

  const handleUpdateSkill = (skillId: string, updates: Partial<ExtractedSkill>) => {
    const updated = SkillIntelligenceRepository.updateSkill(skillId, updates);
    if (updated) setAnalysis({ ...updated });
  };

  const handleConfirmSkill = (skillId: string) => {
    const updated = SkillIntelligenceRepository.confirmSkill(skillId);
    if (updated) setAnalysis({ ...updated });
  };

  const handleRemoveSkill = (skillId: string) => {
    const updated = SkillIntelligenceRepository.removeSkill(skillId);
    if (updated) setAnalysis({ ...updated });
  };

  const handleUpdateStrength = (strengthId: string, updates: any) => {
    const updated = SkillIntelligenceRepository.updateStrength(strengthId, updates);
    if (updated) setAnalysis({ ...updated });
  };

  const handleConfirmStrength = (strengthId: string) => {
    const updated = SkillIntelligenceRepository.confirmStrength(strengthId);
    if (updated) setAnalysis({ ...updated });
  };

  const handleRemoveStrength = (strengthId: string) => {
    const updated = SkillIntelligenceRepository.removeStrength(strengthId);
    if (updated) setAnalysis({ ...updated });
  };

  const handleAssessmentCompleted = (result: AssessmentResult) => {
    const updated = SkillIntelligenceRepository.saveAssessmentResult(result);
    if (updated) setAnalysis({ ...updated });
  };

  if (!profile || !analysis) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.65)',
            borderRadius: '16px',
            padding: '36px 28px',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#FFFFFF', margin: '0 0 10px 0' }}>
            No Beneficiary Profile Found
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
            To analyze competencies, discover matching opportunities, and generate tailored bridging modules, start by completing your voice or conversational onboarding.
          </p>
          <button
            type="button"
            onClick={() => navigate('/onboarding')}
            style={{
              padding: '12px 26px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
              border: '1px solid rgba(139, 174, 219, 0.5)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Start Clean Onboarding
          </button>
        </div>
      </div>
    );
  }

  if (viewState === 'TRANSITION') {
    return (
      <AnalysisTransitionView
        companionName={companionName}
        onComplete={() => setViewState('DASHBOARD')}
      />
    );
  }

  if (viewState === 'COMPLETION') {
    return (
      <Phase2CompletionScreen
        analysis={analysis}
        companionName={companionName}
        onExploreLearning={() => {
          navigate('/learning');
        }}
        onBackToDashboard={() => setViewState('DASHBOARD')}
      />
    );
  }

  return (
    <SkillDashboardView
      analysis={analysis}
      companionName={companionName}
      onUpdateSkill={handleUpdateSkill}
      onConfirmSkill={handleConfirmSkill}
      onRemoveSkill={handleRemoveSkill}
      onUpdateStrength={handleUpdateStrength}
      onConfirmStrength={handleConfirmStrength}
      onRemoveStrength={handleRemoveStrength}
      onAssessmentCompleted={handleAssessmentCompleted}
      onProceedToCompletion={() => setViewState('COMPLETION')}
    />
  );
};
