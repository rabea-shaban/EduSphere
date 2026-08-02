import api from "./api";

export interface ChatParticipant {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export type MessageStatus = "sent" | "delivered" | "read";

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: ChatParticipant | string;
  clientMessageId?: string;
  message: string;
  messageType?: "Text" | "Image" | "Video" | "Audio" | "Document" | "File" | "Voice" | "System";
  attachments?: string[];
  replyTo?: string | ChatMessage;
  status?: MessageStatus;
  isRead?: boolean;
  edited?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ConversationItem {
  _id: string;
  participants: ChatParticipant[];
  conversationType: "Private" | "Group" | "Support";
  groupTitle?: string;
  groupAvatar?: string;
  groupAdmin?: ChatParticipant | string;
  description?: string;
  lastMessage?: ChatMessage | string;
  lastSender?: string;
  lastMessageAt?: string;
  unreadCount?: Record<string, number>;
  createdAt: string;
  updatedAt?: string;
}

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

  // Mark all messages in a conversation as read
  markAsRead: async (conversationId: string): Promise<void> => {
    await api.patch(`/messages/read/${conversationId}`);
  },

  // Backward compatibility alias for markAsRead
  markConversationSeen: async (conversationId: string): Promise<void> => {
    await api.patch(`/messages/read/${conversationId}`).catch(() => {});
  },
};

export default chatService;
