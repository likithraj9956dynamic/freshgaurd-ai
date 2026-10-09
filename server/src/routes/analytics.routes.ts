import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

// Analytics & Store Health Endpoints
router.get('/analytics/overview', AnalyticsController.getOverview);
router.get('/analytics/stores', AnalyticsController.getStoresAnalytics);
router.post('/analytics/run', AnalyticsController.triggerRun);

export default router;
