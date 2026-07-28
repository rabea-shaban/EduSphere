"use client";

import { ArrowDownRight } from "lucide-react";

export function WithdrawalEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-white dark:bg-[#0F274D] rounded-3xl border border-dashed border-slate-200 dark:border-white/10 p-6">
      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
        <ArrowDownRight className="h-7 w-7" />
      </div>
      <p className="text-sm font-black text-slate-800 dark:text-slate-100">
        لا توجد طلبات سحب رصيد مسجلة
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        يمكنك تقديم طلب جديد لسحب مستحقاتك وأرباحك المتاحة عبر المحافظ الإلكترونية أو التحويل البنكي المباشر.
      </p>
    </div>
  );
}

export default WithdrawalEmptyState;
