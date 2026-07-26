"use client";

import * as React from "react";
import { Settings, Lock, Bell, Moon, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/common";

export default function SettingsPage() {
  const [tab, setTab] = React.useState<"profile" | "security" | "notifications" | "privacy">("profile");

  return (
    <div className="space-y-8 text-right">
      <div className="border-b border-slate-200/80 dark:border-white/10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white">
          إعدادات الحساب والمنصة ⚙️
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          إدارة تفضيلات الأمان، الإشعارات، والنمط البصري للحساب
        </p>
      </div>

      <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-6">
        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={() => setTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "profile"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            تعديل البيانات
          </button>
          <button
            type="button"
            onClick={() => setTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "security"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            كلمة المرور والأمان
          </button>
          <button
            type="button"
            onClick={() => setTab("notifications")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === "notifications"
                ? "bg-[#0B2D5B] dark:bg-[#1E73D8] text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
            }`}
          >
            تفضيلات الإشعارات
          </button>
        </div>

        {/* Tab 1: Profile form */}
        {tab === "profile" && (
          <form className="space-y-4 max-w-lg" onSubmit={(e) => { e.preventDefault(); alert("تم حفظ البيانات بنجاح!"); }}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم الكامل</label>
              <input
                type="text"
                defaultValue="ربيع شعبان"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني</label>
              <input
                type="email"
                defaultValue="rabie.student@edusphere.edu.eg"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف (مصري)</label>
              <input
                type="tel"
                defaultValue="01012345678"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
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

        {/* Tab 2: Security */}
        {tab === "security" && (
          <form className="space-y-4 max-w-lg" onSubmit={(e) => { e.preventDefault(); alert("تم تغيير كلمة المرور بنجاح!"); }}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">كلمة المرور الحالية</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">كلمة المرور الجديدة</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold shadow-md hover:bg-[#F58220] transition-colors"
            >
              تغيير كلمة المرور
            </button>
          </form>
        )}

        {/* Tab 3: Notifications Preferences */}
        {tab === "notifications" && (
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">إشعارات الاختبارات والواجبات</span>
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#F58220]" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">إشعارات الدروس الجديدة</span>
              <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#F58220]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
