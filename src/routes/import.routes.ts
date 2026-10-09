import { Router } from 'express';
import { ImportController } from '../controllers/import.controller';

const router = Router();

// Ingestion & Seeding Endpoints
router.post('/imports', ImportController.importData);
router.post('/imports/seed-demo', ImportController.seedDemoData);

export default router;
