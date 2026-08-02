"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.ApiError = void 0;
/**
 * Custom error class for standardized API errors.
 */
class ApiError extends Error {
    statusCode;
    errorCode;
    details;
    isOperational;
    constructor(statusCode, message, errorCode = "ERROR", details, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        this.isOperational = true;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
class ValidationError extends ApiError {
    constructor(message = "بيانات المدخلات غير صحيحة", details) {
        super(422, message, "VALIDATION_ERROR", details);
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends ApiError {
    constructor(message = "يرجى تسجيل الدخول للوصول لهذه الخدمة") {
        super(401, message, "UNAUTHENTICATED");
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends ApiError {
    constructor(message = "ليس لديك الصلاحية الكافية لتنفيذ هذا الإجراء") {
        super(403, message, "UNAUTHORIZED");
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends ApiError {
    constructor(message = "المورد المطلوب غير موجود") {
        super(404, message, "NOT_FOUND");
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends ApiError {
    constructor(message = "توجد مواجهة أو بيانات مكررة بالخادم") {
        super(409, message, "CONFLICT");
    }
}
exports.ConflictError = ConflictError;
