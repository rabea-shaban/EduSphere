"use client";

import { Wallet } from "lucide-react";

export function EarningsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-white dark:bg-[#0F274D] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-6">
      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
        <Wallet className="h-7 w-7" />
      </div>
      <p className="text-sm font-black text-slate-800 dark:text-slate-100">
        لا توجد معاملة مالية أو إيرادات مسجلة بالفترات المحددة
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        عند إتمام الطلاب شراء وسداد اشتراكات كورساتك، ستظهر أرباحك والمعاملات المكتملة هنا فوراً.
      </p>
    </div>
  );
}

export default EarningsEmptyState;
