"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Wallet,
  Building2,
  QrCode,
  FileText,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { FileUploader } from "@/components/common";
import { usePayment } from "@/hooks/usePayment";
import { useAuthContext } from "@/providers/auth-provider";
import api from "@/services/api";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "";

  const { user } = useAuthContext();
  const { validateCoupon, isValidatingCoupon, submitManualPayment, isSubmittingPayment } = usePayment();

  const [course, setCourse] = React.useState<any>(null);
  const [isLoadingCourse, setIsLoadingCourse] = React.useState(true);

  // Checkout State
  const [couponCode, setCouponCode] = React.useState("");
  const [discountAmount, setDiscountAmount] = React.useState(0);
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = React.useState<
    "Vodafone Cash" | "InstaPay" | "Fawry" | "Bank Transfer" | "Visa"
  >("Vodafone Cash");

  const [paymentReference, setPaymentReference] = React.useState("");
  const [receiptUrl, setReceiptUrl] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Fetch course details
  React.useEffect(() => {
    async function fetchCourse() {
      if (!courseId) {
        setIsLoadingCourse(false);
        return;
      }
      try {
        setIsLoadingCourse(true);
        const res = await api.get(`/courses/${courseId}`);
        setCourse(res.data?.data?.course || res.data?.data);
      } catch {
        toast.error("تعذر جلب تفاصيل الكورس المراد شراؤه");
      } fontFinally: {
        setIsLoadingCourse(false);
      }
    }
    fetchCourse();
  }, [courseId]);

  const originalPrice = course?.price || 500;
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await validateCoupon({ code: couponCode.trim(), amount: originalPrice });
      setDiscountAmount(res.discount);
      setAppliedCoupon(res.coupon.code);
    } catch {
      // toast error handled in hook
    }
  };

  const handleCompleteOrder = async () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول أولاً لإتمام الشراء");
      router.push("/login");
      return;
    }

    if ((paymentMethod === "Vodafone Cash" || paymentMethod === "InstaPay" || paymentMethod === "Bank Transfer") && !receiptUrl && !paymentReference) {
      toast.error("يرجى إدخال رقم العملية المرجعي أو رفع صورة الإيصال لتأكيد السداد 🧾");
      return;
    }

    try {
      await submitManualPayment({
        courseId: courseId || "default-course",
        paymentMethod,
        paymentReference: paymentReference || `REF-${Date.now()}`,
        receiptUrl,
        notes,
        couponCode: appliedCoupon || undefined,
      });

      setIsSuccess(true);
    } catch {
      // toast handled in hook
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen py-16 px-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-right dir-rtl">
        <div className="max-w-md w-full bg-white dark:bg-[#0F274D] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl space-y-6 text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-[#0B2D5B] dark:text-white">
              تم إرسال إيصال السداد بنجاح 🎉
            </h2>
            <p className="text-xs text-slate-500">
              سيتم مراجعة إيصالك وتفعيل الكورس في حسابك خلال دقائق معدودة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-right space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">طريقة الدفع:</span>
              <strong className="text-[#F58220]">{paymentMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">إجمالي المبلغ:</span>
              <strong className="text-emerald-500 font-mono">{finalPrice} ج.م</strong>
            </div>
          </div>

          <Link
            href="/dashboard/courses"
            className="w-full h-12 rounded-2xl bg-[#0B2D5B] text-white text-xs font-bold flex items-center justify-center gap-2"
          >
            <span>الانتقال لكورساتي بالداشبورد</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-right dir-rtl transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#F58220]/10 text-[#F58220] px-4 py-1.5 rounded-full text-xs font-black">
            <ShieldCheck className="h-4 w-4" />
            <span>صفحة الدفع المشفرة والآمنة 100%</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B2D5B] dark:text-white">
            تأكيد الشراء واشتراك الكورس 🛒
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Payment Section (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Select Payment Method */}
            <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#F58220]" />
                <span>اختر طريقة الدفع المناسبة</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: "Vodafone Cash" as const, title: "فودافون كاش", icon: Wallet, desc: "010XXXXXXXX" },
                  { id: "InstaPay" as const, title: "InstaPay", icon: QrCode, desc: "تحويل مباشر" },
                  { id: "Bank Transfer" as const, title: "تحويل بنكي", icon: Building2, desc: "حساب CIB" },
                  { id: "Fawry" as const, title: "فوري Fawry", icon: FileText, desc: "كود دفع" },
                  { id: "Visa" as const, title: "فيزا / ميزة", icon: CreditCard, desc: "بطاقات ائتمان" },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id)}
                      className={`p-4 rounded-2xl border transition-all text-right space-y-1.5 cursor-pointer ${
                        isSelected
                          ? "border-[#F58220] bg-[#F58220]/5 shadow-md"
                          : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:border-slate-300"
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${isSelected ? "text-[#F58220]" : "text-slate-400"}`} />
                      <div className="text-xs font-black text-[#0B2D5B] dark:text-white block">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{item.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Method Details */}
              {paymentMethod === "Vodafone Cash" && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <span className="font-extrabold block">رقم محفظة فودافون كاش المعتمد:</span>
                  <span className="font-mono text-base font-black text-[#F58220] block">01099887766</span>
                  <p className="text-[11px]">قم بتحويل المبلغ لرقم المحفظة أعلاه ثم أرفق صورة الإيصال أدناه.</p>
                </div>
              )}

              {paymentMethod === "InstaPay" && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-800 dark:text-purple-300 space-y-1">
                  <span className="font-extrabold block">عنوان InstaPay المعتمد:</span>
                  <span className="font-mono text-base font-black text-purple-600 dark:text-purple-400 block">edusphere@instapay</span>
                </div>
              )}
            </div>

            {/* Step 2: Upload Receipt / Reference ID */}
            <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                تأكيد العملية المباشرة 🧾
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">رقم التحويل المرجعي / الرقم القومي</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="مثال: REF-99882200..."
                  className="w-full h-11 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
              </div>

              {/* Unified File Uploader */}
              <FileUploader
                label="رفع صورة إيصال التحويل (اختياري / مؤكد)"
                helperText="اسحب إيصال الدفع هنا أو اضغط للاختيار"
                category="image"
                maxSizeMB={10}
                value={receiptUrl}
                onChange={(url) => setReceiptUrl(url)}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي ملاحظات تود إضافتها لفريق المراجعة..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold outline-none focus:border-[#F58220]"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmittingPayment}
              onClick={handleCompleteOrder}
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              <span>{isSubmittingPayment ? "جاري تأكيد الاشتراك..." : `إتمام الشراء الآن (${finalPrice} ج.م)`}</span>
            </button>
          </div>

          {/* Order Summary & Coupon (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#0F274D] p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
              <h3 className="text-base font-black text-[#0B2D5B] dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#F58220]" />
                <span>ملخص الطلب والكورس</span>
              </h3>

              {/* Course Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-2">
                <h4 className="text-sm font-extrabold text-[#0B2D5B] dark:text-white">
                  {course?.title || "كورس أساسيات علوم الحاسب والبرمجة"}
                </h4>
                <p className="text-xs text-slate-500">وصول كامل لجميع الدروس والكويزات والشهادة المعتمدة.</p>
              </div>

              {/* Coupon Input Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <Tag className="h-4 w-4 text-[#F58220]" />
                  <span>كوبون الخصم</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="رمز الكوبون..."
                    className="flex-1 h-11 px-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold uppercase outline-none focus:border-[#F58220]"
                  />
                  <button
                    type="submit"
                    disabled={isValidatingCoupon}
                    className="px-4 h-11 rounded-2xl bg-[#0B2D5B] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    تطبيق
                  </button>
                </div>
              </form>

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>سعر الكورس الأصلي:</span>
                  <span>{originalPrice} ج.م</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>قيمة الخصم:</span>
                    <span>-{discountAmount} ج.م</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-[#0B2D5B] dark:text-white pt-2 border-t border-slate-100 dark:border-white/10">
                  <span>المبلغ الإجمالي المباشر:</span>
                  <span className="text-[#F58220] font-mono text-base">{finalPrice} ج.م</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
