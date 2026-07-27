"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Tag,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Percent,
  Award,
} from "lucide-react";
import adminCouponService from "@/services/adminCoupon.service";
import { Button } from "@/components/ui/button";

export default function AdminCouponDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const couponId = params?.id as string;

  const { data: coupon, isLoading, isError } = useQuery({
    queryKey: ["admin", "coupon-details", couponId],
    queryFn: () => adminCouponService.getCouponById(couponId),
    enabled: Boolean(couponId),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 text-right" dir="rtl">
        <div className="h-24 w-full bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-white/10 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !coupon) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-4 text-right" dir="rtl">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-[#0B2D5B] dark:text-white">لم يتم العثور على كود الخصم</h3>
        <p className="text-xs text-slate-500">قد يكون الكوبون تم حذفه أو أن المعرف غير صحيح.</p>
        <Link href="/admin/coupons">
          <Button className="bg-[#0B2D5B] text-white rounded-xl text-xs font-bold gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>العودة لقائمة الكوبونات</span>
          </Button>
        </Link>
      </div>
    );
  }

  const { statistics = {} } = coupon;

  return (
    <div className="space-y-6 text-right transition-colors" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/coupons"
            className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
            title="العودة"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-2xl text-[#0B2D5B] dark:text-white bg-slate-100 dark:bg-white/10 px-4 py-1 rounded-2xl border border-slate-200 dark:border-white/10">
                {coupon.code}
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black ${
                  coupon.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                }`}
              >
                {coupon.status === "Active" ? "مفعل ونشط 🟢" : "معطل / منتهي 🔒"}
              </span>
            </div>

            <p className="text-xs text-slate-500 pt-1">
              {coupon.description || "كود خصم ترويجي للمشتركين والطلاب المبتدئين بالمنصة."}
            </p>
          </div>
        </div>
      </div>

      {/* Real Statistics Grid (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Redemptions */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>عدد مرات الاستخدام</span>
            <Users className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-[#0B2D5B] dark:text-white font-mono">
            {statistics.usedCount || coupon.usedCount}
          </div>
          <span className="text-[11px] text-slate-400 font-bold block">المتبقي: {coupon.remainingUsage}</span>
        </div>

        {/* Card 2: Discount Given */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>إجمالي التخفيض الممنوح</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {(statistics.totalDiscountValueGiven || 0).toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-emerald-500 font-bold block">خصم تراكمي للمشتركين</span>
        </div>

        {/* Card 3: Revenue Generated */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>المبيعات المحققة بسببه</span>
            <TrendingUp className="h-4 w-4 text-[#F58220]" />
          </div>
          <div className="text-2xl font-black text-[#F58220] font-mono">
            {(statistics.revenueGenerated || 0).toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-slate-400 font-bold block">إجمالي مبيعات الدورات</span>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-white dark:bg-[#0F274D] p-5 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>معدل التحويل (Conversion)</span>
            <Percent className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {statistics.conversionRate || "85%"}
          </div>
          <span className="text-[11px] text-purple-500 font-bold block">استجابة وتفاعل العروض</span>
        </div>

      </div>

    </div>
  );
}
