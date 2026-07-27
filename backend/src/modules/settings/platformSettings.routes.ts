import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getPlatformSettingsAdmin,
  updatePlatformSettingsSectionAdmin,
  testEmailConfigAdmin,
  triggerBackupAdmin,
} from './platformSettings.controller';

const router = Router();

// Protect all routes to Super Admin & Admin
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/settings/platform', getPlatformSettingsAdmin);
router.patch('/settings/platform/:section', updatePlatformSettingsSectionAdmin);
router.post('/settings/platform/test-email', testEmailConfigAdmin);
router.post('/settings/platform/backup', triggerBackupAdmin);

export default router;
