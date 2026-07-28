import * as React from "react";

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse text-right" dir="rtl">
      <div className="h-8 bg-slate-200 dark:bg-white/10 rounded-xl w-1/3"></div>
      <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-lg w-1/2"></div>
      
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 space-y-6">
        <div className="flex gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-24 bg-slate-200 dark:bg-white/10 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="h-12 bg-slate-100 dark:bg-white/5 rounded-xl"></div>
          <div className="h-12 bg-slate-100 dark:bg-white/5 rounded-xl"></div>
          <div className="h-12 bg-slate-100 dark:bg-white/5 rounded-xl"></div>
          <div className="h-12 bg-slate-100 dark:bg-white/5 rounded-xl"></div>
        </div>
        <div className="h-11 w-36 bg-slate-200 dark:bg-white/10 rounded-xl"></div>
      </div>
    </div>
  );
}
export default SettingsSkeleton;
