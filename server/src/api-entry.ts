import type { Request, Response } from 'express';
import app from './app';

export default function handler(req: Request, res: Response) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('Serverless execution error:', err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: err?.message || 'Server error occurred',
      });
    }
  }
}
