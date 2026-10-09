import { Router } from 'express';
import { BriefingController } from '../controllers/briefing.controller';

const router = Router();

// Executive Briefing Endpoints
router.get('/briefings/latest', BriefingController.getLatestBriefing);
router.post('/briefings/generate', BriefingController.generateBriefing);
router.get('/audio/cache/:filename', BriefingController.getAudioStream);

export default router;
