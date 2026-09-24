import { StructuredUserProfile } from '../../types/onboarding';
import {
  ExtractedSkill,
  SkillCategory,
  EvidenceConfidence,
  CoreStrength,
  CareerReadiness,
} from '../../types/skillIntelligence';

interface OccupationDecomposition {
  keywords: string[];
  skills: Array<{
    name: string;
    category: SkillCategory;
    evidencePattern: string;
  }>;
}

const OCCUPATION_DECOMPOSITIONS: OccupationDecomposition[] = [
  {
    keywords: ['mechanic', 'automobile', 'vehicle', 'motor', 'garage', 'auto', 'car', 'bike'],
    skills: [
      {
        name: 'Automotive Maintenance & Servicing',
        category: 'PRACTICAL',
        evidencePattern: 'Reported hands-on vehicle maintenance and servicing experience',
      },
      {
        name: 'Engine Diagnostics & Troubleshooting',
        category: 'TECHNICAL',
        evidencePattern: 'Identified through mechanical problem diagnosis and engine repair tasks',
      },
      {
        name: 'Brake Servicing & Hydraulic Assembly',
        category: 'PRACTICAL',
        evidencePattern: 'Reported brake replacement and safety inspection tasks',
      },
      {
        name: 'Automotive Electrical Systems',
        category: 'TECHNICAL',
        evidencePattern: 'Inferred from battery, starter, and wiring troubleshooting',
      },
    ],
  },
  {
    keywords: ['electrician', 'wiring', 'electrical', 'wireman', 'lineman', 'circuit'],
    skills: [
      {
        name: 'Electrical Circuit Installation',
        category: 'TECHNICAL',
        evidencePattern: 'Reported domestic or industrial electrical wiring experience',
      },
      {
        name: 'Cable Routing & Termination',
        category: 'PRACTICAL',
        evidencePattern: 'Reported conduit installation and distribution board connection work',
      },
      {
        name: 'Multimeter & Continuity Testing',
        category: 'TOOLS_EQUIPMENT',
        evidencePattern: 'Reported usage of electrical testing instruments and safety diagnostics',
      },
      {
        name: 'System Earthing & Electrical Safety',
        category: 'DOMAIN_KNOWLEDGE',
        evidencePattern: 'Reported grounding compliance and circuit breaker maintenance',
      },
    ],
  },
  {
    keywords: ['tailor', 'sewing', 'garment', 'textile', 'stitching', 'fashion', 'apparel'],
    skills: [
      {
        name: 'Garment Pattern Cutting & Marking',
        category: 'PRACTICAL',
        evidencePattern: 'Reported fabric measurement, drafting, and scissors cutting tasks',
      },
      {
        name: 'Industrial Sewing Machine Operation',
        category: 'TOOLS_EQUIPMENT',
        evidencePattern: 'Reported speed stitching, needle setting, and machine maintenance',
      },
      {
        name: 'Seam Finishing & Quality Inspection',
        category: 'PRACTICAL',
        evidencePattern: 'Reported hem finishing, buttonholing, and dimensional verification',
      },
      {
        name: 'Traditional Embroidery & Craftsmanship',
        category: 'TRADITIONAL',
        evidencePattern: 'Reported artisanal handwork and traditional decorative stitching',
      },
    ],
  },
  {
    keywords: ['solar', 'photovoltaic', 'renewable', 'panel', 'inverter'],
    skills: [
      {
        name: 'Solar PV Array Mounting & Clamping',
        category: 'PRACTICAL',
        evidencePattern: 'Reported rooftop mounting structure assembly and panel fixing',
      },
      {
        name: 'DC String Cabling & Inverter Connection',
        category: 'TECHNICAL',
        evidencePattern: 'Reported solar inverter wiring and DC disconnect installation',
      },
      {
        name: 'Solar System Performance Testing',
        category: 'TECHNICAL',
        evidencePattern: 'Reported open-circuit voltage and short-circuit current checking',
      },
    ],
  },
  {
    keywords: ['computer', 'data', 'operator', 'it', 'digital', 'clerk', 'office'],
    skills: [
      {
        name: 'Data Entry & Spreadsheets',
        category: 'DIGITAL',
        evidencePattern: 'Reported structured alphanumeric data capture and sheet formatting',
      },
      {
        name: 'Digital Communication & Filing',
        category: 'COMMUNICATION',
        evidencePattern: 'Reported email coordination and cloud document storage workflow',
      },
      {
        name: 'Basic Peripheral Troubleshooting',
        category: 'PROBLEM_SOLVING',
        evidencePattern: 'Reported printer configuration and connectivity troubleshooting',
      },
    ],
  },
  {
    keywords: ['plumber', 'pipe', 'sanitary', 'fitting', 'plumbing'],
    skills: [
      {
        name: 'Pipe Threading, Jointing & Alignment',
        category: 'PRACTICAL',
        evidencePattern: 'Reported PVC, CPVC, and GI pipe installation experience',
      },
      {
        name: 'Pressure Leak Testing & Sealant Application',
        category: 'PRACTICAL',
        evidencePattern: 'Reported hydro-testing and valve fitting work',
      },
      {
        name: 'Sanitary Fixture Installation',
        category: 'TOOLS_EQUIPMENT',
        evidencePattern: 'Reported tap, cistern, and drain line assembly',
      },
    ],
  },
  {
    keywords: ['welder', 'welding', 'fabrication', 'gas cutter', 'arc', 'mig', 'tig', 'metal'],
    skills: [
      {
        name: 'Shielded Metal Arc Welding (SMAW)',
        category: 'TECHNICAL',
        evidencePattern: 'Reported manual metal arc welding and joint preparation',
      },
      {
        name: 'Thermal Gas Cutting & Edge Beveling',
        category: 'PRACTICAL',
        evidencePattern: 'Reported oxy-acetylene torch operation and plate preparation',
      },
      {
        name: 'Weld Bead Quality & Visual Defect Inspection',
        category: 'PROBLEM_SOLVING',
        evidencePattern: 'Reported porosity, slag inclusion, and penetration checking',
      },
    ],
  },
  {
    keywords: ['mason', 'masonry', 'brick', 'concrete', 'construction', 'plaster'],
    skills: [
      {
        name: 'Brick & Block Laying Alignment',
        category: 'PRACTICAL',
        evidencePattern: 'Reported plumb-bob, spirit level, and mortar jointing work',
      },
      {
        name: 'Surface Plastering & Finishing',
        category: 'PRACTICAL',
        evidencePattern: 'Reported cement-sand ratio mixing, troweling, and line levelling',
      },
      {
        name: 'Concrete Shuttering & Curing Supervision',
        category: 'TECHNICAL',
        evidencePattern: 'Reported framework alignment, reinforcement placement, and water curing',
      },
    ],
  },
  {
    keywords: ['carpenter', 'wood', 'furniture', 'joinery', 'timber'],
    skills: [
      {
        name: 'Timber Measurement, Marking & Joinery',
        category: 'PRACTICAL',
        evidencePattern: 'Reported mortise, tenon, and dovetail joint fabrication',
      },
      {
        name: 'Power Woodworking Tool Handling',
        category: 'TOOLS_EQUIPMENT',
        evidencePattern: 'Reported circular saw, router, and orbital sander operation',
      },
      {
        name: 'Surface Lamination & Wood Finishing',
        category: 'PRACTICAL',
        evidencePattern: 'Reported veneer pressing, edge-banding, and protective polish application',
      },
    ],
  },
  {
    keywords: ['nurse', 'nursing', 'healthcare', 'patient', 'hospital', 'clinic', 'gda', 'attendant'],
    skills: [
      {
        name: 'Patient Vital Signs Monitoring',
        category: 'TECHNICAL',
        evidencePattern: 'Reported BP, pulse, temperature, and SpO2 recording',
      },
      {
        name: 'Hospital Infection Control & Sanitation',
        category: 'DOMAIN_KNOWLEDGE',
        evidencePattern: 'Reported PPE usage, biomedical waste segregation, and bed hygiene',
      },
      {
        name: 'Patient Mobility & Assistive Care',
        category: 'COMMUNICATION',
        evidencePattern: 'Reported bed-transfer, wheeling, and compassionate patient communication',
      },
    ],
  },
  {
    keywords: ['tractor', 'agriculture', 'farming', 'harvester', 'crop', 'irrigation'],
    skills: [
      {
        name: 'Agricultural Tractor Operation & Implements',
        category: 'PRACTICAL',
        evidencePattern: 'Reported cultivator, rotavator, and trolley hitching & field operation',
      },
      {
        name: 'Drip & Sprinkler Irrigation Setup',
        category: 'TECHNICAL',
        evidencePattern: 'Reported lateral pipe laying, emitter unclogging, and pump maintenance',
      },
      {
        name: 'Crop Protection Equipment Calibration',
        category: 'TOOLS_EQUIPMENT',
        evidencePattern: 'Reported knapsack and motorized sprayer nozzle maintenance and safety',
      },
    ],
  },
];

