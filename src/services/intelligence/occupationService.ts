import { StructuredUserProfile } from '../../types/onboarding';
import { ExtractedSkill, OccupationPathway, ExplainabilityQuad } from '../../types/skillIntelligence';

export interface StandardOccupationBenchmark {
  id: string;
  ncoCodeEquivalent?: string; // Standard NCO-2015 code (e.g. "7231.0101")
  nsqfLevelEquivalent?: number; // Equivalent NSQF Level (e.g. Level 4)
  title: string;
  sector: string;
  keywords: string[];
  requiredSkills: string[];
  recommendedTraining: string[];
}

export const OCCUPATION_BENCHMARKS: StandardOccupationBenchmark[] = [
  {
    id: 'occ_auto_diag',
    ncoCodeEquivalent: 'NCO-2015: 7231.0101',
    nsqfLevelEquivalent: 4,
    title: 'Automobile Diagnostic Technician',
    sector: 'Automotive & Mobility',
    keywords: ['mechanic', 'automobile', 'car', 'bike', 'vehicle', 'motor', 'engine', 'brake', 'garage', 'workshop'],
    requiredSkills: [
      'Automotive Maintenance & Servicing',
      'Engine Diagnostics & Troubleshooting',
      'Brake Servicing & Hydraulic Assembly',
      'Electronic Vehicle Diagnostics (OBD-II)',
      'Digital Sensor Calibration',
    ],
    recommendedTraining: [
      'Advanced OBD-II Digital Diagnostic Scanner Mastery',
      'Modern Common Rail Diesel & MPFI Fuel Injection',
    ],
  },
  {
    id: 'occ_ev_tech',
    ncoCodeEquivalent: 'NCO-2015: 7231.0102',
    nsqfLevelEquivalent: 4,
    title: 'Electric Vehicle (EV) Service Specialist',
    sector: 'Clean Mobility & Green Jobs',
    keywords: ['electric', 'mechanic', 'automobile', 'battery', 'wiring', 'motor', 'ev', 'vehicle'],
    requiredSkills: [
      'Automotive Maintenance & Servicing',
      'Automotive Electrical Systems',
      'High-Voltage Battery Safety Protocol',
      'EV Traction Motor Servicing',
      'BMS (Battery Management System) Diagnostics',
    ],
    recommendedTraining: [
      'NSDC Certified High-Voltage EV Safety & Service Foundation',
      'Lithium-Ion Battery Health Monitoring & Thermal Systems',
    ],
  },
  {
    id: 'occ_solar_rooftop',
    ncoCodeEquivalent: 'NCO-2015: 7137.0201',
    nsqfLevelEquivalent: 4,
    title: 'Solar PV Rooftop Installation Technician',
    sector: 'Renewable Energy',
    keywords: ['solar', 'electrician', 'wiring', 'panel', 'inverter', 'outdoor', 'electrical'],
    requiredSkills: [
      'Electrical Circuit Installation',
      'Cable Routing & Termination',
      'Solar PV Array Mounting & Clamping',
      'DC String Cabling & Inverter Connection',
      'Earthing & Lightning Protection Systems',
    ],
    recommendedTraining: [
      'Suryamitra Certified Solar PV Installer Curriculum',
      'Grid-Tied Rooftop Inverter Synchronization & Safety',
    ],
  },
  {
    id: 'occ_ind_electrician',
    ncoCodeEquivalent: 'NCO-2015: 7412.0101',
    nsqfLevelEquivalent: 4,
    title: 'Industrial Automation Electrician',
    sector: 'Electrical & Industrial Manufacturing',
    keywords: ['electrician', 'wiring', 'circuit', 'lineman', 'industrial', 'factory', 'motor'],
    requiredSkills: [
      'Electrical Circuit Installation',
      'Multimeter & Continuity Testing',
      'Cable Routing & Termination',
      'PLC & Relay Logic Control Wiring',
      'Industrial Motor Starter Maintenance',
    ],
    recommendedTraining: [
      'Three-Phase Motor Starters & Variable Frequency Drives (VFD)',
      'Industrial Safety & Lockout/Tagout (LOTO) Compliance',
    ],
  },
  {
    id: 'occ_apparel_designer',
    ncoCodeEquivalent: 'NCO-2015: 7531.0101',
    nsqfLevelEquivalent: 3,
    title: 'Apparel Pattern Maker & Garment Specialist',
    sector: 'Textiles & Apparel',
    keywords: ['tailor', 'sewing', 'garment', 'stitching', 'textile', 'fashion', 'apparel', 'craft'],
    requiredSkills: [
      'Garment Pattern Cutting & Marking',
      'Industrial Sewing Machine Operation',
      'Seam Finishing & Quality Inspection',
      'Computer-Aided Pattern Drafting (CAD)',
      'Technical Fabric Stress & Fit Testing',
    ],
    recommendedTraining: [
      'Digital CAD Pattern Drafting & Marker Planning',
      'Export Quality Control & Garment Defect Prevention',
    ],
  },
  {
    id: 'occ_plumbing_specialist',
    ncoCodeEquivalent: 'NCO-2015: 7126.0101',
    nsqfLevelEquivalent: 3,
    title: 'Commercial Piping & Water Management Technician',
    sector: 'Construction & Facilities',
    keywords: ['plumber', 'pipe', 'fitting', 'sanitary', 'water', 'drainage', 'pump'],
    requiredSkills: [
      'Pipe Threading, Jointing & Alignment',
      'Pressure Leak Testing & Sealant Application',
      'Sanitary Fixture Installation',
      'Automated Hydro-Pneumatic Pumping Systems',
      'Rainwater Harvesting & Filtration Plumbing',
    ],
    recommendedTraining: [
      'Modern Electrofusion & Multilayer Composite Piping',
      'Commercial Booster Pump System Installation',
    ],
  },
  {
    id: 'occ_digital_office',
    ncoCodeEquivalent: 'NCO-2015: 4132.0101',
    nsqfLevelEquivalent: 3,
    title: 'Digital Business Operations & Data Specialist',
    sector: 'IT & Business Support',
    keywords: ['computer', 'data', 'office', 'clerk', 'admin', 'digital', 'operator', 'typing'],
    requiredSkills: [
      'Data Entry & Spreadsheets',
      'Digital Communication & Filing',
      'Basic Peripheral Troubleshooting',
      'Cloud Document Management & ERP Entry',
      'Data Privacy & Secure File Handling',
    ],
    recommendedTraining: [
      'Advanced Cloud Spreadsheet Analytics & Pivot Reporting',
      'GST Billing & Digital Inventory Systems',
    ],
  },
];

