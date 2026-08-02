"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * Custom error class for API errors.
 */
class ApiError extends Error {
    statusCode;
    errors;
    isOperational;
    constructor(statusCode, message, errors, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true; // Identifies known/operational errors vs system bugs
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
