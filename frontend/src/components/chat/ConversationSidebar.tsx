"use client";

import * as React from "react";
import { ConversationItem } from "@/types/chat";
import { Plus, Search, MessageSquare, GraduationCap, ShieldCheck, UserCheck } from "lucide-react";

interface ConversationSidebarProps {
  conversations: ConversationItem[];
  activeConversationId?: string;
  currentUserId: string;
  onlineUserIds?: Set<string>;
  onSelectConversation: (conv: ConversationItem) => void;
  onOpenNewChatModal: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeConversationId,
  currentUserId,
  onlineUserIds = new Set(),
  onSelectConversation,
  onOpenNewChatModal,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");

  const getPartner = (conv: ConversationItem) => {
    if (conv.conversationType === "Private") {
      return conv.participants.find((p) => p._id !== currentUserId) || conv.participants[0];
    }
    return null;
  };

  const formatMessageTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      if (isToday) {
        return new Intl.DateTimeFormat("ar-EG", { hour: "numeric", minute: "numeric" }).format(date);
      }
      return new Intl.DateTimeFormat("ar-EG", { month: "short", day: "numeric" }).format(date);
    } catch {
      return "";
    }
  };

  const getUnreadCount = (conv: ConversationItem): number => {
    if (!conv.unreadCount) return 0;
    if (typeof conv.unreadCount === "object") {
      return (conv.unreadCount as Record<string, number>)[currentUserId] || 0;
    }
    return 0;
  };

  const filteredConversations = React.useMemo(() => {
    return conversations.filter((conv) => {
      const partner = getPartner(conv);
      const title = conv.groupTitle || (partner ? `${partner.firstName} ${partner.lastName}` : "");

      if (roleFilter !== "ALL" && partner) {
        if (roleFilter === "ADMIN" && partner.role !== "ADMIN" && partner.role !== "SUPER_ADMIN") return false;
        if (roleFilter === "TEACHER" && partner.role !== "TEACHER") return false;
        if (roleFilter === "STUDENT" && partner.role !== "STUDENT") return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = title.toLowerCase().includes(q);
        const matchesMessage = typeof conv.lastMessage === "object" ? conv.lastMessage?.message?.toLowerCase().includes(q) : false;
        return matchesTitle || matchesMessage;
      }

      return true;
    });
  }, [conversations, searchQuery, roleFilter, currentUserId]);

  const getRoleBadge = (r?: string) => {
    if (!r) return null;
    switch (r) {
      case "TEACHER":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <GraduationCap className="w-2.5 h-2.5" /> معلم
          </span>
        );
      case "ADMIN":
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <ShieldCheck className="w-2.5 h-2.5" /> إدارة
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <UserCheck className="w-2.5 h-2.5" /> طالب
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-[#0B1220] border-e border-slate-200 dark:border-[#243047] flex flex-col min-w-0 select-none" dir="rtl">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-[#243047] space-y-3 bg-white dark:bg-[#0F172A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base text-slate-900 dark:text-slate-100">
            <MessageSquare className="w-5 h-5 text-[#1769D3]" />
            <span>المحادثات</span>
          </div>

          <button
            onClick={onOpenNewChatModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1769D3] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>محادثة جديدة</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المحادثات..."
            className="w-full ps-9 pe-3 py-2 bg-slate-100 dark:bg-[#172033] border border-slate-200 dark:border-[#243047] rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#1769D3] transition-all"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {[
            { id: "ALL", label: "الكل" },
            { id: "TEACHER", label: "المعلمين" },
            { id: "STUDENT", label: "الطلاب" },
            { id: "ADMIN", label: "الإدارة" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                roleFilter === tab.id
                  ? "bg-[#1769D3] text-white shadow-sm font-semibold"
                  : "bg-slate-100 dark:bg-[#172033] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations Cards Stream */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-slate-400 dark:text-slate-500 text-xs space-y-2">
            <MessageSquare className="w-8 h-8 opacity-30" />
            <span>لا توجد محادثات مطابقة</span>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const partner = getPartner(conv);
            const title = conv.groupTitle || (partner ? `${partner.firstName} ${partner.lastName}` : "محادثة");
            const avatar = conv.groupAvatar || partner?.avatar;
            const isOnline = partner ? onlineUserIds.has(partner._id) : false;
            const isSelected = conv._id === activeConversationId;
            const unread = getUnreadCount(conv);

            const lastMsgObj = typeof conv.lastMessage === "object" ? conv.lastMessage : null;
            const lastText = lastMsgObj?.message || (lastMsgObj?.attachments?.length ? "مرفق صوي/وسائط" : "ابدأ المحادثة...");

            return (
              <div
                key={conv._id}
                onClick={() => onSelectConversation(conv)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#1769D3]/10 dark:bg-[#1769D3]/20 border-s-4 border-[#1769D3] shadow-xs"
                    : "hover:bg-slate-200/50 dark:hover:bg-[#172033]/60 border-s-4 border-transparent"
                }`}
              >
                {/* Avatar & Online Dot */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-xs">
                    {avatar ? (
                      <img src={avatar} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      title[0] || "C"
                    )}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 start-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0B1220] rounded-full" />
                  )}
                </div>

                {/* Name, Role & Message Preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{title}</span>
                      {getRoleBadge(partner?.role)}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                      {formatMessageTime(conv.lastMessageAt || conv.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs truncate ${unread > 0 ? "text-slate-900 dark:text-white font-semibold" : "text-slate-500 dark:text-slate-400"}`}>
                      {lastText}
                    </p>

                    {unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-[#1769D3] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs animate-in zoom-in duration-150">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
