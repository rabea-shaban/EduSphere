import multer from 'multer';
import { FILE_SIZE_LIMITS } from '../utils/fileValidator';
import { ApiError } from '../utils/ApiError';

/**
 * Multer Memory Storage Configuration
 * Files are kept purely in memory buffers and streamed directly to Cloudflare R2.
 * No files are ever saved to local disk.
 */
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE_LIMITS.VIDEO, // Max 500MB ceiling
  },
});

/**
 * Express Middleware Wrappers with Multer error handling
 */
export const uploadSingleImageMiddleware = upload.single('file');
export const uploadSinglePdfMiddleware = upload.single('file');
export const uploadSingleVideoMiddleware = upload.single('file');
export const uploadMultipleMiddleware = upload.array('files', 10);

/**
 * Helper error handler middleware for Multer errors
 */
export function handleMulterError(err: any, _req: any, _res: any, next: any) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new ApiError(400, 'File size exceeds maximum allowed upload limit'));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new ApiError(400, `Unexpected field: ${err.field}. Please use 'file' or 'files'`));
    }
    return next(new ApiError(400, `Upload error: ${err.message}`));
  }
  next(err);
}

export default {
  upload,
  uploadSingleImageMiddleware,
  uploadSinglePdfMiddleware,
  uploadSingleVideoMiddleware,
  uploadMultipleMiddleware,
  handleMulterError,
};
