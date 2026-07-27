"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, BookOpen, Award } from "lucide-react";

export default function TeacherRegisterPage() {
  return (
    <div className="min-h-screen py-16 px-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-right" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white dark:bg-[#0F274D] rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-white/10 shadow-2xl space-y-6 text-center"
      >
        <div className="h-16 w-16 rounded-2xl bg-[#F58220]/15 text-[#F58220] flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="h-9 w-9" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#F58220]/10 border border-[#F58220]/20 text-[#F58220] text-xs font-black px-3.5 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            <span>نظام اعتماد المعلمين المعتمدين</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white tracking-tight">
            الانضمام كمعلم ومحاضر في EduSphere 👨‍🏫
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            لضمان أعلى مستويات الجودة الأكاديمية لطلابنا، يتطلب التسجيل كمعلم تعبئة <strong>نموذج طلب الانضمام الرسمية</strong> ومراجعته وتفعيله بواسطة إدارة المنصة.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs text-right space-y-3">
          <div className="font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#F58220]" />
            <span>خطوات التفعيل والبدء:</span>
          </div>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside font-semibold">
            <li>تقديم البيانات الشخصية والمادة التخصصية وسنوات الخبرة.</li>
            <li>إرفاق السيرة الذاتية (CV) وفيديو شرح توضيحي لأسلوبك في التدريس.</li>
            <li>مراجعة الطلب من قبل لجنة EduSphere الأكاديمية خلال 2-5 أيام عمل.</li>
            <li>عند القبول، يتم تفعيل حسابك مباشرة والوصول للوحة تحكم المعلم.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/teacher/apply"
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-[#F58220]/25 hover:opacity-95 transition-opacity"
          >
            <span>تقديم طلب الانضمام كمعلم الآن</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          <div className="text-xs text-slate-500 font-bold pt-2">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-[#0B2D5B] dark:text-[#F58220] hover:underline font-black">
              تسجيل الدخول إلى حسابك
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
