"use client";

import { User } from "lucide-react";

export function ProfileEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-white dark:bg-[#0F274D] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-6">
      <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
        <User className="h-7 w-7" />
      </div>
      <p className="text-sm font-black text-slate-800 dark:text-slate-100">
        تعذر تحميل بيانات الملف الشخصي
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        يرجى التأكد من الاتصال وتحديث الصفحة لإعادة تحميل بيانات حساب المحاضر.
      </p>
    </div>
  );
}

export default ProfileEmptyState;
