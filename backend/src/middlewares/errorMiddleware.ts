import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Express middleware for global error handling.
 */
export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let error = err;

  // Convert non-ApiError errors to ApiError instances
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    let errors: any[] | undefined = undefined;

    // Handle Mongoose CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      statusCode = 400;
      message = `Invalid resource identifier: ${error.value}`;
    }
    // Handle Mongoose Duplicate Key Error
    else if (error.code === 11000) {
      statusCode = 400;
      const field = Object.keys(error.keyValue || {}).join(', ');
      message = `Duplicate field value entered for: ${field}. Please use another value.`;
    }
    // Handle Mongoose ValidationError
    else if (error.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation failed';
      errors = Object.values(error.errors || {}).map((el: any) => ({
        field: el.path,
        message: el.message,
      }));
    }
    // Handle Joi validation error (if thrown directly)
    else if (error.isJoi) {
      statusCode = 400;
      message = 'Validation failed';
      errors = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
    }
    // Handle JWT Signature errors
    else if (error.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid authentication token. Please log in again.';
    }
    // Handle JWT Expired errors
    else if (error.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Authentication token expired. Please log in again.';
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  // Environment-based response details
  const response = {
    success: false,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  // Log server-side issues (5xx errors)
  if (error.statusCode >= 500) {
    console.error('[Error] Server Error:', error);
  }

  res.status(error.statusCode).json(response);
};
