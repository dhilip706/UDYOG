import React, { useState } from 'react';
import {
  AssessmentDecision,
  AssessmentQuestion,
  AssessmentResult,
} from '../../types/skillIntelligence';
import { AssessmentService } from '../../services/intelligence/assessmentService';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  ArrowRight,
  X,
  Award,
  BookOpen,
  Sparkles,
} from 'lucide-react';

interface AdaptiveAssessmentModalProps {
  decision: AssessmentDecision;
  onComplete: (result: AssessmentResult) => void;
  onClose: () => void;
}

export const AdaptiveAssessmentModal: React.FC<AdaptiveAssessmentModalProps> = ({
  decision,
  onComplete,
  onClose,
}) => {
  const { t } = useLanguage();
  const initialPool = AssessmentService.getQuestionsForPathway(decision.targetPathwayId || 'default');

  // Start with the first basic question
  const initialQuestion = initialPool.find((q) => q.difficulty === 'basic') || initialPool[0];

  const [currentQ, setCurrentQ] = useState<AssessmentQuestion>(initialQuestion);
  const [completedQuestions, setCompletedQuestions] = useState<AssessmentQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const questionNumber = completedQuestions.length + 1;
  const isTargetLength = completedQuestions.length >= 2; // Total of 3 questions in adaptive flow

  const handleSelectOption = (optionId: string) => {
    if (hasSubmittedCurrent) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleConfirmAnswer = () => {
    if (!selectedAnswers[currentQ.id]) return;
    setHasSubmittedCurrent(true);
  };

  const handleNext = () => {
    const updatedCompleted = [...completedQuestions, currentQ];

    if (isTargetLength) {
      // Complete assessment and evaluate constructively
      const finalResult = AssessmentService.evaluateAssessment(updatedCompleted, selectedAnswers);
      setResult(finalResult);
    } else {
      // Adaptive dynamic selection
      const nextQ = AssessmentService.selectNextQuestion(
        decision.targetPathwayId || 'default',
        updatedCompleted,
        selectedAnswers
      );

      if (nextQ) {
        setCompletedQuestions(updatedCompleted);
        setCurrentQ(nextQ);
        setHasSubmittedCurrent(false);
      } else {
        const finalResult = AssessmentService.evaluateAssessment(updatedCompleted, selectedAnswers);
        setResult(finalResult);
      }
    }
  };

  const handleFinish = () => {
    if (result) {
      onComplete(result);
    }
  };

  const getTagLabel = (type: AssessmentQuestion['type']) => {
    switch (type) {
      case 'safety':
        return t.skillIntelligence.safetyQuestionTag;
      case 'practical':
        return t.skillIntelligence.practicalQuestionTag;
      case 'tool_identification':
        return t.skillIntelligence.toolQuestionTag;
      case 'sequence_order':
        return 'Standard Sequence';
      case 'scenario':
      default:
        return t.skillIntelligence.scenarioQuestionTag;
    }
  };

  const getDifficultyLabel = (diff: AssessmentQuestion['difficulty']) => {
    switch (diff) {
      case 'basic':
        return 'Foundational';
      case 'intermediate':
        return 'Practical Troubleshooting';
      case 'advanced':
        return 'Advanced Diagnostics';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 11, 26, 0.88)',
        backdropFilter: 'blur(5px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        className="classic-navy-surface"
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
          animation: 'classic-fade-in 0.3s ease-out',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '4px',
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* ASSESSMENT RESULT STATE */}
        {result ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(18, 54, 111, 0.8)',
                  border: '1.5px solid var(--color-steel-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Award size={28} color="var(--color-steel-light)" />
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: '#FFFFFF',
                  marginBottom: '8px',
                  fontWeight: 500,
                }}
              >
                {t.skillIntelligence.assessmentResultTitle}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {t.skillIntelligence.assessmentResultSubtitle}
              </p>
            </div>

            {/* Areas Handled Well */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: 'rgba(7, 26, 58, 0.7)',
                border: '1px solid rgba(23, 74, 145, 0.4)',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#8BAEDB',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{t.skillIntelligence.wellHandledTitle}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-text-primary)', fontSize: '0.875rem' }}>
                {result.wellHandledAreas.map((area, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Growth (Constructive, never shaming) */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: 'rgba(7, 26, 58, 0.7)',
                border: '1px solid rgba(23, 74, 145, 0.4)',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--color-steel-light)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                <BookOpen size={16} />
                <span>{t.skillIntelligence.areasToDevelopTitle}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-text-primary)', fontSize: '0.875rem' }}>
                {result.areasToDevelop.map((area, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    {area}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Next Step */}
            <div
              style={{
                padding: '16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(18, 54, 111, 0.5) 0%, rgba(11, 36, 82, 0.8) 100%)',
                border: '1px solid rgba(139, 174, 219, 0.3)',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-steel-light)', fontWeight: 600, marginBottom: '4px' }}>
                {t.skillIntelligence.recommendedNextStepTitle}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#FFFFFF', lineHeight: 1.45 }}>
                {result.recommendedNextStep}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handleFinish}
              rightIcon={<ArrowRight size={16} />}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {t.skillIntelligence.reviewUpdatedProfile}
            </Button>
          </div>
        ) : (
          /* ACTIVE QUESTION EVALUATION */
          <div>
            {/* Header / Meta with Adaptive Level Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(23, 74, 145, 0.5)',
                    border: '1px solid rgba(139, 174, 219, 0.3)',
                    color: 'var(--color-steel-light)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {getTagLabel(currentQ.type)}
                </span>
                
                {/* Adaptive Difficulty Badge */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(11, 36, 82, 0.7)',
                    border: '1px solid rgba(139, 174, 219, 0.25)',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                  }}
                >
                  <Sparkles size={11} color="var(--color-steel-light)" />
                  <span>Adaptive Level: {getDifficultyLabel(currentQ.difficulty)}</span>
                </span>
              </div>
              
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-steel-light)', fontWeight: 600 }}>
                {t.skillIntelligence.questionProgress} {questionNumber} {t.skillIntelligence.ofQuestions} 3
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '3px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginBottom: '22px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(questionNumber / 3) * 100}%`,
                  background: 'linear-gradient(90deg, #174A91, #8BAEDB)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Question Text */}
            <h3
              style={{
                fontSize: '1.0625rem',
                color: '#FFFFFF',
                lineHeight: 1.5,
                fontWeight: 500,
                marginBottom: '20px',
              }}
            >
              {currentQ.questionText}
            </h3>

            {/* Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {currentQ.options.map((option) => {
                const isSelected = selectedAnswers[currentQ.id] === option.id;
                let bg = 'rgba(7, 26, 58, 0.6)';
                let border = 'rgba(23, 74, 145, 0.4)';

                if (isSelected && !hasSubmittedCurrent) {
                  bg = 'rgba(18, 54, 111, 0.7)';
                  border = 'var(--color-steel-light)';
                } else if (hasSubmittedCurrent) {
                  if (option.isCorrect) {
                    bg = 'rgba(23, 74, 145, 0.6)';
                    border = '#8BAEDB';
                  } else if (isSelected && !option.isCorrect) {
                    bg = 'rgba(120, 20, 20, 0.4)';
                    border = 'rgba(229, 115, 115, 0.6)';
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={hasSubmittedCurrent}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      background: bg,
                      border: `1.5px solid ${border}`,
                      color: '#FFFFFF',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      lineHeight: 1.45,
                      cursor: hasSubmittedCurrent ? 'default' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: `1.5px solid ${isSelected ? 'var(--color-steel-light)' : 'rgba(255, 255, 255, 0.3)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                        background: isSelected ? 'var(--color-steel-light)' : 'transparent',
                      }}
                    >
                      {isSelected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#071A3A' }} />}
                    </div>
                    <span>{option.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submitting current */}
            {hasSubmittedCurrent && (
              <div
                style={{
                  padding: '14px',
                  borderRadius: '8px',
                  background: 'rgba(7, 26, 58, 0.8)',
                  border: '1px solid rgba(139, 174, 219, 0.35)',
                  marginBottom: '22px',
                  fontSize: '0.8125rem',
                  lineHeight: 1.5,
                  color: 'var(--color-text-secondary)',
                  animation: 'classic-fade-in 0.2s ease-out',
                }}
              >
                <span style={{ color: 'var(--color-steel-light)', fontWeight: 600 }}>Technical Explanation: </span>
                {currentQ.explanation}
              </div>
            )}

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              {!hasSubmittedCurrent ? (
                <Button
                  variant="primary"
                  size="md"
                  disabled={!selectedAnswers[currentQ.id]}
                  onClick={handleConfirmAnswer}
                >
                  {t.skillIntelligence.submitAnswer}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight size={16} />}
                  onClick={handleNext}
                >
                  {isTargetLength ? t.skillIntelligence.assessmentResultTitle : t.skillIntelligence.nextQuestion}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
