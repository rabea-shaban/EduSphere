"use client";

import * as React from "react";
import { useAuthContext } from "@/providers/auth-provider";
import { useSocketContext } from "@/providers/socket-provider";
import chatService from "@/services/chat.service";
import { ChatMessage, ConversationItem } from "@/types/chat";
import ConversationSidebar from "./ConversationSidebar";
import ActiveChatHeader from "./ActiveChatHeader";
import MessageItem from "./MessageItem";
import ChatInputBar from "./ChatInputBar";
import UserProfilePanel from "./UserProfilePanel";
import NewChatModal from "./NewChatModal";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export const ChatLayout: React.FC = () => {
  const { user } = useAuthContext();
  const { socket, isConnected } = useSocketContext();

  const currentUserId = user?._id || "";
  const currentUserRole = user?.role || "STUDENT";

  const [conversations, setConversations] = React.useState<ConversationItem[]>([]);
  const [activeConversation, setActiveConversation] = React.useState<ConversationItem | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  
  const [loadingConversations, setLoadingConversations] = React.useState(true);
  const [loadingMessages, setLoadingMessages] = React.useState(false);

  const [replyingToMessage, setReplyingToMessage] = React.useState<ChatMessage | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = React.useState(false);
  const [showProfilePanel, setShowProfilePanel] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [onlineUserIds, setOnlineUserIds] = React.useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = React.useState<Set<string>>(new Set());

  const messageEndRef = React.useRef<HTMLDivElement | null>(null);

  // 1. Fetch user conversations
  const fetchConversations = React.useCallback(async () => {
    try {
      setLoadingConversations(true);
      const res = await chatService.getConversations();
      setConversations(res.conversations || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  React.useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // 2. Fetch messages when active conversation changes
  const fetchMessages = React.useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const res = await chatService.getMessages(conversationId, 1, 100);
      setMessages(res.messages || []);
      await chatService.markAsRead(conversationId);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  React.useEffect(() => {
    if (activeConversation?._id) {
      fetchMessages(activeConversation._id);
    }
  }, [activeConversation?._id, fetchMessages]);

  // 3. Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // 4. Socket Real-Time Event Handlers
  React.useEffect(() => {
    if (!socket || !isConnected) return;

    const handleOnlineList = (userList: string[]) => {
      setOnlineUserIds(new Set(userList));
    };

    const handleUserOnline = (userId: string) => {
      setOnlineUserIds((prev) => new Set([...prev, userId]));
    };

    const handleUserOffline = (userId: string) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    const handleTypingStart = (data: { conversationId: string; userId: string }) => {
      if (activeConversation?._id === data.conversationId && data.userId !== currentUserId) {
        setTypingUsers((prev) => new Set([...prev, data.userId]));
      }
    };

    const handleTypingStop = (data: { conversationId: string; userId: string }) => {
      if (activeConversation?._id === data.conversationId) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    };

    const handleNewMessage = (newMsg: ChatMessage) => {
      // Update conversations list last message preview
      setConversations((prevConvs) => {
        return prevConvs.map((conv) => {
          if (conv._id === newMsg.conversationId) {
            const currentUnread = (conv.unreadCount as Record<string, number>)?.[currentUserId] || 0;
            const isCurrentActive = activeConversation?._id === newMsg.conversationId;
            return {
              ...conv,
              lastMessage: newMsg,
              lastMessageAt: newMsg.createdAt,
              unreadCount: {
                ...(conv.unreadCount as Record<string, number>),
                [currentUserId]: isCurrentActive ? 0 : currentUnread + 1,
              },
            };
          }
          return conv;
        });
      });

      // Append to active message stream if currently open
      if (activeConversation?._id === newMsg.conversationId) {
        setMessages((prevMsgs) => {
          // Deduplicate by _id or clientMessageId
          const exists = prevMsgs.some(
            (m) => m._id === newMsg._id || (newMsg.clientMessageId && m.clientMessageId === newMsg.clientMessageId)
          );
          if (exists) {
            return prevMsgs.map((m) =>
              m._id === newMsg._id || (newMsg.clientMessageId && m.clientMessageId === newMsg.clientMessageId)
                ? newMsg
                : m
            );
          }
          return [...prevMsgs, newMsg];
        });

        chatService.markAsRead(newMsg.conversationId);
      }
    };

    const handleMessagesRead = (data: { conversationId: string; readBy: string }) => {
      if (activeConversation?._id === data.conversationId) {
        setMessages((prevMsgs) =>
          prevMsgs.map((m) => ({
            ...m,
            isRead: true,
            status: "read",
          }))
        );
      }
    };

    const handleMessageReaction = (data: { messageId: string; conversationId: string; reactions: any[] }) => {
      if (activeConversation?._id === data.conversationId) {
        setMessages((prevMsgs) =>
          prevMsgs.map((m) => (m._id === data.messageId ? { ...m, reactions: data.reactions } : m))
        );
      }
    };

    const handleMessageDeleted = (data: { messageId: string; conversationId: string }) => {
      if (activeConversation?._id === data.conversationId) {
        setMessages((prevMsgs) => prevMsgs.filter((m) => m._id !== data.messageId));
      }
    };

    socket.on("online-users-list", handleOnlineList);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);
    socket.on("typing", handleTypingStart);
    socket.on("typing:start", handleTypingStart);
    socket.on("stop-typing", handleTypingStop);
    socket.on("typing:stop", handleTypingStop);
    socket.on("message", handleNewMessage);
    socket.on("message:new", handleNewMessage);
    socket.on("messages-read", handleMessagesRead);
    socket.on("message-reaction", handleMessageReaction);
    socket.on("message-deleted", handleMessageDeleted);

    return () => {
      socket.off("online-users-list", handleOnlineList);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
      socket.off("typing", handleTypingStart);
      socket.off("typing:start", handleTypingStart);
      socket.off("stop-typing", handleTypingStop);
      socket.off("typing:stop", handleTypingStop);
      socket.off("message", handleNewMessage);
      socket.off("message:new", handleNewMessage);
      socket.off("messages-read", handleMessagesRead);
      socket.off("message-reaction", handleMessageReaction);
      socket.off("message-deleted", handleMessageDeleted);
    };
  }, [socket, isConnected, activeConversation?._id, currentUserId]);

  // Join room when active conversation changes
  React.useEffect(() => {
    if (socket && isConnected && activeConversation?._id) {
      socket.emit("join-conversation", activeConversation._id);
      return () => {
        socket.emit("leave-conversation", activeConversation._id);
      };
    }
  }, [socket, isConnected, activeConversation?._id]);

  // Handle send message with Optimistic UI
  const handleSendMessage = async (
    text: string,
    messageType: "Text" | "Image" | "Video" | "Audio" | "Document" = "Text",
    attachments: string[] = []
  ) => {
    if (!activeConversation?._id) return;

    const clientMsgId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Create Optimistic Draft Message
    const optimisticMsg: ChatMessage = {
      _id: clientMsgId,
      conversationId: activeConversation._id,
      senderId: {
        _id: currentUserId,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        avatar: user?.avatar,
        role: currentUserRole as any,
      },
      clientMessageId: clientMsgId,
      message: text,
      messageType,
      attachments,
      replyTo: replyingToMessage || undefined,
      status: "sending",
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setReplyingToMessage(null);

    try {
      const savedMsg = await chatService.sendMessage(
        activeConversation._id,
        text,
        messageType,
        attachments,
        replyingToMessage?._id,
        clientMsgId
      );

      // Replace draft with authoritative server message
      setMessages((prev) => prev.map((m) => (m.clientMessageId === clientMsgId ? savedMsg : m)));
    } catch (err: any) {
      console.error("Send message error:", err);
      toast.error(err.response?.data?.message || "تعذر إرسال الرسالة");
      setMessages((prev) =>
        prev.map((m) => (m.clientMessageId === clientMsgId ? { ...m, status: "failed" } : m))
      );
    }
  };

  const handleToggleReaction = async (messageId: string, emoji: string) => {
    try {
      const updated = await chatService.toggleReaction(messageId, emoji);
      setMessages((prev) => prev.map((m) => (m._id === messageId ? updated : m)));
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await chatService.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      toast.success("تم حذف الرسالة");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "تعذر حذف الرسالة");
    }
  };

  const isPartnerOnline = React.useMemo(() => {
    if (!activeConversation || activeConversation.conversationType !== "Private") return false;
    const partner = activeConversation.participants.find((p) => p._id !== currentUserId);
    return partner ? onlineUserIds.has(partner._id) : false;
  }, [activeConversation, currentUserId, onlineUserIds]);

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-neutral-950 text-white flex overflow-hidden font-sans" dir="rtl">
      {/* Panel 1: Conversation Sidebar */}
      <div
        className={`w-full lg:w-80 h-full shrink-0 transition-all ${
          activeConversation ? "hidden lg:flex" : "flex"
        }`}
      >
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversation?._id}
          currentUserId={currentUserId}
          onlineUserIds={onlineUserIds}
          onSelectConversation={(conv) => setActiveConversation(conv)}
          onOpenNewChatModal={() => setIsNewChatModalOpen(true)}
        />
      </div>

      {/* Panel 2: Active Chat Stream */}
      <div className={`flex-1 h-full flex flex-col min-w-0 bg-neutral-950 ${!activeConversation ? "hidden lg:flex" : "flex"}`}>
        {activeConversation ? (
          <>
            {/* Active Header */}
            <ActiveChatHeader
              conversation={activeConversation}
              currentUserId={currentUserId}
              isOnline={isPartnerOnline}
              isTyping={typingUsers.size > 0}
              onBackMobile={() => setActiveConversation(null)}
              onToggleSearch={() => setSearchQuery(searchQuery ? "" : " ")}
              onToggleProfile={() => setShowProfilePanel(!showProfilePanel)}
            />

            {/* Message Stream Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-400 space-y-2">
                  <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
                  <span className="text-xs">جاري تحميل الرسائل...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-neutral-500 text-xs space-y-2 text-center">
                  <MessageSquare className="w-10 h-10 opacity-30" />
                  <span>لا توجد رسائل سابقة، ابدأ المحادثة الآن!</span>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageItem
                    key={msg._id || msg.clientMessageId}
                    message={msg}
                    currentUserId={currentUserId}
                    currentUserRole={currentUserRole}
                    onReply={(m) => setReplyingToMessage(m)}
                    onReact={handleToggleReaction}
                    onDelete={handleDeleteMessage}
                    onJumpToReply={(rId) => {
                      const el = document.getElementById(`msg-${rId}`);
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                  />
                ))
              )}
              <div ref={messageEndRef} />
            </div>

            {/* Input Bar */}
            <ChatInputBar
              onSendMessage={handleSendMessage}
              replyingToMessage={replyingToMessage}
              onCancelReply={() => setReplyingToMessage(null)}
              onTypingStart={() => {
                if (socket && isConnected && activeConversation._id) {
                  socket.emit("typing:start", { conversationId: activeConversation._id, userId: currentUserId });
                }
              }}
              onTypingStop={() => {
                if (socket && isConnected && activeConversation._id) {
                  socket.emit("typing:stop", { conversationId: activeConversation._id, userId: currentUserId });
                }
              }}
            />
          </>
        ) : (
          /* Empty Chat Selection Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500 space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">اختر محادثة للبدء</h3>
            <p className="text-xs text-neutral-400 max-w-sm">
              اختر إحدى المحادثات من القائمة الجانبية أو ابدأ محادثة جديدة مع المعلمين أو الطلاب.
            </p>
          </div>
        )}
      </div>

      {/* Panel 3: Right User Profile Panel */}
      {showProfilePanel && activeConversation && (
        <div className="hidden lg:block w-80 h-full shrink-0">
          <UserProfilePanel
            conversation={activeConversation}
            currentUserId={currentUserId}
            messages={messages}
            onClose={() => setShowProfilePanel(false)}
          />
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onSelectConversation={(conv) => {
          setActiveConversation(conv);
          fetchConversations();
        }}
      />
    </div>
  );
};

export default ChatLayout;
