import { StructuredUserProfile } from '../../types/onboarding';
import {
  ExtractedSkill,
  OccupationPathway,
  AssessmentDecision,
  AssessmentQuestion,
  AssessmentResult,
} from '../../types/skillIntelligence';

// Pathway-specific adaptive question banks
const QUESTION_BANK: Record<string, AssessmentQuestion[]> = {
  occ_auto_diag: [
    {
      id: 'q_auto_1',
      pathwayId: 'occ_auto_diag',
      type: 'safety',
      questionText: 'Before working under a vehicle hoisted on hydraulic jacks, what is the mandatory safety step?',
      difficulty: 'basic',
      options: [
        { id: 'opt_1a', text: 'Engage transmission in neutral and leave jack in place', isCorrect: false },
        { id: 'opt_1b', text: 'Place mechanical jack stands on solid chassis points and chock the wheels', isCorrect: true },
        { id: 'opt_1c', text: 'Disconnect the car battery and drain engine coolant', isCorrect: false },
        { id: 'opt_1d', text: 'Check the tire inflation pressure before raising further', isCorrect: false },
      ],
      explanation: 'Mechanical jack stands are designed to support vehicle weight securely. Never rely solely on hydraulic pressure.',
    },
    {
      id: 'q_auto_2',
      pathwayId: 'occ_auto_diag',
      type: 'practical',
      questionText: 'A vehicle exhibits a spongy brake pedal and reduced braking force. What is the most likely initial cause?',
      difficulty: 'intermediate',
      options: [
        { id: 'opt_2a', text: 'Air trapped within the hydraulic brake fluid lines requiring bleeding', isCorrect: true },
        { id: 'opt_2b', text: 'Excessively inflated front tire pressure', isCorrect: false },
        { id: 'opt_2c', text: 'Loose alternator drive belt', isCorrect: false },
        { id: 'opt_2d', text: 'Incorrect engine oil viscosity', isCorrect: false },
      ],
      explanation: 'Air in the hydraulic fluid compresses easily, resulting in a spongy brake pedal and loss of hydraulic force.',
    },
    {
      id: 'q_auto_3',
      pathwayId: 'occ_auto_diag',
      type: 'tool_identification',
      questionText: 'When connecting an OBD-II diagnostic scanner to read trouble codes, which standard parameter indicates a cylinder misfire?',
      difficulty: 'advanced',
      options: [
        { id: 'opt_3a', text: 'DTC Code Series P0300 to P0308', isCorrect: true },
        { id: 'opt_3b', text: 'Battery voltage reading of 12.6V', isCorrect: false },
        { id: 'opt_3c', text: 'Radiator fan RPM indicator', isCorrect: false },
        { id: 'opt_3d', text: 'Tire Pressure Monitoring System (TPMS) trigger', isCorrect: false },
      ],
      explanation: 'P0300 series Diagnostic Trouble Codes represent random or specific cylinder misfire detection in OBD-II standards.',
    },
  ],
  occ_solar_rooftop: [
    {
      id: 'q_solar_1',
      pathwayId: 'occ_solar_rooftop',
      type: 'safety',
      questionText: 'What Personal Protective Equipment (PPE) is strictly required when installing solar panels on an elevated roof?',
      difficulty: 'basic',
      options: [
        { id: 'opt_s1a', text: 'Full-body safety harness anchored to a certified lifeline and non-slip safety shoes', isCorrect: true },
        { id: 'opt_s1b', text: 'Cotton gloves and normal sports footwear', isCorrect: false },
        { id: 'opt_s1c', text: 'Reflective safety vest without fall arrest harness', isCorrect: false },
        { id: 'opt_s1d', text: 'Welding mask and apron', isCorrect: false },
      ],
      explanation: 'Work at heights requires fall protection via harness anchored to an approved lifeline to prevent fall hazards.',
    },
    {
      id: 'q_solar_2',
      pathwayId: 'occ_solar_rooftop',
      type: 'practical',
      questionText: 'Before connecting a string of solar panels to the inverter, what should you verify using a calibrated DC multimeter?',
      difficulty: 'intermediate',
      options: [
        { id: 'opt_s2a', text: 'Verify open-circuit voltage (Voc) and correct polarity matches inverter specs', isCorrect: true },
        { id: 'opt_s2b', text: 'Measure the ambient air humidity and wind speed', isCorrect: false },
        { id: 'opt_s2c', text: 'Check the AC grid voltage with panels unplugged', isCorrect: false },
        { id: 'opt_s2d', text: 'Test continuity across live positive and negative terminals directly', isCorrect: false },
      ],
      explanation: 'Verifying Voc and polarity prevents inverter component damage from reverse polarity or over-voltage.',
    },
    {
      id: 'q_solar_3',
      pathwayId: 'occ_solar_rooftop',
      type: 'scenario',
      questionText: 'If a bypass diode inside a solar PV junction box fails open under partial shade, what symptom will be observed in the string?',
      difficulty: 'advanced',
      options: [
        { id: 'opt_s3a', text: 'String power drops substantially and localized hot-spot cell heating may occur', isCorrect: true },
        { id: 'opt_s3b', text: 'Inverter output frequency increases immediately to 60Hz', isCorrect: false },
        { id: 'opt_s3c', text: 'The entire rooftop system stops conducting electricity permanently', isCorrect: false },
        { id: 'opt_s3d', text: 'The roof mounting structure becomes magnetized', isCorrect: false },
      ],
      explanation: 'A failed open bypass diode causes shaded cells to become reverse-biased loads, causing hot-spot heating and drop in string output.',
    },
  ],
  default: [
    {
      id: 'q_def_1',
      pathwayId: 'default',
      type: 'safety',
      questionText: 'When working with power machinery in a workshop, what is the primary safety rule regarding loose clothing and accessories?',
      difficulty: 'basic',
      options: [
        { id: 'opt_d1a', text: 'Tuck in loose clothing, tie back long hair, and remove dangling jewellery', isCorrect: true },
        { id: 'opt_d1b', text: 'Wear heavy loose shawls for thermal protection', isCorrect: false },
        { id: 'opt_d1c', text: 'Hold loose sleeves firmly with one hand while operating switches', isCorrect: false },
        { id: 'opt_d1d', text: 'Clothing does not present any hazard near rotating shafts', isCorrect: false },
      ],
      explanation: 'Rotating parts can entangle loose clothing or jewellery within milliseconds, causing severe injury.',
    },
    {
      id: 'q_def_2',
      pathwayId: 'default',
      type: 'practical',
      questionText: 'When measuring precise component dimensions for fabrication or replacement, which tool provides 0.02mm accuracy?',
      difficulty: 'intermediate',
      options: [
        { id: 'opt_d2a', text: 'Vernier Caliper or Digital Micrometer', isCorrect: true },
        { id: 'opt_d2b', text: 'Flexible Steel Measuring Tape', isCorrect: false },
        { id: 'opt_d2c', text: 'Wooden Carpenter Rule', isCorrect: false },
        { id: 'opt_d2d', text: 'Try-square blade edge', isCorrect: false },
      ],
      explanation: 'Vernier calipers and micrometers are standard precision workshop instruments for millimeter-fraction measurements.',
    },
    {
      id: 'q_def_3',
      pathwayId: 'default',
      type: 'scenario',
      questionText: 'If an unfamiliar electrical equipment sparks and starts smoking, what should you do first?',
      difficulty: 'advanced',
      options: [
        { id: 'opt_d3a', text: 'Immediately isolate main power switch/circuit breaker without touching the chassis', isCorrect: true },
        { id: 'opt_d3b', text: 'Pour water over the casing to cool it down', isCorrect: false },
        { id: 'opt_d3c', text: 'Shake the power cable to check if the connection is loose', isCorrect: false },
        { id: 'opt_d3d', text: 'Continue using the machine until the task is completed', isCorrect: false },
      ],
      explanation: 'Immediate power isolation eliminates shock and fire hazards. Never use water on live electrical equipment.',
    },
  ],
};

