"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
/**
 * Express middleware for global error handling and exception management.
 */
const errorMiddleware = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    let error = err;
    if (!(error instanceof ApiError_1.ApiError)) {
        let statusCode = error.statusCode || 500;
        let message = error.message || 'Internal Server Error';
        let errorCode = 'SERVER_ERROR';
        let details = undefined;
        if (error.name === 'CastError') {
            statusCode = 400;
            errorCode = 'INVALID_ID';
            message = `معرف المورد غير صالح: ${error.value}`;
        }
        else if (error.code === 11000) {
            statusCode = 409;
            errorCode = 'DUPLICATE_KEY';
            const field = Object.keys(error.keyValue || {}).join(', ');
            message = `القيمة الإدخالية مكررة بالفعل للحقل: ${field}`;
        }
        else if (error.name === 'ValidationError') {
            statusCode = 422;
            errorCode = 'VALIDATION_ERROR';
            message = 'فشل التحقق من صحة المدخلات';
            details = Object.values(error.errors || {}).map((el) => ({
                field: el.path,
                message: el.message,
            }));
        }
        else if (error.isJoi) {
            statusCode = 422;
            errorCode = 'VALIDATION_ERROR';
            message = 'فشل التحقق من صحة البيانات';
            details = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));
        }
        else if (error.name === 'JsonWebTokenError') {
            statusCode = 401;
            errorCode = 'INVALID_TOKEN';
            message = 'رمز المصادقة غير صالح، يرجى إعادة تسجيل الدخول';
        }
        else if (error.name === 'TokenExpiredError') {
            statusCode = 401;
            errorCode = 'TOKEN_EXPIRED';
            message = 'انتهت جلسة الدخول، يرجى إعادة الدخول للحساب';
        }
        error = new ApiError_1.ApiError(statusCode, message, errorCode, details, err.stack);
    }
    const requestId = req.headers['x-request-id'] || `REQ-${Date.now()}`;
    const responsePayload = {
        success: false,
        message: error.message,
        errorCode: error.errorCode || 'ERROR',
        details: error.details || error.errors || [],
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        requestId,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };
    if (error.statusCode >= 500) {
        console.error(`[Global Error] RequestId: ${requestId} Path: ${req.originalUrl}`, error);
    }
    res.status(error.statusCode).json(responsePayload);
};
exports.errorMiddleware = errorMiddleware;
exports.default = exports.errorMiddleware;
