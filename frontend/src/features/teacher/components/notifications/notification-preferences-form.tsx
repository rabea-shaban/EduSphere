"use client";

import * as React from "react";
import { Save, Loader2, Bell, Mail, Smartphone, MessageSquare } from "lucide-react";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/hooks/useTeacherNotifications";
import type { NotificationPreferences } from "@/features/teacher/types/notification";

export function NotificationPreferencesForm() {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const [formState, setFormState] = React.useState<Partial<NotificationPreferences>>({});

  React.useEffect(() => {
    if (preferences) {
      setFormState(preferences);
    }
  }, [preferences]);

  if (isLoading) {
    return <div className="p-8 text-center text-xs font-bold text-slate-400">جاري تحميل إعدادات وتفضيلات الإشعارات...</div>;
  }

  const handleChannelToggle = (channelKey: "inApp" | "email" | "push" | "sms") => {
    const currentChannels = formState.channels || { inApp: true, email: true, push: true, sms: false };
    setFormState({
      ...formState,
      channels: {
        ...currentChannels,
        [channelKey]: !currentChannels[channelKey],
      },
    });
  };

  const handleCategoryToggle = (categoryKey: keyof NotificationPreferences["categories"]) => {
    const currentCategories = formState.categories || {
      courseEnrollments: true,
      assignments: true,
      quizzes: true,
      reviews: true,
      paymentsAndWithdrawals: true,
      systemAnnouncements: true,
      securityAlerts: true,
    };
    setFormState({
      ...formState,
      categories: {
        ...currentCategories,
        [categoryKey]: !currentCategories[categoryKey],
      },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePreferences.mutateAsync(formState);
  };

  const channels = formState.channels || { inApp: true, email: true, push: true, sms: false };
  const categories = formState.categories || {
    courseEnrollments: true,
    assignments: true,
    quizzes: true,
    reviews: true,
    paymentsAndWithdrawals: true,
    systemAnnouncements: true,
    securityAlerts: true,
  };

  return (
    <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-6 shadow-sm">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-[#F58220]" />
          إعدادات وقنوات استلام التنبيهات الإشعارية
        </h3>
        <p className="text-xs text-slate-400">تخصيص قنوات الاستلام (داخل المنصة، البريد الإلكتروني، الإشعارات المنبثقة Push) والفئات المسموحة</p>
      </div>

      {/* Channels Selection */}
      <div className="space-y-3">
        <h4 className="text-xs font-black text-slate-700 dark:text-slate-200">1. قنوات استلام الإشعارات:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-indigo-500" />
              <div>
                <span className="font-bold block">إشعارات داخل المنصة (In-App)</span>
                <span className="text-[10px] text-slate-400">عرض التنبيهات بأعلى الشريط العلوي</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={channels.inApp}
              onChange={() => handleChannelToggle("inApp")}
              className="h-4 w-4 accent-[#F58220]"
            />
          </label>

          <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-500" />
              <div>
                <span className="font-bold block">إشعارات البريد الإلكتروني (Email)</span>
                <span className="text-[10px] text-slate-400">إرسال ملخص بالنشاطات للبريد</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={channels.email}
              onChange={() => handleChannelToggle("email")}
              className="h-4 w-4 accent-[#F58220]"
            />
          </label>

          <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-emerald-500" />
              <div>
                <span className="font-bold block">إشعارات المتصفح المنبثقة (Push)</span>
                <span className="text-[10px] text-slate-400">تنبيهات فورية على الشاشة</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={channels.push}
              onChange={() => handleChannelToggle("push")}
              className="h-4 w-4 accent-[#F58220]"
            />
          </label>

          <label className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-500" />
              <div>
                <span className="font-bold block">رسائل الهاتف SMS (مستقبلي)</span>
                <span className="text-[10px] text-slate-400">رسائل نصية قصيرة للهاتف</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={channels.sms}
              onChange={() => handleChannelToggle("sms")}
              className="h-4 w-4 accent-[#F58220]"
            />
          </label>
        </div>
      </div>

      {/* Category Toggles */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/10">
        <h4 className="text-xs font-black text-slate-700 dark:text-slate-200">2. فئات التنبيهات المسموحة:</h4>
        <div className="space-y-2 text-xs">
          {[
            { key: "courseEnrollments", label: "اشتراكات الطلاب الجدد في الكورسات" },
            { key: "assignments", label: "تسليمات الواجبات والتمارين التقييمية" },
            { key: "quizzes", label: "إجابات ومحاولات الطلاب في الاختبارات" },
            { key: "reviews", label: "التقييمات والمراجعات الجديدة على الكورسات" },
            { key: "paymentsAndWithdrawals", label: "المعاملات المالية وطلبات سحب المستحقات" },
            { key: "systemAnnouncements", label: "إعلانات المنصة وتحديثات النظام العامة" },
            { key: "securityAlerts", label: "تنبيهات الأمان وتأمين الحساب الشخصي" },
          ].map((cat) => (
            <label
              key={cat.key}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="font-bold text-slate-700 dark:text-slate-200">{cat.label}</span>
              <input
                type="checkbox"
                checked={!!categories[cat.key as keyof typeof categories]}
                onChange={() => handleCategoryToggle(cat.key as any)}
                className="h-4 w-4 accent-[#F58220]"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={updatePreferences.isPending}
          className="h-11 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {updatePreferences.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>جاري حفظ الإعدادات...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>حفظ إعدادات التنبيهات</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default NotificationPreferencesForm;