export class AssessmentDecisionService {
  /**
   * Determine whether an assessment is useful and explain why
   */
  static determineAssessment(
    profile: StructuredUserProfile,
    extractedSkills: ExtractedSkill[],
    pathways: OccupationPathway[]
  ): AssessmentDecision {
    const exp = profile.livelihood.yearsOfExperience || 0;
    const hasCert = profile.education.certifications.length > 0;
    const primaryPathway = pathways[0];

    // Case 1: Insufficient profile data
    if (extractedSkills.length === 0 && !profile.livelihood.currentOccupation) {
      return {
        outcome: 'NEEDS_MORE_INFO',
        rationale: 'Your profile has limited vocational information. Providing more work details will help formulate a tailored pathway.',
        evaluationAreas: ['Work background', 'Core tools', 'Vocational interests'],
        estimatedMinutes: 2,
      };
    }

    // Case 2: Complete beginner or transitioning to entirely new field
    if (exp === 0 && !hasCert) {
      return {
        outcome: 'LEARNING_FIRST',
        rationale: 'Because you are exploring this career domain without prior practical background, starting with structured foundational training is far more beneficial than taking a test.',
        targetPathwayId: primaryPathway?.id,
        targetPathwayTitle: primaryPathway?.title,
        evaluationAreas: ['Foundational concepts', 'Workshop orientation'],
        estimatedMinutes: 0,
      };
    }

    // Case 3: Senior professional with extensive verified background
    if (exp >= 5 && hasCert) {
      return {
        outcome: 'NO_ASSESSMENT_NEEDED',
        rationale: `With ${exp} years of sustained experience and formal certifications, your reported background provides ample evidence for direct career progression without entry testing.`,
        targetPathwayId: primaryPathway?.id,
        targetPathwayTitle: primaryPathway?.title,
        evaluationAreas: [],
        estimatedMinutes: 0,
      };
    }

    // Case 4: Assessment Recommended for practical validation
    return {
      outcome: 'ASSESSMENT_RECOMMENDED',
      rationale: `You have ${exp > 0 ? `${exp} years of practical experience` : 'valuable reported skills'}. A brief 3-question practical check will confirm your troubleshooting proficiency and help unlock certified pathways.`,
      targetPathwayId: primaryPathway?.id || 'default',
      targetPathwayTitle: primaryPathway?.title || 'Vocational Practice',
      evaluationAreas: [
        'Workshop & Electrical Safety',
        'Practical Troubleshooting Logic',
        'Tool & Diagnostic Equipment Knowledge',
      ],
      estimatedMinutes: 3,
    };
  }

