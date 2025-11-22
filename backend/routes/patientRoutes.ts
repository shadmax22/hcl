import { Router } from 'express';
import patientController from '../controllers/patientController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', authenticate, authorize(['patient']), patientController.getProfile.bind(patientController));
router.get('/goals', authenticate, authorize(['patient']), patientController.getGoals.bind(patientController));
router.get('/tracking-records/categories', authenticate, authorize(['patient']), patientController.getTrackingRecordCategories.bind(patientController));
router.get('/tracking-records', authenticate, authorize(['patient']), patientController.getTrackingRecords.bind(patientController));
router.post('/tracking-records', authenticate, authorize(['patient']), patientController.addTrackingRecord.bind(patientController));
router.get('/reminders', authenticate, authorize(['patient']), patientController.getReminders.bind(patientController));
router.get('/notifications', authenticate, authorize(['patient']), patientController.getNotifications.bind(patientController));

export default router;

