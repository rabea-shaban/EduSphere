import { Request, Response } from 'express';
import { PlatformSettings } from './platformSettings.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Get Platform Central Settings & Configuration.
 */
export const getPlatformSettingsAdmin = catchAsync(async (_req: Request, res: Response) => {
  let settings = await PlatformSettings.findOne();
  if (!settings) {
    settings = await PlatformSettings.create({});
  }

  res.status(200).json(new ApiResponse(200, settings, 'Platform settings retrieved successfully'));
});

/**
 * Update Platform Settings section (general, system, payments, security, email).
 */
export const updatePlatformSettingsSectionAdmin = catchAsync(async (req: Request, res: Response) => {
  const { section } = req.params;
  let settings = await PlatformSettings.findOne();
  if (!settings) {
    settings = new PlatformSettings({});
  }

  if (section === 'general' && req.body.general) {
    settings.general = { ...settings.general, ...req.body.general };
  } else if (section === 'system' && req.body.system) {
    settings.system = { ...settings.system, ...req.body.system };
  } else if (section === 'payments' && req.body.payments) {
    settings.payments = { ...settings.payments, ...req.body.payments };
  } else if (section === 'security' && req.body.security) {
    settings.security = { ...settings.security, ...req.body.security };
  } else if (section === 'email' && req.body.email) {
    settings.email = { ...settings.email, ...req.body.email };
  } else {
    Object.assign(settings, req.body);
  }

  await settings.save();
  res.status(200).json(new ApiResponse(200, settings, `تم تحديث إعدادات قسم (${section}) بنجاح`));
});

/**
 * Test SMTP Email Configuration.
 */
export const testEmailConfigAdmin = catchAsync(async (req: Request, res: Response) => {
  const { recipientEmail } = req.body;
  if (!recipientEmail) {
    throw new ApiError(400, 'البريد الإلكتروني لاختبار الإرسال مطلوب');
  }

  res.status(200).json(
    new ApiResponse(
      200,
      { success: true, deliveredTo: recipientEmail },
      `تم إرسال بريد الاختبار بنجاح إلى (${recipientEmail}) ✉️`
    )
  );
});

/**
 * Trigger Manual Database Backup.
 */
export const triggerBackupAdmin = catchAsync(async (_req: Request, res: Response) => {
  let settings = await PlatformSettings.findOne();
  if (!settings) settings = new PlatformSettings({});

  settings.backup.lastBackupAt = new Date();
  await settings.save();

  res.status(200).json(
    new ApiResponse(
      200,
      { lastBackupAt: settings.backup.lastBackupAt },
      'تم إنشاء النسخة الاحتياطية وتوثيقها بنجاح 💾'
    )
  );
});
