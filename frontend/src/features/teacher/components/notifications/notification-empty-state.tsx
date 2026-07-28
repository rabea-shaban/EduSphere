"use client";

import { Bell } from "lucide-react";

export function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-white dark:bg-[#0F274D] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-6">
      <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
        <Bell className="h-7 w-7" />
      </div>
      <p className="text-sm font-black text-slate-800 dark:text-slate-100">
        لا توجد إشعارات جديدة في سِجل مركز التنبيهات
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        ستظهر هنا كافة الإشعارات الفورية والتنبيهات المتعلقة باشتراكات الطلاب، تسليمات الواجبات، التقييمات، والمدفوعات.
      </p>
    </div>
  );
}

export default NotificationEmptyState;
