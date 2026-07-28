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

  const statementSerial = `FIN-${new Date().getFullYear()}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  const totalEarnings = dashboard?.totalEarnings || 0;
  const lifetimeRevenue = dashboard?.lifetimeRevenue || 0;
  const availableBalance = dashboard?.availableBalance || 0;
  const withdrawnAmount = dashboard?.withdrawnAmount || 0;

  const totalTxAmount = transactions.reduce((acc: number, tx: any) => acc + (tx.amount || 0), 0);
  const totalTxTeacherShare = transactions.reduce(
    (acc: number, tx: any) => acc + (tx.teacherShare || 0),
    0
  );

  return (
    <>
      {/* Strict A4 Print CSS Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
          }
          /* Hide all screen elements */
          body * {
            visibility: hidden !important;
          }
          .printable-statement-wrapper, .printable-statement-wrapper * {
            visibility: visible !important;
          }
          .printable-statement-wrapper {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            padding: 16mm 18mm 14mm 18mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            z-index: 99999 !important;
          }
        }
      `}</style>

      {/* Printable Sheet */}
      <div className="hidden print:flex printable-statement-wrapper w-full bg-white text-slate-900 dir-rtl font-sans min-h-[297mm] flex-col justify-between">
        
        {/* TOP CONTENT SECTION */}
        <div className="space-y-6">
          
          {/* CORPORATE BRAND HEADER */}
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-5">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="EduSphere Logo"
                className="h-12 w-auto object-contain shrink-0"
              />
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  الإدارة المالية والشؤون الحسابية
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  كشف تسوية المستحقات والأرباح المالية
                </p>
              </div>
            </div>

            <div className="text-left dir-ltr bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 dir-rtl text-right">
                كشف حساب مالي رسمـي
              </h2>
              <p className="text-xs font-mono text-slate-700 text-right mt-0.5">
                رقم البيان: <span className="font-bold text-slate-900">{statementSerial}</span>
              </p>
              <p className="text-xs text-slate-500 text-right mt-0.5">التاريخ: {todayDate}</p>
            </div>
          </div>

          {/* INSTRUCTOR & PERIOD METADATA GRID */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3.5 grid grid-cols-2 gap-y-2.5 gap-x-8 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">اسم المحاضر الشريك:</span>
              <span className="font-bold text-slate-900">{teacherName}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">الفترة المشمولة:</span>
              <span className="font-bold text-slate-900">حتى {todayDate}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">البريد الإلكتروني:</span>
              <span className="font-mono text-slate-800 font-bold dir-ltr">{teacherEmail}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">نسبة مستحقات المحاضر:</span>
              <span className="font-bold text-slate-900">85% صافي من المبيعات</span>
            </div>
          </div>

          {/* UNIFIED FINANCIAL SUMMARY TABLE */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>●</span>
              <span>الملخص المالي الكلي والمسحوبات:</span>
            </h3>
            <table className="w-full text-xs text-right border-collapse border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <th className="p-3 border-l border-slate-200 w-1/4">إجمالي المبيعات (100%)</th>
                  <th className="p-3 border-l border-slate-200 w-1/4">صافي الأرباح (85%)</th>
                  <th className="p-3 border-l border-slate-200 w-1/4">إجمالي المسحوبات</th>
                  <th className="p-3 w-1/4">الرصيد القابل للسحب</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-bold text-slate-900 bg-white">
                  <td className="p-3 border-l border-slate-200 font-mono text-sm">
                    {lifetimeRevenue.toLocaleString()} ج.م
                  </td>
                  <td className="p-3 border-l border-slate-200 font-mono text-sm text-emerald-700">
                    {totalEarnings.toLocaleString()} ج.م
                  </td>
                  <td className="p-3 border-l border-slate-200 font-mono text-sm text-slate-700">
                    {withdrawnAmount.toLocaleString()} ج.م
                  </td>
                  <td className="p-3 font-mono text-sm text-amber-600">
                    {availableBalance.toLocaleString()} ج.م
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* DETAILED TRANSACTIONS TABLE */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>●</span>
              <span>سجل المعاملات المالية والتسويات التفصيلية:</span>
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white font-bold border-b border-slate-800">
                    <th className="p-2.5 border-l border-slate-700 text-center w-10">#</th>
                    <th className="p-2.5 border-l border-slate-700">رقم الحركة</th>
                    <th className="p-2.5 border-l border-slate-700">التاريخ</th>
                    <th className="p-2.5 border-l border-slate-700">اسم العميل / الطالب</th>
                    <th className="p-2.5 border-l border-slate-700">الكورس التابع</th>
                    <th className="p-2.5 border-l border-slate-700 text-left">المبلغ الإجمالي</th>
                    <th className="p-2.5 border-l border-slate-700 text-left">حصة المحاضر (85%)</th>
                    <th className="p-2.5 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr className="border-b border-slate-200">
                      <td colSpan={8} className="py-12 text-center text-slate-400 font-medium text-xs bg-slate-50/30">
                        لا توجد معاملات مالية مسجلة خلال هذه الفترة المحددّة
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx: any, idx: number) => (
                      <tr
                        key={tx._id || idx}
                        className="border-b border-slate-200 text-slate-800 font-semibold even:bg-slate-50/70"
                      >
                        <td className="p-2.5 border-l border-slate-200 text-center font-mono text-slate-400 text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 border-l border-slate-200 font-mono font-bold text-slate-900">
                          {tx.transactionId || `TXN-${1000 + idx}`}
                        </td>
                        <td className="p-2.5 border-l border-slate-200 font-mono text-[11px]">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("ar-EG") : todayDate}
                        </td>
                        <td className="p-2.5 border-l border-slate-200 font-bold">{tx.studentName || "—"}</td>
                        <td className="p-2.5 border-l border-slate-200 truncate max-w-[190px]">{tx.courseTitle || "—"}</td>
                        <td className="p-2.5 border-l border-slate-200 font-mono text-left font-bold text-slate-900 dir-ltr">
                          {(tx.amount || 0).toLocaleString()} {tx.currency || "ج.م"}
                        </td>
                        <td className="p-2.5 border-l border-slate-200 font-mono text-left font-bold text-emerald-700 dir-ltr">
                          {(tx.teacherShare || 0).toLocaleString()} {tx.currency || "ج.م"}
                        </td>
                        <td className="p-2.5 text-center font-bold text-[11px]">
                          {tx.status === "Paid"
                            ? "مكتمل"
                            : tx.status === "Refunded"
                            ? "مسترجع"
                            : "معلق"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {transactions.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300">
                      <td colSpan={5} className="p-2.5 border-l border-slate-200 text-right">
                        الإجمالي الكلي ({transactions.length} معاملة):
                      </td>
                      <td className="p-2.5 border-l border-slate-200 font-mono text-left dir-ltr text-slate-900">
                        {totalTxAmount.toLocaleString()} ج.م
                      </td>
                      <td className="p-2.5 border-l border-slate-200 font-mono text-left dir-ltr text-emerald-700">
                        {totalTxTeacherShare.toLocaleString()} ج.م
                      </td>
                      <td className="p-2.5 text-center text-emerald-800 text-[10px]">مكتمل</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: SIGNATURE, STAMP & FOOTER BAR */}
        <div className="pt-6 border-t border-slate-300 mt-auto space-y-5">
          <div className="flex items-end justify-between text-xs text-slate-800">
            {/* Signature Block */}
            <div className="space-y-3">
              <div>
                <p className="font-bold text-slate-900 text-sm">توقيع المدير المالي</p>
                <p className="text-[11px] text-slate-500 font-medium">اعتماد قسم الإدارة المالية والحسابات</p>
              </div>
              <div className="w-64 border-b border-slate-400 pb-1 text-slate-400 text-[11px] font-mono">
                التوقيع المعتمد: ______________________
              </div>
            </div>

            {/* Official Stamp Block with Embedded Logo Mark */}
            <div className="text-center space-y-1">
              <div className="w-28 h-28 border-4 border-double border-[#0B2D5B] rounded-full flex flex-col items-center justify-center p-2 text-[#0B2D5B] font-bold leading-tight mx-auto bg-slate-50/80 shadow-sm rotate-[-3deg] relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-mark.png"
                  alt="EduSphere Stamp Logo"
                  className="h-8 w-auto object-contain opacity-90 mb-0.5"
                />
                <span className="text-[9px] font-black tracking-tighter uppercase">EDUSPHERE</span>
                <span className="my-0.5 text-[8px] font-bold text-emerald-700">★ ختم مالي معتمد ★</span>
                <span className="bg-[#0B2D5B] text-white text-[7px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                  VERIFIED SEAL
                </span>
              </div>
              <span className="block text-[10px] font-mono text-slate-500 font-bold">
                الختم المالي المعتمد
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>كشف حساب مالي رسمي — وثيقة صادرة آلياً</span>
            <span>المرجع: {statementSerial}</span>
            <span>الصفحة 1 من 1</span>
          </div>
        </div>

      </div>
    </>
  );
}

export default PrintableFinancialStatement;
