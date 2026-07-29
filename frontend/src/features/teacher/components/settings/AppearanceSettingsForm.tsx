"use client";

import * as React from "react";
import { Loader2, Palette, Sun, Moon, Monitor, Sidebar, Table, Save, Check, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "react-hot-toast";
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
  const { setTheme, theme: currentTheme } = useTheme();

  const [formData, setFormData] = React.useState<AppearanceSettings>({
    theme: initialData?.theme || (currentTheme as any) || "system",
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

  // Live Instant Theme Switcher Handler
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setFormData((prev) => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
    toast.success(`تم تغيير نمط المظهر مباشرة إلى (${newTheme === "light" ? "الوضع الفاتح" : newTheme === "dark" ? "الوضع الداكن" : "حسب النظام"})`, {
      id: "live-theme-change",
    });
  };

  // Live Instant Primary Color Switcher Handler
  const handleColorChange = (hex: string, name: string) => {
    setFormData((prev) => ({ ...prev, primaryColor: hex }));
    document.documentElement.style.setProperty("--primary-color", hex);
    document.documentElement.setAttribute("data-primary-color", hex);
    localStorage.setItem("edusphere_primary_color", hex);
    toast.success(`تم تطبيق اللون الرئيسي (${name}) على الواجهة ✨`, { id: "live-color-change" });
  };

  // Live Instant Table Density Handler
  const handleDensityChange = (density: "compact" | "comfortable" | "spacious") => {
    setFormData((prev) => ({ ...prev, tableDensity: density }));
    document.documentElement.setAttribute("data-table-density", density);
    localStorage.setItem("edusphere_table_density", density);
    const densityName = density === "compact" ? "مدمجة" : density === "comfortable" ? "مريحة" : "واسعة";
    toast.success(`تم تغيير كثافة الجداول إلى (${densityName})`, { id: "live-density-change" });
  };

  // Live Instant Sidebar Preference Handler
  const handleSidebarChange = (collapsed: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sidebarPreferences: { ...prev.sidebarPreferences, collapsed },
    }));
    localStorage.setItem("edusphere_sidebar_collapsed", String(collapsed));
    window.dispatchEvent(new Event("sidebar-preference-change"));
    toast.success(collapsed ? "سيتم طي الشريط الجانبي افتراضياً" : "سيتم فتح الشريط الجانبي افتراضياً", {
      id: "live-sidebar-change",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h2 className="text-lg font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#F58220]" />
          مظهر الواجهة والتنسيقات البصرية (تفاعلي مباشر)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          خصّص النمط البصري للمنصة، الألوان الرئيسية، وكثافة جداول البيانات مع معاينة فورية ومباشرة
        </p>
      </div>

      {/* Theme selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
          <span>نمط المظهر (Theme)</span>
          <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
        </label>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => handleThemeChange("light")}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              formData.theme === "light"
                ? "border-[#F58220] bg-orange-500/10 text-[#F58220] shadow-md scale-[1.02]"
                : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Sun className="w-6 h-6 text-amber-500" />
            الوضع الفاتح (Light)
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange("dark")}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              formData.theme === "dark"
                ? "border-[#F58220] bg-orange-500/10 text-[#F58220] shadow-md scale-[1.02]"
                : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-600 dark:text-slate-300"
            }`}
          >
            <Moon className="w-6 h-6 text-indigo-400" />
            الوضع الداكن (Dark)
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange("system")}
            className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              formData.theme === "system"
                ? "border-[#F58220] bg-orange-500/10 text-[#F58220] shadow-md scale-[1.02]"
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
              onClick={() => handleColorChange(color.hex, color.name)}
              className={`h-11 px-4 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                formData.primaryColor === color.hex
                  ? "border-slate-900 dark:border-white ring-2 ring-offset-2 ring-[#F58220] bg-slate-100 dark:bg-white/10 scale-105"
                  : "border-slate-200 dark:border-white/10 hover:opacity-80"
              }`}
            >
              <span className="w-4 h-4 rounded-full shadow-inner border border-white/20" style={{ backgroundColor: color.hex }}></span>
              <span>{color.name}</span>
              {formData.primaryColor === color.hex && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
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
            onClick={() => handleDensityChange("compact")}
            className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              formData.tableDensity === "compact"
                ? "border-[#0B2D5B] dark:border-[#1E73D8] bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            مدمجة (Compact)
          </button>

          <button
            type="button"
            onClick={() => handleDensityChange("comfortable")}
            className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              formData.tableDensity === "comfortable"
                ? "border-[#0B2D5B] dark:border-[#1E73D8] bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
            }`}
          >
            مريحة (Comfortable)
          </button>

          <button
            type="button"
            onClick={() => handleDensityChange("spacious")}
            className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              formData.tableDensity === "spacious"
                ? "border-[#0B2D5B] dark:border-[#1E73D8] bg-[#0B2D5B] dark:bg-[#1E73D8] text-white shadow-sm"
                : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
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
            onChange={(e) => handleSidebarChange(e.target.checked)}
            className="w-5 h-5 accent-[#F58220] cursor-pointer"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 px-8 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57310] hover:to-[#f58220] text-white text-xs font-black shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ تفضيلات المظهر
        </button>
      </div>
    </form>
  );
}
export default AppearanceSettingsForm;
