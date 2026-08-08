import api from "./api";
import { ChatParticipant, ChatMessage, ConversationItem } from "@/types/chat";

export type { ChatParticipant, ChatMessage, ConversationItem };

export interface GetConversationsResponse {
  conversations: ConversationItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetMessagesResponse {
  messages: ChatMessage[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const chatService = {
  // Search any user/student on the platform by name or phone
  searchUsers: async (query: string): Promise<ChatParticipant[]> => {
    if (!query || !query.trim()) return [];
    const response = await api.get("/conversations/search-users", {
      params: { q: query.trim() },
    });
    return response.data?.data?.users || [];
  },

  // Get enrolled contacts (teachers for student, students for teacher)
  getEnrolledContacts: async (): Promise<{ contacts: ChatParticipant[]; conversations: ConversationItem[] }> => {
    const response = await api.get("/conversations/contacts");
    return response.data?.data || { contacts: [], conversations: [] };
  },

  // Get all conversations for current user
  getConversations: async (): Promise<GetConversationsResponse> => {
    const response = await api.get("/conversations");
    const data = response.data?.data;
    if (Array.isArray(data)) {
      return { conversations: data };
    }
    return data || { conversations: [] };
  },

  // Create or retrieve existing 1-on-1 private conversation
  getOrCreateConversation: async (participantId: string, courseId?: string): Promise<ConversationItem> => {
    const response = await api.post("/conversations", {
      participants: [participantId],
      conversationType: "Private",
      courseId,
    });
    return response.data?.data;
  },

  // Create a new Group conversation
  createGroupConversation: async (
    title: string,
    participantIds: string[],
    description?: string
  ): Promise<ConversationItem> => {
    const response = await api.post("/conversations/group", {
      title,
      participants: participantIds,
      description,
    });
    return response.data?.data;
  },

  // Leave a group conversation
  leaveGroup: async (conversationId: string): Promise<void> => {
    await api.patch(`/conversations/${conversationId}/leave`);
  },

  // Delete a group conversation (admin only)
  deleteGroup: async (conversationId: string): Promise<void> => {
    await api.delete(`/conversations/${conversationId}/group`);
  },

  // Clear chat history for current user
  clearChat: async (conversationId: string): Promise<void> => {
    await api.delete(`/conversations/${conversationId}/clear`);
  },

  // Get message history for a conversation
  getMessages: async (conversationId: string, page: number = 1, limit: number = 100): Promise<GetMessagesResponse> => {
    const response = await api.get(`/messages/${conversationId}`, {
      params: { page, limit },
    });
    return response.data?.data || { messages: [] };
  },

  // Send a new message
  sendMessage: async (
    conversationId: string,
    message: string,
    messageType: "Text" | "Image" | "Video" | "Audio" | "Document" | "System" = "Text",
    attachments: string[] = [],
    replyTo?: string,
    clientMessageId?: string
  ): Promise<ChatMessage> => {
    // Auto-detect messageType from first attachment URL if not explicitly set
    let resolvedType = messageType;
    if (attachments.length > 0 && messageType === "Text") {
      const ext = attachments[0].split(".").pop()?.toLowerCase() || "";
      if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) resolvedType = "Image";
      else if (["mp4", "webm", "mov", "mkv", "avi"].includes(ext)) resolvedType = "Video";
      else if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext)) resolvedType = "Audio";
      else if (["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "zip", "rar", "txt"].includes(ext)) resolvedType = "Document";
    }

    const response = await api.post("/messages", {
      conversationId,
      message: message || "",
      messageType: resolvedType,
      attachments,
      replyTo,
      clientMessageId,
    });
    return response.data?.data;
  },

  // Mark all messages in a conversation as read (debounced by 2s per conversation to prevent DB write-queueing)
  markAsRead: async (conversationId: string): Promise<void> => {
    if ((chatService as any)._markReadTimers?.[conversationId]) return;
    if (!(chatService as any)._markReadTimers) (chatService as any)._markReadTimers = {};
    (chatService as any)._markReadTimers[conversationId] = setTimeout(() => {
      delete (chatService as any)._markReadTimers[conversationId];
    }, 2000);
    await api.patch(`/messages/read/${conversationId}`).catch(() => {});
  },

  // Backward compatibility alias for markAsRead
  markConversationSeen: async (conversationId: string): Promise<void> => {
    await chatService.markAsRead(conversationId);
  },

  // Get users for starting a new chat (supports role filter & search)
  getAssignableUsers: async (role?: string, search?: string): Promise<ChatParticipant[]> => {
    const response = await api.get("/conversations/users", {
      params: { role, search },
    });
    return response.data?.data || [];
  },

  // Search conversations by name / group title
  searchConversations: async (q: string): Promise<ConversationItem[]> => {
    if (!q || !q.trim()) return [];
    const response = await api.get("/conversations/search", {
      params: { q: q.trim() },
    });
    return response.data?.data || [];
  },

  // Search messages in a conversation
  searchMessages: async (conversationId: string, q: string): Promise<ChatMessage[]> => {
    if (!q || !q.trim()) return [];
    const response = await api.get(`/messages/search/${conversationId}`, {
      params: { q: q.trim() },
    });
    return response.data?.data || [];
  },

  // Toggle reaction on a message
  toggleReaction: async (messageId: string, emoji: string): Promise<ChatMessage> => {
    const response = await api.post(`/messages/${messageId}/reactions`, { emoji });
    return response.data?.data;
  },

  // Edit a message
  editMessage: async (messageId: string, text: string): Promise<ChatMessage> => {
    const response = await api.patch(`/messages/${messageId}`, { message: text });
    return response.data?.data;
  },

  // Delete message for everyone
  deleteMessage: async (messageId: string): Promise<void> => {
    await api.delete(`/messages/${messageId}/everyone`);
  },
};

export default chatService;
