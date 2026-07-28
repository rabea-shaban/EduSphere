"use client";

import * as React from "react";
import { Printer, FileSpreadsheet } from "lucide-react";
import { toast } from "react-hot-toast";

interface FinancialReportExportBarProps {
  reportTitle?: string;
}

export function FinancialReportExportBar({
  reportTitle = "تقرير_الأرباح_والمستحقات_المالية",
}: FinancialReportExportBarProps) {
  const handleExportCSV = () => {
    try {
      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        "بند التقرير,القيمة بالجنيه المصري\n" +
        "إجمالي الأرباح الكلية,45000\n" +
        "حصة المحاضر (85%),38250\n" +
        "الرصيد القابل للسحب,12500\n" +
        "المبالغ المسحوبة سابقاً,25750\n";

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${reportTitle}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("تم تصدير التقرير المالي بملف CSV بنجاح 💰");
    } catch {
      toast.error("تعذر تصدير الملف المالي");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={handleExportCSV}
        className="px-3 h-9 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
        title="تصدير CSV / Excel"
      >
        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
        <span>تصدير تقرير CSV</span>
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="px-3 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer"
        title="طباعة التقرير المالي"
      >
        <Printer className="h-4 w-4 text-indigo-500" />
        <span>طباعة البيان المالي</span>
      </button>
    </div>
  );
}

export default FinancialReportExportBar;
