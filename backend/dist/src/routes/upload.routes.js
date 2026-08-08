"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Optional authentication so users/guests/teachers can upload assets according to system rules
router.use(authMiddleware_1.protectOptional);
/**
 * GET /upload/file/:key
 * Stream public file from R2 storage
 */
router.get('/file/:key', upload_controller_1.streamFileFromR2);
/**
 * POST /upload/image
 * Upload single image file (JPG, PNG, WEBP, SVG)
 */
router.post('/image', upload_middleware_1.uploadSingleImageMiddleware, upload_middleware_1.handleMulterError, upload_controller_1.uploadImage);
/**
 * POST /upload/pdf
 * POST /upload/document
 * POST /upload/application-doc
 * Upload single document file (PDF, DOC, DOCX)
 */
router.post('/pdf', upload_middleware_1.uploadSinglePdfMiddleware, upload_middleware_1.handleMulterError, upload_controller_1.uploadPdf);
router.post('/document', upload_middleware_1.uploadSinglePdfMiddleware, upload_middleware_1.handleMulterError, upload_controller_1.uploadPdf);
router.post('/application-doc', upload_middleware_1.uploadSinglePdfMiddleware, upload_middleware_1.handleMulterError, upload_controller_1.uploadPdf);
/**
 * POST /upload/video
 * Upload single video file (MP4, MOV, AVI)
 */
router.post('/video', upload_middleware_1.uploadSingleVideoMiddleware, upload_middleware_1.handleMulterError, upload_controller_1.uploadVideo);
/**
 * POST /upload/multiple
 * Upload array of files
 */
router.post('/multiple', upload_middleware_1.uploadMultipleMiddleware, upload_middleware_1.handleMulterError, upload_controller_1.uploadMultiple);
/**
 * POST /upload, POST /upload/file
 * Upload any file type (image, video, document, audio, archive) max 100MB
 * Used for chat attachments — stored in Cloudflare R2
 */
router.post('/file', upload_middleware_1.upload.single('file'), upload_middleware_1.handleMulterError, upload_controller_1.uploadAnyFile);
router.post('/', upload_middleware_1.upload.single('file'), upload_middleware_1.handleMulterError, upload_controller_1.uploadAnyFile);
/**
 * DELETE /upload/:key, DELETE /upload
 * Delete file from R2 bucket by object key
 */
router.delete('/:key', upload_controller_1.deleteFileByKey);
router.delete('/', upload_controller_1.deleteFileByKey);
exports.default = router;
