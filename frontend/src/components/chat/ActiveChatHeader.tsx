"use client";

import * as React from "react";
import { ChatParticipant, ConversationItem } from "@/types/chat";
import { ArrowRight, Info, Search, GraduationCap, ShieldCheck, UserCheck } from "lucide-react";

interface ActiveChatHeaderProps {
  conversation: ConversationItem;
  currentUserId: string;
  isOnline?: boolean;
  isTyping?: boolean;
  onBackMobile?: () => void;
  onToggleSearch?: () => void;
  onToggleProfile?: () => void;
}

export const ActiveChatHeader: React.FC<ActiveChatHeaderProps> = ({
  conversation,
  currentUserId,
  isOnline = false,
  isTyping = false,
  onBackMobile,
  onToggleSearch,
  onToggleProfile,
}) => {
  // Find partner for 1-on-1 private chat
  const partner = React.useMemo(() => {
    if (conversation.conversationType === "Private") {
      return conversation.participants.find((p) => p._id !== currentUserId) || conversation.participants[0];
    }
    return null;
  }, [conversation, currentUserId]);

  const title = conversation.groupTitle || (partner ? `${partner.firstName} ${partner.lastName}` : "محادثة");
  const avatar = conversation.groupAvatar || partner?.avatar;
  const role = partner?.role;

  const getRoleBadge = (r?: string) => {
    if (!r) return null;
    switch (r) {
      case "TEACHER":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <GraduationCap className="w-3 h-3" /> معلم
          </span>
        );
      case "ADMIN":
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldCheck className="w-3 h-3" /> إدارة
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <UserCheck className="w-3 h-3" /> طالب
          </span>
        );
    }
  };

  return (
    <div className="bg-neutral-900 border-b border-neutral-800 p-3 flex items-center justify-between shadow-sm z-20" dir="rtl">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={onBackMobile}
          className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          title="الرجوع للقائمة"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* User Avatar with Online Dot */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-semibold text-sm overflow-hidden shadow-inner">
            {avatar ? (
              <img src={avatar} alt={title} className="w-full h-full object-cover" />
            ) : (
              title[0] || "C"
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 left-0 w-3 h-3 bg-emerald-500 border-2 border-neutral-900 rounded-full" />
          )}
        </div>

        {/* Title & Status */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white truncate">{title}</h2>
            {getRoleBadge(role)}
          </div>
          <span className="text-xs text-neutral-400 truncate">
            {isTyping ? (
              <span className="text-blue-400 font-medium animate-pulse">يكتب الآن...</span>
            ) : isOnline ? (
              <span className="text-emerald-400">متصل الآن</span>
            ) : (
              "غير متصل"
            )}
          </span>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Search Messages */}
        <button
          onClick={onToggleSearch}
          className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          title="بحث في المحادثة"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* User Profile Info */}
        <button
          onClick={onToggleProfile}
          className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          title="معلومات المحادثة"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ActiveChatHeader;
