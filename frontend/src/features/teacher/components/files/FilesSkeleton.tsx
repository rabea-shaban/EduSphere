import * as React from "react";

export function FilesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-right" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="h-8 bg-slate-200 dark:bg-white/10 rounded-xl w-1/4"></div>
        <div className="h-10 bg-slate-200 dark:bg-white/10 rounded-xl w-32"></div>
      </div>

      <div className="h-14 bg-slate-100 dark:bg-white/5 rounded-2xl"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-44 bg-white dark:bg-[#0F274D] rounded-2xl border border-slate-200 dark:border-white/10 p-4 space-y-3">
            <div className="h-20 bg-slate-100 dark:bg-white/5 rounded-xl"></div>
            <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-3/4"></div>
            <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default FilesSkeleton;
