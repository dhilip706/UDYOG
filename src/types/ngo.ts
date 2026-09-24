export interface NGOProfile {
  id: string;
  name: string;
  logoUrl?: string;
  orgType: string;
  registrationNumber?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  address: string;
  state: string;
  district: string;
  operatingRegions: string[];
  languagesSupported: string[];
  focusAreas: string[];
  yearsOfOperation: number;
  about?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'NEEDS_REVIEW';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NGORole = 'NGO_ADMIN' | 'PROGRAM_MANAGER' | 'COMMUNITY_WORKER' | 'TRAINING_COORDINATOR' | 'EMPLOYMENT_COORDINATOR' | 'VIEWER';

export interface NGOTeamMember {
  id: string;
  ngoId: string;
  userId: string;
  name: string;
  role: NGORole;
  email?: string;
  phone?: string;
  joinedAt: string;
}

export interface BeneficiarySkill {
  id: string;
  name: string;
  category: string;
  evidenceStatus: 'CONFIRMED' | 'SUPPORTED' | 'NEEDS_VERIFICATION' | 'DEVELOPING' | 'MISSING';
  yearsExperience?: number;
  notes?: string;
}

export interface BeneficiaryProfile {
  id: string;
  userId: string;
  fullName: string;
  phone?: string;
  age?: number;
  gender?: string;
  preferredLanguage: string;
  state?: string;
  district?: string;
  locality?: string;
  isRelocationOpen: boolean;
  availability: string;
  workPreference: string;
  currentOccupation?: string;
  yearsExperience: number;
  profilePhotoUrl?: string;
  isVerified: boolean;
  trainingStatus?: 'SEEKING_TRAINING' | 'CURRENTLY_LEARNING' | 'ALREADY_SKILLED' | 'NEEDS_ASSESSMENT' | 'TRAINING_COMPLETED';
  assistedByNgoId?: string;
  consentGiven?: boolean;
  communityNotes?: Array<{ id: string; text: string; author: string; timestamp: string }>;
  educations: Array<{ id: string; level: string; institution?: string; yearOfPassing?: number; specialization?: string }>;
  certifications: Array<{ id: string; title: string; issuingBody: string; year?: number; isVerified: boolean }>;
  experiences: Array<{ id: string; roleTitle: string; organization?: string; years: number; toolsUsed: string[]; responsibilities?: string }>;
  skills: BeneficiarySkill[];
  aspirations: Array<{ id: string; goalTitle: string; targetTimeframe?: string }>;
}

export interface CommunityOverviewStats {
  totalPeopleOnboarded: number;
  newRegistrationsThisMonth: number;
  peopleSeekingEmployment: number;
  peopleSeekingTraining: number;
  peopleAlreadySkilled: number;
  peopleNeedingAssessment: number;
  peopleCurrentlyLearning: number;
  peopleMatchedWithOpportunities: number;
  peopleEmployed: number;
}

export interface CommunityProgram {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  programType: 'SKILL_CAMP' | 'AWARENESS' | 'DIGITAL_LITERACY' | 'CAREER_GUIDANCE' | 'TRAINING_DRIVE' | 'EMPLOYER_MEET';
  location: string;
  state: string;
  district: string;
  startDate: string;
  endDate?: string;
  capacity: number;
  registered: number;
  attended: number;
  eligibility?: string;
  skillsCovered: string[];
  outcome?: string;
  createdAt: string;
}

export interface NGOTrainingProgram {
  id: string;
  ngoId: string;
  title: string;
  sector: string;
  durationHours: number;
  capacity: number;
  enrolledCount: number;
  completedCount: number;
  interestedCount: number;
  skillsCovered: string[];
  isNSQFAligned: boolean;
  nsqfPathwayNote: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  state: string;
  district: string;
  createdAt: string;
}

export interface DemandIntelligenceItem {
  skillName: string;
  interestedBeneficiaries: number;
  availableProgramsCount: number;
  totalCapacitySeats: number;
  demandState: 'HIGH_DEMAND' | 'MODERATE_DEMAND' | 'EMERGING';
}

export interface SkillInventoryItem {
  name: string;
  category: string;
  practitionerCount: number;
  evidenceBreakdown: {
    CONFIRMED?: number;
    SUPPORTED?: number;
    NEEDS_VERIFICATION?: number;
    DEVELOPING?: number;
  };
}

export interface SkillGapItem {
  id: string;
  sector: string;
  occupation: string;
  commonGaps: string[];
  communityDemandLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  interestedBeneficiariesCount: number;
  verifiedBenchmark: string;
  type: 'VERIFIED_STANDARD' | 'AI_DERIVED_OBSERVATION';
  recommendedPriorityTraining: boolean;
}

export interface AssessmentRecord {
  id: string;
  beneficiaryName: string;
  occupation: string;
  assessmentType: string;
  status: 'COMPLETED' | 'RECOMMENDED' | 'PENDING';
  completedAt?: string;
  score?: number;
  strengths: string[];
  needsDevelopment: string[];
  recommendedNextStep: string;
}

export interface JobOpportunity {
  id: string;
  employerId: string;
  employerName: string;
  title: string;
  description: string;
  jobType: string;
  openingsCount: number;
  salaryMin: number;
  salaryMax: number;
  state: string;
  district: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredEducation?: string;
  minExperienceYears: number;
  status: string;
  isDemo: boolean;
  createdAt: string;
}

export interface EmployerNetworkItem {
  id: string;
  name: string;
  industry: string;
  district: string;
  state: string;
  isVerified: boolean;
  openJobsCount: number;
  contactPerson: string;
  phone: string;
  email: string;
  activeDemandSkills: string[];
  partnershipStatus: string;
}

export interface MatchAnalysis {
  profileId: string;
  profileName: string;
  jobId: string;
  jobTitle: string;
  employerName: string;
  matchScore: number;
  explainableFactors: {
    matchedSkillsList: string[];
    missingSkillsList: string[];
    isLocalLocationPreferenceMet: boolean;
    locationDetails: string;
    isExperienceRequirementMet: boolean;
    experienceDetails: string;
    relevantTrainingCompleted: boolean;
    areasNeedingDevelopment: string[];
  };
  whyThisMatchesSummary: string;
}

export interface JobApplicationItem {
  id: string;
  jobId: string;
  profileId: string;
  applicantName: string;
  jobTitle: string;
  employerName: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' | 'WITHDRAWN';
  matchExplanation: string;
  matchedSkills: string[];
  missingSkills: string[];
  appliedAt: string;
  events: Array<{ id: string; status: string; note: string; timestamp: string }>;
}

export interface OutcomesFunnel {
  profiledCount: number;
  trainingCompletedCount: number;
  matchedOpportunitiesCount: number;
  submittedApplicationsCount: number;
  shortlistedCount: number;
  interviewedCount: number;
  selectedCount: number;
  retention30Days: number;
  retention90Days: number;
}

export interface PlacedBeneficiary {
  beneficiaryName: string;
  jobTitle: string;
  employer: string;
  district: string;
  monthlySalary: string;
  placedDate: string;
  status: string;
  followUpStatus: string;
}

export interface SupportCase {
  id: string;
  ngoId: string;
  profileId: string;
  beneficiaryName: string;
  category: 'DOCUMENTATION' | 'TRAINING' | 'EMPLOYER_COMMUNICATION' | 'APPLICATION' | 'ACCESSIBILITY' | 'FOLLOW_UP';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  subject: string;
  description: string;
  assignedTo?: string;
  notes: Array<{ id: string; text: string; author: string; timestamp: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface NGOComplaint {
  id: string;
  ngoId: string;
  ticketId: string;
  beneficiaryName: string;
  beneficiaryPhone?: string;
  category: 'EMPLOYER' | 'TRAINING' | 'APPLICATION' | 'SERVICE' | 'ABUSE_MISTREATMENT' | 'TECHNICAL' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'NEW' | 'ASSIGNED' | 'INVESTIGATING' | 'ACTION_TAKEN' | 'RESOLVED' | 'CLOSED';
  subject: string;
  description: string;
  assignedTo?: string;
  resolutionNote?: string;
  createdAt: string;
  events: Array<{ id: string; note: string; timestamp: string }>;
}
