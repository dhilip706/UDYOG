export type InterviewStage = 
  | 'PERSONAL' 
  | 'EDUCATION' 
  | 'LIVELIHOOD' 
  | 'SKILLS' 
  | 'INTERESTS' 
  | 'PREFERENCES' 
  | 'CONSTRAINTS' 
  | 'REVIEW' 
  | 'SUCCESS';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export type SkillCategory = 
  | 'practical' 
  | 'technical' 
  | 'traditional' 
  | 'informal' 
  | 'soft' 
  | 'digital' 
  | 'business'
  | 'agricultural'
  | 'mechanical'
  | 'electrical'
  | 'construction';

export type SkillConfidence = 'confirmed' | 'reported' | 'inferred' | 'needs_verification';

export interface SkillItem {
  name: string;
  category: SkillCategory;
  confidence?: SkillConfidence;
  experienceYears?: number;
  whereLearned?: string;
  currentlyPracticing?: boolean;
  notes?: string;
}

export interface ToolItem {
  name: string;
  category: 'tool' | 'machine' | 'equipment' | 'software';
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  currentlyUsing?: boolean;
}

export interface CertificateRecord {
  id: string;
  name: string;
  issuingOrg: string;
  issueDate?: string;
  expiryDate?: string;
  documentUrl?: string;
  verificationStatus: 'unverified' | 'verified' | 'pending';
}

export interface PersonalInfo {
  name: string;
  preferredName?: string;
  age: number | null;
  dateOfBirth?: string;
  gender: string;
  bloodGroup?: string; // Optional
  phoneNumber?: string;
  email?: string;
  currentAddress?: string;
  state?: string;
  district?: string;
  taluk?: string; // locality / town / village
  pinCode?: string;
  preferredLanguage?: string;
  additionalLanguages?: string[];
  profilePhoto?: string; // Data URL or asset URL
}

export interface EducationInfo {
  level: string; // e.g. '10th', '12th', 'Diploma', 'Graduate', 'Vocational', 'None'
  qualification: string; // e.g. 'Automobile Mechanic (ITI)', 'B.Com'
  schoolOrCollege?: string;
  fieldOrStream?: string;
  yearCompleted?: number | null;
  currentStatus?: string;
  additionalEducation?: string[];
  vocationalEducation?: string[];
  diplomas?: string[];
  degrees?: string[];
  shortTermCourses?: string[];
  certifications: string[];
  training: string[];
}

export interface LivelihoodInfo {
  currentOccupation: string;
  previousOccupations: string[];
  yearsOfExperience: number | null;
  experienceByOccupation?: { occupation: string; years: number }[];
  employerOrBusinessName?: string;
  workLocation?: string;
  mainResponsibilities?: string[];
  dailyTasks?: string[];
  informalExperience?: string;
  familyBusinessExperience?: string;
  traditionalLivelihoodExperience?: string;
  freelanceOrGigExperience?: string;
  apprenticeshipExperience?: string;
  internshipExperience?: string;
  selfEmploymentExperience?: string;
  employmentGaps?: string;
  currentEmploymentStatus?: string;
  workSituation: string; // e.g. 'Employed', 'Self-employed', 'Looking for work', 'Apprentice'
}

export interface WorkPreferences {
  employmentType: 'wage' | 'self-employed' | 'gig' | 'apprenticeship' | 'any' | string;
  preferredLocation: string;
  willingToRelocate?: boolean;
  availability: 'immediate' | '1-month' | 'flexible' | string;
  environmentPreference?: string; // e.g. 'Workshop', 'Outdoor', 'Office', 'Factory'
  indoorOutdoor?: 'indoor' | 'outdoor' | 'flexible';
  shiftPreference?: 'day' | 'night' | 'rotational' | 'flexible';
  expectedSalary?: string;
  preferredDistanceKm?: number | null;
  transportConsiderations?: string;
}

export interface StructuredUserProfile {
  personal: PersonalInfo;
  education: EducationInfo;
  certificates: CertificateRecord[];
  livelihood: LivelihoodInfo;
  skills: SkillItem[];
  tools: string[];
  detailedTools?: ToolItem[];
  interests: string[];
  aspirations: string[];
  workPreferences: WorkPreferences;
  constraints: string[];
  status?: 'draft' | 'review' | 'confirmed';
  metadata: {
    languageCode: string;
    locationName: string;
    companionId: 'aisha';
    lastUpdated: string;
    isSubmitted: boolean;
  };
}

export interface ConversationTurn {
  id: string;
  speaker: 'companion' | 'user';
  text: string;
  timestamp: number;
  stage: InterviewStage;
}

export interface QuestionDefinition {
  id: string;
  stage: InterviewStage;
  targetField: string;
  promptKey: string;
  fallbackText: string;
  followUpPromptKey?: string;
  isSatisfied: (profile: StructuredUserProfile) => boolean;
}
