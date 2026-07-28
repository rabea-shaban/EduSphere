"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

import {
  loginSchema,
  LoginInput,
  AuthCard,
  CustomInput,
  PasswordInput,
  PrimaryButton,
  SocialButtons,
  AuthDivider,
} from "@/features/auth";

import { toast } from "react-hot-toast";

import { useAuthContext } from "@/providers/auth-provider";

export default function LoginPage() {
  const { login } = useAuthContext();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    setIsLoading(true);

    try {
      await login(data);
    } catch (err: any) {
      setServerError(err?.message || "بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D5B] dark:text-white tracking-tight">
          مرحباً بعودتك
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          سجّل الدخول للمتابعة في منصة <span className="text-[#F58220] font-bold">EduSphere</span>
        </p>
      </div>

      {/* Server error alert */}
      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-semibold flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <CustomInput
          {...register("identifier")}
          label="البريد الإلكتروني أو رقم الهاتف"
          placeholder="student@example.com أو 01012345678"
          icon={<Mail className="h-5 w-5" />}
          error={errors.identifier?.message}
          autoComplete="username"
        />

        <PasswordInput
          {...register("password")}
          label="كلمة المرور"
          placeholder="••••••••"
          error={errors.password?.message}
          autoComplete="current-password"
        />

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-slate-300 dark:border-white/10 text-[#F58220] focus:ring-[#F58220]"
            />
            <span>تذكرني على هذا الجهاز</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-[#0B2D5B] dark:text-[#F58220] hover:text-[#F58220] transition-colors font-bold"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Submit button */}
        <PrimaryButton
          type="submit"
          isLoading={isLoading}
          className="w-full mt-2"
          leftIcon={<LogIn className="h-5 w-5" />}
        >
          تسجيل الدخول
        </PrimaryButton>
      </form>

      {/* Divider */}
      <AuthDivider text="أو الدخول بواسطة" />

      {/* Social Buttons */}
      <SocialButtons
        onGoogleClick={() => console.log("Google Login")}
        onAppleClick={() => console.log("Apple Login")}
        onMicrosoftClick={() => console.log("Microsoft Login")}
      />

      {/* Link to Register */}
      <div className="mt-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        ليس لديك حساب بعد؟{" "}
        <Link
          href="/register"
          className="text-[#F58220] hover:text-[#ff9a2a] font-bold transition-colors underline-offset-4 hover:underline"
        >
          أنشئ حسابك الجديد مجاناً
        </Link>
      </div>
    </AuthCard>
  );
}
