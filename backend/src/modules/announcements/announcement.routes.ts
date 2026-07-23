import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createAnnouncementSchema, updateAnnouncementSchema } from './announcement.validation';
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
} from './announcement.controller';

const router = Router();

// Read routes (authenticated users)
router.get('/', protect, getAllAnnouncements);
router.get('/:id', protect, validationMiddleware({ params: userIdSchema }), getAnnouncementById);

// Write routes (admins and teachers only)
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

router.post('/', validationMiddleware({ body: createAnnouncementSchema }), createAnnouncement);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateAnnouncementSchema }), updateAnnouncement);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteAnnouncement);
router.patch('/:id/publish', validationMiddleware({ params: userIdSchema }), publishAnnouncement);

export default router;
