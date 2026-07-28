"use client";

import { Users } from "lucide-react";

interface StudentEmptyStateProps {
  filtered?: boolean;
}

export function StudentEmptyState({ filtered }: StudentEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center gap-3 bg-white dark:bg-[#0F274D] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-6">
      <div className="h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
        <Users className="h-7 w-7" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-black text-slate-800 dark:text-slate-100">
          {filtered ? "لا يوجد طلاب يطابقون البحث أو الفلتر" : "لا يوجد طلاب مشتركين في كورتاتك حالياً"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {filtered
            ? "حاول التغيير في الكلمات الدلالية أو الفلاتر المحددة."
            : "عند اشتراك الطلاب في الكورسات الخاصة بك، سيظهرون هنا لمتابعة تقدمهم وإصدار الشهادات."}
        </p>
      </div>
    </div>
  );
}

export default StudentEmptyState;
