export interface JobMatchInput {
  userSkills: string[];
  userExperienceYears: number;
  userDistrict?: string;
  jobTitle: string;
  jobDistrict: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  minExperienceYears: number;
}

export interface JobMatchResult {
  matchedSkills: string[];
  missingSkills: string[];
  locationFit: boolean;
  experienceFit: boolean;
  explanation: string;
  trainingRecommendations: string[];
}

export function evaluateCandidateJobMatch(input: JobMatchInput): JobMatchResult {
  const userSkillLower = input.userSkills.map((s) => s.toLowerCase().trim());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  const trainingRecommendations: string[] = [];

  input.requiredSkills.forEach((req) => {
    const isMatched = userSkillLower.some(
      (us) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us)
    );
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
      trainingRecommendations.push(`Targeted short-cycle module in ${req}`);
    }
  });

  const locationFit = Boolean(
    input.userDistrict &&
    input.userDistrict.toLowerCase() === input.jobDistrict.toLowerCase()
  );

  const experienceFit = input.userExperienceYears >= input.minExperienceYears;

  let explanation = '';
  if (matchedSkills.length === input.requiredSkills.length) {
    explanation = `High alignment: You possess confirmed experience in all required competencies (${matchedSkills.join(', ')}).`;
  } else if (matchedSkills.length > 0) {
    explanation = `Demonstrated alignment: You have proven experience with ${matchedSkills.join(', ')}. Training in ${missingSkills.join(', ')} will position you for rapid readiness.`;
  } else {
    explanation = `Foundational alignment: This role requires ${missingSkills.join(', ')}. Completing prerequisite skilling modules is recommended.`;
  }

  if (locationFit) {
    explanation += ` Located within your district (${input.jobDistrict}).`;
  }

  return {
    matchedSkills,
    missingSkills,
    locationFit,
    experienceFit,
    explanation,
    trainingRecommendations,
  };
}
