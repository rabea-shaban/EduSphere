import { Router } from 'express';
import { protect } from '../../middlewares/authMiddleware';
import { validationMiddleware } from '../../middlewares/validationMiddleware';
import { userIdSchema } from '../users/user.validation';
import { createConversationSchema } from './conversation.validation';
import {
  createConversation,
  createGroupConversation,
  leaveGroupConversation,
  deleteGroupConversation,
  clearConversationMessages,
  getMyConversations,
  getConversationDetails,
  getEnrolledContacts,
  searchUsersForChat,
  getAssignableUsers,
  searchConversations,
  initiateCallSignal,
  pollCallSignal,
  respondCallSignal,
  heartbeat,
} from './conversation.controller';

const router = Router();

router.use(protect);

router.post('/call/initiate', initiateCallSignal);
router.get('/call/poll', pollCallSignal);
router.post('/call/respond', respondCallSignal);
router.post('/heartbeat', heartbeat);

router.post('/', validationMiddleware({ body: createConversationSchema }), createConversation);
router.post('/group', createGroupConversation);
router.patch('/:id/leave', leaveGroupConversation);
router.delete('/:id/group', deleteGroupConversation);
router.delete('/:id/clear', clearConversationMessages);
router.get('/contacts', getEnrolledContacts);
router.get('/users', getAssignableUsers);
router.get('/search', searchConversations);
router.get('/search-users', searchUsersForChat);
router.get('/', getMyConversations);
router.get('/:id', validationMiddleware({ params: userIdSchema }), getConversationDetails);

export default router;
