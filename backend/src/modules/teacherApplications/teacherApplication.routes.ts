import { Router } from 'express';
import { protect, protectOptional, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import {
  createTeacherApplicationSchema,
  saveDraftApplicationSchema,
  updateApplicationStatusSchema,
  approveApplicationSchema,
  rejectApplicationSchema,
  requestChangesSchema,
} from './teacherApplication.validation';
import {
  submitApplication,
  getMyApplication,
  updateMyApplication,
  deleteMyApplication,
  checkStatusByQuery,
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  requestChanges,
  updateApplicationStatus,
  deleteApplication,
  bulkApproveApplications,
  bulkRejectApplications,
} from './teacherApplication.controller';

const router = Router();

// ─── Public endpoints ─────────────────────────────────────────────────────────
router.post('/check-status', checkStatusByQuery);
router.get('/check-status', checkStatusByQuery);

// ─── Teacher-facing endpoints (Optional or Authenticated) ──────────────────────
// POST /teacher/apply → submit or save draft (protectOptional allows guest + auth submission)
router.post('/', protectOptional, validationMiddleware({ body: createTeacherApplicationSchema }), submitApplication);
// Save draft (relaxed validation)
router.post('/draft', protectOptional, validationMiddleware({ body: saveDraftApplicationSchema }), submitApplication);
// GET own application status
router.get('/my-application', protect, getMyApplication);
// Legacy alias
router.get('/my-status', protect, getMyApplication);
// Update own application (edit Draft / NeedsChanges / Rejected)
router.put('/my-application', protect, updateMyApplication);
// Delete own draft
router.delete('/my-application', protect, deleteMyApplication);

// ─── Admin-only endpoints ─────────────────────────────────────────────────────
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/', getAllApplications);
router.post('/bulk-approve', bulkApproveApplications);
router.post('/bulk-reject', bulkRejectApplications);

router.get('/:id', validationMiddleware({ params: userIdSchema }), getApplicationById);

// Separate action endpoints (enterprise style)
router.patch('/:id/approve', validationMiddleware({ params: userIdSchema, body: approveApplicationSchema }), approveApplication);
router.patch('/:id/reject', validationMiddleware({ params: userIdSchema, body: rejectApplicationSchema }), rejectApplication);
router.patch('/:id/request-changes', validationMiddleware({ params: userIdSchema, body: requestChangesSchema }), requestChanges);

// Generic status update (backward compat)
router.patch('/:id/status', validationMiddleware({ params: userIdSchema, body: updateApplicationStatusSchema }), updateApplicationStatus);

router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteApplication);

export default router;
