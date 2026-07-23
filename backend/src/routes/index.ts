import { Router, Request, Response } from 'express';
import userRoutes from '../modules/users/user.routes';
import authRoutes from '../modules/auth/auth.routes';
import academicYearRoutes from '../modules/academicYears/academicYear.routes';
import gradeRoutes from '../modules/grades/grade.routes';
import termRoutes from '../modules/terms/term.routes';
import subjectRoutes from '../modules/subjects/subject.routes';

const router = Router();

/**
 * @route   GET /
 * @desc    Health Check / Sample Route
 * @access  Public
 */
router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'EduSphere Backend Running Successfully',
  });
});

// Authentication Routes
router.use('/auth', authRoutes);

// User Module Routes
router.use('/users', userRoutes);

// Academic Structure Routes
router.use('/academic-years', academicYearRoutes);
router.use('/grades', gradeRoutes);
router.use('/terms', termRoutes);
router.use('/subjects', subjectRoutes);

export default router;
