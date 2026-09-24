import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAICompanion } from '../hooks/useAICompanion';
import { UserProfileService } from '../services/profile/userProfileService';
import { OnboardingIntelligence } from '../services/ai/onboardingIntelligence';
import { Award, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { speak } = useAICompanion();

  const rawProfile = useMemo(() => {
    return UserProfileService.getProfile();
  }, []);

  const profile = useMemo(() => {
    return rawProfile || OnboardingIntelligence.createInitialProfile('aisha', 'ta', 'Coimbatore');
  }, [rawProfile]);

  const occupation = profile.livelihood.currentOccupation || 'Practical Specialist';
  const experienceYears = profile.livelihood.yearsOfExperience || 0;

  // 4 Adaptive States
  const decisionState = useMemo(() => {
    if (profile.certificates && profile.certificates.some((c) => c.verificationStatus === 'verified')) {
      return {
        status: 'No assessment needed' as const,
        description: 'You hold verified formal credentials. An additional assessment is optional and not required for opportunity matching.',
        badgeColor: '#34D399',
      };
    }
    if (experienceYears >= 2) {
      return {
        status: 'Assessment recommended' as const,
        description: `Based on your ${experienceYears} years of practical experience in ${occupation}, an objective practical evaluation will upgrade your skills to Confirmed status for employers.`,
        badgeColor: '#60A5FA',
      };
    }
    if (experienceYears < 1) {
      return {
        status: 'Learning first' as const,
        description: 'We recommend completing your foundation learning modules before taking the competency evaluation.',
        badgeColor: '#FBBF24',
      };
    }
    return {
      status: 'Assessment recommended' as const,
      description: 'A brief practical scenario will benchmark your troubleshooting skills directly for verified local employers.',
      badgeColor: '#60A5FA',
    };
  }, [profile, experienceYears, occupation]);

  // Questions generator tailored to role
  const questions = useMemo(() => {
    const isShop = occupation.toLowerCase().includes('shop') || occupation.toLowerCase().includes('retail') || occupation.toLowerCase().includes('sales');

    if (isShop) {
      return [
        {
          id: 'q_shop_1',
          question: 'A customer brings a returned item without an original receipt, but states they bought it yesterday. What is the correct professional customer handling protocol?',
          options: [
            'Politely greet the customer, check store return policy guidelines, and offer store credit or supervisor assistance with calm respect.',
            'Refuse to speak to the customer and tell them to leave immediately.',
            'Immediately refund cash from the register without checking any system log.',
          ],
          correctIdx: 0,
          explanation: 'Standard retail protocol balances customer empathy with inventory loss prevention.',
        },
        {
          id: 'q_shop_2',
          question: 'When performing daily stock count reconciliation, you notice a physical shortage of 3 high-value items. What should be logged immediately?',
          options: [
            'Record the variance in the daily stock discrepancy log and report to the inventory manager.',
            'Ignore it if the shelf looks full.',
            'Blame other workers without verifying ledger receipts.',
          ],
          correctIdx: 0,
          explanation: 'Accurate discrepancy logging prevents audit failure and ensures supply chain integrity.',
        },
      ];
    }

    // Default: Practical mechanical/technical knowledge
    return [
      {
        id: 'q_mech_1',
        question: 'When diagnosing a machine exhibiting intermittent loss of power under load, which diagnostic parameter should be verified first alongside operational pressure?',
        options: [
          'Safety sensor interlocks and fluid delivery pressure under dynamic load.',
          'Wipe exterior paint and listen to radio interference.',
          'Check tire pressure only.',
        ],
        correctIdx: 0,
        explanation: 'Dynamic load pressure and interlock safety circuits are foundational for operational diagnosis.',
      },
      {
        id: 'q_mech_2',
        question: 'Before commencing service on high-voltage or hydraulic equipment, what is the mandatory first procedural step?',
        options: [
          'Perform lock-out / tag-out isolation and verify zero stored potential with calibrated instruments.',
          'Begin disassembly with hand wrenches immediately.',
          'Pour cold water over the motor housing.',
        ],
        correctIdx: 0,
        explanation: 'Mandatory zero-potential verification protects technician life under OHS and NCVET safety norms.',
      },
    ];
  }, [occupation]);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIdx];

  const handleStart = () => {
    setHasStarted(true);
    setCurrentIdx(0);
    setSelectedOption(null);
    setFeedback(null);
    setCorrectAnswersCount(0);
    setIsFinished(false);
    speak('Initiating role-specific practical evaluation. Read each scenario carefully.', 'SPEAKING');
  };

  const handleSelectOption = (idx: number) => {
    if (feedback) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.correctIdx;
    if (isCorrect) setCorrectAnswersCount((prev) => prev + 1);

    setFeedback({
      isCorrect,
      explanation: currentQ.explanation,
    });

    if (isCorrect) {
      speak('Accurate practical reasoning demonstrated.', 'SUCCESS');
    } else {
      speak('Review the technical reasoning below.', 'SPEAKING');
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx((prev) => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        setIsFinished(true);
        speak('Evaluation completed. Your strengths and development areas are summarized.', 'SUCCESS');
      }
    }, 2800);
  };

  if (!rawProfile) {
    return (
      <div style={{ maxWidth: '640px', margin: '60px auto', textAlign: 'center', padding: '48px 24px' }} className="classic-navy-surface">
        <Award size={36} color="var(--color-steel-light)" style={{ margin: '0 auto 12px' }} />
        <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '8px' }}>Practical Skill Assessment</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Complete your profile onboarding first so our AI companion can benchmark and structure practical diagnostic scenarios for your trade.
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
    <div style={{ maxWidth: '840px', margin: '0 auto', animation: 'classic-fade-in 0.3s ease-out', paddingBottom: '60px' }}>
      {/* Pre-Assessment AI Decision Overview */}
      {!hasStarted && !isFinished && (
        <div
          className="classic-navy-surface"
          style={{
            padding: '36px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(11, 36, 82, 0.95) 0%, rgba(18, 54, 111, 0.85) 100%)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
              border: '1px solid rgba(139, 174, 219, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-steel-light)',
              margin: '0 auto 16px auto',
            }}
          >
            <Award size={28} />
          </div>

          {/* AI Decision State Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '20px',
              background: 'rgba(7, 26, 58, 0.8)',
              border: `1.5px solid ${decisionState.badgeColor}`,
              color: decisionState.badgeColor,
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '14px',
            }}
          >
            <Sparkles size={13} />
            <span>AI Assessment Decision: {decisionState.status}</span>
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
            {occupation} Competency Evaluation
          </h1>

          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '580px', margin: '0 auto 20px', lineHeight: 1.5 }}>
            {decisionState.description}
          </p>

          <div
            style={{
              background: 'rgba(7, 26, 58, 0.65)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              maxWidth: '540px',
              margin: '0 auto 24px',
              border: '1px solid rgba(23, 74, 145, 0.4)',
            }}
          >
            <strong>Standard Evaluation Notice: </strong>
            Evaluates objective practical safety and role-specific workflows. This system never attempts to measure IQ or cognitive capacity from speech.
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button variant="ghost" size="lg" onClick={() => navigate('/learning')}>
              Study Learning Modules First
            </Button>
            <Button variant="primary" size="lg" onClick={handleStart}>
              Start Practical Evaluation
            </Button>
          </div>
        </div>
      )}

      {/* Active Evaluation Question */}
      {hasStarted && !isFinished && currentQ && (
        <div className="classic-navy-surface" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
              SCENARIO {currentIdx + 1} OF {questions.length} • {occupation.toUpperCase()}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Practical Reasoning Evaluation
            </span>
          </div>

          <h2 style={{ fontSize: '1.15rem', color: '#FFFFFF', lineHeight: 1.45, marginBottom: '20px' }}>
            {currentQ.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(23, 74, 145, 0.7)' : 'rgba(7, 26, 58, 0.75)',
                    border: isSelected ? '1.5px solid var(--color-steel-light)' : '1px solid rgba(23, 74, 145, 0.4)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    cursor: feedback ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.18s',
                  }}
                >
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--color-steel-light)' : 'rgba(23, 74, 145, 0.5)',
                      color: isSelected ? '#071A3A' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
              );
            })}
          </div>

          {feedback && (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                background: feedback.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: feedback.isCorrect ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                marginBottom: '20px',
                fontSize: '0.84rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: feedback.isCorrect ? '#34D399' : '#F87171', marginBottom: '4px' }}>
                {feedback.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{feedback.isCorrect ? 'Accurate Technical Reasoning' : 'Safety Clarification'}</span>
              </div>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                {feedback.explanation}
              </p>
            </div>
          )}

          {!feedback && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
              >
                Submit Answer
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Finished Summary Results Screen */}
      {isFinished && (
        <div
          className="classic-navy-surface"
          style={{
            padding: '32px',
            background: 'rgba(11, 36, 82, 0.95)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1.5px solid #34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34D399',
                margin: '0 auto 12px',
              }}
            >
              <ShieldCheck size={28} />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
              Evaluation Report & Verified Strengths
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Score: {correctAnswersCount} of {questions.length} Scenarios Passed ({Math.round((correctAnswersCount / questions.length) * 100)}%)
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 600, marginBottom: '6px' }}>
                DEMONSTRATED STRENGTHS
              </div>
              <ul style={{ margin: '0 0 0 16px', padding: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                <li>Practical tool safety protocols and hazard identification</li>
                <li>Systematic diagnosis before disassembly</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(7, 26, 58, 0.7)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '6px' }}>
                AREAS FOR DEVELOPMENT
              </div>
              <ul style={{ margin: '0 0 0 16px', padding: 0, fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
                <li>Digital test meter calibration logging</li>
                <li>Customer-facing communication reporting</li>
              </ul>
            </div>
          </div>

          <div style={{ background: 'rgba(7, 26, 58, 0.6)', padding: '14px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            <strong>REASSESSMENT REQUIREMENT: </strong>
            No immediate re-test required. Skills benchmarked as Confirmed for local employers in {profile.personal.district || 'Coimbatore'}. Re-benchmarking eligible in 60 days after Phase 3 training.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <Button variant="ghost" size="md" onClick={() => navigate('/career')}>
              View Updated Livelihood Plan
            </Button>
            <Button variant="primary" size="md" rightIcon={<ArrowRight size={15} />} onClick={() => navigate('/opportunities')}>
              Explore Matching Opportunities
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
