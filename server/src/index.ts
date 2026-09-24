import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { authRouter } from './routes/auth.routes';
import { profileRouter } from './routes/profile.routes';
import { skillsRouter } from './routes/skills.routes';
import { assessmentRouter } from './routes/assessments.routes';
import { learningRouter } from './routes/learning.routes';
import { jobsRouter } from './routes/jobs.routes';
import { employerRouter } from './routes/employer.routes';
import { complaintRouter } from './routes/complaints.routes';
import { adminRouter } from './routes/admin.routes';
import { aiRouter } from './routes/ai.routes';
import { ngoRouter } from './routes/ngo.routes';

export const app = express();

// Security & Middleware
app.use(cors({
  origin: true, // Allow frontend dev server and clients
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Structured Request Logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  next();
  const duration = Date.now() - start;
  if (!req.path.startsWith('/api/health')) {
    console.info(`[HTTP] ${req.method} ${req.path} completed in ${duration}ms`);
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    service: 'Aura Livelihood & Skilling Platform Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount modular API routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/assessments', assessmentRouter);
app.use('/api/learning', learningRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/employer', employerRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ai', aiRouter);
app.use('/api/ngo', ngoRouter);

// Centralized Error Handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Unhandled Server Error]', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred. Please try again.',
  });
});

// Start listening if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.info(`=======================================================`);
    console.info(`  Aura Production Backend running on port ${env.PORT}`);
    console.info(`  Environment: ${env.NODE_ENV}`);
    console.info(`  Admin Authorization: Server-Side Allowlist Active`);
    console.info(`=======================================================`);
  });
}
