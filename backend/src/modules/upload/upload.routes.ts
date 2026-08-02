import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadImageFile,
  uploadVideoFile,
  uploadDocumentFile,
  uploadAnyFile,
  deleteFileAsset,
} from './upload.controller';
import { protect } from '../../middlewares/authMiddleware';

const router = Router();

const storage = multer.memoryStorage();

// 1. Image Upload Multer Configuration (Max 10MB)
const uploadImageMulter = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('نوع الصورة غير مدعوم (JPG, JPEG, PNG, WEBP, SVG)') as any, false);
    }
  },
});

// 2. Video Upload Multer Configuration (Max 500MB)
const uploadVideoMulter = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('نوع الفيديو غير مدعوم (MP4, MOV, AVI, WEBM)') as any, false);
    }
  },
});

// 3. Document Upload Multer Configuration (Max 25MB)
const uploadDocumentMulter = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.zip', '.rar'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || file.mimetype.includes('pdf') || file.mimetype.includes('officedocument') || file.mimetype.includes('zip')) {
      cb(null, true);
    } else {
      cb(new Error('نوع المستند غير مدعوم (PDF, DOCX, PPTX, XLSX, ZIP)') as any, false);
    }
  },
});

// 4. Any File Upload Multer Configuration (Max 100MB)
const uploadAnyMulter = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

/**
 * @route POST /api/v1/upload/image
 * @desc Upload single image file to Cloudflare R2
 */
router.post('/image', protect, uploadImageMulter.single('file'), uploadImageFile);

/**
 * @route POST /api/v1/upload/video
 * @desc Upload single video file to Cloudflare R2
 */
router.post('/video', protect, uploadVideoMulter.single('file'), uploadVideoFile);

/**
 * @route POST /api/v1/upload/application-doc
 * @desc Upload document for teacher application (public - no auth required)
 */
router.post('/application-doc', uploadDocumentMulter.single('file'), uploadDocumentFile);

/**
 * @route POST /api/v1/upload/document
 * @desc Upload single document file to Cloudflare R2
 */
router.post('/document', protect, uploadDocumentMulter.single('file'), uploadDocumentFile);

/**
 * @route POST /api/v1/upload/file
 * @desc Upload any file type (image, video, document, audio) to Cloudflare R2
 */
router.post('/file', protect, uploadAnyMulter.single('file'), uploadAnyFile);

/**
 * @route DELETE /api/v1/upload/:publicId
 * @desc Delete asset from Cloudflare R2
 */
router.delete('/:publicId', protect, deleteFileAsset);

export default router;
