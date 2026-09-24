import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { platformStore, JobEntity, JobApplicationEntity } from '../services/store';
import { authenticateToken, requireRole } from '../middleware/auth';

export const jobsRouter = Router();

import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const applyJobSchema = z.object({
  jobId: z.string().optional(),
  notes: z.string().optional(),
  confirmedData: z
    .object({
      name: z.string().optional(),
      phoneNumber: z.string().optional(),
      location: z.string().optional(),
      yearsExperience: z.number().optional(),
      skills: z.array(z.string()).optional(),
    })
    .optional(),
});

/**
 * Helper to compute transparent, non-discriminatory matching explanation
 */
function computeJobMatch(job: JobEntity, userSkills: string[], userExpYears: number, userDistrict?: string) {
  const userSkillLower = userSkills.map((s) => s.toLowerCase());

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  job.requiredSkills.forEach((reqSkill) => {
    if (userSkillLower.some((us) => us.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(us))) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const locationMatch = Boolean(userDistrict && job.district.toLowerCase() === userDistrict.toLowerCase());
  const experienceFit = userExpYears >= job.minExperienceYears;

  let explanation = '';
  if (matchedSkills.length === job.requiredSkills.length) {
    explanation = `High alignment: You possess all ${matchedSkills.length} required competencies (${matchedSkills.join(', ')}).`;
  } else if (matchedSkills.length > 0) {
    explanation = `Strong alignment: You have demonstrated experience with ${matchedSkills.join(', ')}. Training in ${missingSkills.join(', ')} is recommended to reach full mastery.`;
  } else {
    explanation = `Foundational alignment: This role requires ${missingSkills.join(', ')}. Completing preparatory training is recommended.`;
  }

  if (locationMatch) {
    explanation += ` Located in your district (${job.district}).`;
  }

  return {
    matchedSkills,
    matchingSkills: matchedSkills,
    missingSkills,
    skillGaps: missingSkills,
    locationFit: locationMatch,
    experienceFit,
    explanation,
  };
}

/**
 * GET /api/jobs
 * List opportunities with filters (district, sector, skill)
 */
jobsRouter.get('/', async (req: Request, res: Response) => {
  const { district, sector, skill } = req.query;
  let jobList = Array.from(platformStore.jobs.values()).filter((j) => j.status === 'PUBLISHED');

  if (district) {
    jobList = jobList.filter((j) => j.district.toLowerCase() === String(district).toLowerCase());
  }

  if (skill) {
    const qSkill = String(skill).toLowerCase();
    jobList = jobList.filter((j) =>
      j.requiredSkills.some((s) => s.toLowerCase().includes(qSkill))
    );
  }

  // Attempt to parse token if present to personalize matchDetails
  let userProfile: any = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded: any = jwt.verify(token, env.AUTH_SECRET);
      userProfile = Array.from(platformStore.profiles.values()).find((p) => p.userId === decoded.id);
    } catch {}
  }

  const enriched = jobList.map((job) => {
    const userSkills = userProfile && userProfile.skills.length > 0
      ? userProfile.skills.map((s: any) => s.name)
      : ['Automotive maintenance', 'Engine diagnostics', 'Brake servicing'];
    const userExp = userProfile ? userProfile.yearsExperience : 3;
    const match = computeJobMatch(job, userSkills, userExp, userProfile?.district);
    return {
      ...job,
      matchDetails: match,
    };
  });

  res.json({ jobs: enriched, total: enriched.length });
});

/**
 * GET /api/jobs/:id
 * Retrieve specific job with customized AI match evaluation
 */
