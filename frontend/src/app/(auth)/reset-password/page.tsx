"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, CheckCircle2, ArrowRight, Lock, AlertCircle } from "lucide-react";

import {
  resetPasswordSchema,
  ResetPasswordInput,
  AuthCard,
  CustomInput,
  PasswordInput,
  PasswordStrength,
  PrimaryButton,
} from "@/features/auth";

import { toast } from "react-hot-toast";

import authService from "@/services/auth.service";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get("target") || "";

  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "123456",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const watchPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);
    setIsLoading(true);

    try {
      await authService.resetPassword(data);
      setIsSuccess(true);
      toast.success("تم إعادة تعيين كلمة المرور بنجاح! 🔒");
    } catch (err: any) {
      const msg = err?.message || "رمز التحقق غير صحيح أو منتهي الصلاحية.";
      toast.error(msg);
      setServerError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthCard className="text-center py-10">
        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white mb-2">
          تم تغيير كلمة المرور بنجاح! 🎉
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">
          يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة ومتابعة التعلم.
        </p>
        <PrimaryButton
          type="button"
          onClick={() => router.push("/login")}
          className="w-full"
        >
          الانتقال إلى تسجيل الدخول
        </PrimaryButton>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#F58220] flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D5B] dark:text-white tracking-tight">
          تعيين كلمة مرور جديدة
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {target
            ? `أدخل الرمز المرسل إلى ${target}`
            : "أدخل رمز التحقق وكلمة المرور الجديدة"}
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* OTP Code */}
        <CustomInput
          {...register("code")}
          label="رمز التحقق (OTP)"
          placeholder="123456"
          maxLength={6}
          className="text-center font-mono text-lg tracking-widest"
          error={errors.code?.message}
        />

        {/* New Password */}
        <PasswordInput
          {...register("newPassword")}
          label="كلمة المرور الجديدة"
          placeholder="••••••••"
          error={errors.newPassword?.message}
        />

        {/* Password Strength */}
        <PasswordStrength password={watchPassword} />

        {/* Confirm Password */}
        <PasswordInput
          {...register("confirmNewPassword")}
          label="تأكيد كلمة المرور الجديدة"
          placeholder="••••••••"
          error={errors.confirmNewPassword?.message}
        />

        <PrimaryButton
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          حفظ كلمة المرور الجديدة
        </PrimaryButton>
      </form>

      <div className="mt-8 text-center text-xs font-semibold">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#F58220] transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          <span>العودة لصفحة تسجيل الدخول</span>
        </Link>
      </div>
    </AuthCard>
  );
}
