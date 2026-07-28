import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { uploadResource } from '../../middlewares/uploadMiddleware';
import { fileQuerySchema, updateFileMetadataSchema } from './fileAsset.validation';
import {
  uploadSingleFile,
  uploadMultipleFiles,
  getTeacherFiles,
  getFileStats,
  getFileById,
  updateFileMetadata,
  deleteFile,
  restoreFile,
  downloadFile,
  previewFile,
} from './fileAsset.controller';

const router = Router();

// Protect all file management routes with JWT and role check
router.use(protect);
router.use(restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'));

// Upload Routes
router.post('/upload', uploadResource.single('file'), uploadSingleFile);
router.post('/upload-multiple', uploadResource.array('files', 10), uploadMultipleFiles);

// Storage Stats & List Queries
router.get('/stats', getFileStats);
router.get('/', validationMiddleware({ query: fileQuerySchema }), getTeacherFiles);

// Single File Resource Actions
router.get('/:id', getFileById);
router.patch('/:id', validationMiddleware({ body: updateFileMetadataSchema }), updateFileMetadata);
router.delete('/:id', deleteFile);
router.patch('/:id/restore', restoreFile);
router.get('/:id/download', downloadFile);
router.get('/:id/preview', previewFile);

export default router;
