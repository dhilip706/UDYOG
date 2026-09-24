import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { UserProfileService } from '../services/profile/userProfileService';
import { OnboardingIntelligence } from '../services/ai/onboardingIntelligence';
import { LivelihoodPlanGenerator } from '../services/ai/livelihoodPlanGenerator';
import { Button } from '../components/ui/Button';
import {
  CheckCircle2,
  Award,
  Briefcase,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BookOpen,
  MapPin,
  Clock,
  Target,
  Layers,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export const CareerPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  // Load user profile or provide robust fallback
  const savedProfile = useMemo(() => {
    return UserProfileService.getProfile();
  }, []);

  const profile = useMemo(() => {
    if (savedProfile) return savedProfile;
    return OnboardingIntelligence.createInitialProfile('aisha', currentLanguage, 'Coimbatore, Tamil Nadu');
  }, [savedProfile, currentLanguage]);

  // Generate grounded 30-dimension plan
  const plan = useMemo(() => {
    return LivelihoodPlanGenerator.generatePlan(profile, currentLanguage);
  }, [profile, currentLanguage]);

  if (!savedProfile) {
    return (
      <div style={{ maxWidth: '640px', margin: '60px auto', textAlign: 'center', padding: '48px 24px' }} className="classic-navy-surface">
        <TrendingUp size={36} color="var(--color-steel-light)" style={{ margin: '0 auto 12px' }} />
        <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '8px' }}>Personalized Career Plan</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Complete your assisted onboarding first so our AI companion can map out your tailored career progression, wage increments, and local opportunities.
        </p>
        <button
          type="button"
          onClick={() => navigate('/onboarding')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
            border: '1px solid rgba(139, 174, 219, 0.5)',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          <ArrowRight size={16} />
          <span>Start Onboarding</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out', paddingBottom: '60px' }}>
      {/* Hero Header */}
      <div
        className="classic-navy-surface"
        style={{
          padding: '28px 32px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(11, 36, 82, 0.95) 0%, rgba(18, 54, 111, 0.85) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-steel-light)', fontSize: '0.8rem', fontWeight: 600 }}>
            <TrendingUp size={16} />
            <span>PERSONALIZED LIVELIHOOD & SKILL PLAN</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '12px',
              background: 'rgba(23, 74, 145, 0.5)',
              border: '1px solid rgba(139, 174, 219, 0.4)',
              fontSize: '0.72rem',
              color: 'var(--color-steel-light)',
            }}
          >
            <span>30 Planning Dimensions Analyzed</span>
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 600, color: '#FFFFFF', margin: '0 0 8px 0' }}>
          {plan.targetOccupation} Pathway
        </h1>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5, maxWidth: '720px' }}>
          {plan.careerGoal}
        </p>

        {/* Quick Launch Action Ribbon */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight size={15} />}
            onClick={() => navigate('/learning')}
          >
            Start Recommended Learning
          </Button>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Briefcase size={15} />}
            onClick={() => navigate('/opportunities')}
          >
            View Hometown Opportunities
          </Button>
          {plan.assessmentPlan.recommended && (
            <Button
              variant="ghost"
              size="md"
              leftIcon={<Award size={15} />}
              onClick={() => navigate('/assessment')}
            >
              Take Practical Assessment
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Section 1: Dimensions 1-5 (Profile Foundation & Objectives) */}
        <PlanCard title="1. Profile Foundation & Objectives" icon={<Target size={16} color="var(--color-steel-light)" />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '14px 16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '4px' }}>
                DIMENSION 1: PROFILE SUMMARY
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-text-primary)' }}>{plan.profileSummary}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>DIMENSION 2: CAREER GOAL</div>
                <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500, marginTop: '2px' }}>{plan.careerGoal}</div>
              </div>
              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>DIMENSION 3: TARGET OCCUPATION</div>
                <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: 500, marginTop: '2px' }}>{plan.targetOccupation}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>DIMENSION 4: EXISTING STRENGTHS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {plan.existingStrengths.map((st, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(23, 74, 145, 0.6)', color: '#FFFFFF' }}>
                      {st}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>DIMENSION 5: RELEVANT EXPERIENCE</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{plan.existingRelevantExperience}</div>
              </div>
            </div>
          </div>
        </PlanCard>

        {/* Section 2: Dimensions 6-10 (Gap Analysis & Training Pathways) */}
        <PlanCard title="2. Skill Gaps & Recommended Learning Sequence" icon={<Layers size={16} color="var(--color-steel-light)" />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#F87171', fontWeight: 600 }}>DIMENSION 6: IDENTIFIED SKILL GAPS</div>
                <ul style={{ margin: '6px 0 0 16px', padding: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                  {plan.skillGaps.map((gap, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{gap}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>DIMENSION 7: PRIORITY SKILLS TO BUILD</div>
                <ul style={{ margin: '6px 0 0 16px', padding: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                  {plan.prioritySkills.map((sk, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{sk}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '6px' }}>
                DIMENSION 8: RECOMMENDED LEARNING SEQUENCE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {plan.recommendedLearningSequence.map((seq, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                    <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(23, 74, 145, 0.8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                      {i + 1}
                    </span>
                    <span>{seq}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>DIMENSION 9: LEARNING LEVEL</span>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{plan.learningLevel}</div>
              </div>
              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 14px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>DIMENSION 10: TRAINING PATHWAY</span>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{plan.trainingPathway}</div>
              </div>
            </div>
          </div>
        </PlanCard>

        {/* Section 3: Dimension 11 (NSQF-Aligned Pathway & Disclaimer) */}
        <PlanCard title="3. NSQF Pathway & Standards Mapping" icon={<Award size={16} color="var(--color-steel-light)" />}>
          <div style={{ background: 'rgba(7, 26, 58, 0.75)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(23, 74, 145, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>DIMENSION 11: NSQF QUALIFICATION</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {plan.nsqfPathway.qualificationTitle} (NSQF Level {plan.nsqfPathway.nsqfLevel})
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: plan.nsqfPathway.isOfficialVerified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.18)',
                  color: plan.nsqfPathway.isOfficialVerified ? '#34D399' : '#FBBF24',
                  border: plan.nsqfPathway.isOfficialVerified ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(251, 191, 36, 0.35)',
                }}
              >
                <AlertCircle size={12} />
                <span>{plan.nsqfPathway.disclaimer}</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
              Sector Skill Council: {plan.nsqfPathway.sectorSkillCouncil}. This pathway is computed by AI based on verified skill competency standards and will be formally endorsed by an accredited assessment body.
            </p>
          </div>
        </PlanCard>

        {/* Section 4: Dimensions 12-15 (Recommended Courses, Videos & Materials) */}
        <PlanCard title="4. Curated Learning Modules & Study Resources" icon={<BookOpen size={16} color="var(--color-steel-light)" />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
              DIMENSIONS 12-15: VIDEO LESSONS, STUDY HANDBOOKS & PRACTICAL TASKS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              {plan.recommendedVideos.map((vid) => (
                <div
                  key={vid.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: 'rgba(7, 26, 58, 0.8)',
                    border: '1px solid rgba(23, 74, 145, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                      <span>{vid.provider}</span>
                      <span style={{ color: 'var(--color-steel-light)' }}>{vid.language.toUpperCase()}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#FFFFFF', marginBottom: '6px' }}>
                      {vid.title}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Duration: {vid.duration || '20m'}</span>
                    <button
                      type="button"
                      onClick={() => navigate('/learning')}
                      style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
                    >
                      Watch <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <Button variant="secondary" size="sm" onClick={() => navigate('/learning')}>
                View Full Curriculum & Materials ({plan.studyMaterials.length} PDFs, {plan.practicalExercises.length} Exercises)
              </Button>
            </div>
          </div>
        </PlanCard>

        {/* Section 5: Dimensions 16-17 (Assessment & Reassessment Framework) */}
        <PlanCard title="5. Adaptive Assessment & Reassessment Plan" icon={<Award size={16} color="var(--color-steel-light)" />}>
          <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '14px 16px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>DIMENSION 16: ASSESSMENT STATUS</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>{plan.assessmentPlan.status}</div>
              </div>
              {plan.assessmentPlan.recommended && (
                <Button variant="primary" size="sm" onClick={() => navigate('/assessment')}>
                  Start Assessment
                </Button>
              )}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 10px 0' }}>
              {plan.assessmentPlan.reason}
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              <strong>DIMENSION 17: REASSESSMENT CRITERIA: </strong>
              {plan.reassessmentPlan.criteria} ({plan.reassessmentPlan.scheduledAfterMilestone})
            </div>
          </div>
        </PlanCard>

        {/* Section 6: Dimensions 18-22 (Daily/Weekly Targets & Milestones) */}
        <PlanCard title="6. Learning Targets, Duration & Milestones" icon={<Clock size={16} color="var(--color-steel-light)" />}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>DIMENSION 18: DAILY TARGET</span>
              <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: '2px' }}>{plan.dailyLearningTarget}</div>
            </div>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>DIMENSION 19: WEEKLY TARGET</span>
              <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: '2px' }}>{plan.weeklyLearningTarget}</div>
            </div>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>DIMENSION 20: DURATION</span>
              <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: '2px' }}>{plan.estimatedLearningDuration}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '8px' }}>
              DIMENSION 21: PROGRESS MILESTONES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plan.progressMilestones.map((ms) => (
                <div key={ms.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={14} color={ms.isReached ? '#34D399' : 'var(--color-steel-light)'} />
                    <span style={{ color: ms.isReached ? '#34D399' : 'var(--color-text-secondary)' }}>{ms.title}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{ms.targetTimeline}</span>
                </div>
              ))}
            </div>
          </div>
        </PlanCard>

        {/* Section 7: Dimensions 23-24 (Location & Regional Opportunity Pathways) */}
        <PlanCard title="7. Hometown & Regional Opportunity Pathways" icon={<MapPin size={16} color="var(--color-steel-light)" />}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>DIMENSION 23: LOCAL OPPORTUNITY PATHWAY (HOME DISTRICT)</div>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, margin: '4px 0' }}>{plan.localOpportunityPathway.district}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Salary: {plan.localOpportunityPathway.averageSalaryRange} • {plan.localOpportunityPathway.availabilityCount} Verified Active Hubs
              </div>
            </div>

            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>DIMENSION 24: NEARBY DISTRICT OPPORTUNITY PATHWAY</div>
              <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, margin: '4px 0' }}>
                {plan.nearbyOpportunityPathway.districts.join(', ')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Salary: {plan.nearbyOpportunityPathway.averageSalaryRange}
              </div>
            </div>
          </div>
        </PlanCard>

        {/* Section 8: Dimensions 25-28 (Employer Readiness & Application Pipeline) */}
        <PlanCard title="8. Employer Readiness, Interview Prep & Profile Completeness" icon={<Briefcase size={16} color="var(--color-steel-light)" />}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>DIMENSION 25: EMPLOYER READINESS</span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#34D399' }}>{plan.employerReadiness.status}</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '4px 0 0' }}>
                {plan.employerReadiness.explanation}
              </p>
            </div>

            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>DIMENSION 27: PROFILE READINESS</span>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                {plan.resumeProfileReadiness.completenessPercentage}% Complete
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                DIMENSION 28: APPLICATION READINESS: {plan.applicationReadiness.recommendedFirstApplyDate}
              </span>
            </div>
          </div>

          <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '6px' }}>
              DIMENSION 26: INTERVIEW PREPARATION MODULES
            </div>
            <ul style={{ margin: '0 0 0 16px', padding: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              {plan.interviewPreparation.map((prep, i) => (
                <li key={i} style={{ marginBottom: '3px' }}>{prep}</li>
              ))}
            </ul>
          </div>
        </PlanCard>

        {/* Section 9: Dimensions 29-30 (Entrepreneurship & Final Livelihood Target) */}
        <PlanCard title="9. Entrepreneurship Alternative & Target Livelihood Outcome" icon={<Sparkles size={16} color="var(--color-steel-light)" />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {plan.entrepreneurshipPathway && plan.entrepreneurshipPathway.isRelevant && (
              <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '12px 14px', borderRadius: '8px', borderLeft: '3px solid var(--color-royal-bright)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>DIMENSION 29: ENTREPRENEURSHIP & SELF-EMPLOYMENT PATHWAY</span>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500, marginTop: '2px' }}>{plan.entrepreneurshipPathway.businessType}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Capital: {plan.entrepreneurshipPathway.capitalRequirementEstimate} • Potential: {plan.entrepreneurshipPathway.localMarketPotential}
                </div>
              </div>
            )}

            <div style={{ background: 'rgba(18, 54, 111, 0.6)', padding: '14px 16px', borderRadius: '10px', border: '1px solid rgba(139, 174, 219, 0.4)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>DIMENSION 30: TARGET LIVELIHOOD OUTCOME</span>
              <div style={{ fontSize: '0.95rem', color: '#FFFFFF', fontWeight: 600, marginTop: '4px' }}>
                {plan.livelihoodOutcomeTarget}
              </div>
            </div>
          </div>
        </PlanCard>
      </div>
    </div>
  );
};

interface PlanCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, icon, children }) => (
  <div
    className="classic-navy-surface"
    style={{
      padding: '20px 24px',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: 'rgba(23, 74, 145, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>{title}</h2>
    </div>
    <div>{children}</div>
  </div>
);
