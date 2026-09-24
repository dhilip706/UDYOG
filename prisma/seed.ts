import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding standardized NCO-2015 benchmarks, NSQF qualifications, and training courses...');

  // 1. Standardized NCO-2015 Benchmarks
  const benchmarks = [
    {
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
      ncoCode: '7412.0201',
      title: 'Electric Vehicle (EV) Powertrain Technician',
      sector: 'Clean Mobility',
      description: 'High-voltage safety, lithium-ion battery pack inspection, motor controller diagnostics, and regenerative braking.',
      requiredSkills: ['EV High Voltage Safety', 'Battery Management Systems (BMS)', 'Motor Controller Tuning', 'DC Fast Charging Protocols'],
      preferredSkills: ['Thermal Management', 'CAN Bus Decoding'],
      minEducation: 'Diploma / Certificate in Electrical/Automobile',
      minExperienceYears: 1.5,
      workConditions: 'High-voltage PPE, insulated tools, clean diagnostic bays',
      isVerifiedOfficial: true,
    },
    {
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

  for (const b of benchmarks) {
    await prisma.occupationBenchmark.upsert({
      where: { ncoCode: b.ncoCode },
      update: b,
      create: b,
    });
  }

  // 2. Verified NSQF Qualifications
  const autoBench = await prisma.occupationBenchmark.findUnique({ where: { ncoCode: '7231.0100' } });
  const evBench = await prisma.occupationBenchmark.findUnique({ where: { ncoCode: '7412.0201' } });
  const solarBench = await prisma.occupationBenchmark.findUnique({ where: { ncoCode: '7411.0102' } });

  if (autoBench) {
    await prisma.nSQFQualification.upsert({
      where: { qpCode: 'ASC/Q1402' },
      update: {},
      create: {
        qpCode: 'ASC/Q1402',
        occupationId: autoBench.id,
        qualificationTitle: 'Automotive Master Diagnostic Technician',
        nsqfLevel: 5,
        awardingBody: 'Automotive Skills Development Council (ASDC)',
        curriculumHours: 450,
        isVerifiedOfficial: true,
      },
    });
  }

  if (evBench) {
    await prisma.nSQFQualification.upsert({
      where: { qpCode: 'ASC/Q1403' },
      update: {},
      create: {
        qpCode: 'ASC/Q1403',
        occupationId: evBench.id,
        qualificationTitle: 'Electric Vehicle Service & Maintenance Specialist',
        nsqfLevel: 4,
        awardingBody: 'Automotive Skills Development Council (ASDC)',
        curriculumHours: 380,
        isVerifiedOfficial: true,
      },
    });
  }

  if (solarBench) {
    await prisma.nSQFQualification.upsert({
      where: { qpCode: 'SGJ/Q0101' },
      update: {},
      create: {
        qpCode: 'SGJ/Q0101',
        occupationId: solarBench.id,
        qualificationTitle: 'Solar PV Installer (Suryamitra)',
        nsqfLevel: 4,
        awardingBody: 'Skill Council for Green Jobs (SCGJ)',
        curriculumHours: 300,
        isVerifiedOfficial: true,
      },
    });
  }

  // 3. Ready for Real User Data (Demo Employer & Job seeding removed per clean data reset requirements)

  // 4. Regional Skill Supply & Demand Data
  const regions = [
    { state: 'Tamil Nadu', district: 'Salem', sector: 'Automotive & Mobility', openJobs: 18, candidates: 42 },
    { state: 'Tamil Nadu', district: 'Coimbatore', sector: 'Industrial Automation', openJobs: 34, candidates: 65 },
    { state: 'Maharashtra', district: 'Pune', sector: 'Clean Mobility', openJobs: 29, candidates: 51 },
    { state: 'Karnataka', district: 'Bangalore Urban', sector: 'IT & Business Services', openJobs: 45, candidates: 80 },
  ];

  for (const r of regions) {
    await prisma.regionalSkillData.upsert({
      where: {
        state_district_sector: {
          state: r.state,
          district: r.district,
          sector: r.sector,
        },
      },
      update: {
        openJobsCount: r.openJobs,
        candidateCount: r.candidates,
      },
      create: {
        state: r.state,
        district: r.district,
        sector: r.sector,
        openJobsCount: r.openJobs,
        candidateCount: r.candidates,
        skillDemand: [
          { skill: 'Diagnostic Scanning', count: 18 },
          { skill: 'BMS Troubleshooting', count: 12 },
        ],
        skillSupply: [
          { skill: 'Mechanical Assembly', count: 35 },
          { skill: 'Basic Wiring', count: 28 },
        ],
      },
    });
  }

  // 5. Initial System Health Metrics
  const components = ['DATABASE', 'AI_PROVIDER', 'STT', 'TTS', 'REDIS', 'STORAGE'];
  for (const comp of components) {
    await prisma.systemHealthMetric.create({
      data: {
        component: comp,
        status: 'HEALTHY',
        latencyMs: Math.floor(18 + Math.random() * 25),
        details: 'Operational with zero anomalous fault triggers.',
      },
    });
  }

  console.log('Seeding completed successfully with authentic benchmark standards.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
