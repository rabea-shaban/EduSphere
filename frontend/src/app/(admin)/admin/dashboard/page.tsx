"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  BookOpen,
  CreditCard,
  UserCheck,
  Activity,
  ArrowLeft,
} from "lucide-react";
import {
  mockPlatformHealth,
  mockAdminStats,
  mockMonthlyGrowthData,
  mockPendingPayments,
  mockPendingTeachers,
  mockAuditLogs,
  AdminStatCard,
  PlatformChart,
  PaymentReviewCard,
  TeacherApprovalCard,
} from "@/features/admin";

export default function AdminDashboardHomePage() {
  return (
    <div className="space-y-8 text-right">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] text-white shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] px-3.5 py-1 rounded-full text-xs font-black">
              <ShieldCheck className="h-4 w-4" />
              <span>لوحة التحكم الرئيسية للمسؤول الرئيسي</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
              منصة EduSphere مصر 🇪🇬
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
              إجمالي الطلاب <strong className="text-[#F58220]">17,800 طالب</strong> و 18 عملية دفع بانتظار الاعتماد والمراجعة.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Link
              href="/admin/payments"
              className="flex-1 md:flex-initial h-12 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/30 hover:-translate-y-0.5 transition-all"
            >
              <CreditCard className="h-5 w-5" />
              <span>مراجعة المدفوعات ({mockPlatformHealth.pendingPaymentsCount})</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 8 Admin Stats Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
          مؤشرات صحة المنصة والأداء الكلي 📊
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAdminStats.map((stat, idx) => (
            <AdminStatCard key={stat.id} stat={stat} index={idx} />
          ))}
        </div>
      </div>

      {/* Revenue & Growth Chart */}
      <PlatformChart data={mockMonthlyGrowthData} />

      {/* Pending Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#F58220]" />
              <span>إيصالات التحويل بانتظار الاعتماد</span>
            </h3>
            <Link href="/admin/payments" className="text-xs font-bold text-[#F58220] hover:underline">
              عرض الكل ({mockPendingPayments.length})
            </Link>
          </div>

          <div className="space-y-4">
            {mockPendingPayments.map((pay) => (
              <PaymentReviewCard key={pay.id} payment={pay} />
            ))}
          </div>
        </div>

        {/* Pending Teachers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-purple-500" />
              <span>طلبات اعتماد المعلمين</span>
            </h3>
            <Link href="/admin/teachers" className="text-xs font-bold text-[#F58220] hover:underline">
              عرض الكل ({mockPendingTeachers.length})
            </Link>
          </div>

          <div className="space-y-4">
            {mockPendingTeachers.map((req) => (
              <TeacherApprovalCard key={req.id} request={req} />
            ))}
          </div>
        </div>
      </div>

      {/* System Audit Trail Log */}
      <div className="rounded-3xl p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 text-right">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
          <h3 className="text-base font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-500" />
            <span>سجل عمليات المنصة الفوري (Audit Logs)</span>
          </h3>
          <Link href="/admin/audit-logs" className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1">
            <span>الجل الكامل</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {mockAuditLogs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-extrabold text-[#0B2D5B] dark:text-white">{log.action}</div>
                <div className="text-[11px] text-slate-400">بواسطة: {log.userName} • الهدف: {log.target}</div>
              </div>
              <div className="text-left text-[11px] text-slate-400">
                <div>{log.timestamp}</div>
                <span className="font-mono text-[10px] text-slate-400">{log.ipAddress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
