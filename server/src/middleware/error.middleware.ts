import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';
import { ApiResponse } from '../utils/apiResponse';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Zod Validation Error
  if (err instanceof ZodError) {
    return ApiResponse.error({
      res,
      statusCode: 422,
      message: 'Validation failed',
      error: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Known Custom Operational Error
  if (err instanceof AppError) {
    return ApiResponse.error({
      res,
      statusCode: err.statusCode,
      message: err.message,
      error: err.details,
    });
  }

  // Unhandled / Internal Server Error
  console.error('Unhandled Error:', err);

  return ApiResponse.error({
    res,
    statusCode: 500,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};