export class SkillExtractionService {
  /**
   * Extract explainable skills with verified evidence from user profile
   */
  static extractSkills(profile: StructuredUserProfile): ExtractedSkill[] {
    const extracted: ExtractedSkill[] = [];
    const seenSkillNames = new Set<string>();

    const expYears = profile.livelihood.yearsOfExperience || 0;
    const occStr = `${profile.livelihood.currentOccupation} ${profile.livelihood.previousOccupations.join(' ')}`.toLowerCase();

    // 1. Decompose Occupation into granular skills
    for (const decomp of OCCUPATION_DECOMPOSITIONS) {
      const matches = decomp.keywords.some((kw) => occStr.includes(kw));
      if (matches) {
        for (const sk of decomp.skills) {
          if (!seenSkillNames.has(sk.name.toLowerCase())) {
            seenSkillNames.add(sk.name.toLowerCase());
            const confidence: EvidenceConfidence =
              expYears >= 2 ? 'CONFIRMED' : expYears >= 1 ? 'SUPPORTED' : 'NEEDS_VERIFICATION';

            extracted.push({
              id: `sk_decomp_${extracted.length + 1}`,
              name: sk.name,
              category: sk.category,
              evidence: `${sk.evidencePattern} (${expYears > 0 ? `${expYears} years reported` : 'reported in profile'})`,
              experienceYears: expYears > 0 ? expYears : undefined,
              source: 'Verified Profile Interview',
              confidence,
              userStatus: 'confirmed',
            });
          }
        }
      }
    }

    // 2. Incorporate explicit skills recorded in profile
    for (const userSk of profile.skills) {
      const lower = userSk.name.toLowerCase();
      if (!seenSkillNames.has(lower)) {
        seenSkillNames.add(lower);
        const skillExp = userSk.experienceYears || expYears;
        const confidence: EvidenceConfidence =
          skillExp >= 2 ? 'CONFIRMED' : skillExp >= 1 ? 'SUPPORTED' : 'NEEDS_VERIFICATION';

        let cat: SkillCategory = 'PRACTICAL';
        if (userSk.category === 'technical') cat = 'TECHNICAL';
        else if (userSk.category === 'traditional') cat = 'TRADITIONAL';
        else if (userSk.category === 'soft') cat = 'COMMUNICATION';

        extracted.push({
          id: `sk_user_${extracted.length + 1}`,
          name: userSk.name,
          category: cat,
          evidence: `Directly reported by user: "${userSk.name}" with ${skillExp > 0 ? `${skillExp} years practical experience` : 'active application'}${userSk.notes ? ` (${userSk.notes})` : ''}.`,
          experienceYears: skillExp > 0 ? skillExp : undefined,
          notes: userSk.notes,
          source: 'User Statement in Interview',
          confidence,
          userStatus: 'confirmed',
        });
      }
    }

    // 3. Incorporate tools & equipment reported
    for (const tool of profile.tools) {
      const lower = `tool_${tool.toLowerCase()}`;
      if (!seenSkillNames.has(lower)) {
        seenSkillNames.add(lower);
        extracted.push({
          id: `sk_tool_${extracted.length + 1}`,
          name: `${tool} Operation & Handling`,
          category: 'TOOLS_EQUIPMENT',
          evidence: `User reported regular operational comfort with ${tool}.`,
          experienceYears: expYears > 0 ? expYears : undefined,
          source: 'Tools & Equipment Inventory',
          confidence: expYears >= 1 ? 'SUPPORTED' : 'NEEDS_VERIFICATION',
          userStatus: 'confirmed',
        });
      }
    }

    // 4. Incorporate education/certifications/training
    if (profile.education.qualification && profile.education.qualification.trim() !== '') {
      extracted.push({
        id: `sk_edu_${extracted.length + 1}`,
        name: `${profile.education.qualification} Foundational Competence`,
        category: 'EDUCATION_CERTIFICATION',
        evidence: `Supported by formal/vocational qualification: ${profile.education.qualification} (${profile.education.level || 'Completed'}).`,
        source: 'Educational Credentials',
        confidence: 'CONFIRMED',
        userStatus: 'confirmed',
      });
    }

    for (const cert of profile.education.certifications) {
      extracted.push({
        id: `sk_cert_${extracted.length + 1}`,
        name: `${cert} Certified Knowledge`,
        category: 'EDUCATION_CERTIFICATION',
        evidence: `Supported by documented certification: ${cert}.`,
        source: 'Professional Certification',
        confidence: 'CONFIRMED',
        userStatus: 'confirmed',
      });
    }

    if (profile.education.training) {
      for (const tr of profile.education.training) {
        if (tr && tr.trim() !== '') {
          extracted.push({
            id: `sk_tr_${extracted.length + 1}`,
            name: `${tr} Practical Training`,
            category: 'DOMAIN_KNOWLEDGE',
            evidence: `Completed specialized vocational training curriculum: ${tr}.`,
            source: 'Vocational Training Program',
            confidence: 'CONFIRMED',
            userStatus: 'confirmed',
          });
        }
      }
    }

    // If profile was minimal, provide at least practical baseline based on stated occupation
    if (extracted.length === 0 && profile.livelihood.currentOccupation) {
      extracted.push({
        id: 'sk_fallback_1',
        name: `${profile.livelihood.currentOccupation} Work Practice`,
        category: 'PRACTICAL',
        evidence: `Reported active engagement as ${profile.livelihood.currentOccupation} for ${expYears || 1} years.`,
        experienceYears: expYears || 1,
        source: 'Reported Primary Occupation',
        confidence: expYears >= 2 ? 'CONFIRMED' : 'SUPPORTED',
        userStatus: 'confirmed',
      });
    }

    return extracted;
  }

