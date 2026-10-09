import { Router } from 'express';
import { InvestigationController } from '../controllers/investigation.controller';

const router = Router();

// Investigation & Causal Graph Routes
router.get('/stores/:storeId/investigation', InvestigationController.getStoreInvestigation);
router.get('/issues/:issueId/evidence', InvestigationController.getIssueEvidence);
router.post('/investigations/:id/refresh', InvestigationController.refreshInvestigation);

export default router;
