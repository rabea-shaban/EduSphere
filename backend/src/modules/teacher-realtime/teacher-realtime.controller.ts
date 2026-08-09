import { Request, Response } from 'express';
import Message from '../messages/message.model';
import Conversation from '../conversations/conversation.model';
import { getTeacherNamespace } from './teacher-realtime.socket';

export const teacherRealtimeController = {
  // Send message idempotently
  sendMessage: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id.toString();
      const { conversationId, recipientId, text, clientMessageId } = req.body;

      if (!conversationId || !recipientId || !text || !clientMessageId) {
        res.status(400).json({ success: false, message: 'Missing required message parameters' });
        return;
      }

      // Idempotency check: Return existing message if clientMessageId already processed
      const existingMessage = await Message.findOne({
        conversationId,
        senderId: userId,
        clientMessageId,
      });

      if (existingMessage) {
        res.status(200).json({ success: true, data: existingMessage });
        return;
      }

      // Authorize membership
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
      });

      if (!conversation) {
        res.status(403).json({ success: false, message: 'Unauthorized conversation access' });
        return;
      }

      const newMessage = await Message.create({
        conversationId,
        senderId: userId,
        message: text,
        clientMessageId,
        status: 'sent',
      });

      // Emit to V2 realtime namespace
      const teacherNamespace = getTeacherNamespace();
      teacherNamespace?.to(`teacher-user:${recipientId}`).emit('teacher:message:new', newMessage);
      teacherNamespace?.to(`teacher-user:${userId}`).emit('teacher:message:new', newMessage);

      res.status(201).json({ success: true, data: newMessage });
    } catch (err: any) {
      console.error('[TEACHER_REALTIME][SEND_MESSAGE_ERROR]', err);
      res.status(500).json({ success: false, message: 'Failed to process message' });
    }
  },
};