  /**
   * Derive core explainable strengths without arbitrary scoring
   */
  static extractStrengths(profile: StructuredUserProfile, skills: ExtractedSkill[]): CoreStrength[] {
    const strengths: CoreStrength[] = [];
    const exp = profile.livelihood.yearsOfExperience || 0;

    if (exp >= 3) {
      strengths.push({
        id: 'str_1',
        title: 'Deep Practical Field Experience',
        rationale: `Accumulated ${exp} years of sustained, hands-on work in ${profile.livelihood.currentOccupation || 'their vocation'}.`,
        evidence: `Verified work history of ${exp} years reported in onboarding interview.`,
        userStatus: 'confirmed',
      });
    } else if (exp >= 1) {
      strengths.push({
        id: 'str_1',
        title: 'Demonstrated Hands-on Foundation',
        rationale: `Practical work experience in ${profile.livelihood.currentOccupation || 'vocational roles'}.`,
        evidence: `Verified ${exp} year practical background.`,
        userStatus: 'confirmed',
      });
    }

    if (profile.tools.length >= 2) {
      strengths.push({
        id: 'str_2',
        title: 'Multi-Tool & Equipment Versatility',
        rationale: `Demonstrated comfort handling diverse specialized equipment: ${profile.tools.slice(0, 3).join(', ')}.`,
        evidence: `User actively specified ${profile.tools.length} distinct tools during onboarding.`,
        userStatus: 'confirmed',
      });
    }

    const technicalCount = skills.filter((s) => s.category === 'TECHNICAL' || s.category === 'PRACTICAL').length;
    if (technicalCount >= 2) {
      strengths.push({
        id: 'str_3',
        title: 'Practical Troubleshooting & Problem Diagnosis',
        rationale: 'Demonstrated capacity to identify component faults and execute procedural repairs.',
        evidence: `Supported by ${technicalCount} validated technical and practical skills.`,
        userStatus: 'confirmed',
      });
    }

    if (profile.workPreferences.willingToRelocate) {
      strengths.push({
        id: 'str_4',
        title: 'High Geographic Mobility & Adaptability',
        rationale: 'Open to relocating for growth, apprenticeships, and specialized workshop opportunities.',
        evidence: 'Explicitly indicated relocation flexibility during onboarding.',
        userStatus: 'confirmed',
      });
    }

    return strengths;
  }

