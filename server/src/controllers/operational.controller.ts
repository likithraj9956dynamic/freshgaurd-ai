import { Request, Response, NextFunction } from 'express';
import { SalesService } from '../services/sales.service';
import { InventoryService } from '../services/inventory.service';
import { WastageService } from '../services/wastage.service';
import { PurchaseOrderService } from '../services/purchaseOrder.service';
import { StoreService } from '../services/store.service';
import { ApiResponse } from '../utils/apiResponse';
import { NotFoundError } from '../utils/errors';
import {
  salesQuerySchema,
  inventoryQuerySchema,
  wastageQuerySchema,
  purchaseOrderQuerySchema,
} from '../validators/operational.validator';

export class OperationalController {
  static async getStores(_req: Request, res: Response, next: NextFunction) {
    try {
      const stores = await StoreService.getAllStores();
      return ApiResponse.success({
        res,
        message: 'Stores retrieved successfully',
        data: stores,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSales(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const filters = salesQuerySchema.parse(req.query);

      const store = await StoreService.getStoreById(storeId);
      if (!store) {
        throw new NotFoundError(`Store '${storeId}' not found`);
      }

      const result = await SalesService.getStoreSales(storeId, filters);
      return ApiResponse.success({
        res,
        message: `Daily sales retrieved for store ${storeId}`,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const filters = inventoryQuerySchema.parse(req.query);

      const store = await StoreService.getStoreById(storeId);
      if (!store) {
        throw new NotFoundError(`Store '${storeId}' not found`);
      }

      const result = await InventoryService.getStoreInventory(storeId, filters);
      return ApiResponse.success({
        res,
        message: `Inventory retrieved for store ${storeId}`,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getWastage(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const filters = wastageQuerySchema.parse(req.query);

      const store = await StoreService.getStoreById(storeId);
      if (!store) {
        throw new NotFoundError(`Store '${storeId}' not found`);
      }

      const result = await WastageService.getStoreWastage(storeId, filters);
      return ApiResponse.success({
        res,
        message: `Wastage records retrieved for store ${storeId}`,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPurchaseOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const filters = purchaseOrderQuerySchema.parse(req.query);

      const store = await StoreService.getStoreById(storeId);
      if (!store) {
        throw new NotFoundError(`Store '${storeId}' not found`);
      }

      const result = await PurchaseOrderService.getStorePurchaseOrders(storeId, filters);
      return ApiResponse.success({
        res,
        message: `Purchase orders retrieved for store ${storeId}`,
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }
}
