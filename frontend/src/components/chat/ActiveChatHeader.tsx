"use client";

import * as React from "react";
import { ConversationItem } from "@/types/chat";
import { ArrowRight, Info, Search, GraduationCap, ShieldCheck, UserCheck, Phone } from "lucide-react";
import { useCallContext } from "@/providers/call-provider";
import { useTeacherCallV2 } from "@/features/teacher-realtime/call/TeacherCallProvider";
import { useAuthContext } from "@/providers/auth-provider";

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
  const { startCall } = useCallContext();
  const { startCallV2 } = useTeacherCallV2();
  const { user } = useAuthContext();
  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN";

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
    <div className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-[#243047] px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-xs sticky top-0 z-20 min-w-0" dir="rtl">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Prominent Mobile Back Button */}
        <button
          onClick={onBackMobile}
          className="md:hidden flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-[#172033] hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
          title="الرجوع لقائمة المحادثات"
        >
          <ArrowRight className="w-4 h-4" />
          <span className="hidden sm:inline">المحادثات</span>
        </button>

        {/* User Avatar & Online Status */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm overflow-hidden shadow-xs">
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
          <div className="flex items-center gap-1.5 truncate">
            <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{title}</h2>
            {getRoleBadge(role)}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
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

      {/* Header Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {partner && (
          <button
            onClick={() => {
              if (isTeacher) {
                startCallV2(
                  partner._id,
                  `${partner.firstName} ${partner.lastName}`,
                  partner.avatar,
                  partner.role,
                  conversation._id
                );
              } else {
                startCall(
                  partner._id,
                  `${partner.firstName} ${partner.lastName}`,
                  partner.avatar,
                  partner.role,
                  conversation._id
                );
              }
            }}
            className="p-2 text-[#1769D3] dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-[#172033] rounded-xl transition-colors"
            title="إجراء مكالمة صوتية"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
          </button>
        )}

        <button
          onClick={onToggleSearch}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#172033] transition-colors"
          title="بحث في المحادثة"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={onToggleProfile}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-[#172033] transition-colors"
          title="معلومات المحادثة"
        >
          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default ActiveChatHeader;
