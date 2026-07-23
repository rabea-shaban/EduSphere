import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { uploadResource } from '../../middlewares/uploadMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createResourceMetadataSchema } from './resource.validation';
import {
  uploadResourceFile,
  deleteResourceFile,
  getLessonResources,
} from './resource.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/lesson/:id', protect, validationMiddleware({ params: userIdSchema }), getLessonResources);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post(
  '/upload',
  uploadResource.single('file'),
  validationMiddleware({ body: createResourceMetadataSchema }),
  uploadResourceFile
);

router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteResourceFile);

export default router;
