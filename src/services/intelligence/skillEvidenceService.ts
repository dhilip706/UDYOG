import { EvidenceConfidence, ExtractedSkill } from '../../types/skillIntelligence';

export interface EvidenceAudit {
  skillId: string;
  skillName: string;
  sourceType: 'user-statement' | 'work-history' | 'credential' | 'tool-inventory';
  confidence: EvidenceConfidence;
  evidenceSummary: string;
  basis: string;
}

export class SkillEvidenceService {
  /**
   * Determine evidence confidence based strictly on verified practical duration and documented credentials.
   * No arbitrary AI probability percentages.
   */
  static determineConfidence(experienceYears: number = 0, isCertified: boolean = false): EvidenceConfidence {
    if (isCertified || experienceYears >= 2) {
      return 'CONFIRMED';
    }
    if (experienceYears >= 1) {
      return 'SUPPORTED';
    }
    return 'NEEDS_VERIFICATION';
  }

  /**
   * Format human-readable, explainable evidence string with explicit source attribution
   */
  static formatEvidenceString(
    skillName: string,
    experienceYears?: number,
    sourceDetail?: string,
    toolName?: string
  ): string {
    if (toolName) {
      return `Regular operational application with ${toolName} for ${skillName} reported in verified inventory.`;
    }
    if (experienceYears && experienceYears > 0) {
      return `Demonstrated proficiency in ${skillName}, supported by ${experienceYears} year${experienceYears > 1 ? 's' : ''} of reported hands-on vocational experience${sourceDetail ? ` (${sourceDetail})` : ''}.`;
    }
    if (sourceDetail) {
      return `Demonstrated competence in ${skillName}, directly reported by user in verified interview: "${sourceDetail}".`;
    }
    return `Identified from reported vocational activities for ${skillName} during structured onboarding interview.`;
  }

  /**
   * Audit an extracted skill to produce an explainable audit trail
   */
  static auditSkill(skill: ExtractedSkill): EvidenceAudit {
    let sourceType: EvidenceAudit['sourceType'] = 'user-statement';
    let basis = 'Reported in initial onboarding interview';

    if (skill.source.toLowerCase().includes('certification') || skill.source.toLowerCase().includes('credential')) {
      sourceType = 'credential';
      basis = 'Documented vocational or educational credential';
    } else if (skill.source.toLowerCase().includes('tool')) {
      sourceType = 'tool-inventory';
      basis = 'Hands-on equipment operational inventory';
    } else if ((skill.experienceYears || 0) > 0) {
      sourceType = 'work-history';
      basis = `${skill.experienceYears} years active field practice`;
    }

    return {
      skillId: skill.id,
      skillName: skill.name,
      sourceType,
      confidence: skill.confidence,
      evidenceSummary: skill.evidence,
      basis,
    };
  }
}
