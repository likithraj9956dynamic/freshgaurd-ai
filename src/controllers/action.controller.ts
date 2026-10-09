import { Request, Response, NextFunction } from 'express';
import { ActionEngineService } from '../services/action.service';
import { ApiResponse } from '../utils/apiResponse';
import { createActionSchema, actionDecisionSchema, executeActionSchema } from '../validators/action.validator';

export class ActionController {
  static async createAction(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createActionSchema.parse(req.body);
      const action = await ActionEngineService.createAction(validated);

      return ApiResponse.success({
        res,
        statusCode: 201,
        message: 'Action proposed successfully and queued for human approval',
        data: action,
      });
    } catch (error) {
      next(error);
    }
  }

  static async approveAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = actionDecisionSchema.parse(req.body);
      const approved = await ActionEngineService.approveAction(id, validated.approver, validated.reason);

      return ApiResponse.success({
        res,
        message: `Action ${id} successfully approved by human operator`,
        data: approved,
      });
    } catch (error) {
      next(error);
    }
  }

  static async rejectAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = actionDecisionSchema.parse(req.body);
      const rejected = await ActionEngineService.rejectAction(id, validated.approver, validated.reason);

      return ApiResponse.success({
        res,
        message: `Action ${id} rejected by human operator`,
        data: rejected,
      });
    } catch (error) {
      next(error);
    }
  }

  static async executeAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = executeActionSchema.parse(req.body);
      const result = await ActionEngineService.executeAction(id, validated.executedBy, validated.executionNotes);

      return ApiResponse.success({
        res,
        message: `Approved action ${id} executed successfully in simulated operations environment`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async listActions(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId, status } = req.query;
      const actions = await ActionEngineService.listActions({
        storeId: storeId as string,
        status: status as string,
      });

      return ApiResponse.success({
        res,
        message: 'Actions retrieved successfully',
        data: actions,
      });
    } catch (error) {
      next(error);
    }
  }
}
