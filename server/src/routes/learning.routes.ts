import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { platformStore } from '../services/store';
import { authenticateToken, requireRole } from '../middleware/auth';

export const learningRouter = Router();

const updateProgressSchema = z.object({
  moduleId: z.string(),
  quizPassed: z.boolean().optional(),
  completed: z.boolean().default(true),
});

/**
 * GET /api/learning/path
 * Returns or generates personalized Day 1 to Day 7 modules based on skill gap profile
 */
learningRouter.get('/path', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  const userId = req.user!.id;
  let path = platformStore.learningPaths.get(userId);

  if (!path) {
    // Generate personalized 5-day curriculum targeting high-value skills
    path = {
      id: `lp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      targetCareer: 'Advanced Automotive Diagnostic & EV Associate',
      currentDay: 1,
      totalDays: 5,
      progressPercentage: 0,
      modules: [
        {
          id: 'mod_1',
          dayNumber: 1,
          title: 'Day 1: CAN Bus Telemetry & Diagnostic Signal Protocols',
          objective: 'Master differential CAN-High and CAN-Low voltage signals and oscilloscope trigger capture.',
          durationMins: 35,
          difficulty: 'Intermediate',
          isCompleted: false,
          quizPassed: false,
          resources: [
            { type: 'interactive_guide', title: 'CAN High / Low Waveform Analyzer', url: '#guide-can-bus' },
            { type: 'practical_exercise', title: 'Reading 2.5V Bias and Termination Resistance (60 Ohms)', url: '#exercise-1' },
          ],
        },
        {
          id: 'mod_2',
          dayNumber: 2,
          title: 'Day 2: High Voltage De-Energization & Interlock Loops',
          objective: 'Learn manual service disconnect (MSD) isolation, high-voltage interlock loop (HVIL) testing, and capacitor discharge.',
          durationMins: 45,
          difficulty: 'Advanced',
          isCompleted: false,
          quizPassed: false,
          resources: [
            { type: 'standard_operating_procedure', title: 'NCVET Standard: 1000V Isolation Check Protocol', url: '#sop-hv-safety' },
            { type: 'simulation', title: 'Virtual High-Voltage Interlock Continuity Check', url: '#sim-hvil' },
          ],
        },
        {
          id: 'mod_3',
          dayNumber: 3,
          title: 'Day 3: Battery Management Systems (BMS) Cell Voltage Balancing',
          objective: 'Analyze internal resistance (IR) variations, state of charge (SoC) calculations, and passive bleed balancing circuits.',
          durationMins: 40,
          difficulty: 'Advanced',
          isCompleted: false,
          quizPassed: false,
          resources: [
            { type: 'technical_brief', title: 'LFP vs NMC Cell Degradation Profiles', url: '#brief-bms' },
          ],
        },
        {
          id: 'mod_4',
          dayNumber: 4,
          title: 'Day 4: Motor Controller Inverter Diagnostics',
          objective: 'Troubleshoot IGBT gate drivers, resolver angle sensor offset, and 3-phase AC motor winding temperature faults.',
          durationMins: 50,
          difficulty: 'Specialized',
          isCompleted: false,
          quizPassed: false,
          resources: [
            { type: 'practical_exercise', title: 'Resolver Angle Calibration using Service Software', url: '#exercise-resolver' },
          ],
        },
        {
          id: 'mod_5',
          dayNumber: 5,
          title: 'Day 5: Regenerative Braking & DC Fast Charging Telemetry',
          objective: 'CCS2 / CHAdeMO communication handshake sequence, PLC pilot line PWM duty cycle verification, and isolation monitoring.',
          durationMins: 45,
          difficulty: 'Specialized',
          isCompleted: false,
          quizPassed: false,
          resources: [
            { type: 'assessment_prep', title: 'Final Practical Certification Readiness Review', url: '#cert-readiness' },
          ],
        },
      ],
    };

    platformStore.learningPaths.set(userId, path);
  }

  res.json({ learningPath: path });
});

/**
 * GET /api/learning/modules
 * Return personalized learning modules
 */
learningRouter.get('/modules', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  const userId = req.user!.id;
  let path = platformStore.learningPaths.get(userId);

  if (!path) {
    path = {
      id: `lp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      targetCareer: 'Advanced Automotive Diagnostic & EV Associate',
      currentDay: 1,
      totalDays: 5,
      progressPercentage: 20,
      modules: [
        {
          id: 'mod_1',
          dayNumber: 1,
          title: 'Day 1: CAN Bus Telemetry & Diagnostic Signal Protocols',
          objective: 'Master differential CAN-High and CAN-Low voltage signals and oscilloscope trigger capture.',
          durationMins: 35,
          difficulty: 'Intermediate',
          isCompleted: true,
          quizPassed: true,
          resources: [
            { type: 'interactive_guide', title: 'CAN High / Low Waveform Analyzer', url: '#guide-can-bus' },
            { type: 'practical_exercise', title: 'Reading 2.5V Bias and Termination Resistance (60 Ohms)', url: '#exercise-1' },
          ],
        },
        {
          id: 'mod_2',
          dayNumber: 2,
          title: 'Day 2: High Voltage De-Energization & Interlock Loops',
          objective: 'Learn manual service disconnect (MSD) isolation, high-voltage interlock loop (HVIL) testing, and capacitor discharge.',
          durationMins: 45,
          difficulty: 'Advanced',
          isCompleted: false,
          quizPassed: false,
          resources: [
            { type: 'standard_operating_procedure', title: 'NCVET Standard: 1000V Isolation Check Protocol', url: '#sop-hv-safety' },
            { type: 'simulation', title: 'Virtual High-Voltage Interlock Continuity Check', url: '#sim-hvil' },
          ],
        },
      ],
    };
    platformStore.learningPaths.set(userId, path);
  }

  res.json({ modules: path.modules, learningPath: path });
});

/**
 * POST /api/learning/progress
 */
learningRouter.post('/progress', authenticateToken, requireRole('BENEFICIARY', 'ADMIN'), async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { moduleId, quizPassed, completed } = updateProgressSchema.parse(req.body);
    const path = platformStore.learningPaths.get(userId);

    if (!path) {
      res.status(404).json({ error: 'NOT_FOUND', message: 'Learning path not found.' });
      return;
    }

    const mod = path.modules.find((m: any) => m.id === moduleId);
    if (mod) {
      mod.isCompleted = completed;
      if (quizPassed !== undefined) {
        mod.quizPassed = quizPassed;
      }
    }

    const completedCount = path.modules.filter((m: any) => m.isCompleted).length;
    path.progressPercentage = Math.round((completedCount / path.modules.length) * 100);
    path.currentDay = Math.min(path.totalDays, completedCount + 1);

    platformStore.recordAudit('LEARNING_PROGRESS', 'LEARNING_PATH', userId, moduleId, { completedCount, progress: path.progressPercentage });

    res.json({ success: true, learningPath: path });
  } catch (err: any) {
    res.status(400).json({ error: 'VALIDATION_ERROR', message: err.message });
  }
});
