"use client";

import * as React from "react";
import { ConversationItem, ChatMessage } from "@/types/chat";
import { X, GraduationCap, ShieldCheck, UserCheck, Mail, Image as ImageIcon, FileText, Bell, BellOff } from "lucide-react";

interface UserProfilePanelProps {
  conversation: ConversationItem;
  currentUserId: string;
  messages: ChatMessage[];
  onClose: () => void;
}

export const UserProfilePanel: React.FC<UserProfilePanelProps> = ({
  conversation,
  currentUserId,
  messages,
  onClose,
}) => {
  const [activeTab, setActiveTab] = React.useState<"MEDIA" | "DOCS">("MEDIA");
  const [isMuted, setIsMuted] = React.useState(false);

  const partner = React.useMemo(() => {
    if (conversation.conversationType === "Private") {
      return conversation.participants.find((p) => p._id !== currentUserId) || conversation.participants[0];
    }
    return null;
  }, [conversation, currentUserId]);

  const title = conversation.groupTitle || (partner ? `${partner.firstName} ${partner.lastName}` : "تفاصيل المحادثة");
  const avatar = conversation.groupAvatar || partner?.avatar;
  const email = partner?.email;
  const role = partner?.role;

  const mediaMessages = React.useMemo(() => {
    return messages.filter((m) => m.messageType === "Image" && m.attachments?.[0]);
  }, [messages]);

  const docMessages = React.useMemo(() => {
    return messages.filter((m) => (m.messageType === "Document" || m.messageType === "Video") && m.attachments?.[0]);
  }, [messages]);

  const getRoleBadge = (r?: string) => {
    if (!r) return null;
    switch (r) {
      case "TEACHER":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <GraduationCap className="w-3.5 h-3.5" /> معلم بالمنصة
          </span>
        );
      case "ADMIN":
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> فريق الإدارة
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <UserCheck className="w-3.5 h-3.5" /> طالب مسجل
          </span>
        );
    }
  };

  return (
    <div className="w-full lg:w-80 h-full bg-white dark:bg-[#0F172A] border-s border-slate-200 dark:border-[#243047] flex flex-col min-w-0 select-none shadow-lg animate-in slide-in-from-left duration-200" dir="rtl">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-[#243047] flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">معلومات المحادثة</h3>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-[#172033] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Card */}
      <div className="p-5 flex flex-col items-center border-b border-slate-200 dark:border-[#243047] text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-2xl overflow-hidden shadow-xs border-2 border-slate-200 dark:border-[#243047]">
          {avatar ? (
            <img src={avatar} alt={title} className="w-full h-full object-cover" />
          ) : (
            title[0] || "U"
          )}
        </div>

        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h4>
          {getRoleBadge(role)}
        </div>

        {email && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{email}</span>
          </div>
        )}

        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            isMuted
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              : "bg-slate-100 dark:bg-[#172033] text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          }`}
        >
          {isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          <span>{isMuted ? "كتم الإشعارات" : "تفعيل الإشعارات"}</span>
        </button>
      </div>

      {/* Shared Media / Documents */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#243047] pb-2 mb-3">
          <button
            onClick={() => setActiveTab("MEDIA")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === "MEDIA"
                ? "bg-[#1769D3] text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>الصور ({mediaMessages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("DOCS")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === "DOCS"
                ? "bg-[#1769D3] text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>المستندات ({docMessages.length})</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "MEDIA" ? (
            mediaMessages.length === 0 ? (
              <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">لا توجد صور مشتركة</div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {mediaMessages.map((m) => (
                  <a
                    key={m._id}
                    href={m.attachments?.[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-[#243047] hover:opacity-90 transition-opacity"
                  >
                    <img src={m.attachments?.[0]} alt="Media" className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            )
          ) : docMessages.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">لا توجد مستندات مشتركة</div>
          ) : (
            <div className="space-y-2">
              {docMessages.map((m) => (
                <a
                  key={m._id}
                  href={m.attachments?.[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-[#172033] rounded-xl border border-slate-200 dark:border-[#243047] hover:bg-slate-100 text-xs text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#1769D3] shrink-0" />
                  <span className="truncate flex-1">{m.attachments?.[0]?.split("/").pop() || "مستند"}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePanel;
