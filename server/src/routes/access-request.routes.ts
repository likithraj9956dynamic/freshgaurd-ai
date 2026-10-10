// ============================================================
// FreshGuard AI — Access Request & User Admin Routes
// ============================================================

import { Router } from 'express';
import { accessRequestController } from '../controllers/access-request.controller';
import { requireAuth, requireMainManager } from '../middleware/auth.middleware';

const router = Router();

// All access-request management endpoints require an authorized Main Manager
router.get(
  '/access-requests',
  requireAuth,
  requireMainManager,
  (req, res, next) => accessRequestController.listRequests(req, res, next)
);

router.get(
  '/access-requests/:id',
  requireAuth,
  requireMainManager,
  (req, res, next) => accessRequestController.getRequestById(req, res, next)
);

router.post(
  '/access-requests/:id/approve',
  requireAuth,
  requireMainManager,
  (req, res, next) => accessRequestController.approveRequest(req, res, next)
);

router.post(
  '/access-requests/:id/reject',
  requireAuth,
  requireMainManager,
  (req, res, next) => accessRequestController.rejectRequest(req, res, next)
);

router.post(
  '/access-requests/:id/request-info',
  requireAuth,
  requireMainManager,
  (req, res, next) => accessRequestController.requestMoreInfo(req, res, next)
);

router.get(
  '/users',
  requireAuth,
  requireMainManager,
  (req, res, next) => accessRequestController.listApprovedUsers(req, res, next)
);

router.post(
  '/auth/invite-manager',
  requireAuth,
  requireMainManager,
  (req, res, next) => accessRequestController.inviteManager(req, res, next)
);

export default router;
