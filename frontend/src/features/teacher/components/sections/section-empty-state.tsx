"use client";

import { Layers, PlusCircle } from "lucide-react";

interface SectionEmptyStateProps {
  onCreateClick?: () => void;
  filtered?: boolean;
}

export function SectionEmptyState({ onCreateClick, filtered }: SectionEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-5 bg-white dark:bg-[#0F274D] rounded-3xl border border-dashed border-slate-300 dark:border-white/15">
      <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
        <Layers className="h-8 w-8 text-slate-400 dark:text-slate-500" />
      </div>

      <div className="space-y-2">
        <p className="text-base font-black text-slate-700 dark:text-slate-200">
          {filtered ? "لا توجد أقسام تطابق هذا الفلتر" : "لا توجد أقسام داخل هذا الكورس"}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          {filtered
            ? "حاول تغيير معايير البحث أو الفلتر للعثور على الأقسام المطلوبة."
            : "ابدأ ببناء محتوى الكورس عن طريق إضافة القسم الأول. كل قسم يحتوي على مجموعة من الدروس."}
        </p>
      </div>

      {!filtered && onCreateClick && (
        <button
          type="button"
          onClick={onCreateClick}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#F58220]/20 hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إضافة القسم الأول</span>
        </button>
      )}
    </div>
  );
}

export default SectionEmptyState;
