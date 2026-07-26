"use client";

import * as React from "react";
import { Tag, Plus } from "lucide-react";
import { mockCoupons, CouponModal, CouponItem } from "@/features/admin";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<CouponItem[]>(mockCoupons);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateCoupon = (newCoupon: { code: string; type: "percentage" | "fixed"; value: number; maxUsage: number }) => {
    const item: CouponItem = {
      id: `coup-${Date.now()}`,
      code: newCoupon.code,
      discountType: newCoupon.type,
      value: newCoupon.value,
      usageCount: 0,
      maxUsage: newCoupon.maxUsage,
      expiresAt: "31 ديسمبر 2026",
      status: "active",
    };
    setCoupons([item, ...coupons]);
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
            كوبونات الخصم والتخفيضات 🏷️
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            إنشاء وإدارة أكواد الخصم والخصومات للمرحلة الثانوية والطلاب الجدد
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold flex items-center gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>إنشاء كوبون جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="p-5 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center font-bold">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#0B2D5B] dark:text-white tracking-wider">{c.code}</div>
                <div className="text-[11px] text-slate-400">الاستخدام: {c.usageCount} من {c.maxUsage} • وينتهي في {c.expiresAt}</div>
              </div>
            </div>

            <div className="text-left">
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                {c.discountType === "percentage" ? `${c.value}% خصم` : `${c.value} ج.م خصم`}
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">نشط</span>
            </div>
          </div>
        ))}
      </div>

      <CouponModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateCoupon} />
    </div>
  );
}
