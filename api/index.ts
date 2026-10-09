import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/src/app';

// Vercel serverless handler — wraps the Express app
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Cast Vercel request/response to Express-compatible types and hand off
  return app(req as any, res as any);
}
