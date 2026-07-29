"use client";

import * as React from "react";
import { X, Loader2, Send, Mail } from "lucide-react";
import { useSendStudentNotification } from "@/hooks/useTeacherStudents";
import type { TeacherStudent } from "@/features/teacher/types/student";

interface SendStudentNotificationDialogProps {
  student: TeacherStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SendStudentNotificationDialog({
  student,
  isOpen,
  onClose,
}: SendStudentNotificationDialogProps) {
  const sendNotification = useSendStudentNotification();

  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [errors, setErrors] = React.useState<{ title?: string; message?: string }>({});

  React.useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setMessage("");
      setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = "عنوان الرسالة مطلوب";
    if (!message.trim()) newErrors.message = "محتوى الرسالة مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !validate()) return;

    await sendNotification.mutateAsync({
      id: student._id,
      title: title.trim(),
      message: message.trim(),
    });

    onClose();
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-4 text-right dir-rtl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Send className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                إرسال إشعار مباشر للطالب
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                إلى: {student.fullName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              عنوان الإشعار <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
              }}
              placeholder="مثال: تذكير بموعد التسليم القادم"
              className={`w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border text-xs font-semibold outline-none transition-colors ${
                errors.title
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-semibold">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              نص الرسالة والإشعار <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
              }}
              rows={4}
              placeholder="اكتب تفاصيل التنبيه أو الإشعار المباشر للطالب..."
              className={`w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border text-xs font-semibold outline-none transition-colors resize-none ${
                errors.message
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-slate-200 dark:border-white/10 focus:border-[#F58220]"
              }`}
            />
            {errors.message && (
              <p className="text-xs text-rose-500 font-semibold">{errors.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={sendNotification.isPending}
              className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {sendNotification.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>إرسال الإشعار</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SendStudentNotificationDialog;
