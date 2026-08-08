"use client";

import * as React from "react";
import { ChatMessage, Reaction } from "@/types/chat";
import { VoiceMessagePlayer } from "./VoiceMessagePlayer";
import { Check, CheckCheck, Clock, Download, FileText, Reply, Smile, Trash2, Edit3, Copy, AlertCircle, Image as ImageIcon } from "lucide-react";

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

  // System Message Pill
  if (message.messageType === "System") {
    return (
      <div className="flex justify-center my-3">
        <span className="px-3 py-1 bg-neutral-800/80 border border-neutral-700/60 rounded-full text-xs text-neutral-400 font-medium">
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

  // Group reactions by emoji
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
      return <Clock className="w-3.5 h-3.5 text-neutral-400 animate-pulse" />;
    }
    if (message.status === "failed") {
      return <AlertCircle className="w-3.5 h-3.5 text-red-400" />;
    }
    if (message.status === "read" || message.isRead) {
      return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
    }
    if (message.status === "delivered") {
      return <CheckCheck className="w-3.5 h-3.5 text-neutral-400" />;
    }
    return <Check className="w-3.5 h-3.5 text-neutral-400" />;
  };

  const replyObj = typeof message.replyTo === "object" ? message.replyTo : null;

  return (
    <div
      id={`msg-${message._id}`}
      className={`group relative flex flex-col my-1.5 transition-all ${
        isMyMessage ? "items-start" : "items-end"
      }`}
      dir="rtl"
    >
      <div className="relative max-w-[85%] sm:max-w-[70%] flex flex-col">
        {/* Reply Indicator Preview Box */}
        {replyObj && (
          <div
            onClick={() => replyObj._id && onJumpToReply?.(replyObj._id)}
            className={`cursor-pointer mb-1 p-2 rounded-xl text-xs border-r-4 transition-all ${
              isMyMessage
                ? "bg-blue-900/40 border-blue-400 text-blue-100 hover:bg-blue-900/60"
                : "bg-neutral-800/80 border-blue-500 text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            <div className="font-semibold text-[11px] text-blue-400">
              ↩ الرد على:
            </div>
            <div className="truncate opacity-90">{replyObj.message || "مرفق صوي/وسائط"}</div>
          </div>
        )}

        {/* Message Bubble Box */}
        <div
          className={`relative p-3 rounded-2xl shadow-sm border text-sm transition-all ${
            isMyMessage
              ? "bg-blue-600 text-white border-blue-500/40 rounded-tr-sm"
              : "bg-neutral-800 text-neutral-100 border-neutral-700/60 rounded-tl-sm"
          }`}
        >
          {/* Sender Name for group or recipient view */}
          {!isMyMessage && senderObj && (
            <span className="block font-semibold text-xs text-blue-400 mb-1">
              {senderObj.firstName} {senderObj.lastName}
            </span>
          )}

          {/* Render Text Content */}
          {message.message && message.messageType !== "Audio" && (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>
          )}

          {/* Render Voice Message */}
          {message.messageType === "Audio" && message.attachments?.[0] && (
            <VoiceMessagePlayer src={message.attachments[0]} isMyMessage={isMyMessage} />
          )}

          {/* Render Image Message */}
          {message.messageType === "Image" && message.attachments?.[0] && (
            <div className="mt-1.5 overflow-hidden rounded-xl border border-black/20">
              <img
                src={message.attachments[0]}
                alt="Image attachment"
                onClick={() => setShowImageModal(true)}
                className="max-h-64 w-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              />
            </div>
          )}

          {/* Render Document / File Message */}
          {message.messageType === "Document" && message.attachments?.[0] && (
            <a
              href={message.attachments[0]}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1.5 flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                isMyMessage
                  ? "bg-blue-700/50 border-blue-400/40 hover:bg-blue-700"
                  : "bg-neutral-900 border-neutral-700 hover:bg-neutral-900/80"
              }`}
            >
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <FileText className="w-5 h-5" />
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

          {/* Message Timestamp & Status Indicator */}
          <div className={`flex items-center gap-1.5 mt-1 text-[10px] font-mono select-none ${
            isMyMessage ? "text-blue-100/80 justify-end" : "text-neutral-400 justify-start"
          }`}>
            {message.edited && <span>(معدل)</span>}
            <span>{formatTime(message.createdAt)}</span>
            {renderStatus()}
          </div>
        </div>

        {/* Hover / Long-press Floating Action Bar */}
        <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-neutral-900/90 border border-neutral-700 rounded-full px-2 py-1 shadow-lg z-20 ${
          isMyMessage ? "-right-12" : "-left-12"
        }`}>
          {/* Quick Reaction Button */}
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="p-1 text-neutral-400 hover:text-amber-400 transition-colors"
            title="تفاعل"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>

          {/* Reply Button */}
          <button
            onClick={() => onReply?.(message)}
            className="p-1 text-neutral-400 hover:text-blue-400 transition-colors"
            title="رد"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>

          {/* Copy Button */}
          {message.message && (
            <button
              onClick={handleCopy}
              className="p-1 text-neutral-400 hover:text-white transition-colors"
              title="نسخ"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Edit Button */}
          {canEdit && (
            <button
              onClick={() => onEdit?.(message)}
              className="p-1 text-neutral-400 hover:text-amber-400 transition-colors"
              title="تعديل"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Button */}
          {canDelete && (
            <button
              onClick={() => message._id && onDelete?.(message._id)}
              className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
              title="حذف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Emoji Quick Picker Popup */}
        {showPicker && (
          <div className="absolute top-8 right-0 z-30 flex items-center gap-1 bg-neutral-900 border border-neutral-700 p-1.5 rounded-2xl shadow-xl animate-in zoom-in-95 duration-150">
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

        {/* Reactions Pill Display */}
        {reactionsGrouped.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1">
            {reactionsGrouped.map((rg) => (
              <button
                key={rg.emoji}
                onClick={() => message._id && onReact?.(message._id, rg.emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-all ${
                  rg.hasReacted
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-300 font-semibold"
                    : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                <span>{rg.emoji}</span>
                <span className="text-[10px]">{rg.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image Fullscreen Modal */}
      {showImageModal && message.attachments?.[0] && (
        <div
          onClick={() => setShowImageModal(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <img src={message.attachments[0]} alt="Full view" className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl" />
        </div>
      )}
    </div>
  );
};

export default MessageItem;
