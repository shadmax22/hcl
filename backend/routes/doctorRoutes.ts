import { Router } from 'express';
import doctorController from '../controllers/doctorController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/profile', authenticate, authorize(['healthcare_provider']), doctorController.getProfile.bind(doctorController));
router.get('/patients', authenticate, authorize(['healthcare_provider']), doctorController.getMyPatients.bind(doctorController));
router.get('/patients/:patientId', authenticate, authorize(['healthcare_provider']), doctorController.getPatientDetails.bind(doctorController));
router.get('/patients/:patientId/goals', authenticate, authorize(['healthcare_provider']), doctorController.getPatientGoals.bind(doctorController));
router.post('/patients/:patientId/goals', authenticate, authorize(['healthcare_provider']), doctorController.createGoalForPatient.bind(doctorController));
router.get('/notifications', authenticate, authorize(['healthcare_provider']), doctorController.getNotifications.bind(doctorController));

export default router;

