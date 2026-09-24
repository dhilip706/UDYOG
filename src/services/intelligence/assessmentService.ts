import { StructuredUserProfile } from '../../types/onboarding';
import {
  ExtractedSkill,
  OccupationPathway,
  AssessmentDecision,
  AssessmentQuestion,
  AssessmentResult,
} from '../../types/skillIntelligence';

// Pathway-specific adaptive question pool
const ADAPTIVE_QUESTION_POOL: Record<string, AssessmentQuestion[]> = {
  occ_auto_diag: [
    {
      id: 'q_auto_safe_1',
      pathwayId: 'occ_auto_diag',
      type: 'safety',
      difficulty: 'basic',
      targetSkill: 'Workplace Safety Protocols',
      questionText: 'Before working under a vehicle hoisted on hydraulic jacks, what is the mandatory safety step?',
      options: [
        { id: 'opt_1a', text: 'Engage transmission in neutral and leave hydraulic jack in place', isCorrect: false },
        { id: 'opt_1b', text: 'Place mechanical jack stands on solid chassis points and chock the wheels', isCorrect: true },
        { id: 'opt_1c', text: 'Disconnect the battery and drain engine coolant', isCorrect: false },
        { id: 'opt_1d', text: 'Check tire inflation pressure before raising further', isCorrect: false },
      ],
      explanation: 'Mechanical jack stands are engineered to support vehicle weight securely. Never rely solely on hydraulic pressure.',
    },
    {
      id: 'q_auto_prac_2',
      pathwayId: 'occ_auto_diag',
      type: 'practical',
      difficulty: 'intermediate',
      targetSkill: 'Hydraulic Brake Troubleshooting',
      questionText: 'A vehicle exhibits a spongy brake pedal and noticeably reduced braking force. What is the most likely root cause?',
      options: [
        { id: 'opt_2a', text: 'Air trapped within the hydraulic brake fluid lines requiring bleeding', isCorrect: true },
        { id: 'opt_2b', text: 'Excessively inflated front tire pressure', isCorrect: false },
        { id: 'opt_2c', text: 'Loose alternator drive belt', isCorrect: false },
        { id: 'opt_2d', text: 'Incorrect engine oil viscosity', isCorrect: false },
      ],
      explanation: 'Air compresses readily under pressure, leading to a soft, spongy brake pedal and hydraulic force loss.',
    },
    {
      id: 'q_auto_tool_3',
      pathwayId: 'occ_auto_diag',
      type: 'tool_identification',
      difficulty: 'advanced',
      targetSkill: 'OBD-II Diagnostic Scanner Interpretation',
      questionText: 'When connecting an OBD-II diagnostic scanner, which standard Diagnostic Trouble Code (DTC) range indicates a cylinder misfire?',
      options: [
        { id: 'opt_3a', text: 'DTC Code Series P0300 to P0308', isCorrect: true },
        { id: 'opt_3b', text: 'Battery voltage reading of 12.6V', isCorrect: false },
        { id: 'opt_3c', text: 'Radiator fan RPM telemetry', isCorrect: false },
        { id: 'opt_3d', text: 'Tire Pressure Monitoring System (TPMS) trigger', isCorrect: false },
      ],
      explanation: 'P0300 series Diagnostic Trouble Codes represent random or specific cylinder misfire detection in OBD-II standards.',
    },
    {
      id: 'q_auto_supp_4',
      pathwayId: 'occ_auto_diag',
      type: 'sequence_order',
      difficulty: 'basic',
      targetSkill: 'Periodic Maintenance Procedures',
      questionText: 'When performing a standard engine oil change, what is the correct operational sequence?',
      options: [
        { id: 'opt_4a', text: 'Warm engine slightly, drain old oil from sump, replace oil filter & washer, refill with specified grade', isCorrect: true },
        { id: 'opt_4b', text: 'Pour new oil directly into radiator before opening the oil drain plug', isCorrect: false },
        { id: 'opt_4c', text: 'Remove spark plugs, drain transmission fluid, replace battery', isCorrect: false },
        { id: 'opt_4d', text: 'Flush engine with tap water and immediately ignite engine', isCorrect: false },
      ],
      explanation: 'Warming the engine suspends particulates; draining from the sump and replacing the filter ensures clean lubrication.',
    },
  ],
  occ_solar_rooftop: [
    {
      id: 'q_solar_safe_1',
      pathwayId: 'occ_solar_rooftop',
      type: 'safety',
      difficulty: 'basic',
      targetSkill: 'Working at Heights Safety',
      questionText: 'What Personal Protective Equipment (PPE) is strictly required when mounting solar arrays on an elevated sloped roof?',
      options: [
        { id: 'opt_s1a', text: 'Full-body safety harness anchored to a certified lifeline and non-slip safety shoes', isCorrect: true },
        { id: 'opt_s1b', text: 'Cotton gloves and normal sports footwear', isCorrect: false },
        { id: 'opt_s1c', text: 'Reflective safety vest without fall arrest harness', isCorrect: false },
        { id: 'opt_s1d', text: 'Standard sunglasses and leather apron', isCorrect: false },
      ],
      explanation: 'Work at heights mandates approved fall arrest systems and safety harnesses anchored to secure lifelines.',
    },
    {
      id: 'q_solar_prac_2',
      pathwayId: 'occ_solar_rooftop',
      type: 'practical',
      difficulty: 'intermediate',
      targetSkill: 'PV String Polarity & Voltage Verification',
      questionText: 'Before connecting a string of solar panels to the inverter, what should you verify using a calibrated DC multimeter?',
      options: [
        { id: 'opt_s2a', text: 'Verify open-circuit voltage (Voc) and correct polarity matches inverter specifications', isCorrect: true },
        { id: 'opt_s2b', text: 'Measure ambient humidity and wind resistance', isCorrect: false },
        { id: 'opt_s2c', text: 'Check AC grid voltage with panels unplugged', isCorrect: false },
        { id: 'opt_s2d', text: 'Test continuity across live positive and negative terminals directly', isCorrect: false },
      ],
      explanation: 'Verifying Voc and polarity prevents inverter component damage from reverse polarity or over-voltage.',
    },
    {
      id: 'q_solar_scen_3',
      pathwayId: 'occ_solar_rooftop',
      type: 'scenario',
      difficulty: 'advanced',
      targetSkill: 'PV Junction Box & Bypass Diode Analysis',
      questionText: 'If a bypass diode inside a solar PV junction box becomes open-circuit under partial shade, what symptom occurs in the string?',
      options: [
        { id: 'opt_s3a', text: 'String power drops substantially and localized hot-spot cell heating may occur', isCorrect: true },
        { id: 'opt_s3b', text: 'Inverter output frequency increases immediately to 60Hz', isCorrect: false },
        { id: 'opt_s3c', text: 'The entire rooftop system stops conducting electricity permanently', isCorrect: false },
        { id: 'opt_s3d', text: 'The roof mounting structure becomes magnetized', isCorrect: false },
      ],
      explanation: 'An open-circuit bypass diode causes shaded cells to become reverse-biased loads, causing hot-spot heating and drop in string output.',
    },
  ],
  occ_ev_tech: [
    {
      id: 'q_ev_safe_1',
      pathwayId: 'occ_ev_tech',
      type: 'safety',
      difficulty: 'basic',
      targetSkill: 'High-Voltage Safety Isolation',
      questionText: 'Before opening the high-voltage battery enclosure on an electric vehicle, which safety measure is mandatory?',
      options: [
        { id: 'opt_ev1a', text: 'Remove Manual Service Disconnect (MSD) plug and wear Class 0 1000V rated insulated gloves', isCorrect: true },
        { id: 'opt_ev1b', text: 'Turn the air conditioning to maximum cool and remove rear wheels', isCorrect: false },
        { id: 'opt_ev1c', text: 'Wash the chassis with pressurized high-temperature water', isCorrect: false },
        { id: 'opt_ev1d', text: 'Spray the battery terminals with contact cleaner while vehicle is ON', isCorrect: false },
      ],
      explanation: 'Removing the MSD physically interrupts the series high-voltage circuit. 1000V rated gloves protect against accidental shock.',
    },
    {
      id: 'q_ev_prac_2',
      pathwayId: 'occ_ev_tech',
      type: 'practical',
      difficulty: 'intermediate',
      targetSkill: 'Battery Management System (BMS) Diagnostics',
      questionText: 'An EV instrument cluster displays "Reduced Power / Turtle Mode" while overall pack charge is 60%. What is the most probable cause?',
      options: [
        { id: 'opt_ev2a', text: 'A single cell voltage has dropped below threshold or a thermal sensor detected high temperature', isCorrect: true },
        { id: 'opt_ev2b', text: 'Low windscreen wiper fluid triggering power cut-off', isCorrect: false },
        { id: 'opt_ev2c', text: 'Headlight bulb filament failure', isCorrect: false },
        { id: 'opt_ev2d', text: 'FM radio antenna impedance mismatch', isCorrect: false },
      ],
      explanation: 'BMS enforces derating to protect unbalanced cells from over-discharge or overheating under load.',
    },
    {
      id: 'q_ev_tool_3',
      pathwayId: 'occ_ev_tech',
      type: 'tool_identification',
      difficulty: 'advanced',
      targetSkill: 'High-Voltage Zero Potential Verification',
      questionText: 'Which certified instrument must be used to prove zero voltage on an EV inverter DC bus before servicing?',
      options: [
        { id: 'opt_ev3a', text: 'CAT III or CAT IV 1000V certified high-voltage test meter with insulated safety probes', isCorrect: true },
        { id: 'opt_ev3b', text: 'Standard domestic 12V test bulb with crocodile clips', isCorrect: false },
        { id: 'opt_ev3c', text: 'Infrared forehead thermometer', isCorrect: false },
        { id: 'opt_ev3d', text: 'Magnetic field compass', isCorrect: false },
      ],
      explanation: 'High-voltage DC buses store lethal charge in capacitors; CAT III/IV 1000V rated instruments ensure safe zero-energy verification.',
    },
  ],
  occ_ind_electrician: [
    {
      id: 'q_elec_safe_1',
      pathwayId: 'occ_ind_electrician',
      type: 'safety',
      difficulty: 'basic',
      targetSkill: 'Lockout / Tagout (LOTO) Compliance',
      questionText: 'Before servicing an industrial distribution panel or motor starter, what is the mandatory first step?',
      options: [
        { id: 'opt_el1a', text: 'Execute Lockout/Tagout (LOTO), attach personal padlock and danger tag, and verify zero voltage', isCorrect: true },
        { id: 'opt_el1b', text: 'Switch off the light switch in the operator cabin', isCorrect: false },
        { id: 'opt_el1c', text: 'Inform colleagues verbally without locking the breaker switch', isCorrect: false },
        { id: 'opt_el1d', text: 'Touch the busbar with the back of the hand quickly', isCorrect: false },
      ],
      explanation: 'LOTO physically prevents accidental re-energization while maintenance personnel work on equipment.',
    },
    {
      id: 'q_elec_prac_2',
      pathwayId: 'occ_ind_electrician',
      type: 'practical',
      difficulty: 'intermediate',
      targetSkill: 'Three-Phase Motor Troubleshooting',
      questionText: 'A 3-phase induction motor hums loudly and fails to spin when switched ON. What is the most probable electrical fault?',
      options: [
        { id: 'opt_el2a', text: 'Single-phasing condition caused by a blown fuse or open contactor pole on one phase', isCorrect: true },
        { id: 'opt_el2b', text: 'Excessively high ambient room temperature', isCorrect: false },
        { id: 'opt_el2c', text: 'Grease in the end-shield bearing', isCorrect: false },
        { id: 'opt_el2d', text: 'Reversed neutral conductor connection', isCorrect: false },
      ],
      explanation: 'When one phase drops out, the motor cannot generate a rotating magnetic field and hums with heavy current draw.',
    },
    {
      id: 'q_elec_tool_3',
      pathwayId: 'occ_ind_electrician',
      type: 'tool_identification',
      difficulty: 'advanced',
      targetSkill: 'Insulation Resistance Testing (Megger)',
      questionText: 'Which instrument and test voltage are used to verify motor winding insulation resistance against ground for a 415V motor?',
      options: [
        { id: 'opt_el3a', text: 'Insulation Tester (Megohmmeter) set to 500V or 1000V DC', isCorrect: true },
        { id: 'opt_el3b', text: 'Low-voltage battery buzzer circuit', isCorrect: false },
        { id: 'opt_el3c', text: 'Analog tachometer', isCorrect: false },
        { id: 'opt_el3d', text: 'Oscilloscope probe on ground wire', isCorrect: false },
      ],
      explanation: 'An insulation tester injects DC test voltage to evaluate winding dielectric integrity and detect ground leakage in megaohms.',
    },
  ],
  occ_apparel_designer: [
    {
      id: 'q_app_prac_1',
      pathwayId: 'occ_apparel_designer',
      type: 'practical',
      difficulty: 'basic',
      targetSkill: 'Fabric Grain Alignment',
      questionText: 'When laying out pattern pieces on woven fabric, why must pattern grainline arrows strictly parallel the fabric selvedge?',
      options: [
        { id: 'opt_ap1a', text: 'To ensure the garment hangs properly without spiraling or twisting after stitching and washing', isCorrect: true },
        { id: 'opt_ap1b', text: 'To consume the maximum possible fabric yardage', isCorrect: false },
        { id: 'opt_ap1c', text: 'To avoid having to sharpen fabric cutting shears', isCorrect: false },
        { id: 'opt_ap1d', text: 'Grainline direction has no effect on garment fit or drape', isCorrect: false },
      ],
      explanation: 'The warp yarns along the selvedge have the least stretch; cutting off-grain produces unbalanced tension and twisted seams.',
    },
    {
      id: 'q_app_safe_2',
      pathwayId: 'occ_apparel_designer',
      type: 'safety',
      difficulty: 'intermediate',
      targetSkill: 'Industrial Sewing Machine Safety',
      questionText: 'When operating a high-speed industrial lockstitch sewing machine (5000 RPM), what safety guard is essential?',
      options: [
        { id: 'opt_ap2a', text: 'A transparent finger guard mounted on the presser foot bar preventing finger approach to needle', isCorrect: true },
        { id: 'opt_ap2b', text: 'Wearing heavy woollen gloves while guiding fabric', isCorrect: false },
        { id: 'opt_ap2c', text: 'Holding scissors open beside the needle plate while stitching', isCorrect: false },
        { id: 'opt_ap2d', text: 'Removing the belt guard from the motor pulley for better cooling', isCorrect: false },
      ],
      explanation: 'Industrial needles reciprocate rapidly; a fixed finger guard prevents devastating needle penetration injuries.',
    },
    {
      id: 'q_app_tool_3',
      pathwayId: 'occ_apparel_designer',
      type: 'tool_identification',
      difficulty: 'advanced',
      targetSkill: 'Pattern Drafting & Grading Instruments',
      questionText: 'Which precision drafting instrument is used to blend armhole depth, necklines, and crotch curve transitions smoothly?',
      options: [
        { id: 'opt_ap3a', text: 'French Curve or Graded Armhole Styling Ruler', isCorrect: true },
        { id: 'opt_ap3b', text: 'Straight 1-meter steel rule without curves', isCorrect: false },
        { id: 'opt_ap3c', text: 'Thread snips edge', isCorrect: false },
        { id: 'opt_ap3d', text: 'Measuring tape stretched taut', isCorrect: false },
      ],
      explanation: 'French curves and styling rulers provide true continuous radii required for anatomic garment contours.',
    },
  ],
  occ_plumbing_specialist: [
    {
      id: 'q_plumb_prac_1',
      pathwayId: 'occ_plumbing_specialist',
      type: 'practical',
      difficulty: 'basic',
      targetSkill: 'Pipe Jointing & Solvent Welding',
      questionText: 'When solvent welding CPVC or PVC pipe into a socket fitting, what technique ensures a leak-free bond?',
      options: [
        { id: 'opt_pl1a', text: 'Ream and deburr pipe end, apply primer & solvent cement, insert fully and give a quarter-turn twist', isCorrect: true },
        { id: 'opt_pl1b', text: 'Apply tap grease on the outside of the pipe before pushing in', isCorrect: false },
        { id: 'opt_pl1c', text: 'Wrap dry cotton thread around the pipe and hammer into socket', isCorrect: false },
        { id: 'opt_pl1d', text: 'Heat fitting with direct flame until plastic melts and smokes', isCorrect: false },
      ],
      explanation: 'Deburring removes ridges; the quarter-turn twist breaks air channels and spreads solvent cement uniformly.',
    },
    {
      id: 'q_plumb_safe_2',
      pathwayId: 'occ_plumbing_specialist',
      type: 'safety',
      difficulty: 'intermediate',
      targetSkill: 'Drainage & Confined Space Safety',
      questionText: 'What safety precaution is strictly required before descending into an inspection chamber or deep drainage pit?',
      options: [
        { id: 'opt_pl2a', text: 'Check for hazardous gases (H2S, Methane) with gas detector and ensure forced ventilation & safety harness', isCorrect: true },
        { id: 'opt_pl2b', text: 'Drop a lighted match inside to see if there is gas', isCorrect: false },
        { id: 'opt_pl2c', text: 'Enter without telling anyone to quickly inspect the pipe', isCorrect: false },
        { id: 'opt_pl2d', text: 'Drink clean water before entering', isCorrect: false },
      ],
      explanation: 'Sewer pits collect deadly heavier-than-air toxic and explosive gases; atmospheric testing is mandatory.',
    },
    {
      id: 'q_plumb_tool_3',
      pathwayId: 'occ_plumbing_specialist',
      type: 'tool_identification',
      difficulty: 'advanced',
      targetSkill: 'Confined Space Plumbing Tools',
      questionText: 'Which plumbing tool is specially engineered to tighten or remove backnuts on basin taps in cramped undersink spaces?',
      options: [
        { id: 'opt_pl3a', text: 'Telescopic Basin Wrench / Tap Spanner with spring-loaded jaw', isCorrect: true },
        { id: 'opt_pl3b', text: 'Heavy 24-inch pipe wrench', isCorrect: false },
        { id: 'opt_pl3c', text: 'Ball-peen hammer', isCorrect: false },
        { id: 'opt_pl3d', text: 'Adjustable hacksaw frame', isCorrect: false },
      ],
      explanation: 'A basin wrench has a long shaft and swiveling jaw that reaches up into the tight recess behind vanity basins.',
    },
  ],
  occ_digital_office: [
    {
      id: 'q_dig_prac_1',
      pathwayId: 'occ_digital_office',
      type: 'practical',
      difficulty: 'basic',
      targetSkill: 'Spreadsheet Data Summarization',
      questionText: 'In a workplace spreadsheet containing thousands of item rows, what is the fastest way to summarize total sales by region?',
      options: [
        { id: 'opt_dg1a', text: 'Create a Pivot Table grouping records by region with sum aggregation', isCorrect: true },
        { id: 'opt_dg1b', text: 'Manually calculate each region using a handheld pocket calculator and type it in', isCorrect: false },
        { id: 'opt_dg1c', text: 'Delete all rows except one region at a time and take screenshots', isCorrect: false },
        { id: 'opt_dg1d', text: 'Change cell background color to yellow', isCorrect: false },
      ],
      explanation: 'Pivot Tables dynamically aggregate, slice, and summarize large datasets accurately in seconds.',
    },
    {
      id: 'q_dig_safe_2',
      pathwayId: 'occ_digital_office',
      type: 'safety',
      difficulty: 'intermediate',
      targetSkill: 'Digital Security & Data Backup Standards',
      questionText: 'To safeguard important business files from hardware crashes or malware, what is the recommended practice?',
      options: [
        { id: 'opt_dg2a', text: 'Maintain encrypted cloud backups with version history and 3-2-1 backup redundancy', isCorrect: true },
        { id: 'opt_dg2b', text: 'Keep only one copy on the desktop screen for quick access', isCorrect: false },
        { id: 'opt_dg2c', text: 'Share your password with all office colleagues', isCorrect: false },
        { id: 'opt_dg2d', text: 'Turn off system security updates permanently', isCorrect: false },
      ],
      explanation: '3-2-1 backup redundancy (3 copies, 2 media types, 1 offsite/cloud) ensures business continuity against data loss.',
    },
    {
      id: 'q_dig_tool_3',
      pathwayId: 'occ_digital_office',
      type: 'tool_identification',
      difficulty: 'advanced',
      targetSkill: 'Document Scanning & Optical Character Recognition (OCR)',
      questionText: 'When scanning paper invoices to archive into an accounting system with searchable text, what configuration is best?',
      options: [
        { id: 'opt_dg3a', text: '300 DPI resolution with Optical Character Recognition (OCR) text layer in PDF format', isCorrect: true },
        { id: 'opt_dg3b', text: '72 DPI low-resolution color bitmap image', isCorrect: false },
        { id: 'opt_dg3c', text: 'Audio recording of the invoice text', isCorrect: false },
        { id: 'opt_dg3d', text: 'Smartphone camera photo with heavy shadows and flash glare', isCorrect: false },
      ],
      explanation: '300 DPI provides the ideal balance for OCR character recognition algorithms while keeping PDF file sizes small.',
    },
  ],
  default: [
    {
      id: 'q_def_safe_1',
      pathwayId: 'default',
      type: 'safety',
      difficulty: 'basic',
      targetSkill: 'Workshop Equipment Safety',
      questionText: 'When operating rotating power tools or machinery in a workshop, what is the primary clothing guideline?',
      options: [
        { id: 'opt_d1a', text: 'Tuck in loose clothing, tie back long hair, and remove dangling jewellery', isCorrect: true },
        { id: 'opt_d1b', text: 'Wear heavy loose shawls for thermal protection', isCorrect: false },
        { id: 'opt_d1c', text: 'Hold loose sleeves firmly with one hand while operating switches', isCorrect: false },
        { id: 'opt_d1d', text: 'Clothing does not present any hazard near rotating shafts', isCorrect: false },
      ],
      explanation: 'Rotating parts can snag loose items within milliseconds, presenting critical entanglement hazards.',
    },
    {
      id: 'q_def_tool_2',
      pathwayId: 'default',
      type: 'tool_identification',
      difficulty: 'intermediate',
      targetSkill: 'Precision Measurement Instruments',
      questionText: 'When measuring precise component dimensions for replacement, which tool provides 0.02mm accuracy?',
      options: [
        { id: 'opt_d2a', text: 'Vernier Caliper or Digital Micrometer', isCorrect: true },
        { id: 'opt_d2b', text: 'Flexible Steel Measuring Tape', isCorrect: false },
        { id: 'opt_d2c', text: 'Wooden Carpenter Rule', isCorrect: false },
        { id: 'opt_d2d', text: 'Try-square blade edge', isCorrect: false },
      ],
      explanation: 'Vernier calipers and micrometers are standard precision workshop instruments for millimeter-fraction measurements.',
    },
    {
      id: 'q_def_scen_3',
      pathwayId: 'default',
      type: 'scenario',
      difficulty: 'advanced',
      targetSkill: 'Electrical Hazard Isolation',
      questionText: 'If electrical equipment in the workplace begins sparking and smoking, what is the first action to take?',
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

export class AssessmentService {
  /**
   * Determine whether an assessment is useful and explain WHY.
   * Not every user needs a test.
   */
  static determineAssessment(
    profile: StructuredUserProfile,
    extractedSkills: ExtractedSkill[],
    pathways: OccupationPathway[]
  ): AssessmentDecision {
    const exp = profile.livelihood.yearsOfExperience || 0;
    const hasCert = profile.education.certifications.length > 0;
    const primaryPathway = pathways[0];

    // Case 1: Sparse profile
    if (extractedSkills.length === 0 && !profile.livelihood.currentOccupation) {
      return {
        outcome: 'NEEDS_MORE_INFO',
        rationale: 'Your profile has limited vocational data. Adding specific work experience or tools will help formulate a tailored pathway.',
        evaluationAreas: ['Work history', 'Core tools', 'Vocational interests'],
        estimatedMinutes: 2,
      };
    }

    // Case 2: Complete beginner or transitioner with no background
    if (exp === 0 && !hasCert) {
      return {
        outcome: 'LEARNING_FIRST',
        rationale: 'Because you are exploring this career domain without prior practical background, starting with structured foundational training is far more empowering than taking an entry test.',
        targetPathwayId: primaryPathway?.id,
        targetPathwayTitle: primaryPathway?.title,
        evaluationAreas: ['Foundational concepts', 'Workshop orientation'],
        estimatedMinutes: 0,
      };
    }

    // Case 3: Experienced specialist with verified credentials
    if (exp >= 5 && hasCert) {
      return {
        outcome: 'NO_ASSESSMENT_NEEDED',
        rationale: `With ${exp} years of sustained practical experience and formal certifications, your reported background provides ample evidence for direct progression without entry testing.`,
        targetPathwayId: primaryPathway?.id,
        targetPathwayTitle: primaryPathway?.title,
        evaluationAreas: [],
        estimatedMinutes: 0,
      };
    }

    // Case 4: Assessment recommended to confirm practical troubleshooting
    return {
      outcome: 'ASSESSMENT_RECOMMENDED',
      rationale: `You have ${exp > 0 ? `${exp} years of practical experience` : 'valuable reported skills'}. A brief 3-question practical check will confirm your troubleshooting proficiency and help unlock certified pathways.`,
      targetPathwayId: primaryPathway?.id || 'default',
      targetPathwayTitle: primaryPathway?.title || 'Vocational Practice',
      evaluationAreas: [
        'Operational Safety Standards',
        'Troubleshooting & Diagnostic Logic',
        'Tool & Instrument Precision',
      ],
      estimatedMinutes: 3,
    };
  }

  /**
   * Get question pool for a pathway
   */
  static getQuestionsForPathway(pathwayId: string = 'default'): AssessmentQuestion[] {
    return ADAPTIVE_QUESTION_POOL[pathwayId] || ADAPTIVE_QUESTION_POOL.default;
  }

  /**
   * Adaptive Engine: Select next question dynamically based on prior responses.
   * If correct -> increase difficulty or advance to high-order scenario.
   * If incorrect -> present lateral or supportive question without judgment.
   */
  static selectNextQuestion(
    pathwayId: string = 'default',
    completedQuestions: AssessmentQuestion[],
    selectedAnswers: Record<string, string>
  ): AssessmentQuestion | null {
    const allQuestions = this.getQuestionsForPathway(pathwayId);
    const answeredIds = new Set(completedQuestions.map((q) => q.id));
    const available = allQuestions.filter((q) => !answeredIds.has(q.id));

    if (available.length === 0 || completedQuestions.length >= 3) {
      return null; // Assessment complete
    }

    const lastQuestion = completedQuestions[completedQuestions.length - 1];
    const lastAnswerId = selectedAnswers[lastQuestion.id];
    const wasLastCorrect = lastQuestion.options.find((o) => o.id === lastAnswerId)?.isCorrect ?? false;

    if (wasLastCorrect) {
      // Step up difficulty: intermediate -> advanced
      const nextLevel = lastQuestion.difficulty === 'basic' ? 'intermediate' : 'advanced';
      const match = available.find((q) => q.difficulty === nextLevel);
      if (match) return match;
    } else {
      // Provide lateral question or foundational check
      const foundationalMatch = available.find((q) => q.difficulty === 'basic' || q.difficulty === 'intermediate');
      if (foundationalMatch) return foundationalMatch;
    }

    return available[0];
  }

  /**
   * Evaluate answers constructively.
   * NO humiliating words, NO fake IQ scores.
   */
  static evaluateAssessment(
    questions: AssessmentQuestion[],
    selectedOptionIds: Record<string, string>
  ): AssessmentResult {
    let correctCount = 0;
    const wellHandledAreas: string[] = [];
    const areasToDevelop: string[] = [];
    let highestDifficulty: 'basic' | 'intermediate' | 'advanced' = 'basic';

    for (const q of questions) {
      const selectedId = selectedOptionIds[q.id];
      const selectedOption = q.options.find((o) => o.id === selectedId);

      if (selectedOption?.isCorrect) {
        correctCount++;
        wellHandledAreas.push(q.targetSkill || 'Practical Procedural Understanding');
        if (q.difficulty === 'advanced') highestDifficulty = 'advanced';
        else if (q.difficulty === 'intermediate' && highestDifficulty !== 'advanced') highestDifficulty = 'intermediate';
      } else {
        areasToDevelop.push(q.targetSkill ? `${q.targetSkill} (Advanced Practice)` : 'Specialized Diagnostic Procedures');
      }
    }

    const uniqueWell = Array.from(new Set(wellHandledAreas));
    const uniqueDevelop = Array.from(new Set(areasToDevelop));

    if (uniqueWell.length === 0) {
      uniqueWell.push('Operational Safety Foundation');
    }
    if (uniqueDevelop.length === 0) {
      uniqueDevelop.push('Domain Specialization & Modern Digital Scanners');
    }

    const scorePct = Math.round((correctCount / questions.length) * 100);

    let recommendedNextStep = '';
    if (scorePct >= 66) {
      recommendedNextStep = 'Direct progression to advanced skill certification and industry apprenticeship opportunities.';
    } else {
      recommendedNextStep = 'Practical refresher module focusing on diagnostic workflows before pursuing trade certification.';
    }

    return {
      completed: true,
      scorePercentage: scorePct,
      adaptiveDifficultyReached: highestDifficulty,
      wellHandledAreas: uniqueWell,
      areasToDevelop: uniqueDevelop,
      recommendedNextStep,
      takenAt: new Date().toISOString(),
    };
  }
}
