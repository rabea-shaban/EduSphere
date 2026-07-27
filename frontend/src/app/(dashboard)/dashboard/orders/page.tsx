"use client";

import * as React from "react";
import Link from "next/link";
import { CreditCard, ShoppingBag, CheckCircle2, Clock, XCircle, FileText, Download } from "lucide-react";
import { usePayment } from "@/hooks/usePayment";

export default function StudentOrdersPage() {
  const { useMyPayments } = usePayment();
  const { data, isLoading } = useMyPayments(1, "all");

  const payments = data?.payments || [];

  return (
    <div className="space-y-6 text-right dir-rtl">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          سجل عمليات الشراء والفواتير 🛒
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          متابعة حالة الكورسات المشتراة وتنزيل فواتير وإيصالات السداد
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-slate-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : payments.length > 0 ? (
        <div className="space-y-3">
          {payments.map((p) => (
            <div
              key={p._id}
              className="p-5 rounded-2xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0B2D5B] dark:text-white">
                    {p.courseId?.title || "كورس تعليمي"}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    المرجع: {p.paymentReference} | طريقة الدفع: {p.paymentMethod}
                  </div>
                </div>
              </div>

              <div className="text-left space-y-1">
                <div className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {p.amount} ج.م
                </div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    p.status === "Paid"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : p.status === "Pending"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-rose-500/10 text-rose-600"
                  }`}
                >
                  {p.status === "Paid" && "مقبول ومفعل 🟢"}
                  {p.status === "Pending" && "قيد المراجعة ⏳"}
                  {p.status === "Failed" && "غير مقبول 🔴"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 space-y-2">
          <ShoppingBag className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">لم تقم بشراء كورسات بعد</h4>
          <p className="text-xs text-slate-500">استكشف الكورسات المتاحة واشترك لمتابعة دروسك فوراً</p>
        </div>
      )}
    </div>
  );
}
