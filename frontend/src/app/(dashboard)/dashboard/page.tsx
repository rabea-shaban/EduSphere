"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  PlayCircle,
  Sparkles,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  FileCheck2,
  Bell,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  mockStudentProfile,
  mockDashboardStats,
  mockEnrolledCourses,
  mockWeeklyStudyData,
  mockQuizzes,
  StatCard,
  CourseCard,
  StreakCard,
  WeeklyChart,
  QuizCard,
} from "@/features/dashboard";

export default function DashboardHomePage() {
  const activeCourse = mockEnrolledCourses[0];
  const upcomingQuizzes = mockQuizzes.filter((q) => q.status === "available");

  return (
    <div className="space-y-8 text-right">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0B2D5B] via-[#071C3B] to-[#1E73D8] text-white shadow-2xl overflow-hidden"
      >
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#F58220]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] px-3.5 py-1 rounded-full text-xs font-black">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>مرحباً بعودتك!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
              أهلاً بك، {mockStudentProfile.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium leading-relaxed">
              أنت في طريقك الصحيح لإتقان علوم الحاسب والبكالوريا والفيزياء. واصل المذاكرة اليومية للحفاظ على التتابع!
            </p>
          </div>

          {/* Quick Continue Learning CTA Banner Box */}
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
            <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-white/20 shrink-0">
              <Image src={activeCourse.coverImage} alt={activeCourse.title} fill className="object-cover" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] text-blue-200 font-bold">تابع التعلم الآن:</div>
              <div className="text-xs font-bold text-white max-w-[180px] truncate">{activeCourse.title}</div>
              <Link
                href={`/dashboard/lessons/${activeCourse.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#F58220] hover:underline"
              >
                <span>افتح الدرس الحالي</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gamification & Weekly Activity Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StreakCard profile={mockStudentProfile} />
        </div>
        <div className="lg:col-span-2">
          <WeeklyChart data={mockWeeklyStudyData} />
        </div>
      </div>

      {/* 8 Statistics Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            ملخص الأداء والأنشطة 📊
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockDashboardStats.map((stat, idx) => (
            <StatCard key={stat.id} stat={stat} index={idx} />
          ))}
        </div>
      </div>

      {/* Continue Learning Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            كورساتي الجارية 📚
          </h2>
          <Link
            href="/dashboard/courses"
            className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1"
          >
            <span>عرض كل الكورسات</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEnrolledCourses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Upcoming Quizzes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[#0B2D5B] dark:text-white">
            الاختبارات القادمة 📝
          </h2>
          <Link
            href="/dashboard/quizzes"
            className="text-xs font-bold text-[#F58220] hover:underline flex items-center gap-1"
          >
            <span>عرض كل الاختبارات</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upcomingQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </div>
    </div>
  );
}
