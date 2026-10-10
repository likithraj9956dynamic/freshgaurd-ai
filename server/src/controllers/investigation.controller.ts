import type { Request, Response, NextFunction } from 'express';
import { InvestigationEngineService } from '../services/investigation.service';
import { ApiResponse } from '../utils/apiResponse';

export class InvestigationController {
  static async getStoreInvestigation(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const investigation = await InvestigationEngineService.getStoreInvestigation(storeId);

      return ApiResponse.success({
        res,
        message: `Causal investigation graph retrieved for store ${storeId}`,
        data: investigation,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getIssueEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const { issueId } = req.params;
      const evidence = await InvestigationEngineService.getIssueEvidence(issueId);

      return ApiResponse.success({
        res,
        message: `Evidence bundle retrieved for issue ${issueId}`,
        data: evidence,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshInvestigation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const refreshed = await InvestigationEngineService.refreshInvestigation(id);

      return ApiResponse.success({
        res,
        message: `Investigation ${id} refreshed with latest telemetry`,
        data: refreshed,
      });
    } catch (error) {
      next(error);
    }
  }
}
