import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { platformStore } from '../services/store';
import { authenticateToken, requireAdmin } from '../middleware/auth';

export const adminRouter = Router();

// Protect ALL admin routes with strict server-side allowlist check
adminRouter.use(authenticateToken);
adminRouter.use(requireAdmin);

const updateComplaintSchema = z.object({
  status: z.enum(['NEW', 'ASSIGNED', 'INVESTIGATING', 'ACTION_REQUIRED', 'RESOLVED', 'CLOSED']).optional(),
  assignedAdminId: z.string().optional(),
  resolutionNote: z.string().optional(),
  eventNote: z.string().optional(),
});

/**
 * GET /api/admin/overview
 * Platform Command Center summary metrics (Requirement 29)
 */
adminRouter.get('/overview', async (_req: Request, res: Response) => {
  const beneficiariesCount = platformStore.profiles.size;
  const employersCount = platformStore.users ? Array.from(platformStore.users.values()).filter((u) => u.role === 'EMPLOYER').length : 1;
  const jobsCount = platformStore.jobs.size;
  const applicationsCount = platformStore.applications.size;
  const complaintsCount = platformStore.complaints.size;
  const activeComplaints = Array.from(platformStore.complaints.values()).filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;

  res.json({
    metrics: {
      totalBeneficiaries: beneficiariesCount,
      totalEmployers: employersCount,
      totalJobs: jobsCount,
      totalApplications: applicationsCount,
      totalComplaints: complaintsCount,
      activeComplaints,
      isDemoDataNotice: 'DEMO DATA — Standardized NCO-2015 benchmarking environment active.',
    },
    totalBeneficiaries: beneficiariesCount,
    totalEmployers: employersCount,
    totalJobs: jobsCount,
    totalApplications: applicationsCount,
    totalComplaints: complaintsCount,
    activeComplaints,
    systemHealth: platformStore.systemHealth,
  });
});

/**
 * GET /api/admin/beneficiaries
 */
adminRouter.get('/beneficiaries', async (_req: Request, res: Response) => {
  const beneficiaries = Array.from(platformStore.profiles.values());
  res.json({ beneficiaries });
});

/**
 * GET /api/admin/employers
 */
adminRouter.get('/employers', async (_req: Request, res: Response) => {
  const employers = Array.from(platformStore.users.values()).filter((u) => u.role === 'EMPLOYER');
  res.json({ employers });
});

/**
 * GET /api/admin/jobs
 */
adminRouter.get('/jobs', async (_req: Request, res: Response) => {
  const jobs = Array.from(platformStore.jobs.values());
  res.json({ jobs });
});

/**
 * GET /api/admin/applications
 */
adminRouter.get('/applications', async (_req: Request, res: Response) => {
  const applications = Array.from(platformStore.applications.values());
  res.json({ applications });
});

/**
 * GET /api/admin/complaints
 */
adminRouter.get('/complaints', async (_req: Request, res: Response) => {
  const complaints = Array.from(platformStore.complaints.values());
  res.json({ complaints });
});

/**
 * PATCH /api/admin/complaints/:id
 */
adminRouter.patch('/complaints/:id', async (req: Request, res: Response) => {
  try {
    const complaintId = req.params.id as string;
    const complaint = platformStore.complaints.get(complaintId);

    if (!complaint) {
      res.status(404).json({ error: 'NOT_FOUND', message: 'Complaint not found.' });
      return;
    }

    const body = updateComplaintSchema.parse(req.body);

    if (body.status) {
      complaint.status = body.status;
    }
    if (body.assignedAdminId) {
      complaint.assignedAdminId = body.assignedAdminId;
    }
    if (body.resolutionNote) {
      complaint.resolutionNote = body.resolutionNote;
    }

    complaint.events.push({
      id: `cev_${Date.now()}`,
      note: body.eventNote || `Grievance status updated to ${complaint.status} by administrator.`,
      timestamp: new Date().toISOString(),
    });

    platformStore.recordAudit('COMPLAINT_UPDATED_BY_ADMIN', 'COMPLAINT', req.user!.id, complaintId, { status: complaint.status });

    res.json({ success: true, complaint });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});

/**
 * GET /api/admin/analytics
 * Regional Skill Intelligence Data (Requirement 30)
 */
adminRouter.get('/analytics', async (_req: Request, res: Response) => {
  res.json({
    regionalData: platformStore.regionalData,
    sectors: ['Automotive & Clean Mobility', 'Industrial Automation', 'Renewable Energy', 'IT & Business Services'],
  });
});

/**
 * GET /api/admin/audit
 * Immutable Security Audit Logs (Requirement 51)
 */
adminRouter.get('/audit', async (_req: Request, res: Response) => {
  res.json({ auditLogs: platformStore.auditLogs });
});

/**
 * GET /api/admin/system and /api/admin/system/health
 * System Health and Infrastructure Telemetry (Requirement 52)
 */
adminRouter.get(['/system', '/system/health'], async (_req: Request, res: Response) => {
  res.json({
    metrics: platformStore.systemHealth,
    services: {
      database: { status: 'HEALTHY', latencyMs: 2 },
      aiProvider: { status: 'HEALTHY', latencyMs: 140 },
      storage: { status: 'HEALTHY', latencyMs: 12 },
      smsService: { status: 'HEALTHY', latencyMs: 35 },
    },
    serverTime: new Date().toISOString(),
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
  });
});
