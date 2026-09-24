import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { platformStore } from '../services/store';
import { authenticateToken, requireRole } from '../middleware/auth';

export const assessmentRouter = Router();

// Benchmark role-specific diagnostic assessments (Requirement 17)
const roleQuestions: Record<string, Array<{ id: string; question: string; options: string[]; correctIndex: number; skillTested: string; explanation: string }>> = {
  occ_auto_diag: [
    {
      id: 'q_auto_1',
      question: 'When diagnosing a modern common-rail diesel engine exhibiting intermittent loss of power under load, which diagnostic scan parameter should be evaluated first alongside fuel rail pressure?',
      options: [
        'Exhaust gas temperature and manifold absolute pressure (MAP)',
        'Radio antenna impedance',
        'Alternator rotor winding resistance',
        'Coolant reservoir level sensor only',
      ],
      correctIndex: 0,
      skillTested: 'Engine Diagnostics',
      explanation: 'MAP and fuel rail pressure telemetry directly expose boost leaks and high-pressure fuel starvation under load.',
    },
    {
      id: 'q_auto_2',
      question: 'What is the primary indicator of a faulty mass airflow (MAF) sensor during live data stream logging?',
      options: [
        'Fuel trim values pinned at extreme lean/rich (+25% / -25%) with anomalous g/s readings',
        'Headlight illumination dimming',
        'Tire pressure warning light blinking',
        'Brake master cylinder pressure fluctuation',
      ],
      correctIndex: 0,
      skillTested: 'OBD-II Scanning',
      explanation: 'Uncalibrated or fouled MAF sensors report inaccurate intake air volume, forcing the ECU fuel trim corrections to maximum limits.',
    },
    {
      id: 'q_auto_3',
      question: 'During brake rotor runout measurement using a dial gauge, what is the standard permissible tolerance before brake pedal pulsation occurs?',
      options: [
        'Within 0.05 mm (approx. 0.002 inches)',
        'Up to 3.0 mm',
        'Exactly 10 mm',
        'Runout measurement is unnecessary on disc brakes',
      ],
      correctIndex: 0,
      skillTested: 'Brake Systems',
      explanation: 'Lateral runout exceeding 0.05 mm causes disc thickness variation and noticeable pedal pulsation under braking.',
    },
  ],
  occ_ev_tech: [
    {
      id: 'q_ev_1',
      question: 'Before disconnecting the high-voltage (HV) manual service disconnect (MSD) on an electric vehicle, which safety procedure must always be executed first?',
      options: [
        'Turn off the ignition, remove the 12V auxiliary negative terminal, and verify zero voltage using an insulated CAT III/IV 1000V multimeter with Class 0 gloves',
        'Spray water on the battery casing to cool down thermal paste',
        'Bridge the traction inverter terminals using a standard screwdriver',
        'Disconnect the motor phase wires while the vehicle is in READY mode',
      ],
      correctIndex: 0,
      skillTested: 'EV High Voltage Safety',
      explanation: 'High-voltage isolation protocols mandate auxiliary 12V disconnection, proper PPE, and calibrated CAT III/IV 1000V proving before contact.',
    },
    {
      id: 'q_ev_2',
      question: 'What does a sudden divergence of cell voltages exceeding 80mV during fast charging in a Lithium Iron Phosphate (LFP) pack typically signify?',
      options: [
        'Cell imbalance or internal resistance degradation requiring active/passive BMS cell balancing',
        'Normal behavior that should be ignored by the BMS',
        'Radio frequency interference with the dashboard display',
        'Tire alignment divergence',
      ],
      correctIndex: 0,
      skillTested: 'Battery Management Systems (BMS)',
      explanation: 'Significant cell delta-V under high C-rate charging flags weak cells or BMS balancing resistor failure.',
    },
  ],
  default: [
    {
      id: 'q_def_1',
      question: 'In industrial maintenance, what is the primary purpose of Lockout / Tagout (LOTO) protocols before servicing electrical switchboards?',
      options: [
        'To ensure hazardous energy sources are isolated and physically locked to prevent accidental re-energization',
        'To measure the ambient humidity of the workspace',
        'To speed up the shift handover documentation',
        'To check the paint quality of the enclosure panel',
      ],
      correctIndex: 0,
      skillTested: 'Workplace Safety & Hazard Control',
      explanation: 'LOTO is a life-safety standard that guarantees zero potential energy before human maintenance begins.',
    },
  ],
};

const startAssessmentSchema = z.object({
  occupationId: z.string().optional(),
});

const submitAnswerSchema = z.object({
  attemptId: z.string(),
  questionId: z.string(),
  selectedOptionIndex: z.number(),
});

/**
 * GET /api/assessments/decision
 * AI Adaptive assessment recommendation based on current profile evidence (Requirement 17)
 */
