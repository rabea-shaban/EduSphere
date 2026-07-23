import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../users/user.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';
import { IAccessTokenPayload, IRefreshTokenPayload } from './auth.interface';

// Token generation helpers
const generateAccessToken = (payload: IAccessTokenPayload): string => {
  const secret: jwt.Secret = process.env.JWT_SECRET || 'jwt_access_secret_key_change_me';
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES || '1d') as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ ...payload }, secret, options);
};

const generateRefreshToken = (payload: IRefreshTokenPayload): string => {
  const secret: jwt.Secret = process.env.REFRESH_SECRET || 'jwt_refresh_secret_key_change_me';
  const options: jwt.SignOptions = {
    expiresIn: (process.env.REFRESH_EXPIRES || '7d') as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ ...payload }, secret, options);
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching REFRESH_EXPIRES
  });
};

const clearRefreshTokenCookie = (res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
  });
};

// Crypto token helpers for verify/reset flows
const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Register a new user.
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const { username, email, phone } = req.body;

  // 1. Check uniqueness
  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }, { phone }],
  });

  if (existingUser) {
    if (existingUser.username === username.toLowerCase()) {
      throw new ApiError(400, 'Username is already taken');
    }
    if (existingUser.email === email.toLowerCase()) {
      throw new ApiError(400, 'Email address is already in use');
    }
    if (existingUser.phone === phone) {
      throw new ApiError(400, 'Phone number is already registered');
    }
  }

  // 2. Generate email verification token
  const rawVerificationToken = generateRandomToken();
  const verificationToken = hashToken(rawVerificationToken);
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // 3. Create the user
  const user = await User.create({
    ...req.body,
    isVerified: false, // Must verify email first
    verificationToken,
    verificationTokenExpires,
  });

  // 4. Generate JWT tokens
  const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  // 5. Store refresh token in user and DB
  user.refreshToken = refreshToken;
  await user.save();

  // 6. Set HTTP-only Cookie
  setRefreshTokenCookie(res, refreshToken);

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.verificationToken;
  delete userResponse.verificationTokenExpires;

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: userResponse,
        accessToken,
        refreshToken,
        verificationToken: rawVerificationToken, // Return raw token for testing/email placement
      },
      'Registration successful. Please verify your email.'
    )
  );
});

/**
 * Login handler.
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;

  // 1. Find user, explicitly selecting password and refreshToken
  const user = await User.findOne({
    $or: [
      { email: emailOrUsername.toLowerCase() },
      { username: emailOrUsername.toLowerCase() },
    ],
  }).select('+password +refreshToken');

  if (!user) {
    throw new ApiError(401, 'Invalid login credentials');
  }

  // 2. Check password matches
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid login credentials');
  }

  // 3. Assert account status checks
  if (user.isBlocked) {
    throw new ApiError(403, 'Your account is blocked. Please contact support.');
  }

  if (!user.isVerified) {
    throw new ApiError(401, 'Your email is not verified. Please verify your email first.');
  }

  // 4. Update last login
  user.lastLogin = new Date();

  // 5. Generate and store tokens
  const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  user.refreshToken = refreshToken;
  await user.save();

  // 6. Set HTTP-only Cookie
  setRefreshTokenCookie(res, refreshToken);

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userResponse,
        accessToken,
      },
      'Login successful'
    )
  );
});

/**
 * Logout handler.
 */
export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'jwt_refresh_secret_key_change_me') as IRefreshTokenPayload;
      // Invalidate token in DB
      await User.updateOne({ _id: decoded.userId }, { $unset: { refreshToken: 1 } });
    } catch {
      // Ignore token validation issues on logout, just continue to clear cookies
    }
  }

  clearRefreshTokenCookie(res);

  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

/**
 * Refresh access token handler.
 */
export const refresh = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Session expired. Please log in again.');
  }

  let decoded: IRefreshTokenPayload;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'jwt_refresh_secret_key_change_me') as IRefreshTokenPayload;
  } catch {
    throw new ApiError(401, 'Invalid or expired session. Please log in again.');
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || user.isBlocked || !user.isVerified || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Session invalid or user suspended.');
  }

  // Rotate tokens
  const newAccessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
  const newRefreshToken = generateRefreshToken({ userId: user._id.toString() });

  user.refreshToken = newRefreshToken;
  await user.save();

  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: newAccessToken,
      },
      'Token refreshed successfully'
    )
  );
});

/**
 * Request password reset token.
 */
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, 'No user found with that email address');
  }

  const rawResetToken = generateRandomToken();
  user.passwordResetToken = hashToken(rawResetToken);
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

  await user.save();

  // In a real application, email this link. For sprint validation, return it in payload.
  res.status(200).json(
    new ApiResponse(
      200,
      {
        resetToken: rawResetToken,
      },
      'Password reset token generated. Send this token to reset your password.'
    )
  );
});

/**
 * Reset password using token.
 */
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired password reset token');
  }

  // Update password and clear reset token fields
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined; // Force re-authentication on all devices
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password reset successful. Please log in with your new password.'));
});

/**
 * Verify Email verification token.
 */
export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: new Date() },
  }).setOptions({ withDeleted: true });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired email verification token');
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Email verified successfully. You can now log in.'));
});

/**
 * Resend email verification token.
 */
export const resendVerification = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(404, 'No user found with that email address');
  }

  if (user.isVerified) {
    throw new ApiError(400, 'This account is already verified');
  }

  const rawVerificationToken = generateRandomToken();
  user.verificationToken = hashToken(rawVerificationToken);
  user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await user.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        verificationToken: rawVerificationToken,
      },
      'Verification token resent successfully.'
    )
  );
});

/**
 * Get current logged in user details.
 */
export const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  // req.user is appended by auth protect middleware
  const user = req.user;
  res.status(200).json(new ApiResponse(200, user, 'Current user profile fetched successfully'));
});

/**
 * Update authenticated user profile.
 */
export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  const { phone } = req.body;
  if (phone && phone !== user.phone) {
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      throw new ApiError(400, 'Phone number is already registered by another account');
    }
  }

  // Update allowed profile fields
  Object.assign(user, req.body);
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json(new ApiResponse(200, userResponse, 'Profile updated successfully'));
});

/**
 * Change authenticated user password.
 */
export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    throw new ApiError(400, 'Incorrect current password');
  }

  user.password = newPassword;
  user.refreshToken = undefined; // Force logout everywhere
  await user.save();

  clearRefreshTokenCookie(res);

  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully. Please log in again.'));
});

/**
 * Update authenticated user avatar.
 */
export const updateAvatar = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  res.status(200).json(new ApiResponse(200, user, 'Avatar updated successfully'));
});
