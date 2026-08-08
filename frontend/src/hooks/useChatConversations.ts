"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import chatService, { ConversationItem, ChatParticipant } from "@/services/chat.service";
import { useAuthContext } from "@/providers/auth-provider";

import { useSocketContext } from "@/providers/socket-provider";

export interface UseChatConversationsProps {
  storageKey?: string;
  targetUserId?: string | null;
}

export function useChatConversations({
  storageKey = "edusphere_last_conv_id",
  targetUserId,
}: UseChatConversationsProps = {}) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const urlConvId = searchParams.get("convId");
  const { user: currentUser } = useAuthContext();
  const { isConnected } = useSocketContext();

  const [activeConversation, setActiveConversation] = React.useState<ConversationItem | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Fetch enrolled contacts and conversations (0ms WebSockets when connected, 3s fallback if socket drops)
  const {
    data: contactsData,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["chat", "enrolled-contacts"],
    queryFn: () => chatService.getEnrolledContacts(),
    staleTime: 1000 * 60 * 5,
    refetchInterval: isConnected ? false : 3000,
  });

  const rawConversations = contactsData?.conversations || [];

  // Global platform user search (by phone or name)
  const { data: globalSearchResults = [], isLoading: isSearchingGlobal } = useQuery({
    queryKey: ["chat", "search-users", searchTerm],
    queryFn: () => chatService.searchUsers(searchTerm),
    enabled: searchTerm.trim().length >= 2,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Auto create or get conversation if targetUserId passed in URL
  React.useEffect(() => {
    if (targetUserId && currentUser) {
      chatService
        .getOrCreateConversation(targetUserId)
        .then((conv) => {
          setActiveConversation(conv);
          refetchConversations();
        })
        .catch((err) => {
          console.error("Failed to get or create conversation:", err);
        });
    }
  }, [targetUserId, currentUser, refetchConversations]);

  // Restore active conversation from URL query or localStorage
  React.useEffect(() => {
    if (rawConversations.length > 0) {
      const savedConvId = urlConvId || (typeof window !== "undefined" ? localStorage.getItem(storageKey) : null);
      if (savedConvId) {
        const found = rawConversations.find((c) => c._id === savedConvId);
        if (found) {
          if (activeConversation?._id !== found._id) {
            setActiveConversation(found);
          }
          return;
        }
      }
      if (!activeConversation) {
        setActiveConversation(rawConversations[0]);
      }
    }
  }, [rawConversations, urlConvId, storageKey]);

  // Handle active conversation selection
  const selectConversation = React.useCallback(
    (conv: ConversationItem | null) => {
      setActiveConversation(conv);
      if (typeof window !== "undefined") {
        if (conv) {
          localStorage.setItem(storageKey, conv._id);
          const url = new URL(window.location.href);
          url.searchParams.set("convId", conv._id);
          window.history.replaceState({}, "", url.toString());
        } else {
          localStorage.removeItem(storageKey);
          const url = new URL(window.location.href);
          url.searchParams.delete("convId");
          window.history.replaceState({}, "", url.toString());
        }
      }
    },
    [storageKey]
  );

  // Start new 1-on-1 chat with a user found via global search
  const startChatWithUser = React.useCallback(
    async (user: ChatParticipant) => {
      try {
        const conv = await chatService.getOrCreateConversation(user._id);
        selectConversation(conv);
        refetchConversations();
        setSearchTerm("");
        return conv;
      } catch (err: any) {
        console.error("Failed to start chat with user:", err);
      }
    },
    [selectConversation, refetchConversations]
  );

  // Create a new group chat
  const createNewGroup = React.useCallback(
    async (title: string, participantIds: string[], description?: string) => {
      try {
        const groupConv = await chatService.createGroupConversation(title, participantIds, description);
        queryClient.invalidateQueries({ queryKey: ["chat", "enrolled-contacts"] });
        selectConversation(groupConv);
        refetchConversations();
        return groupConv;
      } catch (err: any) {
        console.error("Failed to create group conversation:", err);
        throw err;
      }
    },
    [queryClient, selectConversation, refetchConversations]
  );
  const leaveGroup = React.useCallback(
    async (convId: string) => {
      await chatService.leaveGroup(convId);
      queryClient.invalidateQueries({ queryKey: ["chat", "enrolled-contacts"] });
      setActiveConversation(null);
      refetchConversations();
    },
    [queryClient, refetchConversations]
  );

  // Delete group
  const deleteGroup = React.useCallback(
    async (convId: string) => {
      await chatService.deleteGroup(convId);
      queryClient.invalidateQueries({ queryKey: ["chat", "enrolled-contacts"] });
      setActiveConversation(null);
      refetchConversations();
    },
    [queryClient, refetchConversations]
  );

  // Clear chat messages
  const clearChat = React.useCallback(
    async (convId: string) => {
      await chatService.clearChat(convId);
      queryClient.invalidateQueries({ queryKey: ["chat", "messages", convId] });
      refetchConversations();
    },
    [queryClient, refetchConversations]
  );

  // Helper to extract the other participant
  const getOtherParticipant = React.useCallback(
    (conv: ConversationItem): ChatParticipant | undefined => {
      return conv.participants?.find((p: ChatParticipant) => p._id !== currentUser?._id) || conv.participants?.[0];
    },
    [currentUser?._id]
  );

  // Deduplicate and filter conversations
  const filteredConversations = React.useMemo(() => {
    const map = new Map<string, ConversationItem>();
    rawConversations.forEach((conv) => {
      if (!conv || !conv._id) return;
      if (conv.conversationType === "Group") {
        const title = (conv.groupTitle || "مجموعة دراسية").toLowerCase();
        if (title.includes(searchTerm.toLowerCase())) {
          map.set(conv._id, conv);
        }
      } else {
        const other = getOtherParticipant(conv);
        const name = `${other?.firstName || ""} ${other?.lastName || ""}`.toLowerCase();
        const phone = (other as any)?.phone || "";
        if (name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm)) {
          map.set(conv._id, conv);
        }
      }
    });
    return Array.from(map.values());
  }, [rawConversations, searchTerm, getOtherParticipant]);

  const activeOtherParticipant = activeConversation ? getOtherParticipant(activeConversation) : undefined;

  return {
    conversations: filteredConversations,
    rawConversations,
    globalSearchResults,
    isSearchingGlobal,
    startChatWithUser,
    createNewGroup,
    leaveGroup,
    deleteGroup,
    clearChat,
    activeConversation,
    activeOtherParticipant,
    selectConversation,
    searchTerm,
    setSearchTerm,
    isLoadingConversations,
    refetchConversations,
    getOtherParticipant,
  };
}

export default useChatConversations;
