export type RoleType = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';

export type MessageType = 'Text' | 'Image' | 'Video' | 'Audio' | 'Document' | 'System';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  avatar?: string;
  role: RoleType;
  lastActiveAt?: string;
}

export interface Reaction {
  userId: string;
  emoji: string;
  createdAt?: string;
}

export interface SeenReceipt {
  userId: string;
  seenAt: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: ChatParticipant | string;
  clientMessageId?: string;
  message: string;
  messageType: MessageType;
  attachments?: string[];
  replyTo?: ChatMessage | { _id: string; message: string; messageType: MessageType; senderId?: any };
  status: MessageStatus;
  isRead: boolean;
  edited?: boolean;
  editedAt?: string;
  deletedFor?: string[];
  seenBy?: SeenReceipt[];
  reactions?: Reaction[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationItem {
  _id: string;
  participants: ChatParticipant[];
  conversationType: 'Private' | 'Group' | 'Support';
  groupTitle?: string;
  groupAvatar?: string;
  description?: string;
  lastMessage?: ChatMessage | any;
  lastSender?: string;
  lastMessageAt?: string;
  unreadCount?: Record<string, number> | Map<string, number>;
  createdAt?: string;
  updatedAt?: string;
}
