import { Router } from 'express';
import { AccessRequestController } from '../controllers/access-request.controller';
import { authenticateUser, requireMainManager } from '../middleware/auth.middleware';

const router = Router();

// Protected Main Manager Access Request Management Routes
router.use('/access-requests', authenticateUser, requireMainManager);

router.get('/access-requests', AccessRequestController.listRequests);
router.get('/access-requests/:id', AccessRequestController.getRequestDetails);
router.post('/access-requests/:id/approve', AccessRequestController.approveRequest);
router.post('/access-requests/:id/reject', AccessRequestController.rejectRequest);
router.post('/access-requests/:id/request-info', AccessRequestController.requestMoreInfo);
router.post('/access-requests/invite-manager', AccessRequestController.inviteMainManager);

// Users listing route
router.get('/users', authenticateUser, requireMainManager, AccessRequestController.listUsers);

export default router;
