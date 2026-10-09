import { Router } from 'express';
import { AssistantController } from '../controllers/assistant.controller';

const router = Router();

// AI Operations Assistant Endpoints
router.post('/assistant/query', AssistantController.queryAssistant);
router.get('/assistant/conversations/:conversationId', AssistantController.getConversation);

export default router;
