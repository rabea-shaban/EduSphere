"use client";

import * as React from "react";
import useChatSocket from "./useChatSocket";
import useChatConversations from "./useChatConversations";
import useChatMessages from "./useChatMessages";
import { ChatMessage } from "@/services/chat.service";

export interface UseChatOptions {
  storageKey?: string;
  targetUserId?: string | null;
}

export function useChat(options: UseChatOptions = {}) {
  const conversationsState = useChatConversations({
    storageKey: options.storageKey,
    targetUserId: options.targetUserId,
  });

  const activeConvId = conversationsState.activeConversation?._id;

  const messagesState = useChatMessages({
    activeConversationId: activeConvId,
  });

  const socketState = useChatSocket({
    activeConversationId: activeConvId,
    onNewMessage: (msg: ChatMessage) => {
      if (msg.conversationId === activeConvId) {
        messagesState.appendSocketMessage(msg);
      }
      conversationsState.refetchConversations();
    },
    onMessagesRead: (data) => {
      if (data.conversationId === activeConvId) {
        // Mark OUR sent messages as read (double blue checkmarks) when recipient views them
        messagesState.markSentMessagesAsRead(data.readBy);
        messagesState.markMessagesAsReadLocal();
      }
    },
  });

  // Handle form send with typing stop
  const handleSendMessage = React.useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      socketState.sendStopTyping();
      messagesState.sendMessage();
    },
    [socketState, messagesState]
  );

  return {
    ...conversationsState,
    ...messagesState,
    ...socketState,
    handleSendMessage,
  };
}

export default useChat;
