import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createSectionSchema, updateSectionSchema, reorderSectionsSchema } from './section.validation';
import {
  getSectionsByCourse,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  archiveSection,
  restoreSection,
  duplicateSection,
  reorderSections,
  searchTeacherSections,
} from './section.controller';

const router = Router();

// ─── All section routes require authentication ────────────────────────────────
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER'));

// ─── Course-scoped section routes ────────────────────────────────────────────
// GET    /teacher/courses/:courseId/sections
router.get('/courses/:courseId/sections', getSectionsByCourse);

// POST   /teacher/courses/:courseId/sections
router.post(
  '/courses/:courseId/sections',
  validationMiddleware({ body: createSectionSchema }),
  createSection
);

// ─── Global section search ───────────────────────────────────────────────────
// GET    /teacher/sections  (search across teacher's own sections)
router.get('/sections', searchTeacherSections);

// ─── Bulk reorder (must come BEFORE /:id routes to avoid conflict) ───────────
// PATCH  /teacher/sections/reorder
router.patch(
  '/sections/reorder',
  validationMiddleware({ body: reorderSectionsSchema }),
  reorderSections
);

// ─── Individual section routes ───────────────────────────────────────────────
// GET    /teacher/sections/:id
router.get('/sections/:id', validationMiddleware({ params: userIdSchema }), getSectionById);

// PUT    /teacher/sections/:id  (full update)
router.put(
  '/sections/:id',
  validationMiddleware({ params: userIdSchema, body: updateSectionSchema }),
  updateSection
);

// PATCH  /teacher/sections/:id  (partial update)
router.patch(
  '/sections/:id',
  validationMiddleware({ params: userIdSchema, body: updateSectionSchema }),
  updateSection
);

// DELETE /teacher/sections/:id  (soft delete)
router.delete('/sections/:id', validationMiddleware({ params: userIdSchema }), deleteSection);

// PATCH  /teacher/sections/:id/archive
router.patch('/sections/:id/archive', validationMiddleware({ params: userIdSchema }), archiveSection);

// PATCH  /teacher/sections/:id/restore
router.patch('/sections/:id/restore', validationMiddleware({ params: userIdSchema }), restoreSection);

// POST   /teacher/sections/:id/duplicate
router.post(
  '/sections/:id/duplicate',
  validationMiddleware({ params: userIdSchema }),
  duplicateSection
);

export default router;
