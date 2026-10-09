import { Request, Response, NextFunction } from 'express';
import { DecisionEngineService } from '../services/decision.service';
import { ApiResponse } from '../utils/apiResponse';
import { generateDecisionSchema, simulateDecisionSchema } from '../validators/decision.validator';

export class DecisionController {
  static async generateDecision(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = generateDecisionSchema.parse(req.body);
      const decisionPackage = await DecisionEngineService.generateDecisionPackage(validated);

      return ApiResponse.success({
        res,
        message: 'Decision package with feasible corrective options generated successfully',
        data: decisionPackage,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDecision(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const decision = await DecisionEngineService.getDecisionById(id);

      return ApiResponse.success({
        res,
        message: 'Decision package retrieved successfully',
        data: decision,
      });
    } catch (error) {
      next(error);
    }
  }

  static async simulateDecision(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = simulateDecisionSchema.parse(req.body);

      const simulation = await DecisionEngineService.runSimulation(
        id,
        body.simulationName,
        body.optionId,
        body.parameters
      );

      return ApiResponse.success({
        res,
        message: 'What-If read-only simulation executed successfully',
        data: simulation,
      });
    } catch (error) {
      next(error);
    }
  }
}
