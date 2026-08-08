"use client";

import * as React from "react";
import { ChatMessage } from "@/types/chat";
import { VoiceRecorderButton } from "./VoiceRecorderButton";
import { Send, Paperclip, X, Smile, Loader2 } from "lucide-react";
import api from "@/services/api";
import { toast } from "react-hot-toast";

interface ChatInputBarProps {
  onSendMessage: (text: string, messageType?: "Text" | "Image" | "Video" | "Audio" | "Document", attachments?: string[]) => void;
  replyingToMessage?: ChatMessage | null;
  onCancelReply?: () => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
}

const EMOJI_LIST = ["😊", "😂", "❤️", "👍", "🔥", "🎉", "👏", "🙏", "😍", "✨", "📚", "🎓", "✅", "💡"];

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  replyingToMessage,
  onCancelReply,
  onTypingStart,
  onTypingStop,
  disabled = false,
}) => {
  const [text, setText] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const typingTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onTypingStart?.();

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      onTypingStop?.();
    }, 2000);
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(trimmed, "Text", []);
    setText("");
    onTypingStop?.();
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    onCancelReply?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/upload/file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data?.data?.url || res.data?.url;
      if (!url) throw new Error("Upload failed");

      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      let type: "Image" | "Document" = "Document";
      if (["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext)) {
        type = "Image";
      }

      onSendMessage(file.name, type, [url]);
      toast.success("تم إرسال المرفق بنجاح");
    } catch (err) {
      console.error("Attachment upload failed:", err);
      toast.error("تعذر رفع الملف، يرجى المحاولة مرة أخرى");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-[#0F172A] border-t border-slate-200 dark:border-[#243047] p-3 flex flex-col gap-2 relative" dir="rtl">
      {/* Reply Bar */}
      {replyingToMessage && (
        <div className="flex items-center justify-between bg-white dark:bg-[#172033] border-s-4 border-[#1769D3] px-3 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-200 animate-in slide-in-from-bottom-2 duration-150 shadow-xs">
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-[#1769D3] dark:text-blue-400">↩ جاري الرد على الرسالة:</span>
            <span className="truncate opacity-80">{replyingToMessage.message || "مرفق صوي/وسائط"}</span>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Toolbar Container */}
      <div className="flex items-end gap-2 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#243047] p-2 rounded-2xl shadow-xs">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.zip,.rar"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-[#1769D3] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-[#172033] rounded-xl transition-colors disabled:opacity-50 shrink-0"
          title="إرفاق ملف أو صورة"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-[#1769D3]" /> : <Paperclip className="w-5 h-5" />}
        </button>

        {/* Voice Recorder Button */}
        <VoiceRecorderButton
          onSendVoice={(url) => onSendMessage("", "Audio", [url])}
          disabled={disabled || isUploading}
        />

        {/* Emoji Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-[#172033] rounded-xl transition-colors shrink-0"
            title="إضافة إيموجي"
          >
            <Smile className="w-5 h-5" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 start-0 z-30 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-[#243047] p-2 rounded-2xl shadow-xl grid grid-cols-7 gap-1 w-64 animate-in zoom-in-95 duration-150">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setText((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#172033] rounded-lg text-lg text-center transition-transform hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Input Area */}
        <div className="flex-1 bg-transparent border-0 focus-within:ring-0">
          <textarea
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            placeholder="اكتب رسالتك هنا... (Enter للإرسال)"
            className="w-full bg-transparent px-2 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none max-h-32 min-h-[38px]"
          />
        </div>

        {/* Non-clipping Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !text.trim() || isUploading}
          className="w-10 h-10 bg-[#1769D3] hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
          title="إرسال الرسالة"
        >
          <Send className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
};

export default ChatInputBar;
