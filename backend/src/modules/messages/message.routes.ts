import { Router } from 'express';
import Joi from 'joi';
import { protect } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { sendMessageSchema, editMessageSchema } from './message.validation';
import {
  sendMessage,
  editMessage,
  deleteMessageForMe,
  deleteMessageForEveryone,
  markAsRead,
  getConversationMessages,
  toggleReaction,
  searchMessages,
} from './message.controller';

const router = Router();
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const conversationIdParamsSchema = Joi.object({
  conversationId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid conversation ID format',
  }),
});

router.use(protect);

router.post('/', validationMiddleware({ body: sendMessageSchema }), sendMessage);
router.post('/:id/reactions', toggleReaction);
router.patch('/read/:conversationId', validationMiddleware({ params: conversationIdParamsSchema }), markAsRead);
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: editMessageSchema }), editMessage);
router.delete('/:id/me', validationMiddleware({ params: userIdSchema }), deleteMessageForMe);
router.delete('/:id/everyone', validationMiddleware({ params: userIdSchema }), deleteMessageForEveryone);
router.get('/search/:conversationId', searchMessages);
router.get('/conversation/:conversationId', validationMiddleware({ params: conversationIdParamsSchema }), getConversationMessages);
router.get('/:conversationId', validationMiddleware({ params: conversationIdParamsSchema }), getConversationMessages);

export default router;
