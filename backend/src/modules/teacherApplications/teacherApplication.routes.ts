import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import {
  createTeacherApplicationSchema,
  updateApplicationStatusSchema,
} from './teacherApplication.validation';
import {
  submitApplication,
  getMyApplicationStatus,
  checkStatusByQuery,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  bulkApproveApplications,
  bulkRejectApplications,
} from './teacherApplication.controller';

const router = Router();

// Public endpoints - anyone can apply or check status
router.post('/', validationMiddleware({ body: createTeacherApplicationSchema }), submitApplication);
router.post('/check-status', checkStatusByQuery);
router.get('/check-status', checkStatusByQuery);
router.get('/my-status', protect, getMyApplicationStatus);

// Admin endpoints
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/', getAllApplications);
router.post('/bulk-approve', bulkApproveApplications);
router.post('/bulk-reject', bulkRejectApplications);

router.get('/:id', validationMiddleware({ params: userIdSchema }), getApplicationById);
router.patch('/:id/status', validationMiddleware({ params: userIdSchema, body: updateApplicationStatusSchema }), updateApplicationStatus);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteApplication);

export default router;
