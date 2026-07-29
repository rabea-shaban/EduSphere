import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { catchAsync } from '../utils/catchAsync';
import User from '../modules/users/user.model';
import { IAccessTokenPayload } from '../modules/auth/auth.interface';

// Declare custom property on Express Request namespace
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to protect routes and ensure user authentication via JWT.
 * Optimized with lean projections for ultra-fast response times.
 */
export const protect = catchAsync(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // 1. Extract token from Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Authentication token missing. Please log in.');
  }

  // 2. Verify token signature and expiration
  let decoded: IAccessTokenPayload;
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jwt_access_secret_key_change_me'
    ) as IAccessTokenPayload;
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token. Please log in again.');
  }

  // 3. Find user with lean projection for instant authentication
  const user = await User.findById(decoded.userId)
    .select('firstName lastName email username role isBlocked avatar')
    .lean();

  if (!user) {
    throw new ApiError(401, 'User belonging to this token no longer exists.');
  }

  if (user.isBlocked) {
    throw new ApiError(403, 'Your account is blocked. Please contact support.');
  }

  // 4. Attach user instance to request object
  req.user = user;
  next();
});

/**
 * Middleware to restrict access based on user roles.
 */
export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'Access denied. You do not have permission to perform this action.');
    }
    next();
  };
};

export const authMiddleware = protect;
