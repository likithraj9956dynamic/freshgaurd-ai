import { Router } from 'express';
import { DecisionController } from '../controllers/decision.controller';

const router = Router();

// Decision Engine & What-If Simulation Endpoints
router.post('/decisions/generate', DecisionController.generateDecision);
router.get('/decisions/:id', DecisionController.getDecision);
router.post('/decisions/:id/simulate', DecisionController.simulateDecision);

export default router;
