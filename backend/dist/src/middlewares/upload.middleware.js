"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleMiddleware = exports.uploadSingleVideoMiddleware = exports.uploadSinglePdfMiddleware = exports.uploadSingleImageMiddleware = exports.upload = void 0;
exports.handleMulterError = handleMulterError;
const multer_1 = __importDefault(require("multer"));
const fileValidator_1 = require("../utils/fileValidator");
const ApiError_1 = require("../utils/ApiError");
/**
 * Multer Memory Storage Configuration
 * Files are kept purely in memory buffers and streamed directly to Cloudflare R2.
 * No files are ever saved to local disk.
 */
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: fileValidator_1.FILE_SIZE_LIMITS.VIDEO, // Max 500MB ceiling
    },
});
/**
 * Express Middleware Wrappers with Multer error handling
 */
exports.uploadSingleImageMiddleware = exports.upload.single('file');
exports.uploadSinglePdfMiddleware = exports.upload.single('file');
exports.uploadSingleVideoMiddleware = exports.upload.single('file');
exports.uploadMultipleMiddleware = exports.upload.array('files', 10);
/**
 * Helper error handler middleware for Multer errors
 */
function handleMulterError(err, _req, _res, next) {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new ApiError_1.ApiError(400, 'File size exceeds maximum allowed upload limit'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new ApiError_1.ApiError(400, `Unexpected field: ${err.field}. Please use 'file' or 'files'`));
        }
        return next(new ApiError_1.ApiError(400, `Upload error: ${err.message}`));
    }
    next(err);
}
exports.default = {
    upload: exports.upload,
    uploadSingleImageMiddleware: exports.uploadSingleImageMiddleware,
    uploadSinglePdfMiddleware: exports.uploadSinglePdfMiddleware,
    uploadSingleVideoMiddleware: exports.uploadSingleVideoMiddleware,
    uploadMultipleMiddleware: exports.uploadMultipleMiddleware,
    handleMulterError,
};
