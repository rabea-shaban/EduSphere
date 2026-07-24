import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createConversationSchema } from './conversation.validation';
import {
  createConversation,
  getMyConversations,
  getConversationDetails,
} from './conversation.controller';

const router = Router();

router.use(protect);

router.post('/', validationMiddleware({ body: createConversationSchema }), createConversation);
router.get('/', getMyConversations);
router.get('/:id', validationMiddleware({ params: userIdSchema }), getConversationDetails);

export default router;
