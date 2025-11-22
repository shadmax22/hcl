import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
// import { authorize } from '../middleware/authMiddleware'; // Use this for role-based access control

const router = Router();

router.post('/signup', authController.signup.bind(authController));
router.post('/register-patient', authController.registerPatient.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/me', authenticate, authController.getCurrentUser.bind(authController));


export default router;

