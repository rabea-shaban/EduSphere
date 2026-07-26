"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, GraduationCap, UserPlus, AlertCircle, Building2 } from "lucide-react";

import {
  registerSchema,
  RegisterInput,
  AuthCard,
  CustomInput,
  PasswordInput,
  PasswordStrength,
  PrimaryButton,
  SocialButtons,
  AuthDivider,
} from "@/features/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      system: "general",
      stage: "cs_track",
      password: "",
      confirmPassword: "",
      termsAgreed: false,
    },
  });

  const watchPassword = watch("password");

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    setIsLoading(true);

    try {
      // Simulate registration API call
      await new Promise((resolve) => setTimeout(resolve, 1400));
      router.push("/profile/setup");
    } catch (err) {
      setServerError("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2D5B] dark:text-white tracking-tight">
          انضم إلى EduSphere
        </h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          ابدأ رحلة التعلم في علوم الحاسب والبكالوريا والتعليم العام والأزهري
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <CustomInput
          {...register("fullName")}
          label="الاسم الكامل"
          placeholder="مثال: أحمد محمد علي"
          icon={<User className="h-5 w-5" />}
          error={errors.fullName?.message}
        />

        {/* Email */}
        <CustomInput
          {...register("email")}
          type="email"
          label="البريد الإلكتروني"
          placeholder="name@example.com"
          icon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
        />

        {/* Phone & System Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomInput
            {...register("phone")}
            type="tel"
            label="رقم الهاتف (مصري)"
            placeholder="01012345678"
            icon={<Phone className="h-5 w-5" />}
            error={errors.phone?.message}
          />

          <div className="space-y-2 text-right">
            <label className="block text-sm font-semibold text-[#1E293B] dark:text-slate-200">
              نظام التعليم
            </label>
            <div className="relative">
              <select
                {...register("system")}
                className="w-full h-12 rounded-xl text-sm font-medium transition-all duration-200 outline-none bg-slate-50/80 dark:bg-[#0F274D] text-[#1E293B] dark:text-[#F8FAFC] border border-slate-200 dark:border-white/10 px-4 focus:border-[#0B2D5B] dark:focus:border-[#F58220] focus:ring-4 focus:ring-[#0B2D5B]/15 cursor-pointer"
              >
                <option value="general">التعليم العام</option>
                <option value="azhari">التعليم الأزهري الشريف</option>
                <option value="baccalaureate">نظام البكالوريا الجديد</option>
              </select>
            </div>
            {errors.system && (
              <p className="text-xs text-red-500 font-semibold">{errors.system.message}</p>
            )}
          </div>
        </div>

        {/* Stage selection */}
        <div className="space-y-2 text-right">
          <label className="block text-sm font-semibold text-[#1E293B] dark:text-slate-200">
            المرحلة / المسار الدراسي
          </label>
          <div className="relative">
            <select
              {...register("stage")}
              className="w-full h-12 rounded-xl text-sm font-medium transition-all duration-200 outline-none bg-slate-50/80 dark:bg-[#0F274D] text-[#1E293B] dark:text-[#F8FAFC] border border-slate-200 dark:border-white/10 px-4 focus:border-[#0B2D5B] dark:focus:border-[#F58220] focus:ring-4 focus:ring-[#0B2D5B]/15 cursor-pointer"
            >
              <option value="cs_track">💻 مسار علوم الحاسب والتكنولوجيا (جميع المراحل)</option>
              <option value="baccalaureate">📜 نظام البكالوريا الجديد</option>
              <option value="secondary3">🎓 الصف الثالث الثانوي (عام وأزهري)</option>
              <option value="secondary2">📚 الصف الثاني الثانوي</option>
              <option value="secondary1">📖 الصف الأول الثانوي</option>
              <option value="prep">🎒 المرحلة الإعدادية (الصف 1 - 3)</option>
              <option value="primary">✏️ المرحلة الابتدائية (الصف 4 - 6)</option>
            </select>
          </div>
          {errors.stage && (
            <p className="text-xs text-red-500 font-semibold">{errors.stage.message}</p>
          )}
        </div>

        {/* Password */}
        <PasswordInput
          {...register("password")}
          label="كلمة المرور"
          placeholder="••••••••"
          error={errors.password?.message}
        />

        {/* Password Strength Meter */}
        <PasswordStrength password={watchPassword} />

        {/* Confirm Password */}
        <PasswordInput
          {...register("confirmPassword")}
          label="تأكيد كلمة المرور"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
        />

        {/* Terms Agreement */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("termsAgreed")}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#F58220] focus:ring-[#F58220]"
            />
            <span>
              أوافق على{" "}
              <span className="text-[#0B2D5B] dark:text-[#F58220] font-bold hover:underline">
                شروط الخدمة
              </span>{" "}
              و{" "}
              <span className="text-[#0B2D5B] dark:text-[#F58220] font-bold hover:underline">
                سياسة الخصوصية
              </span>{" "}
              الخاصة بـ EduSphere.
            </span>
          </label>
          {errors.termsAgreed && (
            <p className="text-xs text-red-500 font-semibold mt-1">
              {errors.termsAgreed.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <PrimaryButton
          type="submit"
          isLoading={isLoading}
          className="w-full mt-3"
          leftIcon={<UserPlus className="h-5 w-5" />}
        >
          إنشاء حساب جديد
        </PrimaryButton>
      </form>

      <AuthDivider text="أو التسجيل بواسطة" />

      <SocialButtons
        onGoogleClick={() => console.log("Google Register")}
        onAppleClick={() => console.log("Apple Register")}
        onMicrosoftClick={() => console.log("Microsoft Register")}
      />

      <div className="mt-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
        لديك حساب بالفعل؟{" "}
        <Link
          href="/login"
          className="text-[#0B2D5B] dark:text-[#F58220] hover:text-[#F58220] font-bold transition-colors underline-offset-4 hover:underline"
        >
          سجّل الدخول الآن
        </Link>
      </div>
    </AuthCard>
  );
}