assessmentRouter.get('/decision', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const profile = Array.from(platformStore.profiles.values()).find((p) => p.userId === userId);

  if (!profile || profile.skills.length === 0) {
    res.json({
      decision: {
        outcome: 'MORE_INFORMATION_REQUIRED',
        targetSkill: 'General Diagnostic Foundations',
        explanation: 'We need more details about your practical experience before tailoring a skill assessment.',
        confidence: 0.65,
      },
    });
    return;
  }

  const needsVerification = profile.skills.find(
    (s) => s.evidenceStatus === 'NEEDS_VERIFICATION' || s.evidenceStatus === 'SUPPORTED'
  );

  if (needsVerification) {
    res.json({
      decision: {
        outcome: 'ASSESSMENT_RECOMMENDED',
        targetSkill: needsVerification.name,
        explanation: `We have enough information about your experience, but practical reasoning for "${needsVerification.name}" needs verification.`,
        confidence: 0.88,
      },
    });
    return;
  }

  res.json({
    decision: {
      outcome: 'NO_ASSESSMENT_NEEDED',
      targetSkill: 'Demonstrated Core Competencies',
      explanation: 'Your profile has established sufficient verified evidence across all recorded technical capabilities.',
      confidence: 0.95,
    },
  });
});

/**
 * GET /api/assessments
 */
assessmentRouter.get('/', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const userAttempts = Array.from(platformStore.assessments.values()).filter((a) => a.userId === userId);
  res.json({ attempts: userAttempts });
});

/**
 * POST /api/assessments/start
 */
assessmentRouter.post('/start', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { occupationId } = startAssessmentSchema.parse(req.body);

    const targetOccupation = occupationId || 'occ_auto_diag';
    const questions = roleQuestions[targetOccupation] || roleQuestions.default;

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const attempt = {
      id: attemptId,
      userId,
      occupationId: targetOccupation,
      startedAt: new Date().toISOString(),
      completed: false,
      answers: [],
      currentQuestionIndex: 0,
      totalQuestions: questions.length,
      decisionState: 'ASSESSMENT_RECOMMENDED',
      strengths: [],
      gaps: [],
    };

    platformStore.assessments.set(attemptId, attempt);
    platformStore.recordAudit('ASSESSMENT_STARTED', 'ASSESSMENT', userId, attemptId, { targetOccupation });

    res.json({
      attemptId,
      firstQuestion: {
        id: questions[0].id,
        question: questions[0].question,
        options: questions[0].options,
        skillTested: questions[0].skillTested,
        total: questions.length,
        currentIndex: 0,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});

/**
 * POST /api/assessments/answer
 */
assessmentRouter.post('/answer', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const { attemptId, questionId, selectedOptionIndex } = submitAnswerSchema.parse(req.body);
    const attempt = platformStore.assessments.get(attemptId);

    if (!attempt) {
      res.status(404).json({ error: 'NOT_FOUND', message: 'Assessment attempt not found.' });
      return;
    }

    const questions = roleQuestions[attempt.occupationId] || roleQuestions.default;
    const qIndex = questions.findIndex((q) => q.id === questionId);
    if (qIndex === -1) {
      res.status(400).json({ error: 'INVALID_QUESTION', message: 'Question not found in this assessment.' });
      return;
    }

    const currentQ = questions[qIndex];
    const isCorrect = currentQ.correctIndex === selectedOptionIndex;

    attempt.answers.push({
      questionId,
      skillTested: currentQ.skillTested,
      selectedOptionIndex,
      isCorrect,
    });

    if (isCorrect) {
      if (!attempt.strengths.includes(currentQ.skillTested)) {
        attempt.strengths.push(currentQ.skillTested);
      }
    } else {
      if (!attempt.gaps.includes(currentQ.skillTested)) {
        attempt.gaps.push(currentQ.skillTested);
      }
    }

    const nextIndex = qIndex + 1;
    const isFinished = nextIndex >= questions.length;

    if (isFinished) {
      attempt.completed = true;
      attempt.completedAt = new Date().toISOString();

      // If user passed questions, promote skills to CONFIRMED in profile!
      const profile = Array.from(platformStore.profiles.values()).find((p) => p.userId === attempt.userId);
      if (profile) {
        attempt.strengths.forEach((st: string) => {
          const sk = profile.skills.find((s) => s.name.toLowerCase() === st.toLowerCase());
          if (sk) {
            sk.evidenceStatus = 'CONFIRMED';
            sk.notes = 'Demonstrated diagnostic proficiency in adaptive assessment.';
          } else {
            profile.skills.push({
              id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: st,
              category: 'TECHNICAL',
              evidenceStatus: 'CONFIRMED',
              yearsExperience: 1,
              notes: 'Verified via practical assessment.',
            });
          }
        });
      }
    }

    res.json({
      isCorrect,
      explanation: currentQ.explanation,
      isFinished,
      nextQuestion: !isFinished
        ? {
            id: questions[nextIndex].id,
            question: questions[nextIndex].question,
            options: questions[nextIndex].options,
            skillTested: questions[nextIndex].skillTested,
            total: questions.length,
            currentIndex: nextIndex,
          }
        : null,
      summary: isFinished
        ? {
            strengths: attempt.strengths,
            gaps: attempt.gaps,
            correctCount: attempt.answers.filter((a: any) => a.isCorrect).length,
            totalCount: questions.length,
          }
        : null,
    });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});
