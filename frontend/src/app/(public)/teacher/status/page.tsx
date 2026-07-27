"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
  Mail,
  CreditCard,
  Phone,
  BookOpen,
  Calendar,
  AlertTriangle,
  User,
  LogIn,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import teacherService, { ApiTeacherApplication } from "@/services/teacher.service";

export default function TeacherStatusPage() {
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<ApiTeacherApplication | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query || !query.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني أو الرقم القومي أو رقم الهاتف");
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);
      const app = await teacherService.checkStatusByQuery(query.trim());
      setResult(app);
      toast.success("تم العثور على بيانات الطلب بنجاح");
    } catch (err: any) {
      setResult(null);
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "لم يتم العثور على أي طلب مسجل بهذه البيانات";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: ApiTeacherApplication["status"]) => {
    switch (status) {
      case "Approved":
        return {
          bg: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
          title: "مقبول 🎉",
          desc: "تهانينا! تم اعتماد طلب انضمامك كمعلم في EduSphere.",
        };
      case "Rejected":
        return {
          bg: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
          icon: <XCircle className="h-6 w-6 text-rose-500" />,
          title: "مقتصر / لم يتم القبول ❌",
          desc: "للأسف لم يستوف الطلب جميع الشروط والمعايير المطلوبة في الوقت الحالي.",
        };
      case "UnderReview":
        return {
          bg: "bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30",
          icon: <Eye className="h-6 w-6 text-sky-500 animate-pulse" />,
          title: "قيد الدراسة والتقييم 🔍",
          desc: "طلبك يتلقى فحصاً تفصيلياً من قِبل اللجنة التعليمية لمنصة EduSphere.",
        };
      case "Pending":
      default:
        return {
          bg: "bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
          icon: <Clock className="h-6 w-6 text-amber-500 animate-spin-slow" />,
          title: "قيد المراجعة الأولية ⏳",
          desc: "تم استلام الطلب وبانتظار المراجعة الفنية من فريق الإدارة.",
        };
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-right transition-colors"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#0B2D5B]/10 dark:bg-white/10 text-[#0B2D5B] dark:text-white px-4 py-1.5 rounded-full text-xs font-black border border-[#0B2D5B]/20 dark:border-white/20">
            <ShieldCheck className="h-4 w-4 text-[#F58220]" />
            <span>نظام الاستعلام المباشر عن الطلبات</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#0B2D5B] dark:text-white tracking-tight">
            الاستعلام عن حالة طلب الانضمام كمعلم 🔎
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            أدخل البريد الإلكتروني أو الرقم القومي أو رقم الهاتف الذي استخدمته عند تقديم الطلب لمتابعة حالة المراجعة مباشرة.
          </p>
        </div>

        {/* Search Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
              البريد الإلكتروني / الرقم القومي / رقم الهاتف *
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="أدخل البريد الإلكتروني أو الرقم القومي (14 رقم) أو الهاتف..."
                className="w-full h-14 pr-12 pl-36 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold outline-none focus:border-[#F58220] transition-colors"
              />
              <Search className="h-5 w-5 text-slate-400 absolute right-4 pointer-events-none" />

              <button
                type="submit"
                disabled={isLoading}
                className="absolute left-2 h-10 px-5 rounded-xl bg-gradient-to-r from-[#F58220] to-[#FF9A2A] text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>جاري البحث...</span>
                  </>
                ) : (
                  <>
                    <span>استعلام الآن</span>
                    <Search className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/10 gap-2">
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-[#F58220]" />
              يمكنك البحث بالبريد المسجل
            </span>
            <span className="flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-[#F58220]" />
              أو بواسطة الرقم القومي
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-[#F58220]" />
              أو رقم الواتساب
            </span>
          </div>
        </motion.div>

        {/* Results Presentation Section */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-3"
            >
              <div className="h-12 w-12 rounded-full border-4 border-[#F58220] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                جاري البحث عن بيانات الطلب في قاعدة البيانات...
              </p>
            </motion.div>
          )}

          {!isLoading && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0F274D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6"
            >
              {/* Status Header Badge */}
              {(() => {
                const badge = getStatusBadge(result.status);
                return (
                  <div
                    className={`p-5 rounded-2xl border flex items-start gap-4 ${badge.bg}`}
                  >
                    <div className="mt-0.5">{badge.icon}</div>
                    <div className="space-y-1">
                      <div className="text-base font-black flex items-center gap-2">
                        <span>حالة الطلب: {badge.title}</span>
                      </div>
                      <p className="text-xs font-medium leading-relaxed opacity-90">
                        {badge.desc}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Application Details Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold block">
                    مقدم الطلب
                  </span>
                  <span className="font-extrabold text-[#0B2D5B] dark:text-white text-sm flex items-center gap-1.5">
                    <User className="h-4 w-4 text-[#F58220]" />
                    {result.fullName}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold block">
                    المادة والمرحلة التعليمية
                  </span>
                  <span className="font-extrabold text-[#F58220] text-sm flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {result.subject} - {result.stage}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold block">
                    البريد الإلكتروني المسجل
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {result.email}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 space-y-1">
                  <span className="text-slate-400 text-[11px] font-bold block">
                    تاريخ التقديم
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(result.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Rejection Reason Callout if Rejected */}
              {result.status === "Rejected" && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-800 dark:text-rose-200 space-y-2">
                  <div className="font-black flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>سبب عدم القبول الموضح من الإدارة:</span>
                  </div>
                  <p className="font-semibold leading-relaxed bg-white/60 dark:bg-black/20 p-3 rounded-xl">
                    {result.rejectionReason || "لم يتم استيفاء المستندات أو الشروط الأكاديمية المطلوبة."}
                  </p>
                </div>
              )}

              {/* Dynamic Actions based on Status */}
              <div className="pt-2">
                {result.status === "Approved" ? (
                  <Link
                    href="/login"
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-opacity"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>تسجيل الدخول إلى حساب المعلم والانتقال للوحة التحكم</span>
                  </Link>
                ) : result.status === "Rejected" ? (
                  <Link
                    href="/teacher/apply"
                    className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white/10 text-white text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                  >
                    <span>تقديم طلب انضمام جديد بمستندات محدثة</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                    💡 سيتم إرسال إشعار فور تغير حالة طلبك إلى بريدك الإلكتروني المسجل.
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {!isLoading && hasSearched && !result && (
            <motion.div
              key="notfound"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center bg-white dark:bg-[#0F274D] rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg space-y-4"
            >
              <div className="h-16 w-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-[#0B2D5B] dark:text-white">
                  لم يتم العثور على أي طلب مسجل
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                  تأكد من كتابة البريد الإلكتروني أو الرقم القومي بالشكل الصحيح، أو قم بالتقديم الآن إذا لم تكن قد قدمت طلبك بعد.
                </p>
              </div>

              <Link
                href="/teacher/apply"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B2D5B] text-white text-xs font-bold shadow-md hover:bg-[#1E73D8] transition-colors"
              >
                <span>تقديم طلب انضمام كمعلم الآن</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/teacher/apply"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#F58220] hover:underline"
          >
            <span>الذهاب لصفحة تقديم طلب انضمام كمعلم جديد</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
