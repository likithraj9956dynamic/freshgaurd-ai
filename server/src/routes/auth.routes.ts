// ============================================================
// FreshGuard AI — Authentication Routes
// ============================================================

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Registration routes
router.post('/auth/register/store-manager', (req, res, next) => authController.registerStoreManager(req, res, next));
router.post('/auth/register/supplier', (req, res, next) => authController.registerSupplier(req, res, next));
router.post('/auth/register/main-manager', (req, res, next) => authController.registerMainManager(req, res, next));
router.get('/auth/bootstrap-status', (req, res, next) => authController.getBootstrapStatus(req, res, next));

// Authentication routes
router.post('/auth/login', (req, res, next) => authController.login(req, res, next));
router.post('/auth/logout', requireAuth, (req, res, next) => authController.logout(req, res, next));
router.get('/auth/me', requireAuth, (req, res, next) => authController.getCurrentUser(req, res, next));

export default router;
