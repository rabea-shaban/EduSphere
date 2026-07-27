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
router.get('/cms/public', getCmsContentAdmin);

// Protected Admin Routes
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));

router.get('/cms', getCmsContentAdmin);
router.patch('/cms/:section', updateCmsSectionAdmin);

router.post('/faqs', addFaqAdmin);
router.delete('/faqs/:id', deleteFaqAdmin);

router.post('/testimonials', addTestimonialAdmin);
router.delete('/testimonials/:id', deleteTestimonialAdmin);

export default router;
