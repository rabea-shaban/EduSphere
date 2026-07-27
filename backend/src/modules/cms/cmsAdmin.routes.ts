import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import {
  getCmsContentAdmin,
  updateCmsSectionAdmin,
  addFaqAdmin,
  deleteFaqAdmin,
  addTestimonialAdmin,
  deleteTestimonialAdmin,
} from './cmsAdmin.controller';

const router = Router();

// Public endpoint to read CMS for landing page
router.get('/public', getCmsContentAdmin);
router.get('/cms/public', getCmsContentAdmin);

// Protected Admin Middleware for below routes
const adminAuth = [protect, restrictTo('SUPER_ADMIN', 'ADMIN')];

router.get('/cms', adminAuth, getCmsContentAdmin);
router.get('/', adminAuth, getCmsContentAdmin);
router.patch('/cms/:section', adminAuth, updateCmsSectionAdmin);
router.patch('/:section', adminAuth, updateCmsSectionAdmin);

router.post('/faqs', adminAuth, addFaqAdmin);
router.delete('/faqs/:id', adminAuth, deleteFaqAdmin);

router.post('/testimonials', adminAuth, addTestimonialAdmin);
router.delete('/testimonials/:id', adminAuth, deleteTestimonialAdmin);

export default router;
