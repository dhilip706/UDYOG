export interface LearningResourceItem {
  id: string;
  title: string;
  url: string;
  language: string; // 'ta', 'hi', 'en', etc.
  fallbackLanguage?: string;
  provider: string; // e.g. 'Skill India', 'NPTEL', 'Swayam', 'UDYOG Hub'
  topic: string;
  duration?: string; // e.g. '25 mins', '4 hours'
  level: 'Foundation' | 'Intermediate' | 'Advanced';
  resourceType: 'video' | 'youtube' | 'pdf' | 'exercise' | 'quiz' | 'practical_task';
  isCompleted?: boolean;
}

export interface LearningProgressItem {
  courseStarted: boolean;
  lessonsCompleted: number;
  totalLessons: number;
  videosWatched: number;
  exercisesCompleted: number;
  quizScores: { quizId: string; scorePercentage: number }[];
  assessmentsCompleted: number;
  skillsPracticed: string[];
  certificationsEarned: string[];
  remainingModulesCount: number;
  nextRecommendedAction: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  targetTimeline: string;
  isReached: boolean;
}

export interface LivelihoodPlan {
  id: string;
  beneficiaryId: string;
  createdAt: string;
  updatedAt: string;

  // 1-5: Profile Foundation & Objectives
  profileSummary: string;
  careerGoal: string;
  targetOccupation: string;
  existingStrengths: string[];
  existingRelevantExperience: string;

  // 6-10: Gap Analysis & Pathways
  skillGaps: string[];
  prioritySkills: string[];
  recommendedLearningSequence: string[];
  learningLevel: 'Foundation' | 'Intermediate' | 'Advanced' | 'Mastery';
  trainingPathway: string;

  // 11: NSQF Pathway with verification distinction
  nsqfPathway: {
    isOfficialVerified: boolean;
    nsqfLevel?: number;
    qualificationTitle: string;
    sectorSkillCouncil?: string;
    disclaimer: string; // e.g. "Preliminary AI pathway — official verification required"
  };

  // 12-15: Content & Learning Assets
  recommendedCourses: {
    id: string;
    title: string;
    provider: string;
    duration: string;
    language: string;
  }[];
  recommendedVideos: LearningResourceItem[];
  studyMaterials: LearningResourceItem[];
  practicalExercises: LearningResourceItem[];

  // 16-17: Assessment & Reassessment
  assessmentPlan: {
    recommended: boolean;
    reason: string;
    roleSpecificFocus: string[];
    status: 'No assessment needed' | 'Assessment recommended' | 'Learning first' | 'More information needed';
  };
  reassessmentPlan: {
    scheduledAfterMilestone: string;
    criteria: string;
  };

  // 18-22: Targets, Timeline & Milestones
  dailyLearningTarget: string; // e.g. '45 minutes practical review + 1 video lesson'
  weeklyLearningTarget: string; // e.g. '5 modules completed + 2 practical exercises'
  estimatedLearningDuration: string; // e.g. '6 Weeks (Self-paced)'
  progressMilestones: MilestoneItem[];
  certificationTarget: string; // e.g. 'Level 4 Automotive Diagnostic Associate'

  // 23-24: Location Pathways
  localOpportunityPathway: {
    district: string;
    typicalRoles: string[];
    averageSalaryRange: string;
    availabilityCount: number;
  };
  nearbyOpportunityPathway: {
    districts: string[];
    typicalRoles: string[];
    averageSalaryRange: string;
  };

  // 25-28: Readiness & Employability
  employerReadiness: {
    status: 'Ready Now' | 'Developing Skills' | 'Transitioning';
    explanation: string;
    strengthsDemonstrated: string[];
    gapClosingActions: string[];
  };
  interviewPreparation: string[];
  resumeProfileReadiness: {
    completenessPercentage: number;
    missingEvidence: string[];
  };
  applicationReadiness: {
    readyToApply: boolean;
    recommendedFirstApplyDate: string;
  };

  // 29-30: Alternatives & Outcomes
  entrepreneurshipPathway?: {
    isRelevant: boolean;
    businessType?: string;
    capitalRequirementEstimate?: string;
    localMarketPotential?: string;
    schemesAvailable?: string[];
  };
  livelihoodOutcomeTarget: string; // e.g. 'Full-time salaried EV Service Specialist in Coimbatore / Salem'

  // Progress Tracking
  progress: LearningProgressItem;
}
