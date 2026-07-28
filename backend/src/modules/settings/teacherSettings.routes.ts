import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import {
  updateTeacherSettingsSchema,
  updateGeneralSettingsSchema,
  updateAppearanceSettingsSchema,
  updateNotificationSettingsSchema,
  updatePrivacySettingsSchema,
  updateSecuritySettingsSchema,
  confirmPasswordSchema,
} from './teacherSettings.validation';
import {
  getTeacherSettings,
  updateTeacherSettings,
  updateGeneralSettings,
  updateAppearanceSettings,
  updateNotificationSettings,
  updatePrivacySettings,
  updateSecuritySettings,
  getActiveSessions,
  revokeSession,
  logoutAllDevices,
  exportPersonalData,
  deactivateAccount,
  deleteAccount,
} from './teacherSettings.controller';

const router = Router();

// Protect all routes below with authentication and TEACHER/ADMIN role
router.use(protect);
router.use(restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'));

// Core Settings GET & Full PUT
router.get('/', getTeacherSettings);
router.put('/', validationMiddleware({ body: updateTeacherSettingsSchema }), updateTeacherSettings);

// Partial PATCH endpoints
router.patch('/general', validationMiddleware({ body: updateGeneralSettingsSchema }), updateGeneralSettings);
router.patch('/appearance', validationMiddleware({ body: updateAppearanceSettingsSchema }), updateAppearanceSettings);
router.patch('/notifications', validationMiddleware({ body: updateNotificationSettingsSchema }), updateNotificationSettings);
router.patch('/privacy', validationMiddleware({ body: updatePrivacySettingsSchema }), updatePrivacySettings);
router.patch('/security', validationMiddleware({ body: updateSecuritySettingsSchema }), updateSecuritySettings);

// Session Management
router.get('/sessions', getActiveSessions);
router.delete('/sessions/:id', revokeSession);
router.delete('/sessions', logoutAllDevices);

// Account Lifecycle & GDPR Data Export
router.post('/export-data', exportPersonalData);
router.post('/deactivate-account', validationMiddleware({ body: confirmPasswordSchema }), deactivateAccount);
router.post('/delete-account', validationMiddleware({ body: confirmPasswordSchema }), deleteAccount);

export default router;
