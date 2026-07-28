import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  submitAssignment,
  updateSubmission,
  gradeSubmission,
  addSubmissionFeedback,
  getStudentSubmissions,
  getSubmissionById,
} from './submission.controller';

const router = Router();

router.use(protect);

// Student Submissions Routes
router.post('/', submitAssignment);
router.put('/:id', updateSubmission);
router.get('/history', getStudentSubmissions);

// Teacher & Admin Grading Routes
router.get('/teacher/submissions/:id', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'), getSubmissionById);
router.get('/:id', getSubmissionById);

router.patch(
  '/:id/grade',
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  gradeSubmission
);
router.patch(
  '/teacher/submissions/:id/grade',
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  gradeSubmission
);

router.patch(
  '/:id/feedback',
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  addSubmissionFeedback
);
router.patch(
  '/teacher/submissions/:id/feedback',
  restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'),
  addSubmissionFeedback
);

export default router;
