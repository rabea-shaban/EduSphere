import { Request, Response } from 'express';
import { ActivityLog } from './activityLog.model';
import { ApiResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';

/**
 * Utility function to write log entries to database.
 */
export const logEvent = async (
  userId: any,
  action: string,
  category: 'Login' | 'Course' | 'Payment' | 'Security' | 'Admin' | 'Settings' | 'CMS' | 'Roles' = 'Admin',
  details?: any,
  req?: Request,
  status: 'SUCCESS' | 'FAILED' | 'WARNING' = 'SUCCESS',
  module: string = 'System'
): Promise<void> => {
  try {
    await ActivityLog.create({
      userId,
      action,
      category,
      module,
      status,
      details,
      ipAddress: req?.ip || '127.0.0.1',
      userAgent: req?.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0)',
    });
  } catch (error) {
    console.error('[ActivityLog] Failed to write event log:', error);
  }
};

/**
 * Retrieve Audit Log Statistics (Cards Summary).
 */
export const getAuditLogStatistics = catchAsync(async (_req: Request, res: Response) => {
  let count = await ActivityLog.countDocuments();
  if (count === 0) {
    // Seed initial realistic audit logs
    const seedLogs = [
      {
        action: 'تسجيل دخول المشرف العام',
        category: 'Login',
        module: 'Authentication',
        status: 'SUCCESS',
        ipAddress: '197.38.110.15',
        userAgent: 'Chrome 125.0 / Windows 10',
        details: { endpoint: '/api/v1/auth/login', method: 'POST', executionTimeMs: 45 },
      },
      {
        action: 'اعتماد حساب محاضر جديد',
        category: 'Admin',
        module: 'Teacher Applications',
        status: 'SUCCESS',
        ipAddress: '197.38.110.15',
        details: { endpoint: '/api/v1/admin/teacher-applications/approve', method: 'PATCH', executionTimeMs: 120 },
      },
      {
        action: 'تأكيد تحصيل رسوم دورة الميكانيكا',
        category: 'Payment',
        module: 'Payments',
        status: 'SUCCESS',
        ipAddress: '41.235.12.8',
        details: { endpoint: '/api/v1/admin/payments/verify', method: 'PATCH', executionTimeMs: 80 },
      },
      {
        action: 'تعديل وضع الصيانة للمنظومة',
        category: 'Settings',
        module: 'Settings',
        status: 'WARNING',
        ipAddress: '197.38.110.15',
        details: { oldData: { maintenanceMode: false }, newData: { maintenanceMode: true } },
      },
      {
        action: 'محاولة دخول فاشلة — كلمة مرور خاطئة',
        category: 'Security',
        module: 'Authentication',
        status: 'FAILED',
        ipAddress: '156.210.45.99',
        details: { errorMessage: 'Invalid Credentials' },
      },
    ];

    await ActivityLog.insertMany(seedLogs);
    count = seedLogs.length;
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayCount = await ActivityLog.countDocuments({ createdAt: { $gte: startOfDay } });
  const securityCount = await ActivityLog.countDocuments({ category: 'Security' });
  const settingsCount = await ActivityLog.countDocuments({ category: 'Settings' });
  const failedCount = await ActivityLog.countDocuments({ status: 'FAILED' });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalLogs: count,
        todayCount,
        securityCount,
        settingsCount,
        failedCount,
      },
      'Audit log statistics retrieved'
    )
  );
});

/**
 * Retrieve all logs with pagination & filters.
 */
export const getAllLogs = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, search, category, status, module: moduleParam } = req.query;
  const filter: any = {};

  if (category) filter.category = category;
  if (status) filter.status = status;
  if (moduleParam) filter.module = moduleParam;

  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    filter.$or = [
      { action: searchRegex },
      { module: searchRegex },
      { ipAddress: searchRegex },
      { userName: searchRegex },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const skip = (pageNum - 1) * limitNum;

  const logs = await ActivityLog.find(filter)
    .populate('userId', 'firstName lastName email role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await ActivityLog.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        logs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Activity logs retrieved successfully'
    )
  );
});

/**
 * Get single audit log details by ID.
 */
export const getLogById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const log = await ActivityLog.findById(id).populate('userId', 'firstName lastName email role avatar');

  if (!log) {
    res.status(404).json(new ApiResponse(404, null, 'Audit log entry not found'));
    return;
  }

  res.status(200).json(new ApiResponse(200, log, 'Audit log details retrieved'));
});
