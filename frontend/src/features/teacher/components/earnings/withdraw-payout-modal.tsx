"use client";

import * as React from "react";
import { X, Loader2, ArrowDownRight, Smartphone, Building2, CreditCard, Wallet } from "lucide-react";
import { useRequestPayout } from "@/hooks/useTeacherEarnings";
import { toast } from "react-hot-toast";

interface WithdrawPayoutModalProps {
  availableBalance: number;
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawPayoutModal({
  availableBalance,
  isOpen,
  onClose,
}: WithdrawPayoutModalProps) {
  const requestPayout = useRequestPayout();

  const [amount, setAmount] = React.useState<string>("1000");
  const [method, setMethod] = React.useState<"Vodafone Cash" | "InstaPay" | "Bank Transfer" | "Fawry">("Vodafone Cash");
  const [accountDetails, setAccountDetails] = React.useState<string>("");

  React.useEffect(() => {
    if (isOpen) {
      setAmount(availableBalance > 0 ? String(Math.min(1000, availableBalance)) : "500");
      setAccountDetails("");
    }
  }, [isOpen, availableBalance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("يرجى إدخال مبلغ سحب صحيح أكبر من 0");
      return;
    }

    if (numAmount > availableBalance) {
      toast.error(`المبلغ المطلوب (${numAmount} ج.م) يتجاوز الرصيد المتاح حالياً (${availableBalance} ج.م)`);
      return;
    }

    if (!accountDetails.trim()) {
      toast.error("يرجى كتابة تفاصيل حساب المحفظة البنكية أو المحمول");
      return;
    }

    await requestPayout.mutateAsync({
      amount: numAmount,
      method,
      accountDetails: accountDetails.trim(),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0B2D5B] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 text-right dir-rtl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ArrowDownRight className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#0B2D5B] dark:text-white">
                طلب سحب المستحقات المالية
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                الرصيد المتاح حالياً للسحب: <strong className="text-emerald-600 dark:text-emerald-400">{availableBalance.toLocaleString()} ج.م</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              المبلغ المطلوب سحبه (بالجنيه المصري) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-black outline-none focus:border-[#F58220]"
            />
          </div>

          {/* Method */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              طريقة التحويل / السحب <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "Vodafone Cash", label: "فودافون كاش", icon: Smartphone },
                { id: "InstaPay", label: "إنستا باي InstaPay", icon: Wallet },
                { id: "Bank Transfer", label: "تحويل بنكي", icon: Building2 },
                { id: "Fawry", label: "كود فوري Fawry", icon: CreditCard },
              ].map((m) => {
                const IconComp = m.icon;
                const isSelected = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#F58220] bg-[#F58220]/10 text-[#F58220]"
                        : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <IconComp className="h-4 w-4 shrink-0" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-200">
              بيانات الحساب / رقم الهاتف للمحفظة <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder="مثال: 010XXXXXXXX أو عنوان InstaPay IPA"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-xs text-emerald-800 dark:text-emerald-300 font-semibold leading-relaxed">
            يتم معالجة وسداد مستحقات المحاضرين المالية خلال 24 إلى 48 ساعة عمل.
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={requestPayout.isPending || availableBalance <= 0}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {requestPayout.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري تقديم الطلب...</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4" />
                  <span>تأكيد طلب السحب</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WithdrawPayoutModal;
