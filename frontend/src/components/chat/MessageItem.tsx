"use client";

import * as React from "react";
import { ChatMessage } from "@/types/chat";
import { VoiceMessagePlayer } from "./VoiceMessagePlayer";
import { Check, CheckCheck, Clock, Download, FileText, Reply, Smile, Trash2, Edit3, Copy, AlertCircle } from "lucide-react";

interface MessageItemProps {
  message: ChatMessage;
  currentUserId: string;
  currentUserRole?: string;
  onReply?: (msg: ChatMessage) => void;
  onReact?: (msgId: string, emoji: string) => void;
  onEdit?: (msg: ChatMessage) => void;
  onDelete?: (msgId: string) => void;
  onJumpToReply?: (replyId: string) => void;
}

const POPULAR_EMOJIS = ["👍", "❤️", "😂", "😮", "😢"];

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  currentUserId,
  currentUserRole,
  onReply,
  onReact,
  onEdit,
  onDelete,
  onJumpToReply,
}) => {
  const [showPicker, setShowPicker] = React.useState(false);
  const [showImageModal, setShowImageModal] = React.useState(false);

  const senderObj = typeof message.senderId === "object" ? message.senderId : null;
  const senderIdStr = senderObj ? senderObj._id : (message.senderId as string);
  const isMyMessage = senderIdStr === currentUserId;

  const isAdmin = currentUserRole === "ADMIN" || currentUserRole === "SUPER_ADMIN";
  const canEdit = isMyMessage && message.messageType === "Text";
  const canDelete = isMyMessage || isAdmin;

  if (message.messageType === "System") {
    return (
      <div className="flex justify-center my-3 max-w-full">
        <span className="px-3 py-1 bg-slate-200/80 dark:bg-[#172033] border border-slate-300 dark:border-[#243047] rounded-full text-[11px] text-slate-600 dark:text-slate-400 font-medium truncate max-w-[90%]">
          {message.message}
        </span>
      </div>
    );
  }

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Intl.DateTimeFormat("ar-EG", { hour: "numeric", minute: "numeric" }).format(new Date(dateStr));
    } catch {
      return "";
    }
  };

  const handleCopy = () => {
    if (message.message) {
      navigator.clipboard.writeText(message.message);
    }
  };

  const reactionsGrouped = React.useMemo(() => {
    if (!message.reactions || message.reactions.length === 0) return [];
    const map = new Map<string, { emoji: string; count: number; hasReacted: boolean }>();
    message.reactions.forEach((r) => {
      const existing = map.get(r.emoji) || { emoji: r.emoji, count: 0, hasReacted: false };
      existing.count += 1;
      if (r.userId === currentUserId) existing.hasReacted = true;
      map.set(r.emoji, existing);
    });
    return Array.from(map.values());
  }, [message.reactions, currentUserId]);

  const renderStatus = () => {
    if (!isMyMessage) return null;
    if (message.status === "sending") {
      return <Clock className="w-3.5 h-3.5 text-slate-300 animate-pulse" />;
    }
    if (message.status === "failed") {
      return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
    }
    if (message.status === "read" || message.isRead) {
      return <CheckCheck className="w-3.5 h-3.5 text-sky-300 dark:text-blue-300" />;
    }
    if (message.status === "delivered") {
      return <CheckCheck className="w-3.5 h-3.5 text-slate-300 dark:text-slate-400" />;
    }
    return <Check className="w-3.5 h-3.5 text-slate-300 dark:text-slate-400" />;
  };

  const replyObj = typeof message.replyTo === "object" ? message.replyTo : null;

  return (
    <div
      id={`msg-${message._id}`}
      className={`group relative flex flex-col my-1.5 min-w-0 transition-all ${
        isMyMessage ? "items-start" : "items-end"
      }`}
      dir="rtl"
    >
      <div className="relative max-w-[88%] sm:max-w-[70%] flex flex-col min-w-0">
        {/* Reply Indicator Box */}
        {replyObj && (
          <div
            onClick={() => replyObj._id && onJumpToReply?.(replyObj._id)}
            className={`cursor-pointer mb-1 p-2 rounded-xl text-xs border-s-4 min-w-0 transition-all ${
              isMyMessage
                ? "bg-blue-900/30 border-blue-400 text-blue-100 hover:bg-blue-900/50"
                : "bg-slate-200/80 dark:bg-[#172033] border-[#1769D3] text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            <div className="font-semibold text-[11px] text-[#1769D3] dark:text-blue-400">
              ↩ الرد على:
            </div>
            <div className="truncate opacity-90">{replyObj.message || "مرفق صوي/وسائط"}</div>
          </div>
        )}

        {/* Message Bubble Box */}
        <div
          className={`relative p-3 rounded-2xl shadow-xs border text-xs sm:text-sm min-w-0 transition-all ${
            isMyMessage
              ? "bg-[#1769D3] dark:bg-[#3B82F6] text-white border-blue-500/30 rounded-tr-xs"
              : "bg-white dark:bg-[#172033] text-slate-900 dark:text-slate-100 border-slate-200 dark:border-[#243047] rounded-tl-xs"
          }`}
        >
          {!isMyMessage && senderObj && (
            <span className="block font-semibold text-xs text-[#1769D3] dark:text-blue-400 mb-1 truncate">
              {senderObj.firstName} {senderObj.lastName}
            </span>
          )}

          {/* Text Content */}
          {message.message && message.messageType !== "Audio" && (
            <p className="whitespace-pre-wrap break-words min-w-0 leading-relaxed [overflow-wrap:anywhere] [word-break:break-word]">
              {message.message}
            </p>
          )}

          {/* Voice Message Player */}
          {message.messageType === "Audio" && message.attachments?.[0] && (
            <VoiceMessagePlayer src={message.attachments[0]} isMyMessage={isMyMessage} />
          )}

          {/* Image Message */}
          {message.messageType === "Image" && message.attachments?.[0] && (
            <div className="mt-1.5 w-full max-w-full sm:max-w-[320px] overflow-hidden rounded-xl border border-black/10">
              <img
                src={message.attachments[0]}
                alt="Image attachment"
                onClick={() => setShowImageModal(true)}
                className="max-h-60 sm:max-h-72 w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              />
            </div>
          )}

          {/* Document / File Message */}
          {message.messageType === "Document" && message.attachments?.[0] && (
            <a
              href={message.attachments[0]}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1.5 flex items-center gap-2 sm:gap-3 p-2.5 rounded-xl border min-w-0 max-w-full transition-colors ${
                isMyMessage
                  ? "bg-blue-700/40 border-blue-400/40 hover:bg-blue-700/60"
                  : "bg-slate-50 dark:bg-[#0B1220] border-slate-200 dark:border-[#243047] hover:bg-slate-100"
              }`}
            >
              <div className="p-2 rounded-lg bg-blue-500/20 text-[#1769D3] dark:text-blue-400 shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">
                  {message.attachments[0].split("/").pop() || "مستند مرفق"}
                </div>
                <div className="text-[10px] opacity-75">انقر للتنزيل</div>
              </div>
              <Download className="w-4 h-4 shrink-0" />
            </a>
          )}

          {/* Timestamp & Status Icon */}
          <div className={`flex items-center gap-1.5 mt-1 text-[10px] font-mono select-none ${
            isMyMessage ? "text-blue-100/90 justify-end" : "text-slate-400 dark:text-slate-500 justify-start"
          }`}>
            {message.edited && <span>(معدل)</span>}
            <span>{formatTime(message.createdAt)}</span>
            {renderStatus()}
          </div>
        </div>

        {/* Floating Action Menu */}
        <div className={`absolute -top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#243047] rounded-full px-1.5 py-0.5 shadow-md z-20 ${
          isMyMessage ? "start-0 sm:-start-10" : "end-0 sm:-end-10"
        }`}>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
            title="تفاعل"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onReply?.(message)}
            className="p-1 text-slate-400 hover:text-[#1769D3] transition-colors"
            title="رد"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>

          {message.message && (
            <button
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="نسخ"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => onEdit?.(message)}
              className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
              title="تعديل"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => message._id && onDelete?.(message._id)}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
              title="حذف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Emoji Quick Picker */}
        {showPicker && (
          <div className="absolute top-6 start-0 z-30 flex items-center gap-1 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#243047] p-1.5 rounded-2xl shadow-xl animate-in zoom-in-95 duration-150">
            {POPULAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  if (message._id) onReact?.(message._id, emoji);
                  setShowPicker(false);
                }}
                className="hover:scale-125 transition-transform text-base p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Reactions Display */}
        {reactionsGrouped.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1">
            {reactionsGrouped.map((rg) => (
              <button
                key={rg.emoji}
                onClick={() => message._id && onReact?.(message._id, rg.emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                  rg.hasReacted
                    ? "bg-blue-500/20 border-blue-500/40 text-[#1769D3] dark:text-blue-300 font-semibold"
                    : "bg-slate-100 dark:bg-[#172033] border-slate-200 dark:border-[#243047] text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <span>{rg.emoji}</span>
                <span className="text-[10px]">{rg.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && message.attachments?.[0] && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <img src={message.attachments[0]} alt="Full view" className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
};

export default MessageItem;
