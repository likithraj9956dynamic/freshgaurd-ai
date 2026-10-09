import { Request, Response, NextFunction } from 'express';
import { AnalyticsEngineService } from '../services/analytics.service';
import { ApiResponse } from '../utils/apiResponse';
import { runAnalysisSchema, analyticsStoreQuerySchema } from '../validators/analytics.validator';

export class AnalyticsController {
  static async getOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const overview = await AnalyticsEngineService.getNetworkOverview();
      return ApiResponse.success({
        res,
        message: 'Network analytics overview retrieved successfully',
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStoresAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const query = analyticsStoreQuerySchema.parse(req.query);
      const data = await AnalyticsEngineService.getStoresAnalytics(query);
      return ApiResponse.success({
        res,
        message: 'Store health analytics retrieved successfully',
        data: data.stores,
        meta: { total: data.total },
      });
    } catch (error) {
      next(error);
    }
  }

  static async triggerRun(req: Request, res: Response, next: NextFunction) {
    try {
      const options = runAnalysisSchema.parse(req.body);
      const result = await AnalyticsEngineService.runAnalysis(options);
      return ApiResponse.success({
        res,
        message: 'Intelligence analysis run completed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
