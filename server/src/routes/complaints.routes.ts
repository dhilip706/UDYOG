import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { platformStore, ComplaintEntity } from '../services/store';
import { authenticateToken } from '../middleware/auth';

export const complaintRouter = Router();

const createComplaintSchema = z.object({
  category: z.enum([
    'EMPLOYER',
    'TRAINING_PROVIDER',
    'APPLICATION',
    'PAYMENT',
    'MISTREATMENT',
    'ABUSE',
    'TECHNICAL_ISSUE',
    'ACCOUNT_ISSUE',
    'OTHER',
  ]),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  subject: z.string().min(5),
  description: z.string().min(10),
  audioRecordUrl: z.string().optional(),
});

/**
 * GET /api/complaints
 * Returns grievances filed by the user (or all if admin)
 */
complaintRouter.get('/', authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = platformStore.users.get(userId);

  let list = Array.from(platformStore.complaints.values());
  if (user?.role !== 'ADMIN') {
    list = list.filter((c) => c.userId === userId);
  }

  res.json({ complaints: list });
});

/**
 * POST /api/complaints
 * Submit confirmed grievance
 */
complaintRouter.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = platformStore.users.get(userId);
    const body = createComplaintSchema.parse(req.body);

    const complaintId = `cmp_${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint: ComplaintEntity = {
      id: complaintId,
      userId,
      userName: user?.displayName || user?.phoneNumber || 'User',
      category: body.category,
      priority: body.priority,
      status: 'NEW',
      subject: body.subject,
      description: body.description,
      audioRecordUrl: body.audioRecordUrl,
      createdAt: new Date().toISOString(),
      events: [
        {
          id: `cev_${Date.now()}`,
          note: 'Grievance officially filed and recorded on platform.',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    platformStore.complaints.set(complaintId, newComplaint);
    platformStore.recordAudit('COMPLAINT_FILED', 'COMPLAINT', userId, complaintId, { category: body.category, priority: body.priority });

    res.status(201).json({
      success: true,
      complaint: newComplaint,
      message: 'Your grievance has been submitted securely and assigned a tracking ID.',
    });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});

/**
 * GET /api/complaints/:id
 */
complaintRouter.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  const complaint = platformStore.complaints.get(req.params.id as string);
  if (!complaint) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Complaint not found.' });
    return;
  }

  // Ensure user owns complaint or is admin
  if (complaint.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
    res.status(403).json({ error: 'FORBIDDEN', message: 'Access denied.' });
    return;
  }

  res.json({ complaint });
});