  /**
   * Distinct Separation: Skills vs Interests vs Aspirations
   */
  static separateInterestsAndAspirations(profile: StructuredUserProfile): {
    interests: string[];
    aspirations: string[];
  } {
    const rawInterests = profile.interests || [];
    const interests: string[] = [];
    const aspirations: string[] = [];

    for (const item of rawInterests) {
      const lower = item.toLowerCase();
      // Aspirations are career destinations or roles (e.g., technician, supervisor, business owner, lead)
      if (
        lower.includes('technician') ||
        lower.includes('engineer') ||
        lower.includes('supervisor') ||
        lower.includes('business') ||
        lower.includes('shop') ||
        lower.includes('workshop owner') ||
        lower.includes('manager') ||
        lower.includes('lead')
      ) {
        aspirations.push(item);
      } else {
        interests.push(item);
      }
    }

    // If no distinct aspiration extracted, extrapolate cleanly from preferred employment type and occupation
    if (aspirations.length === 0) {
      if (profile.workPreferences.employmentType === 'self-employed') {
        aspirations.push(`Independent Service Provider / Workshop Enterprise`);
      } else if (profile.livelihood.currentOccupation) {
        aspirations.push(`Senior ${profile.livelihood.currentOccupation} Specialist`);
      } else {
        aspirations.push('Skilled Technical Practitioner');
      }
    }

    return { interests, aspirations };
  }

