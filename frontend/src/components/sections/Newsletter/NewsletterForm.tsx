"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "يرجى كتابة البريد الإلكتروني")
    .email("يرجى إدخال بريد إلكتروني صحيح"),
});

type FormValues = z.infer<typeof formSchema>;

interface NewsletterFormProps {
  placeholder?: string;
  buttonText?: string;
}

export function NewsletterForm({
  placeholder = "اكتب بريدك الإلكتروني",
  buttonText = "اشترك الآن",
}: NewsletterFormProps) {
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
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSuccess(true);
    toast.success("تم الاشتراك بنجاح! شكراً لانضمامك إلى نشرتنا الإخبارية.");
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="w-full max-w-md space-y-2 text-right">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "relative flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-[#1E73D8] dark:focus-within:ring-blue-500",
          errors.email && "border-red-400 focus-within:ring-red-400"
        )}
      >
        {/* Leading Mail Icon (Right side in RTL) */}
        <div className="pr-3 text-slate-400 dark:text-slate-500 shrink-0">
          <Mail className="h-5 w-5" />
        </div>

        {/* Input Text Field */}
        <input
          type="email"
          placeholder={placeholder}
          {...register("email")}
          disabled={isSubmitting}
          className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-[#0B2D5B] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-2 py-2"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        />

        {/* Action Button (Left side in RTL) */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#1E73D8] to-[#0B2D5B] hover:from-[#155ab3] hover:to-[#071f3f] text-white rounded-xl px-5 sm:px-6 h-11 font-bold text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shrink-0"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : isSuccess ? (
            <>
              <span>تم الاشتراك</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            </>
          ) : (
            <>
              <span>{buttonText}</span>
              <ArrowLeft className="h-4 w-4 text-white shrink-0" />
            </>
          )}
        </button>
      </form>

      {/* Validation Error Message */}
      {errors.email && (
        <p
          className="text-xs text-red-500 font-semibold pr-2 pt-0.5"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          {errors.email.message}
        </p>
      )}
    </div>
  );
}

export default NewsletterForm;
