"use client";

import * as React from "react";
import { Wallet, ArrowDownRight, TrendingUp, Sparkles } from "lucide-react";
import { mockMonthlyRevenueData, mockTeacherProfile, RevenueChart } from "@/features/teacher";

import { toast } from "react-hot-toast";

export default function InstructorEarningsPage() {
  const [showWithdrawModal, setShowWithdrawModal] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState("5000");

  return (
    <div className="space-y-8 text-right">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            إحصائيات الأرباح والمستحقات 💰
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            متابعة الرصيد القابل للسحب، الإيرادات الكلية، وطلب السحب المباشر
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowWithdrawModal(true)}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <ArrowDownRight className="h-4 w-4" />
          <span>طلب سحب الرصيد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-400">إجمالي الأرباح الكلية</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{mockTeacherProfile.totalRevenue.toLocaleString()} ج.م</div>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-400">الرصيد القابل للسحب الآن</div>
          <div className="text-2xl font-black text-[#F58220]">42,500 ج.م</div>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="text-xs font-bold text-slate-400">معدل التحويل والمبيعات</div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white">88.4%</div>
        </div>
      </div>

      <RevenueChart data={mockMonthlyRevenueData} />

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 max-w-md w-full text-right space-y-4 shadow-2xl border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">
              طلب سحب رصيد المحاضر
            </h3>
            <p className="text-xs text-slate-500">الرصيد المتاح: 42,500 ج.م</p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">المبلغ المراد سحبه (ج.م)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">طريقة الاستلام المفضلة</label>
              <select className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none cursor-pointer">
                <option value="vodafone">فودافون كاش (Vodafone Cash)</option>
                <option value="bank">حساب بنكي (Bank Account)</option>
                <option value="instapay">InstaPay</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-white/10 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("تم إرسال طلب السحب بنجاح إلى الإدارة المالية للمراجعة وسيتم تحويله خلال 24 ساعة. 💸");
                  setShowWithdrawModal(false);
                }}
                className="flex-1 h-11 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
              >
                تأكيد السحب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
