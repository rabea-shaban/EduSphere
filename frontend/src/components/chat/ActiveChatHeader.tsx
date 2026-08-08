"use client";

import * as React from "react";
import { ConversationItem } from "@/types/chat";
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <GraduationCap className="w-3 h-3" /> معلم
          </span>
        );
      case "ADMIN":
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <ShieldCheck className="w-3 h-3" /> إدارة
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <UserCheck className="w-3 h-3" /> طالب
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-[#243047] px-4 py-3 flex items-center justify-between shadow-xs sticky top-0 z-20" dir="rtl">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        <button
          onClick={onBackMobile}
          className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-[#172033] transition-colors"
          title="الرجوع للقائمة"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* User Avatar & Online Status */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-xs">
            {avatar ? (
              <img src={avatar} alt={title} className="w-full h-full object-cover" />
            ) : (
              title[0] || "C"
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 start-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0F172A] rounded-full" />
          )}
        </div>

        {/* Name & Role */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{title}</h2>
            {getRoleBadge(role)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {isTyping ? (
              <span className="text-[#1769D3] dark:text-blue-400 font-medium animate-pulse">يكتب الآن...</span>
            ) : isOnline ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">متصل الآن</span>
            ) : (
              "غير متصل"
            )}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onToggleSearch}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#172033] transition-colors"
          title="بحث في المحادثة"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={onToggleProfile}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#172033] transition-colors"
          title="معلومات المحادثة"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ActiveChatHeader;
