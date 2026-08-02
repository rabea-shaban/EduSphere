"use client";

import * as React from "react";
import { useSocketContext } from "@/providers/socket-provider";
import { useAuthContext } from "@/providers/auth-provider";
import { ChatMessage } from "@/services/chat.service";

export interface UseChatSocketProps {
  activeConversationId?: string;
  onNewMessage?: (message: ChatMessage) => void;
  onMessagesRead?: (data: { conversationId: string; readBy: string; readAt: string }) => void;
  onMessageEdited?: (message: ChatMessage) => void;
  onMessageDeleted?: (data: { messageId: string; conversationId: string }) => void;
}

export function useChatSocket({
  activeConversationId,
  onNewMessage,
  onMessagesRead,
  onMessageEdited,
  onMessageDeleted,
}: UseChatSocketProps = {}) {
  const { socket, onlineUserIds } = useSocketContext();
  const { user: currentUser } = useAuthContext();

  const [isTyping, setIsTyping] = React.useState(false);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Emit mark-read when user enters/views a conversation (real-time read receipts)
  React.useEffect(() => {
    if (!socket || !activeConversationId || !currentUser?._id) return;
    socket.emit("mark-read", { conversationId: activeConversationId });
  }, [socket, activeConversationId, currentUser?._id]);

  // Handle active conversation room join & leave
  React.useEffect(() => {
    if (!socket || !activeConversationId) return;

    socket.emit("join-conversation", activeConversationId);

    const handleMessage = (msg: ChatMessage) => {
      if (onNewMessage) {
        onNewMessage(msg);
      }
      // Auto mark-read when new message arrives in the active conversation
      if (msg.conversationId === activeConversationId && currentUser?._id) {
        socket.emit("mark-read", { conversationId: activeConversationId });
      }
    };

    const handleRead = (data: { conversationId: string; readBy: string; readAt: string }) => {
      if (data.conversationId === activeConversationId && onMessagesRead) {
        onMessagesRead(data);
      }
    };

    const handleEdited = (msg: ChatMessage) => {
      if (onMessageEdited) {
        onMessageEdited(msg);
      }
    };

    const handleDeleted = (data: { messageId: string; conversationId: string }) => {
      if (onMessageDeleted) {
        onMessageDeleted(data);
      }
    };

    const handleTyping = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === activeConversationId && data.userId !== currentUser?._id) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    const handleStopTyping = (data: { conversationId: string; userId: string }) => {
      if (data.conversationId === activeConversationId && data.userId !== currentUser?._id) {
        setIsTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      }
    };

    socket.on("message", handleMessage);
    socket.on("new-message", handleMessage);
    socket.on("messages-read", handleRead);
    socket.on("message-edited", handleEdited);
    socket.on("message-deleted", handleDeleted);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);

    return () => {
      socket.emit("leave-conversation", activeConversationId);
      socket.off("message", handleMessage);
      socket.off("new-message", handleMessage);
      socket.off("messages-read", handleRead);
      socket.off("message-edited", handleEdited);
      socket.off("message-deleted", handleDeleted);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [
    socket,
    activeConversationId,
    currentUser?._id,
    onNewMessage,
    onMessagesRead,
    onMessageEdited,
    onMessageDeleted,
  ]);

  // Send typing event
  const sendTyping = React.useCallback(() => {
    if (socket && activeConversationId && currentUser?._id) {
      socket.emit("typing", { conversationId: activeConversationId, userId: currentUser._id });
    }
  }, [socket, activeConversationId, currentUser?._id]);

  // Send stop typing event
  const sendStopTyping = React.useCallback(() => {
    if (socket && activeConversationId && currentUser?._id) {
      socket.emit("stop-typing", { conversationId: activeConversationId, userId: currentUser._id });
    }
  }, [socket, activeConversationId, currentUser?._id]);

  // Helper to check if a specific participant is online
  const isUserOnline = React.useCallback(
    (userId?: string) => {
      if (!userId) return false;
      return onlineUserIds.some((id) => String(id) === String(userId));
    },
    [onlineUserIds]
  );

  return {
    socket,
    isTyping,
    sendTyping,
    sendStopTyping,
    onlineUserIds,
    isUserOnline,
  };
}

export default useChatSocket;
