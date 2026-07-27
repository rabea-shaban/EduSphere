"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  KeyRound,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_QUERY_KEY } from "@/hooks/useAuth";
import authService from "@/services/auth.service";
import { useAuthContext } from "@/providers/auth-provider";

export default function AdminLoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, role } = useAuthContext();

  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // If admin is already authenticated, redirect to dashboard automatically
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = (role || user.role || "").toLowerCase();
      if (userRole.includes("admin") || userRole === "super_admin") {
        router.push("/admin/dashboard");
      }
    }
  }, [isAuthenticated, user, role, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني (أو اسم المستخدم) وكلمة المرور.");
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setIsLoading(true);
      const res = await authService.login({
        identifier: identifier.trim(),
        password,
        rememberMe,
      });

      const loggedUser = res?.data?.user;
      const userRole = (loggedUser?.role || "").toLowerCase();

      // Role Security Verification: Reject non-admin users trying to access Admin Portal
      if (!userRole.includes("admin") && userRole !== "super_admin") {
        await authService.logout();
        const accessDeniedMsg =
          "عفواً، هذا الحساب غير مصرح له بالدخول إلى لوحة التحكم الإدارية. يرجى الدخول عبر بوابة المستخدمين العادية.";
        setErrorMessage(accessDeniedMsg);
        toast.error(accessDeniedMsg);
        return;
      }

      // Invalidate and refetch current user query to update AuthContext immediately
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      await queryClient.refetchQueries({ queryKey: AUTH_QUERY_KEY });

      toast.success(`أهلاً بك أستاذ ${loggedUser?.firstName || loggedUser?.fullName || "المشرف"}! تم تسجيل دخول الإدارة بنجاح 🎉`);
      
      // Full window redirect or push to dashboard
      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      let msg = "بيانات الدخول غير صحيحة أو الحساب غير مفعّل. يرجى التأكد من البيانات والمحاولة مجدداً.";
      if (err?.response?.status === 401) {
        msg = "اسم المستخدم أو كلمة المرور غير صحيحة. يرجى إعادة المحاولة.";
      } else if (err?.response?.status === 403) {
        msg = "تم حظر هذا الحساب الإداري. يرجى التواصل مع المدير الفائق (Super Admin).";
      } else if (err?.response?.status === 429) {
        msg = "تم تجاوز عدد محاولات الدخول المسموح بها. يرجى الانتظار 15 دقيقة والتجربة لاحقاً.";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      }
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-right" dir="rtl">
      {/* Header Branding */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 bg-[#0B2D5B]/10 dark:bg-white/10 text-[#0B2D5B] dark:text-white px-3.5 py-1.5 rounded-full text-xs font-black border border-[#0B2D5B]/20 dark:border-white/20">
          <ShieldCheck className="h-4 w-4 text-[#F58220]" />
          <span>بوابة التوثيق الإداري — EduSphere Control Center</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#0B2D5B] dark:text-white tracking-tight pt-1">
          تسجيل دخول المسئولين والمدراء 🔐
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          أدخل البريد الإلكتروني المعتمد وكلمة المرور للوصول إلى لوحة التحكم
        </p>
      </div>

      {/* Error Message Callout */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <p className="font-bold leading-relaxed">{errorMessage}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
            البريد الإلكتروني الإداري / اسم المستخدم *
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@edusphere.com أو اسم المستخدم..."
              className="w-full h-12 pr-10 pl-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors dir-ltr text-right"
            />
            <Mail className="h-4 w-4 text-slate-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-200">كلمة المرور *</label>
            <Link
              href="/forgot-password"
              className="text-slate-500 hover:text-[#F58220] transition-colors font-bold text-[11px]"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-12 pr-10 pl-10 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220] transition-colors dir-ltr text-right"
            />
            <Lock className="h-4 w-4 text-slate-400 absolute right-3 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label
            onClick={() => setRememberMe(!rememberMe)}
            className="flex items-center gap-2 cursor-pointer font-bold text-slate-600 dark:text-slate-300"
          >
            {rememberMe ? (
              <CheckSquare className="h-4 w-4 text-[#F58220]" />
            ) : (
              <Square className="h-4 w-4 text-slate-400" />
            )}
            <span>تذكرني على هذا الجهاز</span>
          </label>

          <span className="text-[11px] text-slate-400">جلسة محمية 24h</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#0B2D5B] via-[#1E73D8] to-[#0B2D5B] text-white text-xs sm:text-sm font-black shadow-xl shadow-[#0B2D5B]/20 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-[#F58220]" />
              <span>جاري التحقق من التراخيص...</span>
            </>
          ) : (
            <>
              <span>تسجيل الدخول كمدير</span>
              <KeyRound className="h-4 w-4 text-[#F58220]" />
            </>
          )}
        </button>
      </form>

      {/* Security Note Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/10 text-center space-y-2">
        <p className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-emerald-500" />
          اتصال آمن ومحمي بنظام التشفير التكتيكي 256-bit SSL
        </p>
        <div className="text-[11px]">
          <Link href="/login" className="text-slate-500 hover:text-[#F58220] font-bold underline">
            الذهاب لصفحة دخول الطلاب والمعلمين
          </Link>
        </div>
      </div>
    </div>
  );
}
