"use client";

import * as React from "react";
import { HelpCircle, Star } from "lucide-react";

export default function AdminQuizzesPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إدارة بنك الأسئلة والاختبارات 📝
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          متابعة نتائج اختبارات الطلاب ونسب النجاح الكلية بالمنصة
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm text-center space-y-2">
        <HelpCircle className="h-10 w-10 text-[#F58220] mx-auto" />
        <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white">بنك الأسئلة المركزي شامل ومفعل</h3>
        <p className="text-xs text-slate-500">تم إجراء أكثر من 45,000 اختبار تفاعلي للطلاب بنسبة نجاح 88.4%.</p>
      </div>
    </div>
  );
}
