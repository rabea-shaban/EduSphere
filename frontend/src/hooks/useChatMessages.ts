"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import chatService, { ChatMessage } from "@/services/chat.service";
import { useAuthContext } from "@/providers/auth-provider";

export interface UseChatMessagesProps {
  activeConversationId?: string;
}

// Auto-detect messageType from a file URL by extension
function detectMessageType(url: string): "Text" | "Image" | "Video" | "Audio" | "Document" | "System" {
  // Strip query params before extracting extension
  const cleanUrl = url.split("?")[0];
  const ext = cleanUrl.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "webp", "gif", "svg", "bmp"].includes(ext)) return "Image";
  if (["mp4", "webm", "mov", "mkv", "avi"].includes(ext)) return "Video";
  if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(ext)) return "Audio";
  if (["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "zip", "rar", "txt", "csv"].includes(ext)) return "Document";
  return "Document"; // default for unknown binary files
}

export function useChatMessages({ activeConversationId }: UseChatMessagesProps = {}) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthContext();

  const [inputMessage, setInputMessage] = React.useState("");
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  // Fetch Message history from API
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ["chat", "messages", activeConversationId],
    queryFn: () => (activeConversationId ? chatService.getMessages(activeConversationId) : Promise.resolve({ messages: [] })),
    enabled: !!activeConversationId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });

  // Sync API response to local messages state
  React.useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData, activeConversationId]);

  // Automatically mark conversation as read when active
  React.useEffect(() => {
    if (activeConversationId) {
      chatService.markAsRead(activeConversationId).catch(() => {});
    }
  }, [activeConversationId]);

  // Handle incoming real-time socket message with deduplication
  const appendSocketMessage = React.useCallback((newMsg: ChatMessage) => {
    setMessages((prev) => {
      // Check if already present by _id or clientMessageId
      const exists = prev.some(
        (m) =>
          (m._id && newMsg._id && String(m._id) === String(newMsg._id)) ||
          (m.clientMessageId && newMsg.clientMessageId && m.clientMessageId === newMsg.clientMessageId)
      );
      if (exists) {
        // If present as draft (matching clientMessageId), update it with server object
        if (newMsg.clientMessageId) {
          return prev.map((m) => (m.clientMessageId === newMsg.clientMessageId ? newMsg : m));
        }
        return prev;
      }
      return [...prev, newMsg];
    });
  }, []);

  // Called when WE receive the messages-read event (meaning the OTHER person read our messages)
  // Flips all OUR outgoing messages in this conversation to status="read" & isRead=true
  const markSentMessagesAsRead = React.useCallback((readBy: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        const senderId = typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
        // Only flip messages WE sent (not the one who just read them)
        if (String(senderId) === String(currentUser?._id) && String(senderId) !== String(readBy)) {
          return { ...msg, isRead: true, status: "read" as const };
        }
        return msg;
      })
    );
  }, [currentUser?._id]);

  // Called when WE open a conversation — flips incoming messages to read for local UI
  const markMessagesAsReadLocal = React.useCallback(() => {
    setMessages((prev) =>
      prev.map((msg) => ({
        ...msg,
        isRead: true,
        status: "read" as const,
      }))
    );
  }, []);

  // Send Message Mutation with Optimistic UI
  // IMPORTANT: attachments are passed as mutation variables (snapshot), NOT captured from closure.
  // This prevents the race condition where onMutate clears attachments state before mutationFn sends the request.
  const sendMessageMutation = useMutation({
    mutationFn: async ({
      text,
      clientMessageId,
      messageType = "Text",
      attachmentsSnapshot,
    }: {
      text: string;
      clientMessageId: string;
      messageType?: "Text" | "Image" | "Video" | "Audio" | "Document" | "System";
      attachmentsSnapshot: string[];
    }) => {
      if (!activeConversationId) throw new Error("No active conversation");
      return chatService.sendMessage(
        activeConversationId,
        text,
        messageType,
        attachmentsSnapshot,   // ← uses the snapshot, not the (now-cleared) state
        undefined,
        clientMessageId
      );
    },
    onMutate: async ({ text, clientMessageId, messageType, attachmentsSnapshot }) => {
      // Create local optimistic draft message
      const optimisticMsg: ChatMessage = {
        _id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        conversationId: activeConversationId || "",
        clientMessageId,
        senderId: currentUser?._id || "me",
        message: text,
        messageType: messageType || "Text",
        attachments: [...attachmentsSnapshot],
        status: "sent",
        isRead: false,
        edited: false,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      setInputMessage("");
      setAttachments([]);   // safe to clear now — snapshot already captured

      return { optimisticMsg };
    },
    onSuccess: (serverMsg, variables) => {
      if (serverMsg) {
        // Replace optimistic draft with confirmed server object
        setMessages((prev) =>
          prev.map((m) =>
            m.clientMessageId === variables.clientMessageId || m._id === serverMsg._id ? serverMsg : m
          )
        );
        queryClient.invalidateQueries({ queryKey: ["chat", "enrolled-contacts"] });
      }
    },
    onError: (err: any, variables, context) => {
      // Remove optimistic draft on failure
      if (context?.optimisticMsg) {
        setMessages((prev) => prev.filter((m) => m.clientMessageId !== variables.clientMessageId));
      }
      toast.error(err?.response?.data?.message || err?.message || "فشل إرسال الرسالة");
    },
  });

  // Handle Send trigger — takes a snapshot of attachments at call time
  const sendMessage = React.useCallback(
    (textOverride?: string) => {
      const textToSend = (textOverride !== undefined ? textOverride : inputMessage).trim();
      // Snapshot current attachments BEFORE any async work
      const attachmentsSnapshot = [...attachments];

      if ((!textToSend && attachmentsSnapshot.length === 0) || !activeConversationId || sendMessageMutation.isPending) return;

      const clientMessageId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Auto-detect messageType from first attachment URL
      let detectedType: "Text" | "Image" | "Video" | "Audio" | "Document" | "System" = "Text";
      if (attachmentsSnapshot.length > 0) {
        detectedType = detectMessageType(attachmentsSnapshot[0]);
      }

      sendMessageMutation.mutate({
        text: textToSend,
        clientMessageId,
        messageType: detectedType,
        attachmentsSnapshot,  // ← pass snapshot as variable, not closure
      });
    },
    [inputMessage, attachments, activeConversationId, sendMessageMutation]
  );

  // Send a voice message directly (bypasses text input & attachment state)
  const sendVoiceMessage = React.useCallback(
    async (audioUrl: string) => {
      if (!activeConversationId) return;
      const clientMessageId = `voice_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Optimistic UI: add the message locally
      const optimisticMsg: ChatMessage = {
        _id: `temp_${Date.now()}`,
        conversationId: activeConversationId,
        clientMessageId,
        senderId: "me",
        message: "",
        messageType: "Audio",
        attachments: [audioUrl],
        status: "sent",
        isRead: false,
        edited: false,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        const serverMsg = await chatService.sendMessage(
          activeConversationId,
          "",
          "Audio",
          [audioUrl],
          undefined,
          clientMessageId
        );
        if (serverMsg) {
          setMessages((prev) =>
            prev.map((m) =>
              m.clientMessageId === clientMessageId || m._id === serverMsg._id ? serverMsg : m
            )
          );
          queryClient.invalidateQueries({ queryKey: ["chat", "enrolled-contacts"] });
        }
      } catch (err: any) {
        setMessages((prev) => prev.filter((m) => m.clientMessageId !== clientMessageId));
        toast.error("فشل إرسال الرسالة الصوتية");
      }
    },
    [activeConversationId, queryClient]
  );

  // Filter & Deduplicate unique messages for UI rendering
  const uniqueMessages = React.useMemo(() => {
    const map = new Map<string, ChatMessage>();
    messages.forEach((m, idx) => {
      const key = m._id ? String(m._id) : m.clientMessageId || `draft_${idx}`;
      if (!map.has(key)) {
        map.set(key, m);
      }
    });
    return Array.from(map.values());
  }, [messages]);

  return {
    messages: uniqueMessages,
    rawMessages: messages,
    inputMessage,
    setInputMessage,
    attachments,
    setAttachments,
    sendMessage,
    sendVoiceMessage,
    appendSocketMessage,
    markMessagesAsReadLocal,
    markSentMessagesAsRead,
    isLoadingMessages,
    isSending: sendMessageMutation.isPending,
    refetchMessages,
  };
}

export default useChatMessages;
