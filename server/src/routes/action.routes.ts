import { Router } from 'express';
import { ActionController } from '../controllers/action.controller';

const router = Router();

// Action & Human-in-the-loop Approval Routes
router.get('/actions', ActionController.listActions);
router.post('/actions', ActionController.createAction);
router.post('/actions/:id/approve', ActionController.approveAction);
router.post('/actions/:id/reject', ActionController.rejectAction);
router.post('/actions/:id/execute', ActionController.executeAction);

export default router;
