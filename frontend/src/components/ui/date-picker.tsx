"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
}

const ARABIC_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const ARABIC_WEEKDAYS = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

export function DatePicker({
  value,
  onChange,
  placeholder = "اختر تاريخ الميلاد",
  className = "",
  disabled = false,
  minYear = 1950,
  maxYear = new Date().getFullYear(),
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Parsed current selected date
  const selectedDate = React.useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  }, [value]);

  // Display Month and Year in calendar popup view
  const [viewYear, setViewYear] = React.useState<number>(() => {
    return selectedDate ? selectedDate.getFullYear() : 2001;
  });
  const [viewMonth, setViewMonth] = React.useState<number>(() => {
    return selectedDate ? selectedDate.getMonth() : 5; // June default
  });

  // Sync view when selectedDate changes
  React.useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [selectedDate]);

  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Calculate calendar days matrix for viewMonth and viewYear
  const calendarDays = React.useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

    const days: { dateNumber: number; isCurrentMonth: boolean; fullDateStr: string }[] = [];

    // Previous month padding
    const prevMonthLastDay = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDateNum = prevMonthLastDay - i;
      days.push({
        dateNumber: prevDateNum,
        isCurrentMonth: false,
        fullDateStr: "",
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(viewMonth + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      days.push({
        dateNumber: d,
        isCurrentMonth: true,
        fullDateStr: `${viewYear}-${mStr}-${dStr}`,
      });
    }

    // Next month padding to complete 42 cells (6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dateNumber: i,
        isCurrentMonth: false,
        fullDateStr: "",
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handleSelectDay = (fullDateStr: string) => {
    if (!fullDateStr) return;
    onChange?.(fullDateStr);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Formatted Date String for display input
  const formattedDisplay = React.useMemo(() => {
    if (!selectedDate) return "";
    const d = selectedDate.getDate();
    const mName = ARABIC_MONTHS[selectedDate.getMonth()];
    const y = selectedDate.getFullYear();
    return `${d} ${mName} ${y}`;
  }, [selectedDate]);

  // Year options list from maxYear down to minYear
  const yearOptions = React.useMemo(() => {
    const years: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      years.push(y);
    }
    return years;
  }, [minYear, maxYear]);

  return (
    <div className={`relative inline-block w-full text-right dir-rtl ${className}`} ref={popoverRef}>
      {/* Trigger Button Input */}
      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold flex items-center justify-between gap-2 cursor-pointer transition-all ${
          isOpen ? "border-[#F58220] ring-2 ring-[#F58220]/20" : "hover:border-slate-300 dark:hover:border-white/20"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="h-4 w-4 text-[#F58220] shrink-0" />
          {formattedDisplay ? (
            <span className="text-slate-800 dark:text-white font-bold">{formattedDisplay}</span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-normal">{placeholder}</span>
          )}
        </div>

        {value ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.("");
            }}
            className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            title="مسح التحديد"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {/* Floating Modern Calendar Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 right-0 w-80 p-4 rounded-2xl bg-white dark:bg-[#071C3B] border border-slate-200/90 dark:border-white/15 shadow-2xl space-y-4 text-slate-800 dark:text-white"
          >
            {/* Header: Month & Year Controls */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/10">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#F58220]/20 hover:text-[#F58220] transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2">
                {/* Month Dropdown */}
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(Number(e.target.value))}
                  className="bg-slate-100 dark:bg-white/10 text-xs font-bold px-2 py-1.5 rounded-lg outline-none cursor-pointer border border-transparent focus:border-[#F58220]"
                >
                  {ARABIC_MONTHS.map((m, idx) => (
                    <option key={m} value={idx} className="bg-white dark:bg-[#071C3B] text-slate-800 dark:text-white font-semibold">
                      {m}
                    </option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(Number(e.target.value))}
                  className="bg-slate-100 dark:bg-white/10 text-xs font-bold px-2 py-1.5 rounded-lg outline-none cursor-pointer border border-transparent focus:border-[#F58220]"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-[#071C3B] text-slate-800 dark:text-white font-semibold">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-[#F58220]/20 hover:text-[#F58220] transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Weekdays Grid Header */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {ARABIC_WEEKDAYS.map((wd) => (
                <div key={wd} className="text-[11px] font-bold text-slate-400 dark:text-slate-500 py-1">
                  {wd}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarDays.map((item, idx) => {
                const isSelected = value === item.fullDateStr && item.isCurrentMonth;
                const isToday = item.fullDateStr === new Date().toISOString().split("T")[0];

                if (!item.isCurrentMonth) {
                  return (
                    <div
                      key={idx}
                      className="h-8 flex items-center justify-center text-xs text-slate-300 dark:text-slate-700 pointer-events-none select-none"
                    >
                      {item.dateNumber}
                    </div>
                  );
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectDay(item.fullDateStr)}
                    className={`h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-[#0B2D5B] to-[#1E73D8] text-white shadow-md font-black"
                        : isToday
                        ? "border border-[#F58220] text-[#F58220] hover:bg-[#F58220]/10"
                        : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {item.dateNumber}
                  </button>
                );
              })}
            </div>

            {/* Footer Action Quick Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  const todayStr = new Date().toISOString().split("T")[0];
                  onChange?.(todayStr);
                  setIsOpen(false);
                }}
                className="text-[#F58220] font-bold hover:underline"
              >
                اليوم
              </button>

              <button
                type="button"
                onClick={() => {
                  onChange?.("");
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                إلغاء التحديد
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DatePicker;
