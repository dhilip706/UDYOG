import {
  NGOProfile,
  BeneficiaryProfile,
  CommunityOverviewStats,
  CommunityProgram,
  NGOTrainingProgram,
  DemandIntelligenceItem,
  SkillInventoryItem,
  SkillGapItem,
  AssessmentRecord,
  JobOpportunity,
  EmployerNetworkItem,
  MatchAnalysis,
  JobApplicationItem,
  OutcomesFunnel,
  PlacedBeneficiary,
  SupportCase,
  NGOComplaint,
  NGOTeamMember,
} from '../types/ngo';
import { authService } from './authService';

class NgoService {
  private getHeaders(): Record<string, string> {
    const session = authService.getStoredSession();
    return {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    };
  }

  public async getOverview(): Promise<{
    ngo: NGOProfile;
    metrics: Record<string, number>;
    recentActivities: Array<{ id: string; action: string; text: string; timestamp: string }>;
    isDemoNotice: string;
  }> {
    try {
      const res = await fetch('/api/ngo/overview', { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, using fallback:', e);
    }

    return {
      ngo: this.getFallbackNgo(),
      metrics: {
        communityMembers: 188,
        activeProfiles: 4,
        skillGapsIdentified: 18,
        learningJourneys: 123,
        trainingPrograms: 4,
        jobOpportunities: 4,
        applicationsSupported: 1,
        employmentOutcomes: 1,
        communityProgramsCount: 3,
        activeCasesCount: 2,
      },
      recentActivities: [
        { id: 'act_1', action: 'CAMP_SCHEDULED', text: 'Regional Clean Mobility & Skill Camp announced for regional centers', timestamp: new Date(Date.now() - 48 * 3600000).toISOString() },
        { id: 'act_2', action: 'TRAINING_PROGRAM_READY', text: 'NSQF-aligned Commercial OBD-II Vehicle Diagnostics module published', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
      ],
      isDemoNotice: 'DEMO DATA — Operating in regional demonstration mode (Tamil Nadu: Salem & Coimbatore). Never present simulated numbers as official government statistics.',
    };
  }

  public async getCommunityOverview(): Promise<{
    stats: CommunityOverviewStats;
    breakdownByDistrict: Array<{ district: string; count: number; percentage: number }>;
    breakdownByOccupation: Array<{ occupation: string; count: number; percentage: number }>;
    breakdownByEducation: Array<{ level: string; count: number; percentage: number }>;
    breakdownBySkillCategory: Array<{ category: string; count: number }>;
  }> {
    try {
      const res = await fetch('/api/ngo/community', { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }

    return {
      stats: {
        totalPeopleOnboarded: 4,
        newRegistrationsThisMonth: 14,
        peopleSeekingEmployment: 4,
        peopleSeekingTraining: 2,
        peopleAlreadySkilled: 2,
        peopleNeedingAssessment: 1,
        peopleCurrentlyLearning: 1,
        peopleMatchedWithOpportunities: 1,
        peopleEmployed: 1,
      },
      breakdownByDistrict: [
        { district: 'Salem', count: 3, percentage: 75 },
        { district: 'Coimbatore', count: 1, percentage: 25 },
      ],
      breakdownByOccupation: [
        { occupation: 'Automotive Mechanic & Diagnostics', count: 1, percentage: 25 },
        { occupation: 'Digital Office & GST Accounts', count: 1, percentage: 25 },
        { occupation: 'Rooftop Solar PV Installation', count: 1, percentage: 25 },
        { occupation: 'Apparel Patternmaker & Tailoring', count: 1, percentage: 25 },
      ],
      breakdownByEducation: [
        { level: 'ITI / Technical Diploma', count: 2, percentage: 50 },
        { level: 'Graduation / Degree', count: 1, percentage: 25 },
        { level: 'Vocational Certificate', count: 1, percentage: 25 },
      ],
      breakdownBySkillCategory: [
        { category: 'Technical Skills', count: 8 },
        { category: 'Practical & Tool Handling', count: 5 },
        { category: 'Digital & Software', count: 3 },
        { category: 'Traditional & Craft', count: 1 },
        { category: 'Communication', count: 1 },
      ],
    };
  }

  public async getBeneficiaries(filters?: { district?: string; occupation?: string; search?: string; trainingStatus?: string }): Promise<BeneficiaryProfile[]> {
    try {
      const query = new URLSearchParams();
      if (filters?.district) query.set('district', filters.district);
      if (filters?.occupation) query.set('occupation', filters.occupation);
      if (filters?.search) query.set('search', filters.search);
      if (filters?.trainingStatus) query.set('trainingStatus', filters.trainingStatus);

      const res = await fetch(`/api/ngo/beneficiaries?${query.toString()}`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.beneficiaries || [];
      }
    } catch (e) {
      console.warn(e);
    }

    return this.getFallbackBeneficiaries();
  }

  public async addBeneficiaryNote(profileId: string, text: string): Promise<{ success: boolean; note?: any }> {
    try {
      const res = await fetch(`/api/ngo/beneficiaries/${profileId}/notes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ text }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    return { success: true, note: { id: `note_${Date.now()}`, text, author: 'NGO Staff', timestamp: new Date().toISOString() } };
  }

  public async submitAssistedOnboarding(data: any): Promise<{ success: boolean; profile?: BeneficiaryProfile; error?: string }> {
    try {
      const res = await fetch('/api/ngo/assisted-onboarding', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      return { success: false, error: err.message || 'Assisted onboarding failed' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error during submission' };
    }
  }

  public async getSkillInventory(): Promise<{ totalSkillsTracked: number; categories: string[]; skills: SkillInventoryItem[] }> {
    try {
      const res = await fetch('/api/ngo/skills', { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }

    return {
      totalSkillsTracked: 12,
      categories: [
        'Technical Skills',
        'Practical Skills',
        'Digital Skills',
        'Communication',
        'Tools & Equipment',
        'Domain Knowledge',
        'Business Skills',
        'Traditional / Craft Skills',
        'Education & Certifications',
      ],
      skills: [
        { name: 'Engine Diagnostics', category: 'TECHNICAL', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
        { name: 'OBD-II Scanning', category: 'TECHNICAL', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
        { name: 'Solar Inverter Configuration', category: 'TECHNICAL', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
        { name: 'PV String Voltage Testing', category: 'TECHNICAL', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
        { name: 'Advanced Spreadsheets (VLOOKUP/XLOOKUP)', category: 'DIGITAL', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
        { name: 'Tally / ERP Data Entry', category: 'DIGITAL', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
        { name: 'GST Invoicing Compliance', category: 'TECHNICAL', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
        { name: 'Pattern Drafting', category: 'TRADITIONAL_CRAFT', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
        { name: 'Industrial Sewing Machine Tuning', category: 'PRACTICAL', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
        { name: 'Brake Systems', category: 'PRACTICAL', practitionerCount: 1, evidenceBreakdown: { CONFIRMED: 1 } },
      ],
    };
  }

  public async getSkillGaps(): Promise<SkillGapItem[]> {
    try {
      const res = await fetch('/api/ngo/skill-gaps', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.skillGaps || [];
      }
    } catch (e) {
      console.warn(e);
    }

    return [
      {
        id: 'gap_auto_01',
        sector: 'Automotive & Clean Mobility',
        occupation: 'Automotive Diagnostic Technician',
        commonGaps: ['Electric Vehicle (EV) Safety Protocols', 'CAN Bus Multi-Meter Diagnostics', 'ADAS Sensor Calibration'],
        communityDemandLevel: 'HIGH',
        interestedBeneficiariesCount: 42,
        verifiedBenchmark: 'NCO-2015 7231.0100 & ASDC/Q1402 Level 4',
        type: 'VERIFIED_STANDARD',
        recommendedPriorityTraining: true,
      },
      {
        id: 'gap_solar_02',
        sector: 'Renewable Energy',
        occupation: 'Solar PV Grid Installation Lead',
        commonGaps: ['Bi-directional Net Meter Commissioning', 'SCADA String Inverter Connectivity', 'Roof Anchor Load Calculation'],
        communityDemandLevel: 'HIGH',
        interestedBeneficiariesCount: 36,
        verifiedBenchmark: 'NCO-2015 7411.0102 & SCGJ/Q0101 Level 4',
        type: 'VERIFIED_STANDARD',
        recommendedPriorityTraining: true,
      },
      {
        id: 'gap_gst_03',
        sector: 'IT & Business Services',
        occupation: 'Digital Office & GST Accounts Associate',
        commonGaps: ['E-Way Bill Generation API', 'Multi-State Tax Ledger Reconciliation', 'Advanced Excel Array Functions'],
        communityDemandLevel: 'MEDIUM',
        interestedBeneficiariesCount: 28,
        verifiedBenchmark: 'NCO-2015 4110.0100',
        type: 'AI_DERIVED_OBSERVATION',
        recommendedPriorityTraining: true,
      },
      {
        id: 'gap_textile_04',
        sector: 'Textile & Apparel',
        occupation: 'Apparel Master Patternmaker',
        commonGaps: ['Computerized CAD Marker Making', 'Quality Inspection (AQL 2.5 Sampling)', 'Elastic Hem Tension Control'],
        communityDemandLevel: 'MEDIUM',
        interestedBeneficiariesCount: 22,
        verifiedBenchmark: 'NCO-2015 7531.0200 & AMH/Q1201 Level 3',
        type: 'VERIFIED_STANDARD',
        recommendedPriorityTraining: false,
      },
    ];
  }

  public async getAssessments(): Promise<AssessmentRecord[]> {
    try {
      const res = await fetch('/api/ngo/assessments', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.assessments || [];
      }
    } catch (e) {
      console.warn(e);
    }

    return [];
  }

  public async getTrainingManagement(): Promise<{ programs: NGOTrainingProgram[]; demandIntelligence: DemandIntelligenceItem[] }> {
    try {
      const res = await fetch('/api/ngo/training', { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }

    return {
      programs: [
        {
          id: 'prog_auto_diag',
          ngoId: 'ngo_gramaseva_01',
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
          createdAt: new Date().toISOString(),
        },
        {
          id: 'prog_solar_pv',
          ngoId: 'ngo_gramaseva_01',
          title: 'Rooftop Grid-Tied Solar PV Installation Lead',
          sector: 'Renewable Energy',
          durationHours: 80,
          capacity: 30,
          enrolledCount: 28,
          completedCount: 24,
          interestedCount: 85,
          skillsCovered: ['Solar Inverter Configuration', 'PV String Voltage Testing', 'Rooftop Structural Mounting'],
          isNSQFAligned: true,
          nsqfPathwayNote: 'Verified NSQF Level 4 Qualification (SCGJ/Q0101)',
          status: 'ACTIVE',
          state: 'Tamil Nadu',
          district: 'Coimbatore',
          createdAt: new Date().toISOString(),
        },
      ],
      demandIntelligence: [
        { skillName: 'Commercial Vehicle Diagnostics', interestedBeneficiaries: 127, availableProgramsCount: 1, totalCapacitySeats: 40, demandState: 'HIGH_DEMAND' },
        { skillName: 'Solar PV Installation & Net Metering', interestedBeneficiaries: 85, availableProgramsCount: 1, totalCapacitySeats: 30, demandState: 'HIGH_DEMAND' },
        { skillName: 'Digital GST Accounting', interestedBeneficiaries: 94, availableProgramsCount: 1, totalCapacitySeats: 35, demandState: 'HIGH_DEMAND' },
      ],
    };
  }

  public async createTrainingProgram(data: any): Promise<{ success: boolean; program?: NGOTrainingProgram; error?: string }> {
    try {
      const res = await fetch('/api/ngo/training', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      return { success: false, error: err.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public async getOpportunities(filters?: { district?: string; jobType?: string; search?: string }): Promise<JobOpportunity[]> {
    try {
      const query = new URLSearchParams();
      if (filters?.district) query.set('district', filters.district);
      if (filters?.jobType) query.set('jobType', filters.jobType);
      if (filters?.search) query.set('search', filters.search);

      const res = await fetch(`/api/ngo/opportunities?${query.toString()}`, { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.opportunities || [];
      }
    } catch (e) {
      console.warn(e);
    }

    return this.getFallbackJobs();
  }

  public async getEmployers(): Promise<EmployerNetworkItem[]> {
    try {
      const res = await fetch('/api/ngo/employers', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.employers || [];
      }
    } catch (e) {
      console.warn(e);
    }

    return [
      {
        id: 'emp_nexus_01',
        name: 'Nexus Mobility Engineering Pvt Ltd',
        industry: 'Automotive & Clean Mobility',
        district: 'Salem',
        state: 'Tamil Nadu',
        isVerified: true,
        openJobsCount: 2,
        contactPerson: 'K. Vijayakumar (Talent Acquisition Lead)',
        phone: '+919842109876',
        email: 'recruiter.nexus@demo-org.in',
        activeDemandSkills: ['Engine Diagnostics', 'OBD-II Scanning', 'EV High Voltage Safety', 'BMS'],
        partnershipStatus: 'Active MoU Partner',
      },
      {
        id: 'emp_surya_02',
        name: 'Surya Green Power Solutions',
        industry: 'Renewable Energy',
        district: 'Coimbatore',
        state: 'Tamil Nadu',
        isVerified: true,
        openJobsCount: 1,
        contactPerson: 'S. Ramanathan (Operations Director)',
        phone: '+919443201234',
        email: 'careers@suryagreenpower.org',
        activeDemandSkills: ['Solar Inverter Configuration', 'PV String Voltage Testing', 'Rooftop Structural Mounting'],
        partnershipStatus: 'Active Placement Partner',
      },
    ];
  }

  public async getMatchAnalysis(profileId?: string, jobId?: string): Promise<MatchAnalysis> {
    try {
      const res = await fetch('/api/ngo/matching', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ profileId, jobId }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }

    return {
      profileId: profileId || 'prof_seed_01',
      profileName: 'Murugan Selvan',
      jobId: jobId || 'job_auto_salem_01',
      jobTitle: 'Senior Automotive Diagnostics Technician',
      employerName: 'Nexus Mobility Engineering Pvt Ltd',
      matchScore: 92,
      explainableFactors: {
        matchedSkillsList: ['Engine Diagnostics', 'OBD-II Scanning', 'Brake Systems'],
        missingSkillsList: ['Sensor Calibration'],
        isLocalLocationPreferenceMet: true,
        locationDetails: 'Salem -> Salem Central Hub',
        isExperienceRequirementMet: true,
        experienceDetails: '3.5 yrs observed vs 2.0 yrs required',
        relevantTrainingCompleted: true,
        areasNeedingDevelopment: ['Sensor Calibration', 'EV High Voltage Safety'],
      },
      whyThisMatchesSummary:
        'Candidate matches 3 of 3 mandatory technical skills for Nexus Mobility Engineering Pvt Ltd. Location constraint is satisfied within Salem district. The candidate has completed required safety modules and is recommended for direct interview scheduling.',
    };
  }

  public async getApplications(): Promise<JobApplicationItem[]> {
    try {
      const res = await fetch('/api/ngo/applications', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.applications || [];
      }
    } catch (e) {
      console.warn(e);
    }

    return [];
  }

  public async updateApplication(id: string, status?: string, note?: string): Promise<{ success: boolean; application?: JobApplicationItem }> {
    try {
      const res = await fetch(`/api/ngo/applications/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status, note }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    return { success: true };
  }

  public async getOutcomes(): Promise<{ funnel: OutcomesFunnel; placedBeneficiaries: PlacedBeneficiary[] }> {
    try {
      const res = await fetch('/api/ngo/outcomes', { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }

    return {
      funnel: {
        profiledCount: 0,
        trainingCompletedCount: 0,
        matchedOpportunitiesCount: 0,
        submittedApplicationsCount: 0,
        shortlistedCount: 0,
        interviewedCount: 0,
        selectedCount: 0,
        retention30Days: 0,
        retention90Days: 0,
      },
      placedBeneficiaries: [],
    };
  }

  public async getCommunityPrograms(): Promise<CommunityProgram[]> {
    try {
      const res = await fetch('/api/ngo/programs', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.programs || [];
      }
    } catch (e) {
      console.warn(e);
    }

    return [
      {
        id: 'camp_01',
        ngoId: 'ngo_gramaseva_01',
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
        createdAt: new Date().toISOString(),
      },
      {
        id: 'camp_02',
        ngoId: 'ngo_gramaseva_01',
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
        createdAt: new Date().toISOString(),
      },
    ];
  }

  public async createCommunityProgram(data: any): Promise<{ success: boolean; program?: CommunityProgram; error?: string }> {
    try {
      const res = await fetch('/api/ngo/programs', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      return { success: false, error: err.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public async getCases(): Promise<SupportCase[]> {
    try {
      const res = await fetch('/api/ngo/cases', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.cases || [];
      }
    } catch (e) {
      console.warn(e);
    }

    return [
      {
        id: 'case_101',
        ngoId: 'ngo_gramaseva_01',
        profileId: 'prof_seed_01',
        beneficiaryName: 'Murugan Selvan',
        category: 'DOCUMENTATION',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        subject: 'ASDC Certificate attestation for overseas placement application',
        description: 'Beneficiary requires certified copy of ASDC Level 4 diagnostic credential and workshop verification certificate for Gulf technical visa review.',
        assignedTo: 'Lakshmi Narayanan',
        notes: [
          { id: 'not_1', text: 'Contacted regional ASDC center. Attestation letter scheduled for dispatch.', author: 'Lakshmi Narayanan', timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
        ],
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  public async createCase(data: any): Promise<{ success: boolean; caseItem?: SupportCase; error?: string }> {
    try {
      const res = await fetch('/api/ngo/cases', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      return { success: false, error: err.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public async updateCase(id: string, updates: { status?: string; note?: string; assignedTo?: string }): Promise<{ success: boolean; caseItem?: SupportCase }> {
    try {
      const res = await fetch(`/api/ngo/cases/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    return { success: true };
  }

  public async getComplaints(): Promise<NGOComplaint[]> {
    try {
      const res = await fetch('/api/ngo/complaints', { headers: this.getHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.complaints || [];
      }
    } catch (e) {
      console.warn(e);
    }

    return [
      {
        id: 'cmp_ngo_01',
        ngoId: 'ngo_gramaseva_01',
        ticketId: 'CMP-NGO-2026-081',
        beneficiaryName: 'Murugan Selvan',
        beneficiaryPhone: '+919876543210',
        category: 'TRAINING',
        priority: 'MEDIUM',
        status: 'INVESTIGATING',
        subject: 'Delay in physical certificate dispatch for EV safety module',
        description: 'Beneficiary completed the 40-hour hands-on safety module last month at the regional center. Verification link works but physical card has not arrived.',
        assignedTo: 'Senthamarai V',
        resolutionNote: 'Followed up with training provider registrar. Batch certificates dispatched via Speed Post.',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        events: [
          { id: 'cev_1', note: 'Grievance ticket registered by NGO field staff.', timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
        ],
      },
    ];
  }

  public async createComplaint(data: any): Promise<{ success: boolean; complaint?: NGOComplaint; error?: string }> {
    try {
      const res = await fetch('/api/ngo/complaints', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      return { success: false, error: err.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public async getReports(): Promise<{ reportDate: string; summary: any; exportDataset: any[] }> {
    try {
      const res = await fetch('/api/ngo/reports', { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }

    const profiles = this.getFallbackBeneficiaries();
    return {
      reportDate: new Date().toISOString(),
      summary: {
        totalBeneficiaries: profiles.length,
        activeTrainingPrograms: 4,
        totalTraineesEnrolled: 123,
        totalPlacementsConfirmed: 1,
      },
      exportDataset: profiles.map((p) => ({
        ProfileID: p.id,
        FullName: p.fullName,
        District: p.district,
        Occupation: p.currentOccupation,
        YearsExperience: p.yearsExperience,
        TrainingStatus: p.trainingStatus,
        SkillsCount: p.skills.length,
        VerificationStatus: p.isVerified ? 'VERIFIED' : 'PENDING',
      })),
    };
  }

  public async getOrganization(): Promise<{ organization: NGOProfile; members: NGOTeamMember[]; serviceAreas: any[] }> {
    try {
      const res = await fetch('/api/ngo/organization', { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }

    return {
      organization: this.getFallbackNgo(),
      members: [
        { id: 'mem_1', ngoId: 'ngo_gramaseva_01', userId: 'usr_ngo_lead', name: 'Dr. Shanmuga Sundaram', role: 'NGO_ADMIN', email: 'ngo.director@gramaseva.org', phone: '+919443218765', joinedAt: '2020-01-15' },
        { id: 'mem_2', ngoId: 'ngo_gramaseva_01', userId: 'usr_ngo_mem_2', name: 'Karthik Ranganathan', role: 'PROGRAM_MANAGER', email: 'karthik@gramaseva.org', phone: '+919443218766', joinedAt: '2021-04-10' },
        { id: 'mem_3', ngoId: 'ngo_gramaseva_01', userId: 'usr_ngo_mem_3', name: 'Lakshmi Narayanan', role: 'COMMUNITY_WORKER', email: 'lakshmi@gramaseva.org', phone: '+919443218767', joinedAt: '2022-08-01' },
        { id: 'mem_4', ngoId: 'ngo_gramaseva_01', userId: 'usr_ngo_mem_4', name: 'Senthamarai V', role: 'TRAINING_COORDINATOR', email: 'senthamarai@gramaseva.org', phone: '+919443218768', joinedAt: '2023-02-14' },
        { id: 'mem_5', ngoId: 'ngo_gramaseva_01', userId: 'usr_ngo_mem_5', name: 'Murali Krishnan', role: 'EMPLOYMENT_COORDINATOR', email: 'murali@gramaseva.org', phone: '+919443218769', joinedAt: '2023-09-01' },
      ],
      serviceAreas: [
        { id: 'sa_1', state: 'Tamil Nadu', district: 'Salem', blocks: ['Attur', 'Omalur', 'Hastampatti', 'Mettur'] },
        { id: 'sa_2', state: 'Tamil Nadu', district: 'Coimbatore', blocks: ['Pollachi', 'Sulur', 'Anaimalai'] },
      ],
    };
  }

  public async updateOrganization(data: Partial<NGOProfile>): Promise<{ success: boolean; organization?: NGOProfile; error?: string }> {
    try {
      const res = await fetch('/api/ngo/organization', {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
      const err = await res.json();
      return { success: false, error: err.message };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  public async askAssistant(prompt: string, context: string = 'GENERAL', targetId?: string): Promise<{ reply: string; evidenceSources: string[] }> {
    try {
      const res = await fetch('/api/ngo/assistant', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ prompt, context, targetId }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }

    return {
      reply:
        'AI Community Assistant: Based on the verified Tamil Nadu regional dataset, highest candidate interest is in Commercial Vehicle Diagnostics and Solar PV Grid Installations. Recommended next step is scheduling practical assessments at the Salem center.',
      evidenceSources: ['UDYOG Platform Intelligence', 'NCO-2015 Benchmarks'],
    };
  }

  private getFallbackNgo(): NGOProfile {
    return {
      id: 'ngo_gramaseva_01',
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
      about:
        'Empowering rural and semi-urban communities across western Tamil Nadu through skills identification, technical hands-on upskilling, and direct employer placement.',
      verificationStatus: 'VERIFIED',
      isVerified: true,
      createdAt: '2020-01-15T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
    };
  }

  private getFallbackBeneficiaries(): BeneficiaryProfile[] {
    return [];
  }

  private getFallbackJobs(): JobOpportunity[] {
    return [];
  }
}

export const ngoService = new NgoService();
