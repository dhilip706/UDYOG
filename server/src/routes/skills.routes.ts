import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { platformStore } from '../services/store';
import { authenticateToken, requireRole } from '../middleware/auth';

export const skillsRouter = Router();

const correctSkillSchema = z.object({
  action: z.enum(['ADD', 'UPDATE', 'REMOVE']),
  skillId: z.string().optional(),
  name: z.string().optional(),
  skillName: z.string().optional(),
  category: z.string().optional(),
  evidenceStatus: z.enum(['CONFIRMED', 'SUPPORTED', 'NEEDS_VERIFICATION', 'DEVELOPING', 'MISSING']).optional(),
  yearsExperience: z.number().optional(),
  notes: z.string().optional(),
});

/**
 * GET /api/skills
 * Returns standardized skill benchmarks across sectors
 */
skillsRouter.get('/', async (_req: Request, res: Response) => {
  const benchmarks = Array.from(platformStore.benchmarks.values());
  const allSkills = Array.from(
    new Set(benchmarks.flatMap((b) => [...b.requiredSkills, ...b.preferredSkills]))
  );
  res.json({ skills: allSkills, benchmarks });
});

/**
 * GET /api/skills/me
 * Returns the authenticated user's extracted skills with evidence
 */
skillsRouter.get('/me', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const profile = Array.from(platformStore.profiles.values()).find((p) => p.userId === userId);

  if (!profile) {
    res.json({ skills: [], strengths: [], gaps: [] });
    return;
  }

  const enrichedSkills = profile.skills.map((s) => ({
    ...s,
    status: s.evidenceStatus,
  }));

  // Segment skills into strengths, developing, and verification needed
  const strengths = enrichedSkills.filter((s) => s.evidenceStatus === 'CONFIRMED');
  const supported = enrichedSkills.filter((s) => s.evidenceStatus === 'SUPPORTED');
  const needsVerification = enrichedSkills.filter((s) => s.evidenceStatus === 'NEEDS_VERIFICATION');

  res.json({
    skills: enrichedSkills,
    strengths,
    supported,
    needsVerification,
    totalCount: enrichedSkills.length,
  });
});

/**
 * POST /api/skills/correct
 * Allows user to review and correct AI extracted skills (Requirement 13)
 */
skillsRouter.post('/correct', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const body = correctSkillSchema.parse(req.body);
    const profile = Array.from(platformStore.profiles.values()).find((p) => p.userId === userId);

    if (!profile) {
      res.status(404).json({ error: 'PROFILE_NOT_FOUND', message: 'Profile not found.' });
      return;
    }

    const skillName = body.name || body.skillName;

    if (body.action === 'ADD') {
      if (!skillName) {
        res.status(400).json({ error: 'INVALID_INPUT', message: 'Skill name required for addition.' });
        return;
      }
      const newSkill = {
        id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: skillName,
        category: (body.category || 'TECHNICAL').toUpperCase(),
        evidenceStatus: body.evidenceStatus || ('SUPPORTED' as const),
        yearsExperience: body.yearsExperience || 1,
        notes: body.notes || 'Added manually by user.',
      };
      profile.skills.push(newSkill);
      platformStore.recordAudit('SKILL_ADDED', 'BENEFICIARY_SKILL', userId, newSkill.id, { name: newSkill.name });
    } else if (body.action === 'UPDATE' && body.skillId) {
      const idx = profile.skills.findIndex((s) => s.id === body.skillId);
      if (idx !== -1) {
        profile.skills[idx] = {
          ...profile.skills[idx],
          name: skillName || profile.skills[idx].name,
          category: body.category ? body.category.toUpperCase() : profile.skills[idx].category,
          evidenceStatus: body.evidenceStatus || profile.skills[idx].evidenceStatus,
          yearsExperience: body.yearsExperience ?? profile.skills[idx].yearsExperience,
          notes: body.notes || profile.skills[idx].notes,
        };
        platformStore.recordAudit('SKILL_UPDATED', 'BENEFICIARY_SKILL', userId, body.skillId, { name: profile.skills[idx].name });
      }
    } else if (body.action === 'REMOVE' && body.skillId) {
      const removed = profile.skills.find((s) => s.id === body.skillId);
      profile.skills = profile.skills.filter((s) => s.id !== body.skillId);
      platformStore.recordAudit('SKILL_REMOVED', 'BENEFICIARY_SKILL', userId, body.skillId, { name: removed?.name });
    }

    platformStore.profiles.set(profile.id, profile);
    res.json({
      success: true,
      skills: profile.skills.map((s) => ({ ...s, status: s.evidenceStatus })),
      profile: {
        ...profile,
        skills: profile.skills.map((s) => s.name),
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});
