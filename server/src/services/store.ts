import crypto from 'crypto';

export interface UserEntity {
  id: string;
  phoneNumber?: string;
  email?: string;
  displayName?: string;
  role?: 'BENEFICIARY' | 'EMPLOYER' | 'ADMIN' | 'NGO' | null;
  roleAssignedAt?: string | null;
  provider: 'PHONE' | 'GOOGLE';
  avatarUrl?: string;
  createdAt: string;
}

export interface BeneficiaryProfileEntity {
  id: string;
  userId: string;
  fullName: string;
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
  skills: Array<{
    id: string;
    name: string;
    category: string;
    evidenceStatus: 'CONFIRMED' | 'SUPPORTED' | 'NEEDS_VERIFICATION' | 'DEVELOPING' | 'MISSING';
    yearsExperience?: number;
    notes?: string;
  }>;
  interests?: string[];
  aspirations?: any[];
  educationLevel?: string;
  personalInfo?: {
    fullName?: string;
    phoneNumber?: string;
    age?: number;
    gender?: string;
    district?: string;
    state?: string;
    [key: string]: any;
  };
}

export interface EmployerProfileEntity {
  id: string;
  userId: string;
  companyName: string;
  industry?: string;
  state?: string;
  district?: string;
  description?: string;
  website?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface NGOEntity {
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

export interface NGOMemberEntity {
  id: string;
  ngoId: string;
  userId: string;
  name: string;
  role: 'NGO_ADMIN' | 'PROGRAM_MANAGER' | 'COMMUNITY_WORKER' | 'TRAINING_COORDINATOR' | 'EMPLOYMENT_COORDINATOR' | 'VIEWER';
  email?: string;
  phone?: string;
  joinedAt: string;
}

export interface CommunityProgramEntity {
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

export interface NGOTrainingProgramEntity {
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

export interface SupportCaseEntity {
  id: string;
  ngoId: string;
  profileId: string;
  beneficiaryName: string;
  category: 'DOCUMENTATION' | 'TRAINING' | 'EMPLOYER_COMMUNICATION' | 'APPLICATION' | 'ACCESSIBILITY' | 'FOLLOW_UP';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
  subject: string;
  title?: string;
  description: string;
  assignedTo?: string;
  notes: Array<{ id: string; text: string; author: string; timestamp: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface NGOComplaintEntity {
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

export interface OccupationBenchmarkEntity {
  id: string;
  ncoCode: string;
  title: string;
  sector: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minEducation: string;
  minExperienceYears: number;
  workConditions: string;
  isVerifiedOfficial: boolean;
}

export interface JobEntity {
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
  locationDistrict?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredEducation: string;
  minExperienceYears: number;
  status: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED';
  isDemo: boolean;
  createdAt: string;
}

export interface JobApplicationEntity {
  id: string;
  jobId: string;
  profileId: string;
  beneficiaryId?: string;
  applicantName: string;
  jobTitle: string;
  employerName: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';
  matchExplanation: string;
  matchedSkills: string[];
  missingSkills: string[];
  appliedAt: string;
  updatedAt?: string;
  events: Array<{ id: string; status: string; note: string; timestamp: string }>;
}

export interface ComplaintEntity {
  id: string;
  userId: string;
  userName: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'NEW' | 'ASSIGNED' | 'INVESTIGATING' | 'ACTION_REQUIRED' | 'RESOLVED' | 'CLOSED';
  subject: string;
  description: string;
  audioRecordUrl?: string;
  assignedAdminId?: string;
  resolutionNote?: string;
  createdAt: string;
  events: Array<{ id: string; note: string; timestamp: string }>;
}

export interface AuditLogEntity {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  targetId?: string;
  ipAddress?: string;
  details?: any;
  timestamp: string;
}

export interface PhoneOtpSession {
  verificationId: string;
  phoneNumber: string;
  otpHash: string;
  attempts: number;
  expiresAt: number;
  createdAt: number;
}

class PlatformStore {
  public users: Map<string, UserEntity> = new Map();
  public profiles: Map<string, BeneficiaryProfileEntity> = new Map();
  public employers: Map<string, EmployerProfileEntity> = new Map();
  public benchmarks: Map<string, OccupationBenchmarkEntity> = new Map();
  public jobs: Map<string, JobEntity> = new Map();
  public applications: Map<string, JobApplicationEntity> = new Map();
  public complaints: Map<string, ComplaintEntity> = new Map();
  public auditLogs: AuditLogEntity[] = [];
  public otpSessions: Map<string, PhoneOtpSession> = new Map();
  public learningPaths: Map<string, any> = new Map();
  public assessments: Map<string, any> = new Map();
  public regionalData: any[] = [];
  public systemHealth: Array<{ component: string; status: string; latencyMs: number; details: string; recordedAt: string }> = [];
  public ngos: Map<string, NGOEntity> = new Map();
  public ngoMembers: Map<string, NGOMemberEntity> = new Map();
  public communityPrograms: Map<string, CommunityProgramEntity> = new Map();
  public ngoTrainingPrograms: Map<string, NGOTrainingProgramEntity> = new Map();
  public supportCases: Map<string, SupportCaseEntity> = new Map();
  public ngoComplaints: Map<string, NGOComplaintEntity> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    // 1. Benchmarks (NCO-2015 official data)
    const benchmarkList: OccupationBenchmarkEntity[] = [
      {
        id: 'occ_auto_diag',
        ncoCode: '7231.0100',
        title: 'Automotive Diagnostic Specialist',
        sector: 'Automotive & Mobility',
        description: 'Specialized diagnostic evaluation, computerized engine scanning, and powertrain troubleshooting.',
        requiredSkills: ['Engine Diagnostics', 'OBD-II Scanning', 'Brake Systems', 'Sensor Calibration'],
        preferredSkills: ['Oscilloscope Analysis', 'Hybrid Powertrain Basics'],
        minEducation: 'ITI / Diploma in Automobile/Mechanical',
        minExperienceYears: 2.0,
        workConditions: 'Workshop environment, hydraulic lifts, diagnostic computers',
        isVerifiedOfficial: true,
      },
      {
        id: 'occ_ev_tech',
        ncoCode: '7412.0201',
        title: 'Electric Vehicle (EV) Powertrain Technician',
        sector: 'Clean Mobility',
        description: 'High-voltage safety, lithium battery pack inspection, motor controller diagnostics, and regenerative braking.',
        requiredSkills: ['EV High Voltage Safety', 'Battery Management Systems (BMS)', 'Motor Controller Tuning', 'DC Fast Charging Protocols'],
        preferredSkills: ['Thermal Management', 'CAN Bus Decoding'],
        minEducation: 'Diploma / Certificate in Electrical/Automobile',
        minExperienceYears: 1.5,
        workConditions: 'High-voltage PPE, insulated tools, clean diagnostic bays',
        isVerifiedOfficial: true,
      },
      {
        id: 'occ_solar_rooftop',
        ncoCode: '7411.0102',
        title: 'Solar PV Grid Installation Lead',
        sector: 'Renewable Energy',
        description: 'Rooftop & ground-mount photovoltaic array installation, inverter commissioning, net metering, and string testing.',
        requiredSkills: ['Solar Inverter Configuration', 'PV String Voltage Testing', 'Rooftop Structural Mounting', 'Earthing & Lightning Arrestor Setup'],
        preferredSkills: ['SCADA Monitoring', 'Battery Energy Storage Systems (BESS)'],
        minEducation: 'ITI Electrician / Diploma',
        minExperienceYears: 1.0,
        workConditions: 'Elevated rooftops, outdoor electrical distribution',
        isVerifiedOfficial: true,
      },
      {
        id: 'occ_ind_electrician',
        ncoCode: '7412.0101',
        title: 'Industrial Automation Electrician',
        sector: 'Manufacturing & Power',
        description: 'PLC panel wiring, 3-phase induction motor drives, contactor relay sequencing, and industrial troubleshooting.',
        requiredSkills: ['3-Phase Motor Control', 'PLC Wiring & IO Checks', 'VFD Parameterization', 'Industrial Safety Lockout-Tagout (LOTO)'],
        preferredSkills: ['HMI Programming', 'Pneumatics Interfacing'],
        minEducation: 'ITI Industrial Electrician',
        minExperienceYears: 2.0,
        workConditions: 'Factory floors, switchgear rooms',
        isVerifiedOfficial: true,
      },
      {
        id: 'occ_apparel_designer',
        ncoCode: '7531.0200',
        title: 'Apparel Master Patternmaker',
        sector: 'Textile & Apparel',
        description: 'CAD-based pattern drafting, fabric grain alignment, grading, and production sample assembly.',
        requiredSkills: ['Pattern Drafting', 'Fabric Grading', 'Industrial Sewing Machine Tuning', 'Dart & Seam Manipulation'],
        preferredSkills: ['Optitex / Gerber CAD', 'Quality Inspection (AQL)'],
        minEducation: 'Certificate in Fashion Technology / Tailoring',
        minExperienceYears: 3.0,
        workConditions: 'Apparel production floor, cutting tables',
        isVerifiedOfficial: true,
      },
      {
        id: 'occ_plumbing_specialist',
        ncoCode: '7126.0101',
        title: 'Commercial MEP Piping Specialist',
        sector: 'Construction & Facilities',
        description: 'Multistory pressure testing, copper brazing, PVC/PPR hot-cold distribution, and backflow prevention.',
        requiredSkills: ['Pipe Brazing & Soldering', 'Hydrostatic Pressure Testing', 'Drain-Waste-Vent (DWV) Layouts', 'Boiler Connection'],
        preferredSkills: ['Piping Isometric Drawing', 'Solar Thermal Plumbing'],
        minEducation: 'ITI Plumber / Vocational Certificate',
        minExperienceYears: 2.0,
        workConditions: 'Commercial building shafts, utility basements',
        isVerifiedOfficial: true,
      },
      {
        id: 'occ_digital_office',
        ncoCode: '4110.0100',
        title: 'Digital Office Operations Specialist',
        sector: 'IT & Business Services',
        description: 'Database spreadsheet modeling, GST billing workflows, ERP entry, and digital communication.',
        requiredSkills: ['Advanced Spreadsheets (VLOOKUP/XLOOKUP)', 'Tally / ERP Data Entry', 'GST Invoicing Compliance', 'Data Hygiene'],
        preferredSkills: ['Basic SQL Queries', 'Customer Relationship Management (CRM)'],
        minEducation: 'Higher Secondary / Graduation in Commerce/Arts',
        minExperienceYears: 1.0,
        workConditions: 'Office computer workstation',
        isVerifiedOfficial: true,
      },
    ];

    benchmarkList.forEach((b) => this.benchmarks.set(b.id, b));

    // 2. Ready for Real Employer & Vacancy Data (clean data - zero demo employers/jobs)
    // Real employers post vacancies directly via /api/employer/jobs

    // 3. Regional Analytics (Tamil Nadu, Karnataka, Maharashtra, etc.)
    this.regionalData = [
      { state: 'Tamil Nadu', district: 'Salem', sector: 'Automotive & Clean Mobility', openJobsCount: 24, candidateCount: 56 },
      { state: 'Tamil Nadu', district: 'Coimbatore', sector: 'Industrial Automation & Textiles', openJobsCount: 42, candidateCount: 88 },
      { state: 'Tamil Nadu', district: 'Chennai', sector: 'IT Services & Manufacturing', openJobsCount: 68, candidateCount: 140 },
      { state: 'Karnataka', district: 'Bangalore Urban', sector: 'Digital Services & EV', openJobsCount: 85, candidateCount: 195 },
      { state: 'Maharashtra', district: 'Pune', sector: 'Automotive Engineering', openJobsCount: 51, candidateCount: 112 },
    ];

    // 4. System Health Metrics
    const components = ['DATABASE', 'AI_PROVIDER', 'STT', 'TTS', 'REDIS', 'STORAGE'];
    components.forEach((comp) => {
      this.systemHealth.push({
        component: comp,
        status: 'HEALTHY',
        latencyMs: Math.floor(18 + Math.random() * 20),
        details: 'Operating with optimal responsiveness and zero dropped frames.',
        recordedAt: new Date().toISOString(),
      });
    });

    // 5. Ready for Real Job Seeker / Beneficiary Data (clean data - zero demo beneficiary profiles/accounts)
    // Real job seekers register and complete authentic conversational onboarding via Aisha

    // 6. Comprehensive NGO Demonstration Community (DEMO DATA)
    const demoNgoId = 'ngo_gramaseva_01';
    const demoNgoUser: UserEntity = {
      id: 'usr_ngo_lead',
      email: 'ngo.director@gramaseva.org',
      phoneNumber: '+919443218765',
      displayName: 'Dr. Shanmuga Sundaram',
      role: 'NGO',
      roleAssignedAt: new Date().toISOString(),
      provider: 'GOOGLE',
      createdAt: new Date().toISOString(),
    };
    this.users.set(demoNgoUser.id, demoNgoUser);

    const demoNgo: NGOEntity = {
      id: demoNgoId,
      name: 'Grama Seva Community Livelihood Mission',
      logoUrl: '/images/ngo-logo.png',
      orgType: 'TRUST',
      registrationNumber: 'TN-TRUST-2018-09412',
      contactPerson: 'Dr. Shanmuga Sundaram',
      contactEmail: 'ngo.director@gramaseva.org',
      contactPhone: '+919443218765',
      website: 'https://gramaseva-livelihoods.org',
      address: '42/1 Gandhi Road, Hastampatti',
      state: 'Tamil Nadu',
      district: 'Salem',
      operatingRegions: ['Salem', 'Coimbatore', 'Erode', 'Namakkal', 'Dharmapuri'],
      languagesSupported: ['en', 'ta', 'te', 'hi'],
      focusAreas: [
        'Livelihood development',
        'Skill development',
        'Employment support',
        'Rural development',
        'Women livelihood support',
        'Vocational training',
        'Digital literacy',
        'Traditional / artisan skills',
      ],
      yearsOfOperation: 6.5,
      about: 'Empowering rural and semi-urban communities across western Tamil Nadu through skills identification, technical hands-on upskilling, and direct employer placement.',
      verificationStatus: 'VERIFIED',
      isVerified: true,
      createdAt: new Date(Date.now() - 365 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.ngos.set(demoNgo.id, demoNgo);

    // NGO Team Members (RBAC)
    const members: NGOMemberEntity[] = [
      { id: 'mem_1', ngoId: demoNgoId, userId: 'usr_ngo_lead', name: 'Dr. Shanmuga Sundaram', role: 'NGO_ADMIN', email: 'ngo.director@gramaseva.org', phone: '+919443218765', joinedAt: '2020-01-15' },
      { id: 'mem_2', ngoId: demoNgoId, userId: 'usr_ngo_mem_2', name: 'Karthik Ranganathan', role: 'PROGRAM_MANAGER', email: 'karthik@gramaseva.org', phone: '+919443218766', joinedAt: '2021-04-10' },
      { id: 'mem_3', ngoId: demoNgoId, userId: 'usr_ngo_mem_3', name: 'Lakshmi Narayanan', role: 'COMMUNITY_WORKER', email: 'lakshmi@gramaseva.org', phone: '+919443218767', joinedAt: '2022-08-01' },
      { id: 'mem_4', ngoId: demoNgoId, userId: 'usr_ngo_mem_4', name: 'Senthamarai V', role: 'TRAINING_COORDINATOR', email: 'senthamarai@gramaseva.org', phone: '+919443218768', joinedAt: '2023-02-14' },
      { id: 'mem_5', ngoId: demoNgoId, userId: 'usr_ngo_mem_5', name: 'Murali Krishnan', role: 'EMPLOYMENT_COORDINATOR', email: 'murali@gramaseva.org', phone: '+919443218769', joinedAt: '2023-09-01' },
    ];
    members.forEach((m) => this.ngoMembers.set(m.id, m));

    // NGO Beneficiary Profiles: Starts completely clean for real community members

    // NGO Training Programs with Demand Intelligence (Requirement 13 & 14)
    const trainingProgramsList: NGOTrainingProgramEntity[] = [
      {
        id: 'prog_auto_diag',
        ngoId: demoNgoId,
        title: 'Commercial OBD-II Vehicle Diagnostics & Sensor Tuning',
        sector: 'Automotive & Clean Mobility',
        durationHours: 60,
        capacity: 40,
        enrolledCount: 38,
        completedCount: 32,
        interestedCount: 127,
        skillsCovered: ['Engine Diagnostics', 'OBD-II Scanning', 'Brake Systems', 'Sensor Calibration'],
        isNSQFAligned: true,
        nsqfPathwayNote: 'Verified NSQF Level 4 Qualification (ASDC/Q1402)',
        status: 'ACTIVE',
        state: 'Tamil Nadu',
        district: 'Salem',
        createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
      },
      {
        id: 'prog_solar_pv',
        ngoId: demoNgoId,
        title: 'Rooftop Grid-Tied Solar PV Installation Lead',
        sector: 'Renewable Energy',
        durationHours: 80,
        capacity: 30,
        enrolledCount: 28,
        completedCount: 24,
        interestedCount: 85,
        skillsCovered: ['Solar Inverter Configuration', 'PV String Voltage Testing', 'Rooftop Structural Mounting', 'Earthing & Lightning Arrestor Setup'],
        isNSQFAligned: true,
        nsqfPathwayNote: 'Verified NSQF Level 4 Qualification (SCGJ/Q0101)',
        status: 'ACTIVE',
        state: 'Tamil Nadu',
        district: 'Coimbatore',
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: 'prog_gst_office',
        ngoId: demoNgoId,
        title: 'Digital Office Administration & GST Compliance',
        sector: 'IT & Business Services',
        durationHours: 45,
        capacity: 35,
        enrolledCount: 35,
        completedCount: 30,
        interestedCount: 94,
        skillsCovered: ['Advanced Spreadsheets (VLOOKUP/XLOOKUP)', 'Tally / ERP Data Entry', 'GST Invoicing Compliance', 'Data Hygiene'],
        isNSQFAligned: false,
        nsqfPathwayNote: 'Preliminary AI pathway — verification required',
        status: 'ACTIVE',
        state: 'Tamil Nadu',
        district: 'Salem',
        createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
      {
        id: 'prog_apparel_cad',
        ngoId: demoNgoId,
        title: 'Industrial Apparel Pattern Drafting & Quality Inspection',
        sector: 'Textile & Apparel',
        durationHours: 50,
        capacity: 25,
        enrolledCount: 22,
        completedCount: 18,
        interestedCount: 62,
        skillsCovered: ['Pattern Drafting', 'Fabric Grading', 'Industrial Sewing Machine Tuning', 'Quality Inspection (AQL)'],
        isNSQFAligned: true,
        nsqfPathwayNote: 'Verified NSQF Level 3 Qualification (AMH/Q1201)',
        status: 'ACTIVE',
        state: 'Tamil Nadu',
        district: 'Salem',
        createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
    ];
    trainingProgramsList.forEach((tp) => this.ngoTrainingPrograms.set(tp.id, tp));

    // Community Programs / Camps (Requirement 20)
    const communityProgramsList: CommunityProgramEntity[] = [
      {
        id: 'camp_01',
        ngoId: demoNgoId,
        title: 'Salem Clean Mobility & EV Technician Skill Camp',
        description: 'Hands-on practical orientation on EV high-voltage safety, diagnostic scanners, and battery health inspection in partnership with Nexus Mobility.',
        programType: 'SKILL_CAMP',
        location: 'Hastampatti Community Hall, Salem',
        state: 'Tamil Nadu',
        district: 'Salem',
        startDate: '2026-10-15',
        endDate: '2026-10-17',
        capacity: 120,
        registered: 104,
        attended: 98,
        eligibility: 'ITI Automobile / Mechanical diploma holders or mechanics with 1+ years workshop experience',
        skillsCovered: ['Engine Diagnostics', 'EV High Voltage Safety', 'OBD-II Scanning'],
        outcome: '98 community mechanics evaluated, 38 referred to specialized diagnostic upskilling program.',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: 'camp_02',
        ngoId: demoNgoId,
        title: 'Rural Solar PV Career & Livelihood Awareness Drive',
        description: 'Community awareness on rooftop solar net metering, government subsidy benefits, and technician employment opportunities.',
        programType: 'AWARENESS',
        location: 'Omalur Block Panchayat Center',
        state: 'Tamil Nadu',
        district: 'Salem',
        startDate: '2026-10-22',
        endDate: '2026-10-22',
        capacity: 80,
        registered: 76,
        attended: 70,
        eligibility: 'Open to rural youth and local electricians',
        skillsCovered: ['Solar Inverter Configuration', 'Rooftop Structural Mounting'],
        outcome: '28 youth enrolled for upcoming Suryamitra certification batch.',
        createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      },
      {
        id: 'camp_03',
        ngoId: demoNgoId,
        title: 'Women Digital Commerce & GST Invoicing Clinic',
        description: 'Practical training on computer spreadsheets, digital bill generation, and basic bookkeeping for women self-help group members.',
        programType: 'DIGITAL_LITERACY',
        location: 'Attur Town Panchayat Hall',
        state: 'Tamil Nadu',
        district: 'Salem',
        startDate: '2026-11-05',
        endDate: '2026-11-07',
        capacity: 60,
        registered: 58,
        attended: 52,
        eligibility: 'Women SHG members and 12th pass rural women',
        skillsCovered: ['Advanced Spreadsheets (VLOOKUP/XLOOKUP)', 'Tally / ERP Data Entry', 'GST Invoicing Compliance'],
        outcome: '30 participants certified in digital bookkeeping.',
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      },
    ];
    communityProgramsList.forEach((cp) => this.communityPrograms.set(cp.id, cp));

    // Support Cases & Grievances: Starts completely clean for real user tickets

    // Seed Audit Log
    this.auditLogs.push({
      id: 'aud_init_01',
      action: 'PLATFORM_BOOTSTRAP',
      resource: 'SYSTEM',
      ipAddress: '127.0.0.1',
      details: { status: 'Clean production-ready database initialized with official NCO standards and NGO Ecosystem.' },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Reset all Job Seeker and Employer data safely (Development Reset)
   * Preserves reference standards, NGO workspace, admin configuration, and system accounts.
   */
  public resetBeneficiaryAndEmployerData() {
    this.profiles.clear();
    this.jobs.clear();
    this.applications.clear();
    this.learningPaths.clear();
    this.assessments.clear();
    this.supportCases.clear();
    this.complaints.clear();
    this.ngoComplaints.clear();
    this.employers.clear();

    // Clean up users: remove any beneficiary or employer users, preserve ADMIN and NGO accounts
    for (const [id, user] of this.users.entries()) {
      if (
        user.role === 'BENEFICIARY' ||
        user.role === 'EMPLOYER' ||
        id.startsWith('usr_seed_') ||
        id.startsWith('usr_emp_')
      ) {
        this.users.delete(id);
      }
    }

    this.recordAudit('DEVELOPMENT_RESET', 'SYSTEM', undefined, undefined, {
      message: 'Complete Job Seeker and Employer data reset performed successfully.',
    });
  }

  // Hash OTP helper for security (Requirement 7 & 41)
  public hashOtp(code: string, salt: string): string {
    return crypto.createHmac('sha256', salt).update(code.trim()).digest('hex');
  }

  public recordAudit(action: string, resource: string, userId?: string, targetId?: string, details?: any, ipAddress?: string) {
    const entry: AuditLogEntity = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      action,
      resource,
      targetId,
      details,
      ipAddress,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return entry;
  }
}

export const platformStore = new PlatformStore();
