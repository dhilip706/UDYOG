export interface JobOpportunity {
  id: string;
  title: string;
  employerName: string;
  district: string;
  state: string;
  locality?: string;
  salaryMin: number;
  salaryMax: number;
  employmentType?: string; // 'full-time' | 'part-time' | 'apprenticeship'
  shift?: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  requiredEducation?: string;
  minExperienceYears?: number;
  languageRequirements?: string[];
  workingConditions?: string;
  isDemo: boolean;
}

export type ProximityTier = 
  | 'HOMETOWN_DISTRICT' 
  | 'NEARBY_DISTRICT' 
  | 'SAME_STATE' 
  | 'RELOCATION_OPPORTUNITY';

export interface LocationMatchedJob {
  job: JobOpportunity;
  proximityTier: ProximityTier;
  proximityPriority: 1 | 2 | 3 | 4;
  proximityBadgeText: string;
  matchScore: number; // 0 to 100 explainable score
  skillMatchCount: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
  trainingRecommendations: string[];
}

// Well-defined adjacent district mappings across Tamil Nadu & key neighboring regions
const NEARBY_DISTRICT_MAP: Record<string, string[]> = {
  coimbatore: ['tiruppur', 'erode', 'nilgiris', 'palakkad'],
  tiruppur: ['coimbatore', 'erode', 'dindigul', 'karur'],
  erode: ['salem', 'tiruppur', 'coimbatore', 'namakkal', 'karur'],
  salem: ['namakkal', 'dharmapuri', 'erode', 'krishnagiri'],
  namakkal: ['salem', 'karur', 'trichy', 'tiruchirappalli', 'erode'],
  chennai: ['tiruvallur', 'kanchipuram', 'chengalpattu'],
  madurai: ['dindigul', 'virudhunagar', 'theni', 'sivaganga'],
  trichy: ['thanjavur', 'pudukkottai', 'perambalur', 'karur', 'namakkal'],
  tiruchirappalli: ['thanjavur', 'pudukkottai', 'perambalur', 'karur', 'namakkal'],
  bengaluru: ['ramanagara', 'kolar', 'tumakuru', 'chikkaballapur', 'hosur', 'krishnagiri'],
  bangalore: ['ramanagara', 'kolar', 'tumakuru', 'chikkaballapur', 'hosur', 'krishnagiri'],
  pune: ['satara', 'ahmednagar', 'thane', 'mumbai'],
  mumbai: ['thane', 'navi mumbai', 'palghar', 'raigad'],
};

export class LocationMatchingService {
  /**
   * Sorts and matches opportunities strictly based on:
   * Priority 1: User's hometown / current district
   * Priority 2: Nearby districts
   * Priority 3: Same state
   * Priority 4: Other states / relocation opportunities
   */
  public static prioritizeOpportunities(
    jobs: JobOpportunity[],
    userDistrict: string = 'Coimbatore',
    userState: string = 'Tamil Nadu',
    userSkills: string[] = [],
    userExperienceYears: number = 0,
    preferredLanguage: string = 'ta'
  ): LocationMatchedJob[] {
    const normUserDistrict = (userDistrict || 'coimbatore').trim().toLowerCase();
    const normUserState = (userState || 'tamil nadu').trim().toLowerCase();
    const nearbyDistricts = NEARBY_DISTRICT_MAP[normUserDistrict] || [];
    const normalizedUserSkills = userSkills.map((s) => s.toLowerCase());

    const matchedJobs: LocationMatchedJob[] = jobs.map((job) => {
      const jobDistrict = (job.district || '').trim().toLowerCase();
      const jobState = (job.state || '').trim().toLowerCase();

      // Proximity Tier determination
      let proximityTier: ProximityTier;
      let proximityPriority: 1 | 2 | 3 | 4;
      let proximityBadgeText: string;

      if (jobDistrict === normUserDistrict) {
        proximityTier = 'HOMETOWN_DISTRICT';
        proximityPriority = 1;
        proximityBadgeText = `Priority 1 • In your home district (${job.district})`;
      } else if (nearbyDistricts.includes(jobDistrict)) {
        proximityTier = 'NEARBY_DISTRICT';
        proximityPriority = 2;
        proximityBadgeText = `Priority 2 • Nearby district (${job.district})`;
      } else if (jobState === normUserState) {
        proximityTier = 'SAME_STATE';
        proximityPriority = 3;
        proximityBadgeText = `Priority 3 • In-state opportunity (${job.district}, ${job.state})`;
      } else {
        proximityTier = 'RELOCATION_OPPORTUNITY';
        proximityPriority = 4;
        proximityBadgeText = `Priority 4 • Relocation (${job.district}, ${job.state})`;
      }

      // Skill alignment calculation
      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];

      job.requiredSkills.forEach((req) => {
        const hasSkill = normalizedUserSkills.some((us) => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us));
        if (hasSkill) {
          matchedSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      });

      // Explainable score
      const skillRatio = job.requiredSkills.length > 0 ? matchedSkills.length / job.requiredSkills.length : 1;
      const experienceFit = (job.minExperienceYears || 0) <= userExperienceYears;
      
      // Proximity base points: P1 = 40, P2 = 30, P3 = 20, P4 = 10
      const proximityBase = proximityPriority === 1 ? 40 : proximityPriority === 2 ? 30 : proximityPriority === 3 ? 20 : 10;
      const skillPoints = Math.round(skillRatio * 45);
      const expPoints = experienceFit ? 15 : 5;
      const matchScore = Math.min(100, proximityBase + skillPoints + expPoints);

      // Explainable text
      const explanationParts: string[] = [];
      if (proximityPriority === 1) {
        explanationParts.push(`Located directly in your home district of ${job.district}`);
      } else if (proximityPriority === 2) {
        explanationParts.push(`Located in nearby ${job.district} with accessible daily or weekly transit`);
      } else if (proximityPriority === 3) {
        explanationParts.push(`Located within ${job.state}`);
      } else {
        explanationParts.push(`Requires relocation to ${job.district}, ${job.state}`);
      }

      if (matchedSkills.length > 0) {
        explanationParts.push(`matches your confirmed skills in ${matchedSkills.join(', ')}`);
      }
      if (job.languageRequirements && job.languageRequirements.length > 0) {
        explanationParts.push(`language compatibility aligned with ${preferredLanguage.toUpperCase()}`);
      }
      if (missingSkills.length > 0) {
        explanationParts.push(`development recommended in ${missingSkills.join(', ')}`);
      }

      const trainingRecs = missingSkills.map((m) => `Complete quick practical module on ${m}`);

      return {
        job,
        proximityTier,
        proximityPriority,
        proximityBadgeText,
        matchScore,
        skillMatchCount: matchedSkills.length,
        matchedSkills,
        missingSkills,
        explanation: explanationParts.join('; ') + '.',
        trainingRecommendations: trainingRecs,
      };
    });

    // Sort by proximityPriority ASC (1 first, then 2, 3, 4), then by matchScore DESC
    return matchedJobs.sort((a, b) => {
      if (a.proximityPriority !== b.proximityPriority) {
        return a.proximityPriority - b.proximityPriority;
      }
      return b.matchScore - a.matchScore;
    });
  }
}
