import * as React from "react";
import { Settings, RefreshCw } from "lucide-react";

interface SettingsEmptyStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function SettingsEmptyState({
  title = "تعذر تحميل إعدادات الحساب",
  description = "حدث خطأ غير متوقع أثناء استرجاع التفضيلات من الخادم. يرجى التحقق من اتصال شبكة الإنترنت أو المحاولة مرة أخرى.",
  onRetry,
}: SettingsEmptyStateProps) {
  return (
    <div className="bg-white dark:bg-[#0F274D] rounded-3xl p-12 text-center border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4" dir="rtl">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
        <Settings className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-[#0B2D5B] dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2D5B] dark:bg-[#1E73D8] text-white text-xs font-bold transition-transform active:scale-95 shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
export default SettingsEmptyState;
