"use client";

import { FileCheck2, PlusCircle } from "lucide-react";

interface AssignmentEmptyStateProps {
  onCreateClick?: () => void;
  filtered?: boolean;
}

export function AssignmentEmptyState({ onCreateClick, filtered }: AssignmentEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3 bg-white dark:bg-[#0F274D] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-6">
      <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
        <FileCheck2 className="h-7 w-7" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-black text-slate-800 dark:text-slate-100">
          {filtered ? "لا توجد واجبات تطابق البحث أو الفلتر" : "لا توجد واجبات تطبيقية مضافة حالياً"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {filtered
            ? "حاول التغيير في الكلمات الدلالية أو الفلاتر المحددة."
            : "أنشئ أول واجب تطبيقي لتدريب الطلاب وتقييم تسليماتهم العمليّة."}
        </p>
      </div>

      {!filtered && onCreateClick && (
        <button
          type="button"
          onClick={onCreateClick}
          className="h-10 px-5 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#F58220]/20 hover:opacity-90 transition-opacity cursor-pointer mt-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>إضافة واجب جديد</span>
        </button>
      )}
    </div>
  );
}

export default AssignmentEmptyState;
