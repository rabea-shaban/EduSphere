import * as React from "react";
import { Loader2, Lock, KeyRound, ShieldAlert, Smartphone, Save, CheckCircle2 } from "lucide-react";
import type { SecuritySettings, UpdateSecurityInput } from "@/features/teacher/types/settings";

interface SecuritySettingsFormProps {
  initialData?: SecuritySettings;
  onSave: (data: UpdateSecurityInput) => void;
  isLoading?: boolean;
}

export function SecuritySettingsForm({ initialData, onSave, isLoading }: SecuritySettingsFormProps) {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(initialData?.twoFactorEnabled ?? false);
  const [securityAlerts, setSecurityAlerts] = React.useState(initialData?.securityAlerts ?? true);

  React.useEffect(() => {
    if (initialData) {
      setTwoFactorEnabled(initialData.twoFactorEnabled);
      setSecurityAlerts(initialData.securityAlerts);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateSecurityInput = {
      twoFactorEnabled,
      securityAlerts,
    };
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
      payload.confirmPassword = confirmPassword;
    }
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h2 className="text-lg font-bold text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#F58220]" />
          الأمان وكلمة المرور والحماية
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          تعديل كلمة المرور الشخصية، تفعيل المصادقة الثنائية (2FA)، وضبط تنبيهات الدخول
        </p>
      </div>

      {/* Password change block */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#F58220]" />
          تغيير كلمة المرور
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">كلمة المرور الحالية</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">كلمة المرور الجديدة</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-white dark:bg-[#0F274D] border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
            />
          </div>
        </div>
      </div>

      {/* Two-Factor Auth 2FA */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                المصادقة الثنائية (Two-Factor Authentication - 2FA)
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px]">جاهز للإنتاج</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                حماية الحساب عبر رمز تأكيدي يرسل لتطبيق Authenticator أو الهاتف عند تسجيل الدخول
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={(e) => setTwoFactorEnabled(e.target.checked)}
            className="w-5 h-5 accent-[#F58220] cursor-pointer"
          />
        </div>
      </div>

      {/* Security Alerts */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">تنبيهات الأمان الفورية</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">إرسال تنبيه فور حدوث دخول من متصفح جديد أو موقع جغرافي غير مألوف</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={securityAlerts}
          onChange={(e) => setSecurityAlerts(e.target.checked)}
          className="w-5 h-5 accent-[#F58220] cursor-pointer"
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="h-11 px-8 rounded-2xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] hover:from-[#e57518] hover:to-[#f08d1f] text-white text-xs font-black shadow-lg shadow-[#F58220]/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ إعدادات الأمان
        </button>
      </div>
    </form>
  );
}
export default SecuritySettingsForm;
