"use client";

import * as React from "react";
import { FileCheck2 } from "lucide-react";

export default function AdminAssignmentsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إدارة الواجبات والمشاريع العملية 📋
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          متابعة تسليمات مشاريع البرمجة وأوراق البحث العلمية لنظام البكالوريا
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-center space-y-2">
        <FileCheck2 className="h-10 w-10 text-[#0B2D5B] dark:text-[#F58220] mx-auto" />
        <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white">نظام التقييم التلقائي بالذكاء الاصطناعي مفعل</h3>
        <p className="text-xs text-slate-500">متابعة كافة التسليمات والملاحظات من قِبل المعلمين.</p>
      </div>
    </div>
  );
}
