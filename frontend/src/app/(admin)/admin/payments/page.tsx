"use client";

import * as React from "react";
import { CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { mockPendingPayments, PaymentReviewCard, PaymentReviewItem } from "@/features/admin";

import { toast } from "react-hot-toast";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = React.useState<PaymentReviewItem[]>(mockPendingPayments);

  const handleApprove = (id: string) => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, status: "approved" } : p)));
    toast.success("تم اعتماد عملية الدفع وتفعيل الكورس للطالب فوراً! ✅");
  };

  const handleReject = (id: string) => {
    setPayments(payments.filter((p) => p.id !== id));
    toast.error("تم رفض العملية وإرسال إشعار للطالب.");
  };

  return (
    <div className="space-y-6 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          مراجعة واعتماد المدفوعات 💳
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          مراجعة إيصالات التحويل المالية الخاصة بفودافون كاش، فوري، ميزة، وبطاقات الفيزا
        </p>
      </div>

      <div className="space-y-4">
        {payments.map((pay) => (
          <PaymentReviewCard key={pay.id} payment={pay} onApprove={handleApprove} onReject={handleReject} />
        ))}
      </div>
    </div>
  );
}
