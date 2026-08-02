"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Check,
  CheckCheck,
  Sparkles,
  Loader2,
  X,
  GraduationCap,
  UserPlus,
  Phone,
  Users,
  Plus,
  MoreVertical,
  LogOut,
  Trash2,
  Ban,
  Eraser,
  FileText,
  Download,
  ShieldCheck,
  ArrowRight,
  Video,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthContext } from "@/providers/auth-provider";
import { useChat } from "@/hooks/useChat";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { CreateGroupModal } from "@/components/chat/CreateGroupModal";
import { VoiceRecorderButton } from "@/components/chat/VoiceRecorderButton";
import { AudioMessage } from "@/components/chat/audio/AudioMessage";
import { useVoiceCall } from "@/hooks/useVoiceCall";
import { VoiceCallModal } from "@/components/chat/VoiceCallModal";

export default function TeacherChatPage() {
  const searchParams = useSearchParams();
  const targetStudentId = searchParams.get("studentId");
  const { user: currentUser } = useAuthContext();

  const [isUploading, setIsUploading] = React.useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isVoiceMode, setIsVoiceMode] = React.useState(false);

  const voiceCall = useVoiceCall();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Consume Master useChat hook
  const {
    conversations,
    activeConversation,
    activeOtherParticipant: activeStudent,
    selectConversation,
    searchTerm,
    setSearchTerm,
    globalSearchResults,
    isSearchingGlobal,
    startChatWithUser,
    createNewGroup,
    leaveGroup,
    deleteGroup,
    clearChat,
    isLoadingConversations,
    messages,
    inputMessage,
    setInputMessage,
    attachments,
    setAttachments,
    handleSendMessage,
    sendTyping,
    sendVoiceMessage,
    isTyping,
    isUserOnline,
    isLoadingMessages,
    isSending,
  } = useChat({
    storageKey: "teacher_last_conv_id",
    targetUserId: targetStudentId,
  });

  const isGroup = activeConversation?.conversationType === "Group";
  const groupAdminId = typeof activeConversation?.groupAdmin === "object" ? activeConversation.groupAdmin?._id : activeConversation?.groupAdmin;
  const isGroupAdmin = isGroup && groupAdminId === currentUser?._id;
  const isStudentOnline = React.useMemo(() => {
    if (!activeStudent?._id) return false;
    if (isUserOnline(activeStudent._id)) return true;
    if ((activeStudent as any)?.lastActiveAt) {
      const diff = Date.now() - new Date((activeStudent as any).lastActiveAt).getTime();
      return diff < 60000; // Online if active in last 60 seconds
    }
    return false;
  }, [activeStudent, isUserOnline]);

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Unified Cloudflare R2 File Upload Handler (Supports images, videos, documents, audio)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("folder", "chat");

    setIsUploading(true);
    try {
      const res = await api.post("/upload/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fileUrl = res.data?.data?.url || res.data?.url;
      if (fileUrl) {
        setAttachments((prev) => [...prev, fileUrl]);
        toast.success("تم رفع الملف بنجاح إلى Cloudflare R2 ☁️");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "فشل رفع الملف إلى السحابة");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Actions Handlers
  const handleLeaveGroup = async () => {
    if (!activeConversation) return;
    if (confirm("هل أنت تأكد من خروجك من المجموعة؟")) {
      try {
        await leaveGroup(activeConversation._id);
        toast.success("تم الخروج من المجموعة بنجاح");
        setIsMenuOpen(false);
      } catch (err: any) {
        toast.error("فشل الخروج من المجموعة");
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (!activeConversation) return;
    if (confirm("هل أنت تأكد من حذف هذه المجموعة نهائياً لجميع الأعضاء؟")) {
      try {
        await deleteGroup(activeConversation._id);
        toast.success("تم حذف المجموعة بنجاح");
        setIsMenuOpen(false);
      } catch (err: any) {
        toast.error("فشل حذف المجموعة");
      }
    }
  };

  const handleClearChat = async () => {
    if (!activeConversation) return;
    if (confirm("هل أنت تأكد من مسح محتوى هذا الشات؟")) {
      try {
        await clearChat(activeConversation._id);
        toast.success("تم مسح محتوى الشات بنجاح");
        setIsMenuOpen(false);
      } catch (err: any) {
        toast.error("فشل مسح الشات");
      }
    }
  };

  const handleBlockUser = async () => {
    if (!activeStudent?._id) return;
    if (confirm("هل أنت تأكد من حظر هذا المستخدم؟")) {
      try {
        await api.patch(`/users/${activeStudent._id}`, { isBlocked: true });
        toast.success("تم حظر المستخدم بنجاح");
        setIsMenuOpen(false);
      } catch (err: any) {
        toast.error("فشل حظر المستخدم");
      }
    }
  };

  const renderAttachment = (url: string, idx: number) => {
    const ext = url.split(".").pop()?.toLowerCase() || "";
    const isImg = ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext);
    const isAudio = ["mp3", "wav", "ogg", "m4a", "aac"].includes(ext);
    const isVideo = ["mp4", "webm", "mov", "mkv"].includes(ext);

    if (isImg) {
      return (
        <a key={idx} href={url} target="_blank" rel="noreferrer" className="block mt-1 max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="مرفق" className="rounded-xl max-h-56 max-w-full w-auto object-cover border border-white/20 hover:opacity-90 transition-opacity" />
        </a>
      );
    }
    if (isAudio) {
      return (
        <div key={idx} className="mt-1">
          <audio controls src={url} className="w-full h-8 rounded-lg" />
        </div>
      );
    }
    if (isVideo) {
      return (
        <div key={idx} className="mt-1 max-w-full">
          <video controls src={url} className="rounded-xl max-h-56 max-w-full w-full" />
        </div>
      );
    }
    return (
      <a
        key={idx}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 p-2 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[11px] font-semibold truncate mt-1"
      >
        <FileText className="h-4 w-4 text-[#F58220] shrink-0" />
        <span className="truncate flex-1">مستند {idx + 1} ({ext.toUpperCase()})</span>
        <Download className="h-3.5 w-3.5 shrink-0" />
      </a>
    );
  };

  return (
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-100px)] flex flex-col md:flex-row rounded-3xl bg-white dark:bg-[#071C3B] border border-slate-200/80 dark:border-white/10 shadow-xl overflow-hidden text-right" dir="rtl">
      
      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onCreateGroup={createNewGroup}
      />

      {/* ========================================================== */}
      {/* 1. RIGHT SIDEBAR: STUDENT CONVERSATIONS & GLOBAL USER SEARCH */}
      {/* ========================================================== */}
      <div className={`w-full md:w-80 border-b md:border-b-0 md:border-l border-slate-200/80 dark:border-white/10 flex flex-col bg-slate-50/50 dark:bg-black/20 ${activeConversation ? "hidden md:flex" : "flex flex-1"}`}>
        
        <div className="p-4 border-b border-slate-200/80 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#0F172A] dark:text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#F7941D]" />
              <span>محادثات الطلاب</span>
            </h2>
            <Button
              size="sm"
              onClick={() => setIsGroupModalOpen(true)}
              className="h-8 px-2.5 text-[11px] font-bold bg-[#1E5DB8] hover:bg-[#123D7A] text-white rounded-xl flex items-center gap-1 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>جروب جديد</span>
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute top-3 right-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="البحث بالاسم أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pr-9 pl-4 text-xs font-semibold rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-[#0B2D5B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E73D8]"
            />
            {isSearchingGlobal && (
              <Loader2 className="absolute top-3 left-3 h-4 w-4 animate-spin text-[#1E73D8]" />
            )}
          </div>
        </div>

        {/* Search Results in Platform (by name / phone) */}
        {searchTerm.trim().length >= 2 && globalSearchResults.length > 0 && (
          <div className="p-3 bg-blue-50/80 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black text-[#0B2D5B] dark:text-blue-300">
              <span className="flex items-center gap-1">
                <UserPlus className="h-3.5 w-3.5 text-[#F58220]" />
                <span>نتائج المنصة ({globalSearchResults.length})</span>
              </span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin">
              {globalSearchResults.map((user) => (
                <div
                  key={user._id}
                  className="p-2 rounded-xl bg-white dark:bg-white/10 border border-slate-200/70 dark:border-white/10 flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-[#0B2D5B] text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {user.firstName?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#0B2D5B] dark:text-white truncate">
                        {`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 truncate">
                        {(user as any).phone && (
                          <span className="flex items-center gap-0.5">
                            <Phone className="h-2.5 w-2.5" />
                            {(user as any).phone}
                          </span>
                        )}
                        <span className="bg-slate-200 dark:bg-white/10 px-1.5 py-0.2 rounded text-[9px]">
                          {user.role === "STUDENT" ? "طالب" : "معلم"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => startChatWithUser(user)}
                    className="h-7 px-2.5 text-[10px] font-bold bg-[#F58220] hover:bg-[#e0711a] text-white rounded-lg shrink-0"
                  >
                    محادثة 💬
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversations Feed */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {isLoadingConversations ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#1E73D8]" />
              <span className="text-xs">جاري تحميل المحادثات...</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <GraduationCap className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-500">لا توجد استفسارات حالياً</p>
              <p className="text-[11px] text-slate-400">ابحث عن أي طالب بالاسم أو رقم الهاتف لبدء التواصل أو أنشئ مجموعة</p>
            </div>
          ) : (
            conversations.map((conv, idx) => {
              const isGroupConv = conv.conversationType === "Group";
              const other = conv.participants?.find((p) => p._id !== currentUser?._id) || conv.participants?.[0];
              const isSelected = activeConversation?._id === conv._id;

              const displayName = isGroupConv
                ? conv.groupTitle || "مجموعة دراسية"
                : (other?.firstName || other?.lastName)
                ? `${other.firstName || ""} ${other.lastName || ""}`.trim()
                : (other?.username || "طالب مجتهد");

              const lastMsgText = typeof conv.lastMessage === "object" ? conv.lastMessage?.message : "بدء المحادثة";
              const online = isGroupConv ? false : isUserOnline(other?._id);

              return (
                <button
                  key={conv._id ? `${conv._id}_${idx}` : `conv_${idx}`}
                  onClick={() => selectConversation(conv)}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all duration-200 text-right cursor-pointer ${
                    isSelected
                      ? "bg-[#1E5DB8] text-white shadow-md"
                      : "hover:bg-slate-100 dark:hover:bg-white/5 text-[#0F172A] dark:text-slate-200"
                  }`}
                >
                  <div className="relative shrink-0">
                    {isGroupConv ? (
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#123D7A] to-[#1E5DB8] text-white flex items-center justify-center font-black">
                        <Users className="h-5 w-5" />
                      </div>
                    ) : other?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={other.avatar} alt={displayName} className="h-11 w-11 rounded-xl object-cover border border-white/20" />
                    ) : (
                      <div className="h-11 w-11 rounded-xl bg-[#F7941D] text-white flex items-center justify-center font-black text-sm">
                        {displayName.charAt(0)}
                      </div>
                    )}

                    {!isGroupConv && (
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-[#071C3B] ${online ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
                        title={online ? "متصل الآن" : "غير متصل"}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-[#0B2D5B] dark:text-white"}`}>
                        {displayName}
                      </span>
                      {conv.lastMessageAt && (
                        <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                          {new Date(conv.lastMessageAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>

                    <p className={`text-[11px] truncate mt-0.5 ${isSelected ? "text-blue-100/90" : "text-slate-500 dark:text-slate-400"}`}>
                      {isGroupConv ? `👥 ${conv.participants?.length || 0} عضو · ${lastMsgText}` : lastMsgText}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. LEFT MAIN CHAT WINDOW */}
      {/* ========================================================== */}
      <div className={`flex-1 flex flex-col h-full bg-white dark:bg-[#071C3B] ${activeConversation ? "flex" : "hidden md:flex"}`}>
        {activeConversation ? (
          <>
            {/* Header Chat Toolbar */}
            <div className="p-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-black/20">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => selectConversation(null)}
                  className="md:hidden h-9 w-9 rounded-xl text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 shrink-0"
                  title="الرجوع للمحادثات"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <div className="relative">
                  {isGroup ? (
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#123D7A] to-[#1E5DB8] text-white flex items-center justify-center font-black">
                      <Users className="h-5 w-5" />
                    </div>
                  ) : activeStudent?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeStudent.avatar} alt="Student" className="h-10 w-10 rounded-xl object-cover border border-[#F7941D]/40" />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-[#F7941D] text-white flex items-center justify-center font-black">
                      {activeStudent?.firstName?.charAt(0) || "S"}
                    </div>
                  )}

                  {!isGroup && (
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-[#071C3B] ${isStudentOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-1.5">
                    <span>
                      {isGroup
                        ? activeConversation.groupTitle || "مجموعة دراسية"
                        : `${activeStudent?.firstName || ""} ${activeStudent?.lastName || ""}`.trim() || activeStudent?.username}
                    </span>
                  </h3>

                  {isGroup ? (
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      مجموعة تضم {activeConversation.participants?.length || 0} أعضاء
                    </span>
                  ) : (
                    <span className={`text-[11px] font-bold flex items-center gap-1.5 ${isStudentOnline ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                      <span className={`h-2 w-2 rounded-full ${isStudentOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                      <span>{isStudentOnline ? "متصل الآن" : "غير متصل"}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons & Dropdown Menu */}
              <div className="flex items-center gap-2 relative">
                {!isGroup && activeStudent && activeConversation?._id && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const targetId = activeStudent?._id;
                        const convId = activeConversation?._id;
                        if (!targetId || !convId) return;

                        const recipientName = `${activeStudent.firstName || ""} ${activeStudent.lastName || ""}`.trim() || activeStudent.username || "مستخدم المنصة";
                        const callerName = `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.username || "مستخدم المنصة";
                        voiceCall.startCall(
                          targetId,
                          recipientName,
                          activeStudent.avatar,
                          convId,
                          callerName,
                          "video"
                        );
                      }}
                      className="h-9 w-9 rounded-xl border-[#E5EAF2] dark:border-white/10 text-[#1E5DB8] hover:bg-[#EAF3FF] dark:hover:bg-white/10"
                      title="مكالمة فيديو"
                    >
                      <Video className="h-4 w-4 text-[#1E5DB8]" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const targetId = activeStudent?._id;
                        const convId = activeConversation?._id;
                        if (!targetId || !convId) return;

                        const recipientName = `${activeStudent.firstName || ""} ${activeStudent.lastName || ""}`.trim() || activeStudent.username || "مستخدم المنصة";
                        const callerName = `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim() || currentUser?.username || "مستخدم المنصة";
                        voiceCall.startCall(
                          targetId,
                          recipientName,
                          activeStudent.avatar,
                          convId,
                          callerName,
                          "voice"
                        );
                      }}
                      className="h-9 w-9 rounded-xl border-[#E5EAF2] dark:border-white/10 text-[#1E5DB8] hover:bg-[#EAF3FF] dark:hover:bg-white/10"
                      title="مكالمة صوتية"
                    >
                      <Phone className="h-4 w-4 text-[#1E5DB8]" />
                    </Button>
                  </>
                )}

                <span className="text-xs font-bold text-[#1E5DB8] bg-[#EAF3FF] dark:bg-white/10 px-3 py-1 rounded-full border border-[#E5EAF2] dark:border-white/10 hidden sm:inline-block">
                  {isGroup ? "مجموعة دراسية 👥" : activeStudent?.role === "STUDENT" ? "طالب مسجل" : "مستخدم في المنصة"}
                </span>

                {/* 3-dots Menu Button */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="h-9 w-9 rounded-xl border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-200"
                    title="خيارات الشات"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>

                  {isMenuOpen && (
                    <div className="absolute left-0 top-11 w-48 bg-white dark:bg-[#071C3B] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-1.5 z-30 space-y-1 text-right">
                      {isGroup ? (
                        <>
                          <button
                            onClick={handleLeaveGroup}
                            className="w-full p-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-white/5 rounded-xl flex items-center justify-between"
                          >
                            <span>الخروج من المجموعة</span>
                            <LogOut className="h-3.5 w-3.5" />
                          </button>

                          {isGroupAdmin && (
                            <button
                              onClick={handleDeleteGroup}
                              className="w-full p-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-white/5 rounded-xl flex items-center justify-between"
                            >
                              <span>حذف المجموعة بالكامل</span>
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={handleBlockUser}
                          className="w-full p-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-white/5 rounded-xl flex items-center justify-between"
                        >
                          <span>حظر المستخدم</span>
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button
                        onClick={handleClearChat}
                        className="w-full p-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-1.5"
                      >
                        <span>مسح محتوى الشات</span>
                        <Eraser className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin bg-slate-50/80 dark:bg-[#041329]/80">
              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-2 text-slate-400">
                  <Loader2 className="h-7 w-7 animate-spin text-[#1E73D8]" />
                  <span className="text-xs">جاري تحميل الرسائل...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <Sparkles className="h-10 w-10 text-[#F7941D] mx-auto animate-pulse" />
                  <h4 className="text-sm font-bold text-[#0B2D5B] dark:text-white">الرد على استفسار الطالب</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    ارسل توضيحاتك وإجاباتك للطالب لمساعدته في تحصيل المقرر.
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const senderId = typeof msg.senderId === "object" ? msg.senderId?._id : msg.senderId;
                  const isMe = senderId === currentUser?._id;
                  const senderName = typeof msg.senderId === "object" ? `${msg.senderId?.firstName || ""} ${msg.senderId?.lastName || ""}`.trim() : "";
                  const msgTimestamp = new Date(msg.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
                  const senderObj = typeof msg.senderId === "object" ? msg.senderId : null;

                  // ─── System / Call Log Message Pill ─────────────────────────
                  const isSystemCallMsg = msg.messageType === "System" || msg.message?.includes("مكالمة");
                  if (isSystemCallMsg) {
                    const isMissed = msg.message?.includes("فائتة");
                    return (
                      <motion.div
                        key={msg._id ? `${msg._id}_${idx}` : `msg_${idx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center my-2 select-none"
                      >
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border shadow-2xs ${
                            isMissed
                              ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800/40"
                              : "bg-blue-50 dark:bg-blue-950/40 text-[#1E5DB8] dark:text-blue-300 border-blue-200 dark:border-blue-800/40"
                          }`}
                        >
                          {msg.message?.includes("فيديو") ? (
                            <Video className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                          )}
                          <span>{msg.message}</span>
                          <span className="text-[9.5px] opacity-70 font-mono mr-1">{msgTimestamp}</span>
                        </div>
                      </motion.div>
                    );
                  }

                  // ─── Premium Audio Message Card ───────────────────
                  const isAudioMessage =
                    msg.messageType === "Audio" &&
                    msg.attachments &&
                    msg.attachments.length > 0 &&
                    ["mp3", "wav", "ogg", "m4a", "aac", "webm", "flac"].some((ext) =>
                      msg.attachments![0].split("?")[0].toLowerCase().endsWith(ext)
                    );

                  if (isAudioMessage) {
                    return (
                      <motion.div
                        key={msg._id ? `${msg._id}_${idx}` : `msg_${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${isMe ? "items-start" : "items-end"}`}
                      >
                        {isGroup && !isMe && senderName && (
                          <span className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">{senderName}</span>
                        )}
                        <AudioMessage
                          src={msg.attachments![0]}
                          timestamp={msgTimestamp}
                          isSent={isMe}
                          isRead={msg.isRead || msg.status === "read"}
                          status={msg.status}
                          senderName={!isMe ? senderName : undefined}
                          senderAvatar={!isMe ? senderObj?.avatar : undefined}
                        />
                      </motion.div>
                    );
                  }

                  const hasText = Boolean(msg.message && msg.message.trim());
                  const hasAttachments = Boolean(msg.attachments && msg.attachments.length > 0);

                  return (
                    <motion.div
                      key={msg._id ? `${msg._id}_${idx}` : `msg_${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isMe ? "items-start" : "items-end"}`}
                    >
                      {isGroup && !isMe && senderName && (
                        <span className="text-[10px] font-bold text-slate-400 mb-0.5 px-1">
                          {senderName}
                        </span>
                      )}

                      {/* Standalone attachments (no text) */}
                      {!hasText && hasAttachments ? (
                        <div className="space-y-2 max-w-[85vw] sm:max-w-md">
                          {msg.attachments!.map((url, aIdx) => renderAttachment(url, aIdx))}
                        </div>
                      ) : (
                        /* Text bubble (with optional attachments inside) */
                        <div
                          className={`max-w-[85vw] sm:max-w-md ${hasAttachments ? "p-2" : "p-3.5"} rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isMe
                              ? "bg-[#1E5DB8] text-white rounded-br-none"
                              : "bg-white dark:bg-[#123D7A] text-[#0F172A] dark:text-slate-100 border border-[#E5EAF2] dark:border-white/10 rounded-bl-none"
                          }`}
                        >
                          {hasAttachments && (
                            <div className={hasText ? "mb-1.5 space-y-1.5" : "space-y-1.5"}>
                              {msg.attachments!.map((url, aIdx) => renderAttachment(url, aIdx))}
                            </div>
                          )}

                          {hasText && <div className="px-1 py-0.5">{msg.message}</div>}
                        </div>
                      )}

                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[10px] font-medium text-slate-400">
                          {msgTimestamp}
                        </span>
                        {isMe && (
                          <span className="text-slate-400">
                            {msg.isRead || msg.status === "read" ? (
                              <span title="تم القراءة"><CheckCheck className="h-3.5 w-3.5 text-sky-400" /></span>
                            ) : msg.status === "delivered" ? (
                              <span title="تم الاستلام"><CheckCheck className="h-3.5 w-3.5 text-slate-300" /></span>
                            ) : (
                              <span title="تم الإرسال"><Check className="h-3.5 w-3.5 text-slate-300" /></span>
                            )}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#F7941D] animate-pulse">
                  <span>أحد الأعضاء يكتب الآن...</span>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="p-2 px-4 bg-slate-100 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">المرفقات ({attachments.length}):</span>
                {attachments.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <span className="text-xs bg-white dark:bg-white/10 px-2 py-1 rounded-lg border border-slate-200 text-blue-600 truncate max-w-xs inline-block">
                      ☁️ ملف {idx + 1}
                    </span>
                    <button
                      onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Form Bar */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#071C3B] flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar"
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="rounded-2xl h-11 w-11 bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/15 text-slate-600 dark:text-slate-200 hover:bg-slate-200"
                title="إرفاق ملف أو صورة أو فيديو"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin text-[#1E73D8]" /> : <Paperclip className="h-4 w-4" />}
              </Button>

              {/* Voice Recorder — expands to fill the row while recording */}
              <VoiceRecorderButton
                disabled={isUploading}
                onVoiceSent={async (audioUrl) => {
                  await sendVoiceMessage(audioUrl);
                }}
              />

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  sendTyping();
                }}
                placeholder="اكتب ردك أو الإجابة هنا..."
                className="flex-1 h-11 px-4 text-xs font-semibold rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-[#0B2D5B] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E73D8]"
              />

              <Button
                type="submit"
                disabled={isSending || (!inputMessage.trim() && attachments.length === 0)}
                className="h-11 px-5 rounded-2xl bg-[#F7941D] hover:bg-[#E67E00] text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>إرسال الرد</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <MessageSquare className="h-12 w-12 text-[#1E5DB8] animate-bounce" />
            <h3 className="text-base font-black text-[#0F172A] dark:text-white">اختر محادثة أو أنشئ جروب جديد</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              يمكنك التواصل الفردي أو إجراء مكالمات صوتية مباشرة وإنشاء مجموعات دراسية وتفاعلية مع طلابك ومعلميك.
            </p>
          </div>
        )}
      </div>

      {/* Real-time Voice & Video Call Overlay Modal */}
      <VoiceCallModal
        callState={voiceCall.callState}
        callType={voiceCall.callType}
        targetUser={voiceCall.targetUser}
        callSeconds={voiceCall.callSeconds}
        isMuted={voiceCall.isMuted}
        isVideoOff={voiceCall.isVideoOff}
        localVideoRef={voiceCall.localVideoRef}
        remoteVideoRef={voiceCall.remoteVideoRef}
        onAccept={voiceCall.acceptCall}
        onReject={voiceCall.rejectCall}
        onEnd={voiceCall.endCall}
        onToggleMute={voiceCall.toggleMute}
        onToggleVideo={voiceCall.toggleVideo}
      />
    </div>
  );
}
