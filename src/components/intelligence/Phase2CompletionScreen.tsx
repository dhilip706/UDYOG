import React from 'react';
import { SkillProfileAnalysis } from '../../types/skillIntelligence';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Compass,
  Award,
  Layers,
  ArrowLeft,
} from 'lucide-react';

interface Phase2CompletionScreenProps {
  analysis: SkillProfileAnalysis;
  companionName: string;
  onExploreLearning: () => void;
  onBackToDashboard: () => void;
}

export const Phase2CompletionScreen: React.FC<Phase2CompletionScreenProps> = ({
  analysis,
  companionName,
  onExploreLearning,
  onBackToDashboard,
}) => {
  const { t } = useLanguage();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        padding: '36px 20px',
        backgroundColor: '#071A3A',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="classic-navy-surface"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '40px 32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
          animation: 'classic-fade-in 0.4s ease-out',
        }}
      >
        {/* Top Badge */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(18, 54, 111, 0.8)',
              border: '2px solid var(--color-steel-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 0 24px rgba(42, 105, 186, 0.4)',
            }}
          >
            <ShieldCheck size={32} color="var(--color-steel-light)" />
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              fontWeight: 500,
              color: '#FFFFFF',
              marginBottom: '10px',
            }}
          >
            {t.skillIntelligence.finalSummaryTitle}
          </h1>

          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {t.skillIntelligence.finalSummarySubtitle}
          </p>
        </div>

        {/* 4-Corner Structured Summary Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* Box 1: Core Strengths */}
          <div
            style={{
              padding: '18px',
              borderRadius: '10px',
              background: 'rgba(7, 26, 58, 0.7)',
              border: '1px solid rgba(23, 74, 145, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Award size={18} color="var(--color-steel-light)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>
                {t.skillIntelligence.coreStrengthsTitle}
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              {analysis.strengths.slice(0, 3).map((st) => (
                <li key={st.id} style={{ marginBottom: '4px' }}>
                  {st.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Box 2: Skills to Develop */}
          <div
            style={{
              padding: '18px',
              borderRadius: '10px',
              background: 'rgba(7, 26, 58, 0.7)',
              border: '1px solid rgba(23, 74, 145, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Layers size={18} color="var(--color-steel-light)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>
                {t.skillIntelligence.readinessDeveloping}
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              {analysis.readiness.developing.slice(0, 3).map((sk, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>
                  {sk}
                </li>
              ))}
              {analysis.readiness.developing.length === 0 && (
                <li>Foundational technical workflows</li>
              )}
            </ul>
          </div>

          {/* Box 3: Potential Pathways */}
          <div
            style={{
              padding: '18px',
              borderRadius: '10px',
              background: 'rgba(7, 26, 58, 0.7)',
              border: '1px solid rgba(23, 74, 145, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Compass size={18} color="var(--color-steel-light)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>
                {t.skillIntelligence.pathwaysTitle}
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              {analysis.pathways.map((p) => (
                <li key={p.id} style={{ marginBottom: '4px' }}>
                  {p.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Box 4: Assessment Status */}
          <div
            style={{
              padding: '18px',
              borderRadius: '10px',
              background: 'rgba(7, 26, 58, 0.7)',
              border: '1px solid rgba(23, 74, 145, 0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <CheckCircle2 size={18} color="var(--color-steel-light)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>
                Assessment Status
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
              {analysis.assessmentResult?.completed ? (
                <div>
                  <span style={{ color: 'var(--color-steel-light)', fontWeight: 600 }}>Completed • </span>
                  Evaluation recorded. {analysis.assessmentResult.wellHandledAreas.length} demonstrated capability areas recognized.
                </div>
              ) : (
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Status: </span>
                  {analysis.assessmentDecision.outcome.replace(/_/g, ' ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Primary Phase 3 Entry CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={onExploreLearning}
            rightIcon={<ArrowRight size={18} />}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {t.skillIntelligence.exploreLearningPath}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToDashboard}
            leftIcon={<ArrowLeft size={16} />}
            style={{ justifyContent: 'center', color: 'var(--color-text-muted)' }}
          >
            {t.skillIntelligence.backToDashboard}
          </Button>
        </div>

        {/* Companion Sign-off */}
        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
          }}
        >
          {companionName} will remain with you in the next phase as you explore specialized training and certified opportunities.
        </div>
      </div>
    </div>
  );
};
