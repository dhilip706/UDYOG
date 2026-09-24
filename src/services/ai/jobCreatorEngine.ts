export interface ParsedJobRequirement {
  title: string;
  description: string;
  openingsCount: number;
  salaryMin: number;
  salaryMax: number;
  state: string;
  district: string;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredEducation: string;
  minExperienceYears: number;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'APPRENTICESHIP';
}

export function parseNaturalLanguageJobPrompt(prompt: string): ParsedJobRequirement {
  const p = prompt.toLowerCase();

  let title = 'Diagnostic Technician';
  let district = 'Salem';
  let state = 'Tamil Nadu';
  let openings = 1;
  let minExp = 1;
  let salaryMin = 20000;
  let salaryMax = 30000;
  let skills = ['Practical Troubleshooting', 'Safety Standards'];

  // 1. Detect district and state
  if (p.includes('coimbatore')) {
    district = 'Coimbatore';
    state = 'Tamil Nadu';
  } else if (p.includes('salem')) {
    district = 'Salem';
    state = 'Tamil Nadu';
  } else if (p.includes('chennai')) {
    district = 'Chennai';
    state = 'Tamil Nadu';
  } else if (p.includes('madurai')) {
    district = 'Madurai';
    state = 'Tamil Nadu';
  } else if (p.includes('tiruchirappalli') || p.includes('trichy')) {
    district = 'Tiruchirappalli';
    state = 'Tamil Nadu';
  } else if (p.includes('bangalore') || p.includes('bengaluru')) {
    district = 'Bangalore Urban';
    state = 'Karnataka';
  } else if (p.includes('pune')) {
    district = 'Pune';
    state = 'Maharashtra';
  } else if (p.includes('hyderabad')) {
    district = 'Hyderabad';
    state = 'Telangana';
  } else if (p.includes('delhi')) {
    district = 'New Delhi';
    state = 'Delhi';
  }

  // 2. Detect openings count (numeric or word)
  const wordCountMap: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  };
  const wordCountMatch = prompt.match(/\b(?:need|hiring|want|require|hire)?\s*(one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:ev\s+)?(?:mechanics|technicians|electricians|operators|workers|openings|candidates|staff|helpers|people|positions)?\b/i);
  const explicitCountMatch = prompt.match(/\b(\d{1,2})\s+(?:ev\s+)?(?:mechanics|technicians|electricians|operators|workers|openings|candidates|staff|helpers|people|positions)\b/i);

  if (explicitCountMatch) {
    openings = Math.min(50, parseInt(explicitCountMatch[1], 10));
  } else if (wordCountMatch && wordCountMap[wordCountMatch[1].toLowerCase()]) {
    openings = wordCountMap[wordCountMatch[1].toLowerCase()];
  } else if (p.includes('two') || p.includes('2 openings') || p.includes('2 positions')) {
    openings = 2;
  } else if (p.includes('three') || p.includes('3 openings') || p.includes('3 positions')) {
    openings = 3;
  } else if (p.includes('four') || p.includes('4 openings') || p.includes('4 positions')) {
    openings = 4;
  } else if (p.includes('five') || p.includes('5 openings') || p.includes('5 positions')) {
    openings = 5;
  }

  // 3. Detect explicit salary (e.g. "salary around 28,000", "28000", "25k", "30,000")
  const salaryMatch = prompt.match(/(?:salary|pay|ctc|package)?\s*(?:around|approx|of)?\s*(\d{2,3})(?:,?)(\d{3})\b/i) || prompt.match(/(\d{2})k\b/i);
  if (salaryMatch) {
    const rawVal = salaryMatch[2] ? parseInt(`${salaryMatch[1]}${salaryMatch[2]}`, 10) : parseInt(salaryMatch[1], 10) * 1000;
    if (rawVal >= 10000 && rawVal <= 250000) {
      salaryMin = Math.round(rawVal * 0.9);
      salaryMax = Math.round(rawVal * 1.15);
    }
  }

  // 4. Detect experience requirement
  const expMatch = prompt.match(/(?:minimum|min|at least)?\s*(\d+|one|two|three|four|five)\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)?/i);
  if (expMatch) {
    const wordMap: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    const num = parseInt(expMatch[1], 10) || wordMap[expMatch[1].toLowerCase()] || 1;
    minExp = num;
  } else if (p.includes('fresher') || p.includes('no experience') || p.includes('entry level')) {
    minExp = 0;
  }

  // 5. Detect domain & specialization
  if (p.includes('ev') || p.includes('electric vehicle') || p.includes('battery')) {
    title = 'EV Fleet Battery & Powertrain Associate';
    skills = ['EV High Voltage Safety', 'Battery Management Systems (BMS)', 'Motor Controller Tuning', 'Thermal Diagnostics'];
    if (!salaryMatch) { salaryMin = 24000; salaryMax = 34000; }
    if (!expMatch) { minExp = 2; }
  } else if (p.includes('mechanic') || p.includes('engine') || p.includes('brake') || p.includes('auto') || p.includes('two wheeler')) {
    title = 'Automotive Service & Diagnostic Technician';
    skills = ['Engine Diagnostics', 'OBD-II Scanning', 'Brake Systems', 'Preventative Maintenance'];
    if (!salaryMatch) { salaryMin = 22000; salaryMax = 32000; }
    if (!expMatch) { minExp = 2; }
  } else if (p.includes('solar') || p.includes('rooftop')) {
    title = 'Solar PV Installation & Commissioning Lead';
    skills = ['Solar Inverter Configuration', 'PV String Voltage Testing', 'Rooftop Structural Mounting'];
    if (!salaryMatch) { salaryMin = 20000; salaryMax = 28000; }
  } else if (p.includes('electrician') || p.includes('wiring') || p.includes('plc')) {
    title = 'Industrial Electrician & Control Panel Specialist';
    skills = ['3-Phase Motor Control', 'PLC Wiring & IO Checks', 'Industrial Safety LOTO'];
    if (!salaryMatch) { salaryMin = 22000; salaryMax = 30000; }
  } else if (p.includes('welder') || p.includes('welding') || p.includes('fabricat')) {
    title = 'Certified MIG/TIG Industrial Welder';
    skills = ['MIG/TIG Welding', 'Blueprint Interpretation', 'Structural Joint Testing'];
    if (!salaryMatch) { salaryMin = 21000; salaryMax = 29000; }
  } else if (p.includes('tally') || p.includes('gst') || p.includes('account') || p.includes('office') || p.includes('shop assistant')) {
    title = 'Digital Office & GST Accounts Associate';
    skills = ['Advanced Spreadsheets (VLOOKUP/XLOOKUP)', 'Tally / ERP Data Entry', 'GST Invoicing Compliance'];
    if (!salaryMatch) { salaryMin = 18000; salaryMax = 25000; }
  }

  return {
    title,
    description: `Position generated from requirement: "${prompt}". Seeking skilled professionals capable of executing standard operating protocols, diagnostic routines, and workplace safety standards.`,
    openingsCount: openings,
    salaryMin,
    salaryMax,
    state,
    district,
    requiredSkills: skills,
    preferredSkills: ['Diagnostic Reasoning', 'Field Safety Protocols', 'Team Collaboration'],
    requiredEducation: minExp === 0 ? 'Secondary / Vocational' : 'ITI / Diploma / Equivalent',
    minExperienceYears: minExp,
    jobType: 'FULL_TIME',
  };
}
