import api from '@/services/api';
import { TeacherChatMessage } from '../types/teacher-realtime.types';

export const teacherChatService = {
  sendMessage: async (payload: {
    conversationId: string;
    recipientId: string;
    text: string;
    clientMessageId: string;
  }): Promise<TeacherChatMessage> => {
    const response = await api.post('/teacher-realtime/messages', payload);
    return response.data?.data;
  },
};
