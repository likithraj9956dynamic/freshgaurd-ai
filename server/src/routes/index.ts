import { Router } from 'express';
import healthRoutes from './health.routes';
import operationalRoutes from './operational.routes';
import importRoutes from './import.routes';
import analyticsRoutes from './analytics.routes';
import investigationRoutes from './investigation.routes';
import decisionRoutes from './decision.routes';
import actionRoutes from './action.routes';
import briefingRoutes from './briefing.routes';
import assistantRoutes from './assistant.routes';

const router = Router();

// Mount All API v1 Routes
router.use('/', healthRoutes);
router.use('/', operationalRoutes);
router.use('/', importRoutes);
router.use('/', analyticsRoutes);
router.use('/', investigationRoutes);
router.use('/', decisionRoutes);
router.use('/', actionRoutes);
router.use('/', briefingRoutes);
router.use('/', assistantRoutes);

export default router;
