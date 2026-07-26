"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, KeyRound, CheckCircle2, RotateCw, Sparkles } from "lucide-react";

import {
  forgotPasswordSchema,
  ForgotPasswordInput,
  AuthCard,
  CustomInput,
  PrimaryButton,
} from "@/features/auth";

import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [countdown, setCountdown] = React.useState(60);
  const [submittedTarget, setSubmittedTarget] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: "" },
  });

  // Resend countdown timer effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitted && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitted, countdown]);

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSubmittedTarget(data.identifier);
    setIsLoading(false);
    setIsSubmitted(true);
    setCountdown(60);
    toast.success("تم إرسال رمز الاستعادة بنجاح! 📬");
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setCountdown(60);
    toast.success("تم إعادة إرسال رمز جديد بنجاح! 📩");
  };

  return (
    <AuthCard>
      {!isSubmitted ? (
        <>
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-[#0B2D5B]/10 text-[#0B2D5B] dark:text-[#F58220] flex items-center justify-center mx-auto mb-3">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D5B] dark:text-white tracking-tight">
              استعادة كلمة المرور
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              أدخل بريدك الإلكتروني أو رقم الهاتف المنسوب لحسابك لإرسال رابط الاستعادة
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CustomInput
              {...register("identifier")}
              label="البريد الإلكتروني أو رقم الهاتف"
              placeholder="student@example.com أو 01012345678"
              icon={<Mail className="h-5 w-5" />}
              error={errors.identifier?.message}
            />

            <PrimaryButton
              type="submit"
              isLoading={isLoading}
              className="w-full"
              leftIcon={<Sparkles className="h-5 w-5" />}
            >
              إرسال رمز الاستعادة
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
        </>
      ) : (
        /* Sent Confirmation Screen */
        <div className="text-center space-y-6 py-2">
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#0B2D5B] dark:text-white">
              تم إرسال رمز الاستعادة! 📬
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              قمنا بإرسال رمز الاستعادة إلى{" "}
              <span className="font-bold text-[#0B2D5B] dark:text-white dir-ltr inline-block">
                {submittedTarget}
              </span>
            </p>
          </div>

          {/* Action to proceed to reset page */}
          <div className="space-y-3 pt-2">
            <PrimaryButton
              type="button"
              onClick={() => router.push(`/reset-password?target=${encodeURIComponent(submittedTarget)}`)}
              className="w-full"
            >
              إدخال رمز الاستعادة وكلمة المرور الجديدة
            </PrimaryButton>

            <button
              type="button"
              disabled={countdown > 0 || isLoading}
              onClick={handleResend}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 disabled:opacity-50 hover:text-[#F58220] transition-colors py-2"
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>
                {countdown > 0
                  ? `إعادة إرسال الرمز خلال ${countdown} ثانية`
                  : "إعادة إرسال رمز جديد الآن"}
              </span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/10 text-xs font-semibold">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-[#F58220] transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              <span>العودة لصفحة تسجيل الدخول</span>
            </Link>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
