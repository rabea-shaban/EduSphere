"use client";

import * as React from "react";
import { Lock, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { useChangePassword } from "@/hooks/useTeacherProfile";
import { toast } from "react-hot-toast";

export function AccountSecurityForm() {
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("تأكيد كلمة المرور غير متطابق مع كلمة المرور الجديدة");
      return;
    }
    await changePassword.mutateAsync({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-[#0F274D] border border-slate-200/80 dark:border-white/10 text-right dir-rtl space-y-5 shadow-sm">
      <div className="border-b border-slate-100 dark:border-white/10 pb-4">
        <h3 className="text-sm font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#F58220]" />
          أمان الحساب وتغيير كلمة المرور 🔒
        </h3>
        <p className="text-xs text-slate-400">تأمين حساب المحاضر وتحديث كلمة المرور بانتظام</p>
      </div>

      <div className="space-y-4 max-w-md text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">كلمة المرور الحالية *</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold text-left"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">كلمة المرور الجديدة *</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold text-left"
            dir="ltr"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-700 dark:text-slate-200">تأكيد كلمة المرور الجديدة *</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
            className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none focus:border-[#F58220] font-semibold text-left"
            dir="ltr"
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end">
        <button
          type="submit"
          disabled={changePassword.isPending}
          className="h-11 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-black flex items-center gap-2 shadow hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
        >
          {changePassword.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>جاري تحديث كلمة المرور...</span>
            </>
          ) : (
            <>
              <KeyRound className="h-4 w-4" />
              <span>حفظ كلمة المرور الجديدة</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default AccountSecurityForm;
