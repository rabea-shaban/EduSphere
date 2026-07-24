import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createTestimonialSchema, updateTestimonialSchema } from './testimonial.validation';
import { createTestimonial, getAllTestimonials, updateTestimonial, approveTestimonial, deleteTestimonial } from './testimonial.controller';

const router = Router();

router.get('/', getAllTestimonials);

router.use(protect);
router.post('/', validationMiddleware({ body: createTestimonialSchema }), createTestimonial);

router.use(restrictTo('SUPER_ADMIN', 'ADMIN'));
router.patch('/:id/approve', validationMiddleware({ params: userIdSchema }), approveTestimonial);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateTestimonialSchema }), updateTestimonial);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteTestimonial);

export default router;
