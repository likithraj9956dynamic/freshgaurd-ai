import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { NotFoundError } from './utils/errors';
import { loadDatasets } from './services/datasetLoader';

// Ensure BigInt values serialize properly in JSON responses
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const createApp = (): Application => {
  // Pre-load CSV datasets if available
  try {
    loadDatasets();
  } catch (err) {
    console.warn('[FreshGuard AI] Note on dataset pre-loading:', err);
  }

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

  // 404 Handler
  app.use((req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};

export default createApp();
