import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Authentication Middleware (Skeleton to be implemented in Sprint 2).
 */
export const authMiddleware: RequestHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Skeleton to be updated with JWT validation and role checking.
  next();
};