  /**
   * Career readiness breakdown: Currently Ready, Developing, Transferable, Needs Assessment
   */
  static calculateCareerReadiness(skills: ExtractedSkill[]): CareerReadiness {
    const currentlyReady: string[] = [];
    const developing: string[] = [];
    const transferableOpportunities: string[] = [];
    const needsAssessment: string[] = [];

    for (const skill of skills) {
      if (skill.confidence === 'CONFIRMED' && (skill.experienceYears || 0) >= 2) {
        currentlyReady.push(skill.name);
      } else if (skill.confidence === 'SUPPORTED' || (skill.experienceYears || 0) >= 1) {
        developing.push(skill.name);
      } else {
        needsAssessment.push(skill.name);
      }
    }

    // Determine transferable opportunities based on skills presence
    const hasElectrical = skills.some((s) => s.name.toLowerCase().includes('electr') || s.name.toLowerCase().includes('wire'));
    const hasMechanical = skills.some((s) => s.name.toLowerCase().includes('mechanic') || s.name.toLowerCase().includes('brake') || s.name.toLowerCase().includes('engine'));
    const hasSewing = skills.some((s) => s.name.toLowerCase().includes('sew') || s.name.toLowerCase().includes('garment') || s.name.toLowerCase().includes('tailor'));

    if (hasElectrical) {
      transferableOpportunities.push('Solar PV Installation & Inverter Servicing');
      transferableOpportunities.push('Electric Vehicle (EV) Charging Station Maintenance');
    }
    if (hasMechanical) {
      transferableOpportunities.push('Electric Two-Wheeler / EV Mechanical Assembly');
      transferableOpportunities.push('Industrial Plant Machine Maintenance');
    }
    if (hasSewing) {
      transferableOpportunities.push('Industrial Apparel Mass Production Quality Control');
      transferableOpportunities.push('Automotive Upholstery & Technical Textiles');
    }

    if (transferableOpportunities.length === 0) {
      transferableOpportunities.push('Technical Apprenticeship & Modern Workshop Practices');
    }

    return {
      currentlyReady,
      developing,
      transferableOpportunities,
      needsAssessment,
    };
  }
}
