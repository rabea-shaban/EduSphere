"use client";

import * as React from "react";
import { X, Search, UserPlus, Loader2, GraduationCap, ShieldCheck, UserCheck } from "lucide-react";
import chatService from "@/services/chat.service";
import { ChatParticipant, ConversationItem } from "@/types/chat";
import { toast } from "react-hot-toast";

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversation: ConversationItem) => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose, onSelectConversation }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<string>("ALL");
  const [users, setUsers] = React.useState<ChatParticipant[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [creating, setCreating] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async (roleFilter: string, search: string) => {
    try {
      setLoading(true);
      const roleParam = roleFilter === "ALL" ? undefined : roleFilter;
      const data = await chatService.getAssignableUsers(roleParam, search);
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to fetch assignable users:", err);
      toast.error(err.response?.data?.message || "تعذر تحميل قائمة المستخدمين");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      fetchUsers(selectedRole, searchTerm);
    }
  }, [isOpen, selectedRole, searchTerm, fetchUsers]);

  if (!isOpen) return null;

  const handleStartChat = async (user: ChatParticipant) => {
    try {
      setCreating(user._id);
      const conv = await chatService.getOrCreateConversation(user._id);
      onSelectConversation(conv);
      onClose();
    } catch (err: any) {
      console.error("Error creating chat:", err);
      toast.error(err.response?.data?.message || "تعذر بدء المحادثة مع هذا المستخدم");
    } finally {
      setCreating(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "TEACHER":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <GraduationCap className="w-3 h-3" /> معلم
          </span>
        );
      case "ADMIN":
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldCheck className="w-3 h-3" /> إدارة
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <UserCheck className="w-3 h-3" /> طالب
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800/80 bg-neutral-900/60">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <UserPlus className="w-5 h-5 text-blue-500" />
            <span>بدء محادثة جديدة</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 space-y-3 border-b border-neutral-800/80">
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              className="w-full pl-4 pr-10 py-2.5 bg-neutral-800/80 border border-neutral-700/60 rounded-xl text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "ALL", label: "الكل" },
              { id: "TEACHER", label: "المعلمين" },
              { id: "STUDENT", label: "الطلاب" },
              { id: "ADMIN", label: "الإدارة" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRole(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedRole === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-neutral-800/60 text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* User List Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-neutral-800/40">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-neutral-400 space-y-2">
              <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
              <span className="text-xs">جاري جلب القائمة...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              لا يوجد مستخدمون متاحون للتواصل حالياً
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleStartChat(user)}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-800/60 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-semibold text-sm shrink-0 overflow-hidden shadow-inner">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`
                    )}
                  </div>

                  {/* Name & Email */}
                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                        {user.firstName} {user.lastName}
                      </span>
                      {getRoleBadge(user.role)}
                    </div>
                    {user.email && <span className="text-xs text-neutral-400 truncate">{user.email}</span>}
                  </div>
                </div>

                {creating === user._id ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500 shrink-0" />
                ) : (
                  <span className="text-xs font-medium text-blue-400 group-hover:underline shrink-0">مراسلة</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
