import React, { useState } from 'react';
import {
  SkillProfileAnalysis,
  ExtractedSkill,
  CoreStrength,
  AssessmentResult,
} from '../../types/skillIntelligence';
import { useLanguage } from '../../hooks/useLanguage';
import { voiceService } from '../../services/voice/voiceService';
import { Button } from '../ui/Button';
import { SkillEditModal } from './SkillEditModal';
import { StrengthEditModal } from './StrengthEditModal';
import { AdaptiveAssessmentModal } from './AdaptiveAssessmentModal';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  Check,
  Award,
  Sparkles,
  Volume2,
  Compass,
  Layers,
  ArrowRight,
  Briefcase,
  Target,
} from 'lucide-react';

interface SkillDashboardViewProps {
  analysis: SkillProfileAnalysis;
  companionName: string;
  onUpdateSkill: (skillId: string, updates: Partial<ExtractedSkill>) => void;
  onConfirmSkill: (skillId: string) => void;
  onRemoveSkill: (skillId: string) => void;
  onUpdateStrength?: (strengthId: string, updates: Partial<CoreStrength>) => void;
  onConfirmStrength?: (strengthId: string) => void;
  onRemoveStrength?: (strengthId: string) => void;
  onAssessmentCompleted: (result: AssessmentResult) => void;
  onProceedToCompletion: () => void;
}

