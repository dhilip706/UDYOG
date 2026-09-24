import { StructuredUserProfile } from '../../types/onboarding';
import { ExtractedSkill, OccupationPathway } from '../../types/skillIntelligence';
import { OccupationService } from './occupationService';

export class OccupationMatchingService {
  static matchPathways(
    profile: StructuredUserProfile,
    extractedSkills: ExtractedSkill[]
  ): OccupationPathway[] {
    return OccupationService.matchPathways(profile, extractedSkills);
  }
}
