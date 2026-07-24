import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createContactSchema, updateContactSchema } from './contact.validation';
import { submitContact, getAllContacts, getContactById, updateContactStatus } from './contact.controller';

const router = Router();

// Public submission
router.post('/', validationMiddleware({ body: createContactSchema }), submitContact);

// Admin queries management
router.use(protect, restrictTo('SUPER_ADMIN', 'ADMIN'));
router.get('/', getAllContacts);
router.get('/:id', validationMiddleware({ params: userIdSchema }), getContactById);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: updateContactSchema }), updateContactStatus);

export default router;
