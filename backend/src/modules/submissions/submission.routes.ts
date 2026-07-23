import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import {
  submitAssignmentSchema,
  updateSubmissionSchema,
  gradeSubmissionSchema,
} from './submission.validation';
import {
  submitAssignment,
  updateSubmission,
  gradeSubmission,
  getStudentSubmissions,
} from './submission.controller';

const router = Router();

// Student submission routes
router.post('/submit', protect, validationMiddleware({ body: submitAssignmentSchema }), submitAssignment);
router.patch('/:id', protect, validationMiddleware({ params: userIdSchema, body: updateSubmissionSchema }), updateSubmission);
router.get('/history', protect, getStudentSubmissions);

// Teacher grading routes
router.patch(
  '/:id/grade',
  protect,
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  validationMiddleware({ params: userIdSchema, body: gradeSubmissionSchema }),
  gradeSubmission
);

export default router;
