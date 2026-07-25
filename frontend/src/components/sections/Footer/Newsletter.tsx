"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "يرجى كتابة البريد الإلكتروني")
    .email("يرجى إدخال بريد إلكتروني صحيح"),
});

type FormValues = z.infer<typeof formSchema>;

export function Newsletter() {
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSuccess(true);
    toast.success("تم الاشتراك في النشرة البريدية بنجاح!");
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(11,45,91,0.05)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.4)] mb-14 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

        {/* LEFT / FORM (in RTL layout = Visual Left): Orange Button & Input */}
        <div className="w-full lg:w-auto flex-1 max-w-lg">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row items-center gap-3 w-full"
          >

            {/* Subscribe Button (Visual Left in RTL) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#F58220] hover:bg-[#e0711a] text-white font-bold text-xs sm:text-sm h-12 px-7 rounded-xl shadow-md shadow-orange-200 dark:shadow-orange-950/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 flex items-center justify-center gap-2"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : isSuccess ? (
                <>
                  <span>تم الاشتراك</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-200" />
                </>
              ) : (
                <span>اشترك الآن</span>
              )}
            </button>

            {/* Email Input Box (Visual Right in RTL) */}
            <div className="relative w-full">
              <input
                type="email"
                placeholder="اكتب بريدك الإلكتروني"
                {...register("email")}
                disabled={isSubmitting}
                className={cn(
                  "w-full h-12 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl px-4 pl-10 text-xs sm:text-sm font-medium text-[#0B2D5B] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner outline-none transition-all focus:border-[#1E73D8] dark:focus:border-blue-400 focus:ring-2 focus:ring-[#1E73D8]/20",
                  errors.email && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                )}
                style={{ fontFamily: "'Cairo', sans-serif" }}
              />
              <Mail className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            </div>

          </form>

          {/* Form Error Message */}
          {errors.email && (
            <p
              className="text-xs text-red-500 font-semibold text-right pt-1 pr-2"
              style={{ fontFamily: "'Cairo', sans-serif" }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* RIGHT / HEADING (in RTL layout = Visual Right): Title & Subtitle */}
        <div className="text-right space-y-1">
          <h2
            className="text-xl sm:text-2xl font-bold text-[#0B2D5B] dark:text-white tracking-tight"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            اشترك في نشرتنا البريدية
          </h2>
          <p
            className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 font-medium"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            اشترك الآن ليصلك كل جديد من الدروس والعروض والنصائح التعليمية.
          </p>
        </div>

      </div>
    </div>
  );
}

export default Newsletter;
