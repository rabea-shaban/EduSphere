"use client";

import * as React from "react";
import { Tag, Sparkles } from "lucide-react";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coupon: { code: string; type: "percentage" | "fixed"; value: number; maxUsage: number }) => void;
}

export function CouponModal({ isOpen, onClose, onSubmit }: CouponModalProps) {
  const [code, setCode] = React.useState("");
  const [type, setType] = React.useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = React.useState(20);
  const [maxUsage, setMaxUsage] = React.useState(500);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    onSubmit({ code, type, value: Number(value), maxUsage: Number(maxUsage) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-md w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
        <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Tag className="h-5 w-5 text-[#F58220]" />
          <span>إنشاء كوبون خصم جديد</span>
        </h3>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">كود الخصم (Coupon Code)</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="مثال: EDUSPHERE2026"
            required
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold uppercase outline-none focus:border-[#F58220]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">نوع الخصم</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
              className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="percentage">نسبة مئوية (%)</option>
              <option value="fixed">مبلغ ثابت (ج.م)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">قيمة الخصم</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الحد الأقصى لعدد الاستخدامات</label>
          <input
            type="number"
            value={maxUsage}
            onChange={(e) => setMaxUsage(Number(e.target.value))}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4" />
            <span>حفظ الكوبون</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CouponModal;
