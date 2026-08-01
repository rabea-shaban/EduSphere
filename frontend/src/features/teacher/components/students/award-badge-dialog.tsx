"use client";

import * as React from "react";
import { X, Loader2, Award, Sparkles, CheckCircle2, Lock, Unlock, ShieldAlert } from "lucide-react";
import type { TeacherStudent } from "@/features/teacher/types/student";
import api from "@/services/api";
import { toast } from "react-hot-toast";

interface AwardBadgeDialogProps {
  student: TeacherStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

const BADGE_PRESETS = [
  { title: "وسام التميز والتكريم", icon: "Award", xp: 500 },
  { title: "وسام بطل البرمجة والـ CS", icon: "Code2", xp: 500 },
  { title: "وسام عبقري الرياضيات والفيزياء", icon: "Award", xp: 600 },
  { title: "وسام التتابع والالتزام الأسطوري", icon: "Zap", xp: 750 },
  { title: "وسام التميز الأكاديمي والبحث", icon: "GraduationCap", xp: 1000 },
];

export function AwardBadgeDialog({
  student,
  isOpen,
  onClose,
}: AwardBadgeDialogProps) {
  const [mode, setMode] = React.useState<"GRANT" | "REVOKE">("GRANT");
  const [badgeTitle, setBadgeTitle] = React.useState(BADGE_PRESETS[0].title);
  const [customTitle, setCustomTitle] = React.useState("");
  const [useCustom, setUseCustom] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<{ title?: string; note?: string }>({});

  React.useEffect(() => {
    if (!isOpen) {
      setMode("GRANT");
      setBadgeTitle(BADGE_PRESETS[0].title);
      setCustomTitle("");
      setUseCustom(false);
      setNote("");
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const finalTitle = useCustom ? customTitle.trim() : badgeTitle;

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!finalTitle) newErrors.title = "اسم الوسام مطلوب";
    if (!note.trim()) newErrors.note = "سبب الإجراء أو رسالة التكريم مطلوبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !validate()) return;

    try {
      setIsSubmitting(true);

      const notificationTitle =
        mode === "GRANT"
          ? `🎖️ تهانينا! تم منحك وسام: "${finalTitle}"`
          : `🔒 تم تحديث حالة وسام: "${finalTitle}"`;

      const notificationMessage =
        mode === "GRANT"
          ? `${note.trim()}\n\nتمت إضافة الوسام إلى لوحة الإنجازات الخاصة بك من قبل معلمك.`
          : `ملاحظة المعلم: ${note.trim()}`;

      await api.post("/notifications", {
        recipientId: student._id,
        title: notificationTitle,
        message: notificationMessage,
        type: "Quiz",
        priority: "High",
      });

      if (mode === "GRANT") {
        toast.success(`تم منح وسام "${finalTitle}" بنجاح للطالب ${student.fullName}! 🎖️`);
      } else {
        toast.success(`تم غلق وسام "${finalTitle}" للطالب ${student.fullName} بنجاح.`);
      }

      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "تعذر إكمال العملية حالياً");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right dir-rtl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner">
              <Award className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                إدارة ومنح الأوسمة للطالب
              </h2>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold truncate max-w-xs mt-0.5">
                الطالب: {student.fullName}
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

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
          <button
            type="button"
            onClick={() => setMode("GRANT")}
            className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === "GRANT"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>منح وسام جديد 🏅</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("REVOKE")}
            className={`py-2 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === "REVOKE"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/25"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/50"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>غلق وسام 🔒</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Badge Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200">
                {mode === "GRANT" ? "اختر أو اكتب اسم الوسام:" : "اسم الوسام المراد غلقه:"}{" "}
                <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setUseCustom(!useCustom);
                  if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
                }}
                className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
              >
                {useCustom ? "اختر من الأوسمة الجاهزة" : "+ كتابة اسم وسام مخصص"}
              </button>
            </div>

            {useCustom ? (
              <input
                type="text"
                value={customTitle}
                onChange={(e) => {
                  setCustomTitle(e.target.value);
                  if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
                }}
                placeholder="اكتب اسم الوسام المخصص..."
                className={`w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border text-xs font-semibold outline-none transition-colors ${
                  errors.title ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-amber-500"
                }`}
              />
            ) : (
              <select
                value={badgeTitle}
                onChange={(e) => {
                  setBadgeTitle(e.target.value);
                  if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
                }}
                className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold outline-none focus:border-amber-500 cursor-pointer"
              >
                {BADGE_PRESETS.map((preset) => (
                  <option key={preset.title} value={preset.title}>
                    {preset.title} (+{preset.xp} XP)
                  </option>
                ))}
              </select>
            )}
            {errors.title && <p className="text-[11px] font-bold text-rose-500">{errors.title}</p>}
          </div>

          {/* Reason / Congratulatory Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              {mode === "GRANT" ? "رسالة التكريم / سبب منح الوسام:" : "سبب غلق الوسام للطالب:"}{" "}
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (errors.note) setErrors((p) => ({ ...p, note: undefined }));
              }}
              placeholder={
                mode === "GRANT"
                  ? "مثال: أداء رائع وتفوق مستحق في الدروس والتفاعل اليومي!"
                  : "مثال: مراجعة متطلبات الأداء وإعادة التقييم..."
              }
              className={`w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border text-xs font-medium outline-none transition-colors leading-relaxed ${
                errors.note ? "border-rose-400 focus:border-rose-500" : "border-slate-200 dark:border-white/10 focus:border-amber-500"
              }`}
            />
            {errors.note && <p className="text-[11px] font-bold text-rose-500">{errors.note}</p>}
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 h-10 rounded-xl text-white text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                mode === "GRANT"
                  ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/25"
                  : "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "GRANT" ? (
                <Award className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>{mode === "GRANT" ? "إرسال ومنح الوسام" : "حفظ وغلق الوسام"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
