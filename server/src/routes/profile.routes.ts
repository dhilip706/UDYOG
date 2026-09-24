import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { platformStore, BeneficiaryProfileEntity } from '../services/store';
import { authenticateToken, requireRole } from '../middleware/auth';

export const profileRouter = Router();

const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  name: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  preferredLanguage: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  locality: z.string().optional(),
  isRelocationOpen: z.boolean().optional(),
  availability: z.string().optional(),
  workPreference: z.string().optional(),
  currentOccupation: z.string().optional(),
  yearsExperience: z.number().optional(),
  profilePhotoUrl: z.string().optional(),
  educations: z.array(z.any()).optional(),
  certifications: z.array(z.any()).optional(),
  experiences: z.array(z.any()).optional(),
  skills: z.array(z.any()).optional(),
  tools: z.array(z.any()).optional(),
  interests: z.array(z.any()).optional(),
  aspirations: z.array(z.any()).optional(),
  educationLevel: z.string().optional(),
  mobility: z.string().optional(),
});

/**
 * GET /api/profile
 * Returns the current authenticated beneficiary's profile
 */
profileRouter.get('/', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  const userId = req.user!.id;
  let profile = Array.from(platformStore.profiles.values()).find((p) => p.userId === userId);

  if (!profile) {
    res.json({ profile: null });
    return;
  }

  res.json({
    profile: {
      ...profile,
      name: profile.fullName,
    },
  });
});

/**
 * PATCH /api/profile
 * Updates editable fields with audit tracking
 */
profileRouter.patch('/', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const body = updateProfileSchema.parse(req.body);
    let profile = Array.from(platformStore.profiles.values()).find((p) => p.userId === userId);

    const displayName = body.name || body.fullName || 'Job Seeker';

    if (!profile) {
      profile = {
        id: `prof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        fullName: displayName,
        preferredLanguage: body.preferredLanguage || 'en',
        isRelocationOpen: body.isRelocationOpen ?? true,
        availability: body.availability || 'Immediate',
        workPreference: body.workPreference || 'FULL_TIME',
        yearsExperience: body.yearsExperience || 0,
        isVerified: false,
        educations: body.educations || [],
        certifications: body.certifications || [],
        experiences: body.experiences || [],
        skills: [],
        aspirations: body.aspirations || [],
      };
    }

    if (body.name || body.fullName) {
      profile.fullName = displayName;
    }
    if (body.age !== undefined) profile.age = body.age;
    if (body.gender !== undefined) profile.gender = body.gender;
    if (body.state !== undefined) profile.state = body.state;
    if (body.district !== undefined) profile.district = body.district;
    if (body.preferredLanguage !== undefined) profile.preferredLanguage = body.preferredLanguage;
    if (body.currentOccupation !== undefined) profile.currentOccupation = body.currentOccupation;
    if (body.yearsExperience !== undefined) profile.yearsExperience = body.yearsExperience;
    if (body.workPreference !== undefined) profile.workPreference = body.workPreference;

    if (body.skills && Array.isArray(body.skills)) {
      profile.skills = body.skills.map((s) => {
        if (typeof s === 'string') {
          return {
            id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            name: s,
            category: 'PRACTICAL',
            evidenceStatus: 'CONFIRMED' as const,
            yearsExperience: profile.yearsExperience,
          };
        }
        return s;
      });
    }

    platformStore.profiles.set(profile.id, profile);
    platformStore.recordAudit('PROFILE_UPDATED', 'BENEFICIARY_PROFILE', userId, profile.id, { changes: Object.keys(body) });

    res.json({
      success: true,
      profile: {
        ...profile,
        name: profile.fullName,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});
