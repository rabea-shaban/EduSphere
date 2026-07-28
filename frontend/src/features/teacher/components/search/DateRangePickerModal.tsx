import * as React from "react";
import { Calendar, X, Check } from "lucide-react";

interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateFrom?: string;
  dateTo?: string;
  dateShortcut?: string;
  onApply: (dateFrom?: string, dateTo?: string, shortcut?: string) => void;
}

export function DateRangePickerModal({
  isOpen,
  onClose,
  dateFrom: initialFrom,
  dateTo: initialTo,
  dateShortcut: initialShortcut,
  onApply,
}: DateRangePickerModalProps) {
  const [from, setFrom] = React.useState(initialFrom || "");
  const [to, setTo] = React.useState(initialTo || "");
  const [shortcut, setShortcut] = React.useState(initialShortcut || "");

  if (!isOpen) return null;

  const handleShortcutClick = (val: string) => {
    setShortcut(val);
    setFrom("");
    setTo("");
  };

  const handleApply = () => {
    onApply(from || undefined, to || undefined, shortcut || undefined);
    onClose();
  };

  const handleClear = () => {
    setFrom("");
    setTo("");
    setShortcut("");
    onApply(undefined, undefined, undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-right">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#F58220]" />
            تصفية التواريخ والميعاد
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">اختيارات سريعة</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "today", label: "اليوم" },
              { id: "yesterday", label: "الأمس" },
              { id: "last7days", label: "آخر 7 أيام" },
              { id: "last30days", label: "آخر 30 يوم" },
              { id: "thisMonth", label: "هذا الشهر" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleShortcutClick(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  shortcut === s.id
                    ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Range */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">من تاريخ</label>
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setShortcut("");
              }}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">إلى تاريخ</label>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setShortcut("");
              }}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs outline-none focus:border-[#F58220]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={handleClear}
            className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold"
          >
            مسح التصفية
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-10 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            تطبيق الفلتر
          </button>
        </div>
      </div>
    </div>
  );
}
export default DateRangePickerModal;