export class OccupationService {
  /**
   * Match potential pathways based strictly on skills, experience, tools, and aspirations.
   * STRICT ETHICAL SAFEGUARD: Caste/community is never a factor in occupation determination.
   */
  static matchPathways(
    profile: StructuredUserProfile,
    extractedSkills: ExtractedSkill[]
  ): OccupationPathway[] {
    const userSkillNames = new Set(extractedSkills.map((s) => s.name.toLowerCase()));
    const profileText = [
      profile.livelihood.currentOccupation,
      ...profile.livelihood.previousOccupations,
      ...profile.interests,
      profile.education.qualification,
      profile.workPreferences.employmentType,
      ...profile.tools,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const scoredBenchmarks = OCCUPATION_BENCHMARKS.map((benchmark) => {
      let keywordHits = 0;
      for (const kw of benchmark.keywords) {
        if (profileText.includes(kw)) keywordHits += 2;
      }

      const existing: string[] = [];
      const gaps: string[] = [];

      for (const reqSkill of benchmark.requiredSkills) {
        const reqLower = reqSkill.toLowerCase();
        const hasSkill = Array.from(userSkillNames).some(
          (uName) => uName.includes(reqLower) || reqLower.includes(uName)
        );
        if (hasSkill) {
          existing.push(reqSkill);
        } else {
          gaps.push(reqSkill);
        }
      }

      const matchScore = keywordHits + existing.length * 3;
      return { benchmark, existing, gaps, matchScore };
    });

    scoredBenchmarks.sort((a, b) => b.matchScore - a.matchScore);

    // Pick top matching pathways
    let topPathways = scoredBenchmarks.slice(0, 3).filter((item) => item.matchScore > 0);
    if (topPathways.length === 0) {
      topPathways = [scoredBenchmarks[0]];
    }

    return topPathways.map(({ benchmark, existing, gaps }) => {
      const existingList = existing.length > 0 ? existing : ['Demonstrated practical vocational foundation'];
      const gapList = gaps.slice(0, 3);

      let whyText = '';
      if (existing.length >= 2) {
        whyText = `Your reported background in ${existing.slice(0, 2).join(' and ')} directly supports the operational demands of this pathway.`;
      } else if (existing.length === 1) {
        whyText = `Your verified competence in ${existing[0]} provides a solid foundation to progress in ${benchmark.sector}.`;
      } else {
        whyText = `Your hands-on aptitude and preferred domain alignment make this a natural progression in ${benchmark.sector}.`;
      }

      const evidenceText = `Backed by ${profile.livelihood.yearsOfExperience || 1} year(s) of reported field practice and ${existing.length} verified technical skills.`;
      const gapsText = gapList.length > 0 ? gapList.join(', ') : 'No primary operational gaps identified.';
      
      const actionType: 'assessment' | 'training' | 'direct' =
        existing.length >= 3 ? 'direct' : existing.length >= 1 ? 'assessment' : 'training';

      const nextStepText =
        actionType === 'direct'
          ? 'Ready for direct industry placement or certified apprenticeship.'
          : actionType === 'assessment'
          ? 'Undertake practical skill assessment to benchmark troubleshooting proficiency.'
          : 'Enroll in foundational training module to bridge technical gaps.';

      const explainability: ExplainabilityQuad = {
        why: whyText,
        evidence: evidenceText,
        gaps: gapsText,
        nextStep: nextStepText,
      };

      return {
        id: benchmark.id,
        ncoCodeEquivalent: benchmark.ncoCodeEquivalent,
        nsqfLevelEquivalent: benchmark.nsqfLevelEquivalent,
        title: benchmark.title,
        sector: benchmark.sector,
        rationale: whyText,
        explainability,
        existingSkills: existingList,
        potentialGaps: gapList,
        trainingRecommendations: benchmark.recommendedTraining,
        sourceType: 'preliminary',
        sourceNotice: 'Preliminary AI analysis • Pending connection to official NCO/NSQF standards',
        actionType,
      };
    });
  }
}
