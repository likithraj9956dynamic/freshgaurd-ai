import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateUser } from '../middleware/auth.middleware';

const router = Router();

// Public Authentication & Registration Routes
router.post('/auth/register/store-manager', AuthController.registerStoreManager);
router.post('/auth/register/supplier', AuthController.registerSupplier);
router.post('/auth/register/main-manager', AuthController.registerMainManager);
router.post('/auth/login', AuthController.login);

// Protected Auth Profile Routes
router.get('/auth/me', authenticateUser, AuthController.getMe);

export default router;
