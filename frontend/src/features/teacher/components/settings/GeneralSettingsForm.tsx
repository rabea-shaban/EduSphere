import * as React from "react";
import { Loader2, Globe, Clock, Calendar, DollarSign, LayoutDashboard, Eye, Save } from "lucide-react";
import type { GeneralSettings } from "@/features/teacher/types/settings";

interface GeneralSettingsFormProps {
  initialData?: GeneralSettings;
  onSave: (data: Partial<GeneralSettings>) => void;
  isLoading?: boolean;
}

export function GeneralSettingsForm({ initialData, onSave, isLoading }: GeneralSettingsFormProps) {
  const [formData, setFormData] = React.useState<GeneralSettings>({
    language: initialData?.language || "ar",
    timezone: initialData?.timezone || "Africa/Cairo",
    dateFormat: initialData?.dateFormat || "YYYY-MM-DD",
    timeFormat: initialData?.timeFormat || "12h",
    currency: initialData?.currency || "EGP",
    defaultDashboard: initialData?.defaultDashboard || "overview",
    profileVisibility: initialData?.profileVisibility || "public",
    autoSavePreferences: initialData?.autoSavePreferences ?? true,
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

  const handleChange = (field: keyof GeneralSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h2 className="text-lg font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#F58220]" />
          الإعدادات العامة وتفضيلات الحساب
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          حدد اللغة الافتراضية، المنطقة الزمنية، العملة، وطريقة عرض التواريخ في لوحة التحكم
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            اللغة الرئيسية للمنصة
          </label>
          <select
            value={formData.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors"
          >
            <option value="ar">العربية (Arabic)</option>
            <option value="en">English (الإنجليزية)</option>
            <option value="fr">Français (الفرنسية)</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            المنطقة الزمنية
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors"
          >
            <option value="Africa/Cairo">(GMT+02:00) القاهرة / مصر</option>
            <option value="Asia/Riyadh">(GMT+03:00) الرياض / السعودية</option>
            <option value="Asia/Dubai">(GMT+04:00) دبي / الإمارات</option>
            <option value="UTC">(GMT+00:00) التوقيت العالمي UTC</option>
            <option value="Europe/London">(GMT+00:00) لندن / المملكة المتحدة</option>
          </select>
        </div>

        {/* Date Format */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            تنسيق عرض التاريخ
          </label>
          <select
            value={formData.dateFormat}
            onChange={(e) => handleChange("dateFormat", e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors"
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD (2026-07-28)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (28/07/2026)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (07/28/2026)</option>
          </select>
        </div>

        {/* Time Format */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            تنسيق عرض الوقت
          </label>
          <select
            value={formData.timeFormat}
            onChange={(e) => handleChange("timeFormat", e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors"
          >
            <option value="12h">نظام 12 ساعة (02:30 م)</option>
            <option value="24h">نظام 24 ساعة (14:30)</option>
          </select>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-400" />
            العملة الافتراضية لعرض الأرباح
          </label>
          <select
            value={formData.currency}
            onChange={(e) => handleChange("currency", e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors"
          >
            <option value="EGP">جنيه مصري (EGP)</option>
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="AED">درهم إماراتي (AED)</option>
            <option value="USD">دولار أمريكي ($ USD)</option>
            <option value="EUR">يورو (€ EUR)</option>
          </select>
        </div>

        {/* Default Dashboard */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            الصفحة الافتراضية عند الدخول
          </label>
          <select
            value={formData.defaultDashboard}
            onChange={(e) => handleChange("defaultDashboard", e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors"
          >
            <option value="overview">نظرة عامة (Overview)</option>
            <option value="courses">دوراتي التعليمية (Courses)</option>
            <option value="analytics">التحليلات والأداء (Analytics)</option>
            <option value="earnings">الأرباح والمبيعات (Earnings)</option>
            <option value="students">إدارة الطلاب (Students)</option>
          </select>
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#F58220]" />
              ظهور الملف الشخصي للعامة
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              السماح للمستخدمين والزوار بعرض ملفك الشخصي والدورات المتاحة
            </p>
          </div>
          <select
            value={formData.profileVisibility}
            onChange={(e) => handleChange("profileVisibility", e.target.value)}
            className="h-9 px-3 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-bold outline-none"
          >
            <option value="public">عام للجميع</option>
            <option value="students_only">للطلاب المسجلين فقط</option>
            <option value="private">خاص</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Save className="w-4 h-4 text-emerald-500" />
              الحفظ التلقائي للتغييرات
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              مزامنة التفضيلات وحفظها مباشرة عبر كافة الأجهزة عند تعديلها
            </p>
          </div>
          <input
            type="checkbox"
            checked={formData.autoSavePreferences}
            onChange={(e) => handleChange("autoSavePreferences", e.target.checked)}
            className="w-5 h-5 accent-[#F58220] cursor-pointer"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57310] hover:to-[#f58220] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ التغييرات العامة
        </button>
      </div>
    </form>
  );
}
export default GeneralSettingsForm;
