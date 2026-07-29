"use client";

import * as React from "react";
import { Download, Printer, FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "react-hot-toast";

interface AnalyticsExportBarProps {
  reportTitle?: string;
  dataToExport?: any;
}

export function AnalyticsExportBar({
  reportTitle = "تقارير تحليلات المحاضر",
  dataToExport,
}: AnalyticsExportBarProps) {
  const handleExportCSV = () => {
    try {
      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        "العنصر,القيمة\n" +
        "إجمالي الكورسات,12\n" +
        "إجمالي الطلاب,150\n" +
        "نسبة النجاح العامة,92%\n" +
        "إجمالي الإيرادات,45000 ج.م\n";

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${reportTitle}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("تم تصدير التقرير بملف CSV بنجاح");
    } catch {
      toast.error("تعذر تصدير الملف");
    }
  };

  const handleExportExcel = () => {
    handleExportCSV();
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
        title="تصدير CSV"
      >
        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
        <span>تصدير CSV / Excel</span>
      </button>

      <button
        type="button"
        onClick={handlePrint}
        className="px-3 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer"
        title="طباعة التقرير"
      >
        <Printer className="h-4 w-4 text-indigo-500" />
        <span>طباعة التقرير</span>
      </button>
    </div>
  );
}

export default AnalyticsExportBar;
