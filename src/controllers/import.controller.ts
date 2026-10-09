import { Request, Response, NextFunction } from 'express';
import { ImportService } from '../services/import.service';
import { SeedService } from '../services/seed.service';
import { ApiResponse } from '../utils/apiResponse';
import { importPayloadSchema } from '../validators/operational.validator';

export class ImportController {
  static async importData(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = importPayloadSchema.parse(req.body);
      const result = await ImportService.processImport(validated);

      return ApiResponse.success({
        res,
        statusCode: result.status === 'failed' ? 400 : 200,
        message: `Import ${result.status} for dataset '${result.datasetType}'`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async seedDemoData(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SeedService.seedDemoData();
      return ApiResponse.success({
        res,
        message: 'Demo operational data seeded successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
