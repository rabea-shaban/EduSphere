"use client";

import * as React from "react";
import { useAuthContext } from "@/providers/auth-provider";
import type { EarningsDashboardData } from "@/features/teacher/types/earnings";

interface PrintableFinancialStatementProps {
  dashboard?: EarningsDashboardData | null;
  transactions?: any[];
}

export function PrintableFinancialStatement({
  dashboard,
  transactions = [],
}: PrintableFinancialStatementProps) {
  const { user } = useAuthContext();

  const teacherName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.fullName || user.username || "المعلم"
    : "المحاضر المعتمد";

  const teacherEmail = user?.email || "teacher@edusphere.com";

  const todayDate = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statementSerial = `FIN-STATEMENT-${new Date().getFullYear()}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  const totalEarnings = dashboard?.totalEarnings || 0;
  const lifetimeRevenue = dashboard?.lifetimeRevenue || 0;
  const availableBalance = dashboard?.availableBalance || 0;
  const withdrawnAmount = dashboard?.withdrawnAmount || 0;

  return (
    <div className="hidden print:block p-8 bg-white text-slate-900 text-right dir-rtl font-sans min-h-screen">
      {/* Official Enterprise Header with Logo */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-6">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="EduSphere Logo" className="h-12 w-auto object-contain shrink-0" />
          <div>
            <h1 className="text-xl font-black text-[#0B2D5B] tracking-tight">
              منصة EduSphere التعليمية
            </h1>
            <p className="text-xs text-slate-600 font-bold mt-0.5">
              الإدارة المالية - كشف حساب الأرباح والمستحقات الماليّة الرسمية
            </p>
          </div>
        </div>

        <div className="text-left font-mono text-xs text-slate-600 space-y-1 dir-ltr">
          <p className="font-bold text-slate-900">{statementSerial}</p>
          <p>Date: {todayDate}</p>
          <p className="text-emerald-700 font-bold">Status: OFFICIAL & VERIFIED</p>
        </div>
      </div>

      {/* Teacher & Statement Info */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-slate-300 bg-slate-50 mb-6 text-xs">
        <div>
          <p className="text-slate-500 font-bold">بيانات المحاضر:</p>
          <p className="font-black text-slate-900 text-sm mt-0.5">{teacherName}</p>
          <p className="text-slate-600 font-mono">{teacherEmail}</p>
        </div>
        <div className="text-left font-mono">
          <p className="text-slate-500 font-bold text-right">الفترة المالية:</p>
          <p className="font-bold text-slate-900 text-right mt-0.5">
            كافة المعاملات حتى {todayDate}
          </p>
          <p className="text-emerald-700 font-bold text-right">نسبة الأرباح المستحقة: 85%</p>
        </div>
      </div>

      {/* Summary KPI Financial Matrix Table */}
      <div className="mb-8">
        <h3 className="text-xs font-black text-slate-800 mb-2">
          ملخص المؤشرات والمستحقات المالية الكلية:
        </h3>
        <table className="w-full text-xs border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
              <th className="p-2.5 border-l border-slate-300 text-right">إجمالي المبيعات (100%)</th>
              <th className="p-2.5 border-l border-slate-300 text-right">صافي حصة المحاضر (85%)</th>
              <th className="p-2.5 border-l border-slate-300 text-right">الرصيد القابل للسحب</th>
              <th className="p-2.5 text-right">إجمالي المسحوبات الكلية</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-bold text-slate-900">
              <td className="p-2.5 border-l border-slate-300">
                {lifetimeRevenue.toLocaleString()} ج.م
              </td>
              <td className="p-2.5 border-l border-slate-300 text-emerald-700 font-black">
                {totalEarnings.toLocaleString()} ج.م
              </td>
              <td className="p-2.5 border-l border-slate-300 text-[#F58220]">
                {availableBalance.toLocaleString()} ج.م
              </td>
              <td className="p-2.5">{withdrawnAmount.toLocaleString()} ج.م</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Statement Transactions Breakdown */}
      <div className="mb-8">
        <h3 className="text-xs font-black text-slate-800 mb-2">
          سجل المعاملات الماليّة وعمليات السداد التفصيلية:
        </h3>
        {transactions.length === 0 ? (
          <div className="p-4 border border-slate-300 text-center text-xs text-slate-500 font-bold">
            لا توجد معاملات مالية مسجلة بالفترة المحددة.
          </div>
        ) : (
          <table className="w-full text-[11px] border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="p-2 border-l border-slate-300 text-right">رقم المرجع</th>
                <th className="p-2 border-l border-slate-300 text-right">التاريخ</th>
                <th className="p-2 border-l border-slate-300 text-right">اسم الطالب</th>
                <th className="p-2 border-l border-slate-300 text-right">الكورس التابع</th>
                <th className="p-2 border-l border-slate-300 text-right">المبلغ الكلي</th>
                <th className="p-2 border-l border-slate-300 text-right">حصة المحاضر (85%)</th>
                <th className="p-2 text-right">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any, idx: number) => (
                <tr
                  key={tx._id || idx}
                  className="border-b border-slate-200 text-slate-800 font-semibold"
                >
                  <td className="p-2 border-l border-slate-200 font-mono font-bold">
                    {tx.transactionId}
                  </td>
                  <td className="p-2 border-l border-slate-200">
                    {new Date(tx.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="p-2 border-l border-slate-200 font-bold">{tx.studentName}</td>
                  <td className="p-2 border-l border-slate-200">{tx.courseTitle}</td>
                  <td className="p-2 border-l border-slate-200">
                    {tx.amount?.toLocaleString()} {tx.currency || "ج.م"}
                  </td>
                  <td className="p-2 border-l border-slate-200 font-bold text-emerald-800">
                    {tx.teacherShare?.toLocaleString()} {tx.currency || "ج.م"}
                  </td>
                  <td className="p-2 font-bold">
                    {tx.status === "Paid"
                      ? "مكتمل"
                      : tx.status === "Refunded"
                      ? "مسترجع"
                      : "معلق"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Official Stamp & Verification Footer */}
      <div className="pt-8 border-t-2 border-slate-900 mt-auto flex items-end justify-between text-xs text-slate-600">
        <div>
          <p className="font-bold text-slate-900">منصة EduSphere للتعليم والتدريب</p>
          <p className="text-[10px]">قسم الإدارة المالية وحسابات المعلمين والشركاء</p>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">
            هذا البيان مستخرج آلياً ومعتمد بختم النظام الإلكتروني (E-Stamp).
          </p>
        </div>

        <div className="text-center space-y-1">
          <div className="w-24 h-24 border-2 border-dashed border-emerald-700/60 rounded-full flex flex-col items-center justify-center p-1 text-[9px] text-emerald-800 font-black tracking-tight leading-tight mx-auto opacity-90 rotate-[-6deg]">
            <span>EduSphere</span>
            <span>إختام مالي</span>
            <span>VERIFIED</span>
          </div>
          <span className="block text-[9px] font-mono text-slate-400">الختم المالي الرسمي</span>
        </div>
      </div>
    </div>
  );
}

export default PrintableFinancialStatement;
