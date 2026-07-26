"use client";

import * as React from "react";
import { Settings, Lock, Bell, Moon, User } from "lucide-react";
import { mockTeacherProfile } from "@/features/teacher";

export default function InstructorSettingsPage() {
  const [tab, setTab] = React.useState<"account" | "password" | "notifications">("account");

  return (
    <div className="space-y-8 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إعدادات حساب المعلم ⚙️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          إدارة بيانات الحساب الشخصي، كلمة المرور، وتنبيهات المبيعات
        </p>
      </div>

      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={() => setTab("account")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "account"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            بيانات المحاضر
          </button>
          <button
            type="button"
            onClick={() => setTab("password")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "password"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            كلمة المرور والأمان
          </button>
        </div>

        {tab === "account" && (
          <form className="space-y-4 max-w-lg" onSubmit={(e) => { e.preventDefault(); alert("تم حفظ التعديلات بنجاح!"); }}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">الاسم الكامل</label>
              <input
                type="text"
                defaultValue={mockTeacherProfile.name}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">المسمى الوظيفي</label>
              <input
                type="text"
                defaultValue={mockTeacherProfile.title}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">النبذة التعريفية (Bio)</label>
              <textarea
                defaultValue={mockTeacherProfile.bio}
                rows={4}
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md"
            >
              حفظ التغييرات
            </button>
          </form>
        )}

        {tab === "password" && (
          <form className="space-y-4 max-w-lg" onSubmit={(e) => { e.preventDefault(); alert("تم تحديث كلمة المرور بنجاح!"); }}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">كلمة المرور الحالية</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">كلمة المرور الجديدة</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md"
            >
              تغيير كلمة المرور
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
