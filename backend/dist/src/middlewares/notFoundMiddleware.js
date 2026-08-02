"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
/**
 * Middleware to handle unmatched routes (404 errors).
 */
const notFoundMiddleware = (req, _res, next) => {
    next(new ApiError_1.ApiError(404, `Route not found - ${req.method} ${req.originalUrl}`));
};
exports.notFoundMiddleware = notFoundMiddleware;
