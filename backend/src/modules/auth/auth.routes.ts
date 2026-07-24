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
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & profile management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, username, email, phone, password, role]
 *             properties:
 *               firstName: { type: string, example: Ahmed }
 *               lastName: { type: string, example: Ali }
 *               username: { type: string, example: ahmed_ali }
 *               email: { type: string, format: email, example: ahmed@example.com }
 *               phone: { type: string, example: '+201001234567' }
 *               password: { type: string, minLength: 6, example: secret123 }
 *               gender: { type: string, enum: [MALE, FEMALE, OTHER] }
 *               dateOfBirth: { type: string, format: date, example: '2000-01-15' }
 *               role: { type: string, enum: [SUPER_ADMIN, ADMIN, TEACHER, STUDENT, PARENT] }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email/username and password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emailOrUsername, password]
 *             properties:
 *               emailOrUsername: { type: string, example: ahmed@example.com }
 *               password: { type: string, example: secret123 }
 *     responses:
 *       200:
 *         description: Login successful, sets httpOnly cookie
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout and clear auth cookies
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token cookie
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: New access token issued
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email, example: ahmed@example.com }
 *     responses:
 *       200:
 *         description: Reset email sent
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token: { type: string }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Password reset successfully
 */

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email address using token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token]
 *             properties:
 *               token: { type: string }
 *     responses:
 *       200:
 *         description: Email verified successfully
 */

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Verification email resent
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /auth/profile:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               gender: { type: string, enum: [MALE, FEMALE, OTHER] }
 *               dateOfBirth: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     summary: Change current user password
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword, confirmPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string, minLength: 6 }
 *               confirmPassword: { type: string }
 *     responses:
 *       200:
 *         description: Password changed
 */

/**
 * @swagger
 * /auth/avatar:
 *   patch:
 *     summary: Update current user avatar URL
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [avatar]
 *             properties:
 *               avatar: { type: string, format: uri }
 *     responses:
 *       200:
 *         description: Avatar updated
 */

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
