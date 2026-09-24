import { StructuredUserProfile } from '../../types/onboarding';
import {
  SkillProfileAnalysis,
  ExtractedSkill,
  CoreStrength,
  AssessmentResult,
} from '../../types/skillIntelligence';
import { SkillExtractionService } from './skillExtractionService';
import { OccupationService } from './occupationService';
import { AssessmentService } from './assessmentService';
import { RecommendationService } from './recommendationService';

const STORAGE_KEY = 'aura_skill_analysis';

export class SkillIntelligenceRepository {
  /**
   * Load existing analysis from localStorage
   */
  static getAnalysis(): SkillProfileAnalysis | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse skill intelligence analysis:', e);
      return null;
    }
  }

  /**
   * Persist analysis to storage
   */
  static saveAnalysis(analysis: SkillProfileAnalysis): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analysis));
    } catch (e) {
      console.warn('Failed to persist skill analysis:', e);
    }
  }

  /**
   * Clear persisted analysis from storage
   */
  static clearAnalysis(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear skill analysis:', e);
    }
  }

  /**
   * Build complete explainable analysis from user profile or retrieve cached version
   */
  static generateOrLoadAnalysis(
    profile: StructuredUserProfile,
    forceRefresh: boolean = false
  ): SkillProfileAnalysis {
    if (!forceRefresh) {
      const cached = this.getAnalysis();
      if (cached && cached.userId === (profile.personal.name || 'default_user')) {
        return cached;
      }
    }

    const extractedSkills = SkillExtractionService.extractSkills(profile);
    const strengths = SkillExtractionService.extractStrengths(profile, extractedSkills);
    const { interests, aspirations } = SkillExtractionService.separateInterestsAndAspirations(profile);
    const readiness = RecommendationService.calculateCareerReadiness(extractedSkills);
    const pathways = OccupationService.matchPathways(profile, extractedSkills);
    const assessmentDecision = AssessmentService.determineAssessment(
      profile,
      extractedSkills,
      pathways
    );

    const analysis: SkillProfileAnalysis = {
      userId: profile.personal.name || 'default_user',
      extractedSkills,
      strengths,
      interests,
      aspirations,
      readiness,
      pathways,
      assessmentDecision,
      lastAnalyzed: new Date().toISOString(),
    };

    this.saveAnalysis(analysis);
    return analysis;
  }

  /**
   * Update a skill (user-controlled correction)
   */
  static updateSkill(skillId: string, updates: Partial<ExtractedSkill>): SkillProfileAnalysis | null {
    const analysis = this.getAnalysis();
    if (!analysis) return null;

    analysis.extractedSkills = analysis.extractedSkills.map((s) => {
      if (s.id === skillId) {
        return {
          ...s,
          ...updates,
          userStatus: 'edited',
        };
      }
      return s;
    });

    // Re-evaluate readiness
    analysis.readiness = RecommendationService.calculateCareerReadiness(analysis.extractedSkills);
    analysis.lastAnalyzed = new Date().toISOString();
    this.saveAnalysis(analysis);
    return analysis;
  }

  /**
   * Confirm a skill
   */
  static confirmSkill(skillId: string): SkillProfileAnalysis | null {
    const analysis = this.getAnalysis();
    if (!analysis) return null;

    analysis.extractedSkills = analysis.extractedSkills.map((s) => {
      if (s.id === skillId) {
        return { ...s, userStatus: 'confirmed' };
      }
      return s;
    });

    this.saveAnalysis(analysis);
    return analysis;
  }

  /**
   * Remove a skill
   */
  static removeSkill(skillId: string): SkillProfileAnalysis | null {
    const analysis = this.getAnalysis();
    if (!analysis) return null;

    analysis.extractedSkills = analysis.extractedSkills.filter((s) => s.id !== skillId);
    analysis.readiness = RecommendationService.calculateCareerReadiness(analysis.extractedSkills);
    analysis.lastAnalyzed = new Date().toISOString();
    this.saveAnalysis(analysis);
    return analysis;
  }

  /**
   * Update a strength (user-controlled correction)
   */
  static updateStrength(strengthId: string, updates: Partial<CoreStrength>): SkillProfileAnalysis | null {
    const analysis = this.getAnalysis();
    if (!analysis) return null;

    analysis.strengths = analysis.strengths.map((str) => {
      if (str.id === strengthId) {
        return {
          ...str,
          ...updates,
          userStatus: 'edited',
        };
      }
      return str;
    });

    analysis.lastAnalyzed = new Date().toISOString();
    this.saveAnalysis(analysis);
    return analysis;
  }

  /**
   * Confirm a strength
   */
  static confirmStrength(strengthId: string): SkillProfileAnalysis | null {
    const analysis = this.getAnalysis();
    if (!analysis) return null;

    analysis.strengths = analysis.strengths.map((str) => {
      if (str.id === strengthId) {
        return { ...str, userStatus: 'confirmed' };
      }
      return str;
    });

    this.saveAnalysis(analysis);
    return analysis;
  }

  /**
   * Remove a strength
   */
  static removeStrength(strengthId: string): SkillProfileAnalysis | null {
    const analysis = this.getAnalysis();
    if (!analysis) return null;

    analysis.strengths = analysis.strengths.filter((str) => str.id !== strengthId);
    analysis.lastAnalyzed = new Date().toISOString();
    this.saveAnalysis(analysis);
    return analysis;
  }

  /**
   * Save assessment result and update recommendations
   */
  static saveAssessmentResult(result: AssessmentResult): SkillProfileAnalysis | null {
    const analysis = this.getAnalysis();
    if (!analysis) return null;

    analysis.assessmentResult = result;
    analysis.lastAnalyzed = new Date().toISOString();
    this.saveAnalysis(analysis);
    return analysis;
  }
}
