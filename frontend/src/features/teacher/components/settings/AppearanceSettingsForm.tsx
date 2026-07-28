import * as React from "react";
import { Loader2, Palette, Sun, Moon, Monitor, Sidebar, Table, Save, Check } from "lucide-react";
import type { AppearanceSettings } from "@/features/teacher/types/settings";

interface AppearanceSettingsFormProps {
  initialData?: AppearanceSettings;
  onSave: (data: Partial<AppearanceSettings>) => void;
  isLoading?: boolean;
}

const COLOR_PALETTES = [
  { name: "الكحلي الرسمي", hex: "#0B2D5B" },
  { name: "البرتقالي المميز", hex: "#F58220" },
  { name: "الأزرق الملكي", hex: "#2563EB" },
  { name: "الأخضر الزمردي", hex: "#10B981" },
  { name: "البنفسجي المودرن", hex: "#7C3AED" },
];

export function AppearanceSettingsForm({ initialData, onSave, isLoading }: AppearanceSettingsFormProps) {
  const [formData, setFormData] = React.useState<AppearanceSettings>({
    theme: initialData?.theme || "system",
    primaryColor: initialData?.primaryColor || "#0B2D5B",
    sidebarPreferences: {
      collapsed: initialData?.sidebarPreferences?.collapsed ?? false,
      position: initialData?.sidebarPreferences?.position || "right",
    },
    tableDensity: initialData?.tableDensity || "comfortable",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h2 className="text-lg font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#F58220]" />
          مظهر الواجهة والتنسيقات البصرية
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          خصّص النمط البصري للمنصة، الألوان الرئيسية، وكثافة جداول البيانات
        </p>
      </div>

      {/* Theme selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">نمط المظهر (Theme)</label>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, theme: "light" }))}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              formData.theme === "light"
                ? "border-[#F58220] bg-orange-500/5 text-[#F58220]"
                : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Sun className="w-6 h-6 text-amber-500" />
            الوضع الفاتح (Light)
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, theme: "dark" }))}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              formData.theme === "dark"
                ? "border-[#F58220] bg-orange-500/5 text-[#F58220]"
                : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Moon className="w-6 h-6 text-indigo-400" />
            الوضع الداكن (Dark)
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, theme: "system" }))}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
              formData.theme === "system"
                ? "border-[#F58220] bg-orange-500/5 text-[#F58220]"
                : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Monitor className="w-6 h-6 text-emerald-500" />
            حسب النظام (System)
          </button>
        </div>
      </div>

      {/* Primary Color Palette */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200">اللون الرئيسي للواجهة (Primary Color)</label>
        <div className="flex flex-wrap gap-3">
          {COLOR_PALETTES.map((color) => (
            <button
              key={color.hex}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, primaryColor: color.hex }))}
              className={`h-10 px-4 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                formData.primaryColor === color.hex
                  ? "border-slate-900 dark:border-white ring-2 ring-offset-2 ring-[#F58220]"
                  : "border-slate-200 dark:border-white/10 hover:opacity-80"
              }`}
            >
              <span className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: color.hex }}></span>
              {color.name}
              {formData.primaryColor === color.hex && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Table Density */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Table className="w-4 h-4 text-slate-400" />
          كثافة عرض جداول البيانات (Table Density)
        </label>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, tableDensity: "compact" }))}
            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
              formData.tableDensity === "compact"
                ? "border-[#0B2D5B] bg-[#0B2D5B] text-white"
                : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
            }`}
          >
            مدمجة (Compact)
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, tableDensity: "comfortable" }))}
            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
              formData.tableDensity === "comfortable"
                ? "border-[#0B2D5B] bg-[#0B2D5B] text-white"
                : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
            }`}
          >
            مريحة (Comfortable)
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, tableDensity: "spacious" }))}
            className={`p-3 rounded-xl border text-xs font-bold transition-all ${
              formData.tableDensity === "spacious"
                ? "border-[#0B2D5B] bg-[#0B2D5B] text-white"
                : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
            }`}
          >
            واسعة (Spacious)
          </button>
        </div>
      </div>

      {/* Sidebar Preferences */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-4">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Sidebar className="w-4 h-4 text-[#F58220]" />
          تفضيلات الشريط الجانبي (Sidebar)
        </h4>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400">طي الشريط الجانبي افتراضياً</span>
          <input
            type="checkbox"
            checked={formData.sidebarPreferences.collapsed}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sidebarPreferences: { ...prev.sidebarPreferences, collapsed: e.target.checked },
              }))
            }
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
          حفظ تفضيلات المظهر
        </button>
      </div>
    </form>
  );
}
export default AppearanceSettingsForm;
