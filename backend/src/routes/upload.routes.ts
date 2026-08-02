import { Router } from 'express';
import {
  uploadImage,
  uploadPdf,
  uploadVideo,
  uploadMultiple,
  uploadAnyFile,
  deleteFileByKey,
  streamFileFromR2,
} from '../controllers/upload.controller';
import {
  uploadSingleImageMiddleware,
  uploadSinglePdfMiddleware,
  uploadSingleVideoMiddleware,
  uploadMultipleMiddleware,
  upload,
  handleMulterError,
} from '../middlewares/upload.middleware';
import { protectOptional } from '../middlewares/authMiddleware';

const router = Router();

// Optional authentication so users/guests/teachers can upload assets according to system rules
router.use(protectOptional);

/**
 * GET /upload/file/:key
 * Stream public file from R2 storage
 */
router.get('/file/:key', streamFileFromR2);

/**
 * POST /upload/image
 * Upload single image file (JPG, PNG, WEBP, SVG)
 */
router.post('/image', uploadSingleImageMiddleware, handleMulterError, uploadImage);

/**
 * POST /upload/pdf
 * POST /upload/document
 * POST /upload/application-doc
 * Upload single document file (PDF, DOC, DOCX)
 */
router.post('/pdf', uploadSinglePdfMiddleware, handleMulterError, uploadPdf);
router.post('/document', uploadSinglePdfMiddleware, handleMulterError, uploadPdf);
router.post('/application-doc', uploadSinglePdfMiddleware, handleMulterError, uploadPdf);

/**
 * POST /upload/video
 * Upload single video file (MP4, MOV, AVI)
 */
router.post('/video', uploadSingleVideoMiddleware, handleMulterError, uploadVideo);

/**
 * POST /upload/multiple
 * Upload array of files
 */
router.post('/multiple', uploadMultipleMiddleware, handleMulterError, uploadMultiple);

/**
 * POST /upload/file
 * Upload any file type (image, video, document, audio, archive) max 100MB
 * Used for chat attachments — stored in Cloudflare R2
 */
router.post('/file', upload.single('file'), handleMulterError, uploadAnyFile);

/**
 * DELETE /upload/:key, DELETE /upload
 * Delete file from R2 bucket by object key
 */
router.delete('/:key', deleteFileByKey);
router.delete('/', deleteFileByKey);

export default router;
