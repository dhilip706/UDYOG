import { CareerReadiness, ExtractedSkill, OccupationPathway } from '../../types/skillIntelligence';

export class RecommendationService {
  /**
   * Calculate transparent 4-quadrant career readiness without arbitrary scores.
   * Categorizes strictly based on reported experience duration and evidence confidence.
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
    const hasElectrical = skills.some(
      (s) =>
        s.name.toLowerCase().includes('electr') ||
        s.name.toLowerCase().includes('wire') ||
        s.name.toLowerCase().includes('circuit')
    );
    const hasMechanical = skills.some(
      (s) =>
        s.name.toLowerCase().includes('mechanic') ||
        s.name.toLowerCase().includes('brake') ||
        s.name.toLowerCase().includes('engine') ||
        s.name.toLowerCase().includes('automotive')
    );
    const hasSewing = skills.some(
      (s) =>
        s.name.toLowerCase().includes('sew') ||
        s.name.toLowerCase().includes('garment') ||
        s.name.toLowerCase().includes('tailor') ||
        s.name.toLowerCase().includes('textile')
    );
    const hasDigital = skills.some(
      (s) =>
        s.name.toLowerCase().includes('data') ||
        s.name.toLowerCase().includes('computer') ||
        s.name.toLowerCase().includes('office') ||
        s.name.toLowerCase().includes('digital')
    );

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
    if (hasDigital) {
      transferableOpportunities.push('Cloud Logistics Data Coordination');
      transferableOpportunities.push('E-Commerce Inventory & Billing Operations');
    }

    if (transferableOpportunities.length === 0) {
      transferableOpportunities.push('Modern Workshop Quality & Apprenticeship Standards');
    }

    return {
      currentlyReady,
      developing,
      transferableOpportunities: Array.from(new Set(transferableOpportunities)),
      needsAssessment,
    };
  }

  /**
   * Synthesize clear next step guidance for Aisha AI assistant
   */
  static synthesizeCompanionGuidance(
    skillsCount: number,
    pathways: OccupationPathway[],
    hasCompletedAssessment: boolean
  ): { title: string; subtitle: string } {
    if (hasCompletedAssessment) {
      return {
        title: 'Assessment Recorded',
        subtitle: 'Your practical results have been integrated into your skill profile. Let us examine the best learning and certification opportunities.',
      };
    }
    if (pathways.length > 0) {
      return {
        title: `${pathways[0].title} Pathway Identified`,
        subtitle: `I've mapped ${skillsCount} verified skills against regional occupational requirements. Review your strengths and confirm any details.`,
      };
    }
    return {
      title: 'Skill Intelligence Ready',
      subtitle: 'Your verified skills and vocational background have been structured.',
    };
  }
}
