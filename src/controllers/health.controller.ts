import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { prisma } from '../config/prisma';

export class HealthController {
  static async getHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      let dbStatus = 'unknown';
      try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
      } catch {
        dbStatus = 'disconnected';
      }

      return ApiResponse.success({
        res,
        message: 'FreshGuard AI Backend Service is operational',
        data: {
          status: 'healthy',
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
          database: dbStatus,
          version: '1.0.0',
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
