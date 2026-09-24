import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { platformStore, JobEntity } from '../services/store';
import { authenticateToken, requireRole } from '../middleware/auth';

export const employerRouter = Router();

const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  jobType: z.string().default('FULL_TIME'),
  openingsCount: z.number().default(1),
  salaryMin: z.number().default(18000),
  salaryMax: z.number().default(28000),
  state: z.string().default('Tamil Nadu'),
  district: z.string().default('Salem'),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()).default([]),
  requiredEducation: z.string().default('ITI / Diploma'),
  minExperienceYears: z.number().default(1),
  isDemo: z.boolean().default(false),
});

const updateAppStatusSchema = z.object({
  status: z.enum(['NEW', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN']),
  note: z.string().optional(),
});

const updateCompanySchema = z.object({
  companyName: z.string().optional(),
  industry: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  description: z.string().optional(),
});

/**
 * GET /api/employer/profile
 */
employerRouter.get('/profile', authenticateToken, requireRole('EMPLOYER', 'ADMIN'), async (req: Request, res: Response) => {
  const emp = platformStore.employers.get(req.user!.id);
  res.json({
    employer: emp || null,
  });
});

/**
 * PATCH /api/employer/profile
 */
employerRouter.patch('/profile', authenticateToken, requireRole('EMPLOYER', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const data = updateCompanySchema.parse(req.body);
    const user = platformStore.users.get(req.user!.id);
    if (user && data.companyName) {
      user.displayName = data.companyName;
    }
    let emp = platformStore.employers.get(req.user!.id);
    if (!emp) {
      emp = {
        id: `emp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: req.user!.id,
        companyName: data.companyName || user?.displayName || '',
        industry: data.industry || '',
        state: data.state || 'Tamil Nadu',
        district: data.city || data.district || '',
        description: data.description || '',
        isVerified: false,
        createdAt: new Date().toISOString(),
      };
    } else {
      if (data.companyName) emp.companyName = data.companyName;
      if (data.industry) emp.industry = data.industry;
      if (data.state) emp.state = data.state;
      if (data.city || data.district) emp.district = data.city || data.district;
      if (data.description) emp.description = data.description;
    }
    platformStore.employers.set(req.user!.id, emp);
    res.json({
      success: true,
      profile: emp,
    });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});

/**
 * GET /api/employer/jobs
 */
employerRouter.get('/jobs', authenticateToken, requireRole('EMPLOYER', 'ADMIN'), async (req: Request, res: Response) => {
  const jobs = Array.from(platformStore.jobs.values());
  res.json({ jobs });
});

/**
 * POST /api/employer/jobs
 * Post a new job
 */
employerRouter.post('/jobs', authenticateToken, requireRole('EMPLOYER', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const body = createJobSchema.parse(req.body);
    const user = platformStore.users.get(req.user!.id);
    const emp = platformStore.employers.get(req.user!.id);

    const newJob: JobEntity = {
      id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      employerId: req.user!.id,
      employerName: emp?.companyName || user?.displayName || 'Verified Employer',
      title: body.title,
      description: body.description,
      jobType: body.jobType,
      openingsCount: body.openingsCount,
      salaryMin: body.salaryMin,
      salaryMax: body.salaryMax,
      state: body.state,
      district: body.district,
      requiredSkills: body.requiredSkills,
      preferredSkills: body.preferredSkills,
      requiredEducation: body.requiredEducation,
      minExperienceYears: body.minExperienceYears,
      status: 'PUBLISHED',
      isDemo: body.isDemo,
      createdAt: new Date().toISOString(),
    };

    platformStore.jobs.set(newJob.id, newJob);
    platformStore.recordAudit('JOB_POSTED', 'JOB', req.user!.id, newJob.id, { title: newJob.title });

    res.status(201).json({ success: true, job: newJob });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});

/**
 * GET /api/employer/candidates and /api/employer/candidates/matches
 * Candidate Discovery with AI Match reasoning for active jobs (Requirement 25)
 */
employerRouter.get(['/candidates', '/candidates/matches'], authenticateToken, requireRole('EMPLOYER', 'ADMIN'), async (_req: Request, res: Response) => {
  const profiles = Array.from(platformStore.profiles.values());
  const jobs = Array.from(platformStore.jobs.values());

  const candidateMatches = profiles.map((p) => {
    // Check against automotive or first available job
    const relevantJob = jobs[0];
    const userSkillNames = p.skills.map((s) => s.name);
    const matched = relevantJob ? relevantJob.requiredSkills.filter((rs) => userSkillNames.some((us) => us.toLowerCase().includes(rs.toLowerCase()))) : [];
    const missing = relevantJob ? relevantJob.requiredSkills.filter((rs) => !matched.includes(rs)) : [];

    return {
      profileId: p.id,
      fullName: p.fullName,
      currentOccupation: p.currentOccupation,
      yearsExperience: p.yearsExperience,
      state: p.state,
      district: p.district,
      availability: p.availability,
      skills: p.skills,
      targetJobTitle: relevantJob?.title || 'Diagnostic Technician',
      matchedSkills: matched,
      matchingSkills: matched,
      missingSkills: missing,
      skillGaps: missing,
      whyMatches: `Candidate has ${p.yearsExperience} yrs experience with confirmed skills in ${matched.join(', ') || 'practical fundamentals'}.`,
    };
  });

  res.json({ candidates: candidateMatches });
});

/**
 * GET /api/employer/applications
 */
employerRouter.get('/applications', authenticateToken, requireRole('EMPLOYER', 'ADMIN'), async (_req: Request, res: Response) => {
  const apps = Array.from(platformStore.applications.values());
  res.json({ applications: apps });
});

/**
 * PATCH /api/employer/applications/:id/status and /applications/:id/stage
 * Move candidate through hiring stages (Requirement 26)
 */
employerRouter.patch(['/applications/:id/status', '/applications/:id/stage'], authenticateToken, requireRole('EMPLOYER', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const appId = req.params.id as string;
    const requestedStatus = req.body.status || req.body.stage;
    const { status, note } = updateAppStatusSchema.parse({
      status: requestedStatus,
      note: req.body.note || req.body.notes,
    });
    const app = platformStore.applications.get(appId);

    if (!app) {
      res.status(404).json({ error: 'APPLICATION_NOT_FOUND', message: 'Application not found.' });
      return;
    }

    const previousStatus = app.status;
    app.status = status as any;
    app.events.push({
      id: `ev_${Date.now()}`,
      status,
      note: note || `Application status updated to ${status}.`,
      timestamp: new Date().toISOString(),
    });

    platformStore.recordAudit('APPLICATION_STATUS_UPDATED', 'APPLICATION', req.user!.id, appId, { previousStatus, newStatus: status });

    res.json({ success: true, application: app });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});