  /**
   * Get adaptive questions for a pathway
   */
  static getQuestionsForPathway(pathwayId: string = 'default'): AssessmentQuestion[] {
    return QUESTION_BANK[pathwayId] || QUESTION_BANK.default;
  }

  /**
   * Evaluate answers constructively without humiliating language or arbitrary IQ claims
   */
  static evaluateAssessment(
    questions: AssessmentQuestion[],
    selectedOptionIds: Record<string, string>
  ): AssessmentResult {
    let correctCount = 0;
    const wellHandledAreas: string[] = [];
    const areasToDevelop: string[] = [];

    for (const q of questions) {
      const selectedId = selectedOptionIds[q.id];
      const selectedOption = q.options.find((o) => o.id === selectedId);

      if (selectedOption?.isCorrect) {
        correctCount++;
        if (q.type === 'safety') {
          wellHandledAreas.push('Workplace & Operational Safety Protocols');
        } else if (q.type === 'practical') {
          wellHandledAreas.push('Practical Problem Troubleshooting & Root-cause Analysis');
        } else if (q.type === 'tool_identification') {
          wellHandledAreas.push('Precision Tools & Diagnostic Instruments');
        } else {
          wellHandledAreas.push('Real-world Procedural Workflows');
        }
      } else {
        if (q.type === 'safety') {
          areasToDevelop.push('Advanced Hazard Isolation & Safety Compliance');
        } else if (q.type === 'practical') {
          areasToDevelop.push('Systematic Fault-Finding Methodologies');
        } else if (q.type === 'tool_identification') {
          areasToDevelop.push('Electronic & Digital Tool Calibration');
        } else {
          areasToDevelop.push('Complex Scenario Execution');
        }
      }
    }

    // Deduplicate area lists
    const uniqueWell = Array.from(new Set(wellHandledAreas));
    const uniqueDevelop = Array.from(new Set(areasToDevelop));

    if (uniqueWell.length === 0) {
      uniqueWell.push('Willingness to undertake practical evaluation');
    }
    if (uniqueDevelop.length === 0) {
      uniqueDevelop.push('Domain specialization & advanced equipment mastery');
    }

    const scorePct = Math.round((correctCount / questions.length) * 100);

    let recommendedNextStep = '';
    if (scorePct >= 70) {
      recommendedNextStep = 'Direct progression to advanced skill certification and industry apprenticeship opportunities.';
    } else {
      recommendedNextStep = 'Practical refresher module focusing on diagnostic workflows before pursuing trade certification.';
    }

    return {
      completed: true,
      scorePercentage: scorePct,
      wellHandledAreas: uniqueWell,
      areasToDevelop: uniqueDevelop,
      recommendedNextStep,
      takenAt: new Date().toISOString(),
    };
  }
}
