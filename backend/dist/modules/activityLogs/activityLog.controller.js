"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLogs = exports.createLog = exports.logEvent = void 0;
const activityLog_model_1 = require("./activityLog.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const catchAsync_1 = require("../../utils/catchAsync");
/**
 * Utility function to write log entries to database.
 */
const logEvent = async (userId, action, category, details, req) => {
    try {
        await activityLog_model_1.ActivityLog.create({
            userId,
            action,
            category,
            details,
            ipAddress: req?.ip,
            userAgent: req?.headers['user-agent'],
        });
    }
    catch (error) {
        console.error('[ActivityLog] Failed to write event log:', error);
    }
};
exports.logEvent = logEvent;
/**
 * Create a new log entry manually (Admins only).
 */
exports.createLog = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const log = await activityLog_model_1.ActivityLog.create(req.body);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, log, 'Activity log written successfully'));
});
/**
 * Retrieve all logs (Admins only).
 * Supports search, filters by category/user/date-range, and pagination.
 */
exports.getAllLogs = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 20, category, userId, startDate, endDate } = req.query;
    const filter = {};
    if (category)
        filter.category = category;
    if (userId)
        filter.userId = userId;
    if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate)
            filter.createdAt.$gte = new Date(startDate);
        if (endDate)
            filter.createdAt.$lte = new Date(endDate);
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
exports.default = exports.getAllLogs;
