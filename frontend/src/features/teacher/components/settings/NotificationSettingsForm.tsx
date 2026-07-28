import * as React from "react";
import { Loader2, Bell, Mail, Smartphone, ShoppingBag, FileText, Award, DollarSign, Star, Megaphone, Save } from "lucide-react";
import type { NotificationSettings } from "@/features/teacher/types/settings";

interface NotificationSettingsFormProps {
  initialData?: NotificationSettings;
  onSave: (data: Partial<NotificationSettings>) => void;
  isLoading?: boolean;
}

export function NotificationSettingsForm({ initialData, onSave, isLoading }: NotificationSettingsFormProps) {
  const [formData, setFormData] = React.useState<NotificationSettings>({
    inApp: initialData?.inApp ?? true,
    email: initialData?.email ?? true,
    push: initialData?.push ?? false,
    marketing: initialData?.marketing ?? false,
    assignment: initialData?.assignment ?? true,
    quiz: initialData?.quiz ?? true,
    enrollment: initialData?.enrollment ?? true,
    payment: initialData?.payment ?? true,
    review: initialData?.review ?? true,
    systemAnnouncements: initialData?.systemAnnouncements ?? true,
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggle = (field: keyof NotificationSettings) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h2 className="text-lg font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#F58220]" />
          إعدادات وتفضيلات التنبيهات والإشعارات
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          حدد قنوات الإشعارات (تطبيق، بريد، دفع) وأنواع الأحداث التي ترغب بتلقي تنبيهات بها
        </p>
      </div>

      {/* Main Delivery Channels */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">قنوات التنبيه الرئيسية</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">داخل المنصة</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">In-App Notifications</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.inApp}
              onChange={() => toggle("inApp")}
              className="w-5 h-5 accent-[#F58220] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">البريد الإلكتروني</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Email Notifications</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.email}
              onChange={() => toggle("email")}
              className="w-5 h-5 accent-[#F58220] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">إشعارات الجوال (Push)</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Mobile Push</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.push}
              onChange={() => toggle("push")}
              className="w-5 h-5 accent-[#F58220] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Specific Events Notifications */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200">إشعارات الفعاليات والأنشطة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">اشتراكات الطلاب الجدد</span>
            </div>
            <input
              type="checkbox"
              checked={formData.enrollment}
              onChange={() => toggle("enrollment")}
              className="w-5 h-5 accent-[#F58220] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">المدفوعات وعمليات السحب</span>
            </div>
            <input
              type="checkbox"
              checked={formData.payment}
              onChange={() => toggle("payment")}
              className="w-5 h-5 accent-[#F58220] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">تسليمات الواجبات التكاليف</span>
            </div>
            <input
              type="checkbox"
              checked={formData.assignment}
              onChange={() => toggle("assignment")}
              className="w-5 h-5 accent-[#F58220] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">إكمال الاختبارات والتقييمات</span>
            </div>
            <input
              type="checkbox"
              checked={formData.quiz}
              onChange={() => toggle("quiz")}
              className="w-5 h-5 accent-[#F58220] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">تقييمات ومراجعات الدورات</span>
            </div>
            <input
              type="checkbox"
              checked={formData.review}
              onChange={() => toggle("review")}
              className="w-5 h-5 accent-[#F58220] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">إعلانات وتنبيهات النظام</span>
            </div>
            <input
              type="checkbox"
              checked={formData.systemAnnouncements}
              onChange={() => toggle("systemAnnouncements")}
              className="w-5 h-5 accent-[#F58220] cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57310] hover:to-[#f58220] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ تفضيلات الإشعارات
        </button>
      </div>
    </form>
  );
}
export default NotificationSettingsForm;
