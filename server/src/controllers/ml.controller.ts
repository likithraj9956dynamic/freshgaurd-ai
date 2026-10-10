import type { Request, Response, NextFunction } from 'express';
import {
  getDemandModelStatus,
  getStoreForecasts,
  getForecast,
  getAllForecasts,
} from '../services/demandForecast';
import {
  getWastageModelStatus,
  getWastageRiskByStore,
  getWastageRiskBySku,
  getCriticalWastageRisks,
  getStoreWastageSummary,
  getAllStoreWastageSummaries,
} from '../services/wastageRisk';
import { ApiResponse } from '../utils/apiResponse';

export class MlController {
  // ─── Demand Forecasting ───────────────────────────────────

  static async getForecastStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const status = getDemandModelStatus();
      return ApiResponse.success({
        res,
        message: 'Demand forecasting ML model status retrieved',
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStoreForecasts(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const forecasts = getStoreForecasts(storeId);
      return ApiResponse.success({
        res,
        message: `Demand forecasts retrieved for store ${storeId}`,
        data: forecasts,
        meta: {
          storeId,
          skuCount: forecasts.length,
          horizonDays: 7,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId, sku } = req.params;
      const forecast = getForecast(storeId, sku);
      if (!forecast) {
        return ApiResponse.error({
          res,
          statusCode: 404,
          message: `No forecast available for store ${storeId} and SKU ${sku}`,
        });
      }
      return ApiResponse.success({
        res,
        message: `Demand forecast retrieved for ${sku} at ${storeId}`,
        data: forecast,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllForecasts(_req: Request, res: Response, next: NextFunction) {
    try {
      const forecasts = getAllForecasts();
      return ApiResponse.success({
        res,
        message: 'All store demand forecasts retrieved',
        data: forecasts,
        meta: {
          totalForecasts: forecasts.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ─── Wastage Risk Model ───────────────────────────────────

  static async getWastageStatus(_req: Request, res: Response, next: NextFunction) {
    try {
      const status = getWastageModelStatus();
      return ApiResponse.success({
        res,
        message: 'Wastage risk ML classification model status retrieved',
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStoreWastageSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const summary = getStoreWastageSummary(storeId);
      const risks = getWastageRiskByStore(storeId);

      return ApiResponse.success({
        res,
        message: `Wastage risk analysis retrieved for store ${storeId}`,
        data: {
          summary,
          productRisks: risks,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllWastageSummaries(_req: Request, res: Response, next: NextFunction) {
    try {
      const summaries = getAllStoreWastageSummaries();
      return ApiResponse.success({
        res,
        message: 'Network-wide store wastage risk summaries retrieved',
        data: summaries,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCriticalWastageRisks(_req: Request, res: Response, next: NextFunction) {
    try {
      const critical = getCriticalWastageRisks();
      return ApiResponse.success({
        res,
        message: 'Critical and high wastage risks across network retrieved',
        data: critical,
        meta: {
          count: critical.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSkuWastageRisk(req: Request, res: Response, next: NextFunction) {
    try {
      const { sku } = req.params;
      const risks = getWastageRiskBySku(sku);
      return ApiResponse.success({
        res,
        message: `Wastage risk across stores for SKU ${sku}`,
        data: risks,
      });
    } catch (error) {
      next(error);
    }
  }
}
