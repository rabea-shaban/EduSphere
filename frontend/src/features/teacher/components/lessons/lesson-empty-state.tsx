"use client";

import { PlayCircle, PlusCircle } from "lucide-react";

interface LessonEmptyStateProps {
  onCreateClick?: () => void;
  filtered?: boolean;
}

export function LessonEmptyState({ onCreateClick, filtered }: LessonEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-3 bg-slate-50/50 dark:bg-[#0B2D5B]/20 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 p-6">
      <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
        <PlayCircle className="h-6 w-6 text-slate-400 dark:text-slate-500" />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-black text-slate-700 dark:text-slate-200">
          {filtered ? "لا توجد دروس تطابق هذا الفلتر" : "لا توجد دروس داخل هذا القسم"}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          {filtered
            ? "حاول تغيير كلمة البحث أو الفلتر المختار."
            : "ابدأ بإضافة أول درس تعليمي لهذا القسم (فيديو، ملف PDF، مقال، إلخ)."}
        </p>
      </div>

      {!filtered && onCreateClick && (
        <button
          type="button"
          onClick={onCreateClick}
          className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity cursor-pointer mt-1"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>إضافة درس جديد</span>
        </button>
      )}
    </div>
  );
}

export default LessonEmptyState;
