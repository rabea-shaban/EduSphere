import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createFaqSchema, updateFaqSchema } from './faq.validation';
import { createFaq, getAllFaqs, getFaqById, updateFaq, deleteFaq } from './faq.controller';

const router = Router();

router.get('/', getAllFaqs);
router.get('/:id', getFaqById);

router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));
router.post('/', validationMiddleware({ body: createFaqSchema }), createFaq);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateFaqSchema }), updateFaq);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteFaq);

export default router;
