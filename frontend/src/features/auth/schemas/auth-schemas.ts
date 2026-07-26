import { z } from "zod";

// Egyptian phone number regex (e.g. 01012345678, 011..., 012..., 015...)
const egyptianPhoneRegex = /^01[0125]\d{8}$/;

// Login Schema
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف" }),
  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "الاسم الكامل يجب أن يكون 3 أحرف على الأقل" }),
    email: z
      .string()
      .min(1, { message: "يرجى إدخال البريد الإلكتروني" })
      .email({ message: "صيغة البريد الإلكتروني غير صحيحة" }),
    phone: z
      .string()
      .min(1, { message: "يرجى إدخال رقم الهاتف" })
      .refine((val) => egyptianPhoneRegex.test(val), {
        message: "يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)",
      }),
    system: z.enum(["general", "azhari", "baccalaureate"], {
      message: "يرجى اختيار نظام التعليم (عام / أزهري / بكالوريا)",
    }),
    stage: z.enum(
      ["primary", "prep", "secondary1", "secondary2", "secondary3", "baccalaureate", "cs_track"],
      { message: "يرجى اختيار المرحلة الدراسية" }
    ),
    password: z
      .string()
      .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
      .regex(/[A-Z]/, { message: "يجب أن تحتوي على حرف كبير واحد على الأقل" })
      .regex(/[a-z]/, { message: "يجب أن تحتوي على حرف صغير واحد على الأقل" })
      .regex(/[0-9]/, { message: "يجب أن تحتوي على رقم واحد على الأقل" }),
    confirmPassword: z
      .string()
      .min(1, { message: "يرجى تأكيد كلمة المرور" }),
    termsAgreed: z.boolean().refine((val) => val === true, {
      message: "يجب الموافقة على الشروط والأحكام للاستمرار",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, { message: "يرجى إدخال البريد الإلكتروني أو رقم الهاتف" }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// OTP Verification Schema
export const otpVerificationSchema = z.object({
  code: z
    .string()
    .length(6, { message: "رمز التحقق يتكون من 6 أرقام" })
    .regex(/^\d+$/, { message: "رمز التحقق يجب أن يتكون من أرقام فقط" }),
});

export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .length(6, { message: "رمز التحقق يتكون من 6 أرقام" }),
    newPassword: z
      .string()
      .min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" })
      .regex(/[A-Z]/, { message: "يجب أن تحتوي على حرف كبير واحد على الأقل" })
      .regex(/[a-z]/, { message: "يجب أن تحتوي على حرف صغير واحد على الأقل" })
      .regex(/[0-9]/, { message: "يجب أن تحتوي على رقم واحد على الأقل" }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "يرجى تأكيد كلمة المرور الجديدة" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Profile Setup Schema
export const profileSetupSchema = z.object({
  role: z.enum(["student", "parent", "teacher"]),
  system: z.enum(["general", "azhari", "baccalaureate"]),
  stage: z.enum(["primary", "prep", "secondary1", "secondary2", "secondary3", "baccalaureate", "cs_track"]),
  stream: z
    .enum(["general", "scientific_science", "scientific_math", "literary", "computer_science", "azhari_sharia"])
    .optional(),
  subjects: z
    .array(z.string())
    .min(1, { message: "اختر مادة واحدة على الأقل" }),
  dailyStudyHours: z.number().min(1).max(12),
  targetPercentage: z.number().min(50).max(100),
  notificationsEnabled: z.boolean(),
});

export type ProfileSetupInput = z.infer<typeof profileSetupSchema>;
