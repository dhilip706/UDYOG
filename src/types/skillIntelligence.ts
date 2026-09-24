export type SkillCategory = 
  | 'TECHNICAL'
  | 'PRACTICAL'
  | 'DIGITAL'
  | 'COMMUNICATION'
  | 'PROBLEM_SOLVING'
  | 'TOOLS_EQUIPMENT'
  | 'DOMAIN_KNOWLEDGE'
  | 'BUSINESS'
  | 'TRADITIONAL'
  | 'EDUCATION_CERTIFICATION';

export type EvidenceConfidence = 'CONFIRMED' | 'SUPPORTED' | 'NEEDS_VERIFICATION';

export interface ExtractedSkill {
  id: string;
  name: string;
  category: SkillCategory;
  evidence: string;
  experienceYears?: number;
  notes?: string;
  source: string;
  confidence: EvidenceConfidence;
  userStatus: 'confirmed' | 'edited' | 'removed';
}

export interface CoreStrength {
  id: string;
  title: string;
  rationale: string;
  evidence: string;
  userStatus?: 'confirmed' | 'edited' | 'removed';
}

export interface ExplainabilityQuad {
  why: string;
  evidence: string;
  gaps: string;
  nextStep: string;
}

export interface CareerReadiness {
  currentlyReady: string[];
  developing: string[];
  transferableOpportunities: string[];
  needsAssessment: string[];
}

export interface OccupationPathway {
  id: string;
  title: string;
  sector: string;
  rationale: string;
  explainability: ExplainabilityQuad;
  existingSkills: string[];
  potentialGaps: string[];
  trainingRecommendations: string[];
  ncoCodeEquivalent?: string;
  nsqfLevelEquivalent?: number;
  sourceType: 'preliminary' | 'verified';
  sourceNotice: string;
  actionType: 'assessment' | 'training' | 'direct';
}

export type AssessmentOutcome = 
  | 'NO_ASSESSMENT_NEEDED'
  | 'ASSESSMENT_RECOMMENDED'
  | 'LEARNING_FIRST'
  | 'NEEDS_MORE_INFO';

export interface AssessmentDecision {
  outcome: AssessmentOutcome;
  rationale: string;
  targetPathwayId?: string;
  targetPathwayTitle?: string;
  evaluationAreas: string[];
  estimatedMinutes: number;
}

export interface AssessmentQuestion {
  id: string;
  pathwayId: string;
  type: 'scenario' | 'practical' | 'tool_identification' | 'safety' | 'sequence_order';
  questionText: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    feedback?: string;
  }>;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  targetSkill?: string;
}

export interface AssessmentResult {
  completed: boolean;
  scorePercentage?: number;
  adaptiveDifficultyReached?: 'basic' | 'intermediate' | 'advanced';
  wellHandledAreas: string[];
  areasToDevelop: string[];
  recommendedNextStep: string;
  takenAt: string;
}

export interface SkillProfileAnalysis {
  userId: string;
  extractedSkills: ExtractedSkill[];
  strengths: CoreStrength[];
  interests: string[];
  aspirations: string[];
  readiness: CareerReadiness;
  pathways: OccupationPathway[];
  assessmentDecision: AssessmentDecision;
  assessmentResult?: AssessmentResult;
  lastAnalyzed: string;
}