export const SkillDashboardView: React.FC<SkillDashboardViewProps> = ({
  analysis,
  companionName,
  onUpdateSkill,
  onConfirmSkill,
  onRemoveSkill,
  onUpdateStrength,
  onConfirmStrength,
  onRemoveStrength,
  onAssessmentCompleted,
  onProceedToCompletion,
}) => {
  const { t, currentLanguage } = useLanguage();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [editingSkill, setEditingSkill] = useState<ExtractedSkill | null>(null);
  const [editingStrength, setEditingStrength] = useState<CoreStrength | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);

  const filteredSkills = analysis.extractedSkills.filter((s) => {
    if (activeCategoryFilter === 'ALL') return true;
    return s.category === activeCategoryFilter;
  });

  const handleSpeakCompanion = () => {
    const text = `${t.skillIntelligence.companionGuidanceIntro} ${t.skillIntelligence.companionGuidanceReview}`;
    voiceService.speak(text, currentLanguage);
  };

  const getConfidenceBadge = (confidence: ExtractedSkill['confidence']) => {
    switch (confidence) {
      case 'CONFIRMED':
        return {
          label: t.skillIntelligence.confidenceConfirmed,
          color: '#8BAEDB',
          bg: 'rgba(23, 74, 145, 0.45)',
          border: 'rgba(139, 174, 219, 0.4)',
        };
      case 'SUPPORTED':
        return {
          label: t.skillIntelligence.confidenceSupported,
          color: '#A8C5E2',
          bg: 'rgba(18, 54, 111, 0.45)',
          border: 'rgba(84, 137, 203, 0.35)',
        };
      case 'NEEDS_VERIFICATION':
      default:
        return {
          label: t.skillIntelligence.confidenceNeedsVerification,
          color: 'var(--color-steel-light)',
          bg: 'rgba(7, 26, 58, 0.5)',
          border: 'rgba(139, 174, 219, 0.3)',
        };
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#071A3A',
        color: '#FFFFFF',
        padding: '36px 20px 80px',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* ================================================== */}
        {/* 1. HEADER & COMPANION GUIDANCE */}
        {/* ================================================== */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-steel-light)',
                fontWeight: 600,
              }}
            >
              Skill Intelligence Engine
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Explainable & Evidence-Based
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 2.35rem)',
              fontWeight: 500,
              color: '#FFFFFF',
              margin: '0 0 10px',
            }}
          >
            {t.skillIntelligence.dashboardTitle}
          </h1>

          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {t.skillIntelligence.dashboardSubtitle}
          </p>

          {/* Contextual Companion Bar */}
          <div
            className="classic-navy-surface"
            style={{
              marginTop: '20px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              border: '1px solid rgba(139, 174, 219, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(18, 54, 111, 0.9)',
                  border: '1.5px solid var(--color-steel-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={18} color="var(--color-steel-light)" />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
                  {companionName} (AI Companion Guide)
                </div>
                <div style={{ fontSize: '0.875rem', color: '#FFFFFF', lineHeight: 1.4 }}>
                  {t.skillIntelligence.companionGuidanceIntro}
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleSpeakCompanion}
              leftIcon={<Volume2 size={14} />}
              style={{ flexShrink: 0 }}
            >
              {t.onboarding.replayVoice}
            </Button>
          </div>
        </div>

        {/* ================================================== */}
        {/* 2. IDENTIFIED CORE STRENGTHS */}
        {/* ================================================== */}
        <section style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Award size={20} color="var(--color-steel-light)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
              {t.skillIntelligence.coreStrengthsTitle}
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
            {t.skillIntelligence.coreStrengthsSubtitle}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '14px',
            }}
          >
            {analysis.strengths.map((str) => (
              <div
                key={str.id}
                className="classic-navy-surface"
                style={{
                  padding: '18px 20px',
                  border: '1px solid rgba(23, 74, 145, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF' }}>
                      {str.title}
                    </div>
                    {str.userStatus === 'edited' && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: 'rgba(139, 174, 219, 0.2)',
                          color: 'var(--color-steel-light)',
                          fontWeight: 500,
                        }}
                      >
                        User-Refined
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
                    {str.rationale}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-steel-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginBottom: '12px',
                    }}
                  >
                    <ShieldCheck size={13} />
                    <span>Evidence: {str.evidence}</span>
                  </div>
                </div>

                {/* Strength User Actions */}
                <div
                  style={{
                    borderTop: '1px solid rgba(23, 74, 145, 0.25)',
                    paddingTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '6px',
                  }}
                >
                  {str.userStatus !== 'confirmed' && onConfirmStrength && (
                    <button
                      onClick={() => onConfirmStrength(str.id)}
                      title={t.skillIntelligence.confirmSkill}
                      style={{
                        background: 'rgba(23, 74, 145, 0.5)',
                        border: '1px solid rgba(139, 174, 219, 0.3)',
                        borderRadius: '4px',
                        color: 'var(--color-steel-light)',
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Check size={12} />
                      <span>{t.skillIntelligence.confirmSkill}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setEditingStrength(str)}
                    title="Edit Strength"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <Edit3 size={15} />
                  </button>

                  {onRemoveStrength && (
                    <button
                      onClick={() => onRemoveStrength(str.id)}
                      title="Remove Strength"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(229, 115, 115, 0.75)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* 3. EXTRACTED & CATEGORIZED SKILLS (WITH USER CORRECTION) */}
        {/* ================================================== */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="var(--color-steel-light)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
                  {t.skillIntelligence.skillsTitle}
                </h2>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                {t.skillIntelligence.skillsSubtitle}
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          {/* Dynamic Filter Pills: Only show categories supported by evidence */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              padding: '10px 0 16px',
            }}
          >
            {(() => {
              const categoryLabels: Record<string, string> = {
                TECHNICAL: t.skillIntelligence.filterTechnical,
                PRACTICAL: t.skillIntelligence.filterPractical,
                TOOLS_EQUIPMENT: t.skillIntelligence.filterTools,
                DIGITAL: t.skillIntelligence.filterDigital,
                TRADITIONAL: t.skillIntelligence.filterTraditional,
                COMMUNICATION: 'Communication',
                PROBLEM_SOLVING: 'Problem Solving',
                DOMAIN_KNOWLEDGE: 'Domain Knowledge',
                BUSINESS: 'Business & Enterprise',
                EDUCATION_CERTIFICATION: 'Education & Certifications',
              };

              const presentCategories = Array.from(new Set(analysis.extractedSkills.map((s) => s.category)));
              const filterTabs = [
                { id: 'ALL', label: t.skillIntelligence.filterAll },
                ...presentCategories.map((cat) => ({
                  id: cat,
                  label: categoryLabels[cat] || cat.replace(/_/g, ' '),
                })),
              ];

              return filterTabs.map((tab) => {
                const isActive = activeCategoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategoryFilter(tab.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: isActive ? 'var(--color-navy-light)' : 'rgba(11, 36, 82, 0.6)',
                      border: `1px solid ${isActive ? 'var(--color-steel-light)' : 'rgba(23, 74, 145, 0.4)'}`,
                      color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              });
            })()}
          </div>

          {/* Skills Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '14px',
            }}
          >
            {filteredSkills.map((sk) => {
              const badge = getConfidenceBadge(sk.confidence);
              return (
                <div
                  key={sk.id}
                  className="classic-navy-surface"
                  style={{
                    padding: '18px 20px',
                    border: '1px solid rgba(23, 74, 145, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Top Row: Category & Confidence */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: 'var(--color-text-muted)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      >
                        {sk.category.replace(/_/g, ' ')}
                      </span>

                      <span
                        style={{
                          fontSize: '0.6875rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          fontWeight: 600,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Skill Name */}
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
                      {sk.name}
                    </div>

                    {/* Supporting Evidence */}
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, marginBottom: '8px' }}>
                      <span style={{ color: 'var(--color-steel-light)', fontWeight: 500 }}>Evidence: </span>
                      {sk.evidence}
                    </div>

                    {/* Explicit Experience Duration Pill */}
                    {sk.experienceYears && sk.experienceYears > 0 ? (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.75rem',
                          color: 'var(--color-steel-light)',
                          background: 'rgba(23, 74, 145, 0.35)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          marginBottom: '12px',
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>Experience:</span>
                        <span>{sk.experienceYears} {sk.experienceYears === 1 ? 'year' : 'years'}</span>
                      </div>
                    ) : (
                      <div style={{ marginBottom: '12px' }} />
                    )}
                  </div>

                  {/* Bottom Row: Source & User Actions */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(23, 74, 145, 0.25)',
                      paddingTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Source: {sk.source}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {sk.userStatus !== 'confirmed' && (
                        <button
                          onClick={() => onConfirmSkill(sk.id)}
                          title={t.skillIntelligence.confirmSkill}
                          style={{
                            background: 'rgba(23, 74, 145, 0.5)',
                            border: '1px solid rgba(139, 174, 219, 0.3)',
                            borderRadius: '4px',
                            color: 'var(--color-steel-light)',
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Check size={12} />
                          <span>{t.skillIntelligence.confirmSkill}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setEditingSkill(sk)}
                        title={t.skillIntelligence.editSkill}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => onRemoveSkill(sk.id)}
                        title={t.skillIntelligence.removeSkill}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(229, 115, 115, 0.75)',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================== */}
        {/* 4. CURRENT SKILLS VS. INTERESTS VS. ASPIRATIONS */}
        {/* ================================================== */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Target size={20} color="var(--color-steel-light)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
              {t.skillIntelligence.interestsVsAspirationsTitle}
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
            {t.skillIntelligence.interestsVsAspirationsSubtitle}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Column 1: Current Skills */}
            <div
              className="classic-navy-surface"
              style={{
                padding: '20px',
                border: '1px solid rgba(23, 74, 145, 0.4)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '8px' }}>
                {t.skillIntelligence.currentSkillsLabel}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                Skills backed by reported hands-on experience today.
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: '#FFFFFF' }}>
                {analysis.extractedSkills.slice(0, 4).map((s) => (
                  <li key={s.id} style={{ marginBottom: '6px' }}>
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Interests */}
            <div
              className="classic-navy-surface"
              style={{
                padding: '20px',
                border: '1px solid rgba(23, 74, 145, 0.4)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '8px' }}>
                {t.skillIntelligence.interestsLabel}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                Activities or domains the user enjoys and wants to explore.
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: '#FFFFFF' }}>
                {analysis.interests.map((it, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    {it}
                  </li>
                ))}
                {analysis.interests.length === 0 && (
                  <li style={{ color: 'var(--color-text-muted)' }}>No additional hobby interests reported.</li>
                )}
              </ul>
            </div>

            {/* Column 3: Career Aspirations */}
            <div
              className="classic-navy-surface"
              style={{
                padding: '20px',
                border: '1px solid rgba(23, 74, 145, 0.4)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '8px' }}>
                {t.skillIntelligence.aspirationsLabel}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                Target vocational roles or entrepreneurial aspirations.
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: '#FFFFFF' }}>
                {analysis.aspirations.map((asp, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    {asp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 5. CAREER READINESS OVERVIEW (NO ARBITRARY PERCENTAGES) */}
        {/* ================================================== */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Briefcase size={20} color="var(--color-steel-light)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
              {t.skillIntelligence.careerReadinessTitle}
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 16px' }}>
            {t.skillIntelligence.careerReadinessSubtitle}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
            }}
          >
            {/* Box 1: Currently Ready */}
            <div
              className="classic-navy-surface"
              style={{
                padding: '18px',
                border: '1px solid rgba(23, 74, 145, 0.45)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#8BAEDB', marginBottom: '4px' }}>
                {t.skillIntelligence.readinessCurrentlyReady}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                {t.skillIntelligence.readinessCurrentlyReadyDesc}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8125rem', color: '#FFFFFF' }}>
                {analysis.readiness.currentlyReady.slice(0, 3).map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
                {analysis.readiness.currentlyReady.length === 0 && (
                  <li style={{ color: 'var(--color-text-muted)' }}>Building foundational readiness.</li>
                )}
              </ul>
            </div>

            {/* Box 2: Developing */}
            <div
              className="classic-navy-surface"
              style={{
                padding: '18px',
                border: '1px solid rgba(23, 74, 145, 0.45)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#A8C5E2', marginBottom: '4px' }}>
                {t.skillIntelligence.readinessDeveloping}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                {t.skillIntelligence.readinessDevelopingDesc}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8125rem', color: '#FFFFFF' }}>
                {analysis.readiness.developing.slice(0, 3).map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
                {analysis.readiness.developing.length === 0 && (
                  <li style={{ color: 'var(--color-text-muted)' }}>No intermediate gaps detected.</li>
                )}
              </ul>
            </div>

            {/* Box 3: Transferable */}
            <div
              className="classic-navy-surface"
              style={{
                padding: '18px',
                border: '1px solid rgba(23, 74, 145, 0.45)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#8BAEDB', marginBottom: '4px' }}>
                {t.skillIntelligence.readinessTransferable}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                {t.skillIntelligence.readinessTransferableDesc}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8125rem', color: '#FFFFFF' }}>
                {analysis.readiness.transferableOpportunities.slice(0, 3).map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Box 4: Needs Assessment */}
            <div
              className="classic-navy-surface"
              style={{
                padding: '18px',
                border: '1px solid rgba(23, 74, 145, 0.45)',
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                {t.skillIntelligence.readinessNeedsAssessment}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                {t.skillIntelligence.readinessNeedsAssessmentDesc}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.8125rem', color: '#FFFFFF' }}>
                {analysis.readiness.needsAssessment.slice(0, 3).map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{item}</li>
                ))}
                {analysis.readiness.needsAssessment.length === 0 && (
                  <li style={{ color: 'var(--color-text-muted)' }}>Verified profile contains adequate evidence.</li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* 6. POTENTIAL OCCUPATION PATHWAYS */}
        {/* ================================================== */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Compass size={20} color="var(--color-steel-light)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
              {t.skillIntelligence.pathwaysTitle}
            </h2>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 18px' }}>
            {t.skillIntelligence.pathwaysSubtitle}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {analysis.pathways.map((pathway) => (
              <div
                key={pathway.id}
                className="classic-navy-surface"
                style={{
                  padding: '24px',
                  border: '1px solid rgba(23, 74, 145, 0.45)',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-steel-light)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {pathway.sector}
                      </span>
                      {pathway.ncoCodeEquivalent && (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(23, 74, 145, 0.4)',
                            color: 'var(--color-steel-light)',
                          }}
                        >
                          {pathway.ncoCodeEquivalent} {pathway.nsqfLevelEquivalent ? `• Level ${pathway.nsqfLevelEquivalent} Eq.` : ''}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
                      {pathway.title}
                    </h3>
                  </div>

                  {/* Ethical Compliance Disclaimer Badge */}
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      background: 'rgba(7, 26, 58, 0.8)',
                      border: '1px solid rgba(139, 174, 219, 0.3)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {pathway.sourceNotice}
                  </span>
                </div>

                {/* Explainability Quad: 4-Point Rationalization */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '12px',
                    marginBottom: '18px',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.55)',
                    border: '1px solid rgba(23, 74, 145, 0.3)',
                  }}
                >
                  {/* Point 1: Why it fits */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      WHY THIS PATHWAY FITS
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#FFFFFF', lineHeight: 1.4 }}>
                      {pathway.explainability?.why || pathway.rationale}
                    </div>
                  </div>

                  {/* Point 2: Supporting Evidence */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      SUPPORTING EVIDENCE
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      {pathway.explainability?.evidence || 'Supported by reported vocational history.'}
                    </div>
                  </div>

                  {/* Point 3: Potential Gaps */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      POTENTIAL MISSING SKILLS
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      {pathway.explainability?.gaps || pathway.potentialGaps.join(', ')}
                    </div>
                  </div>

                  {/* Point 4: Next Action */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      RECOMMENDED ACTION
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      {pathway.explainability?.nextStep || 'Explore targeted curriculum and trade verification.'}
                    </div>
                  </div>
                </div>

                {/* Grid: Existing Skills vs Gaps */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '14px',
                    marginBottom: '16px',
                  }}
                >
                  {/* Existing Skills */}
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      background: 'rgba(7, 26, 58, 0.6)',
                      border: '1px solid rgba(23, 74, 145, 0.35)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: '#8BAEDB', fontWeight: 600, marginBottom: '8px' }}>
                      <CheckCircle2 size={15} />
                      <span>{t.skillIntelligence.existingSkillsLabel}</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
                      {pathway.existingSkills.map((sk, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          {sk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Potential Gaps */}
                  <div
                    style={{
                      padding: '14px',
                      borderRadius: '8px',
                      background: 'rgba(7, 26, 58, 0.6)',
                      border: '1px solid rgba(23, 74, 145, 0.35)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '8px' }}>
                      <AlertCircle size={15} />
                      <span>{t.skillIntelligence.potentialGapsLabel}</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8125rem', color: 'var(--color-text-primary)' }}>
                      {pathway.potentialGaps.map((sk, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          {sk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Training Recommendations & Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', paddingTop: '6px' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, flex: '1 1 300px' }}>
                    <span style={{ color: 'var(--color-steel-light)', fontWeight: 600 }}>{t.skillIntelligence.trainingRecommendedLabel}: </span>
                    {pathway.trainingRecommendations.join(' • ')}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {pathway.actionType === 'assessment' && !analysis.assessmentResult?.completed && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsAssessmentOpen(true)}
                        style={{ fontSize: '0.8125rem' }}
                      >
                        Skill Assessment
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={onProceedToCompletion}
                      rightIcon={<ArrowRight size={14} />}
                      style={{ fontSize: '0.8125rem' }}
                    >
                      Explore Training
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================== */}
        {/* 7. ASSESSMENT DECISION ENGINE BANNER */}
        {/* ================================================== */}
        <section style={{ marginBottom: '44px' }}>
          <div
            className="classic-navy-surface"
            style={{
              padding: '28px',
              border: '1.5px solid rgba(139, 174, 219, 0.4)',
              background: 'linear-gradient(135deg, rgba(18, 54, 111, 0.65) 0%, rgba(7, 26, 58, 0.85) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Sparkles size={20} color="var(--color-steel-light)" />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#FFFFFF', margin: 0, fontWeight: 500 }}>
                {analysis.assessmentDecision.outcome === 'ASSESSMENT_RECOMMENDED'
                  ? "Let's check a few practical skills."
                  : t.skillIntelligence.assessmentBannerTitle}
              </h2>
            </div>

            {/* Outcome Tag & Rationale */}
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  background: 'rgba(23, 74, 145, 0.6)',
                  border: '1px solid rgba(139, 174, 219, 0.4)',
                  color: 'var(--color-steel-light)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  marginBottom: '10px',
                }}
              >
                Decision: {analysis.assessmentDecision.outcome.replace(/_/g, ' ')}
              </div>
              <p style={{ fontSize: '0.9375rem', color: '#FFFFFF', margin: 0, lineHeight: 1.5 }}>
                {analysis.assessmentDecision.rationale}
              </p>
            </div>

            {/* If Assessment was Completed */}
            {analysis.assessmentResult?.completed ? (
              <div
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'rgba(7, 26, 58, 0.8)',
                  border: '1px solid rgba(139, 174, 219, 0.3)',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8BAEDB', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>Practical Assessment Completed</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, marginBottom: '8px' }}>
                  {analysis.assessmentResult.recommendedNextStep}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>
                  Verified capability areas recognized: {analysis.assessmentResult.wellHandledAreas.join(', ')}
                </div>
              </div>
            ) : analysis.assessmentDecision.outcome === 'ASSESSMENT_RECOMMENDED' ? (
              /* If Assessment is Recommended: 4-Point Explainable Preview */
              <div style={{ marginTop: '16px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.6)',
                    border: '1px solid rgba(23, 74, 145, 0.35)',
                    marginBottom: '20px',
                  }}
                >
                  {/* Point 1: Why Recommended */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      WHY RECOMMENDED
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      Practical verification confirms hands-on troubleshooting proficiency for industry standards.
                    </div>
                  </div>

                  {/* Point 2: What It Evaluates */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      WHAT IT EVALUATES
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      {analysis.assessmentDecision.evaluationAreas.join(', ')}
                    </div>
                  </div>

                  {/* Point 3: Duration */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      ESTIMATED DURATION
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      ~{analysis.assessmentDecision.estimatedMinutes || 3} minutes • 3 adaptive role-specific questions
                    </div>
                  </div>

                  {/* Point 4: What Happens After */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-steel-light)', marginBottom: '4px' }}>
                      AFTER COMPLETION
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      Updates your profile with verified capabilities. No punitive scores or failing labels.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsAssessmentOpen(true)}
                    rightIcon={<ArrowRight size={16} />}
                  >
                    {t.skillIntelligence.startAssessmentButton}
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={onProceedToCompletion}
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {t.skillIntelligence.skipAssessmentButton}
                  </Button>
                </div>
              </div>
            ) : (
              /* If No Assessment Needed or Learning First */
              <div style={{ marginTop: '16px' }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onProceedToCompletion}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Continue to Learning Pathways
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* ================================================== */}
        {/* 8. MASTER ACTION: EXPLORE LEARNING PATHWAYS */}
        {/* ================================================== */}
        <div style={{ textAlign: 'center', paddingTop: '10px' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={onProceedToCompletion}
            rightIcon={<ArrowRight size={18} />}
            style={{ minWidth: '280px', justifyContent: 'center' }}
          >
            {t.skillIntelligence.exploreLearningPath}
          </Button>
        </div>
      </div>

      {/* Modals */}
      {editingSkill && (
        <SkillEditModal
          skill={editingSkill}
          onSave={onUpdateSkill}
          onRemove={onRemoveSkill}
          onClose={() => setEditingSkill(null)}
        />
      )}

      {editingStrength && onUpdateStrength && (
        <StrengthEditModal
          strength={editingStrength}
          onSave={(strId, updates) => onUpdateStrength(strId, updates)}
          onRemove={(strId) => onRemoveStrength && onRemoveStrength(strId)}
          onClose={() => setEditingStrength(null)}
        />
      )}

      {isAssessmentOpen && (
        <AdaptiveAssessmentModal
          decision={analysis.assessmentDecision}
          onComplete={(res) => {
            setIsAssessmentOpen(false);
            onAssessmentCompleted(res);
          }}
          onClose={() => setIsAssessmentOpen(false)}
        />
      )}
    </div>
  );
};
