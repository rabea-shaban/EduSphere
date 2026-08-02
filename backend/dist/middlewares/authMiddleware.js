"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const catchAsync_1 = require("../utils/catchAsync");
const user_model_1 = __importDefault(require("../modules/users/user.model"));
/**
 * Middleware to protect routes and ensure user authentication via JWT.
 */
exports.protect = (0, catchAsync_1.catchAsync)(async (req, _res, next) => {
    let token;
    // 1. Extract token from Authorization header (Bearer token)
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        throw new ApiError_1.ApiError(401, 'Authentication token missing. Please log in.');
    }
    // 2. Verify token signature and expiration
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'jwt_access_secret_key_change_me');
    }
    catch (err) {
        throw new ApiError_1.ApiError(401, 'Invalid or expired token. Please log in again.');
    }
    // 3. Find user and check status flags
    const user = await user_model_1.default.findById(decoded.userId);
    if (!user) {
        throw new ApiError_1.ApiError(401, 'User belonging to this token no longer exists.');
    }
    if (user.isBlocked) {
        throw new ApiError_1.ApiError(403, 'Your account is blocked. Please contact support.');
    }
    // 4. Attach user instance to request object
    req.user = user;
    next();
});
/**
 * Middleware to restrict access based on user roles.
 *
 * @param roles - List of allowed roles.
 */
const restrictTo = (...roles) => {
    return (req, _res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError_1.ApiError(403, 'Access denied. You do not have permission to perform this action.');
        }
        next();
    };
};
exports.restrictTo = restrictTo;
/**
 * Authentication Middleware (Skeleton preserved from Sprint 1).
 */
exports.authMiddleware = exports.protect;
