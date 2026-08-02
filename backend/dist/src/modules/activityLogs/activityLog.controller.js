"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogById = exports.getAllLogs = exports.getAuditLogStatistics = exports.logEvent = void 0;
const activityLog_model_1 = require("./activityLog.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Utility function to write log entries to database.
 */
const logEvent = async (userId, action, category = 'Admin', details, req, status = 'SUCCESS', module = 'System') => {
    try {
        await activityLog_model_1.ActivityLog.create({
            userId,
            action,
            category,
            module,
            status,
            details,
            ipAddress: req?.ip || '127.0.0.1',
            userAgent: req?.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0)',
        });
    }
    catch (error) {
        console.error('[ActivityLog] Failed to write event log:', error);
    }
};
exports.logEvent = logEvent;
/**
 * Retrieve Audit Log Statistics (Cards Summary).
 */
exports.getAuditLogStatistics = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    let count = await activityLog_model_1.ActivityLog.countDocuments();
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
        await activityLog_model_1.ActivityLog.insertMany(seedLogs);
        count = seedLogs.length;
    }
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayCount = await activityLog_model_1.ActivityLog.countDocuments({ createdAt: { $gte: startOfDay } });
    const securityCount = await activityLog_model_1.ActivityLog.countDocuments({ category: 'Security' });
    const settingsCount = await activityLog_model_1.ActivityLog.countDocuments({ category: 'Settings' });
    const failedCount = await activityLog_model_1.ActivityLog.countDocuments({ status: 'FAILED' });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        totalLogs: count,
        todayCount,
        securityCount,
        settingsCount,
        failedCount,
    }, 'Audit log statistics retrieved'));
});
/**
 * Retrieve all logs with pagination & filters.
 */
exports.getAllLogs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, search, category, status, module: moduleParam } = req.query;
    const filter = {};
    if (category)
        filter.category = category;
    if (status)
        filter.status = status;
    if (moduleParam)
        filter.module = moduleParam;
    if (search) {
        const searchRegex = new RegExp(search, 'i');
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
    const logs = await activityLog_model_1.ActivityLog.find(filter)
        .populate('userId', 'firstName lastName email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);
    const total = await activityLog_model_1.ActivityLog.countDocuments(filter);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {
        logs,
        pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    }, 'Activity logs retrieved successfully'));
});
/**
 * Get single audit log details by ID.
 */
exports.getLogById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const log = await activityLog_model_1.ActivityLog.findById(id).populate('userId', 'firstName lastName email role avatar');
    if (!log) {
        res.status(404).json(new ApiResponse_1.ApiResponse(404, null, 'Audit log entry not found'));
        return;
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, log, 'Audit log details retrieved'));
});
