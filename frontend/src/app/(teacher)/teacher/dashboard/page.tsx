"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import {
  mockTeacherProfile,
  mockTeacherStats,
  mockTeacherCourses,
  mockMonthlyRevenueData,
  mockOrders,
  mockReviews,
  TeacherStatCard,
  TeacherCourseCard,
  RevenueChart,
  ReviewCard,
} from "@/features/teacher";

export default function TeacherDashboardHomePage() {
  return (
    <div className="space-y-6 sm:space-y-8 text-right">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] text-white shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
              <span>مساحة المحاضر والمدرس</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-black tracking-tight leading-snug">
              مرحباً بك، {mockTeacherProfile.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
              لديك <strong className="text-[#F58220]">24 اشتراك جديد</strong> اليوم و 14 واجباً بانتظار التقييم والتصحيح.
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/teacher/courses/create"
              className="flex-1 sm:flex-initial h-11 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#F58220]/30 hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>إنشاء كورس جديد</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid: 2 cols mobile → 4 cols desktop */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-black text-[#0B2D5B] dark:text-white">
          ملخص الأداء والمبيعات 📊
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {mockTeacherStats.map((stat, idx) => (
            <TeacherStatCard key={stat.id} stat={stat} index={idx} />
          ))}
        </div>
      </div>

      {/* Revenue Chart & Recent Sales */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={mockMonthlyRevenueData} />
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
            <h3 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-[#F58220] shrink-0" />
              <span>أحدث طلبات الاشتراك</span>
            </h3>
            <Link href="/teacher/orders" className="text-[11px] font-bold text-[#F58220] hover:underline whitespace-nowrap">
              عرض الكل
            </Link>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72 xl:max-h-80 pr-1 -mr-1">
            {mockOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-right space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#0B2D5B] dark:text-white gap-2">
                  <span className="truncate">{ord.studentName}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 shrink-0">+{ord.amount} ج.م</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{ord.courseTitle}</div>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1 gap-2">
                  <span className="truncate">طريقة الدفع: {ord.paymentMethod}</span>
                  <span className="shrink-0">{ord.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Performance Grid */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-black text-[#0B2D5B] dark:text-white">
            أداء الكورسات المنشورة 📚
          </h2>
          <Link href="/teacher/courses" className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap">
            <span>إدارة جميع الكورسات</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mockTeacherCourses.slice(0, 3).map((course) => (
            <TeacherCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Latest Reviews */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-black text-[#0B2D5B] dark:text-white">
            أحدث تقييمات الطلاب ⭐️
          </h2>
          <Link href="/teacher/reviews" className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap">
            <span>عرض التقييمات</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {mockReviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      </div>
    </div>
  );
}
