import { Router } from 'express';
import Joi from 'joi';
import { protect } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { sendMessageSchema, editMessageSchema } from './message.validation';
import {
  sendMessage,
  editMessage,
  deleteMessage,
  markConversationSeen,
  getConversationMessages,
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
router.patch('/:id', validationMiddleware({ params: userIdSchema, body: editMessageSchema }), editMessage);
router.delete('/:id', validationMiddleware({ params: userIdSchema }), deleteMessage);
router.patch('/conversation/:conversationId/seen', validationMiddleware({ params: conversationIdParamsSchema }), markConversationSeen);
router.get('/conversation/:conversationId', validationMiddleware({ params: conversationIdParamsSchema }), getConversationMessages);

export default router;
