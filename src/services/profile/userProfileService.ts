import { StructuredUserProfile } from '../../types/onboarding';
import { authService } from '../authService';

const PRIMARY_KEY = 'udyog_user_profile';
const LEGACY_KEY = 'aura_user_profile';
const ONBOARDING_STAGE_KEY = 'udyog_onboarding_stage';

export class UserProfileService {
  /**
   * Load stored profile from localStorage
   */
  static getProfile(): StructuredUserProfile | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const data = localStorage.getItem(PRIMARY_KEY) || localStorage.getItem(LEGACY_KEY);
      if (!data) return null;
      const parsed: StructuredUserProfile = JSON.parse(data);
      // Ensure arrays are initialized
      if (!parsed.certificates) parsed.certificates = [];
      if (!parsed.constraints) parsed.constraints = [];
      if (!parsed.skills) parsed.skills = [];
      if (!parsed.tools) parsed.tools = [];
      if (!parsed.interests) parsed.interests = [];
      if (!parsed.aspirations) parsed.aspirations = [];
      return parsed;
    } catch (e) {
      console.warn('Failed to load user profile from storage:', e);
      return null;
    }
  }

  /**
   * Check if profile has been officially confirmed by user
   */
  static isProfileConfirmed(): boolean {
    const p = this.getProfile();
    return Boolean(p && (p.status === 'confirmed' || p.metadata.isSubmitted));
  }

  /**
   * Save complete profile to localStorage
   */
  static saveProfile(profile: StructuredUserProfile): void {
    if (typeof localStorage === 'undefined') return;
    try {
      profile.metadata.lastUpdated = new Date().toISOString();
      localStorage.setItem(PRIMARY_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to persist user profile:', e);
    }
  }

  /**
   * Save and get active onboarding stage for refresh survivability
   */
  static saveStage(stage: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(ONBOARDING_STAGE_KEY, stage);
    } catch {}
  }

  static getSavedStage(): string | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      return localStorage.getItem(ONBOARDING_STAGE_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Persist finalized profile to the real backend database
   */
  static async syncProfileToBackend(profile: StructuredUserProfile, token?: string): Promise<boolean> {
    const activeToken = token || authService.getStoredSession()?.token;
    if (!activeToken) {
      console.warn('[UserProfileService] No auth session token available to sync profile to backend.');
      return false;
    }

    try {
      const payload = {
        fullName: profile.personal.name || 'Job Seeker',
        name: profile.personal.name || 'Job Seeker',
        age: profile.personal.age || undefined,
        gender: profile.personal.gender || undefined,
        preferredLanguage: profile.personal.preferredLanguage || 'en',
        district: profile.workPreferences.preferredLocation || 'Salem',
        state: 'Tamil Nadu',
        isRelocationOpen: profile.workPreferences.willingToRelocate ?? true,
        availability: profile.workPreferences.availability || 'Immediate',
        workPreference: profile.workPreferences.employmentType || 'Wage Employment',
        currentOccupation: profile.livelihood.currentOccupation || 'Entry Level / Trainee',
        yearsExperience: profile.livelihood.yearsOfExperience ?? 0,
        profilePhotoUrl: profile.personal.profilePhoto,
        skills: profile.skills.map((s) => (typeof s === 'string' ? s : s.name)),
        tools: profile.tools,
        interests: profile.interests,
        aspirations: profile.aspirations,
        educationLevel: profile.education.level || profile.education.qualification || 'Secondary',
      };

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('[UserProfileService] Profile successfully synced to real backend store.');
        }
        return true;
      } else {
        console.warn('[UserProfileService] Backend rejected profile update:', res.status);
        return false;
      }
    } catch (err) {
      console.warn('[UserProfileService] Backend sync error:', err);
      return false;
    }
  }

  /**
   * Finalize and confirm profile (explicit user confirmation)
   */
  static submitProfile(profile: StructuredUserProfile): StructuredUserProfile {
    const updated: StructuredUserProfile = {
      ...profile,
      status: 'confirmed',
      metadata: {
        ...profile.metadata,
        isSubmitted: true,
        lastUpdated: new Date().toISOString(),
      },
    };
    this.saveProfile(updated);
    this.saveStage('SUCCESS');
    this.syncProfileToBackend(updated).catch(() => {});
    return updated;
  }

  /**
   * Clear profile data
   */
  static clearProfile(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(PRIMARY_KEY);
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem(ONBOARDING_STAGE_KEY);
  }
}
