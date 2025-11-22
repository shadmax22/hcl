import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import goalNotificationJob from '../jobs/goalNotificationJob';

const router = Router();

// Manual trigger for goal notification job (admin only)
router.post(
  '/goal-notifications/run',
  authenticate,
  authorize(['admin']),
  async (_req: any, res: any): Promise<void> => {
    try {
      await goalNotificationJob.runNow();
      res.status(200).json({
        message: 'Goal notification job executed successfully',
      });
    } catch (error) {
      console.error('Error running goal notification job:', error);
      res.status(500).json({
        error: 'Server Error',
        message: 'Failed to run goal notification job',
      });
    }
  }
);

export default router;

