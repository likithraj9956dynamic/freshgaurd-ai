import { Request, Response, NextFunction } from 'express';
import { BriefingService } from '../services/ai/briefing.service';
import { ApiResponse } from '../utils/apiResponse';
import { generateBriefingSchema } from '../validators/briefing.validator';
import path from 'path';
import fs from 'fs';
import { NotFoundError } from '../utils/errors';

export class BriefingController {
  static async getLatestBriefing(_req: Request, res: Response, next: NextFunction) {
    try {
      const briefing = await BriefingService.getLatestBriefing();
      return ApiResponse.success({
        res,
        message: 'Latest executive audio briefing retrieved successfully',
        data: briefing,
      });
    } catch (error) {
      next(error);
    }
  }

  static async generateBriefing(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = generateBriefingSchema.parse(req.body);
      const briefing = await BriefingService.generateBriefing(validated);

      return ApiResponse.success({
        res,
        statusCode: 201,
        message: 'Executive briefing generated with speech synthesis & audio caching',
        data: briefing,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAudioStream(req: Request, res: Response, next: NextFunction) {
    try {
      const { filename } = req.params;
      const safeFilename = path.basename(filename);
      const filePath = path.join(process.cwd(), 'public', 'audio', 'cache', safeFilename);

      if (!fs.existsSync(filePath)) {
        throw new NotFoundError(`Audio file '${safeFilename}' not found in cache`);
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Accept-Ranges', 'bytes');
      return fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      next(error);
    }
  }
}
