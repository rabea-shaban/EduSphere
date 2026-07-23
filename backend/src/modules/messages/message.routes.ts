import { Router } from 'express';
import Joi from 'joi';
import { protect } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { sendMessageSchema } from './message.validation';
import {
  sendMessage,
  markConversationSeen,
  getConversation,
} from './message.controller';

const router = Router();

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
const otherUserIdParamsSchema = Joi.object({
  otherUserId: Joi.string().pattern(mongoIdPattern).required().messages({
    'string.pattern.base': 'Invalid recipient user ID format',
  }),
});

router.use(protect);

router.post('/', validationMiddleware({ body: sendMessageSchema }), sendMessage);
router.patch('/:otherUserId/seen', validationMiddleware({ params: otherUserIdParamsSchema }), markConversationSeen);
router.get('/:otherUserId', validationMiddleware({ params: otherUserIdParamsSchema }), getConversation);

export default router;