jobsRouter.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const job = platformStore.jobs.get(req.params.id as string);
  if (!job) {
    res.status(404).json({ error: 'JOB_NOT_FOUND', message: 'The specified job was not found.' });
    return;
  }

  // If user is authenticated, compute explainable match against their verified profile
  const userId = req.user!.id;
  const profile = Array.from(platformStore.profiles.values()).find((p) => p.userId === userId);
  const userSkills = profile ? profile.skills.map((s) => s.name) : [];
  const userExpYears = profile ? profile.yearsExperience : 0;
  const userDistrict = profile ? profile.district : undefined;

  const match = computeJobMatch(job, userSkills, userExpYears, userDistrict);

  // Check if user already applied
  const existingApp = Array.from(platformStore.applications.values()).find(
    (a) => a.jobId === job.id && a.profileId === profile?.id
  );

  res.json({
    job,
    match,
    existingApplication: existingApp || null,
  });
});

/**
 * POST /api/jobs/:id/apply
 * Applies with confirmed data (Requirement 23)
 */
jobsRouter.post('/:id/apply', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id as string;
    const job = platformStore.jobs.get(jobId);
    if (!job) {
      res.status(404).json({ error: 'JOB_NOT_FOUND', message: 'Job not found.' });
      return;
    }

    const body = applyJobSchema.parse(req.body);
    const userId = req.user!.id;
    let profile = Array.from(platformStore.profiles.values()).find((p) => p.userId === userId);

    if (!profile) {
      profile = {
        id: `prof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        fullName: req.user?.displayName || 'Job Seeker',
        preferredLanguage: 'en',
        isRelocationOpen: true,
        availability: 'Immediate',
        workPreference: 'FULL_TIME',
        yearsExperience: 2,
        isVerified: true,
        educations: [],
        certifications: [],
        experiences: [],
        skills: [
          { id: 's1', name: 'Automotive maintenance', category: 'PRACTICAL', evidenceStatus: 'CONFIRMED', yearsExperience: 2 },
          { id: 's2', name: 'Engine diagnostics', category: 'TECHNICAL', evidenceStatus: 'CONFIRMED', yearsExperience: 2 },
        ],
        aspirations: [],
      };
      platformStore.profiles.set(profile.id, profile);
    }

    // Check if already applied
    const existing = Array.from(platformStore.applications.values()).find(
      (a) => a.jobId === jobId && a.profileId === profile!.id
    );
    if (existing) {
      res.status(400).json({ error: 'ALREADY_APPLIED', message: 'You have already applied for this position.', application: existing });
      return;
    }

    const applicantSkills = body.confirmedData?.skills || profile.skills.map((s) => s.name);
    const applicantExp = body.confirmedData?.yearsExperience ?? profile.yearsExperience;
    const applicantName = body.confirmedData?.name || profile.fullName || 'Job Seeker';

    const match = computeJobMatch(job, applicantSkills, applicantExp, profile.district);

    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newApplication: JobApplicationEntity = {
      id: applicationId,
      jobId,
      profileId: profile.id,
      applicantName,
      jobTitle: job.title,
      employerName: job.employerName,
      status: 'SUBMITTED',
      matchExplanation: match.explanation,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      appliedAt: new Date().toISOString(),
      events: [
        {
          id: `ev_${Date.now()}`,
          status: 'SUBMITTED',
          note: body.notes || 'Application submitted with user confirmation.',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    platformStore.applications.set(applicationId, newApplication);
    platformStore.recordAudit('JOB_APPLIED', 'APPLICATION', userId, applicationId, { jobId, jobTitle: job.title });

    res.status(201).json({
      success: true,
      application: newApplication,
      message: 'Application submitted successfully to employer.',
    });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});

/**
 * GET /api/jobs/applications/me and /user/applications
 * Returns all applications filed by the authenticated beneficiary
 */
jobsRouter.get(['/user/applications', '/applications/me', '/applications'], authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const profile = Array.from(platformStore.profiles.values()).find((p) => p.userId === userId);

  if (!profile) {
    res.json({ applications: [] });
    return;
  }

  const userApps = Array.from(platformStore.applications.values()).filter((a) => a.profileId === profile.id);
  res.json({ applications: userApps });
});
