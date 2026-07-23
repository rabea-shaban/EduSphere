import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { uploadVideo } from '../../middlewares/uploadMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createVideoMetadataSchema, updateVideoMetadataSchema } from './video.validation';
import {
  uploadVideoFile,
  getAllVideos,
  getVideoById,
  updateVideoMetadata,
  deleteVideoFile,
  publishVideoFile,
} from './video.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllVideos);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getVideoById);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post(
  '/upload',
  uploadVideo.single('video'),
  validationMiddleware({ body: createVideoMetadataSchema }),
  uploadVideoFile
);

router.patch(
  '/:id',
  validationMiddleware({ params: userIdSchema, body: updateVideoMetadataSchema }),
  updateVideoMetadata
);

router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteVideoFile);
router.patch('/:id/publish', validationMiddleware({ params: userIdSchema }), publishVideoFile);

export default router;
