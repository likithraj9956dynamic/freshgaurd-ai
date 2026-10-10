import type { Request, Response, NextFunction } from 'express';
import { AssistantService } from '../services/ai/assistant.service';
import { ApiResponse } from '../utils/apiResponse';
import { assistantQuerySchema } from '../validators/briefing.validator';

export class AssistantController {
  static async queryAssistant(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = assistantQuerySchema.parse(req.body);
      const result = await AssistantService.processQuery(validated);

      return ApiResponse.success({
        res,
        message: 'Evidence-grounded operational response synthesized',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const history = AssistantService.getConversationHistory(conversationId);

      return ApiResponse.success({
        res,
        message: 'Conversation history retrieved',
        data: {
          conversationId,
          messages: history,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
