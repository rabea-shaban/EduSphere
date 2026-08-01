import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { updateProgressSchema } from './progress.validation';
import { updateProgress, getCourseProgress, getStudentAchievements, dailyCheckIn } from './progress.controller';

const router = Router();

// Progress tracking endpoints (requires student or admin/teacher authentication)
router.post('/', protect, validationMiddleware({ body: updateProgressSchema }), updateProgress);
router.get('/course/:courseId', protect, validationMiddleware({ params: userIdSchema }), getCourseProgress);

// Achievements & Gamification endpoints
router.get('/achievements', protect, getStudentAchievements);
router.post('/checkin', protect, dailyCheckIn);

export default router;
