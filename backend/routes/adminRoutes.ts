import { Router } from 'express';
import adminController from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/users', authenticate, authorize(['admin']), adminController.getAllUsers.bind(adminController));
router.get('/doctors', authenticate, authorize(['admin']), adminController.getAllDoctors.bind(adminController));
router.get('/care-categories', authenticate, authorize(['admin']), adminController.getCareCategories.bind(adminController));
router.post('/users', authenticate, authorize(['admin']), adminController.createUser.bind(adminController));
router.post('/doctors', authenticate, authorize(['admin']), adminController.createDoctor.bind(adminController));
router.post('/care-categories', authenticate, authorize(['admin']), adminController.createCareCategory.bind(adminController));

export default router;

