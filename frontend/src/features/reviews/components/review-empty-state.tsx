"use client";

import { Star } from "lucide-react";

export function ReviewEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-white dark:bg-[#0F274D] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-6">
      <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
        <Star className="h-7 w-7 fill-amber-500" />
      </div>
      <p className="text-sm font-black text-slate-800 dark:text-slate-100">
        لا توجد مراجعات أو تقييمات مسجلة حتى الآن
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        ستظهر هنا تقييمات وملاحظات الطلاب على الكورس فور تقديمها لتتيح لك تفقد آراء الطلاب والرد عليها.
      </p>
    </div>
  );
}

export default ReviewEmptyState;
