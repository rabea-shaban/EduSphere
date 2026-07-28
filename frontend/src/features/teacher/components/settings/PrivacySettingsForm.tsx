import * as React from "react";
import { Loader2, ShieldCheck, Eye, Mail, Phone, Share2, BarChart2, Search, Save } from "lucide-react";
import type { PrivacySettings } from "@/features/teacher/types/settings";

interface PrivacySettingsFormProps {
  initialData?: PrivacySettings;
  onSave: (data: Partial<PrivacySettings>) => void;
  isLoading?: boolean;
}

export function PrivacySettingsForm({ initialData, onSave, isLoading }: PrivacySettingsFormProps) {
  const [formData, setFormData] = React.useState<PrivacySettings>({
    publicProfile: initialData?.publicProfile ?? true,
    showEmail: initialData?.showEmail ?? false,
    showPhone: initialData?.showPhone ?? false,
    showSocialLinks: initialData?.showSocialLinks ?? true,
    showInstructorStats: initialData?.showInstructorStats ?? true,
    profileVisibility: initialData?.profileVisibility || "public",
    searchEngineVisibility: initialData?.searchEngineVisibility ?? true,
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

  const toggle = (field: keyof PrivacySettings) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h2 className="text-lg font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#F58220]" />
          إعدادات الخصوصية وظهور البيانات
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          تحكّم في مدى رؤية بياناتك الشخصية وإحصائيات المحاضر للزوار والطلاب ومحركات البحث
        </p>
      </div>

      <div className="space-y-4">
        {/* Public Profile */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">الملف الشخصي العام (Public Profile)</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">سماح للعامة بزيارة صفحتك الاستعراضية وقراءة سيرتك الذاتية</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.publicProfile}
            onChange={() => toggle("publicProfile")}
            className="w-5 h-5 accent-[#F58220] cursor-pointer"
          />
        </div>

        {/* Show Email */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-purple-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">إظهار البريد الإلكتروني</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">عرض عنوان البريد الإلكتروني في صفحة المعلم العامة</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.showEmail}
            onChange={() => toggle("showEmail")}
            className="w-5 h-5 accent-[#F58220] cursor-pointer"
          />
        </div>

        {/* Show Phone */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-emerald-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">إظهار رقم الهاتف</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">عرض رقم الهاتف للتواصل المباشر في صفحة الملف الشخصي</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.showPhone}
            onChange={() => toggle("showPhone")}
            className="w-5 h-5 accent-[#F58220] cursor-pointer"
          />
        </div>

        {/* Show Social Links */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-cyan-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">إظهار روابط التواصل الاجتماعي</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">عرض أزرار حساباتك على LinkedIn, YouTube, Twitter وغيرها</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.showSocialLinks}
            onChange={() => toggle("showSocialLinks")}
            className="w-5 h-5 accent-[#F58220] cursor-pointer"
          />
        </div>

        {/* Show Instructor Stats */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">إظهار إحصائيات المعلم</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">عرض عدد الطلاب، عدد الدورات، ومتوسط التقييمات في الملف العام</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.showInstructorStats}
            onChange={() => toggle("showInstructorStats")}
            className="w-5 h-5 accent-[#F58220] cursor-pointer"
          />
        </div>

        {/* Search Engine Visibility */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-rose-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">الأرشفة في محركات البحث (SEO Visibility)</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">السماح لمحركات البحث (مثل Google) بأرشفة صفحتك الشخصية ودوراتك</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={formData.searchEngineVisibility}
            onChange={() => toggle("searchEngineVisibility")}
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
          حفظ إعدادات الخصوصية
        </button>
      </div>
    </form>
  );
}
export default PrivacySettingsForm;
