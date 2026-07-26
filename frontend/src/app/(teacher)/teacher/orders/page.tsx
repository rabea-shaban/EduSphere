"use client";

import * as React from "react";
import { ShoppingBag, CheckCircle2, Search } from "lucide-react";
import { mockOrders } from "@/features/teacher";

export default function InstructorOrdersPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          طلبات الاشتراك والمبيعات 🛒
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          سجل عمليات الاشتراك اليومية والشهرية للكورسات المسجلة باسمك
        </p>
      </div>

      <div className="space-y-3">
        {mockOrders.map((ord) => (
          <div
            key={ord.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0B2D5B] dark:text-white">{ord.studentName} - {ord.courseTitle}</div>
                <div className="text-[11px] text-slate-400">رقم الطلب: {ord.orderNumber} • طريقة الدفع: {ord.paymentMethod} • {ord.date}</div>
              </div>
            </div>

            <div className="text-left">
              <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">+{ord.amount} ج.م</div>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md">مكتمل</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
