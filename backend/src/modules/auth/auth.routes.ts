import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { protect } from '../../middlewares/authMiddleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  updateProfileSchema,
  changePasswordSchema,
  updateAvatarSchema,
} from './auth.validation';
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  getCurrentUser,
  updateProfile,
  changePassword,
  updateAvatar,
} from './auth.controller';

const router = Router();

// Login Rate Limiter (to protect login endpoint from brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 failed login attempts per windowMs
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Public Authentication Routes
 */
router.post('/register', validationMiddleware({ body: registerSchema }), register);
router.post('/login', loginLimiter, validationMiddleware({ body: loginSchema }), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', validationMiddleware({ body: forgotPasswordSchema }), forgotPassword);
router.post('/reset-password', validationMiddleware({ body: resetPasswordSchema }), resetPassword);
router.post('/verify-email', validationMiddleware({ body: verifyEmailSchema }), verifyEmail);
router.post('/resend-verification', validationMiddleware({ body: forgotPasswordSchema }), resendVerification);

/**
 * Authenticated Profile & Session Routes
 */
router.get('/me', protect, getCurrentUser);
router.patch('/profile', protect, validationMiddleware({ body: updateProfileSchema }), updateProfile);
router.patch('/change-password', protect, validationMiddleware({ body: changePasswordSchema }), changePassword);
router.patch('/avatar', protect, validationMiddleware({ body: updateAvatarSchema }), updateAvatar);

export default router;
