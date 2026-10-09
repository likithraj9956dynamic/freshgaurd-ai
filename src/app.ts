import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { NotFoundError } from './utils/errors';

// Ensure BigInt values serialize properly in JSON responses
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const createApp = (): Application => {
  const app = express();

  // Security & Utility Middlewares
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static Audio File Serving for Cached Briefings
  app.use('/audio', express.static(path.join(process.cwd(), 'public', 'audio')));

  // Logging Middleware (skip during tests)
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // API Routes
  app.use('/api/v1', apiRoutes);

  // Serve React Frontend Static Files in Production
  const clientDistPath = path.join(process.cwd(), 'client', 'dist');
  app.use(express.static(clientDistPath));

  // Catch-all route to serve the React SPA index.html for non-API routes
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/audio')) {
      return next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
    }
    const indexPath = path.join(clientDistPath, 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
      }
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};

export default createApp();
